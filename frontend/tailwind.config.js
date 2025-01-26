/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily:{
      display:["poppins","sans-serif"],
    },
    extend: {
      // used colors in project
      colors:{
        primary:"#05B6D3",
        secondary:"#EF863E",
      },
      backgroundImage:{
        'login-bg-img':"url(./src/assets/login.jpeg)",
        'signup-bg-img':"url(./src/assets/signup.jpeg)",
      }
    },
  },
  plugins: [],
}

