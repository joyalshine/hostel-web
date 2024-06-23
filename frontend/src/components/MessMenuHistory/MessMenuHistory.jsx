import React, { useRef } from 'react'
import './MessMenuHistory.css';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { fetchMessMenuHistoryDB, fetchMessMenuHistoryKeys } from '../../firebase/superAdminFunctions';
import Swal from "sweetalert2";

import CircularProgress from '@mui/material/CircularProgress';
import Box from "@mui/material/Box";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function MessMenuHistory({keys}) {
  console.log('keys')
  console.log(keys)
  const [menuKeys, setMenuKeys] = useState(keys);
  const [selectedKey, setSelectedKey] = useState('');
  const [historyData, setHistoryData] = useState([]);
  const [keysData, setKeysData] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedHistoryData, setSelectedHistoryData] = useState(false);

  const historyRef = useRef(null)

  const handleSelect = (event) => {
    setSelectedKey(event.target.value);
  };
  let MONTH_KEYS = {
    'Jan': 'January',
    'Feb': 'February',
    'Mar': 'March',
    'Apr': 'April',
    'May': 'May',
    'Jun': 'June',
    'Jul': 'July',
    'Aug': 'August',
    'Sep': 'September',
    'Oct': 'October',
    'Nov': 'November',
    'Dec': 'December'
  }

  

  const fetchMenuHistory = async () => {
    if (selectedKey != '') {
      setIsLoadingHistory(true)
      let response = await fetchMessMenuHistoryDB(selectedKey)
      if (response.status) {
        setHistoryData(response.data)
        setKeysData(Object.keys(response.data[0]))
        setSelectedHistoryData(response.data[0])
        setShowHistory(true)
        setIsLoadingHistory(false)
        historyRef.current.scrollIntoView()
      }
      else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Some error occured while loading data please refresh. If issue persist contact the support team`,
        });
        setMenuKeys([])
        setIsLoadingHistory(false)
      }
    }
    else {
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
      Toast.fire({
        icon: "error",
        title: "Select a Month to show",
      });
    }
  }

  useEffect(() => {
    setMenuKeys(keys)
  }, [keys])

  const handleChangeTab = (event, newValue) => {
    setSelectedHistoryData(historyData[newValue])
    setTabIndex(newValue);
  };

  return (
    <div className='historySection container p-3 mt-4'>
      <div className="text-center mb-3 mt-2">
        <h4 style={{ color: "#004bff" }}>MESS MENU HISTORY</h4>
      </div>
      <div className='row mt-4 p-3'>
        <div className="col-md-5 form-group purple-border">
          <select className="form-select form-control" aria-label="Default select example" value={selectedKey} onChange={handleSelect}>
            <option value=''>Select the month</option>
            {
              menuKeys.map((item,index) => {
                return <option value={item} key={index}>{MONTH_KEYS[item.slice(0, 3)]} {item.slice(3)}</option>
              })
            }
          </select>
        </div>
        <div className="col-md-2">
          <Button variant="contained" disabled={isLoadingHistory} onClick={fetchMenuHistory}>{isLoadingHistory ? <CircularProgress size={23} color="inherit" /> : 'Show'}</Button>
        </div>

      </div>

      <div ref={historyRef} id='messMenuHistoryDiv'>
        {showHistory && (<section className=" container mt-5">
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
                  <th>DATE</th>
                  <th>BREAKFAST</th>
                  <th>LUNCH</th>
                  <th>SNACKS</th>
                  <th>DINNER</th>
                </tr>
              </thead>
              <tbody>
                {keysData.map((item, index) => {
                  console.log(selectedHistoryData[item])
                  return (
                    <tr>
                      <td
                        style={{
                          color: "#00bef",
                          backgroundColor: "blanchedalmond",
                        }}
                      >
                        {item}
                      </td>
                      <td>{selectedHistoryData[item]['breakfast']}</td>
                      <td>{selectedHistoryData[item]['lunch']}</td>
                      <td>{selectedHistoryData[item]['snacks']}</td>
                      <td>{selectedHistoryData[item]['dinner']}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>)}
      </div>
    </div>
  )
}

export default MessMenuHistory
