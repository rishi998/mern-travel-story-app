import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Passwordinput from "../../components/input/Passwordinput";
import { validateemail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosinstance";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [err, seterr] = useState(null);

  const navigate = useNavigate();

  const handlelogin = async (e) => {
    e.preventDefault();
    seterr("");

    if (!validateemail(email)) {
      seterr("Please enter a valid email");
      return;
    }
    if(!password){
      seterr("Please enter the password")
    }
    // set api call
    try{
      const response=await axiosInstance.post("/login",{
        email:email,
        password:password,
      });

      // handle successful login response 
      console.log(response.data)
      if(response.data && response.data.accessToken){
        localStorage.setItem("token",response.data.accessToken);
        navigate("/dashboard"); 
      }
    }catch(error){
      // handle login error
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        seterr(error.response.data.message);
      } else {
        seterr("An unexpected error occurred. Please try again.");
      } 
    }
  };

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden flex items-center justify-center">
      <div className="container flex items-center justify-center mx-8 space-x-8">
        {" "}
        {/* Add spacing between elements */}
        {/* Background Image Container */}
        <div className="w-1/2 h-[90vh] flex items-end justify-center bg-login-bg-img bg-cover bg-no-repeat bg-center rounded-lg p-10">
          {" "}
          {/* Text moved to bottom */}
          <div className="w-full pb-10 text-center">
            {" "}
            {/* Text centered at bottom */}
            <h4 className="text-4xl text-white font-semibold">
              Capture Your <br /> Journeys
            </h4>
            <p className="text-md text-white mt-4">
              Record your travel experiences and memories in your personal
              travel journal.
            </p>
          </div>
        </div>
        {/* Login Form Container */}
        <div className="w-1/2 h-[75vh] bg-white rounded-lg p-16 shadow-lg shadow-cyan-200/20 flex flex-col justify-center items-center">
          {" "}
          {/* Rounded corners and centered content */}
          <form onSubmit={handlelogin} className="w-full max-w-md">
            <h4 className="text-2xl font-semibold mb-7 text-center">Login</h4>{" "}
            {/* Centered Title */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Email"
                className="input-box w-full"
                value={email}
                onChange={(e) => {
                  setemail(e.target.value);
                }}
              />
              <Passwordinput
                value={password}
                onchange={({target}) => {
                  setpassword(target.value);
                }}
              />
              {err && <p className="text-red-500 text-xs pb-1">{err}</p>}
            </div>
            <div className="mb-6">
              <button type="submit" className="btn-primary">
                LOGIN
              </button>
            </div>
            <p className="text-center text-xs text-slate-500 my-4">Or</p>
            <button
              type="submit"
              className="btn-primary btn-light "
              onClick={() => navigate("/signup")}
            >
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
