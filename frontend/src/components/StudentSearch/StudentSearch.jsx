import { React, useEffect, useState } from "react";
import "./StudentSearch.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import { ColorRing } from "react-loader-spinner";
import {
  deleteStudentDB,
  searchStudentComplaintsDb,
  searchStudentDataDb,
  updateStudentDb,
} from "../../firebase/superAdminFunctions";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import DeleteIcon from "@mui/icons-material/Delete";
import { BLOCKS, BLOCKS_SELECT, MESS_SELECT } from "../../dataAssets";

import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import StudentHistoryTable from "../studentComplaintHistory/studentComplaintHistory";

const StudentSearch = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("userData");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [showStudentData, setShowStudentData] = useState(false);
  const [showStudentComplaintData, setShowStudentComplaintData] =
    useState(false);
  const [studentData, setStudentData] = useState({});
  const [studentComplaintsData, setStudentComplaintsData] = useState([]);

  const [newBlock, setNewBlock] = useState("");
  const [editStudentData, setEditStudentData] = useState(false);
  const [newMess, setNewMess] = useState("");
  const [newMessType, setNewMessType] = useState("");
  const [newRoom, setNewRoom] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  const MESS_TYPE = {
    veg: "Veg",
    nonveg: "Non veg",
    special: "Special",
    paid: "Paid",
  };

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

  async function handleSearch() {
    setSearchLoading(true);
    setEditStudentData(false)
    if (searchValue.length === 0) {
      setSearchError(true);
    } else if (!searchValue.includes("@vitstudent.ac.in")) {
      setSearchError(true);
      Toast.fire({
        icon: "error",
        title: "Enter valid Email",
      });
    } else {
      setShowStudentComplaintData(false);
      setShowStudentData(false);
      if (searchType == "userData") {
        let studentDataResponse = await searchStudentDataDb(searchValue);
        if (studentDataResponse.status) {
          setStudentData({
            ...studentDataResponse.data,
          });
          setNewBlock(studentDataResponse.data.block);
          setNewMess(studentDataResponse.data.mess);
          setNewMessType(studentDataResponse.data.messType);
          setNewRoom(studentDataResponse.data.room);
          setShowStudentData(true);
        } else {
          if (studentDataResponse.type === "nf") {
            Toast.fire({
              icon: "error",
              title: "No Student Found",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Some error occured. Please try again",
            });
          }
        }
      } else {
        let studentDataResponse = await searchStudentComplaintsDb(searchValue);
        if (studentDataResponse.status) {
          setStudentComplaintsData(studentDataResponse.data);
          setShowStudentComplaintData(true);
        } else {
          if(studentDataResponse.type == 'nf'){
            Toast.fire({
              icon: "error",
              title: "No Student Found",
            });
          }
          else{
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Some error occured. Please try again",
            });
          }
        }
      }
    }
    setSearchLoading(false);
  }

  function handleEditCancel() {
    setNewBlock(studentData.block);
    setNewMess(studentData.mess);
    setNewMessType(studentData.messType);
    setNewRoom(studentData.room);
    setEditStudentData(false);
  }

  async function handleUpdate() {
    setUpdateLoading(true);
    if (newBlock && newMess && newMessType && newRoom) {
      if (
        newBlock !== studentData.block ||
        newMess !== studentData.mess ||
        newMessType !== studentData.messType ||
        newRoom !== studentData.room
      ) {
        let response = await updateStudentDb(studentData._id, {
          block:  newBlock,
          mess: newMess,
          messType: newMessType,
          room: newRoom,
        });
        if (response.status) {
          let newStudentData = studentData;
          newStudentData.block = newBlock;
          newStudentData.room = newRoom;
          newStudentData.mess = newMess;
          newStudentData.messType = newMessType;
          setStudentData(newStudentData);
          setNewBlock(newBlock);
          setNewMess(newMess);
          setNewMessType(newMessType);
          setNewRoom(newRoom);
          setEditStudentData(false);
        } else {
          Toast.fire({
            icon: "error",
            title: "Some error occured",
          });
        }
      } else {
        handleEditCancel();
      }
    } else {
    }
    setUpdateLoading(false);
  }

  const deleteStudent = async () => {
    let response = await deleteStudentDB(studentData.email);

    if (response) {
      Toast.fire({
        icon: "success",
        title: "Student Account Deleted",
      });
      setShowStudentData(false);
      setSearchValue("");
    } else {
      Toast.fire({
        icon: "error",
        title: "Some error occured",
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ padding: "1.5rem" }}>
      <div className=" tableDiv container" id="contentDisplay">
        <div className="row p-2">
          <h5 className="fw-bold py-3 mb-4">
            <span className="text-muted fw-light"></span>
            STUDENT SEARCH
          </h5>
          <div className="col-xl-12">
            <div className="nav-align-top mb-4">
              <div className="tab-content row" id="">
                <div className="col-md-6 p-2">
                  {searchError ? (
                    <TextField
                      id="outlined-basic"
                      label="Please Enter a Email"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={searchValue}
                      onChange={(e) => {
                        setSearchError(false);
                        setSearchValue(e.target.value);
                      }}
                      error
                    />
                  ) : (
                    <TextField
                      disabled={searchLoading ? true : false}
                      id="outlined-basic"
                      label="Email"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  )}
                </div>
                <div className="searchButton text-center col-md-4 p-2">
                  <FormControl>
                    <RadioGroup
                      value={searchType}
                      onChange={(e) => {
                        setSearchType(e.target.value);
                      }}
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                    >
                      <FormControlLabel
                        value="userData"
                        control={<Radio />}
                        label="User Data"
                      />
                      <FormControlLabel
                        value="complaints"
                        control={<Radio />}
                        label="Complaints"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
                <div className="searchButton text-center col-md-2 p-2">
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={handleSearch}
                    disabled={searchLoading ? true : false}
                    style={searchLoading ? { padding: "0" } : {}}
                  >
                    {searchLoading ? (
                      <ColorRing
                        visible={true}
                        height="40"
                        width="40"
                        ariaLabel="blocks-loading"
                        wrapperStyle={{}}
                        className="blocks-wrapper"
                        colors={[
                          "#e15b64",
                          "#f47e60",
                          "#f8b26a",
                          "#abbd81",
                          "#849b87",
                        ]}
                      />
                    ) : (
                      "Search"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showStudentData ? (
        <section className="tableDiv container" id="contentDisplay">
          <div className="row p-1" style={{ justifyContent: "center" }}>
            <div
              className="col-md-3 m-2 text-center p-4"
              style={{
                backgroundColor: "#fff",
                borderRadius: "11px",
                boxShadow: "2px 3px 3px rgb(0 0 0 / 25%)",
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/1177/1177568.png"
                alt=""
                height="100"
                width="100"
              />
              <h5 className="mt-4" id="employeeName">
                {studentData.name}
              </h5>
            </div>
            <div
              className="col-md-7 col-12 m-2 p-3"
              style={{
                backgroundColor: "#fff",
                borderRadius: "11px",
                boxShadow: "2px 3px 3px rgb(0 0 0 / 25%)",
              }}
            >
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td>Registration No</td>
                    <td id="employeeId">{studentData.regno}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td id="employeeEmail">{studentData.email}</td>
                  </tr>
                  <tr>
                    <td>Block</td>
                    <td id="employeePhoneNo">
                      {editStudentData ? (
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          value={newBlock}
                          onChange={(e) => setNewBlock(e.target.value)}
                        >
                          <option value="">Select Block</option>
                          {BLOCKS_SELECT.map((item, index) => (
                            <option value={item.value} key={index}>
                              {item.display}
                            </option>
                          ))}
                        </select>
                      ) : (
                        BLOCKS[studentData.block]
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Mess</td>
                    <td id="employeePhoneNo">
                      {editStudentData ? (
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          value={newMess}
                          onChange={(e) => setNewMess(e.target.value)}
                        >
                          <option value="">Select Mess</option>
                          {MESS_SELECT.map((item, index) => (
                            <option value={item} key={index}>
                              {item}
                            </option>
                          ))}
                        </select>
                      ) : (
                        studentData.mess
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Mess Type</td>
                    <td id="employeePhoneNo">
                      {editStudentData ? (
                        <FormControl sx={{}} size="small" fullWidth>
                          <InputLabel id="demo-select-small-label">
                            Mess Type
                          </InputLabel>
                          <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={newMessType}
                            label="Mess Type"
                            onChange={(e) => {
                              setNewMessType(e.target.value);
                            }}
                          >
                            <MenuItem value="special">Special</MenuItem>
                            <MenuItem value="nonveg">Non Veg</MenuItem>
                            <MenuItem value="veg">Veg</MenuItem>
                            <MenuItem value="paid">Paid</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        MESS_TYPE[studentData.messType]
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Room</td>
                    <td id="employeePhoneNo">
                      {editStudentData ? (
                        <TextField
                          disabled={searchLoading ? true : false}
                          id="outlined-basic"
                          label="Room"
                          type="number"
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={newRoom}
                          onChange={(e) => setNewRoom(e.target.value)}
                        />
                      ) : (
                        studentData.room
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ display: "flex", justifyContent: "end" }}>
                {editStudentData ? (
                  <>
                    <Button
                      variant="contained"
                      className="m-2"
                      onClick={handleUpdate}
                      disabled={updateLoading ? true : false}
                      style={updateLoading ? { padding: "0" } : {}}
                    >
                      {updateLoading ? (
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
                        "Update"
                      )}
                    </Button>
                    <Button
                      variant="contained"
                      className="m-2"
                      onClick={handleEditCancel}
                      color="error"
                      disabled={updateLoading ? true : false}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      className="m-2"
                      onClick={() => setEditStudentData(true)}
                    >
                      <i className="bx bxs-pencil mx-1"></i>Edit
                    </Button>
                    <Button
                      variant="contained"
                      className="m-2"
                      color="error"
                      onClick={deleteStudent}
                    >
                      <DeleteIcon />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div></div>
      )}
      {showStudentComplaintData ? (
        <StudentHistoryTable
          complaints={studentComplaintsData}
        ></StudentHistoryTable>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default StudentSearch;
