import pkg from "pg";
const { Client } = pkg;

const dbData = {
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
  ssl: getSSLValues(),
};

async function query(queryObject) {
  let client;
  try {
    client = await getNewCLient();
    const res = await client.query(queryObject);
    return res;
    // eslint-disable-next-line no-useless-catch
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

async function getNewCLient() {
  const client = new Client(dbData);

  await client.connect();
  return client;
}

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV === "production" ? true : false;
}

export default Object.freeze({
  query,
  getNewCLient,
});
