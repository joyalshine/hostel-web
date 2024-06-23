const mongoose = require("mongoose");
const messSchema = new mongoose.Schema(
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
    mess: {
      type: String,
    },
    complainDesc: {
      type: String,
    },
    feedback: {
      type: String,
    },
    empId: {
      type: String,
    },
  },
  { timestamps: true }
);

const mess = mongoose.model("mess", messSchema);
module.exports = mess;
