import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../context/LoginContext";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  TextField,
  Paper,
  IconButton,
  InputAdornment,
  Tooltip,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Footer from "../Footer";
import Header from "../Header";

function Login() {
  const [user, setUser] = useState({ username: "", password: "" });
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotDetails, setForgotDetails] = useState({
    username: "",
    newPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(LoginContext);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleForgotChange = (e) =>
    setForgotDetails({ ...forgotDetails, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        user,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      login(response.data);
      toast.success("Login Successful! Redirecting to Dashboard!");
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Incorrect Credentials!");
      }
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(forgotDetails.newPassword)) {
      toast.error(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
      );
      return;
    }
    try {
      const res = await axios.put(
        "http://localhost:8080/api/forgot-password",
        forgotDetails
      );
      toast.success(res.data || "Password reset successful. Please log in.");
      setForgotMode(false);
    } catch (err) {
      toast.error(err.response?.data || "Reset failed");
    }
  };

  return (
    <><Box
  sx={{
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  }}
>
    <Header/>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            maxWidth: 400,
            width: "100%",
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          {forgotMode ? (
            <Box component="form" onSubmit={handleForgotSubmit}>
            <Box>
                        <Typography variant="h5" sx={{ mb: 2 }}>
                          Forgot Password
                        </Typography>
                      </Box>
              <TextField
                fullWidth
                label="Username (Email)"
                name="username"
                value={forgotDetails.username}
                onChange={handleForgotChange}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                value={forgotDetails.newPassword}
                onChange={handleForgotChange}
                margin="normal"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="At least 8 characters, incl. uppercase, lowercase, number, and special character.">
                        <IconButton tabIndex={-1} edge="end">
                          <InfoOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ mt: 2, mb: 1 }}
              >
                Reset Password
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={() => {
                  setForgotDetails({ username: "", newPassword: "" });
                  setForgotMode(false);
                }}
              >
                ← Back to Login
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
               <Box>
                        <Typography variant="h5" sx={{ mb: 2 }}>
                          Login
                        </Typography>
                      </Box>
              <TextField
                fullWidth
                label="Username (Email)"
                name="username"
                value={user.username}
                onChange={handleChange}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={user.password}
                onChange={handleChange}
                margin="normal"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ mt: 2, mb: 1 }}
              >
                Login
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setUser({ username: "", password: "" });
                  setForgotMode(true);
                }}
              >
                Forgot Password?
              </Button>

              <Typography variant="body2" sx={{ mt: 2 }}>
                New here?    <Button
  component={Link}
  to="/signup"
  color="secondary"
  size="small"
  sx={{ textTransform: "none" }} 
>
  Sign Up Here!
</Button>
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
      <Footer />
      </Box>
    </>
  );
}

export default Login;
