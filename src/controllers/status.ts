import express, { Request, Response, Router } from 'express';
import query from '../../infra/database';
import 'dotenv/config';

const statusController: Router = express.Router();

statusController.get(
  '/status',
  async (req: Request, res: Response): Promise<void> => {
    const updatedAt = new Date().toISOString();

    const dbVersionResult = await query('SHOW server_version;');
    const dbVersion = dbVersionResult.rows[0].server_version;

    const dbName = process.env.POSTGRES_DB;
    const dbOpenedConnectionsResult = await query({
      text: 'SELECT count(*)::int FROM pg_stat_activity WHERE datname=$1',
      values: [dbName],
    });
    const dbOpenedConnections = dbOpenedConnectionsResult.rows[0].count;

    const dbMaxConnectionsResult = await query('SHOW max_connections;');
    const dbMaxConnections = dbMaxConnectionsResult.rows[0].max_connections;

    res.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        db: {
          version: dbVersion,
          max_connections: parseInt(dbMaxConnections),
          opened_connections: dbOpenedConnections,
        },
      },
    });
  }
);

export default statusController;
