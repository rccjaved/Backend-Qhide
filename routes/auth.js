const router = require('express').Router()
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');


router.post('/signup', authController.signup)
router.post('/verify-otp', authController.verifyOtpAndRegister);
router.post('/signin', authController.signin);
router.post('/verify-signin-otp', authController.verifySigninOtp);


module.exports = router;
