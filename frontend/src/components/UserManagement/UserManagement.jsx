import Swal from "sweetalert2";
import { React, useState } from "react";
import { addNewUser } from "../../firebase/superAdminFunctions";
import CircularProgress from '@mui/material/CircularProgress';

const UserManagement = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [accountType, setAccountType] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const [maintenace, setMaintenace] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [food, setFood] = useState(false);
  const [discipline, setDiscipline] = useState(false);

  async function handleRegister() {
    setIsLoading(true)
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
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success m-1',
        cancelButton: 'btn btn-danger m-1'
      },
      buttonsStyling: false
    })
    if (employeeId.trim() !== '' && name.trim() !== '' && email.trim() !== '' && phoneno !== '' && accountType !== '') {
      if (!/^[A-Za-z0-9]*$/.test(employeeId)) {
        Toast.fire({
          icon: "info",
          title: "Employee Id can only contain Letters and Numbers",
        });
      }
      else if (!/^[A-Za-z\s]*$/.test(name)) {
        Toast.fire({
          icon: "info",
          title: "Name can only contain Letters",
        });
      }
      else if (email.trim().split('@')[1] != 'vitstudent.ac.in') {
        Toast.fire({
          icon: "info",
          title: "Enter a valid VIT mail id",
        });
      }
      else if (phoneno.toString().trim().length != 10) {
        Toast.fire({
          icon: "info",
          title: "Enter a valid Phone No",
        });
      }
      else {
        if (accountType === '0') {
          let response = await addNewUser(employeeId, {
            name, email, phoneno, accountType
          })
          if (response.status) {
            swalWithBootstrapButtons.fire(
              'Added!',
              'The Employee details has been uploaded Successfully.',
              'success'
            )
            setAccountType('')
            setCleaning(false)
            setDiscipline(false)
            setMaintenace(false)
            setFood(false)
            setEmail('')
            setName('')
            setPhoneno('')
            setEmployeeId('')
          }
          else {
            if (response.type == 'exists') {
              swalWithBootstrapButtons.fire(
                'User Exists!',
                'The provided Employee Id Account Already exists.',
                'error'
              )
            }
            else {
              swalWithBootstrapButtons.fire(
                'Oops!',
                'Some error occured while creating the account. Please try again later',
                'error'
              )
            }
          }
        }
        else {
          if (maintenace || cleaning || food || discipline) {
            let accessRights = []
            if (maintenace) { accessRights.push('maintenance') }
            if (cleaning) { accessRights.push('cleaning') }
            if (food) { accessRights.push('food') }
            if (discipline) { accessRights.push('discipline') }
            let response = await addNewUser(employeeId, {
              name, email, phoneno, accountType, accessRights
            })
            if (response.status) {
              swalWithBootstrapButtons.fire(
                'Uploaded!',
                'The Employee details has been uploaded Successfully.',
                'success'
              )
              setAccountType('')
              setCleaning(false)
              setDiscipline(false)
              setMaintenace(false)
              setFood(false)
              setEmail('')
              setName('')
              setPhoneno('')
              setEmployeeId('')
            }
            else {
              if (response.type == 'exists') {
                swalWithBootstrapButtons.fire(
                  'User Exists!',
                  'The provided Employee Id Account Already exists.',
                  'error'
                )
              }
              else {
                swalWithBootstrapButtons.fire(
                  'Oops!',
                  'Some error occured while creating the account. Please try again later',
                  'error'
                )
              }
            }

          }
          else {
            Toast.fire({
              icon: "info",
              title: "Select the access permissions of the user",
            });
          }
        }
      }
      setIsLoading(false)
    }
    else {
      Toast.fire({
        icon: "error",
        title: "Enter all the details",
      });
      setIsLoading(false)
    }
  }
  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner" style={{ maxWidth: "600px" }}>
          <div className="card">
            <div className="card-body">
              <div className="app-brand justify-content-center">
                <a
                  href="/"
                  className="app-brand-link gap-2"
                  style={{ textDecoration: "none" }}
                >
                  <img
                    src={process.env.PUBLIC_URL + "/assets/images/signInFormLogo.png"}
                    width="45"
                    height="45"
                    alt=""
                  />
                  <span className="app-brand-text demo text-body-title fw-bolder">
                    HOSTEL
                  </span>
                </a>
              </div>
              <h4 className="mb-2">Account Registration 🚀</h4>
              <p className="mb-4">Make your course management easy!</p>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="idFacultyId" className="form-label">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder=""
                    required="required"
                    autoComplete="off"
                    autoFocus
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="idname" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                  placeholder=""
                  required="required"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="idEmail" className="form-label">
                  VIT Mail ID
                </label>
                <input
                  type="email"
                  className="form-control"
                  autoComplete="off"
                  required="required"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="idPhoneNumber" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    autoComplete="off"
                    value={phoneno}
                    onChange={(e) => setPhoneno(e.target.value)}
                    required="required"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="idPhoneNumber" className="form-label">
                    Account Type
                  </label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                  >
                    <option>Select Account Type</option>
                    <option value="0">Super Admin</option>
                    <option value="1">Admin</option>
                  </select>
                </div>
              </div>
              {accountType == "1" ? (
                <div className="row m-4">
                  <div className="form-check form-switch col-md-6">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      value={maintenace}
                      onChange={(e) => setMaintenace(!maintenace)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      Maintenance
                    </label>
                  </div>
                  <div className="form-check form-switch col-md-6">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      value={cleaning}
                      onChange={(e) => setCleaning(!cleaning)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      Cleaning
                    </label>
                  </div>
                  <div className="form-check form-switch col-md-6">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      value={discipline}
                      onChange={(e) => setDiscipline(!discipline)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      Discipline
                    </label>
                  </div>
                  <div className="form-check form-switch col-md-6">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      value={food}
                      onChange={(e) => setFood(!food)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexSwitchCheckDefault"
                    >
                      Food
                    </label>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
              <div style={{ justifyContent: 'center', display: 'flex' }}>
                <button className="btn btn-primary d-grid w-50 mt-5" style={{ justifyContent: 'center', display: 'flex' }} disabled={isLoading} onClick={handleRegister}>
                  {isLoading ? <CircularProgress size={23} color="inherit" /> : 'Register User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
