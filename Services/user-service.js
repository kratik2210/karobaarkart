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

exports.allUsersService = function (userId, userType, isApproved) {

    return new Promise((resolve, reject) => {
        UserModel
            .getAllUsersModel(userId, userType, isApproved)
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                Logger.error(` ${new Date()} allUsersService:${err}`);
                reject(err);
            });
    });
}


exports.oneUserService = function (userId) {

    return new Promise((resolve, reject) => {
        UserModel
            .oneUserModel(userId)
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                Logger.error(` ${new Date()} allUsersService:${err}`);
                reject(err);
            });
    });
}