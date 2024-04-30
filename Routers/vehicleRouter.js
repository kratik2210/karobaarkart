const express = require('express');
const { createVehicle, getVehicles } = require('../Controllers/vehicleController');
const router = express.Router();
const upload = require('../Utils/common/upload')
const { authMiddleware } = require('../Utils/GlobalFunctions')


router.post('/add-vehicle', authMiddleware, upload.fields([
    { name: 'modelCoverImage', maxCount: 1 },
    { name: 'modelMultiImages', maxCount: 5 }
]), createVehicle)

router.get('/retrive-vehicles', authMiddleware, getVehicles);


module.exports = router;