const express = require('express');
const { createBrand, getAllBrands } = require('../Controllers/brandController');
const router = express.Router();
const upload = require('../Utils/common/upload')
const { authMiddleware } = require('../Utils/GlobalFunctions')

router.post('/create-brand', upload.fields([
    { name: 'brandLogo', maxCount: 1 },
]), createBrand)

router.get('/all-brands', getAllBrands)

module.exports = router;