import { Controller, Delete, Get, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import { myDataBase } from '@src/index';
import { UUID } from 'crypto';
// esse tipo precisa entrar o tipo UUID or string dentro dele
// import type { ParamsDictionary } from 'node_modules/@types/express-serve-static-core/index.d.ts';

@Controller('users')
export class UserController {
  @Get('list')
  public listAllUsers(_: Request, res: Response): void {
    const userList = myDataBase().list();
    console.log(userList);
    res.status(200).send(userList);
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, role } = req.body;
      const newUser = await myDataBase().create({
        name,
        email,
        role,
      });
      console.log(req.body);
      res.status(201).send(newUser);
    } catch (error) {
      res.send(error);
    }
  }

  @Put(':id')
  public async update(req: Request, res: Response): Promise<void> {
    const userId: UUID = req.params.id;
    const { name, email, role } = req.body;

    myDataBase().update(userId, { name, email, role });

    res.status(204).send();
  }

  @Delete(':id')
  public async delete(req: Request, res: Response): Promise<void> {
    const userId: UUID = req.params.id;

    myDataBase().delete(userId);

    res.status(204).send();
  }
}
