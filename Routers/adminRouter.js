const express = require('express');
const { createBrand, getAllBrands, editBrand } = require('../Controllers/brandController');
const router = express.Router();
const upload = require('../Utils/common/upload')
const { authMiddleware } = require('../Utils/GlobalFunctions')

router.post('/create-brand', upload.fields([
    { name: 'brandLogo', maxCount: 1 },
]), createBrand)

router.get('/all-brands', getAllBrands)

router.put('/edit-brand', authMiddleware, upload.fields([
    { name: 'brandLogo', maxCount: 1 },
]), editBrand)


module.exports = router;