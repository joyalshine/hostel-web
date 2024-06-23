import axios from "axios";
import { Firebase, time } from "./config";
import { CLEANING, DISCIPLINE, MAINTENANCE, REACT_APP_BACKEND_URL, REACT_APP_FCM_TOKEN } from "../dataAssets";
import { Filter } from "@mui/icons-material";

const getComplaints = async (collection) => {
  const response = await fetch(
    `${REACT_APP_BACKEND_URL}/superadmin/${collection}`,
    {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      method: "POST",
    }
  );
  const complains = await response.json();

  return complains.complains;
};

const upadateComplaint = async (collection, id, userId, complaintDetails) => {
  await fetch(
    `${REACT_APP_BACKEND_URL}/superadmin/${collection}/updateStatus`,
    {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        _id: id,
        status: "resolve",
        empId: userId,
      }),
    }
  ).then(async (e) => {
    await sendResolvedNotification(complaintDetails, collection);
  });
};

const setFeedBacktoDB = async (
  collection,
  id,
  getFeedback,
  userId,
  complaintDetails
) => {
  await fetch(
    `${REACT_APP_BACKEND_URL}/superadmin/${collection}/updateStatus`,
    {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        _id: id,
        status: "deny",
        empId: userId,
        feedback: getFeedback,
      }),
    }
  ).then(async (e) => {
    await sendDeniedNotification(complaintDetails, collection);
  });
};

const sendResolvedNotification = async (complaintDetails, collection) => {
  let token = await Firebase.collection("fcmTokens")
    .doc(complaintDetails.studentEmail)
    .get();
  if (token.exists) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=${REACT_APP_FCM_TOKEN}`,
      },
    };
    const url = "https://fcm.googleapis.com/fcm/send";

    let data;
    if (collection === "cleaning") {
      let forStr = CLEANING[complaintDetails.category[0]];
      for (var i = 1; i < complaintDetails.category.length; i++) {
        forStr += ", " + CLEANING[complaintDetails.category[i]];
      }

      data = {
        to: token.get("token"),
        notification: {
          title: "Complaint Resolved",
          body: `The Cleaning Request for ${forStr} is resolved`,
        },
      };
    } else if (collection === "maintenance") {
      let forStr = MAINTENANCE[complaintDetails.category[0]];
      for (var j = 1; j < complaintDetails.category.length; j++) {
        forStr += ", " + MAINTENANCE[complaintDetails.category[j]];
      }

      data = {
        to: token.get("token"),
        notification: {
          title: "Complaint Resolved",
          body: `The Maintenance Request for ${forStr} is resolved`,
        },
      };
    } else if (collection === "discipline") {
      let forStr = DISCIPLINE[complaintDetails.category];
      data = {
        to: token.get("token"),
        notification: {
          title: "Complaint Resolved",
          body: `The Discipline Complaint Regarding ${forStr} is resolved`,
        },
      };
    } else {
      data = {
        to: token.get("token"),
        notification: {
          title: "Complaint Resolved",
          body: `The Mess Complaint is resolved`,
        },
      };
    }
    axios.post(url, data, config).then((res) => {
      return;
    });
  }
};

const sendDeniedNotification = async (complaintDetails, collection) => {
  let token = await Firebase.collection("fcmTokens")
    .doc(complaintDetails.studentEmail)
    .get();
  if (token.exists) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=${REACT_APP_FCM_TOKEN}`,
      },
    };
    const url = "https://fcm.googleapis.com/fcm/send";

    let data;
    if (collection === "cleaning") {
      let forStr = CLEANING[complaintDetails.category[0]];
      for (var i = 1; i < complaintDetails.category.length; i++) {
        forStr += ", " + CLEANING[complaintDetails.category[i]];
      }

      data = {
        to: token.get("token"),
        notification: {
          title: "Complaint Rejected",
          body: `The Cleaning Request for ${forStr} is rejected`,
        },
      };
    } else if (collection === "maintenance") {
      let forStr = MAINTENANCE[complaintDetails.category[0]];
      for (var j = 1; j < complaintDetails.category.length; j++) {
        forStr += ", " + MAINTENANCE[complaintDetails.category[j]];
      }

      data = {
        to: token.get("token"),
        notification: {
          title: "Complaint Rejected",
          body: `The Maintenance Request for ${forStr} is rejected`,
        },
      };
    } else if (collection === "discipline") {
      let forStr = DISCIPLINE[complaintDetails.category];
      data = {
        to: token.get("token"),
        notification: {
          title: "Complaint Rejected",
          body: `The Discipline Complaint Regarding ${forStr} is rejected`,
        },
      };
    } else {
      data = {
        to: token.get("token"),
        notification: {
          title: "Complaint Rejected",
          body: `The Mess Complaint is rejected`,
        },
      };
    }
    axios.post(url, data, config).then((res) => {
      return;
    });
  }
};

const getHistoryComplains = async (collection, startDate, endDate) => {
  const response = await fetch(
    `${REACT_APP_BACKEND_URL}/superadmin/${collection}/history`,
    {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        startDate: startDate,
        endDate: endDate,
      }),
    }
  );

  const complains = await response.json();

  return complains.complains;
};

export {
  getComplaints,
  upadateComplaint,
  setFeedBacktoDB,
  getHistoryComplains,
};
