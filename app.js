const express = require('express');
const bodyParser = require('body-parser');
const { isUserExist, generateToken, storeUser, getAllChecklist, verifyJWT, storeChecklist, getUserIdByUsername, getPayloadFromToken } = require('./helpers');
const app = express();

app.use(bodyParser.json());

const baseUrl = '/api';

app.post(`${baseUrl}/login`, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    await isUserExist(username, password);

    res.status(200)
      .json({
        success: true,
        data: {
          token: generateToken({ username, password })
        }
      })
  } catch (error) {
    next(error);
  }
});

// Endpoint Register
app.post(`${baseUrl}/register`, async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    await storeUser(email, username, password);

    res.status(201)
      .json({
        success: true,
        data: {
          message: 'User registered successfully'
        }
      });
  } catch (error) {
    next(error);
  }
});

// Endpoint Get All Checklists
app.get(`${baseUrl}/checklist`, verifyJWT, async (req, res, next) => {
  try {
    const checklist = await getAllChecklist();

    res.status(200)
      .json({
        success: true,
        data: checklist
      });
  } catch (error) {
    next(error);
  }
});

// Endpoint Create New Checklist
app.post(`${baseUrl}/checklist`, verifyJWT, async (req, res, next) => {
  try {
    const { name: checklistName } = req.body;

    const token = req.headers.authorization?.substr(7);
    const { username } = getPayloadFromToken(token);
    const userId = await getUserIdByUsername(username);
    await storeChecklist(checklistName, userId);

    res.status(201)
      .json({
        success: true,
        data: {
          message: 'Checklist created successfully'
        }
      });
  } catch (error) {
    next(error);
  }
});

app.delete(`${baseUrl}/checklist/:checklistId`, async (req, res, next) => {
  try {
    const { checklistId } = req.params;

  } catch (error) {
    next(error);
  }
});

app.get(`${baseUrl}/checklist/:checklistId/item`, (req, res) => {
  const { checklistId } = req.params;
});

// 1.3.2 Create New Checklist Item in Checklist
app.post(`${baseUrl}/checklist/:checklistId/item`, (req, res) => {
  const { checklistId } = req.params;
  const { itemName } = req.body;
});

app.get(`${baseUrl}/checklist/:checklistId/item/:checklistItemId`, (req, res) => {
  const { checklistId, checklistItemId } = req.params;
});

app.put(`${baseUrl}/checklist/:checklistId/item/:checklistItemId`, (req, res) => {
  const { checklistId, checklistItemId } = req.params;
});

app.delete(`${baseUrl}/checklist/:checklistId/item/:checklistItemId`, (req, res) => {
  const { checklistId, checklistItemId } = req.params;
});

app.put(`${baseUrl}/checklist/:checklistId/item/rename/:checklistItemId`, (req, res) => {
  const { checklistId, checklistItemId } = req.params;
  const { itemName } = req.body;
});

app.use((err, req, res, next) => {
  console.error('Uncaught Exception:', err);
  const statusCode = err.statusCode || 500
  return res.status(statusCode)
    .json({ statusCode, success: false, data: {}, message: err.message })
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
