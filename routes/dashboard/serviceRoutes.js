const serviceController = require('../../controllers/dashboard/serviceController')
const authDashboardMiddleware = require('../../middlewares/authDashboardMiddleware')
const router = require('express').Router()


router.get('/service-get', authDashboardMiddleware, serviceController.get_service)
router.post('/service-add', authDashboardMiddleware, serviceController.add_service)
router.get('/service-detail/:Id', authDashboardMiddleware, serviceController.get_service_by_id);
router.put('/edit/:Id', authDashboardMiddleware, serviceController.update_service);
router.delete('/delete/:Id', authDashboardMiddleware, serviceController.delete_service);

module.exports = router
