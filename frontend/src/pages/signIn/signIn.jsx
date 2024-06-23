import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { ColorRing } from "react-loader-spinner";
import "./signIn.css";
import { logoutAPI, validateUser } from "../../firebase/authentication";
import { useLocation, useNavigate } from "react-router-dom";

import { useCookies } from 'react-cookie'

function SignIn() {
  const [loginError, setLoginError] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState('Invalid Credentials!');
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false);

  const [cookies, setCookie] = useCookies(["user_token"]);
  const navigate = useNavigate();

  const { state } = useLocation()
  const { logoutMessage } = state ?? { logoutMessage: false }
  async function checkLogoutMessage() {
    if (logoutMessage) {
      logoutAPI()
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      Toast.fire({
        icon: 'success',
        title: 'Logged out successfully'
      }).then(async (e) => {
        navigate(null, { replace: true, state: { logoutMessage: false } })
      })
    }
  }
  useEffect(() => {
    checkLogoutMessage()
  }, [])

  const login = async () => {
    if (username.length !== 0 && password.length !== 0) {
      setIsLoading(true);
      let response = await validateUser(username, password)
      if (response.status) {
        let userData = response.userData
        setIsLoading(false);
        if (userData.accountType === '0') {
          navigate(`/superadmin`)
        }
        else {
          navigate(`/admin`, { state: { access: userData.accessRights } })
        }
      } else {
        response.type === 'incpass' ? setLoginErrorMsg('Incorrect Password!') :
          response.type === 'notfound' ? setLoginErrorMsg('User not Found!') : setLoginErrorMsg('Some Error Occured')
        setLoginError(true);
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="container-xxl">
        <div className="authentication-wrapper authentication-basic container-p-y">
          <div className="authentication-inner">
            <div className="card">
              <div className="card-body">
                <div className="app-brand justify-content-center">
                  <a
                    href="/"
                    className="app-brand-link gap-2"
                    style={{ textDecoration: "none" }}
                  >
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
                <h4 className="mb-2">
                  <strong id="welcomeTag">Welcome to HOSTEL!</strong>👋
                </h4>
                <p className="mb-4">
                  Please sign-in and start managing your Reports
                </p>
                <form
                  action=""
                  onSubmit={(event) => {
                    event.preventDefault();
                  }}
                >
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      required="required"
                      autoComplete="off"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value.toUpperCase());
                      }}
                      placeholder="Enter your username"
                      autoFocus
                    />
                  </div>
                  <div className="mb-4 form-password-toggle">
                    <div className="d-flex justify-content-between">
                      <label className="form-label" htmlFor="password">
                        Password
                      </label>
                    </div>
                    <div className="input-group input-group-merge">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        name="password"
                        required="required"
                        placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                      <span className="input-group-text cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <i className="bx bx-show"></i> : <i className="bx bx-hide"></i>}
                      </span>
                    </div>
                    <div className="d-flex justify-content-end">
                      <a
                        href="/password-reset"
                        style={{ textDecoration: "none", color: '#696cff' }}
                      >
                        <small>Forgot Password?</small>
                      </a>
                    </div>
                  </div>
                  <div className="mb-3">
                    <button
                      className="btn btn-primary d-grid w-100"
                      type="submit"
                      id="signInButton"
                      onClick={login}
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
                        "Sign in"
                      )}{" "}
                    </button>
                  </div>
                </form>
                

                {loginError ? (
                  <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                  >
                    <strong>{loginErrorMsg}</strong>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="alert"
                      aria-label="Close"
                      onClick={() => setLoginError(false)}
                    ></button>
                  </div>
                ) : (
                  <div></div>
                )}

                <div>
                  <div className=" center mb-2">
                    <h6>Click to get demo credentials</h6>
                  </div>
                  <div className=" center">
                    <button type="button" class="btn btn-sm btn-primary" onClick={() => {
                      setUsername("SUPERADMIN")
                      setPassword("1234")
                    }}>Super Admin</button>
                    <button type="button" class="btn btn-sm btn-primary" style={{minWidth: "98px"}}  onClick={() => {
                      setUsername("ADMIN")
                      setPassword("1234")
                    }}>Admin</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
