import { React, useState, useEffect } from "react";
import "./DisciplineTable.css";
import { DISCIPLINE, BLOCKS } from "../../dataAssets";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import format from "date-fns/format"; // theme css file
import {
  upadateComplaint,
  setFeedBacktoDB,
  getComplaints,
} from "../../firebase/complains";
import { CSVLink } from "react-csv";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import { ColorRing } from "react-loader-spinner";

const block = BLOCKS;

const DisciplineTable = () => {
  const [complains, setComplains] = useState([]);
  const [downloaData, setdownloaData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies(["discipline_cookie"]);

  const fetchData = async () => {
    setLoading(true);
    let cookieExists = cookies.discipline_cookie;
    // let cookieData = cookieExists ? cookieExists.data : [];
    let cookieData = [];
    if (cookieData.length !== 0) {
      console.log("from cookie");
      setComplains(cookieData);
      setdownloaData(cookieData);
      setLoading(false);
    } else {
      const response = await getComplaints("discipline");
      let timeModifiedData = [];
      response.map((item, index) => {
        timeModifiedData.push({
          ...item,
          createdAt: new Date(item.createdAt).toString(),
        });
      });
      let expires = new Date();
      console.log("from db");

      expires.setTime(expires.getTime() + 20 * 60 * 1000);
      setCookie(
        "discipline_cookie",
        { data: timeModifiedData },
        { path: "/", expires }
      );
      setComplains(timeModifiedData);
      setdownloaData(timeModifiedData);
      setLoading(false);
      
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [floor, setFloor] = useState("");
  const floorHandler = (event) => {
    setFloor(event.target.value);
  };

  const [block, SetBlock] = useState("");
  const blockHandler = (event) => {
    SetBlock(event.target.value);
  };

  const [complainType, setComplainType] = useState("");
  const TypeHandler = (event) => {
    setComplainType(event.target.value);
  };

  const setDownloadComplains = () => {
    setdownloaData((prev) =>
      prev.filter((complaint) => {
        if (
          (!block ||
            complaint.block[0].toLowerCase() === block.toLowerCase()) &&
          (!floor ||
            Math.floor(Number(complaint.room) / 100) === Number(floor)) &&
          (!complainType || complaint.category === complainType)
        )
          return true;

        return false;
      })
    );
  };

  return (
    <div>
      <h4 class="fw-bold py-3 mb-4">
        <span class="text-muted fw-light"></span>
        Discipline Table
      </h4>
      <form>
        <div class="filters row justify-content-md-center p-3">
          <div class="col">
            <label for="exampleFormControlInput1" class="form-label">
              Block
            </label>
            <input
              type="text"
              class="form-control"
              name="block"
              value={block}
              onChange={blockHandler}
              placeholder="Block"
            />
          </div>
          <div class="col">
            <label for="exampleFormControlInput1" class="form-label">
              Floor
            </label>
            <input
              type="text"
              class="form-control"
              name="floor"
              value={floor}
              onChange={floorHandler}
              placeholder="Floor"
            />
          </div>
          <div class="col">
            <label class="form-label">Complain Type</label>
            <select
              value={complainType}
              onChange={TypeHandler}
              name=""
              id=""
              className="form-select form-select-md"
            >
              <option value={""}>Select complain type</option>
              {Object.keys(DISCIPLINE).map((key) => {
                return <option value={key}>{DISCIPLINE[key]}</option>;
              })}
            </select>
          </div>
          <div class="col">
            <button type="submit" class="btn-1">
              <CSVLink
                style={{ color: "white" }}
                filename={`PENDING-DISCIPLINE-COMPLAIN-${format(
                  new Date(),
                  "dd-MM-yyyy"
                )}`}
                data={downloaData}
                onClick={setDownloadComplains}
              >
                Download Complain
              </CSVLink>
            </button>
          </div>
        </div>
      </form>
      {isLoading ? (
        <div style={{ textAlign: "center" }}>
          <ColorRing
            visible={true}
            height="40"
            width="40"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />{" "}
        </div>
      ) : complains.length === 0 ? (
        <div className="p-4 d-flex justify-content-center display-2">
          no complains
        </div>
      ) : (
        <div className="tableDiv">
          <table className="table table-hover table-sm">
            <thead>
              <tr>
                <th>SNO</th>
                <th>Name</th>
                <th>Reg No</th>
                <th>Block</th>
                <th>Room</th>
                <th>Complaint</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {complains
                .filter((complaint) => {
                  var b = complaint.block
                  if (
                    (!block ||
                      b.toLowerCase().includes(block.toLowerCase())) &&
                    (!floor ||
                      Math.floor(Number(complaint.room) / 100) ===
                        Number(floor)) &&
                    (!complainType || complaint.category === complainType)
                  )
                    return true;

                  return false;
                })
                .map((item, index) => {
                  return (
                    <TableRow
                      key={item.id}
                      item={item}
                      index={index}
                      setComplaint={setComplains}
                    />
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

function TableRow({ item, index, setComplaint }) {
  const [expanded, setExpanded] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showFeedbackError, setShowFeedbackError] = useState(false);

  const [cookies, setCookie] = useCookies(["user_token"]);
  let userStatus = cookies.user_token;
  let userId = userStatus ? userStatus.userId : "";

  function handleFeedback() {
    if (showFeedback) {
      setShowFeedback(false);
      setFeedback("");
    } else {
      setExpanded(true);
      setShowFeedback(true);
    }
  }

  function handleExpand() {
    if (showFeedback) {
      setExpanded(!expanded);
      setShowFeedback(false);
    } else {
      setExpanded(!expanded);
    }
  }

  const handleDeny = async () => {
    if (feedback.length === 0 || feedback === null) {
      setShowFeedbackError(true);
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "error",
        title: "Feedback is empty",
      });
    } else {
      await setFeedBacktoDB("discipline", item._id, feedback, userId, item);
      setComplaint((prev) =>
        prev.filter((element) => {
          return item._id !== element._id;
        })
      );
      setExpanded(false);
      setFeedback("");

      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "success",
        title: "Complain Deny",
      });
    }
  };

  const handleReslove = async () => {
    const response = await upadateComplaint(
      "discipline",
      item._id,
      userId,
      item
    );
    setComplaint((prev) =>
      prev.filter((element) => {
        return item._id !== element._id;
      })
    );

    setExpanded(false);

    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "success",
      title: "Complain Resloved",
    });
  };

  return (
    <>
      <tr>
        <td>{index + 1}</td>
        <td>{item.name}</td>
        <td>{item.regno}</td>
        <td>{block[item.block]}</td>
        <td>{item.room}</td>
        <td>{item.studentEmail}</td>
        <td>
          <button
            className="btn btn-outline-info btn-sm collapse-btn"
            onClick={handleExpand}
          >
            {expanded ? (
              <i class="bx bx-chevron-up"></i>
            ) : (
              <i class="bx bx-chevron-down"></i>
            )}
          </button>
          <button
            className="btn btn-outline-success btn-sm collapse-btn success-btn"
            onClick={handleReslove}
          >
            <i class="bx bx-check"></i>
          </button>
          <button
            className="btn btn-outline-danger btn-sm collapse-btn"
            onClick={handleFeedback}
          >
            <i class="bx bx-x"></i>
          </button>
        </td>
      </tr>
      <tr style={expanded ? {} : { display: "none" }}>
        <td colSpan={7}>
          <div className="container-fluid">
            <div className="expandableDiv">
              <div className="left">
                <table className="table table-borderless">
                  <tr>
                    <th>Created At&nbsp;:&nbsp;</th>
                    <td>{item.createdAt}</td>
                  </tr>
                  <tr>
                    <th>Regarding:</th>
                    <td>{DISCIPLINE[item.category]}</td>
                  </tr>
                  <tr>
                    <th>Complaint&nbsp;:&nbsp;</th>
                    <td>{item.complainDesc}</td>
                  </tr>
                </table>
                <div
                  className="feedbackDiv row"
                  style={showFeedback ? {} : { display: "none" }}
                >
                  <div className="input col-8">
                    {showFeedbackError ? (
                      <TextField
                        value={feedback}
                        onChange={(e) => {
                          if (showFeedbackError) {
                            setShowFeedbackError(false);
                          }
                          setFeedback(e.target.value);
                        }}
                        id="outlined-basic"
                        label="Please enter a Feedback"
                        variant="outlined"
                        size="small"
                        fullWidth
                        error
                      />
                    ) : (
                      <TextField
                        value={feedback}
                        onChange={(e) => {
                          setFeedback(e.target.value);
                        }}
                        id="outlined-basic"
                        label="Enter a Feedback"
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    )}
                  </div>
                  <div className="denyBtn col-4">
                    <Button
                      variant="contained"
                      color="error"
                      endIcon={<SendIcon />}
                      size="small"
                      onClick={handleDeny}
                    >
                      {" "}
                      Deny{" "}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}

export default DisciplineTable;
