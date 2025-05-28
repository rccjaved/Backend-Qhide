const router = require('express').Router()
const authController = require('../controllers/dashboard/authController')
const authDashboardMiddleware = require('../middlewares/authDashboardMiddleware')


router.post('/admin-login',authController.admin_login)
router.get('/get-user',authDashboardMiddleware , authController.getUser)


module.exports = router 