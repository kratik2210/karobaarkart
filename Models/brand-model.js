const { default: mongoose } = require("mongoose");
const Wishlist = require("../Schema/wishlistInquirySchema")
const _g = require('../Utils/GlobalFunctions');
const { API_RESP_CODES } = require('../Utils/common/error-codes');
const Brand = require("../Schema/brandSchema");

// exports.editBrandModel = async (formData, userId) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//         let returnResult = { status: false, message: '', data: null };

//         const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);
//         if (!isValidObjectId) {
//             return { status: false, message: 'Invalid user ID format', data: null };
//         }

//         const {
//             vehicleId
//         } = formData;

//         const existingWishlistItem = await Wishlist.findOne({ userId, vehicleId, wishlist: true, });

//         if (existingWishlistItem) {
//             return { status: false, message: API_RESP_CODES.VEHICLE_EXIST.message, data: null };
//         }


//         const newWishlistItem = new Wishlist({
//             vehicleId,
//             userId: userId,
//             createdBy: userId,
//             updatedBy: userId,
//             wishlist: true,
//         });

//         const savedWishlistItem = await newWishlistItem.save();

//         await session.commitTransaction();

//         returnResult.status = true;
//         returnResult.message = 'Vehicle added to wishlist successfully';
//         returnResult.data = savedWishlistItem;


//         return returnResult;

//     } catch (error) {
//         session.abortTransaction();
//         throw error;
//     } finally {
//         session.endSession();
//     }
// }

exports.editBrandModel = async (formData, userId, brandId, brandLogo) => {
    return new Promise(async (resolve, reject) => {
        try {
            let updateFields = {
                description: formData.description,
                brandName: formData.brandName,
                updatedBy: userId,
                updatedAt: new Date()
            };

            if (brandLogo) {
                updateFields.brandLogo = brandLogo;
            }

            const updatedBrand = await Brand.findOneAndUpdate(
                { _id: brandId },
                updateFields,
                { new: true }
            );

            resolve(updatedBrand);
        } catch (error) {
            reject(error);
        }
    });
};
