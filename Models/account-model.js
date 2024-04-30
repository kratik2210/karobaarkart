const { default: mongoose } = require("mongoose");
const OTP = require("../Schema/otpSchema");
const Users = require("../Schema/usersSchema")
const _g = require('../Utils/GlobalFunctions');
const { JWT_EXPIRY_IN_HOURS, JWT_REFRESH_EXPIRY_IN_HOURS } = require("../Utils/common/constants");
const LoginToken = require("../Schema/loginTokenSchema");
const { ErrorMessages } = require('../Utils/common/error-codes')

exports.verifyOTP = async (formData) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {

        const { phoneNumber, otpCode } = formData
        let returnResult = { status: false, message: '', data: null };
        const dateTimeNow = new Date();

        const user = await Users.findOne({ phoneNumber }).select({
            _id: 1,
            userName: 1,
            phoneNumber: 1,
            email: 1
        })
        if (!user) {
            returnResult.message = ErrorMessages.OTP_EXPIRED;
            return returnResult;
        }


        const otpValid = await OTP.findOne({ phoneNumber, otpCode })
        if (!otpValid) {
            returnResult.message = ErrorMessages.OTP_INVALID;
            return returnResult;
        }


        const jwtToken = await _g.generateToken(user.toObject());
        const jwtRefreshToken = await _g.generateRefreshToken(user.toObject());



        /* Save token */
        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours() + JWT_EXPIRY_IN_HOURS);
        const currentDateRefresh = new Date();
        currentDateRefresh.setHours(currentDate.getHours() + JWT_REFRESH_EXPIRY_IN_HOURS);

        const loginToken = new LoginToken({
            loginSessionId: user._id,
            token: jwtToken,
            refreshToken: jwtRefreshToken,
            tokenExpiryTime: currentDate,
            refreshTokenExpiryTime: currentDateRefresh,
        })
        await loginToken.save();

        returnResult.status = true;
        returnResult.message = ErrorMessages.AUTHENTICATION_SUCCESS;
        returnResult.data = { ...user._doc, token: jwtToken, refreshToken: jwtRefreshToken };
        await session.commitTransaction();
        return returnResult;
    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}