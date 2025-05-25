const router = require('express').Router()
const ticketController = require('../controllers/ticketController');

router.post('/create', ticketController.createTicket);

module.exports = router;
