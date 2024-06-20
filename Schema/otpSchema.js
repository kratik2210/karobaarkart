
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
    },
    otpCode: {
        type: Number,
        required: true,
    },
    expiryTime: {
        type: Date,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


otpSchema.index({ expiryTime: 1 }, { expireAfterSeconds: 10 });


const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;