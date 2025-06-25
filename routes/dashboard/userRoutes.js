const userController = require('../../controllers/dashboard/userController')
const authDashboardMiddleware = require('../../middlewares/authDashboardMiddleware')
const router = require('express').Router()


router.get('/user-get', authDashboardMiddleware, userController.get_user)
router.get('/user-detail/:Id', authDashboardMiddleware, userController.get_user_by_id);
router.put('/edit/:Id', authDashboardMiddleware, userController.update_user);


module.exports = router
