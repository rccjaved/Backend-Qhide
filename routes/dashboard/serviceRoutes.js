const serviceController = require('../../controllers/dashboard/serviceController')
const authDashboardMiddleware = require('../../middlewares/authDashboardMiddleware')
const router = require('express').Router()


router.get('/service-get', authDashboardMiddleware, serviceController.get_service)


module.exports = router
