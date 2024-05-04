const Joi = require('joi');

function userSignUp(user) {
    try {
        const schema = Joi.object({
            userName: Joi.string().required().trim().min(3).max(50)
                .regex(/^[a-zA-Z\s]+$/)
                .message('Username must contain only letters and spaces'),

            address: Joi.string().required().trim(),

            phoneNumber: Joi.string().required().trim()
                .regex(/^[6-9]\d{9}$/)
                .message('Phone number must be a 10-digit number starting with 6, 7, 8, or 9'),

            email: Joi.string().email().required().trim()
                .regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
                .message('Invalid email format'),

            userType: Joi.string().valid('admin', 'user', 'dealer').required(),

            firmName: Joi.string().allow(null).default(null).trim(),

            docNo: Joi.string().allow(null).default(null).trim()
                .regex(/^\d{10}$|^\d{12}$/)
                .message('Document number must be either 10 or 12 digits'),

            businessProof: Joi.string().allow(null).default(null),

            bankAccNo: Joi.string().allow(null).default(null).trim()
                .regex(/^\d{11}$|^\d{12}$|^\d{14}$/)
                .message('Bank account number must be either 11, 12, or 14 digits'),

            bankAccName: Joi.string().allow(null).default(null).trim(),

            ifscCode: Joi.string().allow(null).default(null).trim()
                .regex(/^\d{11}$/)
                .message('IFSC code must be 11 digits'),

            docImage: Joi.string().allow(null).default(null),
        });

        return schema.validate({
            userName: user.userName,
            address: user.address,
            phoneNumber: user.phoneNumber,
            email: user.email,
            userType: user.userType,
            firmName: user.firmName,
            docNo: user.docNo,
            businessProof: user.businessProof,
            bankAccNo: user.bankAccNo,
            bankAccName: user.bankAccName,
            ifscCode: user.ifscCode,
            docImage: user.docImage,
        });
    } catch (error) {
        return false;
    }
}


function validateUser(user) {
    try {
        const schema = Joi.object({
            userName: Joi.string().trim().min(3).max(50)
                .regex(/^[a-zA-Z\s]+$/)
                .message('Username must contain only letters and spaces'),

            address: Joi.string().trim(),

            phoneNumber: Joi.string().trim()
                .regex(/^[6-9]\d{9}$/)
                .message('Phone number must be a 10-digit number starting with 6, 7, 8, or 9'),

            email: Joi.string().email().trim()
                .regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
                .message('Invalid email format'),

            userType: Joi.string().valid('admin', 'user', 'dealer'),

            firmName: Joi.string().allow(null).trim(),

            docNo: Joi.string().allow(null).trim()
                .regex(/^\d{10}$|^\d{12}$/)
                .message('Document number must be either 10 or 12 digits'),

            businessProof: Joi.string().allow(null),

            bankAccNo: Joi.string().allow(null).trim()
                .regex(/^\d{11}$|^\d{12}$|^\d{14}$/)
                .message('Bank account number must be either 11, 12, or 14 digits'),

            bankAccName: Joi.string().allow(null).trim(),

            ifscCode: Joi.string().allow(null).trim()
                .regex(/^\d{11}$/)
                .message('IFSC code must be 11 digits'),

            docImage: Joi.string().allow(null),
        });

        return schema.validate(user, { allowUnknown: true });
    } catch (error) {
        return false;
    }
}


function validateEditBrand(data) {
    try {
        const schema = Joi.object({
            brandName: Joi.string().trim().min(3).max(50)
                .regex(/^[a-zA-Z\s]+$/)
                .message('Username must not be empty'),

            description: Joi.string().allow(null).trim().message('Description must not be empty'),

            brandLogo: Joi.string().allow(null),


        });

        return schema.validate(data, { allowUnknown: true });
    } catch (error) {
        return false;
    }
}


function validateWishlist(data) {
    try {
        const schema = Joi.object({
            vehicleId: Joi.string()
                .pattern(/^[a-fA-F0-9]{24}$/)
                .required()
                .messages({
                    'any.required': 'Vehicle ID cannot be empty',
                    'string.pattern.base': 'Vehicle ID should contain 24 characters'
                })

        });

        return schema.validate(data);
    } catch (error) {
        return false;
    }
}

function validateAdminLogin(data) {
    try {
        const schema = Joi.object({
            // phoneNumber: Joi.string()
            //     .length(10)
            //     .pattern(/^[0-9]+$/)
            //     .when(Joi.object({ email: Joi.string().empty('') }).unknown(), {
            //         then: Joi.string().required(),
            //         otherwise: Joi.string().empty('')
            //     })
            //     .messages({
            //         'string.base': 'Phone number must be a string',
            //         'string.length': 'Phone number must be exactly 10 digits',
            //         'string.pattern.base': 'Phone number must contain only digits (0-9)'
            //     }),

            email: Joi.string()
                .email({ minDomainSegments: 2 })
                .when(Joi.object({ phoneNumber: Joi.string().empty('') }).unknown(), {
                    then: Joi.string().required(),
                    otherwise: Joi.string().empty('')
                })
                .messages({
                    'string.email': 'Email must be a valid email address',
                    'string.minDomainSegments': 'Email must have at least two domain segments',
                }),

            password: Joi.string().required().messages({
                'any.required': 'Password is required',
            })
        });

        return schema.validate(data);
    } catch (error) {
        return false;
    }
}

function validateSearchWishlistInquiry(data) {
    try {
        const schema = Joi.object({
            searchTerm: Joi.string()
                .min(1)
                .max(50)
                .required()
                .messages({
                    'any.required': 'Search term is required',
                    'string.empty': 'Search term cannot be empty',

                }),
            type: Joi.string()
                .valid('wishlist', 'inquiry', 'Wishlist', 'Inquiry')
                .messages({
                    'any.only': 'Type must be wishlist or inquiry',
                })
        });

        return schema.validate(data);
    } catch (error) {
        return false;
    }
}
function validateSearchVehicle(data) {
    try {
        const schema = Joi.object({
            searchTerm: Joi.string()
                .min(1)
                .max(50)
                .required()
                .messages({
                    'any.required': 'Search term is required',
                    'string.empty': 'Search term cannot be empty',

                }),
            type: Joi.string()
                .valid('new', 'used', 'New', 'Used')
                .messages({
                    'any.only': 'Type must be used or new',
                })
        });

        return schema.validate(data);
    } catch (error) {
        return false;
    }
}







function userLogin(mobile) {
    try {
        const schema = Joi.object({
            phoneNumber: Joi.string().required().trim()
                .regex(/^[6-9]\d{9}$/)
                .message('Phone number must be a 10-digit number starting with 6, 7, 8, or 9')
        });

        return schema.validate({
            phoneNumber: mobile,
        });
    } catch (error) {
        return false;
    }
}

function formInsert(formDTO) {
    try {
        const schema = Joi.object({
            Name: Joi.string().min(3).max(500).required(),
            EmailId: Joi.string().required(),
            DOB: Joi.string().required(),
            CompanyName: Joi.string().required(),
        }).with('Name', 'EmailId');
        return schema.validate({
            Name: formDTO.Name,
            EmailId: formDTO.EmailId,
            DOB: formDTO.DOB,
            CompanyName: formDTO.CompanyName,
        });
    } catch (error) {
        return false;
    }
}

function authenticateUser(authNTtoken, authenticateUserDTO) {
    try {
        const schema = Joi.object({
            username: Joi.string().min(3).max(500).required(),
            authNTtoken: Joi.string().min(3).max(500).required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        }).with('username', 'password');

        return schema.validate({
            username: authenticateUserDTO.username,
            password: authenticateUserDTO.password,
            authNTtoken: authNTtoken,
        });
    } catch (error) {
        return false;
    }
}

function appAuthNHandler(authNTtoken) {
    try {
        const schema = Joi.object().keys({
            authNTtoken: Joi.string().min(3).max(500).required(),
        });

        return schema.validate({
            authNTtoken: authNTtoken,
        });
    } catch (error) {
        return false;
    }
}

function appAuthZHandler(appAuthZHandlerDTO) {
    try {
        const schema = Joi.object()
            .keys({
                username: Joi.string().min(3).max(30).required(),
                authZToken: Joi.string().min(3).required(),
            })
            .with('username', 'authZToken');

        return schema.validate({
            authZToken: appAuthZHandlerDTO.authZToken,
            username: appAuthZHandlerDTO.username,
        });
    } catch (error) {
        return false;
    }
}

function authenticateApplication(appSecretKey) {
    try {
        const schema = Joi.object().keys({
            appSecretKey: Joi.string().min(3).max(500).required(),
        });

        return schema.validate({
            appSecretKey: appSecretKey,
        });
    } catch (error) {
        return false;
    }
}

module.exports = {
    userSignUp,
    userLogin,
    validateUser,
    validateWishlist,
    validateSearchVehicle,
    validateSearchWishlistInquiry,
    validateAdminLogin,
    validateEditBrand
};
