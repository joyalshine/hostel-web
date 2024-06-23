import { React, useEffect, useState } from "react";
import './SuperAdminMenu.css'
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";


function SuperAdminMenu({ children, pageChange }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [userName, setuserName] = useState('')
  const [userAccType, setuserAccType] = useState('')
  const [cookies, setCookie, removeCookie] = useCookies(["user_token"]);
  const navigate = useNavigate();


  function handleChange(index) {
    setCurrentPage(index)
    pageChange(index)
  }

  useEffect(() => {
    let userStatus = cookies.user_token;
    setuserName(userStatus ? userStatus.name : '')
    setuserAccType(userStatus ? userStatus.accountType == '0' ? 'Super Admin' : 'Admin' : '')
  }, [])

  const handleLogout = async () => {
    removeCookie('user_token', { path: '/' });
    navigate(`/`, { state: { logoutMessage: true } })
    return false
  }

  return (
    <div className="fluid-container">
      <header id="header" className="">
        <div className="p-1">
          <img
            src={process.env.PUBLIC_URL + "/assets/images/vit_logo.png"}
            style={{ height: "100%" }}
            alt=""
          />
        </div>
        <div className="p-1">
          <a href="#" style={{ textDecoration: "none", color: "#fff" }}>
            <img
              src={process.env.PUBLIC_URL + "/assets/images/user (1).png"}
              className="mx-2"
              width="40"
              height="40"
              alt=""
            />
            <span id="headerUsername" className="">
              {userName}
            </span>
          </a>
        </div>
      </header>
      <section className="mainBody">
        <div className={sidebarOpen ? "sidebar open" : "sidebar"} >
          <div className="logo-details">
            <img
              src={process.env.PUBLIC_URL + "/assets/images/download-removebg-preview.png"}
              className="icon"
              id="navbarLogo"
              alt=""
              width="40px"
              height="40px"
            />
            <div className="logo_name">HOSTEL</div>
            <i className={sidebarOpen ? "bx bx-menu-alt-right" : "bx bx-menu"} onClick={() => setSidebarOpen(!sidebarOpen)} id="btn"></i>
          </div>
          <ul className="nav-list">
            {/* <li>
              <i class="bx bx-search" onClick={() => setSidebarOpen(!sidebarOpen)} ></i>
              <form onsubmit="searchCourse(); return false;">
                <input
                  type="text"
                  placeholder="Search..."
                  onkeyup="this.value = this.value.toUpperCase()"
                  id="searchCourseId"
                />
                <input type="submit" style={{ display: "none" }} />
              </form>
              <span class="tooltip">Search</span>
            </li> */}
            {/* <li>
              <a href="javascript:void(0)" onClick={() => handleChange(0)}>
                <i class="bx bx-home bx-flip-horizontal" style={currentPage === 0 ? { color: '#2196F3' } : {}}></i>
                <span class="links_name">Home</span>
              </a>
              <span class="tooltip">Home</span>
            </li> */}
            <li>
              <a href="" onClick={(e) => {
                e.preventDefault()
                handleChange(0)
              }}>
                <i className='bx bxs-data' style={currentPage === 0 ? { color: '#2196F3' } : {}}></i>
                <span className="links_name">Students</span>
              </a>
              <span className="tooltip">Students</span>
            </li>
            <li>
              <a href="" onClick={(e) => {
                e.preventDefault()
                handleChange(1)
              }}>
                <i className='bx bxs-wrench' style={currentPage === 1 ? { color: '#2196F3' } : {}}></i>
                <span className="links_name">Maintenance</span>
              </a>
              <span className="tooltip">Maintenance</span>
            </li>
            <li>
              <a href="" onClick={(e) => {
                e.preventDefault()
                handleChange(2)
              }}>
                <i className="bx bxs-report" style={currentPage === 2 ? { color: '#2196F3' } : {}}></i>
                <span className="links_name">Discipline</span>
              </a>
              <span className="tooltip">Discipline</span>
            </li>
            <li>
              <a href="" onClick={(e) => {
                e.preventDefault()
                handleChange(3)
              }}>
                <i className='bx bxs-bowl-rice' style={currentPage === 3 ? { color: '#2196F3' } : {}}></i>
                <span className="links_name">Mess</span>
              </a>
              <span className="tooltip">Mess</span>
            </li>
            <li>
              <a href="" onClick={(e) => {
                e.preventDefault()
                handleChange(4)
              }}>
                <i className='bx bx-water' style={currentPage === 4 ? { color: '#2196F3' } : {}}></i>
                <span className="links_name">Cleaning</span>
              </a>
              <span className="tooltip">Cleaning</span>
            </li>
            <li>
              <a href="" onClick={(e) => {
                e.preventDefault()
                handleChange(5)
              }}>
                <i className="bx bx-history" style={currentPage === 5 ? { color: '#2196F3' } : {}}></i>
                <span className="links_name">History</span>
              </a>
              <span className="tooltip">History</span>
            </li>
            <li>
              <a href="" onClick={(e) => {
                e.preventDefault()
                handleChange(6)
              }}>
                <i className='bx bxs-user' style={currentPage === 6 ? { color: '#2196F3' } : {}}></i>
                <span className="links_name">Users</span>
              </a>
              <span className="tooltip">Users</span>
            </li>
            <li>
              <a href="" onClick={(e) => {
                e.preventDefault()
                handleChange(7)
              }}>
                <i className='bx bxs-food-menu' style={currentPage === 7 ? { color: '#2196F3' } : {}}></i>
                <span className="links_name">Menu</span>
              </a>
              <span className="tooltip">Menu</span>
            </li>
            <li className="profile">
              <div className="profile-details">
                <img src={process.env.PUBLIC_URL + "/assets/images/user (1).png"} alt="profileImg" />
                <div className="name_job">
                  <div className="name">{userName}</div>
                  <div className="job">{userAccType}</div>
                </div>
              </div>
              <a href="" id="log-out-aTag" onClick={handleLogout}>
                <i className="bx bx-log-out" id="log_out"></i>
              </a>
            </li>
          </ul>
        </div>
        <section className="home-section fluid-container">
          <section id="contentMinDiv" className="table-responsive-lg">
            {children}
          </section>
        </section>
      </section>
    </div>
  );
}

export default SuperAdminMenu;
