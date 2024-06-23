const mongoose = require("mongoose");
const disciplineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    regno: {
      type: String,
    },
    studentEmail: {
      type: String,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "resolve", "deny"],
        message: "Status must be either pending , resolve , deny",
      },
    },
    block: {
      type: String,
    },
    room: {
      type: Number,
    },
    complainDesc: {
      type: String,
    },
    category: {
      type: String,
    },
    feedback: {
      type: String,
    },
    empId: {
      type: String,
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  { timestamps: true }
);

const discipline = mongoose.model("discipline", disciplineSchema);
module.exports = discipline;
