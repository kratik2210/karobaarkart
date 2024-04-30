const express = require('express');
const { accountRegister, loginAccount, OTPverification } = require('../Controllers/accountController');
const router = express.Router();
const upload = require('../Utils/common/upload')

router.post('/user/register', upload.fields([
    { name: 'docImage', maxCount: 1 },
    { name: 'businessProof', maxCount: 1 }
]), accountRegister);

router.post('/user/login', loginAccount);

router.post('/user/verification', OTPverification);

module.exports = router;