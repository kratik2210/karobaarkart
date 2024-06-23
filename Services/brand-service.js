const Logger = require("../Utils/logger/log.config");
const BrandModel = require('../Models/brand-model')
exports.editBrandService = function (formData, userId, brandId, brandLogo) {
    return new Promise((resolve, reject) => {
        BrandModel.editBrandModel(formData, userId, brandId, brandLogo)
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                Logger.error(` ${new Date()} editBrandService:${err}`);
                reject(err);
            });
    });
};