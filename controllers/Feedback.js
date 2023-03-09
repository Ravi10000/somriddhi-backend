const Feedback = require('../models/Feedback');

exports.createFeedback = async (req, res) => {
    try {
        const feedback = {};
        if (req.body.userid) feedback.userid = req.body.userid;
        if (req.body.username) feedback.username = req.body.username;
        if (req.body.starRating) feedback.starRating = req.body.starRating;
        if (req.body.feedbackText) feedback.feedbackText = req.body.feedbackText;
        if (req.body.status) feedback.status = req.body.status;
        feedback.createdBy = req.user._id;
        const newFeedback = await Feedback.create(feedback);
        const record = await newFeedback.save();
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

exports.getAllFeedbacks = async (req, res) => {
    try {
        const find = {};
        if (req.body.status) find.status = req.body.status;
        const allFeedback = await Feedback.find(find);
        if (allFeedback) {
            res.status(200).json({
                status: 'success',
                message: 'Records fetched Successfully!',
                data: allFeedback
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

exports.deleteFeedback = async (req, res) => {
    try {
        const feedbackId = req.body._id;
        const record = await Feedback.deleteOne({ _id: feedbackId });
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















