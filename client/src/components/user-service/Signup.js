import React, {useState,useEffect} from "react";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
  if (success) {
    toast.success(success);
  }
}, [success]);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    setUser((prevUser) => ({ ...prevUser, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validatePassword(user.password)) {
      setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      return;
    }

    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/signup", {
        name: user.name,
        username: user.username,
        password: user.password,
      }, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        setSuccess("Signup successful! Redirecting to login.");
        setTimeout(() => navigate("/login"), 3000);
        setUser({ name: "", username: "", password: "", confirmPassword: "" });
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setError("User already exists! Please log in instead.");
        setUser({ name: "", username: "", password: "", confirmPassword: "" });
      } else {
       // navigate("/error"); // Redirect to error page
       console.log("There's an error!")
      }
    }
  };
    return (

          
   <div className="container" style={{ fontSize: 'calc(10px + 2vmin)' }}>
   <h1>Finance Journal</h1>
      <h3>A journal for your financial health</h3>
     <form onSubmit={handleSubmit} className="signup-form">
      <label htmlFor="name">Enter Your Name:</label>
      <input
        type="text"
        name="name"
        value={user.name}
        onChange={handleChange}
        placeholder="Your Display Name"
        required
      />
      <br />

      <label htmlFor="username">Enter Email:</label>
      <input
        type="email"
        name="username"
        value={user.username}
        onChange={handleChange}
        placeholder="Email as Username"
        required
      />
      <br />
{error.toLowerCase().includes("exists") && (<>
  <span style={{ color: "red", fontSize: "0.9rem" }}>
    This email is already registered. <Link to="/login">Login instead?</Link>
  </span><br/> </>
)}
     <label htmlFor="password">
        Enter Password:
        <span title="Password must contain 8+ characters, uppercase, lowercase, number, and special character" style={{ marginLeft: '5px', cursor: 'pointer' }}>ℹ️</span>
      </label>
      <input
        type="password"
        name="password"
        value={user.password}
        onChange={handleChange}
        placeholder="Enter Password"
        className={error.toLowerCase().includes("password") ? "input-error" : ""}
        required
      />
      <br />

      <label htmlFor="confirmPassword">Confirm Password:</label>
      <input
        type="password"
        name="confirmPassword"
        value={user.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm Password"
        className={error.toLowerCase().includes("match") ? "input-error" : ""}
        required
      />
      <br />

      {/* {success && toast.success("SignUp Successful! Proceed to login!")} */}

      <button type="submit" className="my-button">Sign Up</button>
      <br /><br />
      Already a user? <Link to="/login">Click here to Login!</Link>
    </form></div>
     

    );
  }
  export default Signup;
  