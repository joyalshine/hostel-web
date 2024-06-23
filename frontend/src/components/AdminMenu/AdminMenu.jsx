import { React, useState, useEffect } from "react";
import './AdminMenu.css'
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { logoutAPI } from "../../firebase/authentication";

function AdminMenu({ children, pageChange, accessRights }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  const [maintenance, setMaintenance] = useState(false)
  const [discipline, setDiscipline] = useState(false)
  const [mess, setMess] = useState(false)
  const [cleaning, setCleaning] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies(["user_token"]);
  const [userName, setuserName] = useState('')
  const [userAccType, setuserAccType] = useState('')
  const navigate = useNavigate();


  function handleChange(index) {
    setCurrentPage(index)
    pageChange(index)
  }

  function setAccessRights() {
    if (accessRights.includes('maintenance')) {
      setMaintenance(true)
    }
    if (accessRights.includes('discipline')) {
      setDiscipline(true)
    }
    if (accessRights.includes('food')) {
      setMess(true)
    }
    if (accessRights.includes('cleaning')) {
      setCleaning(true)
    }
  }

  useEffect(() => {
    let userStatus = cookies.user_token;
    setuserName(userStatus ? userStatus.name : '')
    setuserAccType(userStatus ? userStatus.accountType == '0' ? 'Super Admin' : 'Admin' : '')
    setAccessRights()
  }, [accessRights])

  const handleLogout = async () => {
    await removeCookie('user_token', { path: '/' });
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
              src="https://cdn-icons-png.flaticon.com/128/3237/3237472.png"
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
            {maintenance ? <li>
              <a href="" onClick={(e) => {
                e.preventDefault()
                handleChange(1)
              }}>
                <i className='bx bxs-wrench' style={currentPage === 1 ? { color: '#2196F3' } : {}}></i>
                <span className="links_name">Maintenance</span>
              </a>
              <span className="tooltip">Maintenance</span>
            </li> : <></>}
            {discipline ? <li>
              <a href="" onClick={(e) => {
                e.preventDefault()
                handleChange(2)
              }}>
                <i className="bx bxs-report" style={currentPage === 2 ? { color: '#2196F3' } : {}}></i>
                <span className="links_name">Discipline</span>
              </a>
              <span className="tooltip">Discipline</span>
            </li> : <></>}
            {mess ? <li>
              <a href="" onClick={(e) => {
                e.preventDefault()
                handleChange(3)
              }}>
                <i className='bx bxs-bowl-rice' style={currentPage === 3 ? { color: '#2196F3' } : {}}></i>
                <span className="links_name">Mess</span>
              </a>
              <span className="tooltip">Mess</span>
            </li> : <></>}
            {cleaning ? <li>
              <a href="" onClick={(e) => {
                e.preventDefault()
                handleChange(4)
              }}>
                <i className='bx bx-water' style={currentPage === 4 ? { color: '#2196F3' } : {}}></i>
                <span className="links_name">Cleaning</span>
              </a>
              <span className="tooltip">Cleaning</span>
            </li> : <></>}
            <li className="profile">
              <div className="profile-details">
                <img src={process.env.PUBLIC_URL + "/assets/images/user (1).png"} alt="profileImg" />
                <div className="name_job">
                  <div className="name">{userName}</div>
                  <div className="job">{userAccType}</div>
                </div>
              </div>
              <a href="" onClick={handleLogout} id="log-out-aTag">
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

export default AdminMenu;