import { React, useEffect, useState } from "react";
import "./AdminContainer.css";
import MaintenanceTable from "../../components/MaintenanceTable/MaintenanceTable";
import MessTable from "../../components/MessTable/MessTable";
import CleaningTable from "../../components/CleaningTable/CleaningTable";
import { useLocation } from 'react-router-dom';
import AdminMenu from "../../components/AdminMenu/AdminMenu";
import { useCookies } from "react-cookie";
import BlankPage from "../../components/BlankPage/BlankPage";
import AdminDisciplineTable from "../../components/AdminDisciplineTable/AdminDisciplineTable";

function AdminContainer() {
  const [currentPage, setCurrentPage] = useState(0);
  const [accessRights, setAccessRights] = useState([])

  const [cookies, setCookie] = useCookies(["user_token"]);
  const location = useLocation()

  let pages = [
    <BlankPage />,
    <MaintenanceTable />,
    <AdminDisciplineTable />,
    <MessTable />,
    <CleaningTable />,
  ];

  function getAccessRights() {
    let userStatus = cookies.user_token;
    console.log(userStatus)
    let accessRightsCookie = userStatus.accessRights
    // let accessRightsCookie = location.state.access
    if (accessRightsCookie.includes('maintenance')) {
      setCurrentPage(1)
    }
    else if (accessRightsCookie.includes('discipline')) {
      setCurrentPage(2)
    }
    else if (accessRightsCookie.includes('mess')) {
      setCurrentPage(3)
    }
    else {
      setCurrentPage(4)
    }
    setAccessRights(accessRightsCookie)
  }

  useEffect(() => {
    getAccessRights()
  }, [])

  return (
    <AdminMenu pageChange={setCurrentPage} accessRights={accessRights}>
      {pages[currentPage]}
    </AdminMenu>
  );
}

export default AdminContainer;
