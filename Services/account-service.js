const Logger = require("../Utils/logger/log.config");
const AccountModel = require('../Models/account-model')

exports.verifyOTP = function (formData) {
    try {
        return AccountModel.verifyOTP(formData);
    } catch (error) {
        Logger.error(` ${new Date()} Authentication::verifyOTP:${error}`);
        throw error;
    }
}