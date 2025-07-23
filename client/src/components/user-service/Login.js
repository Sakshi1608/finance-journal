import React, { useContext,useState } from "react";
import { Link } from "react-router-dom";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../context/LoginContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Login() {
  const [user, setUser] = useState({username:"", password:""});
  const navigate = useNavigate();
  const {login} = useContext(LoginContext);

  const [forgotMode, setForgotMode] = useState(false);
  const [forgotDetails, setForgotDetails] = useState({ username: "", newPassword: "" });


  
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
    return regex.test(password);
  };
  const handleChange = (e) =>{
    setUser({...user, [e.target.name]:e.target.value});
  }

   const handleForgotChange = (e) => {
    setForgotDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/login", user, {headers:{"Content-Type":"application/json"}});
      console.log(response.data);
      login(response.data);
      toast.success("Login Successful! Redirecting to Dashboard!")
      navigate("/dashboard");
    }
    catch (err) {
      console.log(err);
      if(err.response?.status === 401){
        toast.error("Incorrect Credentials!")
      }
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("http://localhost:8080/api/forgot-password", {
        username: forgotDetails.username,
        newPassword: forgotDetails.newPassword,
      });
    if (!validatePassword(forgotDetails.newPassword)) {
      toast.error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      return;
    }
      toast.success(res.data || "Password reset successful. Please log in.");
      setForgotMode(false); // go back to login
    } catch (err) {
      toast.error(err.response?.data || "Reset failed");
    }
  };

  const handleToggleForgot = () => {

  setUser({ username: "", password: "" });
    setForgotMode(true); // Reset login form
};

const handleBackToLogin = () => {
 
  setForgotDetails({ username: "", newPassword: "" });
   setForgotMode(false); // Reset forgot form
};



  return (
    <div className="container" style={{ fontSize: 'calc(10px + 2vmin)' }}>
      <h1>Finance Journal</h1>
      <h3>A journal for your financial health</h3>
       {forgotMode ? (
        <form onSubmit={handleForgotSubmit}>
          <label htmlFor="username">Username (Email):</label>
          <input type="text" name="username" value={forgotDetails.username} onChange={handleForgotChange} placeholder="Username(Email)" required />
          <br />
          <label htmlFor="newPassword">New Password:</label>  <span title="Password must contain 8+ characters, uppercase, lowercase, number, and special character" style={{ marginLeft: '5px', cursor: 'pointer' }}>ℹ️</span>
          <input type="password" name="newPassword" value={forgotDetails.newPassword} onChange={handleForgotChange} placeholder="New Password" required />
          <br />
          <button type="submit" className="my-button">Reset Password</button>
          <br /><br/>
          <button onClick={handleBackToLogin} className="my-button" type="button">  ← Back to Login</button>
        </form>
      ):(
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Enter Username:</label>
        <input type="text" name="username" value={user.username} onChange={handleChange} placeholder="Username(Email)" required/>
        <br />
        <label htmlFor="password">Enter Password:</label>
        <input type="password" name="password" value={user.password}  onChange={handleChange} placeholder="Password" required/>
        
        <button type="submit" className="my-button">
          Login
        </button>
        <br />
        <br />
          <button type="button" onClick={handleToggleForgot} className="my-button" style={{ marginTop: "10px" }}>
            Forgot Password?
          </button>
          <br /><br />
        New here? <Link to="/signup">Sign Up Here!</Link>
      </form>
      )}
    </div>
  );
}
export default Login;
