const mongoose = require("mongoose");

const dataAssetsSchema = new mongoose.Schema(
  {
    
  },
  { timestamps: true,strict: false }
);

const dataAsset = mongoose.model("dataAsset", dataAssetsSchema);
module.exports = dataAsset;