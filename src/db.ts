import { Client } from 'pg';

export const getClient = async () => {
  const client = new Client({
    host: process.env.HOST,
    port: Number(process.env.PORT),
    database: process.env.DATABASE,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    ssl: {
        rejectUnauthorized: false
    }
  });

  await client.connect();

  return client;
};