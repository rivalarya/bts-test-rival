const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const db = require('./Infrastructure/database/pool');

async function isUserExist(username, password) {
  const params = {
    username,
    password
  };
  const result = await query('SELECT id FROM "User" WHERE username = :username AND password = :password', {
    replacements: params
  });

  if (result.length !== 0 ) {
    return true;
  } else {
    throw new Error('User tidak ditemukan');
  }
}

async function getUserIdByUsername(username) {
  const params = {
    username
  };
  const result = await query('SELECT id FROM "User" WHERE username = :username', {
    replacements: params
  });

  return result[0].id;
}

async function storeUser(email, username, password) {
  const params = {
    email,
    username,
    password
  };
  await query('INSERT INTO "User" ("email", "username", "password") VALUES (:email, :username, :password)', {
    replacements: params
  });

  return true;
}

async function query(query, params) {
  return (await db.sequelize.query(query, params))[0];
}

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
}

/**
 * Memvalidasi token dan mereturn payload jika token valid
 *
 * @param {string} token
 */
function getPayloadFromToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedData) => {
    if (err) {
      throw new Error('Token tidak valid!');
    } else {
      return decodedData;
    }
  });
}

async function verifyJWT(req, res, next) {
  try {
    const token = req.headers.authorization?.substr(7);
    getPayloadFromToken(token);

    next();
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode)
      .json({ statusCode, success: false, data: {}, message: error.message })
  }
};

async function getAllChecklist() {
  return await query('SELECT * FROM checklist');
}

async function storeChecklist(checklistName, userId) {
  const params = {
    checklistName,
    userId
  };
  await query('INSERT INTO "checklist" ("name", "user_id") VALUES (:checklistName, :userId)', {
    replacements: params
  });

  return true;
}

module.exports = {
  generateToken,
  verifyJWT,
  getUserIdByUsername,
  getPayloadFromToken,
  isUserExist,
  query,
  storeUser,
  getAllChecklist,
  storeChecklist
}