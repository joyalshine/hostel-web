import { React, useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import "./MessMenu.css";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import CircularProgress from '@mui/material/CircularProgress';
import { checkMenuExist, fetchMessMenuHistoryKeys, uploadMessMenuDB } from "../../firebase/superAdminFunctions";
import MessMenuHistory from "../MessMenuHistory/MessMenuHistory";

function MessMenu() {
  const [uploadEvent, setUploadEvent] = useState("");
  const [extractedData, setExtractedData] = useState([]);
  const [menuKeys, setMenuKeys] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editData, setEditData] = useState();
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const [isLoadingUploadDB, setIsLoadingUploadDB] = useState(false);
  const [menuMonth, setMenuMonth] = useState();
  const [menuYear, setMenuYear] = useState();

  const previewUploadRef = useRef(null)

  const [editDates, setEditDates] = useState([]);
  const [dateList, setDateList] = useState([]);

  const [breakfast, setBreakfast] = useState('');
  const [lunch, setLunch] = useState('');
  const [snacks, setSnacks] = useState('');
  const [dinner, setDinner] = useState('');

  const [tabIndex, setTabIndex] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setShowEdit(false)
    setPreviewData(extractedData[newValue])
    setTabIndex(newValue);
  };

  const DAYS = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  const handleUpload = () => {
    setShowPreview(false)
    if (uploadEvent) {
      uploadEvent.preventDefault();
      Swal.fire({
        title: "Loading",
        text: "Please wait while we prepare the report for you",
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false
      })
      setIsLoadingUpload(true)

      var files = uploadEvent.target.files,
        f = files[0];
      var reader = new FileReader();
      reader.onload = async function (uploadEvent) {
        var data = uploadEvent.target.result;
        let readedData = XLSX.read(data, { type: "binary" });
        let SheetNames = readedData.SheetNames
        if (SheetNames[0].trim().toLowerCase() == 'special' && SheetNames[1].trim().toLowerCase() == 'n-veg' && SheetNames[2].trim().toLowerCase() == 'veg') {
          const specialwsname = readedData.SheetNames[0];
          const specialws = readedData.Sheets[specialwsname];
          const specialdataParse = XLSX.utils.sheet_to_json(specialws, { header: 1 });

          const nvegwsname = readedData.SheetNames[1];
          const nvegws = readedData.Sheets[nvegwsname];
          const nvegdataParse = XLSX.utils.sheet_to_json(nvegws, { header: 1 });

          const vegwsname = readedData.SheetNames[2];
          const vegws = readedData.Sheets[vegwsname];
          const vegdataParse = XLSX.utils.sheet_to_json(vegws, { header: 1 });

          const specialMessMenu = await segregateMenu(specialdataParse, specialwsname);
          if (specialMessMenu) {
            const nvegMessMenu = await segregateMenu(nvegdataParse, nvegwsname);
            if (nvegMessMenu) {
              const vegMessMenu = await segregateMenu(vegdataParse, vegwsname);
              if (vegMessMenu) {
                if (specialMessMenu[1] == nvegMessMenu[1] && vegMessMenu[1] == nvegMessMenu[1]) {
                  if (specialMessMenu[2] == nvegMessMenu[2] && vegMessMenu[2] == nvegMessMenu[2]) {

                    let noOfDays = new Date(nvegMessMenu[2], specialMessMenu[1], 0).getDate();
                    let tempDateList = []
                    for (var i = 1; i <= noOfDays; i++) {
                      tempDateList.push(`${i}.${specialMessMenu[1]}.${nvegMessMenu[2]}`)
                    }
                    setDateList(tempDateList)
                    setExtractedData([vegMessMenu[0], nvegMessMenu[0], specialMessMenu[0]]);
                    setMenuMonth(specialMessMenu[1])
                    setMenuYear(specialMessMenu[2])
                    setPreviewData(vegMessMenu[0])
                    setIsLoadingUpload(false)
                    Swal.close()
                    setShowPreview(true)
                    const swalWithBootstrapButtons = Swal.mixin({
                      customClass: {
                        confirmButton: 'btn btn-success m-1',
                        cancelButton: 'btn btn-danger m-1'
                      },
                      buttonsStyling: false
                    })
                    swalWithBootstrapButtons.fire(
                      'Extracted!',
                      'The mess menu preview is shown below please check it and make the required changes.',
                      'success'
                    )
                    previewUploadRef.current.scrollIntoView()
                  }
                  else {
                    Swal.close()
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: `The excel file contains menu of different Years. The Year of one sheet is not equal to the other`,
                    });
                    setIsLoadingUpload(false)
                  }
                }
                else {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `The excel file contains menu of different months. The month of one sheet is not equal to the other`,
                  });
                  setIsLoadingUpload(false)
                }
              }
              else {
                setIsLoadingUpload(false)
              }
            }
            else {
              setIsLoadingUpload(false)
            }
          }
          else {
            setIsLoadingUpload(false)
          }
        }
        else {
          await Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `The excel file does not contain all the following sheets Special, N-veg, Veg or is not in the order`,
          });
          setIsLoadingUpload(false)
        }
      };
      reader.readAsBinaryString(f);
    }
  };


  async function segregateMenu(dataParse, sheetName) {
    var messMenu = [];
    var dayMenu = {};
    let firstFlag = false;
    let month = -1
    let year = -1
    let error = false
    try {
      outerloop: for (var i = 3; i < dataParse.length; i++) {
        var rowData = dataParse[i];
        let firstData = rowData[0] ? rowData[0] : "";
        if (firstData.trim().toUpperCase() === "MESS TIME:") {
          messMenu.push(dayMenu);
          break;
        } else if (DAYS.includes(firstData.trim().toUpperCase())) {
          if (firstFlag) {
            messMenu.push(dayMenu);
          }
          dayMenu = {
            dates: [],
            breakfast: rowData[1] && rowData[1].trim() !== "" ? rowData[1].trim() + ' ' : "",
            lunch: rowData[2] && rowData[2].trim() !== "" ? rowData[2].trim() + ' ' : "",
            snacks: rowData[3] && rowData[3].trim() !== "" ? rowData[3].trim() + ' ' : "",
            dinner: rowData[4] && rowData[4].trim() !== "" ? rowData[4].trim() + ' ' : "",
          };
          firstFlag = true;
        } else if (firstData.trim() === "") {
          dayMenu["breakfast"] +=
            rowData[1] && rowData[1].trim() !== "" ? rowData[1].trim() + ' ' : "";
          dayMenu["lunch"] +=
            rowData[2] && rowData[2].trim() !== "" ? rowData[2].trim() + ' ' : "";
          dayMenu["snacks"] +=
            rowData[3] && rowData[3].trim() !== "" ? rowData[3].trim() + ' ' : "";
          dayMenu["dinner"] +=
            rowData[4] && rowData[4].trim() !== "" ? rowData[4].trim() + ' ' : "";
        } else if (firstData.trim().toUpperCase() === "DAYS") {
        } else {
          let dateData = firstData.trim().split(".");
          if (dateData.length !== 3) {
            error = true
            Swal.close()
            await Swal.fire({
              icon: "error",
              title: "Oops...",
              text: `Date contains error! Line no ${i + 1} in Sheet ${sheetName} `,
            });
            break;
          }
          if (parseInt(dateData[0]) > 31) {
            error = true
            Swal.close()
            await Swal.fire({
              icon: "error",
              title: "Oops...",
              text: `Invalid Date! Date greater than 31, Line no ${i + 1} in Sheet ${sheetName} `,
            });
            break;
          }
          for (var j = 0; j < 3; j++) {
            if (!/\d/.test(dateData[j]) || parseInt(dateData[j]) === 0) {
              error = true
              Swal.close()
              await Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Date contains a letter or is 0! Line no ${i + 1} in Sheet ${sheetName} `,
              });
              break outerloop;
            }
          }
          if (month == -1) {
            month = parseInt(dateData[1])
          }
          else if (month == parseInt(dateData[1])) { }
          else {
            error = true
            Swal.close()
            await Swal.fire({
              icon: "error",
              title: "Oops...",
              text: `Contains Date from multiple months! Line no ${i + 1} in Sheet ${sheetName} `,
            });
            break outerloop;
          }
          if (year == -1) {
            year = parseInt(dateData[2])
          }
          else if (year == parseInt(dateData[2])) { }
          else {
            error = true
            Swal.close()
            await Swal.fire({
              icon: "error",
              title: "Oops...",
              text: `Contains Date from multiple years! Line no ${i + 1} in Sheet ${sheetName} `,
            });
            break outerloop;
          }
          let newDates = dayMenu["dates"];
          newDates.push(`${parseInt(dateData[0])}.${parseInt(dateData[1])}.${parseInt(dateData[2])}`);
          dayMenu["dates"] = newDates;
          dayMenu["breakfast"] +=
            rowData[1] && rowData[1].trim() !== "" ? rowData[1].trim() + ' ' : "";
          dayMenu["lunch"] +=
            rowData[2] && rowData[2].trim() !== "" ? rowData[2].trim() + ' ' : "";
          dayMenu["snacks"] +=
            rowData[3] && rowData[3].trim() !== "" ? rowData[3].trim() + ' ' : "";
          dayMenu["dinner"] +=
            rowData[4] && rowData[4].trim() !== "" ? rowData[4].trim() + ' ' : "";
        }
      }
    }
    catch (err) {
      error = true
      Swal.close()
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Some error occured check the format of the Excel sheet ${sheetName} `,
      });
    }

    if (!error) {
      return [messMenu, month, year]
    }
    return
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setEditDates(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const updateMenuPreview = () => {
    if (editDates.length == 0) {
      Swal.fire({
        icon: "info",
        title: "Oops...",
        text: `Select the dates`,
      });
    }
    else if (breakfast.trim() === '') {
      Swal.fire({
        icon: "info",
        title: "Oops...",
        text: `Enter the breakfast Menu`,
      });
    }
    else if (lunch.trim() == '') {
      Swal.fire({
        icon: "info",
        title: "Oops...",
        text: `Enter the lunch Menu`,
      });
    }
    else if (snacks.trim() == '') {
      Swal.fire({
        icon: "info",
        title: "Oops...",
        text: `Enter the snacks Menu`,
      });
    }
    else if (dinner.trim() == '') {
      Swal.fire({
        icon: "info",
        title: "Oops...",
        text: `Enter the dinner Menu`,
      });
    }
    else {
      let newUpdatedMenu = {
        dates: editDates,
        breakfast: breakfast.trim(),
        lunch: lunch.trim(),
        snacks: snacks.trim(),
        dinner: dinner.trim()
      }
      let prevMenu = extractedData
      prevMenu[tabIndex][editData] = newUpdatedMenu
      setExtractedData(prevMenu)
      setPreviewData(prevMenu[tabIndex])
      setShowEdit(false)
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Menu has been updated',
        showConfirmButton: false,
        timer: 1500
      }).then((e) => {
        console.log(editData)
        let ind = ''
        if (editData == 0) {
          ind = 'previewHeading'
        }
        else {
          ind = `${editData - 1}-row`
        }
        let row = document.getElementById(ind)
        row.scrollIntoView(false, { block: "start", inline: "nearest", behavior: "smooth" })
      })
    }
  }


  const cancelMenuUpdate = () => {
    setShowEdit(false)
  }

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const updateMessMenuValidate = () => {
    setIsLoadingUploadDB(true)
    let menuNames = ['Veg', 'Non Veg', 'Special']
    let dataToUpload = []
    let noOfDays = new Date(menuYear, menuMonth, 0).getDate();
    let tempDateList = []
    for (var i = 1; i <= noOfDays; i++) {
      tempDateList.push(`${i}.${menuMonth}.${menuYear}`)
    }
    for (var i = 0; i < 3; i++) {
      let requiredData = {}
      let menu = extractedData[i]
      let dateCheckList = tempDateList
      let menuDates = []
      for (var j = 0; j < menu.length; j++) {
        let tempDates = menu[j]['dates']
        let dayMenu = {
          breakfast: menu[j]['breakfast'].trim(),
          lunch: menu[j]['lunch'].trim(),
          snacks: menu[j]['snacks'].trim(),
          dinner: menu[j]['dinner'].trim()
        }
        if (dayMenu['breakfast'] == '') {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${menuNames[i]} Menu contains empty breakfast data. Please add them and try uploading`,
          });
          setIsLoadingUploadDB(false)
          return
        }
        if (dayMenu['lunch'] == '') {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${menuNames[i]} Menu contains empty lunch data. Please add them and try uploading`,
          });
          setIsLoadingUploadDB(false)
          return
        }
        if (dayMenu['snacks'] == '') {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${menuNames[i]} Menu contains empty snacks data. Please add them and try uploading`,
          });
          setIsLoadingUploadDB(false)
          return
        }
        if (dayMenu['dinner'] == '') {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${menuNames[i]} Menu contains empty dinner data. Please add them and try uploading`,
          });
          setIsLoadingUploadDB(false)
          return
        }
        for (var z = 0; z < tempDates.length; z++) {
          dateCheckList.splice(dateCheckList.indexOf(tempDates[z]), 1)
          menuDates.push(tempDates[z])
          requiredData[parseInt(tempDates[z].split('.')[0])] = dayMenu
        }
      }
      if (dateCheckList.length != 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${menuNames[i]} Menu does not contain the dates ${dateCheckList.join(',')}. Please add them and try uploading`,
        });
        setIsLoadingUploadDB(false)
        return
      }
      else {
        if (menuDates.length == noOfDays) {
          dataToUpload.push(requiredData)
        }
        else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${menuNames[i]} Menu contains the duplicate dates. Please remove them and try uploading`,
          });
          setIsLoadingUploadDB(false)
          return
        }
      }
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to upload the Menu data to the database!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, upload it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        let response = await checkMenuExist(menuMonth, menuYear)
        console.log('exists')
        console.log(response)
        if (response.status) {
          Swal.fire({
            title: 'Menu already Exists?',
            text: "A menu already exists for this month do you want to replace it!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, replace!'
          }).then(async (result) => {
            if (result.isConfirmed) {
              let uploadResponse = uploadMessMenuDB(dataToUpload, menuMonth, menuYear)
              if (uploadResponse) {
                Swal.fire(
                  'Uploaded!',
                  'The Mess menu has been uploaded.',
                  'success'
                )
                setShowPreview(false)
                initializeSelectData()
                setIsLoadingUploadDB(false)

              }
              else {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: `Some error occured while uploading try agin. If issue persist contact the support team`,
                });
                setIsLoadingUploadDB(false)
              }
            }
            else {
              setIsLoadingUploadDB(false)
            }
          })
        }
        else {
          if (response.type == 'notexists') {
            let uploadResponse = uploadMessMenuDB(dataToUpload, menuMonth, menuYear)
            if (uploadResponse) {
              Swal.fire(
                'Uploaded!',
                'The Mess menu has been uploaded.',
                'success'
              )
              setShowPreview(false)
              initializeSelectData()
              setIsLoadingUploadDB(false)
            }
            else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Some error occured while uploading try agin. If issue persist contact the support team`,
              });
              setIsLoadingUploadDB(false)
            }
          }
          else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: `Some error occured while uploading try agin. If issue persist contact the support team`,
            });
            setIsLoadingUploadDB(false)
          }
        }
      }
    })

  }

  const initializeSelectData = async () => {
    let response = await fetchMessMenuHistoryKeys()
    if (response.status) {
      setMenuKeys(response.data)
    }
    else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Some error occured while loading data please refresh. If issue persist contact the support team`,
      });
      setMenuKeys([])
    }
  }
  useEffect(() => {
    initializeSelectData()
    window.scrollTo(0, 0);
  }, [])


  return (
    <div className="">
      <MessMenuHistory keys={menuKeys}></MessMenuHistory>
      <section className="importSection container mt-5">
        <div className="text-center mb-3 mt-5">
          <h4 style={{ color: "#004bff" }}>MESS MENU UPLOADING</h4>
        </div>
        <div className="row p-3" style={{ justifyContent: "center" }}>
          <div className="p-4 col-md-8 col-lg-8 col-xl-7" id="studentDataUpload">
            <div className="row">
              <form
                action="/users/admin/import-from-excel-fileUpload"
                encType="multipart/form-data"
                id="uploadForm"
                method="post"
              >
                <div className="input-group mb-3">
                  <input
                    type="file"
                    name="myfile"
                    className="form-control"
                    id="myfile"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={(e) => {
                      setUploadEvent(e)
                      setShowPreview(false)
                    }}
                  />
                  <label className="input-group-text" htmlFor="inputGroupFile">
                    Upload
                  </label>
                </div>
                <div
                  className=""
                  style={{ justifyContent: "center", display: "flex" }}
                >
                  <Button
                    disabled={isLoadingUpload || isLoadingUploadDB}
                    variant="contained"
                    size="small"
                    onClick={handleUpload}
                  >
                    {isLoadingUpload ? <CircularProgress size={23} color="inherit" /> : 'Upload'}
                  </Button>
                </div>
              </form>
            </div>
            <div className="mt-5">
              <h5 style={{ color: "#ff2b2b" }}>NOTE : </h5>
              <ul>
                <li>Date should be in DD.MM.YYYY format eg: 01.09.2023</li>
                <li>The sheet names should be Special,N-veg,Veg and should be in the respective oerder</li>
                {/* <li>The sheet name should be sheet1</li>
                <li>
                  A topic should have Post Production details withour Production
                  details
                </li>
                <li>The Column names should be same as Template</li>
                <li>
                  Check and confirm the exported data is correct before
                  uploading
                </li>
                <li>A topic can have production details only</li> */}
                <li>Follow the template correctly</li>
                <li>
                  Excel template :
                  <a
                    className="link-opacity-100-hover"
                    href={process.env.PUBLIC_URL + "/assets/files/mess_menu_template.xlsx"}
                    download="Mess Menu Template"
                    target="_blank"
                  >
                    {" "}Download Template
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div ref={previewUploadRef} className=" mt-5">
        {showPreview && (<section className="previewSection container">
          <div className="text-center mb-3" id="previewHeading">
            <h4 style={{ color: "#004bff" }}>MESS MENU PREVIEW</h4>
          </div>
          <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <Tabs value={tabIndex} onChange={handleChangeTab} centered>
              <Tab label="Veg" />
              <Tab label="Non Veg" />
              <Tab label="Special" />
            </Tabs>
          </Box>
          <div className="previewTableDiv tableDiv mt-4">
            <table
              className="table table-bordered table-sm"
              style={{ color: "black" }}
            >
              <thead>
                <tr>
                  <th>DATES</th>
                  <th>BREAKFAST</th>
                  <th>LUNCH</th>
                  <th>SNACKS</th>
                  <th>DINNER</th>
                  <th>OPS</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((item, index) => {
                  let dateString = "";
                  for (var i = 0; i < item.dates.length; i++) {
                    dateString += `${item.dates[i]} \n `;
                  }
                  return (
                    <tr key={index} id={`${index}-row`}>
                      <td
                        style={{
                          color: "#00bef",
                          backgroundColor: "blanchedalmond",
                        }}
                      >
                        {dateString}
                      </td>
                      <td>{item.breakfast}</td>
                      <td>{item.lunch}</td>
                      <td>{item.snacks}</td>
                      <td>{item.dinner}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-outline-info btn-sm collapse-btn"
                          onClick={() => {
                            setEditData(index);
                            setEditDates(item.dates)
                            setBreakfast(item.breakfast)
                            setLunch(item.lunch)
                            setSnacks(item.snacks)
                            setDinner(item.dinner)
                            setShowEdit(true);
                          }}
                        >
                          <i className="bx bxs-pencil"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div
            className="mt-5 mb-4"
            style={{ justifyContent: "center", display: "flex" }}
          >
            <Button
              variant="contained"
              size=""
              disabled={isLoadingUploadDB || showEdit}
              onClick={updateMessMenuValidate}
            >
              {isLoadingUploadDB ? <CircularProgress size={23} color="inherit" /> : 'Confirm and upload'}
            </Button>
          </div>

          {showEdit ? <div className="mt-5 previewEditDiv">
            <FormControl sx={{ minWidth: 100 }}>
              <InputLabel id="demo-multiple-chip-label">Dates</InputLabel>
              <Select
                autoFocus={showEdit}
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={editDates}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {dateList.map((name) => (
                  <MenuItem key={name} value={name} style={{}}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="row mt-2">
              <div className="col-md-6 mt-2">
                <div className="form-group purple-border">
                  <label htmlFor="exampleFormControlTextarea4">Breakfast</label>
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea4"
                    rows="3"
                    value={breakfast}
                    onChange={(e) => setBreakfast(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="col-md-6 mt-2">
                <div className="form-group purple-border">
                  <label htmlFor="exampleFormControlTextarea4">Lunch</label>
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea4"
                    rows="3"
                    value={lunch}
                    onChange={(e) => setLunch(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="col-md-6 mt-2">
                <div className="form-group purple-border">
                  <label htmlFor="exampleFormControlTextarea4">Snacks</label>
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea4"
                    rows="3"
                    value={snacks}
                    onChange={(e) => setSnacks(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="col-md-6 mt-2">
                <div className="form-group purple-border">
                  <label htmlFor="exampleFormControlTextarea4">Dinner</label>
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea4"
                    rows="3"
                    value={dinner}
                    onChange={(e) => setDinner(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
            <div
              className="mt-5"
              style={{ justifyContent: "center", display: "flex" }}
            >
              <Button
                variant="contained"
                onClick={updateMenuPreview}
                className="m-2"
              >
                Update
              </Button>
              <Button variant="contained" color="error" className="m-2" onClick={cancelMenuUpdate}>
                Cancel
              </Button>
            </div>
          </div> : <div></div>}
        </section>)}
      </div>
    </div>
  );
}

export default MessMenu;
