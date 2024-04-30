const { default: mongoose } = require("mongoose");
const OTP = require("../Schema/otpSchema");
const Users = require("../Schema/usersSchema")
const Wishlist = require("../Schema/wishlistSchema")
const _g = require('../Utils/GlobalFunctions');
const { JWT_EXPIRY_IN_HOURS, JWT_REFRESH_EXPIRY_IN_HOURS } = require("../Utils/common/constants");
const LoginToken = require("../Schema/loginTokenSchema");
const { ErrorMessages, API_RESP_CODES } = require('../Utils/common/error-codes')

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

        const existingWishlistItem = await Wishlist.findOne({ userId, vehicleId });

        if (existingWishlistItem) {
            return { status: false, message: API_RESP_CODES.VEHICLE_EXIST.message, data: null };
        }


        const newWishlistItem = new Wishlist({
            vehicleId,
            userId: userId,
            createdBy: userId,
            updatedBy: userId,
            bucketStatus: 'wishlist',
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