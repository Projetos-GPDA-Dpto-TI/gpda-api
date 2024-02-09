import database from '../../infra/database';

interface user {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
}

async function listAllUsers(): Promise<user[]> {
  const response = await database.query('SELECT * FROM member;');
  const userList = response.rows;
  return userList;
}

async function listById(id: number): Promise<user> {
  validateId(id);
  const response = await database.query({
    text: 'SELECT id, username, email, name, role FROM member WHERE id=$1;',
    values: [String(id)],
  });
  const userList = response.rows[0];
  return userList;
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
}

async function deleteUserById(id: number): Promise<user> {
  validateId(id);
  const response = await database.query({
    text: 'DELETE FROM member WHERE id=$1 RETURN id, username, email, name, role;',
    values: [String(id)],
  });
  if (response.rowCount === 0) {
    throw new Error('Invalid ID');
  }
  const userinfo = response.rows[0];
  return userinfo;
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
  if (!id || isNaN(id)) {
    throw new Error('Invalid or missing ID');
  }
}

//TODO: assign the updates (old data -> new data) to a new table in db
async function updateUser(user: user): Promise<user> {
  validateId(user.id);

  if (user.username) {
    try {
      await validateUniqueUsername(user.username);
    } catch (error) {
      console.error(error);
    }
  }

  let { username, email, name, role } = user;

  if (
    user.username === undefined ||
    user.email === undefined ||
    user.name === undefined ||
    user.role === undefined
  ) {
    const userinfo = await listById(user.id);

    username = user.username === undefined ? userinfo.username : user.username;
    email = user.email === undefined ? userinfo.email : user.email;
    name = user.name === undefined ? userinfo.name : user.name;
    role = user.role === undefined ? userinfo.role : user.role;
  }

  const result = await database.query({
    text: 'UPDATE member SET username=$1, email=$2, name=$3, role=$4 WHERE id=$5;',
    values: [username, email, name, role, String(user.id)],
  });

  if (result.rowCount === 0) {
    throw new Error('Invalid ID');
  }

  return { id: user.id, username, email, name, role };
}

export default Object.freeze({
  listAllUsers,
  listById,
  listByRole,
  signUser,
  deleteUserById,
  updateUser,
});
