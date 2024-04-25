import express, { Request, Response, Router } from 'express';
import 'dotenv/config';
import { join } from 'node:path';

import migrationRunner from 'node-pg-migrate';

const migrationsController: Router = express.Router();

const migrationData = {
  databaseUrl: process.env.DATABASE_URL,
  dryRun: true,
  dir: join('infra', 'migrations'),
  direction: 'up',
  verbose: true,
  migrationsTable: 'pgmigrations',
};

migrationsController.get('/migrations', async (req, res) => {
  const migrationResponse = await migrationRunner(migrationData);
  res.status(200).json(migrationResponse);
});

migrationsController.post('/migrations', async (req, res) => {
  const migrationResponse = await migrationRunner({
    ...migrationData,
    dryRun: false,
  });
  res.status(200).json(migrationResponse);
});

migrationsController.all('/migrations', (req, res) => {
  res.sendStatus(405);
});

export default migrationsController;
