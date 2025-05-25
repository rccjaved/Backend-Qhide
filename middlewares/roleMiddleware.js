const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./authMiddleware');
const { authorizeRoles } = require('./roleMiddleware');

router.get('/admin/dashboard', authMiddleware, authorizeRoles('admin'), (req, res) => {
  res.send('Welcome Admin');
});
