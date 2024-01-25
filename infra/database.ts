import { Client } from 'pg';
import 'dotenv/config';

const dbData = {
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
};

async function dbConnect(queryObject: string) {
  //later it will be needed to detach connection and query actions
  const client = new Client(dbData);
  await client.connect();
  const res = await client.query(queryObject);
  await client.end();
  return res.rows[0]['?column?'];
}

export default dbConnect;
