import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from './user-service/Login';
import Signup from './user-service/Signup';
import Home from './Home';
import Investment from "./investment-service/Investment";
import Debt from "./debt-service/Debt";
import Dashboard from "./dashboard-service/Dashboard";
import Spends from "./spends-service/Spends";
import PrivateRoute from "../components/PrivateRoute";
import Profile from "./user-service/UserProfile";




const AppRouter = () => {
  return (

      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={ <Login />} />
      <Route path="/signup" element={<Signup />} />
  <Route path="/investment" element={
  <PrivateRoute>
    <Investment />
  </PrivateRoute>
} />
       <Route path="/debt" element={<Debt />} />
       <Route path="/spends" element={<Spends />} />
       <Route path="/profile" element={<Profile />} />
       <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
  );
};

export default AppRouter;