const Brands = require('../Schema/brandSchema');

exports.createBrand = async (req, res) => {
    try {
        const { brandName, description } = req.body;

        const brandLogo = req.files.brandLogo
            ? req.files.brandLogo[0].path
            : null;

        const newBrand = new Brands({
            brandName,
            description,
            brandLogo: brandLogo,
        });

        const savedBrand = await newBrand.save();

        res.status(201).json({
            success: true,
            message: 'Brand created successfully',
            data: savedBrand,
        });
    } catch (error) {
        console.error('Error creating brand:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


exports.getAllBrands = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const brands = await Brands.find()
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            message: 'Brands fetched successfully',
            data: brands,
        });
    } catch (error) {
        console.error('Error fetching brands:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
