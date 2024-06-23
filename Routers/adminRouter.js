const express = require('express');
const { createBrand, getAllBrands, editBrand, updateSellingPriceForUsedVehicle, getAllPaidUsers, getBrandById } = require('../Controllers/brandController');
const router = express.Router();
const upload = require('../Utils/common/upload')
const { authMiddleware } = require('../Utils/GlobalFunctions');
const { updateUser } = require('../Controllers/userController');
const { getFullBids } = require('../Controllers/auctionController');

router.post('/create-brand', upload.fields([
    { name: 'brandLogo', maxCount: 1 },
]), createBrand)

router.get('/all-brands', getAllBrands)

router.get('/get-one-brand', getBrandById)

router.put('/edit-brand', authMiddleware, upload.fields([
    { name: 'brandLogo', maxCount: 1 },
]), editBrand)


router.put('/admin/update-profile', authMiddleware, upload.fields([
    { name: 'docImage', maxCount: 1 },
    { name: 'businessProof', maxCount: 1 }
]), updateUser)

router.put('/selling-price-updation', authMiddleware, updateSellingPriceForUsedVehicle)

router.get('/all-bids', authMiddleware, getFullBids)

router.get('/all-paid-users', authMiddleware, getAllPaidUsers)



module.exports = router;