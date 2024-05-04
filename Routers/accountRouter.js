const express = require('express');
const { accountRegister, loginAccount, OTPverification, adminLogin } = require('../Controllers/accountController');
const router = express.Router();
const upload = require('../Utils/common/upload');
const { authMiddleware } = require('../Utils/GlobalFunctions');

router.post('/user/register', upload.fields([
    { name: 'docImage', maxCount: 1 },
    { name: 'businessProof', maxCount: 1 }
]), accountRegister);

router.post('/user/login', loginAccount);

router.post('/user/verification', OTPverification);

router.post('/admin/login', adminLogin);

router.post('/admin-user/registration', upload.fields([
    { name: 'docImage', maxCount: 1 },
    { name: 'businessProof', maxCount: 1 }
]), authMiddleware, accountRegister);

module.exports = router;