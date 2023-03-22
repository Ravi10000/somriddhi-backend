const Ticket = require("../models/Ticket");

exports.createTicket = async (req, res) => {
  console.log("create ticket");
  console.log("body", req.body);
  console.log("user", req.user);
  try {
    const ticket = {};
    if (req.body.heading) ticket.heading = req.body.heading;
    if (req.body.description) ticket.description = req.body.description;
    if (req.body.status) ticket.status = req.body.status;
    if (req.body.replies) ticket.replies = req.body.replies;
    ticket.createdBy = req.user._id;
    ticket.userid = req.user._id;
    const newTicket = await Ticket.create(ticket);
    const record = await newTicket.save();
    if (record) {
      res.status(200).json({
        status: "success",
        message: "Record created Successfully!",
        data: record,
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Record not created successfully!",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.addTicketReplies = async (req, res) => {
  try {
    const find = {};
    if (req.body.replies) find.replies = req.body.replies;
    const ticketId = req.body._id;
    const record = await Ticket.findByIdAndUpdate(
      ticketId,
      { $set: find },
      { new: true }
    );
    if (record) {
      res.status(200).json({
        status: "success",
        message: "Records added Successfully!",
        data: record,
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Records not added successfully!",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getMyTickets = async (req, res) => {
  try {
    const allTickets = await Ticket.find({ userid: req.user._id });
    if (allTickets) {
      res.status(200).json({
        status: "success",
        message: "Records fetched Successfully!",
        data: allTickets,
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Records not fetched successfully!",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const find = {};
    if (req.body.status) find.status = req.body.status;
    const allTickets = await Ticket.find(find);
    if (allTickets) {
      res.status(200).json({
        status: "success",
        message: "Records fetched Successfully!",
        data: allTickets,
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Records not fetched successfully!",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const ticketId = req.body._id;
    const ticket = {};
    if (req.body.userid) ticket.userid = req.body.userid;
    if (req.body.heading) ticket.heading = req.body.heading;
    if (req.body.description) ticket.description = req.body.description;
    if (req.body.status) ticket.status = req.body.status;
    if (req.body.replies) ticket.replies = req.body.replies;
    ticket.createdBy = req.user._id;
    const record = await Ticket.findByIdAndUpdate(
      ticketId,
      { $set: ticket },
      { new: true }
    );
    if (record) {
      res.status(200).json({
        status: "success",
        message: "Record updated Successfully!",
        data: record,
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Record not updated successfully!",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const ticketId = req.body._id;
    const record = await Ticket.deleteOne({ _id: ticketId });
    if (record) {
      res.status(200).json({
        status: "success",
        message: "Record delete Successfully!",
        data: record,
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Record not delete successfully!",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
