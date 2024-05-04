const _g = require("../Utils/GlobalFunctions");
const { errorCodes, API_RESP_CODES } = require("../Utils/common/error-codes");
const UserService = require("../Services/user-service");
const { ErrorMessages } = require("../Utils/common/error-codes");
const { errorHandler } = require("../Utils/common/api-middleware");
const { validateUser } = require("../Utils/common/validator");

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
