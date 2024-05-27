const errorCodes = {
    SUCCESS: {
        Text: 'Success',
        Value: 200,
    },
    BAD_REQUEST: {
        Text: 'Bad Request',
        Value: 400,
    },
    UNAUTHORIZED: {
        Text: 'Unauthorized',
        Value: 401,
    },
    INTERNAL_SERVER_ERROR: {
        Text: 'Internal Server Error',
        Value: 500,
    },
    PAGE_NOT_FOUND: {
        Text: 'Page not found',
        Value: 404,
    },
    NOT_REGISTERED: {
        Text: 'User not registered',
        Value: 401,
    },
    DELETED_SUCCESS: {
        Text: 'Deleted successfully',
        Value: 200,
    },

};

const commonCodes = {
    SUCCESS: {
        status: '200',
        message: 'Success',
    },
    NORECORDS: {
        status: '97',
        message: 'No Records to Send',
    },
    PARAM_ERR: {
        status: '400',
        message: 'Parameter error',
    },
    SERVER_ERR: {
        status: '99',
        message: 'Internal Server error',
    },
    PAGE_NOT_FOUND: {
        status: '404',
        message: 'Page not found',
    },
    APP_TRANSACTION_ERROR: {
        status: '402',
        message: 'App Transaction Error',
    },
    APP_FUNCTION_ERROR: {
        status: '500',
        message: 'App Function Error',
    },
    CREDENTIAL: {
        message: 'Unauthorized',
        status: '401',
    },
    AUTH_ERR: {
        message: 'Invalid Credentials',
        status: '401',
    },
};

const API_RESP_CODES = {
    HTTP_SUCCESS: {
        message: 'Success',
        status: 200,
    },
    HTTP_BAD_REQUEST: {
        message: 'Bad Request',
        status: 400,
    },
    HTTP_UNAUTHORIZED: {
        message: 'Unauthorized',
        status: 401,
    },
    HTTP_SERVER_ERR: {
        message: 'Internal Server Error',
        status: 500,
    },
    PAGE_NOT_FOUND: {
        message: 'Page not found',
        status: 404,
    },
    APP_PARAM_ERROR: {
        status: '400',
        message: 'Parameter error',
    },
    AUTHENTICATION_REQUIRED: {
        status: 511,
        message: 'Authentication required',
    },
    TOKEN_INVALID: {
        status: 498,
        message: 'Invaild token entered',
    },
    OTP_SUCCESS: {
        status: 200,
        message: 'OTP send successfully to registered mobile number',
    },
    OTP_INVALID: {
        status: 410,
        message: 'OTP is invalid or expired',
    },
    VEHICLE_EXIST: {
        status: 400,
        message: 'Vehicle already exists in wishlist',
    },
    VEHICLE_EXIST_INQUIRY: {
        status: 400,
        message: 'Vehicle already exists in inquiry',
    },
    VEHICLE_NOT_EXIST: {
        status: 404,
        message: 'Vehicle does not exist in wishlist',
    },
    WISHLIST_EMPTY: {
        status: 200,
        message: 'No vehicles added to wishlist',
    },
    INQUIRES_EMPTY: {
        status: 200,
        message: 'No vehicles added to inquires',
    },
    SEARCH_EMPTY: {
        status: 200,
        message: 'No data to be found',
    },
    VEHICLE_LISTING_EMPTY: {
        status: 200,
        message: 'No listings found',
    },
    ONE_AUCTION_NOT_FOUND: {
        status: 200,
        message: 'No auction found',
    },
    BID_FOUND: {
        status: 200,
        message: 'No bid found',
    },
    VEHICLE_LISTING_SUCCESS: {
        status: 200,
        message: 'All listings fetched',
    },
    ONE_AUCTION_FOUND: {
        status: 200,
        message: 'Auction fetched successfully',
    },
    BID_PLACED: {
        status: 200,
        message: 'Bid placed successfully',
    },
    VEHICLE_CANT_B_F: {
        status: 404,
        message: 'Vehicle cannot be found',
    },
    VEHICLE_CAN_BE_F: {
        status: 200,
        message: 'Vehicle found',
    },
    USER_NOT_FOUND: {
        status: 400,
        message: 'User not found',
    },
    WRONG_PASSWORD: {
        status: 401,
        message: 'Wrong password entered',
    },
    VEHICLE_CREATION: {
        status: 201,
        message: 'Vehicle added successfully',
    },
    VEHICLE_EDIT: {
        status: 201,
        message: 'Vehicle edited successfully',
    },
};

const ErrorMessages = {
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    APPLICATION_KEY_INVALID: 'APPLICATION_KEY_INVALID',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    JWT_SECRET_MISSING: 'JWT_SECRET_MISSING',
    JWT_FAILED_TOKEN_VERIFICATION: 'JWT_FAILED_TOKEN_VERIFICATION',
    AUTHENTICATION_SUCCESS: 'AUTHENTICATION_SUCCESS',
    TOKEN_RENEWED: 'TOKEN_RENEWED',
    TOKEN_INVALID: 'TOKEN_INVALID',
    TOKEN_VALID: 'TOKEN_VALID',
    SESSION_EXPIRED: 'SESSION_EXPIRED',
    ACCOUNT_LOCKED_MULTIPLE_ATTEMPTS: 'ACCOUNT_LOCKED_MULTIPLE_ATTEMPTS',
    ACCOUNT_IS_INACTIVE: 'ACCOUNT_IS_INACTIVE',
    ACCOUNT_IS_DEACTIVATED: 'ACCOUNT_IS_DEACTIVATED',
    ACCOUNT_IS_BLOCKED: 'ACCOUNT_IS_BLOCKED',
    OTP_INVALID: 'OTP_INVALID',
    OTP_EXPIRED: 'OTP_EXPIRED',
    USER_UPDATE_SUCCESS: 'USER UPDATED SUCCESSFULLY',
    BRAND_NOT_FOUND: 'BRAND NOT FOUND',

};

module.exports = {
    errorCodes,
    API_RESP_CODES,
    ErrorMessages
};
