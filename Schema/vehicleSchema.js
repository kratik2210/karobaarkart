const { number } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
    brandId: {
        type: Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    modelName: {
        type: String,
        required: true
    },
    modelYear: {
        type: Number,
        required: true
    },
    modelNumber: {
        type: Number,
        unique: true
    },
    modelCoverImage: {
        type: String
    },
    modelMultiImages: [{
        _id: { type: Schema.Types.ObjectId, auto: true },
        img: { type: String }
    }],
    modelPrice: {
        type: Number
    },
    modelLocation: {
        type: String
    },
    modelRating: {
        type: Number
    },
    description: {
        type: String
    },
    mileage: {
        type: Number
    },
    fuelType: {
        type: String,
        enum: ['petrol', 'diesel']
    },
    loadingCapacity: {
        type: String,
    },
    insurance: {
        type: String,
        enum: ['valid', 'expired']
    },
    kmsDriven: {
        type: Number
    },
    category: {
        type: String,
        enum: ['used', 'new'],
        default: 'used',
        required: true
    },
    tyreCondition: {
        type: String,
        enum: ['good', 'bad']
    },
    fitness: {
        type: String,
    },
    bodyType: {
        type: String,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    sellStatus: {
        type: String,
        enum: ['sell', 'used', 'auction'],
        default: 'sell',
    },
    // inquireStatus: {
    //     type: String,
    //     enum: ['sold', 'unsold', 'auction']
    // }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
