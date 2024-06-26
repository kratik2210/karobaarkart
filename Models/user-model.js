const { default: mongoose } = require("mongoose");
const OTP = require("../Schema/otpSchema");
const Users = require("../Schema/usersSchema")
const _g = require('../Utils/GlobalFunctions');
const { JWT_EXPIRY_IN_HOURS, JWT_REFRESH_EXPIRY_IN_HOURS } = require("../Utils/common/constants");
const LoginToken = require("../Schema/loginTokenSchema");
const { ErrorMessages } = require('../Utils/common/error-codes')

exports.profileUpdate = async (formData, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);
        if (!isValidObjectId) {
            return { status: false, message: 'Invalid user ID format', data: null };
        }

        const {
            userName,
            address,
            phoneNumber,
            email,
            userType,
            firmName,
            docNo,
            bankAccNo,
            bankAccName,
            ifscCode,
            businessProofPath,
            docImagePath,
            isApproved
        } = formData;
        let returnResult = { status: false, message: '', data: null };
        const user = await Users.findOne({ _id: userId })

        if (!user) {
            returnResult.message = ErrorMessages.USER_NOT_FOUND;
            return returnResult;
        }

        const needToUpdateData = {};

        if (userName) needToUpdateData.userName = userName;
        if (address) needToUpdateData.address = address;
        if (email) needToUpdateData.email = email;
        // if (userType) needToUpdateData.userType = userType;
        if (firmName) needToUpdateData.firmName = firmName;
        if (docNo) needToUpdateData.docNo = docNo;
        if (bankAccNo) needToUpdateData.bankAccNo = bankAccNo;
        if (bankAccName) needToUpdateData.bankAccName = bankAccName;
        if (ifscCode) needToUpdateData.ifscCode = ifscCode;
        if (businessProofPath) needToUpdateData.businessProof = businessProofPath;
        if (docImagePath) needToUpdateData.docImage = docImagePath;
        if (isApproved) needToUpdateData.isApproved = isApproved;

        needToUpdateData.updatedBy = userId
        needToUpdateData.updatedAt = Date.now()
        Object.assign(user, needToUpdateData);

        await user.save();

        returnResult.status = true;
        returnResult.message = ErrorMessages.USER_UPDATE_SUCCESS;
        returnResult.data = user;
        await session.commitTransaction();
        return returnResult;

    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

exports.getAllUsersModel = async (userId, userType, isApproved) => {
    const isApprovedBool = Boolean(isApproved);

    return new Promise(async (resolve, reject) => {
        try {
            let getAllUsers
            if (userType == '') {
                getAllUsers = await Users.find().exec()
                resolve(getAllUsers);
            } else if (userType == 'user') {
                getAllUsers = await Users.find({ userType: 'user' }).exec()
                resolve(getAllUsers);
            } else if (userType == 'dealer') {
                getAllUsers = await Users.find({ userType: 'dealer', isApproved: isApproved })
                resolve(getAllUsers);
            } else {
                reject()
            }
        } catch (error) {
            reject(error);
        }
    });
};


exports.oneUserModel = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {

            let getOneUser = await Users.findById(userId).exec()
            if (!getOneUser) {
                resolve('User not found');
            } else {
                resolve(getOneUser);
            }

        } catch (error) {
            reject(error);
        }
    });
};