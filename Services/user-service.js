const Logger = require("../Utils/logger/log.config");
const UserModel = require('../Models/user-model')

exports.userProfileUpdate = function (formData, userId) {
    try {
        return UserModel.profileUpdate(formData, userId);
    } catch (error) {
        Logger.error(` ${new Date()} Authentication::verifyOTP:${error}`);
        throw error;
    }
}