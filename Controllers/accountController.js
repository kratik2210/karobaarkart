const Users = require("../Schema/usersSchema");
const _g = require("../Utils/GlobalFunctions");
const { expectedParams } = require("../Utils/common/constants");
const { errorCodes, API_RESP_CODES } = require("../Utils/common/error-codes");
const { userSignUp, userLogin, validateAdminLogin } = require("../Utils/common/validator");
const { getMissingParams, generateOTP } = require("../Utils/common/sharedLib");
const OTP = require("../Schema/otpSchema");
const AccountService = require("../Services/account-service");
const { ErrorMessages } = require("../Utils/common/error-codes");
const { errorHandler } = require("../Utils/common/api-middleware");


const getUserExistenceErrorMessage = (
    existUser,
    email,
    userName,
    phoneNumber
) => {
    if (existUser.email === email) {
        return "Email already exists.";
    } else if (existUser.userName === userName) {
        return "Username already exists.";
    } else if (existUser.phoneNumber === phoneNumber) {
        return "Phone number already exists.";
    }
    return "Email, Username, or Phone Number already exists.";
};

exports.accountRegister = async (req, res) => {
    try {
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
        } = req.body;

        const userData = { userName, address, phoneNumber, email, userType };

        const businessProofPath = req.files.businessProof
            ? req.files.businessProof[0].path
            : null;
        const docImagePath = req.files.docImage ? req.files.docImage[0].path : null;

        const missingParams =
            userType === "dealer"
                ? getMissingParams(expectedParams.authenticateSignUpDealer, {
                    ...req.body,
                    businessProof: businessProofPath,
                    docImage: docImagePath,
                })
                : getMissingParams(expectedParams.authenticateSignUpUser, userData);

        if (missingParams) {
            return res
                .status(errorCodes.BAD_REQUEST.Value)
                .json({ success: false, message: missingParams, data: null });
        }

        const { error } = userSignUp({
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

        const existUser = await Users.findOne({
            $or: [{ email }, { userName }, { phoneNumber }],
        });

        if (existUser) {
            const errorMessage = getUserExistenceErrorMessage(
                existUser,
                email,
                userName,
                phoneNumber
            );
            return res
                .status(403)
                .json({ success: false, message: errorMessage, data: null });
        }

        let createdUser = {
            userName,
            address,
            phoneNumber,
            email,
            userType,
        };

        if (userType === "dealer") {
            createdUser = {
                ...createdUser,
                firmName,
                docNo,
                bankAccNo,
                bankAccName,
                ifscCode,
                businessProof: businessProofPath,
                docImage: docImagePath,
            };
        }

        const user = await Users.create(createdUser);
        if (req.user?._id) {
            user.createdBy = req.user._id
            user.updatedBy = req.user._id
        } else {
            user.createdBy = user._id;
            user.updatedBy = user._id;
        }

        await user.save();

        const successMessage =
            userType === "dealer"
                ? "Dealer registered successfully."
                : "User registered successfully.";
        return res
            .status(201)
            .json({ success: true, message: successMessage, data: user });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyValue) {
            return res.status(400).json({ success: false, message: 'Key already present in the database,Unique key required', error: error.keyValue });
        }
        return res
            .status(500)
            .json({ success: false, message: "Internal server error.", data: null });
    }
};

exports.loginAccount = async (req, res) => {
    const requestTime = req._startTime;
    try {
        const { phoneNumber } = req.body;

        const { error } = userLogin(phoneNumber);

        if (error) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: error.details[0].message,
                    data: null,
                });
        }

        // Check if the user exists
        const user = await Users.findOne({ phoneNumber });
        if (!user) {
            return res
                .status(errorCodes.NOT_REGISTERED.Value)
                .json({ success: false, message: errorCodes.NOT_REGISTERED.Text });
        }

        // const otpPresent = await OTP.findOne({ phoneNumber }).sort({ createdAt: -1 });

        // if (otpPresent && (requestTime - otpPresent.createdAt) < 60000) {
        //     return res.status(429).json({ success: false, message: 'Rate limit exceeded. Please try again later.' });
        // }

        // // Generate OTP
        // if (!otpPresent) {
        const otp = generateOTP();

        // Set expiry time for OTP (5 minutes)
        const otpExpiry = requestTime.setMinutes(requestTime.getMinutes() + 2);

        // Save OTP to the database
        await OTP.create({
            phoneNumber,
            otpCode: otp,
            expiryTime: otpExpiry,
            userId: user._id,
        });

        // Send OTP to user
        res
            .status(API_RESP_CODES.OTP_SUCCESS.status)
            .json({
                success: true,
                message: API_RESP_CODES.OTP_SUCCESS.message,
                data: { otp, otpExpiry },
            });
        // }
    } catch (error) {
        res
            .status(API_RESP_CODES.HTTP_SERVER_ERR.status)
            .json({
                success: false,
                message: API_RESP_CODES.HTTP_SERVER_ERR.message,
            });
    }
};

exports.OTPverification = _g.asyncMiddlewareController(async (req, res) => {
    try {
        const { phoneNumber, otpCode } = req.body;

        const missingParams = getMissingParams(
            expectedParams.authenticateVerifyOTP,
            req.body
        );
        if (missingParams) {
            return res
                .status(errorCodes.BAD_REQUEST.Value)
                .json({ status: false, message: missingParams, data: null });
        }
        const result = await AccountService.verifyOTP({ phoneNumber, otpCode });

        let statusCode = errorCodes.SUCCESS.Value;
        let message = result.message;
        let data = result.data;

        if (result.message === ErrorMessages.USER_NOT_FOUND) {
            message = ErrorMessages.INVALID_CREDENTIALS;
        }
        if (result.message === ErrorMessages.OTP_INVALID) {
            message = API_RESP_CODES.OTP_INVALID.message;
            statusCode = API_RESP_CODES.OTP_INVALID.status;
        }

        // res.header('Authorization', `Bearer ${data.token}`);

        res.status(statusCode)
            .json({ success: result.status, message: message, data: result.data });
    } catch (error) {
        errorHandler(res, error);
    }
});


exports.adminLogin = _g.asyncMiddlewareController(async (req, res) => {
    try {
        const { phoneNumber, email, password } = req.body;

        const { error } = validateAdminLogin({
            ...req.body
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
        const result = await AccountService.adminLoginService(phoneNumber, email, password);

        let statusCode = errorCodes.SUCCESS.Value;
        let message = result.message;
        let data = result.data;

        if (result.message === API_RESP_CODES.WRONG_PASSWORD) {
            message = API_RESP_CODES.WRONG_PASSWORD.message;
            statusCode = API_RESP_CODES.WRONG_PASSWORD.status;
        }


        res.status(statusCode)
            .json({ success: result.status, message: message, data: result.data });
    } catch (error) {
        errorHandler(res, error);
    }
});

