const Brands = require('../Schema/brandSchema');
const _g = require("../Utils/GlobalFunctions");
const { errorCodes, API_RESP_CODES } = require("../Utils/common/error-codes");
const BrandService = require("../Services/brand-service");
const { errorHandler, apiValidResponse, internalErrResp } = require("../Utils/common/api-middleware");
const { validateWishlist, validateEditBrand } = require("../Utils/common/validator");

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
    const brandId = req.query.brandId

    const { error } = validateEditBrand({
        ...req.body
    });

    if (error) {

        return res
            .status(400)
            .json({
                success: false,
                message: error.details[0].message,
                data: null,
            });
    }

    await BrandService.editBrandService(req.body, userId, brandId).then((dataResult) => {
        let returnResponse = dataResult;
        apiValidResponse(res, returnResponse);
    })
        .catch((err) => {
            internalErrResp(res, err, 'editBrand');
        });

    //     let statusCode = errorCodes.SUCCESS.Value;
    //     let message = result.message;
    //     let data = result.data;


    //     if (result.message === API_RESP_CODES.VEHICLE_EXIST.message) {
    //         message = API_RESP_CODES.VEHICLE_EXIST.message;
    //         statusCode = API_RESP_CODES.VEHICLE_EXIST.status;
    //     }

    //     res.status(statusCode)
    //         .json({ success: result.status, message: message, data: data });

    // } catch (error) {
    //     errorHandler(res, error);
    // }
})
