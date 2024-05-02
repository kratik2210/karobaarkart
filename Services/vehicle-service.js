const Logger = require("../Utils/logger/log.config");
const vehicleModel = require('../Models/vehicle-model')

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


