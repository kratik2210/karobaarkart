const express = require('express');
const { createBrand, getAllBrands, editBrand, updateSellingPriceForUsedVehicle } = require('../Controllers/brandController');
const router = express.Router();
const upload = require('../Utils/common/upload')
const { authMiddleware } = require('../Utils/GlobalFunctions');
const { updateUser } = require('../Controllers/userController');

router.post('/create-brand', upload.fields([
    { name: 'brandLogo', maxCount: 1 },
]), createBrand)

router.get('/all-brands', getAllBrands)

router.put('/edit-brand', authMiddleware, upload.fields([
    { name: 'brandLogo', maxCount: 1 },
]), editBrand)


router.put('/admin/update-profile', authMiddleware, upload.fields([
    { name: 'docImage', maxCount: 1 },
    { name: 'businessProof', maxCount: 1 }
]), updateUser)

router.put('/selling-price-updation', authMiddleware, updateSellingPriceForUsedVehicle)



module.exports = router;