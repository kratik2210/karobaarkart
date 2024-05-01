const Vehicle = require('../Schema/vehicleSchema');


exports.createVehicle = async (req, res) => {
    try {
        const { brandId, modelName, modelYear, modelNumber, modelPrice, modelLocation, description, mileage, fuelType, loadingCapacity, insurance, kmsDriven, condition, inquireStatus } = req.body;

        const createdBy = req.user._id;
        const modelCoverImage = req.files.modelCoverImage ? req.files.modelCoverImage[0].path
            : null;

        const multiImageIds = [];

        if (req.files.modelMultiImages) {
            const modelMultiImages = req.files.modelMultiImages;
            for (const image of modelMultiImages) {
                multiImageIds.push(image.path);
            }
        }

        const newVehicle = new Vehicle({
            brandId,
            modelName,
            modelYear,
            modelNumber,
            modelPrice,
            modelLocation,
            description,
            mileage,
            fuelType,
            loadingCapacity,
            insurance,
            kmsDriven,
            condition,
            createdBy,
            modelCoverImage: modelCoverImage,
            modelMultiImages: multiImageIds,
            inquireStatus,
        });

        const savedVehicle = await newVehicle.save();

        res.status(201).json({
            success: true,
            message: 'Vehicle created successfully',
            data: savedVehicle,
        });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyValue) {
            return res.status(400).json({ success: false, message: 'Key already present in the database,Unique key required', error: error.keyValue });
        }
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



exports.getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find().populate('brandId');

        res.status(200).json({
            success: true,
            message: 'Vehicles retrieved successfully',
            data: vehicles,
        });
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
