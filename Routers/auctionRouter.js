const express = require('express');
const { createAuction, getAuctions } = require('../Controllers/auctionController');
const router = express.Router();
const upload = require('../Utils/common/upload')
const { authMiddleware } = require('../Utils/GlobalFunctions')


router.post('/add-auction', authMiddleware, createAuction)

router.get('/all-auctions', authMiddleware, getAuctions)



module.exports = router;