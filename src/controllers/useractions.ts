import express, { Router } from 'express';
import user from '../models/user';

const useractionsController: Router = express.Router();

useractionsController.get('/status', async (_, res) => {
  res.status(200).json({ status: 'success', version: '1.0.0' });
});

//get all members
useractionsController.get('/list', async (_, res) => {
  const response = await user.listAllUsers();
  const userList = response.rows;
  res.status(200).json(userList);
});

//get user by ID
useractionsController.get('/list/byid', async (req, res) => {
  const userIdResult = req.query.id;
  const userId = Number(userIdResult);

  const response = await user.listById(userId);
  const userList = response.rows;
  res.status(200).json(userList);
});

//get user by GPDA role
useractionsController.get('/list/byrole', async (req, res) => {
  const userRoleResult = req.query.role;
  const userRole = String(userRoleResult);

  const response = await user.listByRole(userRole);
  const userList = response.rows;
  res.status(200).json(userList);
});

//sign in user
useractionsController.post('/sign', async (req, res) => {
  try {
    const userinfo = req.body;
    const userId = await user.signUser(userinfo);

    const member = {
      id: userId,
      username: userinfo.username,
      email: userinfo.email,
      name: userinfo.name,
      role: userinfo.role,
    };

    res.status(201).json({
      message: 'User created',
      user_signed: member,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

//delete user by id
useractionsController.delete('/delete', async (req, res) => {
  const userIdResult = req.query.id;
  const userId = Number(userIdResult);
  try {
    const response = await user.deleteUserById(userId);
    const deletedUser = response.rows[0];
    res.json({
      deleted_user: deletedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

useractionsController.put('/update', async (req, res) => {
  try {
    const userinfo = req.body;
    const response = await user.updateUser(userinfo);
    res.json({
      User: {
        username: { old: userinfo.username, new: response.username },
        email: { old: userinfo.email, new: response.email },
        name: { old: userinfo.name, new: response.name },
        role: { old: userinfo.id, new: response.role },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

export default useractionsController;
