const hospitalController = require('../../controllers/dashboard/hospitalController')
const authDashboardMiddleware = require('../../middlewares/authDashboardMiddleware')
const router = require('express').Router()


// console.log('authDashboardMiddleware:', authDashboardMiddleware)
// console.log('hospitalController.get_hospital:', hospitalController.get_hospital)
router.get('/hospital-get', authDashboardMiddleware, hospitalController.get_hospital)
router.post('/hospital-add', authDashboardMiddleware, hospitalController.add_hospital)
router.get('/hospital-detail/:Id', authDashboardMiddleware, hospitalController.get_hospital_by_id);
router.put('/edit/:Id', authDashboardMiddleware, hospitalController.update_hospital);
router.delete('/delete/:Id', authDashboardMiddleware, hospitalController.delete_hospital);


module.exports = router
