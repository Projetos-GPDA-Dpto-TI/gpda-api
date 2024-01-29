import express, { Request, Response, Router } from 'express';
import query from '../../infra/database';
import 'dotenv/config';

const statusController: Router = express.Router();

statusController.get(
  '/status',
  async (req: Request, res: Response): Promise<void> => {
    const updatedAt = new Date().toISOString();

    const databaseVersionResult = await query('SHOW server_version;');
    const databaseVersionValue = databaseVersionResult.rows[0].server_version;

    const dbName = process.env.POSTGRES_DB;
    const databaseOpenedConnectionsResult = await query({
      text: 'SELECT count(*)::int FROM pg_stat_activity WHERE datname=$1',
      values: [dbName],
    });
    const databaseOpenedConnectionsValue =
      databaseOpenedConnectionsResult.rows[0].count;

    const databaseMaxConnectionsResult = await query('SHOW max_connections;');
    const databaseMaxConnectionsValue =
      databaseMaxConnectionsResult.rows[0].max_connections;

    res.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: databaseVersionValue,
          max_connections: parseInt(databaseMaxConnectionsValue),
          opened_connections: databaseOpenedConnectionsValue,
        },
      },
    });
  }
);

export default statusController;
