import express, { Router } from 'express';
import user from '../models/user';

const useractionsController: Router = express.Router();

useractionsController.get('/status', async (_, res) => {
  res.status(200).json({ status: 'success', version: '1.0.0' });
});

//get all members
useractionsController.get('/list', async (_, res) => {
  try {
    const userList = await user.listAllUsers();
    res.status(200).json(userList);
  } catch (err) {
    console.error(err);
  }
});

//get user by ID
useractionsController.get('/list/:id', async (req, res) => {
  const userIdResult = decodeURIComponent(req.params.id);
  const userId = parseInt(userIdResult);
  try {
    const userList = await user.listById(userId);
    res.status(200).json(userList);
  } catch (err) {
    if (err.message.includes('Invalid ID')) {
      return res.status(400).json({ Error: 'Invalid ID' });
    }
    res.sendStatus(500);
  }
});

//get user by GPDA role
useractionsController.get('/role/:role', async (req, res) => {
  const userRole = decodeURIComponent(req.params.role) as string;
  try {
    const userList = await user.listByRole(userRole);
    res.status(200).json(userList);
  } catch (err) {
    res.sendStatus(500);
  }
});

//sign in user
useractionsController.post('/sign', async (req, res) => {
  const userinfo = req.body;
  try {
    const member = await user.signUser(userinfo);
    res.status(201).json({
      message: 'User created',
      user_signed: member,
    });
  } catch (err) {
    if (err.message.includes('This username has already been taken')) {
      return res.status(400).json({ Error: 'Username already taken' });
    }
    if (err.message.includes('Email already being used')) {
      return res.status(400).json({ Error: 'Email already being used' });
    }
    res.sendStatus(500);
  }
});

//delete user by id
useractionsController.delete('/delete', async (req, res) => {
  const userIdResult = decodeURIComponent(req.query.id as string);
  const userId = parseInt(userIdResult);
  try {
    const deletedUser = await user.deleteUserById(userId);
    res.json({
      deleted_user: deletedUser,
    });
  } catch (err) {
    console.error(err.message);
    if (err.message.includes('Invalid or missing ID')) {
      return res.status(400).json({ Error: 'Invalid or missing ID' });
    }
    res.sendStatus(500);
  }
});

//update user by id
useractionsController.put('/update', async (req, res) => {
  try {
    const userinfo = req.body;
    const response = await user.updateUser(userinfo);
    res.json({
      User: {
        username: { old: response.oldUsername, new: response.username },
        email: { old: response.oldEmail, new: response.email },
        name: { old: response.oldName, new: response.name },
        role: { old: response.oldRole, new: response.role },
      },
    });
  } catch (err) {
    console.error(err);
    if (err.message.includes('Invalid ID')) {
      return res.status(400).json({ Error: 'Invalid ID' });
    }
    if (err.message.includes('This username has already been taken')) {
      return res.status(400).json({ Error: 'Username already taken' });
    }
    if (
      err.message.includes(
        'It is required at least 1 modification to update user'
      )
    ) {
      return res
        .status(400)
        .json({ Error: 'Add at least 1 modification to user' });
    }
    res.sendStatus(500);
  }
});

useractionsController.all('*', (_, res) => {
  res.sendStatus(404);
});

export default useractionsController;
