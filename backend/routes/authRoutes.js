const { Router } = require('express');
const authController = require('../controllers/authController');
const { requireAuth, loggedIn } = require('../middleware/authMiddleware');

const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);

router.get('/login', authController.login_get);
router.post('/login', authController.login_post);

router.use(loggedIn);
router.get('/logout', authController.logout_get);

router.post('/forgotPassword', authController.ResetTokenPost);
router.get('/forgotPassword', authController.ResetTokenGet);
router.post('/changePassword', authController.changePassword);

router.get('/testEmail', authController.emailTest);

module.exports = router;