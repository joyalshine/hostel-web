import { React, useState } from "react";
import Button from '@mui/material/Button';
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { addStudentExcelDb } from "../../firebase/superAdminFunctions";

function ExcelUpload() {
  const [uploadEvent, setUploadEvent] = useState('')

  const handleUpload = () => {
    if (uploadEvent && uploadEvent.target.files && uploadEvent.target.files[0]) {
      uploadEvent.preventDefault();
      Swal.fire({
        title: "Loading",
        text: "Please wait while we validate and check the data",
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false
      })

      var files = uploadEvent.target.files, f = files[0];
      var reader = new FileReader();
      reader.onload = function (uploadEvent) {
        var data = uploadEvent.target.result;
        let readedData = XLSX.read(data, { type: 'binary' });
        const wsname = readedData.SheetNames[0];
        const ws = readedData.Sheets[wsname];

        const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
        segregateAndCheckData(dataParse)
      };
      reader.readAsBinaryString(f)
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
        title: "Select a file",
      });
    }
  }

  const segregateAndCheckData = async (dataParse) => {
    var dataToUpload = [];
    let errors = false
    let emailList = []
    outerloop: for (var i = 1; i < dataParse.length; i++) {
      var rowData = dataParse[i];
      if (rowData.length != 8) {
        console.log(rowData)
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Some Data is missing in Line no ${i + 1}`,
        });
        errors = true
        break;
      }
      else if (!rowData[0] || rowData[0].trim().length === 0) {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Name is missing in Line no ${i + 1}`,
        });
        errors = true
        break;
      }
      else if (!/^[A-Za-z\s]*$/.test(rowData[0])) {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Name can only contain letters in, Line no ${i + 1}`,
        });
        errors = true
        break;
      } else if (!rowData[1] || rowData[1].trim().length === 0) {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Registration Number is empty in, Line no ${i + 1}`,
        });
        errors = true
        break;
      } else if (!/^[A-Za-z0-9]*$/.test(rowData[1])) {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Registration Number can only contain letters and Numbers in, Line no ${i + 1}`,
        });
        errors = true
        break;
      } else if (!rowData[2] || rowData[2].trim().length === 0) {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Email is empty in, Line no ${i + 1}`,
        });
        errors = true
        break;
      } else if (!rowData[2].includes('@vitstudent.ac.in')) {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Enter a Valid VIT email ID, Line no ${i + 1}`,
        });
        errors = true
        break;
      } else if (emailList.includes(rowData[2].trim())) {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Same email Repeated at Line ${emailList.indexOf(rowData[2].trim()) + 2} and ${i + 1}`,
        });
        errors = true
        break;
      } else if (!rowData[3] || rowData[3].trim().length === 0) {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Block is empty in, Line no ${i + 1}`,
        });
        errors = true
        break;
      } else if (!rowData[4] || rowData[4].toString().trim().length === 0) {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Room Number is empty in, Line no ${i + 1}`,
        });
        errors = true
        break;
      } else if (!/^[0-9]*$/.test(rowData[4])) {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Room Number can only contain Numbers, Line no ${i + 1}`,
        });
        errors = true
        break;
      } else if (!rowData[5] || rowData[5].trim().length === 0) {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Mess is empty in, Line no ${i + 1}`,
        });
        errors = true
        break;
      } else if (!rowData[6] || rowData[6].trim().length === 0) {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Mess Type is empty in, Line no ${i + 1}`,
        });
        errors = true
        break;
      } else if (!rowData[7] || rowData[7].toString().trim().length === 0) {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Phone Number is empty in, Line no ${i + 1}`,
        });
        errors = true
        break;
      } else if (!/^[0-9]*$/.test(rowData[7])) {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Phone Number can only contain Numbers, Line no ${i + 1}`,
        });
        errors = true
        break;
      } else if (rowData[7].toString().trim().length != 10) {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Phone Number does not contain 10 digits in, Line no ${i + 1}`,
        });
        errors = true
        break;
      } else {
        dataToUpload.push({
          name: rowData[0].trim(),
          regno: rowData[1].trim(),
          email: rowData[2].trim(),
          block: rowData[3].trim(),
          room: parseInt(rowData[4]),
          mess: rowData[5].trim(),
          messType: rowData[6].trim(),
          phoneno: parseInt(rowData[7])
        })
        emailList.push(rowData[2].trim())
      }
    }
    if (!errors) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success m-1',
          cancelButton: 'btn btn-danger m-1'
        },
        buttonsStyling: false
      })

      swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: `You want to upload the details of ${dataToUpload.length} students!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, upload it!',
        cancelButtonText: 'No, cancel!',
        allowEscapeKey: false,
        allowOutsideClick: false
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Loading",
            text: "Please wait while we upload the data",
            didOpen: () => {
              Swal.showLoading();
            },
            allowOutsideClick: false,
            allowEscapeKey: false
          })
          let responseUpload = await addStudentExcelDb(dataToUpload)
          if (responseUpload) {
            let file = document.querySelector('.file');
            var emptyFile = document.createElement('input');
            emptyFile.type = 'file';
            file.files = emptyFile.files;
            Swal.close()
            setUploadEvent('')
            swalWithBootstrapButtons.fire(
              'Uploaded!',
              'The student details has been uploaded Successfully.',
              'success'
            )
          }
          else {
            let file = document.querySelector('.file');
            var emptyFile = document.createElement('input');
            emptyFile.type = 'file';
            file.files = emptyFile.files;
            Swal.close()
            setUploadEvent('')
            Swal.fire(
              'Oops?',
              'Some error occured while uploading?',
              'error'
            )
          }
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {

        }
      })
    }
    else {
      let file = document.querySelector('.file');
      var emptyFile = document.createElement('input');
      emptyFile.type = 'file';
      file.files = emptyFile.files;
    }
  }
  return (
    <section className="importSection container mt-5">
      <div className="text-center mb-3 mt-5">
        <h4 style={{ color: "#004bff" }}>STUDENT DATA UPLOADING</h4>
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
                  className="form-control file"
                  id="fileuploadexcel"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={(e) => setUploadEvent(e)}
                />
                <label className="input-group-text" htmlFor="inputGroupFile">
                  Upload
                </label>
              </div>
              <div
                className=""
                style={{ justifyContent: "center", display: "flex" }}
              >
                <Button variant="contained" size="small" onClick={handleUpload}>Upload</Button>
              </div>
            </form>
          </div>
          <div className="mt-5">
            <h5 style={{ color: "#ff2b2b" }}>NOTE : </h5>
            <ul>
              {/* <li>Date should be in DD-MM-YYYY format</li> */}
              <li>Follow the template correctly</li>
              <li>
                Excel template :
                <a
                  className="link-opacity-100-hover"
                  href={process.env.PUBLIC_URL + "/assets/files/student_excel_template.xlsx"}
                  download="Student Excel Template"
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
  );
}

export default ExcelUpload;

