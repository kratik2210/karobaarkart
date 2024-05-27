const Logger = require("../Utils/logger/log.config");
const vehicleModel = require('../Models/vehicle-model')

exports.vehicleCreation = function (formData) {
    try {
        return vehicleModel.createVehicle(formData);
    } catch (error) {
        Logger.error(` ${new Date()} Authentication::vehicleCreation:${error}`);
        throw error;
    }
}
exports.vehicleListingService = function (userId, pagination) {
    try {
        return vehicleModel.getAllVehicleListing(userId, pagination);
    } catch (error) {
        Logger.error(` ${new Date()} Authentication::verifyOTP:${error}`);
        throw error;
    }
}

exports.singleVehicleService = function (vehicleId) {
    try {
        return vehicleModel.getSingleVehicle(vehicleId);
    } catch (error) {
        Logger.error(` ${new Date()} Authentication::verifyOTP:${error}`);
        throw error;
    }
}

exports.vehicleEditService = function (vehicleId, formData) {
    try {
        return vehicleModel.editVehicleModel(vehicleId, formData);
    } catch (error) {
        Logger.error(` ${new Date()} Authentication::vehicleCreation:${error}`);
        throw error;
    }
}


