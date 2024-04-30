const Users = require("../Schema/usersSchema");
const _g = require("../Utils/GlobalFunctions");
const { expectedParams } = require("../Utils/common/constants");
const { errorCodes, API_RESP_CODES } = require("../Utils/common/error-codes");
const { userSignUp, userLogin, validateUser } = require("../Utils/common/validator");
const { getMissingParams, generateOTP } = require("../Utils/common/sharedLib");
const { default: mongoose } = require("mongoose");
const UserService = require("../Services/user-service");
const { ErrorMessages } = require("../Utils/common/error-codes");
const { errorHandler } = require("../Utils/common/api-middleware");

exports.updateUser = _g.asyncMiddlewareController(async (req, res) => {
    try {
        const userId = req.user._id;
        const {
            userName,
            address,
            email,
            userType,
            firmName,
            docNo,
            bankAccNo,
            bankAccName,
            ifscCode,
        } = req.body;



        const businessProofPath = req.files.businessProof
            ? req.files.businessProof[0].path
            : undefined;

        const docImagePath = req.files.docImage
            ? req.files.docImage[0].path
            : undefined;


        const { error } = validateUser({
            ...req.body,
            businessProof: businessProofPath,
            docImage: docImagePath,
        });

        if (error) {

            return res
                .status(400)
                .json({
                    success: false,
                    message: error.details[0].message,
                    data: null,
                });
        }
        const formData = {
            ...req.body,
            businessProof: businessProofPath,
            docImage: docImagePath,
        }
        const result = await UserService.userProfileUpdate(formData, userId);
        console.log("🚀 ~ exports.updateUser=_g.asyncMiddlewareController ~ result:", result)

        // const userFound = await Users.findOne({ _id: userId });

        // if (!userFound) {
        //     return res.status(400).json({ success: false, message: 'User not found', data: null });
        // }

        let statusCode = errorCodes.SUCCESS.Value;
        let message = result.message;
        let data = result.data;

        // const needToUpdateData = {};

        // if (userName) needToUpdateData.userName = userName;
        // if (address) needToUpdateData.address = address;
        // if (email) needToUpdateData.email = email;
        // if (userType) needToUpdateData.userType = userType;
        // if (firmName) needToUpdateData.firmName = firmName;
        // if (docNo) needToUpdateData.docNo = docNo;
        // if (bankAccNo) needToUpdateData.bankAccNo = bankAccNo;
        // if (bankAccName) needToUpdateData.bankAccName = bankAccName;
        // if (ifscCode) needToUpdateData.ifscCode = ifscCode;
        // if (businessProofPath) needToUpdateData.businessProof = businessProofPath;
        // if (docImagePath) needToUpdateData.docImage = docImagePath;
        // needToUpdateData.updatedBy = userId
        // needToUpdateData.updatedAt = Date.now()
        // Object.assign(userFound, needToUpdateData);

        // await userFound.save();

        if (result.message === ErrorMessages.USER_NOT_FOUND) {
            message = ErrorMessages.USER_NOT_FOUND;
        }



        res
            .status(statusCode)
            .json({ success: result.status, message: message, data: data });

        // res.status(200).json({ success: true, message: 'User updated successfully', data: userFound });
    } catch (error) {
        errorHandler(res, error);
    }
})
