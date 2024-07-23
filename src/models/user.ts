import database from '../../infra/database';
import crypto, { UUID, randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

interface user {
  id: number;
  username: string;
  email: string;
  password: string;
  name: string;
  role: string;
}

interface update_user {
  id: number;
  username?: string;
  email?: string;
  name?: string;
  role?: string;
  password?: string;
}

async function listAllUsers(): Promise<user[]> {
  const response = await database.query(
    'SELECT id, username, email, name, role, image_url, created_at, updated_at FROM member;'
  );
  const userList = response.rows;
  return userList;
}

async function listById(id: UUID): Promise<user> {
  validateId(id);
  const response = await database.query({
    text: 'SELECT id, username, email, name, role FROM member WHERE id=$1;',
    values: [String(id)],
  });
  const userInfo = response.rows[0];
  return userInfo;
}

async function listByRole(userRole: string): Promise<user[]> {
  const response = await database.query({
    text: 'SELECT id, username, email, name, role FROM member WHERE role=$1;',
    values: [userRole],
  });
  const userList = response.rows;
  return userList;
}

async function signUser(user: user): Promise<user> {
  const id = crypto.randomUUID();
  const hashedPassword = await bcrypt.hash(user.password, 10);

  const response = await database.query({
    text: 'INSERT INTO member (username, email, password_hash, name, role, id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, name, role, created_at, image_url, updated_at;',
    values: [
      user.username,
      user.email,
      hashedPassword,
      user.name,
      user.role,
      id,
    ],
  });

  const userinfo = response.rows[0];
  return userinfo;
}

async function deleteUserById(id: UUID): Promise<user> {
  validateId(id);
  const response = await database.query({
    text: 'DELETE FROM member WHERE id=$1 RETURNING id, username, email, name, role, image_url, created_at, updated_at;',
    values: [String(id)],
  });
  if (response.rowCount === 0) {
    throw new Error('Invalid or missing ID');
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

async function validateUniqueEmail(email: string): Promise<void> {
  const query = {
    text: 'SELECT email FROM member WHERE LOWER(email) = LOWER($1)',
    values: [email],
  };

  const response = await database.query(query);

  if (response.rowCount > 0) {
    throw new Error('Email already being used');
  }
}

function validateId(id: UUID): void {
  if (!id) {
    throw new Error('Invalid or missing ID');
  }
}

function validateUpdate(user: update_user): void {
  if (
    !user.username &&
    !user.email &&
    !user.name &&
    !user.role &&
    !user.password
  ) {
    throw new Error('It is required at least 1 modification to update user');
  }
}

//TODO: assign the updates (old data -> new data) to a new table in db
async function updateUser(user: update_user | any): Promise<any> {
  validateId(user.id);
  validateUpdate(user);
  if (user.username) await validateUniqueUsername(user.username);
  if (user.email) await validateUniqueEmail(user.email);

  let updatedUsername, updatedEmail, updatedName, updatedRole, updatedPassword;
  let oldUserinfo;

  if (
    user.username === undefined ||
    user.email === undefined ||
    user.name === undefined ||
    user.role === undefined ||
    user.password === undefined
  ) {
    oldUserinfo = await listById(user.id);

    updatedUsername =
      user.username === undefined ? oldUserinfo.username : user.username;
    updatedEmail = user.email === undefined ? oldUserinfo.email : user.email;
    updatedName = user.name === undefined ? oldUserinfo.name : user.name;
    updatedRole = user.role === undefined ? oldUserinfo.role : user.role;
    updatedPassword =
      user.password === undefined ? oldUserinfo.password : user.password;
  }

  try {
    const updatedAt = new Date().toISOString();
    await database.query({
      text: 'UPDATE member SET username=$1, email=$2, name=$3, role=$4, updated_at=$6, password_hash=$7 WHERE id=$5;',
      values: [
        updatedUsername,
        updatedEmail,
        updatedName,
        updatedRole,
        String(user.id),
        updatedAt,
        updatedPassword,
      ],
    });
  } catch (err) {
    if (err) throw new Error('Internal Server Error');
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
}

export default Object.freeze({
  listAllUsers,
  listById,
  listByRole,
  signUser,
  deleteUserById,
  updateUser,
  validateUniqueUsername,
  validateUniqueEmail,
  validateUpdate,
});
