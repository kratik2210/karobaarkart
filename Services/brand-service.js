const Logger = require("../Utils/logger/log.config");
const BrandModel = require('../Models/brand-model')

exports.editBrandService = function (formData, userId, brandId) {
    // try {
    //     return BrandModel.searchingWishlistInquiry(formData, userId, type);
    // } catch (error) {
    //     Logger.error(` ${new Date()} Searching Wishlist and Inquiry :searchWishlistInquiryService${error}`);
    //     throw error;
    // }

    return new Promise((resolve, reject) => {
        BrandModel
            .editBrandModel(formData, userId, brandId)
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                Logger.error(` ${new Date()} editBrandService:${err}`);

                reject(err);
            });
    });
}