const express = require('express');
const { createVehicle, getVehicles, vehiclesListing, singleVehicleBasedOnId, sellStatus } = require('../Controllers/vehicleController');
const router = express.Router();
const upload = require('../Utils/common/upload')
const { authMiddleware } = require('../Utils/GlobalFunctions')


router.post('/add-vehicle', authMiddleware, upload.fields([
    { name: 'modelCoverImage', maxCount: 1 },
    { name: 'modelMultiImages', maxCount: 5 }
]), authMiddleware, createVehicle)

router.get('/retrive-vehicles', authMiddleware, getVehicles);

router.get('/all-vehicle-listing', authMiddleware, vehiclesListing);

router.get('/get-single-vehicle', authMiddleware, singleVehicleBasedOnId);

router.put('/sell-status', authMiddleware, sellStatus);


module.exports = router;