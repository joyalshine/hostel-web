const mongoose = require("mongoose");
const maintenanceSchema = new mongoose.Schema(
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
      type: [String],
    },
    feedback: {
      type: String,
    },
    empId: {
      type: String,
    },
    availableTime: {
      type: String,
    },
    phoneno: {
      type: String,
    },
  },
  { timestamps: true }
);

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);
module.exports = Maintenance;
