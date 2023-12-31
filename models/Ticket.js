const mongoose = require("mongoose");
const { Schema } = mongoose;

const TicketSchema = new Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  heading: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    required: false,
  },
  replies: [
    {
      type: String,
      createdBy: mongoose.Schema.Types.ObjectId,
    },
  ],
  // replies: {
  //     type: Array, //[{'text':'Hey',createdBy:ObjectId}]
  //     required: false,
  //     default: []
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    default: Date.now,
  },
});
const Ticket = mongoose.model("Ticket", TicketSchema);
module.exports = Ticket;

//create ticket
//update ticket
//get all tickets(optional field status)
//get my tickets (fetch tickets based on userid)
//addreply
//delete ticket
