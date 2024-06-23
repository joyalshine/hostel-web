const mongoose = require("mongoose");
const AdminDisciplineSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: {
        values: ["pending", "resolve", "deny"],
        message: "Status must be either pending , resolve , deny",
      },
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
  },
  { timestamps: true }
);

const AdminDiscipline = mongoose.model(
  "AdminDiscipline",
  AdminDisciplineSchema
);
module.exports = AdminDiscipline;
