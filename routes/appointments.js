const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const appointmentController = require('../controllers/appointmentController');

// ✅ GET user's all appointments
router.get('/my-appointments', authMiddleware, appointmentController.getUserAppointments);

// ✅ GET user's appointments with proximity-based sorting (e.g., nearby hospitals)
router.get('/my-appointments/nearby', authMiddleware, appointmentController.getUserAppointmentsWithNearby);

// ✅ GET countdown (e.g., time left for upcoming appointment)
router.get('/appointments/:id/countdown', authMiddleware, appointmentController.getAppointmentCountdown);

// ✅ POST cancel appointment
router.post('/appointments/:id/cancel', authMiddleware, appointmentController.cancelAppointment);

// ✅ POST check proximity and generate ticket (your new function)
router.post('/appointments/:id/check-proximity', authMiddleware, appointmentController.checkProximityAndGenerateTicket);

module.exports = router;
