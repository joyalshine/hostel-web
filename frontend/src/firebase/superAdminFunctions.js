import { Firebase } from "./config";
import { serverTimestamp } from "firebase/firestore";
import CryptoJS from "crypto-js";
import { REACT_APP_BACKEND_URL } from "../dataAssets";

async function searchStudentDataDb(email) {
  try {
    let response = await fetch(
      `${REACT_APP_BACKEND_URL}/superadmin/fetch-student-data`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({ email }),
      }
    )
    let data = await response.json()
    return data
  } catch (e) {
    return {
      status: false,
      type: "error",
    };
  }
}

async function searchStudentComplaintsDb(email) {
  try {
    let response = await fetch(
      `${REACT_APP_BACKEND_URL}/superadmin/fetch-student-complaints`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({ email }),
      }
    )
    let data = await response.json()
    return data
  } catch (e) {
    return {
      status: false,
      type: "error",
    };
  }
}

async function updateStudentDb(id, details) {
  try {
    let response = await fetch(
      `${REACT_APP_BACKEND_URL}/superadmin/update-student-data`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({ id, details }),
      }
    )
    let data = await response.json()
    return data;
  } catch (e) {
    return {
      status: false,
    };
  }
}

async function addStudentDb(email, studentData) {
  try {
    let response = await fetch(
      `${REACT_APP_BACKEND_URL}/superadmin/add-student`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({ email, studentData }),
      }
    )
    let data = await response.json()
    return data;
  } catch (e) {
    return {
      status: false,
      type: 'error'
    };
  }
}

async function addStudentExcelDb(datas) {
  try {
    let response = await fetch(
      `${REACT_APP_BACKEND_URL}/superadmin/student-excel-upload`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({ datas }),
      }
    )
    let data = await response.json()
    return data;
  }
  catch (e) {
    return false
  }
}

async function addNewUser(id, data) {
  try {
    let response = await fetch(
      `${REACT_APP_BACKEND_URL}/superadmin/add-user`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({ id, data }),
      }
    )
    let responseData = await response.json()
    return responseData;
  } catch (e) {
    return {
      status: false,
    };
  }
}

async function uploadMessMenuDB(data, month, year) {
  try {
    let response = await fetch(
      `${REACT_APP_BACKEND_URL}/superadmin/upload-messmenu`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({data, month, year}),
      }
    )
    let responseData = await response.json()
    return responseData;
  } catch (e) {
    return false
  }
}

async function checkMenuExist(month, year) {
  try {
    let response = await fetch(
      `${REACT_APP_BACKEND_URL}/superadmin/check-menuexists`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({month, year}),
      }
    )
    let responseData = await response.json()
    return responseData;
  } catch (e) {
    return {
      status: false,
      type: 'error'
    };
  }
}

async function fetchMessMenuHistoryKeys() {
  try {
    let response = await fetch(
      `${REACT_APP_BACKEND_URL}/superadmin/fetch-messmenu-keys`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({}),
      }
    )
    let responseData = await response.json()
    return responseData;
  } catch (e) {
    return {
      status: false,
    };
  }
}

async function fetchMessMenuHistoryDB(id) {
  try {
    let response = await fetch(
      `${REACT_APP_BACKEND_URL}/superadmin/fetch-messmenu`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({id}),
      }
    )
    let responseData = await response.json()
    return responseData;
  } catch (e) {
    return {
      status: false,
    };
  }
}


async function deleteStudentDB(id) {
  try {
    let response = await fetch(
      `${REACT_APP_BACKEND_URL}/superadmin/delete-student`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({id}),
      }
    )
    let responseData = await response.json()
    return responseData;
  } catch (e) {
    console.log(e)
    return false
  }
}

export { searchStudentDataDb, searchStudentComplaintsDb, updateStudentDb, addStudentDb, addNewUser, uploadMessMenuDB, checkMenuExist, fetchMessMenuHistoryKeys, fetchMessMenuHistoryDB, deleteStudentDB, addStudentExcelDb };
