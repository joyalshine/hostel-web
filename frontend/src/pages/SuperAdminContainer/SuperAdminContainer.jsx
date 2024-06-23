import { React, useEffect, useState } from "react";
import "./SuperAdminContainer.css";
import SuperAdminMenu from "../../components/SuperAdminMenu/SuperAdminMenu";
import SuperAdminOverview from "../../components/SuperAdminOverview/SuperAdminOverview";
import MaintenanceTable from "../../components/MaintenanceTable/MaintenanceTable";
import MessTable from "../../components/MessTable/MessTable";
import DisciplineTable from "../../components/DisciplineTable/DisciplineTable";
import CleaningTable from "../../components/CleaningTable/CleaningTable";
import StudentsManagement from "../../components/StudentsManagement/StudentsManagement";
import UserManagement from "../../components/UserManagement/UserManagement";
import MessMenu from "../../components/MessMenu/MessMenu";
import SuperAdminHistory from "../../components/SuperAdminHistory/SuperAdminHistory";

function SuperAdminContainer() {
  const [currentPage, setCurrentPage] = useState(0);

  let pages = [
    <StudentsManagement />,
    <MaintenanceTable />,
    <DisciplineTable />,
    <MessTable />,
    <CleaningTable />,
    <SuperAdminHistory/>,
    <UserManagement />,
    <MessMenu />,
  ];

  return (
    <SuperAdminMenu pageChange={setCurrentPage}>
      {pages[currentPage]}
    </SuperAdminMenu>
  );
}

export default SuperAdminContainer;