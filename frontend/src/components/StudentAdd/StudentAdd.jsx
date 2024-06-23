import { React, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { BLOCKS_SELECT, MESS_SELECT } from "../../dataAssets";
import { addStudentDb } from "../../firebase/superAdminFunctions";
import Swal from "sweetalert2";

import CircularProgress from '@mui/material/CircularProgress';

function StudentAdd() {
  const [name, setName] = useState("");
  const [regno, setRegno] = useState("");
  const [email, setEmail] = useState("");
  const [block, setBlock] = useState("");
  const [mess, setMess] = useState("");
  const [messType, setMessType] = useState("");
  const [room, setRoom] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  async function handleAdd() {
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
    if (
      name.length !== 0 &&
      regno.length !== 0 &&
      email.length !== 0 &&
      block.length !== 0 &&
      mess.length !== 0 &&
      messType.length !== 0 &&
      room.length !== 0 &&
      phoneno.length !== 0
    ) {
      if (!email.includes('@vitstudent.ac.in')) {
        Toast.fire({
          icon: "error",
          title: "Enter valid Email",
        });
        setIsLoading(false)
      }
      else if (phoneno.length != 10) {
        Toast.fire({
          icon: "error",
          title: "Enter valid Phone No",
        });
        setIsLoading(false)
      }
      else {
        let response = await addStudentDb(email, {
          name,
          regno,
          block,
          mess,
          messType,
          room,
          phoneno,
        });
        if (response.status) {
          Toast.fire({
            icon: "success",
            title: "Student Added",
          });
          setBlock('')
          setEmail('')
          setMess('')
          setMessType('')
          setName('')
          setPhoneno('')
          setRegno('')
          setRoom('')
          setIsLoading(false)
        }
        else {
          if (response.type == 'exists') {
            Toast.fire({
              icon: "info",
              title: "Email already Exists",
            });
            setIsLoading(false)
          }
          else {
            Toast.fire({
              icon: "error",
              title: "Some error occured",
            });
            setIsLoading(false)
          }
        }
      }

    } else {
      Toast.fire({
        icon: "error",
        title: "Enter all the details",
      });
      setIsLoading(false)
    }
  }
  return (
    <div>
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <h5 className="fw-bold py-3 mb-4">
                <span className="text-muted fw-light"></span>
                ADD STUDENT
              </h5>
              <div className="row">
                <div className="col-md-12">
                  <div className="card mb-4">
                    <h5 className="card-header">Student Details</h5>
                    <hr className="my-0" />
                    <div className="card-body container">
                      <div className="row m-1 ">
                        <div className="col-md-6 p-2">
                          <TextField
                            id="outlined-basic"
                            className=''
                            label="Name"
                            variant="outlined"
                            size="small"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                          />
                        </div>
                        <div className="col-md-6 p-2">
                          <TextField
                            id="outlined-basic"
                            label="Registration No"
                            value={regno}
                            onChange={(e) => setRegno(e.target.value)}
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        </div>
                      </div>
                      <div className="row m-1">
                        <div className="col-md-6 p-2">
                          <TextField
                            id="outlined-basic"
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        </div>
                        <div className="col-md-6 p-2">
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            value={block}
                            onChange={(e) => setBlock(e.target.value)}
                          >
                            <option value="">
                              Select Block
                            </option>
                            {BLOCKS_SELECT.map((item,index) => (
                              <option value={item.value} key={index}>{item.display}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="row m-1 ">
                        <div className="col-md-6 p-2">
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            value={mess}
                            onChange={(e) => setMess(e.target.value)}
                          >
                            <option value="" >
                              Select Mess
                            </option>
                            {MESS_SELECT.map((item,index) => (
                              <option value={item} key={index}>{item}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-3 p-2">
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            value={messType}
                            onChange={(e) => setMessType(e.target.value)}
                          >
                            <option value="" >
                              Select Mess Type
                            </option>
                            <option value="special">Special</option>
                            <option value="nonveg">Non Veg</option>
                            <option value="veg">Veg</option>
                            <option value="paid">Paid</option>
                          </select>
                        </div>
                        <div className="col-md-3 p-2">
                          <TextField
                            id="outlined-basic"
                            label="Room"
                            type="number"
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        </div>
                      </div>
                      <div className="row m-1">
                        <div className="col-md-6 p-2">
                          <TextField
                            id="outlined-basic"
                            label="Phone Number"
                            type="number"
                            value={phoneno}
                            onChange={(e) => {
                              if (e.target.value.length <= 10) {
                                setPhoneno(e.target.value)
                              }
                            }}
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        </div>
                      </div>
                      <div className="mt-4 m-3 p-1">
                        <Button
                        disabled={isLoading}
                          variant="contained"
                          onClick={handleAdd}
                          size="small"
                        >
                          {isLoading ? <CircularProgress size={23} color="inherit" /> : 'Submit'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-backdrop fade"></div>
          </div>
        </div>
        <div className="layout-overlay layout-menu-toggle"></div>
      </div>
    </div>
  );
}

export default StudentAdd;
