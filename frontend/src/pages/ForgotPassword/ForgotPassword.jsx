import React, { useState, useRef } from "react";
import "./ForgotPassword.css";
import Swal from "sweetalert2";
import { forgotPasswordCheck, updatePassword, validateOTP } from "../../firebase/authentication";
import { ColorRing } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";


let inputs = "";
function handleOtp(e) {
  const input = e.target;
  let value = input.value;
  let isValidInput = value.match(/\d /);
  input.value = "";
  input.value = isValidInput ? value[0] : "";

  let fieldIndex = input.dataset.index;
  if (fieldIndex < inputs.length - 1 && isValidInput) {
    input.nextElementSibling.focus();
  }

  if (e.key === "Backspace" && fieldIndex > 0) {
    input.previousElementSibling.focus();
  }

  if (fieldIndex == inputs.length - 1 && isValidInput) {
    submit();
  }
}

function handleOnPasteOtp(e) {
  const data = e.clipboardData.getData("text");
  const value = data.split("");
  if (value.length === inputs.length) {
    inputs.forEach((input, index) => (input.value = value[index]));
    submit();
  }
}

function submit() { }

function submitId(id, email) {
  if (id != "" && email != "") {
    fetch("/password-reset", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ id: id, email: email, flag: "1" }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response == "0") {
          Swal.fire("Invalid", "Invalid Employee Id or Email", "error");
        } else if (response == "1") {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "OTP has been successfully send",
            showConfirmButton: false,
            timer: 1500,
          })
            .then((temp) => {
              inputs = document.querySelectorAll(".otp-field input");
              inputs.forEach((input, index) => {
                input.dataset.index = index;
                input.addEventListener("keyup", handleOtp);
                input.addEventListener("paste", handleOnPasteOtp);
              });
            });
        } else {
          console.log("invalid");
        }
      });
  } else {
    const Toast = Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    if (id == "") {
      Toast.fire({
        icon: "error",
        title: "Enter Employee Id",
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "Enter Email",
      });
    }
  }
}

function ForgotPassword() {
  const [currentState, setCurrentState] = useState("initial");
  const [employeeID, setEmployeeID] = useState("");
  const [email, setEmail] = useState("");
  const [OTP, setOTP] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingReset, setIsLoadingReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["user_token"]);


  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [OTP1, setOTP1] = useState("");
  const [OTP2, setOTP2] = useState("");
  const [OTP3, setOTP3] = useState("");
  const [OTP4, setOTP4] = useState("");

  const otp2Ref = useRef(null);
  const otp3Ref = useRef(null);
  const otp4Ref = useRef(null);

  async function handleInitialSubmit() {
    setIsLoading(true);
    if (email !== "" && employeeID !== "") {
      let response = await forgotPasswordCheck(employeeID, email);
      if (response.status) {
        setOTP(response.otp);
        setCurrentState("otp");
        setError(false)
      } else {
        if (response.type === "inccred") {
          setErrorMsg("Invalid Credentials!");
        } else if (response.type === "notfound") {
          setErrorMsg("User not found");
        } else {
          setErrorMsg("Some error Occured");
        }
        setError(true);
      }
    }
    setIsLoading(false);
  }

  function invalidAuthRedirect() {
    removeCookie('user_token', { path: '/' });
    navigate(`/`, { state: { logoutMessage: true } })
  }

  async function handleOTP(e) {
    e.preventDefault();
    let otp = OTP1 + OTP2 + OTP3 + OTP4;
    let validateResponse = await validateOTP(otp)
    if (validateResponse.status) {
      setCurrentState("password");
      setError(false)
    }
    else {
      if (!validateResponse.valid) {
        invalidAuthRedirect()
      }
      setErrorMsg("Incorrect OTP!");
      setError(true);
    }

  }

  async function handlePasswordReset() {
    setIsLoadingReset(true)
    const Toast = Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    if (password === '') {
      Toast.fire({
        icon: "error",
        title: "Enter a Password",
      });
      setIsLoadingReset(false)
    }
    else if (password.length < 6) {
      Toast.fire({
        icon: "error",
        title: "Password should contain atleast 6 characters",
      });
      setIsLoadingReset(false)
    }
    else if (password === confirmPassword) {
      let response = await updatePassword(employeeID, password)
      if (response.status) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Password Reset Successfully',
          showConfirmButton: false,
          timer: 1500
        }).then((e) => {
          setIsLoadingReset(false)
          navigate('/')
        })
      }
      else {
        if (!response.valid) {
          invalidAuthRedirect()
        }
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Some error occured while updating the password. Please try again',
        })
        setIsLoadingReset(false)
      }
    }
    else {
      setErrorMsg('Password and Confirm password does not match')
      setError(true)
      setIsLoadingReset(false)
    }
  }

  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner py-4">
          <div className="card">
            <div className="card-body" id="mainDisplay">
              {currentState === "otp" ? (
                <div className="text-center">
                  <div className="app-brand justify-content-center">
                    <a href="/" className="app-brand-link gap-2">
                      <img
                        src={
                          process.env.PUBLIC_URL +
                          "/assets/images/signInFormLogo.png"
                        }
                        width="45"
                        height="45"
                        alt=""
                      />
                      <span className="app-brand-text demo text-body-title fw-bolder">
                        HOSTEL
                      </span>
                    </a>
                  </div>
                  <div className="text-center mb-4">
                    <h4 className="mb-2">Enter OTP</h4>
                  </div>
                  <p className="mb-4">
                    Enter the 4 digit OTP that has been sent to the email id <em style={{ color: 'blue' }}>{email}</em>
                  </p>
                  <form className="mb-3" onSubmit={handleOTP}>
                    <div className="mb-5">
                      <div className="otp-field">
                        <input
                          type="text"
                          autoComplete="off"
                          className="form-control"
                          id="otp-1"
                          maxLength="1"
                          value={OTP1}
                          onChange={(e) => {
                            if (e.target.value === "") {
                              setOTP1("");
                            } else if (e.target.value.match(/\d/gi)) {
                              setOTP1(e.target.value);
                              otp2Ref.current.focus();
                            }
                          }}
                          autoFocus
                          required
                        />
                        <input
                          type="text"
                          autoComplete="off"
                          className="form-control"
                          id="otp-2"
                          maxLength="1"
                          required
                          ref={otp2Ref}
                          value={OTP2}
                          onChange={(e) => {
                            if (e.target.value === "") {
                              setOTP2("");
                            } else if (e.target.value.match(/\d/gi)) {
                              setOTP2(e.target.value);
                              otp3Ref.current.focus();
                            }
                          }}
                        />
                        <input
                          type="text"
                          autoComplete="off"
                          className="form-control"
                          id="otp-3"
                          ref={otp3Ref}
                          value={OTP3}
                          required
                          maxLength="1"
                          onChange={(e) => {
                            if (e.target.value === "") {
                              setOTP3("");
                            } else if (e.target.value.match(/\d/gi)) {
                              setOTP3(e.target.value);
                              otp4Ref.current.focus();
                            }
                          }}
                        />
                        <input
                          type="text"
                          autoComplete="off"
                          className="form-control"
                          maxLength="1"
                          ref={otp4Ref}
                          required
                          value={OTP4}
                          onChange={(e) => {
                            if (e.target.value === "") {
                              setOTP4("");
                            } else if (e.target.value.match(/\d/gi)) {
                              setOTP4(e.target.value);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button className="btn btn-primary d-grid w-50">Reset</button>
                    </div>
                  </form>
                </div>
              ) : currentState === "initial" ? (
                <div className="">
                  <div className="app-brand justify-content-center">
                    <a href="/" className="app-brand-link gap-2">
                      <img
                        src={
                          process.env.PUBLIC_URL +
                          "/assets/images/signInFormLogo.png"
                        }
                        width="45"
                        height="45"
                        alt=""
                      />
                      <span className="app-brand-text demo text-body-title fw-bolder">
                        HOSTEL
                      </span>
                    </a>
                  </div>
                  <h4 className="mb-2">Forgot Password? 🔒</h4>
                  <p className="mb-4">
                    Enter your email and we'll send you instructions to reset
                    your password
                  </p>
                  <form
                    id="formAuthentication"
                    onSubmit={(e) => {
                      handleInitialSubmit();
                      e.preventDefault();
                    }}
                    className="mb-3"
                  >
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Employee ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="Enter your Employee ID"
                        value={employeeID}
                        onChange={(e) => setEmployeeID(e.target.value.toUpperCase())}
                        autoFocus
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        className="form-control"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <button
                      className="btn btn-primary d-grid w-100"
                      type="submit"
                      style={
                        isLoading
                          ? { padding: 0, justifyContent: "center" }
                          : {}
                      }
                    >
                      {isLoading ? (
                        <ColorRing
                          visible={true}
                          height="40"
                          width="40"
                          ariaLabel="blocks-loading"
                          wrapperStyle={{}}
                          wrapperClass="blocks-wrapper"
                          colors={[
                            "#e15b64",
                            "#f47e60",
                            "#f8b26a",
                            "#abbd81",
                            "#849b87",
                          ]}
                        />
                      ) : (
                        "Sent OTP"
                      )}{" "}
                    </button>
                  </form>
                  <div className="text-center">
                    <a
                      href="/"
                      className="d-flex align-items-center justify-content-center"
                    >
                      <i className="bx bx-chevron-left scaleX-n1-rtl bx-sm"></i>
                      Back to login
                    </a>
                  </div>
                </div>
              ) :
                (
                  <div>
                    <div className="app-brand justify-content-center">
                      <a href="/" className="app-brand-link gap-2">
                        <img
                          src={
                            process.env.PUBLIC_URL +
                            "/assets/images/signInFormLogo.png"
                          }
                          width="45"
                          height="45"
                          alt=""
                        />
                        <span className="app-brand-text demo text-body-title fw-bolder">
                          HOSTEL
                        </span>
                      </a>
                    </div>
                    <h4 className="mb-2">Reset Password 🔒</h4>
                    <p className="mb-4">Please enter the new Password</p>

                    <form
                      id="formAuthentication"
                      className="mb-3"
                      onSubmit={(e) => {
                        handlePasswordReset()
                        e.preventDefault();
                      }}
                    >
                      <div className="mb-3 form-password-toggle">
                        <div className="d-flex justify-content-between">
                          <label className="form-label" htmlFor="password">
                            new password
                          </label>
                        </div>
                        <div className="input-group input-group-merge">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            className="form-control"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                            aria-describedby="password"
                          />
                          <span
                            className="input-group-text cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <i className="bx bx-show"></i> : <i className="bx bx-hide"></i>}
                          </span>
                        </div>
                      </div>
                      <div className="mb-3 form-password-toggle">
                        <div className="d-flex justify-content-between">
                          <label className="form-label" htmlFor="password">
                            Confirm password
                          </label>
                        </div>
                        <div className="input-group input-group-merge">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            className="form-control"
                            name="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                            aria-describedby="password"
                          />
                          <span
                            className="input-group-text cursor-pointer"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <i className="bx bx-show"></i> : <i className="bx bx-hide"></i>}
                          </span>
                        </div>
                      </div>
                      <div className="mt-5">
                        <button
                          className="btn btn-primary d-grid w-100"
                          type="submit"
                          style={
                            isLoading
                              ? { padding: 0, justifyContent: "center" }
                              : {}
                          }
                        >
                          {isLoadingReset ? (
                            <ColorRing
                              visible={true}
                              height="40"
                              width="40"
                              ariaLabel="blocks-loading"
                              wrapperStyle={{}}
                              wrapperClass="blocks-wrapper"
                              colors={[
                                "#e15b64",
                                "#f47e60",
                                "#f8b26a",
                                "#abbd81",
                                "#849b87",
                              ]}
                            />
                          ) : (
                            "Submit"
                          )}{" "}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              {error ? (
                <div
                  className="alert alert-danger alert-dismissible fade show mt-2"
                  role="alert"
                >
                  <strong>{errorMsg}</strong>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                    onClick={() => setError(false)}
                  ></button>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
