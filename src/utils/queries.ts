import * as database from '../../infra/database';

async function updateUser(
  id: number,
  username: string,
  email: string,
  name: string,
  role: string
) {
  const response = await database.query({
    text: 'UPDATE member SET username=$1, email=$2, name=$3, role=$4 WHERE id=$5;',
    values: [username, email, name, role, String(id)],
  });
  return response;
}

async function signUser(
  username: string,
  email: string,
  name: string,
  role: string
) {
  const response = await database.query({
    text: 'INSERT INTO member (username, email, name, role) VALUES ($1, $2, $3, $4);',
    values: [username, email, name, role],
  });
  return response;
}

async function deleleteUser(userId: number) {
  const response = await database.query({
    text: 'DELETE FROM member WHERE id=$1;',
    values: [String(userId)],
  });
  return response;
}

async function listAllUsers() {
  const response = await database.query('SELECT * FROM member;');
  return response;
}

async function listById(id: string) {
  const response = await database.query({
    text: 'SELECT id, username, email, name, role FROM member WHERE id=$1;',
    values: [id],
  });
  return response;
}

async function listByRole(userRole: string) {
  const response = await database.query({
    text: 'SELECT id, username, email, name, role FROM member WHERE role=$1;',
    values: [userRole],
  });
  return response;
}

//remember to replace raw SQL to this functions in controllers
//remember to update 'email' and 'id' (uuid) type properly

export default {
  updateUser,
  signUser,
  deleleteUser,
  listAllUsers,
  listById,
  listByRole,
};
