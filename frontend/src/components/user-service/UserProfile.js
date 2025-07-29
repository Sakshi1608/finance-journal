import React, { useContext, useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { LoginContext } from "../../context/LoginContext";
import { toast } from "react-toastify";

function Profile() {
  const initialUserData = {
    name: "",
    username: "",
    dateOfBirth: "",
    gender: "",
    monthlyIncome: "",
    investmentGoal: "",
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
    return regex.test(password);
  };

  const { token, user } = useContext(LoginContext);

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(initialUserData);
  const [formData, setFormData] = useState(initialUserData);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    axios
      .get("http://localhost:8080/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserData(res.data);
        setFormData(res.data);
      })
      .catch((err) => {
        console.error(
          "Profile fetch failed:",
          err.response?.data || err.message
        );
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleFormChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:8080/api/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("Profile updated.");
        return axios.get("http://localhost:8080/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => {
        setUserData(res.data);
        setShowEditModal(false);
      })
      .catch((err) => {
        console.error("Profile update failed:", err.response?.data || err.message);
      });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwordData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (!validatePassword(newPassword)) {
      toast.error("Password must be strong.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    axios
      .put(
        "http://localhost:8080/api/password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success("Password updated. Logging out...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => (window.location.href = "/login"), 2000);
      })
      .catch((err) => {
        toast.error(err.response?.data || "Password update failed.");
      });
  };

  if (loading) {
    return (
      <Box
        minHeight="80vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
    <Box
  sx={{
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  }}
>
      <Header />

      <Container sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom>
          User Profile
        </Typography>

        <Box
          sx={{
            bgcolor: "background.paper",
            boxShadow: 2,
            borderRadius: 2,
            p: 3,
            mb: 4,
          }}
        >
          <Typography>
            <strong>Name:</strong> {userData.name}
          </Typography>
          <Typography>
            <strong>Email:</strong> {userData.username}
          </Typography>
          <Typography>
            <strong>Date of Birth:</strong> {userData.dateOfBirth}
          </Typography>
          <Typography>
            <strong>Gender:</strong> {userData.gender}
          </Typography>
          <Typography>
            <strong>Monthly Income:</strong> {userData.monthlyIncome}
          </Typography>
          <Typography>
            <strong>Investment Goal:</strong> {userData.investmentGoal}
          </Typography>

          <Box mt={3}>
            <Button
              variant="contained"
              onClick={() => setShowEditModal(true)}
              sx={{ mr: 2 }}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowPasswordModal(true)}
            >
              Update Password
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Edit Profile Modal */}
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} fullWidth>
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          <Box component="form" id="profile-form" onSubmit={handleProfileSubmit} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleFormChange}
              margin="normal"
              required
            />

            <TextField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              fullWidth
              value={formData.dateOfBirth}
              onChange={handleFormChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Gender"
              name="gender"
              select
              fullWidth
              value={formData.gender}
              onChange={handleFormChange}
              margin="normal"
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>

            <TextField
              label="Monthly Income"
              name="monthlyIncome"
              fullWidth
              value={formData.monthlyIncome}
              onChange={handleFormChange}
              margin="normal"
            />

            <TextField
              label="Investment Goal"
              name="investmentGoal"
              fullWidth
              value={formData.investmentGoal}
              onChange={handleFormChange}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button type="submit" form="profile-form" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Modal */}
      <Dialog open={showPasswordModal} onClose={() => setShowPasswordModal(false)} fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box component="form" id="password-form" onSubmit={handlePasswordSubmit} sx={{ mt: 1 }}>
            <TextField
              label="Old Password"
              name="oldPassword"
              type="password"
              fullWidth
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              margin="normal"
              required
            />

            <TextField
              label="New Password"
              name="newPassword"
              type="password"
              fullWidth
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <Tooltip title="At least 8 characters, uppercase, lowercase, number, special character.">
                    <IconButton edge="end" tabIndex={-1}>
                      <InfoOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                ),
              }}
            />

            <TextField
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              fullWidth
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordModal(false)}>Cancel</Button>
          <Button type="submit" form="password-form" variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
      </Box>
    </>
  );
}

export default Profile;
