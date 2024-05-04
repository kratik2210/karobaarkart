const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    brandLogo: {
        type: String,
    },
    brandName: {
        type: String,
        required: true,
        unique: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    description: {
        type: String,
    },
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;