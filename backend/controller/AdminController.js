const getAllComplains = async (model, req, res, next) => {
  try {
    const complains =
      model === "discipline"
        ? await model
            .find({ status: "pending" })
            .select("status complainDesc category")
            .projection()
        : await model.find({ status: "pending" });

    res.status(200).json({
      status: "success",
      results: complains.length,
      complains: complains,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err,
    });
  }
};

const updateComplain = async (model, req, res, next) => {
  try {
    const { _id } = req.body;
    const updatedComplain = await model.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedComplain) {
      return res.status(404).json({
        status: "error",
        message: `No complaint found with id ${_id}`,
      });
    }

    res.status(200).json({
      status: "success",
      complain: updatedComplain,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message || "Internal Server Error",
    });
  }
};

module.exports = {
  getAllComplains,
  updateComplain,
};
