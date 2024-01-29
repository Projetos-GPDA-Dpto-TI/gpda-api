import express, { Request, Response, Router } from 'express';
import query from '../../infra/database';
import '../../infra/queries';

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
    const response = await query('SELECT * FROM member;');
    res.status(200).json(response.rows);
  }
);

//get user by ID
userController.get(
  '/list/byid',
  async (req: Request, res: Response): Promise<void> => {
    const userIdResult = req.query.id;
    const parsedUserIdResult = Number(userIdResult);
    if (!userIdResult || isNaN(parsedUserIdResult)) {
      res.status(400).json({ error: 'Invalid or missing ID' });
      return;
    }
    const userId = String(userIdResult);

    const response = await query({
      text: 'SELECT id, username, email, name, role FROM member WHERE id=$1;',
      values: [userId],
    });
    res.status(200).json(response.rows);
  }
);

//get user by GPDA role
userController.get(
  '/list/byrole',
  async (req: Request, res: Response): Promise<void> => {
    const userRole = req.query.role;

    //remember to make function to check if it is a valid role

    const response = await query({
      text: 'SELECT id, username, email, name, role FROM member WHERE role=$1;',
      values: [String(userRole)],
    });
    res.status(200).json(response.rows);
  }
);

userController.post(
  '/sign',
  async (req: Request, res: Response): Promise<void> => {
    const { username, email, name, role } = req.body;
    try {
      await query({
        text: 'INSERT INTO member (username, email, name, role) VALUES ($1, $2, $3, $4);',
        values: [username, email, name, role],
      });
      const dbUserIdReponse = await query({
        text: 'SELECT id FROM member WHERE username=$1;',
        values: [username],
      });
      const dbUserId = dbUserIdReponse.rows[0].id;
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
    if (!userId || isNaN(Number(userId))) {
      res.status(400).json({ error: 'Invalid or missing ID' });
      return;
    }
    try {
      const response = await query({
        text: 'DELETE FROM member WHERE id=$1;',
        values: [String(userId)],
      });
      res.send(response);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
);

//remember to assign the updates (old data -> new data) to a table in db
userController.put(
  '/update',
  async (req: Request, res: Response): Promise<void> => {
    let { id, username, email, name, role } = req.body;

    //checks if id is defined and a number
    if (!id || isNaN(id)) {
      res.status(400).json({ error: 'Invalid or missing ID' });
      return;
    }
    const userId = String(id);

    //checks what data is not given in req.body and replace with the actual data in db
    let dbUserData;
    if (
      username === undefined ||
      email === undefined ||
      name === undefined ||
      role === undefined
    ) {
      const dbUserDataResult = await query({
        text: 'SELECT username, email, name, role FROM member WHERE id=$1;',
        values: [userId],
      });
      dbUserData = dbUserDataResult.rows[0];

      username = username === undefined ? dbUserData.username : username;
      email = email === undefined ? dbUserData.email : email;
      name = name === undefined ? dbUserData.name : name;
      role = role === undefined ? dbUserData.role : role;
    }

    //starts to update member with the given data
    try {
      await query({
        text: 'UPDATE member SET username=$1, email=$2, name=$3, role=$4 WHERE id=$5;',
        values: [username, email, name, role, id],
      });
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
