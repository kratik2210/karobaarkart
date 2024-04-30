const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        loginSessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        token:
        {
            type: String,
            required: true
        },
        refreshToken:
        {
            type: String,
            required: true
        },
        tokenExpiryTime:
        {
            type: Date,
            required: true,
            default: Date.now
        },
        refreshTokenExpiryTime:
        {
            type: Date,
            required: true,
            default: Date.now
        },
    }
);

const LoginToken = mongoose.model('LoginToken', schema);

module.exports = LoginToken;
