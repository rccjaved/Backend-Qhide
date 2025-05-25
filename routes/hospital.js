const router = require('express').Router()
const hospitalController = require('../controllers/hospitalController');

// POST - Create a new hospital
router.post('/create', hospitalController.createHospital);

// (Optional) GET - List hospitals
router.get('/list', hospitalController.listHospitals); // <-- If you plan to implement listing

// Get User Location WithIn 5km Radius
router.post('/nearby', hospitalController.getNearbyHospitals);


module.exports = router;
