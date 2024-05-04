const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dealerSchemaFields = {
    firmName: {
        type: String,
        default: null,
    },
    docNo: {
        type: Number,
        default: null,
    },
    businessProof: {
        type: String,
        default: null,
    },
    bankAccNo: {
        type: String,
        default: null,
    },
    bankAccName: {
        type: String,
        default: null,
    },
    ifscCode: {
        type: String,
        default: null,
    },
    docImage: {
        type: String,
        default: null,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
};

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        unique: true,
        required: true,
        index: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        index: true,
    },
    userType: {
        type: String,
        enum: ['admin', 'user', 'dealer'],
        required: true,
    },
    ...dealerSchemaFields,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeactivated: {
        type: Boolean,
        default: false,
    },
    isAccountLocked: {
        type: Boolean,
        default: false,
    },
    deviceId: {
        type: String,
        default: null,
    },
    password: {
        type: String,
        default: null,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

// Custom validation for dealer userType
// userSchema.path('userType').validate(function (value) {
//     if (value === 'dealer') {
//         const requiredFields = ['firmName', 'docNo', 'businessProof', 'bankAccNo', 'bankAccName', 'ifscCode', 'docImage'];
//         const missingFields = requiredFields.filter(field => !this[field]);
//         return missingFields.length === 0;
//     }
//     return true;
// }, 'Required fields for dealer userType are missing.');

userSchema.index({ userType: 1, isActive: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
