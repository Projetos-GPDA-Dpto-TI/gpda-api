import express, { Request, Response, Router } from 'express';
import 'dotenv/config';
import { join } from 'node:path';

import migrationRunner from 'node-pg-migrate';

const migrationsController: Router = express.Router();

migrationsController.get('/migrations', async (req, res) => {
  const migrationResponse = await migrationRunner({
    databaseUrl: process.env.DATABASE_URL,
    dryRun: true,
    dir: join('infra', 'migrations'),
    direction: 'up',
    verbose: true,
    migrationsTable: 'pgmigrations',
  });
  res.status(200).json([migrationResponse]);
});

migrationsController.post('/migrations', async (req, res) => {
  const migrationResponse = await migrationRunner({
    databaseUrl: process.env.DATABASE_URL,
    dryRun: false,
    dir: join('infra', 'migrations'),
    direction: 'up',
    verbose: true,
    migrationsTable: 'pgmigrations',
  });
  res.status(200).json([migrationResponse]);
});

migrationsController.all('/migrations', (req, res) => {
  res.sendStatus(405);
});

export default migrationsController;
