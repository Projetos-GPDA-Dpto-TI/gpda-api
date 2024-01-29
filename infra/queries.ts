import { Response } from 'express';
import query from './database';

async function updateUser(
  id: Number,
  username: string,
  email: string,
  name: string,
  role: string
) {
  await query({
    text: 'UPDATE member SET username=$1, email=$2, name=$3, role=$4 WHERE id=$5;',
    values: [username, email, name, role, String(id)],
  });
}

async function signUser(
  username: string,
  email: string,
  name: string,
  role: string
) {
  await query({
    text: 'INSERT INTO member (username, email, name, role) VALUES ($1, $2, $3, $4);',
    values: [username, email, name, role],
  });
}

async function deleleteUser(userId: number) {
  await query({
    text: 'DELETE FROM member WHERE id=$1;',
    values: [String(userId)],
  });
}

async function listAllUsers() {
  await query('SELECT * FROM member;');
}

async function isvalidId(response: Response, id: number) {
  if (!id || isNaN(id)) {
    response.status(400).json({ error: 'Invalid or missing ID' });
    return;
  }
}

//remember to replace raw SQL to this functions in controllers
//remember to update 'email' and 'id' (uuid) type properly

export default { updateUser, signUser, deleleteUser, listAllUsers, isvalidId };
