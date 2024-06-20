const express = require('express');
const { updateUser, getAllUsers, getOneUser, isApproved } = require('../Controllers/userController');
const router = express.Router();
const upload = require('../Utils/common/upload')
const { authMiddleware } = require('../Utils/GlobalFunctions')

// router.post('/user/register', upload.fields([
//     { name: 'docImage', maxCount: 1 },
//     { name: 'businessProof', maxCount: 1 }
// ]), accountRegister);

router.put('/update-profile', authMiddleware, upload.fields([
    { name: 'docImage', maxCount: 1 },
    { name: 'businessProof', maxCount: 1 }
]), updateUser)

router.get('/all-users', authMiddleware, getAllUsers)

router.get('/get-one-user', authMiddleware, getOneUser)

router.put('/approval', authMiddleware, isApproved)

module.exports = router;