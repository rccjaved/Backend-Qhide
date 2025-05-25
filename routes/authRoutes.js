const router = require('express').Router()
const authController = require('../controllers/authController')
const { authDashboardMiddleware  } = require('../middlewares/authDashboardMiddleware')


router.post('/admin-login',authController.admin_login)
// console.log('authController.getUser:', authController.getUser);
// console.log('authDashboardMiddleware :', authDashboardMiddleware );

router.get('/get-user',authDashboardMiddleware , authController.getUser)
// router.post('/seller-register',authControllers.seller_register)
// router.post('/seller-login',authControllers.seller_login)
// router.post('/profile-image-upload',authMiddleware, authController.profile_image_upload)
// router.post('/profile-info-add',authMiddleware, authController.profile_info_add)

// router.post('/change-password',authMiddleware, authController.change_password)

// router.get('/logout',authMiddleware, authController.logout)


module.exports = router 