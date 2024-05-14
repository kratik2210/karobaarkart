const express = require('express');
const { searchWishlistInquires, searchVehicles, filterBrand, filterPriceRange, filterVehicles } = require('../Controllers/searchFilterController');
const router = express.Router();
const { authMiddleware } = require('../Utils/GlobalFunctions')


// router.put('/add-wishlist', authMiddleware, addToWishlist)

// router.put('/remove-wishlist', authMiddleware, removeFromWishlist)

// router.get('/all-wishlist', authMiddleware, allWishlist)

// router.put('/add-inquiry', authMiddleware, addToInquiry)

router.get('/search-all-wishlist-inquiry', authMiddleware, searchWishlistInquires)

router.get('/search-all-vehicles', authMiddleware, searchVehicles)

router.get('/filter-brand', authMiddleware, filterBrand)

router.get('/filter-price-range', authMiddleware, filterPriceRange)

router.get('/dependent-filter', authMiddleware, filterVehicles)

module.exports = router;