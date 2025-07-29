import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Tooltip,
  IconButton,
  InputAdornment,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Footer from "../Footer";
import Header from "../Header";

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
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (success) {
      toast.success(success);
    }
  }, [success]);

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validatePassword(user.password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/signup",
        {
          name: user.name,
          username: user.username,
          password: user.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        setSuccess("Signup successful! Redirecting to login.");
        setTimeout(() => navigate("/login"), 3000);
        setUser({
          name: "",
          username: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setError("User already exists! Please log in instead.");
      } else {
        console.error("Signup error:", err);
      }
    }
  };

  return (
    <>
    <Box
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
            maxWidth: 450,
            width: "100%",
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Sign Up
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 2, textAlign: "left" }}
          >
            <TextField
              label="Name"
              name="name"
              value={user.name}
              onChange={handleChange}
              margin="normal"
              required
              fullWidth
              placeholder="Your display name"
            />

            <TextField
              label="Email (Username)"
              type="email"
              name="username"
              value={user.username}
              onChange={handleChange}
              margin="normal"
              required
              fullWidth
              placeholder="Email as Username"
            />

            {error.toLowerCase().includes("exists") && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                This email is already registered.{" "}
                <Link to="/login">Login instead?</Link>
              </Typography>
            )}

            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={user.password}
              onChange={handleChange}
              margin="normal"
              required
              fullWidth
              placeholder="Enter Password"
              error={error.toLowerCase().includes("password")}
              helperText={
                error.toLowerCase().includes("password") ? error : ""
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="At least 8 characters, including uppercase, lowercase, number, special character.">
                      <IconButton tabIndex={-1} edge="end">
                        <InfoOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      onClick={() => setShowPassword((show) => !show)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={user.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              fullWidth
              placeholder="Confirm Password"
              error={error.toLowerCase().includes("match")}
              helperText={
                error.toLowerCase().includes("match") ? error : ""
              }
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>

            <Typography variant="body2" textAlign="center">
              Already a user? <Button  component={Link} to="/login" color="secondary"
  size="small"
  sx={{ textTransform: "none" }} >Click here to login!</Button>
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Footer />
      </Box>
    </>
  );
}

export default Signup;
