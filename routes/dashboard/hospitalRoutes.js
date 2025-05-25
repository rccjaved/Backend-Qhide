const hospitalController = require('../../controllers/dashboard/hospitalController')
import { authDashboardMiddleware } from '../../middlewares/authDashboardMiddleware'
const router = require('express').Router()

// router.post('/category-add',authMiddleware, categoryController.add_category) 
router.get('/hospital-get',authDashboardMiddleware, hospitalController.get_hospital) 
// router.put('/category-update/:id',authMiddleware, categoryController.update_category) 
// router.delete('/category/:id', categoryController.deleteCategory) 

export default router