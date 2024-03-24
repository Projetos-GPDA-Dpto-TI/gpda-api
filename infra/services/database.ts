import { Client } from 'pg';
import 'dotenv/config';

const dbData = {
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
  ssl: process.env.NODE_ENV === 'development' ? true : false,
};

//manually set the parametrized query object type below
async function query(queryObject: string | { text: string; values: string[] }) {
  const client = new Client(dbData);

  try {
    await client.connect();
    const res = await client.query(queryObject);
    return res;
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

export default Object.freeze({
  query,
});
