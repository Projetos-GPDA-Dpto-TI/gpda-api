import database from '../../infra/database';

interface user {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
}

async function listAllUsers() {
  const response = await database.query('SELECT * FROM member;');
  return response;
}

async function listById(id: number) {
  validateId(id);
  const response = await database.query({
    text: 'SELECT id, username, email, name, role FROM member WHERE id=$1;',
    values: [String(id)],
  });
  return response;
}

async function listByRole(userRole: string) {
  //TODO: make function to check if it is a valid role
  const response = await database.query({
    text: 'SELECT id, username, email, name, role FROM member WHERE role=$1;',
    values: [userRole],
  });
  return response;
}

async function signUser(user: user) {
  await validateUniqueUsername(user.username);

  const response = await database.query({
    text: 'INSERT INTO member (username, email, name, role) VALUES ($1, $2, $3, $4) RETURNING id;',
    values: [user.username, user.email, user.name, user.role],
  });
  const userId = response.rows[0].id;
  return userId;
}

async function deleteUserById(id: number) {
  validateId(id);
  const response = await database.query({
    text: 'DELETE FROM member WHERE id=$1 RETURN id, username, email, name, role;',
    values: [String(id)],
  });
  if (response.rowCount === 0) {
    throw new Error('Invalid ID');
  }

  return response;
}

async function validateUniqueUsername(username: string) {
  const query = {
    text: 'SELECT username FROM users WHERE LOWER(username) = LOWER($1)',
    values: [username],
  };

  const response = await database.query(query);

  if (response.rowCount > 0) {
    throw new Error('This username has already been taken');
  }
}

function validateId(id: number) {
  if (!id || isNaN(id)) {
    throw new Error('Invalid or missing ID');
  }
}

//TODO: assign the updates (old data -> new data) to a new table in db
async function updateUser(user: user) {
  validateId(user.id);

  let { username, email, name, role } = user;

  if (
    user.username === undefined ||
    user.email === undefined ||
    user.name === undefined ||
    user.role === undefined
  ) {
    const dbUserDataResult = await listById(user.id);
    const dbUserData = dbUserDataResult.rows[0];

    username =
      user.username === undefined ? dbUserData.username : user.username;
    email = user.email === undefined ? dbUserData.email : user.email;
    name = user.name === undefined ? dbUserData.name : user.name;
    role = user.role === undefined ? dbUserData.role : user.role;
  }

  const result = await database.query({
    text: 'UPDATE member SET username=$1, email=$2, name=$3, role=$4 WHERE id=$5;',
    values: [username, email, name, role, String(user.id)],
  });

  if (result.rowCount === 0) {
    throw new Error('Invalid ID');
  }

  return { username, email, name, role };
}

export default Object.freeze({
  listAllUsers,
  listById,
  listByRole,
  signUser,
  deleteUserById,
  updateUser,
});
