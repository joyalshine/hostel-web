const mongoose = require("mongoose");

const messMenuSchema = new mongoose.Schema(
  {
    
  },
  { timestamps: true,strict: false }
);

const messMenu = mongoose.model("messMenu", messMenuSchema);
module.exports = messMenu;