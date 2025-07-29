import React from "react";
import AppRouter from "./Router";
import { ToastContainer } from "react-toastify";
import { LoginProvider } from "../context/LoginContext";
import { CustomThemeProvider } from "../context/ThemeContext";
import { CssBaseline } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <CustomThemeProvider>
      <CssBaseline/>  
      <LoginProvider>
        <AppRouter />
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </LoginProvider>
      
    </CustomThemeProvider>
   
  );
}

export default App;
