import express, { Request, Response, Router } from 'express';
import query from '../utils/queries';
import * as database from '../../infra/database';

const userController: Router = express.Router();

userController.get(
  '/status',
  async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({ status: 'success', version: '1.0.0' });
  }
);

//get all members
userController.get(
  '/list',
  async (_req: Request, res: Response): Promise<void> => {
    const response = await query.listAllUsers();
    res.status(200).json(response.rows);
  }
);

//get user by ID
userController.get(
  '/list/byid',
  async (req: Request, res: Response): Promise<void> => {
    const userIdResult = req.query.id;
    const parsedUserIdResult = Number(userIdResult);
    const userId = String(userIdResult);

    if (!userIdResult || isNaN(parsedUserIdResult)) {
      res.status(400).json({ error: 'Invalid or missing ID' });
      return;
    }

    const response = await query.listById(userId);
    res.status(200).json(response.rows);
  }
);

//get user by GPDA role
userController.get(
  '/list/byrole',
  async (req: Request, res: Response): Promise<void> => {
    const userRoleResult = req.query.role;
    const userRole = String(userRoleResult);

    //remember to make function to check if it is a valid role
    const response = await query.listByRole(userRole);
    res.status(200).json(response.rows);
  }
);

userController.post(
  '/sign',
  async (req: Request, res: Response): Promise<void> => {
    const { username, email, name, role } = req.body;
    try {
      await query.signUser(username, email, name, role);

      const dbUserIdResponse = await database.query({
        text: 'SELECT id FROM member WHERE username=$1;',
        values: [username],
      });
      const dbUserId = dbUserIdResponse.rows[0].id;

      res.status(201).json({
        message: 'member signed to db',
        member: { dbUserId, username, email, name, role },
      });
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
);

userController.delete(
  '/delete',
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.id;
    const parsedUserId = Number(userId);
    if (!userId || isNaN(Number(userId))) {
      res.status(400).json({ error: 'Invalid or missing ID' });
      return;
    }
    try {
      const response = query.deleleteUser(parsedUserId);
      res.send(response);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
);

interface Member {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
}

//remember to assign the updates (old data -> new data) to a new table in db
userController.put(
  '/update',
  async (req: Request, res: Response): Promise<void> => {
    let { id, username, email, name, role }: Member = req.body;

    //checks if id is defined and a number
    if (!id || isNaN(id)) {
      res.status(400).json({ error: 'Invalid or missing ID' });
      return;
    }
    const userId = String(id);

    //checks what data is not given in req.body and replace with the actual data in db
    if (
      username === undefined ||
      email === undefined ||
      name === undefined ||
      role === undefined
    ) {
      const dbUserDataResult = await query.listById(userId);
      var dbUserData = dbUserDataResult.rows[0];

      username = username === undefined ? dbUserData.username : username;
      email = email === undefined ? dbUserData.email : email;
      name = name === undefined ? dbUserData.name : name;
      role = role === undefined ? dbUserData.role : role;
    }

    //starts to update member with the given data
    try {
      await query.updateUser(id, username, email, name, role);
      res.json({
        username: { old_username: dbUserData.username, new_username: username },
        email: { old_email: dbUserData.email, new_email: email },
        name: { old_name: dbUserData.name, new_name: name },
        role: { old_role: dbUserData.role, new_role: role },
      });
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
);

export default userController;
