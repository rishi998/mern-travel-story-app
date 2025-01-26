import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className='h-screen bg-cyan-50 overflow-hidden flex items-center justify-center'>
      <div className='container flex items-center justify-center mx-8 space-x-8'> {/* Add spacing between elements */}
        {/* Background Image Container */}
        <div className='w-1/2 h-[90vh] flex items-end justify-center bg-login-bg-img bg-cover bg-no-repeat bg-center rounded-lg p-10'> {/* Text moved to bottom */}
          <div className='w-full pb-10 text-center'> {/* Text centered at bottom */}
            <h4 className='text-4xl text-white font-semibold'>
              Capture Your <br /> Journeys
            </h4>
            <p className='text-md text-white mt-4'>
              Record your travel experiences and memories in your personal travel journal.
            </p>
          </div>
        </div>
        
        {/* Login Form Container */}
        <div className='w-1/2 h-[75vh] bg-white rounded-lg p-16 shadow-lg shadow-cyan-200/20 flex flex-col justify-center items-center'> {/* Rounded corners and centered content */}
          <form className='w-full max-w-md'>
            <h4 className='text-2xl font-semibold mb-7 text-center'>Login</h4> {/* Centered Title */}
            <div className='mb-4'>
              <input type="text" placeholder='Email' className='input-box w-full'/>
            </div>
            <div className='mb-6'>
              <button type='submit' className='btn-primary w-full'>LOGIN</button>
            </div>
            <p className='text-center'>Or</p>
            <button type='button' className='w-full' onClick={() => navigate("/signup")}>
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
