import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";

const PrivateRoute = ({ children }) => {
  const { token } = useContext(LoginContext);

  return token ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;