const Newsletter = require('../models/Newsletter');

exports.createNewsletter = async (req, res) => {
    try {
        const newsletter = {};
        if (req.body.name) newsletter.name = req.body.name;
        if (req.body.email) newsletter.email = req.body.email;
        if (req.body.status) newsletter.status = req.body.status;
        newsletter.createdBy = req.user._id;
        const newNewsletter = await Newsletter.create(newsletter);
        const record = await newNewsletter.save();
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

exports.getAllNewsletters = async (req, res) => {
    try {
        const find = {};
        if (req.body.status) find.status = req.body.status;
        const allNewsletter = await Newsletter.find(find);
        if (allNewsletter) {
            res.status(200).json({
                status: 'success',
                message: 'Records fetched Successfully!',
                data: allNewsletter
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

exports.deleteNewsletter = async (req, res) => {
    try {
        const newsletterId = req.body._id;
        const record = await Newsletter.deleteOne({ _id: newsletterId });
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















