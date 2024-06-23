const userModel = require("../models/userModel");
const maintenanceModel = require("../models/maintenanceModel");
const disciplineModel = require("../models/disciplineModel");
const messModel = require("../models/messModel");
const cleaningModel = require("../models/cleaningModel");
const employeeDataModel = require("../models/employeeDataModel");
const dataAssetModel = require("../models/dataAssetsModel");
const messMenuModel = require("../models/messMenuModel");
const bcrypt = require('bcrypt')

const { MONTHS } = require("../assets/dataAssets");

module.exports = {
  searchStudentDataDb: async (req, res, next) => {
    const { email } = req.body;

    const studentData = await userModel.findOne({ email });

    if (studentData) {
      delete studentData.password, studentData._id;
      let data = studentData;
      res.status(200).json({
        status: true,
        data: data,
      });
    } else {
      res.status(404).json({
        status: false,
        type: "nf",
      });
    }
  },

  searchStudentHistoryDb: async (req, res, next) => {
    const { email } = req.body;

    let complaintHistory = [];

    try {
      const user = await userModel.findOne({ email });

      if (user) {
        const maintenanceComplaints = await maintenanceModel.find({
          studentEmail: email,
        });
        const cleaningComplaints = await cleaningModel.find({
          studentEmail: email,
        });
        const messComplaints = await messModel.find({ studentEmail: email });
        const disciplineComplaints = await disciplineModel.find({
          studentEmail: email,
        });

        maintenanceComplaints.forEach((doc) => {
          complaintHistory.push({
            complaintType: "Maintenance",
            id: doc._id,
            ...doc._doc,
          });
        });
        cleaningComplaints.forEach((doc) => {
          complaintHistory.push({
            complaintType: "Cleaning",
            id: doc._id,
            ...doc._doc,
          });
        });
        messComplaints.forEach((doc) => {
          complaintHistory.push({
            complaintType: "Mess",
            id: doc._id,
            ...doc._doc,
          });
        });
        disciplineComplaints.forEach((doc) => {
          complaintHistory.push({
            complaintType: "Discipline",
            id: doc._id,
            ...doc._doc,
          });
        });

        res.status(200).json({
          status: true,
          data: complaintHistory,
        });
      } else {
        res.status(404).json({
          status: false,
          type: "nf",
        });
      }
    } catch (err) {
      res.status(400).json({
        status: false,
        type: "error",
      });
    }
  },

  updateStudentDataDb: async (req, res, next) => {
    const { id, details } = req.body;

    try {
      const updateResponse = await userModel.findByIdAndUpdate(id, details);
      if (updateResponse._id) {
        res.status(200).json({ status: true });
      } else {
        res.status(400).json({ status: false });
      }
    } catch (e) {
      res.status(400).json({ status: false });
    }
  },

  addStudentDb: async (req, res, next) => {
    const { email, studentData } = req.body;

    try {
      const userExists = await userModel.findOne({ email });
      if (userExists) {
        res.status(200).json({ status: false, type: "exists" });
      } else {
        const user = new userModel({ email, ...studentData });
        user
          .save()
          .then((doc) => {
            res.status(200).json({ status: true });
          })
          .catch((err) => {
            res.status(400).json({
              status: false,
              type: "error",
            });
          });
      }
    } catch (e) {
      res.status(400).json({
        status: false,
        type: "error",
      });
    }
  },

  addStudentExcelDb: async (req, res, next) => {
    const { datas } = req.body;

    try {
      await userModel.bulkWrite(
        datas.map((student) => ({
          updateOne: {
            filter: { email: student.email },
            update: { $set: student },
            upsert: true,
          },
        }))
      );
      res.status(200).send(true);

      // userModel.insertMany(datas).then((docs) => {
      //     res.status(200).send(true)
      // })
      //     .catch((err) => {
      //         res.status(400).send(false)
      //     })
    } catch (e) {
      res.status(400).send(false);
    }
  },

  addNewUser: async (req, res, next) => {
    const { id, data } = req.body;

    try {
      const userExists = await employeeDataModel.findOne({ empid: id });
      if (userExists) {
        res.status(200).json({ status: false, type: "exists" });
      } else {
        const salt = await bcrypt.genSalt()
        data.password = await bcrypt.hash('1234', salt)
        const user = new employeeDataModel({ empid: id, ...data });
        user
          .save()
          .then((doc) => {
            res.status(200).json({ status: true });
          })
          .catch((err) => {
            console.log(err)
            res.status(400).json({
              status: false,
            });
          });
      }
    } catch (e) {
      console.log(e)
      res.status(400).json({
        status: false,
      });
    }
  },

  uploadMessMenuDB: async (req, res, next) => {
    const { data, month, year } = req.body;

    try {
      const dataKeys = await dataAssetModel.findOne({ for: "messKeys" });
      let keys;
      if (dataKeys) {
        let keys = dataKeys.value;
        if (dataKeys.includes(`${MONTHS[month - 1]}${year}`)) {
        } else {
          keys.push(`${MONTHS[month - 1]}${year}`);
          await dataAssetModel.findByIdAndUpdate(dataKeys._id, { value: keys });
        }
      } else {
        keys = [`${MONTHS[month - 1]}${year}`];
        let keysResponse = new dataAssetModel({
          for: "messKeys",
          value: keys,
        });
        await keysResponse.save();
      }

      await messMenuModel.findOneAndUpdate(
        { key: `${MONTHS[month - 1]}${year}-veg` },
        { key: `${MONTHS[month - 1]}${year}-veg`, menu: data[0] },
        { upsert: true }
      );
      await messMenuModel.findOneAndUpdate(
        { key: `${MONTHS[month - 1]}${year}-nveg` },
        { key: `${MONTHS[month - 1]}${year}-nveg`, menu: data[1] },
        { upsert: true }
      );
      await messMenuModel.findOneAndUpdate(
        { key: `${MONTHS[month - 1]}${year}-special` },
        { key: `${MONTHS[month - 1]}${year}-special`, menu: data[2] },
        { upsert: true }
      );
      res.status(200).send(true);
    } catch (e) {
      console.log(e);
      res.status(400).send(false);
    }
  },

  checkMenuExist: async (req, res, next) => {
    const { month, year } = req.body;

    try {
      const existsData = await messMenuModel.findOne({
        key: `${MONTHS[month - 1]}${year}-veg`,
      });
      if (existsData) {
        res.status(200).json({ status: true });
      } else {
        res.status(200).json({ status: false, type: "notexists" });
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({
        status: false,
        type: "error",
      });
    }
  },

  fetchMessMenuHistoryKeys: async (req, res, next) => {
    try {
      const existsData = await dataAssetModel.findOne({ for: `messKeys` });
      if (existsData) {
        res.status(200).json({ status: true, data: existsData.value });
      } else {
        res.status(200).json({ status: true, data: [] });
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({
        status: false,
      });
    }
  },

  fetchMessMenuHistoryDB: async (req, res, next) => {
    const { id } = req.body;

    try {
      let veg = await messMenuModel.findOne({ key: `${id}-veg` });
      let nveg = await messMenuModel.findOne({ key: `${id}-nveg` });
      let special = await messMenuModel.findOne({ key: `${id}-special` });

      res
        .status(200)
        .json({ status: true, data: [veg.menu, nveg.menu, special.menu] });
    } catch (e) {
      console.log(e);
      res.status(400).json({
        status: false,
      });
    }
  },

  deleteStudentDB: async (req, res, next) => {
    const { id } = req.body;

    try {
      await userModel.findOneAndDelete({ email: id });
      res.status(200).send(true);
    } catch (e) {
      console.log(e);
      res.status(400).send(false);
    }
  },

  getAllComplains: async (model, req, res, next) => {
    try {
      const complains = await model.find({ status: "pending" });
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
  },

  updateComplain: async (model, req, res, next) => {
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
  },

  getHistoryComplains: async (model, req, res, next) => {
    try {
      const { startDate, endDate } = req.body;

      let formattedStartDate = new Date(startDate)
      let formattedEndDate = new Date(endDate)
      formattedStartDate.setMinutes(formattedStartDate.getMinutes() + formattedStartDate.getTimezoneOffset());
      formattedEndDate.setMinutes(formattedEndDate.getMinutes() + formattedEndDate.getTimezoneOffset());

      const complains = await model.find({
        status: { $ne: "pending" },
        createdAt: {
          $gte: formattedStartDate,
          $lte: formattedEndDate,
        },
      });
      res.status(200).json({
        status: "success",
        results: complains.length,
        complains: complains,
      });
    } catch (err) {
      console.log(err)
      res.status(500).json({
        status: "error",
        message: err,
      });
    }
  },
};
