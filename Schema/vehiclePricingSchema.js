const mongoose = require('mongoose');

const vehiclePricingSchema = new mongoose.Schema({
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    modelId: {
        type: Number,
        required: true,
        unique: true
    },
    modelName: {
        type: String,
        required: true,
        unique: true
    },
    '2024': {
        type: Number,

    },
    '2023': {
        type: Number,

    },
    '2022': {
        type: Number,

    },
    '2021': {
        type: Number,

    },
    '2020': {
        type: Number,

    },
    '2019': {
        type: Number,

    },
    '2018': {
        type: Number,

    },
    '2017': {
        type: Number,

    },
    '2016': {
        type: Number,

    },
    '2015': {
        type: Number,

    },
    '2014': {
        type: Number,

    },
    '2013': {
        type: Number,

    },
    '2012': {
        type: Number,

    },
    '2011': {
        type: Number,

    },
    '2010': {
        type: Number,

    },

    insuranceValid: {
        type: Number,
        default: 0

    },
    insuranceInValid: {
        type: Number,
    },

    fitnessValid: {
        type: Number,
        default: 0

    },
    fitnessInValid: {
        type: Number,
    },

    'tyre-25%': {
        type: Number,
        required: true
    },
    'tyre-50%': {
        type: Number,
        required: true
    },
    'tyre-75%': {
        type: Number,
        required: true
    },
    'tyre-100%': {
        type: Number,
        required: true,
        default: 0
    },

    chassis: {
        type: Number,
        required: true
    },
    halfbody: {
        type: Number,
        required: true
    },
    fullbody: {
        type: Number,
        required: true
    },
    highbuild: {
        type: Number,
        required: true,
        default: 0

    },
    container: {
        type: Number,
        required: true
    }


},
    { strict: false, timestamps: true });

const VehiclePricing = mongoose.model('VehiclePricing', vehiclePricingSchema)

module.exports = VehiclePricing;