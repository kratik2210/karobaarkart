const JWT_EXPIRY_IN_HOURS = 30;
const JWT_REFRESH_EXPIRY_IN_HOURS = 24;
const LOGIN_MAX_INCORRECT_ATTEMPTS = 5;
const LOGIN_OTP_LENGTH = 6;
const LOGIN_OTP_EXPIRY_IN_MINUTES = 5;


const expectedParams = {
    /* {route}+{method} */
    authenticateSignUpDealer: {
        required: ['userName', 'address', 'phoneNumber', 'email', 'userType', 'firmName', 'bankAccNo', 'bankAccName', 'ifscCode', 'businessProof', 'docImage'],
        optional: [],
    },
    authenticateSignUpUser: {
        required: ['userName', 'address', 'phoneNumber', 'email', 'userType'],
        optional: [],
    },
    authenticateLogin: {
        required: ['username', 'password', 'secretKey'],
        optional: [],
    },
    authenticateValidateToken: {
        required: ['token'],
        optional: ['validateTokenOnly'],
    },
    authenticateLogout: {
        required: ['sessionId'],
        optional: [],
    },
    authenticateRenewToken: {
        required: ['refreshToken'],
        optional: ['validateTokenOnly'],
    },
    authenticateVerifyOTP: {
        required: ['phoneNumber', 'otpCode'],
        optional: [],
    },
};

module.exports = {
    expectedParams,
    JWT_EXPIRY_IN_HOURS,
    JWT_REFRESH_EXPIRY_IN_HOURS
};