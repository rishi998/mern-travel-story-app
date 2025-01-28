import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import React from 'react'

import Login from "./pages/auth/Login";
import Home from "./Home/home";
import Signup from "./pages/auth/Signup";

const App = () => {
  return (
    <div>
        <Router>
          <Routes>
            <Route path="/" element={<Root/>}></Route>
            <Route path="/dashboard" element={<Home/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/signup" element={<Signup/>}></Route>
          </Routes>
        </Router>
    </div>
  )
}

// DEFINE THE ROOT COMPONET TO HANDLE THE INITIAL REDIRECT
const Root=()=>{
  // check for token in localstorage
  const isauthenticated=!!localStorage.getItem("token");

  return isauthenticated?(
    <Navigate to="/dashboard"/>
  ):(
    <Navigate to="/login"/>
  )
}
export default App;
