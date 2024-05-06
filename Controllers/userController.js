const ObjectId = require('mongoose').Types.ObjectId;
const _g = require("../Utils/GlobalFunctions");
const { errorCodes, API_RESP_CODES } = require("../Utils/common/error-codes");
const UserService = require("../Services/user-service");
const { ErrorMessages } = require("../Utils/common/error-codes");
const { errorHandler, apiValidResponse, internalErrResp, validateErrResp } = require("../Utils/common/api-middleware");
const { validateUser } = require("../Utils/common/validator");
const Users = require("../Schema/usersSchema")

exports.updateUser = _g.asyncMiddlewareController(async (req, res) => {
    try {
        const id = req.query.userId
        const userId = id ? id : req.user._id;

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


        let statusCode = errorCodes.SUCCESS.Value;
        let message = result.message;
        let data = result.data;


        if (result.message === ErrorMessages.USER_NOT_FOUND) {
            message = ErrorMessages.USER_NOT_FOUND;
        }



        res
            .status(statusCode)
            .json({ success: result.status, message: message, data: data });

    } catch (error) {
        errorHandler(res, error);
    }
})

exports.getAllUsers = _g.asyncMiddlewareController(async (req, res) => {

    const userId = req.user._id;
    const userType = req.query.userType
    const isApproved = req.query.isApproved
    await UserService.allUsersService(userId, userType, isApproved).then((dataResult) => {
        let returnResponse = dataResult;
        apiValidResponse(res, returnResponse, 'Data fetched successfully');
    }).catch((err) => {
        internalErrResp(res, err, 'getAllUsers');
    });


})


exports.getOneUser = _g.asyncMiddlewareController(async (req, res) => {

    const userId = req.query.userId;

    if (!ObjectId.isValid(userId)) {
        return validateErrResp(res, 400, 'Invalid user ID format');
    }
    await UserService.oneUserService(userId).then((dataResult) => {
        let returnResponse = dataResult;

        if (typeof returnResponse === 'string') {
            return apiValidResponse(res, [], returnResponse);
        }
        apiValidResponse(res, returnResponse, 'Data fetched successfully');
    }).catch((err) => {
        internalErrResp(res, err, 'getAllUsers');
    });


})



exports.isApproved = async (req, res) => {
    try {
        const { isApproved, userId } = req.query;
        const isApprovedBool = Boolean(isApproved);

        const adminId = req.user._id

        if (!isApproved || !userId) {
            return res.status(400).json({ success: false, message: 'User Id and isApproved keys should be present' });
        }

        const user = await Users.findOneAndUpdate(
            { _id: userId },
            {
                updatedBy: adminId,
                isApproved: isApprovedBool
            },
            { new: true }
        )

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'User status changed successfully',
            data: user,
        });


    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};





