import database from '../../infra/database';

interface user {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
}

interface update_user {
  id: number;
  username?: string;
  email?: string;
  name?: string;
  role?: string;
}

async function listAllUsers(): Promise<user[]> {
  const response = await database.query('SELECT * FROM member;');
  const userList = response.rows;
  //usar o [0]?
  return userList;
}

async function listById(id: number): Promise<user> {
  validateId(id);
  const response = await database.query({
    text: 'SELECT id, username, email, name, role FROM member WHERE id=$1;',
    values: [String(id)],
  });
  const userInfo = response.rows[0];
  return userInfo;
}

async function listByRole(userRole: string): Promise<user[]> {
  //TODO: make function to check if it is a valid role
  const response = await database.query({
    text: 'SELECT id, username, email, name, role FROM member WHERE role=$1;',
    values: [userRole],
  });
  const userList = response.rows;
  return userList;
}

async function signUser(user: user): Promise<user> {
  try {
    await validateUniqueUsername(user.username);
    const response = await database.query({
      text: 'INSERT INTO member (username, email, name, role) VALUES ($1, $2, $3, $4) RETURNING id;',
      values: [user.username, user.email, user.name, user.role],
    });

    const userId = response.rows[0].id;

    const member = {
      id: userId,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    return member;
  } catch (err) {
    throw err;
  }
}

async function deleteUserById(id: number): Promise<user> {
  try {
    validateId(id);
    const response = await database.query({
      text: 'DELETE FROM member WHERE id=$1 RETURNING id, username, email, name, role;',
      values: [String(id)],
    });
    if (response.rowCount === 0) {
      throw new Error('Invalid ID');
    }
    const userinfo = response.rows[0];
    return userinfo;
  } catch (err) {
    throw err;
  }
}

async function validateUniqueUsername(username: string): Promise<void> {
  const query = {
    text: 'SELECT username FROM member WHERE LOWER(username) = LOWER($1)',
    values: [username],
  };

  const response = await database.query(query);

  if (response.rowCount > 0) {
    throw new Error('This username has already been taken');
  }
}

function validateId(id: number): void {
  const parsedId = Number(id);
  if (!id || isNaN(parsedId)) {
    throw new Error('Invalid or missing ID');
  }
}

function validateUpdate(user: update_user) {
  if (!user.username && !user.email && !user.name && !user.role) {
    throw new Error('It is required at least 1 modification to update user');
  }
}

//TODO: assign the updates (old data -> new data) to a new table in db
async function updateUser(user: update_user): Promise<any> {
  try {
    validateId(user.id);
    validateUpdate(user);
    if (user.username !== undefined) {
      await validateUniqueUsername(user.username);
    }

    let updatedUsername, updatedEmail, updatedName, updatedRole;
    let oldUserinfo;

    if (
      user.username === undefined ||
      user.email === undefined ||
      user.name === undefined ||
      user.role === undefined
    ) {
      oldUserinfo = await listById(user.id);

      updatedUsername =
        user.username === undefined ? oldUserinfo.username : user.username;
      updatedEmail = user.email === undefined ? oldUserinfo.email : user.email;
      updatedName = user.name === undefined ? oldUserinfo.name : user.name;
      updatedRole = user.role === undefined ? oldUserinfo.role : user.role;
    }

    const result = await database.query({
      text: 'UPDATE member SET username=$1, email=$2, name=$3, role=$4 WHERE id=$5;',
      values: [
        updatedUsername,
        updatedEmail,
        updatedName,
        updatedRole,
        String(user.id),
      ],
    });

    if (result.rowCount === 0) {
      throw new Error('Invalid ID');
    }

    return {
      id: user.id,
      username: updatedUsername,
      email: updatedEmail,
      name: updatedName,
      role: updatedRole,
      oldUsername: oldUserinfo.username,
      oldEmail: oldUserinfo.email,
      oldName: oldUserinfo.name,
      oldRole: oldUserinfo.role,
    };
  } catch (err) {
    throw err;
  }
}

export default Object.freeze({
  listAllUsers,
  listById,
  listByRole,
  signUser,
  deleteUserById,
  updateUser,
});
