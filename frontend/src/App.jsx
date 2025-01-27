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
            <Route path="/dashboard" element={<Home/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/signup" element={<Signup/>}></Route>
          </Routes>
        </Router>
    </div>
  )
}

export default App;
