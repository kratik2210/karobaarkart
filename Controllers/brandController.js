const Brands = require('../Schema/brandSchema');
const _g = require("../Utils/GlobalFunctions");
const { errorCodes, API_RESP_CODES } = require("../Utils/common/error-codes");
const BrandService = require("../Services/brand-service");
const { errorHandler, apiValidResponse, internalErrResp } = require("../Utils/common/api-middleware");
const { validateWishlist, validateEditBrand } = require("../Utils/common/validator");
const Joi = require('joi/lib');
const Vehicle = require('../Schema/vehicleSchema');
const User = require('../Schema/usersSchema');

exports.createBrand = async (req, res) => {
    try {
        const { brandName, description } = req.body;

        const brandLogo = req.files.brandLogo
            ? req.files.brandLogo[0].path
            : null;

        const newBrand = new Brands({
            brandName,
            description,
            brandLogo: brandLogo,
        });

        const savedBrand = await newBrand.save();

        res.status(201).json({
            success: true,
            message: 'Brand created successfully',
            data: savedBrand,
        });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyValue) {
            return res.status(400).json({ success: false, message: 'Key already present in the database,Unique key required', error: error.keyValue });
        }
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


exports.getAllBrands = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const brands = await Brands.find()
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            message: 'Brands fetched successfully',
            data: brands,
        });
    } catch (error) {
        console.error('Error fetching brands:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.editBrand = _g.asyncMiddlewareController(async (req, res) => {
    const userId = req.user._id;
    const brandId = req.query.brandId;

    const { error } = validateEditBrand({ ...req.body });

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
            data: null,
        });
    }

    try {
        let brandLogo;
        if (req.files && req.files.brandLogo) {
            brandLogo = req.files.brandLogo[0].path; // Assuming you store the path to the brandLogo in req.files
        }

        await BrandService.editBrandService(req.body, userId, brandId, brandLogo)
            .then((dataResult) => {
                let returnResponse = dataResult;
                apiValidResponse(res, returnResponse);
            })
            .catch((err) => {
                internalErrResp(res, err, 'editBrand');
            });
    } catch (error) {
        internalErrResp(res, error, 'editBrand');
    }
});



exports.updateSellingPriceForUsedVehicle = _g.asyncMiddlewareController(async (req, res) => {
    try {
        const vehicleId = req.query.vehicleId;
        const { rating, sellingPrice } = req.body;

        // Validate input fields using Joi
        const schema = Joi.object({
            rating: Joi.number().min(0).max(10), // Example validation for rating
            sellingPrice: Joi.number().positive() // Example validation for sellingPrice
        });

        const { error } = schema.validate({ rating, sellingPrice });

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Find the vehicle by id and validate sellStatus
        const vehicle = await Vehicle.findById(vehicleId);

        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        if (vehicle.sellStatus !== 'used') {
            return res.status(400).json({ error: 'Not the correct category vehicle' });
        }

        // Update the vehicle fields
        if (rating !== undefined) {
            vehicle.rating = rating;
        }
        if (sellingPrice !== undefined) {
            vehicle.sellingPrice = sellingPrice;
        }

        // Save the updated vehicle
        const updatedVehicle = await vehicle.save();

        res.status(200).json({ message: 'Vehicle updated successfully', data: updatedVehicle });
    } catch (error) {
        console.log("🚀 ~ exports.updateVehicle ~ error:", error);
        res.status(500).json({ error: 'Internal server error', data: error });
    }
})



exports.getAllPaidUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const brands = await User.find({ isPaid: true })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            message: 'All Paid Users fetched successfully',
            data: brands,
        });
    } catch (error) {
        console.error('Error fetching brands:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error });
    }
};


exports.getBrandById = async (req, res) => {
    try {
        const brandId = req.query.id;
        console.log("🚀 ~ exports.getBrandById= ~ brandId:", brandId)

        const brand = await Brands.findById(brandId);
        console.log("🚀 ~ exports.getBrandById= ~ brand:", brand)

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'Brand not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Brand fetched successfully',
            data: brand,
        });
    } catch (error) {
        console.error('Error fetching brand:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
