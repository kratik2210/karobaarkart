const express = require('express');
const { addToWishlist } = require('../Controllers/wishlistController');
const router = express.Router();
const upload = require('../Utils/common/upload')
const { authMiddleware } = require('../Utils/GlobalFunctions')


router.put('/add-wishlist', authMiddleware, addToWishlist)

module.exports = router;