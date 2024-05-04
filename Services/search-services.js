const Logger = require("../Utils/logger/log.config");
const searchModel = require('../Models/search-model')

exports.searchWishlistInquiryService = function (formData, userId, type) {
    try {
        return searchModel.searchingWishlistInquiry(formData, userId, type);
    } catch (error) {
        Logger.error(` ${new Date()} Searching Wishlist and Inquiry :searchWishlistInquiryService${error}`);
        throw error;
    }
}

exports.searchVehicleService = function (formData, userId, type) {
    try {
        return searchModel.searchingVehicles(formData, userId, type);
    } catch (error) {
        Logger.error(` ${new Date()} Searching Vehicles :searchVehicleService${error}`);
        throw error;
    }
}


exports.filterBrandService = function (userId, type, brandId) {
    try {
        return searchModel.filterByBrand(userId, type, brandId);
    } catch (error) {
        Logger.error(` ${new Date()} Filtering Brands :filterBrandService${error}`);
        throw error;
    }
}


exports.filterByPriceRangeService = function (minPrice, maxPrice, userId) {
    try {
        return searchModel.filteringByPriceRange(minPrice, maxPrice, userId);
    } catch (error) {
        Logger.error(` ${new Date()} Filtering Brands :filterBrandService${error}`);
        throw error;
    }
}

