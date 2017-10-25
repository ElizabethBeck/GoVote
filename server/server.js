/* eslint no-console: 0 */
import express from 'express';
import pg, { Client } from 'pg';
import Router from 'express-promise-router';
import 'babel-polyfill';
import path from 'path';

const app = express();
const router = new Router();

if (process.env.NODE_ENV !== 'production') {
  let dotenv = require('dotenv');
  dotenv.config();
}

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, './')));
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
  });
}

app.set('port', (process.env.PORT || 3001));

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT
});

client.connect();

router.get('/api/:fn/:ln', async (req, res) => {
  const query = `SELECT * FROM ${process.env.DB_TABLE} WHERE first_name ilike $1::text and last_name ilike $2::text`;
  const { rows } = await client.query(query, [req.params.fn, req.params.ln]);
  res.send(rows);
});

app.use(router);

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});
