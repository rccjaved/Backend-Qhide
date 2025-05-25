const router = require('express').Router()
const serviceController = require('../controllers/serviceController');

// POST /api/services/create
router.post('/create', serviceController.createService);

// GET /api/services
router.get('/', serviceController.getAllServices); // Fetch all services

module.exports = router;
