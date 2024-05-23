const express = require('express');
const { createAuction, getAuctions, singleLiveAuction, placeBid, getBidsOnProfile } = require('../Controllers/auctionController');
const router = express.Router();
const upload = require('../Utils/common/upload')
const { authMiddleware } = require('../Utils/GlobalFunctions')


router.post('/add-auction', authMiddleware, createAuction)

router.get('/all-auctions', authMiddleware, getAuctions)

router.get('/one-auction', authMiddleware, singleLiveAuction)

router.post('/place-bid', authMiddleware, placeBid)

router.get('/user-based-bids', authMiddleware, getBidsOnProfile)



module.exports = router;