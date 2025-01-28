import React from 'react'
import { useNavigate } from "react-router-dom";
import logo from "../../../src/assets/logo.png"
import Profileinfo from '../cards/Profileinfo'
const Navbar = ({userinfo}) => {


  const istoken=localStorage.getItem("token");

  const navigate=useNavigate();

  const onlogout=({userinfo})=>{
    localStorage.clear();
    navigate("/login")
  }

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10'>
      <img src={logo} alt="travel story" className='h-9'/>

      {istoken && <Profileinfo userinfo={userinfo} onlogout={onlogout}/>}
    </div>
  )
}

export default Navbar;
