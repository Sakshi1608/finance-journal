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
       <Route path="/debt" element={<PrivateRoute><Debt /></PrivateRoute>} />
       <Route path="/spends" element={<PrivateRoute><Spends /></PrivateRoute>} />
       <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
       <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
  );
};

export default AppRouter;