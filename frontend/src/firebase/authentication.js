import { REACT_APP_BACKEND_URL } from "../dataAssets";
import { Firebase } from "./config";
import CryptoJS from "crypto-js";

async function validateUser(username, password) {
  try {
    let response = await fetch(
      `${REACT_APP_BACKEND_URL}/signin`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({ empid: username, password: password }),
      }
    )
    let data = await response.json()
    return data
  } catch (e) {
    console.log("Error getting document:", e);
    return { status: false, type: "someeerror" };
  }
}

async function forgotPasswordCheck(empId, email) {
  try {
    let response = await fetch(
      `${REACT_APP_BACKEND_URL}/password-reset-validate`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({ empid: empId, email: email }),
      }
    )
    let data = await response.json()
    return data
  } catch (e) {
    console.log("Error getting document:", e);
    return { status: false, type: "someeerror" };
  }
}

async function validateOTP(OTP) {
  try {
    let response = await fetch(
      `${REACT_APP_BACKEND_URL}/validate-otp`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({ OTP }),
      }
    )
    let data = await response.json()
    return data
  } catch (e) {
    console.log("Error getting document:", e);
    return { status: false, type: "someeerror" };
  }
}

async function updatePassword(id, password) {
  try {
    let response = await fetch(
      `${REACT_APP_BACKEND_URL}/password-reset`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({ id, password }),
      }
    )
    let data = await response.json()
    return data
  } catch (e) {
    return {
      status: false,
    };
  }
}

async function logoutAPI() {
  try {
    await fetch(
      `${REACT_APP_BACKEND_URL}/logout`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({}),
      }
    )
    return ;
  } catch (e) {
    console.log("Error getting document:", e);
    return ;
  }
}

export { validateUser, forgotPasswordCheck, updatePassword, validateOTP,logoutAPI };
