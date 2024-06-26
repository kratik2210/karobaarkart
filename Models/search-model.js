const { default: mongoose } = require("mongoose");
const Wishlist = require("../Schema/wishlistInquirySchema")
const Vehicle = require("../Schema/vehicleSchema")
const _g = require('../Utils/GlobalFunctions');
const { API_RESP_CODES } = require('../Utils/common/error-codes');
const Brand = require("../Schema/brandSchema");

exports.searchingWishlistInquiry = async (searchTerm, userId, type) => {

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let returnResult = { status: false, message: '', data: null };

        const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);

        if (!isValidObjectId) {
            return { status: false, message: 'Invalid user ID format', data: null };
        }

        const typeSelection = type.toLowerCase() == 'wishlist' ? { wishlist: true } : type.toLowerCase() == 'inquiry' ? { inquiry: true } : {};


        const query = { userId, ...typeSelection };

        const allSearchResult = await Wishlist.find(query).populate({
            path: 'vehicleId',
            populate: {
                path: 'brandId',
                model: 'Brand'
            }
        }).exec();

        const filteredResults = allSearchResult.filter(item =>
            item.vehicleId.modelName.match(new RegExp(searchTerm, 'i')) ||
            item.vehicleId.brandId.brandName.match(new RegExp(searchTerm, 'i'))
        );

        if (filteredResults.length == 0) {
            return { status: true, message: API_RESP_CODES.SEARCH_EMPTY.message, data: null };
        }

        await session.commitTransaction();

        returnResult.status = true;
        returnResult.message = 'Search Successfull';
        returnResult.data = filteredResults;


        return returnResult;

    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}


exports.searchingVehicles = async (searchTerm, userId, type) => {

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let returnResult = { status: false, message: '', data: null };

        const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);

        if (!isValidObjectId) {
            return { status: false, message: 'Invalid user ID format', data: null };
        }

        const typeSelection = type.toLowerCase() == 'used' ? { category: 'used' } : type.toLowerCase() == 'new' ? { category: 'new' } : {};


        const query = { ...typeSelection };

        const allSearchResult = await Vehicle.find(query).populate('brandId').populate({
            path: 'modelName',
            select: 'modelName _id',
        }).exec();

        const filteredResults = allSearchResult.filter(item =>
            item.modelName.modelName.match(new RegExp(searchTerm, 'i')) ||
            item.brandId.brandName.match(new RegExp(searchTerm, 'i'))
        );

        if (filteredResults.length == 0) {
            return { status: true, message: API_RESP_CODES.SEARCH_EMPTY.message, data: null };
        }

        await session.commitTransaction();

        returnResult.status = true;
        returnResult.message = 'Search Successfull';
        returnResult.data = filteredResults;


        return returnResult;

    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}


exports.filterByBrand = async (userId, type, brandId) => {

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let returnResult = { status: false, message: '', data: null };

        const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);

        if (!isValidObjectId) {
            return { status: false, message: 'Invalid user ID format', data: null };
        }

        // const typeSelection = type.toLowerCase()


        let allSearchResult = await Vehicle.find({ brandId: brandId }).populate('brandId').populate({
            path: 'modelName',
            select: 'modelName _id',
        }).exec();


        const wishlistItems = await Wishlist.find({ userId: userId });

        // Create a map to store vehicleId-wishlistStatus pairs
        const wishlistMap = new Map();
        wishlistItems.forEach(item => {
            wishlistMap.set(item.vehicleId.toString(), item.wishlist);
        });


        // Loop through vehicles and update wishlist status based on the map
        allSearchResult = allSearchResult.map(vehicle => ({
            ...vehicle.toObject(), // Convert Mongoose document to plain JavaScript object
            wishlist: wishlistMap.has(vehicle._id.toString()) ? wishlistMap.get(vehicle._id.toString()) : false // Get wishlist status from the map
        }));




        if (allSearchResult.length == 0) {
            return { status: true, message: API_RESP_CODES.SEARCH_EMPTY.message, data: null };
        }

        await session.commitTransaction();

        returnResult.status = true;
        returnResult.message = 'Filtered Successfully';
        returnResult.data = allSearchResult;


        return returnResult;

    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}


exports.filteringByPriceRange = async (minPrice, maxPrice, userId, category) => {

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let returnResult = { status: false, message: '', data: null };

        const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);

        if (!isValidObjectId) {
            return { status: false, message: 'Invalid user ID format', data: null };
        }



        const query = { modelPrice: { $gte: minPrice, $lte: maxPrice }, category: category };

        let allSearchResult = await Vehicle.find(query).populate('brandId').populate({
            path: 'modelName',
            select: 'modelName _id',
        })

        const wishlistItems = await Wishlist.find({ userId: userId });

        // Create a map to store vehicleId-wishlistStatus pairs
        const wishlistMap = new Map();
        wishlistItems.forEach(item => {
            wishlistMap.set(item.vehicleId.toString(), item.wishlist);
        });


        // Loop through vehicles and update wishlist status based on the map
        allSearchResult = allSearchResult.map(vehicle => ({
            ...vehicle.toObject(), // Convert Mongoose document to plain JavaScript object
            wishlist: wishlistMap.has(vehicle._id.toString()) ? wishlistMap.get(vehicle._id.toString()) : false // Get wishlist status from the map
        }));


        if (allSearchResult.length == 0) {
            return { status: true, message: API_RESP_CODES.SEARCH_EMPTY.message, data: null };
        }

        await session.commitTransaction();

        returnResult.status = true;
        returnResult.message = 'Filtered Successfully';
        returnResult.data = allSearchResult;


        return returnResult;

    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}


