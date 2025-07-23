import Header from "../Header";
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { LoginContext } from "../../context/LoginContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
    return regex.test(password);
  };

  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(LoginContext);
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
    setLoading(true);
    if (!token) return;

    axios
      .get("http://localhost:8080/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUserData(res.data);
        setFormData(res.data); // Populate edit form
      })
      .catch((err) => {
        console.error(
          "Dashboard fetch failed (profile):",
          err.response?.data || err.message
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handleFormChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    axios
      .put("http://localhost:8080/api/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
      toast.success("Profile updated successfully");

      // ✅ Refetch updated profile
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

  // Validation
  if (!oldPassword || !newPassword || !confirmPassword) {
    toast.error("All fields are required.");
    return;
  }

  if (!validatePassword(newPassword)) {
      toast.error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      return;
    }


  if (newPassword !== confirmPassword) {
    toast.error("New passwords do not match.");
    return;
  }

  axios
    .put(
      "http://localhost:8080/api/password",
      {
        oldPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then(() => {
      toast.success("Password changed successfully. Logging out...");
      setShowPasswordModal(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
          
    
    // Clear token
    localStorage.removeItem("token");
     localStorage.removeItem("user");  // if you're storing JWT in localStorage
    setTimeout(() => {
      window.location.href = "/login"; // Redirect to login page
    }, 2000);
    })
    .catch((err) => {
      console.error("Password update failed:", err.response?.data || err.message);
      toast.error(err.response?.data || "Failed to update password");
    });
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container">
        <h2>User Profile</h2>
        <div className="profile-details">
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.username}</p>
          <p><strong>Date of Birth:</strong> {userData.dateOfBirth}</p>
          <p><strong>Gender:</strong> {userData.gender}</p>
          <p><strong>Monthly Income:</strong> {userData.monthlyIncome}</p>
          <p><strong>Investment Goal:</strong> {userData.investmentGoal}</p>
          <button onClick={() => setShowEditModal(true)} className="my-button">Edit Profile</button> {" "}
          <button onClick={() => setShowPasswordModal(true)} className="my-button" style={{ marginLeft: '1rem' }}>Update Password</button>
        </div>

        {/* Profile Edit Modal */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={() => setShowEditModal(false)} className="close-button">X</button>
              <center><h3>Hi {user?.name || "Guest"}! Update your profile details:</h3></center>
              <form onSubmit={handleProfileSubmit}>
                <label>Name:
                  <input name="name" value={formData.name} onChange={handleFormChange} required />
                </label>
                <label>Date of Birth:
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleFormChange} />
                </label>
                <label>Gender:
                  <select name="gender" value={formData.gender} onChange={handleFormChange}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label>Monthly Income:
                  <input name="monthlyIncome" value={formData.monthlyIncome} onChange={handleFormChange} />
                </label>
                <label>Investment Goal:
                  <input name="investmentGoal" value={formData.investmentGoal} onChange={handleFormChange} />
                </label>
                <div className="modal-actions">
                  <button type="submit" className="my-button">Save</button> {" "}
                  <button type="button" onClick={() => setShowEditModal(false)} className="my-button">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Password Update Modal */}
        {showPasswordModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={() => setShowPasswordModal(false)} className="close-button">X</button>
              <center><h3>Change Your Password</h3></center>
              <form onSubmit={handlePasswordSubmit}>
                <label>Old Password:</label>
                  <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} required />
                
                <label>New Password: </label> <span title="Password must contain 8+ characters, uppercase, lowercase, number, and special character" style={{ marginLeft: '5px', cursor: 'pointer' }}>ℹ️</span>
                  <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                
                <label>Confirm New Password:</label>
                  <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
                <div className="modal-actions">
                  <button type="submit" className="my-button">Update</button>{" "}
                  <button type="button" onClick={() => setShowPasswordModal(false)} className="my-button">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
