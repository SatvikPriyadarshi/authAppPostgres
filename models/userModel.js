const { Pool } = require('pg');
const pool = require('../db/dbConnection');

async function createUser(username, email, hashedPassword) {
  const query = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at`;
  const values = [username, email, hashedPassword];
  const res = await pool.query(query, values);
  return res.rows[0];
}

async function getUserByUsernameOrEmail(identifier) {
  const query = `SELECT * FROM users WHERE username = $1 OR email = $1 LIMIT 1`;
  const res = await pool.query(query, [identifier]);
  return res.rows[0];
}

async function getUserById(id) {
  const query = `SELECT id, username, email, created_at FROM users WHERE id = $1`;
  const res = await pool.query(query, [id]);
  return res.rows[0];
}

async function checkUsernameExists(username) {
  const res = await pool.query(`SELECT 1 FROM users WHERE username = $1`, [username]);
  return res.rowCount > 0;
}

async function checkEmailExists(email) {
  const res = await pool.query(`SELECT 1 FROM users WHERE email = $1`, [email]);
  return res.rowCount > 0;
}

module.exports = {
  createUser,
  getUserByUsernameOrEmail,
  getUserById,
  checkUsernameExists,
  checkEmailExists,
};
