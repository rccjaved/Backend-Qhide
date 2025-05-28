const hospitalController = require('../../controllers/dashboard/hospitalController')
const authDashboardMiddleware = require('../../middlewares/authDashboardMiddleware')
const router = require('express').Router()


// console.log('authDashboardMiddleware:', authDashboardMiddleware)
// console.log('hospitalController.get_hospital:', hospitalController.get_hospital)
router.get('/hospital-get', authDashboardMiddleware, hospitalController.get_hospital)
router.post('/hospital-add', authDashboardMiddleware, hospitalController.add_hospital)


module.exports = router
