const express = require('express');
const { createVehicle, getVehicles, vehiclesListing, singleVehicleBasedOnId, sellStatus, importVehiclePricing, postData, updateData, readMany, getAllModelsRelatedToBrands, sortVehicleByPrice, editVehicle } = require('../Controllers/vehicleController');
const router = express.Router();
const upload = require('../Utils/common/upload')
const localUpload = require('../Utils/common/localUpload')
const { authMiddleware } = require('../Utils/GlobalFunctions')


router.post('/add-vehicle', authMiddleware, upload.fields([
    { name: 'modelCoverImage', maxCount: 1 },
    { name: 'modelMultiImages', maxCount: 5 }
]), authMiddleware, createVehicle)



router.get('/retrive-vehicles', authMiddleware, getVehicles);

router.get('/all-vehicle-listing', authMiddleware, vehiclesListing);

router.get('/get-single-vehicle', authMiddleware, singleVehicleBasedOnId);

router.put('/sell-status', authMiddleware, sellStatus);

router.put('/import', (req, res, next) => {
    next();
}, localUpload.fields([{ name: 'excelFile', maxCount: 1 }]), (req, res, next) => {
    next();
}, importVehiclePricing);

router.post('/post-data', postData);
router.put('/update-data', updateData);
router.get('/read-many', readMany);
router.get('/models-related-brands', getAllModelsRelatedToBrands);

router.get('/sort-by-price', authMiddleware, sortVehicleByPrice);

router.put('/edit-vehicle', authMiddleware, upload.fields([
    { name: 'modelCoverImage', maxCount: 1 },
    { name: 'modelMultiImages', maxCount: 5 }
]), authMiddleware, editVehicle)

module.exports = router;