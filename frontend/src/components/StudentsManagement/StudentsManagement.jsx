import React from "react";
import "./StudentsManagement.css";
import StudentSearch from "../StudentSearch/StudentSearch";
import StudentAdd from "../StudentAdd/StudentAdd";
import ExcelUpload from "../ExcelUpload/ExcelUpload";
// import 'bootstrap/dist/css/bootstrap.css';
function StudentsManagement() {
  return (
    <>
      <StudentSearch />
      <StudentAdd />
      <ExcelUpload />
    </>
  );
}

export default StudentsManagement;
