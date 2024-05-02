const { default: mongoose } = require("mongoose");
const Wishlist = require("../Schema/wishlistInquirySchema")
const _g = require('../Utils/GlobalFunctions');
const { API_RESP_CODES } = require('../Utils/common/error-codes')

exports.addingToWishlist = async (formData, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let returnResult = { status: false, message: '', data: null };

        const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);
        if (!isValidObjectId) {
            return { status: false, message: 'Invalid user ID format', data: null };
        }

        const {
            vehicleId
        } = formData;

        const existingWishlistItem = await Wishlist.findOne({ userId, vehicleId, wishlist: true, });

        if (existingWishlistItem) {
            return { status: false, message: API_RESP_CODES.VEHICLE_EXIST.message, data: null };
        }


        const newWishlistItem = new Wishlist({
            vehicleId,
            userId: userId,
            createdBy: userId,
            updatedBy: userId,
            wishlist: true,
        });

        const savedWishlistItem = await newWishlistItem.save();

        await session.commitTransaction();

        returnResult.status = true;
        returnResult.message = 'Vehicle added to wishlist successfully';
        returnResult.data = savedWishlistItem;


        return returnResult;

    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}



exports.removingFromWishlist = async (formData, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let returnResult = { status: false, message: '', data: null };

        const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);
        if (!isValidObjectId) {
            return { status: false, message: 'Invalid user ID format', data: null };
        }

        const {
            vehicleId
        } = formData;

        const existingWishlistItem = await Wishlist.findOne({ userId, vehicleId, wishlist: true });

        if (!existingWishlistItem) {
            return { status: false, message: API_RESP_CODES.VEHICLE_NOT_EXIST.message, data: null };
        }


        const removeWishlistItem = await Wishlist.findOneAndUpdate(
            { userId, vehicleId, wishlist: true },
            { wishlist: false }
        );

        if (!removeWishlistItem) {
            throw new Error('Vehicle not found in wishlist');
        }

        await session.commitTransaction()
        return { success: true, message: 'Vehicle removed from wishlist successfully', data: null };


    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

exports.getAllWishlist = async (userId) => {

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let returnResult = { status: false, message: '', data: null };

        const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);
        if (!isValidObjectId) {
            return { status: false, message: 'Invalid user ID format', data: null };
        }

        const allWishlistItems = await Wishlist.find({ userId, wishlist: true }).populate('vehicleId');

        if (!allWishlistItems) {
            return { status: false, message: API_RESP_CODES.WISHLIST_EMPTY.message, data: null };
        }

        await session.commitTransaction();

        returnResult.status = true;
        returnResult.message = 'Wishlist fetched successfully';
        returnResult.data = allWishlistItems;


        return returnResult;

    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}
exports.addingToInquiry = async (formData, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let returnResult = { status: false, message: '', data: null };

        const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);
        if (!isValidObjectId) {
            return { status: false, message: 'Invalid user ID format', data: null };
        }

        const {
            vehicleId
        } = formData;

        const existingInquiryItem = await Wishlist.findOne({ userId, vehicleId, inquiry: true, });

        if (existingInquiryItem) {
            return { status: false, message: API_RESP_CODES.VEHICLE_EXIST_INQUIRY.message, data: null };
        }


        const newInquiryItem = new Wishlist({
            vehicleId,
            userId: userId,
            createdBy: userId,
            updatedBy: userId,
            inquiry: true,
        });

        const savedWishlistItem = await newInquiryItem.save();

        await session.commitTransaction();

        returnResult.status = true;
        returnResult.message = 'Vehicle added to inquiry successfully';
        returnResult.data = newInquiryItem;


        return returnResult;

    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}


exports.getAllInquires = async (userId) => {

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let returnResult = { status: false, message: '', data: null };

        const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);
        if (!isValidObjectId) {
            return { status: false, message: 'Invalid user ID format', data: null };
        }

        const allInquiryItems = await Wishlist.find({ userId, inquiry: true }).populate('vehicleId');

        if (!allInquiryItems) {
            return { status: false, message: API_RESP_CODES.INQUIRES_EMPTY.message, data: null };
        }

        await session.commitTransaction();

        returnResult.status = true;
        returnResult.message = 'Inquires fetched successfully';
        returnResult.data = allInquiryItems;


        return returnResult;

    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}