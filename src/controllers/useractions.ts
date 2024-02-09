import express, { Router } from 'express';
import user from '../models/user';

const useractionsController: Router = express.Router();

useractionsController.get('/status', async (_, res) => {
  res.status(200).json({ status: 'success', version: '1.0.0' });
});

//get all members
useractionsController.get('/list', async (_, res) => {
  const userList = await user.listAllUsers();
  res.status(200).json(userList);
});

//get user by ID
useractionsController.get('/list/byid', async (req, res) => {
  const userIdResult = req.query.id;
  const userId = Number(userIdResult);

  const userList = await user.listById(userId);
  res.status(200).json(userList);
});

//get user by GPDA role
useractionsController.get('/list/byrole', async (req, res) => {
  const userRoleResult = req.query.role;
  const userRole = String(userRoleResult);

  const userList = await user.listByRole(userRole);
  res.status(200).json(userList);
});

//sign in user
useractionsController.post('/sign', async (req, res) => {
  const userinfo = req.body;
  const member = await user.signUser(userinfo);

  res.status(201).json({
    message: 'User created',
    user_signed: member,
  });
});

//delete user by id
useractionsController.delete('/delete', async (req, res) => {
  const userIdResult = req.query.id;
  const userId = Number(userIdResult);
  try {
    const deletedUser = await user.deleteUserById(userId);
    res.json({
      deleted_user: deletedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

//update user by id
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
