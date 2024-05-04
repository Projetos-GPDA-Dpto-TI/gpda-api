import express, { Router } from 'express';
import { join } from 'node:path';
import database from '../../infra/database';

import migrationRunner from 'node-pg-migrate';
import { Client } from 'pg';

const migrationsController: Router = express.Router();

interface MigrationData {
  dbClient: Client;
  dryRun: boolean;
  dir: string;
  direction: 'up' | 'down';
  verbose: boolean;
  migrationsTable: string;
}

async function getMigrationData() {
  const dbClient = await database.getNewCLient();

  const migrationData: MigrationData = {
    dbClient: dbClient,
    dryRun: true,
    dir: join('infra', 'migrations'),
    direction: 'up',
    verbose: true,
    migrationsTable: 'pgmigrations',
  };
  return { migrationData, dbClient };
}

migrationsController.get('/migrations', async (req, res) => {
  const { migrationData, dbClient } = await getMigrationData();
  const pendingMigrations = await migrationRunner(migrationData);
  await dbClient.end();
  res.status(200).json(pendingMigrations);
});

migrationsController.post('/migrations', async (req, res) => {
  const { migrationData, dbClient } = await getMigrationData();
  const migratedMigrations = await migrationRunner({
    ...migrationData,
    dryRun: false,
  });
  await dbClient.end();

  res.status(201).json(migratedMigrations);
});

migrationsController.all('/migrations', (req, res) => {
  res.sendStatus(405);
});

export default migrationsController;
