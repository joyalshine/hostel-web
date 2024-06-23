import { React, useState } from "react";
import Button from "@mui/material/Button";
import {
  MAINTENANCE,
  MESS,
  DISCIPLINE,
  CLEANING,
  BLOCKS,
} from "../../dataAssets";
import format from "date-fns/format"; // theme css file
import { getHistoryComplains } from "../../firebase/complains";
import { CSVLink } from "react-csv";
import { Pagination } from "@mui/material";
import { ColorRing } from "react-loader-spinner";
import Swal from "sweetalert2";

const todayDate = new Date(new Date().setHours(0, 0, 0, 0));
const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const setDate = format(todayDate, "yyyy-MM-dd");
const setFirstDay = format(firstDay, "yyyy-MM-dd");
const block = BLOCKS;

function SuperAdminHistory() {
  const [isLoading, setLoading] = useState(false);
  const [complains, setComplains] = useState([]);
  const [downloaData, setdownloaData] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [subFiltersdisabled, setsubFiltersdisabled] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [filters, setFilters] = useState({
    category: "",
    startDate: setFirstDay,
    endDate: setDate,
  });

  const [subFilters, setSubFlters] = useState({
    block: "",
    floor: "",
    complainType: "",
  });

  let complainCatgory = {
    "": "",
    mess: MESS,
    discipline: DISCIPLINE,
    cleaning: CLEANING,
    maintenance: MAINTENANCE,
  };

  const fetchData = async () => {
    setShowHistory(true);
    setLoading(true);
    setDisabled(true);
    setsubFiltersdisabled(true);

    // const startDate = new Date(filters.startDate).toISOString();
    // const endDate = new Date(filters.endDate).toISOString();

    try {
      let response = await getHistoryComplains(
        filters.category,
        filters.startDate,
        filters.endDate
      );
      if (!response) {
        response = [];
      }

      setComplains(response);
      setdownloaData(response);
      setsubFiltersdisabled(false);
      setDisabled(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const subFiltersHandler = (event) => {
    setSubFlters(() => ({
      ...subFilters,
      [event.target.name]: event.target.value,
    }));
  };

  const filtersHandler = (event) => {
    setShowHistory(false);
    setFilters(() => ({
      ...filters,
      [event.target.name]: event.target.value,
    }));
    setSubFlters({
      block: "",
      floor: "",
      complainType: "",
    });

    setComplains([]);
    setdownloaData([]);
  };

  const setDownloadComplains = () => {
    const categoryType = complainCatgory[filters.category];
    setdownloaData((prev) =>
      prev.filter((complain) => {
        // const block = BLOCKS[complain.block];

        // const subCategory =
        //   filters.category === "discipline" || filters.category === "mess"
        //     ? [categoryType[complain.category]]
        //     : complain.category.map((type) => categoryType[type]);

        let category =
          filters.category === "discipline" || filters.category === "mess"
            ? complain.category === subFilters.complainType
            : complain.category.find(
                (type) => type === subFilters.complainType
              );
        let blockFilter =
          !subFilters.block ||
          complain.block[2].toLowerCase() === subFilters.block.toLowerCase();

        let floorFilter =
          !subFilters.floor ||
          Math.floor(Number(complain.room) / 100) === Number(subFilters.floor);

        if (
          blockFilter &&
          floorFilter &&
          (!subFilters.complainType || category)
        ) {
          // complain.block = block;
          // complain.category = subCategory;

          return true;
        }
        return false;
      })
    );
  };

  const complainPerPages = 5;
  const [pagination, setPagination] = useState({
    from: 0,
    to: complainPerPages,
  });

  const filterComplain = complains.filter((complain) => {
    const category =
      filters.category === "discipline" || filters.category === "mess"
        ? complain.category === subFilters.complainType
        : complain.category.find((type) => type === subFilters.complainType);
    if (
      (!subFilters.block ||
        complain.block[2].toLowerCase() === subFilters.block.toLowerCase()) &&
      (!subFilters.floor ||
        Math.floor(Number(complain.room) / 100) === Number(subFilters.floor)) &&
      (!subFilters.complainType || category)
    )
      return true;
    else {
      return false;
    }
  });
  const records = filterComplain.slice(pagination.from, pagination.to);
  const npage = Math.ceil(filterComplain.length / complainPerPages);

  const handlePageChange = (event, page) => {
    const from = (page - 1) * complainPerPages;
    const to = (page - 1) * complainPerPages + complainPerPages;

    setPagination({
      from: from,
      to: to,
    });
  };

  const onSumbit = (event) => {
    if (filters.category === null || filters.category === "") {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
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
        title: "Complaint Category is empty",
      });
      return;
    }
    fetchData();
    event.preventDefault();
  };

  return (
    <>
      <div>
        <div class="layout-wrapper layout-content-navbar">
          <div class="layout-container">
            <div class="content-wrapper">
              <div class="container-xxl flex-grow-1 container-p-y">
                <h4 class="fw-bold py-3 mb-4">
                  <span class="text-muted fw-light"></span>
                  Complaint History
                </h4>
                <div class="row">
                  <div class="col-md-12">
                    <div class="card mb-4">
                      <h5 class="card-header">Filters</h5>
                      <hr class="my-0" />
                      <div class="card-body container">
                        <div className="row m-1 my-3">
                          <div className="col-md-6">
                            <label class="form-label">Complain Category</label>
                            <select
                              name="category"
                              class="form-select"
                              aria-label="Default select example"
                              value={filters.category}
                              onChange={filtersHandler}
                            >
                              <option value={""} selected>
                                Select Complain Category
                              </option>
                              {Object.keys(complainCatgory).map((key) => {
                                return (
                                  key !== "" && (
                                    <option value={key}>{key}</option>
                                  )
                                );
                              })}
                            </select>
                          </div>
                          <div className="col-md-6">
                            <div className="row">
                              {" "}
                              <div className="col-md-6">
                                <label class="form-label">Start Date</label>
                                <input
                                  type="date"
                                  class="form-control"
                                  name="startDate"
                                  placeholder="Start Date"
                                  value={filters.startDate}
                                  onChange={filtersHandler}
                                />
                              </div>
                              <div className="col-md-6">
                                <label class="form-label">End Date</label>
                                <input
                                  type="date"
                                  class="form-control"
                                  name="endDate"
                                  placeholder="End Date"
                                  value={filters.endDate}
                                  onChange={filtersHandler}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="mt-4 m-3">
                          <Button
                            type="submit"
                            variant="contained"
                            size="small"
                            onClick={onSumbit}
                            disabled={disabled}
                          >
                            Submit
                          </Button>
                        </div>

                        <hr class="my-0" />
                        <div className="row m-1 my-3">
                          <div class="col-4">
                            <label class="form-label">Block</label>
                            <input
                              className=""
                              type="text"
                              class="form-control"
                              name="block"
                              placeholder="Block"
                              value={subFilters.block}
                              onChange={subFiltersHandler}
                              disabled={
                                subFiltersdisabled ||
                                filters.category === "mess"
                              }
                            />
                          </div>
                          <div class="col-4">
                            <label class="form-label">Floor</label>
                            <input
                              type="text"
                              class="form-control"
                              name="floor"
                              placeholder="Floor"
                              value={subFilters.floor}
                              onChange={subFiltersHandler}
                              disabled={
                                subFiltersdisabled ||
                                filters.category === "mess"
                              }
                            />
                          </div>
                          <div class="col-4">
                            <label class="form-label">
                              {filters.category === "mess"
                                ? "Select Mess"
                                : "Complain Type"}
                            </label>
                            <select
                              name="complainType"
                              className="form-select form-select-md"
                              value={subFilters.complainType}
                              onChange={subFiltersHandler}
                              disabled={subFiltersdisabled}
                            >
                              <option value={""}>
                                {filters.category === "mess"
                                  ? "Select Mess"
                                  : "Select complain type"}
                              </option>
                              {Object.keys(
                                complainCatgory[filters.category]
                              ).map((key) => {
                                return (
                                  <option value={key}>
                                    {complainCatgory[filters.category][key]}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                        <div className="row m-1 my-3">
                          <CSVLink
                            className="w-auto p-2"
                            type="button"
                            size="small"
                            variant="contained"
                            style={{ color: "black" }}
                            filename={`RESOLVE-COMPLAIN-HISTORY-${filters.category.toUpperCase()}-${format(
                              new Date(),
                              "dd-MM-yyyy"
                            )}`}
                            data={downloaData}
                            onClick={setDownloadComplains}
                          >
                            Download Complain
                          </CSVLink>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {showHistory ? (
                  <div className="row">
                    <div className="col-md-12">
                      {isLoading ? (
                        <div className="p-2 d-flex justify-content-center">
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
                                {filters.category === "mess" ? (
                                  <th>Mess</th>
                                ) : (
                                  <>
                                    <th>Block</th>
                                    <th>Room</th>
                                  </>
                                )}
                                <th>Email</th>
                                <th>Status</th>
                                <th>Details</th>
                              </tr>
                            </thead>
                            <tbody>
                              {records.map((item, index) => {
                                return (
                                  <TableRow
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    complainType={
                                      complainCatgory[filters.category]
                                    }
                                    filters={filters}
                                    indexValue={pagination.from}
                                  />
                                );
                              })}
                              <div className="py-2 d-flex justify-content-start">
                                {" "}
                                <Pagination
                                  defaultPage={1}
                                  count={npage}
                                  variant="outlined"
                                  shape="rounded"
                                  color="primary"
                                  onChange={handlePageChange}
                                />
                              </div>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function TableRow({ item, index, filters, complainType, indexValue }) {
  const [expanded, setExpanded] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  let subCategory;

  if (filters.category === "discipline" || filters.category === "mess") {
    subCategory = complainType[item.category];
  } else {
    subCategory = complainType[item.category[0]];
    for (var i = 1; i < item.category.length; i++) {
      subCategory = subCategory + ", " + complainType[item.category[i]];
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
  return (
    <>
      <tr>
        <td>{indexValue + index + 1}</td>
        <td>{item.name}</td>
        <td>{item.regno}</td>
        {filters.category === "mess" ? (
          <th>{item.mess}</th>
        ) : (
          <>
            <th>{block[item.block]}</th>
            <th>{item.room}</th>
          </>
        )}
        <td>{item.studentEmail}</td>
        <td>
          {" "}
          <span
            className={
              item.status === "pending"
                ? "badge pendingBadge"
                : item.status === "deny"
                ? "badge deniedBadge"
                : "badge successBadge"
            }
          >
            {item.status === "pending"
              ? "PENDING"
              : item.status === "deny"
              ? "DENIED"
              : "RESOLVED"}
          </span>
        </td>
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
                    <td>{new Date(item.createdAt).toString()}</td>
                  </tr>
                  <tr>
                    <th>For:</th>
                    <td>{subCategory}</td>
                  </tr>
                  <tr>
                    <th>Employee ID : </th>

                    <td>{item.empId}</td>
                  </tr>
                  <tr>
                    <th>Complaint&nbsp;:&nbsp;</th>
                    <td>{item.complainDesc}</td>
                  </tr>
                  <tr>
                    {item.status === "deny" ? (
                      <th>Deined By</th>
                    ) : (
                      <th>Resolved By</th>
                    )}
                    <td>{new Date(item.updatedAt).toString()}</td>
                  </tr>
                  <tr>
                    {item.status === "deny" ? (
                      <>
                        {" "}
                        <th>Feedback</th>
                        <td>{item.feedback}</td>{" "}
                      </>
                    ) : (
                      <></>
                    )}
                  </tr>
                  {item.availableTime === "cac" ? (
                    <tr>
                      <th>Phone No&nbsp;:&nbsp;</th>
                      <td>{item.phoneno}</td>
                    </tr>
                  ) : (
                    <tr></tr>
                  )}
                </table>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}

export default SuperAdminHistory;
