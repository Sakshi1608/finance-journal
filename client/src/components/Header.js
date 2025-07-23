import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";

function Header() {
  const { user, token, logout } = useContext(LoginContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = token != null;

  const handleLogout = () => {
    logout();
    navigate("/"); // redirect to home after logout
  };

  const disabledIfNotLoggedIn = (to) => ({
    onClick: (e) => {
      if (!isLoggedIn) {
        e.preventDefault();
        alert("Please login first");
      }
    },
    style: {
      pointerEvents: isLoggedIn ? "auto" : "none",
      opacity: isLoggedIn ? 1 : 0.5,
      cursor: isLoggedIn ? "pointer" : "not-allowed",
    },
    title: isLoggedIn ? "" : "Please login first",
  });

  return (
    <nav className="nav-bar">
      <div className="nav-container">
        <ul className="nav-list nav-links">
          {!isLoggedIn && (
            <li className="nav-list-elements">
              <NavLink
                className={({ isActive }) => (isActive ? "active" : "")}
                to="/"
              >
                Home
              </NavLink>
            </li>
          )}

          <li className="nav-list-elements">
            <NavLink
              className={({ isActive }) => (isActive ? "active" : "")}
              to="/dashboard"
              {...disabledIfNotLoggedIn("/dashboard")}
            >
              Dashboard
            </NavLink>
          </li>
          <li className="nav-list-elements">
            <NavLink
              className={({ isActive }) => (isActive ? "active" : "")}
              to="/investment"
              {...disabledIfNotLoggedIn("/investment")}
            >
              Investment Tracker
            </NavLink>
          </li>
          <li className="nav-list-elements">
            <NavLink
              className={({ isActive }) => (isActive ? "active" : "")}
              to="/debt"
              {...disabledIfNotLoggedIn("/debt")}
            >
              Debt Tracker
            </NavLink>
          </li>
          <li className="nav-list-elements">
            <NavLink
              className={({ isActive }) => (isActive ? "active" : "")}
              to="/spends"
              {...disabledIfNotLoggedIn("/spends")}
            >
              Spends Tracker
            </NavLink>
          </li>
          <li className="nav-list-elements">
            <NavLink
              className={({ isActive }) => (isActive ? "active" : "")}
              to="/profile"
              {...disabledIfNotLoggedIn("/profile")}
            >
              Profile
            </NavLink>
          </li>
        </ul>

        {isLoggedIn && location.pathname !== "/" && (
          <div className="logout-container">
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
export default Header;
