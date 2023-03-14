const Banner = require('../models/Banner');

exports.createBanner = async (req, res) => {
    try {
        const banner = {};
        if (req.body.name) banner.name = req.body.name;
        console.log(req.file)
        if (req.file.filename) banner.image = req.file.filename;
        if (req.body.description) banner.description = req.body.description;
        if (req.body.url) banner.url = req.body.url;
        if (req.body.status) banner.status = req.body.status;
        banner.createdBy = req.user._id;
        const newBanner = await Banner.create(banner);
        const record = await newBanner.save();
        if (record) {
            res.status(200).json({
                status: 'success',
                message: 'Record created Successfully!',
                data: record
            })
        }
        else {
            res.status(400).json({
                status: 'fail',
                message: 'Record not created successfully!'
            })
        }
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        })
    }
}

exports.getBanners = async (req, res) => {
    try {
        const allBanners = await Banner.find({});
        if (allBanners) {
            res.status(200).json({
                status: 'success',
                message: 'Records fetched Successfully!',
                data: allBanners
            })
        }
        else {
            res.status(400).json({
                status: 'fail',
                message: 'Records not fetched successfully!'
            })
        }
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        })
    }
}


exports.updateBanner = async (req, res) => {
    try {
        const bannerId = req.body._id;
        const banner = {};
        if (req.body.name) banner.name = req.body.name;
        if (req.file.filename) banner.image = req.file.filename;
        if (req.body.bannerPhoto) banner.image = req.body.bannerPhoto;
        if (req.body.description) banner.description = req.body.description;
        if (req.body.url) banner.url = req.body.url;
        if (req.body.status) banner.status = req.body.status;
        banner.createdBy = req.user._id;
        const record = await Banner.findByIdAndUpdate(bannerId, { $set: banner }, { new: true });
        if (record) {
            res.status(200).json({
                status: 'success',
                message: 'Record updated Successfully!',
                data: record
            })
        }
        else {
            res.status(400).json({
                status: 'fail',
                message: 'Record not updated successfully!'
            })
        }
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        })
    }
}

exports.deleteBanner = async (req, res) => {
    try {
        const bannerId = req.body._id;
        const record = await Banner.deleteOne({ _id: bannerId });
        if (record) {
            res.status(200).json({
                status: 'success',
                message: 'Record delete Successfully!',
                data: record
            })
        }
        else {
            res.status(400).json({
                status: 'fail',
                message: 'Record not delete successfully!'
            })
        }
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        })
    }
}















