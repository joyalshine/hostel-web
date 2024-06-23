import "./App.css";
import SignIn from "./pages/signIn/signIn";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import { Route, Routes, Navigate,  } from "react-router-dom";
import AdminContainer from "./pages/AdminContainer/AdminContainer";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import SuperAdminContainer from "./pages/SuperAdminContainer/SuperAdminContainer";

import { useCookies } from "react-cookie";
import ErrorPage from "./pages/ErrorPage/ErrorPage";

function App() {
  const [cookies, setCookie] = useCookies(["user_token"]);
  let userStatus = cookies.user_token;
  let userType = userStatus ? userStatus.accountType : ''
  console.log("Cookie fetch from React")
  console.log(userStatus)
  return (
    <>
      {userStatus === undefined || userType == '' ? (
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/password-reset" element={<ForgotPassword />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      ) : userType === '0' ? (
        <Routes>
          <Route path="/" element={ <Navigate to="/superadmin" /> } />
          <Route path="/superadmin" element={<SuperAdminContainer />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      ) :
      (
        <Routes>
          <Route path="/" element={ <Navigate to="/admin" /> } />
          <Route path="/admin" element={<AdminContainer />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      )}
    </>
    // <Routes>
    //   <Route path='/' element = {<SignIn/>} />
    //   <Route path='/password-reset' element = {<ForgotPassword/>} />
    //   <Route path='/superadmin' element = {<SuperAdminContainer/>}/>
    //   <Route path='/admin' element = {<AdminContainer/>} />
    //     {/* <Route path='home' element = {<Home/>}/>
    //     <Route path='maintenance' element = {<Home/>}/>
    //     <Route path='discipline' element = {<Home/>}/>
    //     <Route path='mess' element = {<Home/>}/>
    //     <Route path='cleaning' element = {<Home/>}/>
    //     <Route path='students' element = {<Home/>}/>
    //     <Route path='users' element = {<Home/>}/>
    //     <Route path='menu' element = {<Home/>}/> */}
    //   {/* </Route> */}
    // </Routes>
  );
}

export default App;
