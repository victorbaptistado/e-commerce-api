//Instead of requiring pg directly, require this file
require('dotenv').config();
const { Pool } = require('pg')


/* Connecting to database */
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});


pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error executing query', err.stack);
  } else {
    console.log('Successfully connected to PostgreSQL database:', res.rows[0]);
  }
});

 
module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
}

