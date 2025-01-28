import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Passwordinput from "../../components/input/Passwordinput";
import { validateemail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosinstance";

const Signup = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [err, seterr] = useState(null);

  const navigate = useNavigate();

  const handlesignup = async (e) => {
    e.preventDefault();
    seterr("");

    if (!name) {
      seterr("Please enter your name");
      return;
    }
    if (!validateemail(email)) {
      seterr("Please enter a valid email");
      return;
    }
    if(!password){
      seterr("Please enter the password")
    }
    // set api call
    try{
      const response=await axiosInstance.post("/create-account",{
        fullname:name,
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
        <div className="w-1/2 h-[90vh] flex items-end justify-center bg-signup-bg-img bg-cover bg-no-repeat bg-center rounded-lg p-10">
          <div className="w-full pb-10 text-center">
            {" "}
            <h4 className="text-4xl text-white font-semibold">
              Join the <br /> Adventure
            </h4>
            <p className="text-md text-white mt-4">
              Create an account to start documenting your travels and preserving your memories in your personal trave journal.
            </p>
          </div>
        </div>
        {/* Login Form Container */}
        <div className="w-1/2 h-[75vh] bg-white rounded-lg p-16 shadow-lg shadow-cyan-200/20 flex flex-col justify-center items-center">
          {" "}
          {/* Rounded corners and centered content */}
          <form onSubmit={handlesignup} className="w-full max-w-md">
            <h4 className="text-2xl font-semibold mb-7 text-center">Signup</h4>{" "}
            {/* Centered Title */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Name"
                className="input-box w-full"
                value={name}
                onChange={(e) => {
                  setname(e.target.value);
                }}
              />
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
                SIGNUP
              </button>
            </div>
            <p className="text-center text-xs text-slate-500 my-4">Or</p>
            <button
              type="submit"
              className="btn-primary btn-light "
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
