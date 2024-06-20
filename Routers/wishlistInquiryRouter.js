const express = require('express');
const { addToWishlist, removeFromWishlist, allWishlist, addToInquiry, allInquiry } = require('../Controllers/wishlistInquiryController');
const router = express.Router();
const upload = require('../Utils/common/upload')
const { authMiddleware } = require('../Utils/GlobalFunctions')


router.put('/add-wishlist', authMiddleware, addToWishlist)

router.put('/remove-wishlist', authMiddleware, removeFromWishlist)

router.get('/all-wishlist', authMiddleware, allWishlist)

router.put('/add-inquiry', authMiddleware, addToInquiry)

router.get('/all-inquires', authMiddleware, allInquiry)

module.exports = router;