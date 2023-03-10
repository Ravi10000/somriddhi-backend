const Otp = require('../models/Otp');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.sendOtp = async (req, res) => {
    const OTP = '1111';
    try {
        const newOtp = {
            phone: req.body.phone,
            countryCode: req.body.countryCode,
            otp: OTP
        }
        const otp = await Otp.create(newOtp);
        const savedOtp = await otp.save();
        if (!savedOtp) {
            res.status(400).json({
                status: "Fail",
                message: 'Otp does not saved into the database !'
            })
        }
        res.status(200).json({
            status: 'success',
            message: "OTP sent Successfully!",
            data: OTP
        })
    }
    catch (err) {
        res.status(400).json({
            status: "Fail",
            message: err.message
        })
    }
}



exports.verifyOtp = async (req, res) => {
    try {
        const userRecord = await Otp.findOne({ phone: req.body.phone });
        if (userRecord.otp == req.body.otp) {
            const userFound = await User.find({ phone: req.body.phone });
            if (userFound.length > 0) {
                const token = jwt.sign({ _id: userFound._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                res.status(200).json({
                    status: 'success',
                    message: "User details fetched Successfully!",
                    data: userFound,
                    token: token
                })
            }
            else {
                const newUser = {
                    phone: req.body.phone,
                    fname: 'Guest',
                    lname: "Guest",
                    email: "guest@gmail.com",
                    isContactVerified: 'Yes',
                    usertype: 'customer'
                }
                const addedUser = await User.create(newUser);
                const savedUser = await addedUser.save();
                const token = jwt.sign({ _id: addedUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                if (savedUser) {
                    res.status(200).json({
                        status: 'success',
                        message: "New user created and details fetched Successfully!",
                        data: savedUser,
                        token: token
                    })
                }
                else {
                    res.status(200).json({
                        status: 'success',
                        message: "New user is not created Successfully!"
                    })
                }
            }
        }
        else {
            res.status(200).json({
                status: 'success',
                message: 'Invalid otp'
            })
        }

    }
    catch (err) {
        res.status(400).json({
            status: "Fail",
            message: err.message
        })
    }
}

exports.newUser = async (req, res) => {
    try {
        const { fname, lname, email, phone, usertype } = req.body;
        const newUser = await User.create({ fname, lname, email, phone, usertype, isContactVerified: 'No' });
        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const createdUser = await newUser.save();
        if (createdUser) {
            res.status(200).json({
                status: 'success',
                message: "New user created Successfully!",
                data: createdUser,
                token: token
            })
        }
        else {
            res.status(400).json({
                status: 'fail',
                message: "User not created !"
            })
        }
    }
    catch (err) {
        res.status(400).json({
            status: "Fail",
            message: err.message
        })
    }
}


exports.updateUser = async (req, res) => {

    const { fname, lname, email, phone, usertype, isContactVerified, referralCode } = req.body;

    try {
        // Create a newNote object
        const newData = {};
        if (fname) { newData.fname = fname };
        if (lname) { newData.lname = lname };
        if (email) { newData.email = email };
        if (phone) { newData.phone = phone };
        if (usertype) { newData.usertype = usertype };
        if (isContactVerified) { newData.isContactVerified = isContactVerified };
        if (referralCode) { newData.referralCode = referralCode };

        // Find the note to be updated and update it
        let record = await User.find({ _id: req.user._id });
        if (!record) { return res.status(404).json({ "status": false, "message": "Not Found" }) }

        result = await User.findByIdAndUpdate(req.user._id, { $set: newData }, { new: true })
        res.status(200).json({
            "status": true,
            "message": "Record Updated Successfully",
            "data": result
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}

exports.getAllUsers = async (req, res) => {
    const find = {};
    if (req.body.usertype) find.usertype = req.body.usertype;
    const allUsers = await User.find(find);
    if (allUsers) {
        res.status(200).json({
            "status": 'success',
            "message": "Record fetched Successfully",
            "data": allUsers
        });
    }
    else {
        res.status(400).json({
            "status": 'fail',
            "message": "Something Wrong!"
        });
    }
}