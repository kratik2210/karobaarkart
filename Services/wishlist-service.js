const Logger = require("../Utils/logger/log.config");
const WishlistModel = require('../Models/wishlist-inquiry-model')

exports.addToWishlistService = function (formData, userId) {
    try {
        return WishlistModel.addingToWishlist(formData, userId);
    } catch (error) {
        Logger.error(` ${new Date()} Authentication::verifyOTP:${error}`);
        throw error;
    }
}



exports.removeFromWishlistService = async function (formData, userId) {
    try {
        return await WishlistModel.removingFromWishlist(formData, userId);
    } catch (error) {
        Logger.error(` ${new Date()} Authentication::verifyOTP:${error}`);
        throw error;
    }
}


exports.allWishlistService = async function (userId) {
    try {
        return await WishlistModel.getAllWishlist(userId);
    } catch (error) {
        Logger.error(` ${new Date()} Authentication::verifyOTP:${error}`);
        throw error;
    }
}

exports.addToInquiryService = function (formData, userId) {
    try {
        return WishlistModel.addingToInquiry(formData, userId);
    } catch (error) {
        Logger.error(` ${new Date()} Authentication::verifyOTP:${error}`);
        throw error;
    }
}
exports.allInquiryService = async function (userId) {
    try {
        return await WishlistModel.getAllInquires(userId);
    } catch (error) {
        Logger.error(` ${new Date()} Authentication::verifyOTP:${error}`);
        throw error;
    }
}