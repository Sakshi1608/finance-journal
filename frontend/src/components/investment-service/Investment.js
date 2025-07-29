import React, { useContext, useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { LoginContext } from "../../context/LoginContext";
import axios from "axios";
import {
  Container, Typography, TableContainer, Table, TableHead,
  TableRow, TableCell, TableBody, Paper, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Box
} from "@mui/material";

function Investment() {
  const { user, token } = useContext(LoginContext);

  const [showModal, setShowModal] = useState(false);
  const [investments, setInvestments] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const predefinedTypes = [
    "Gold", "Fixed Deposit", "Recurring Deposit", "Stock",
    "Mutual Fund", "Crypto", "National Pension Scheme"
  ];

  const predefinedCategories = [
    "Emergency Fund", "Retirement", "Long Term", "Short Term", "Tax Saving"
  ];

  const [formData, setFormData] = useState({
    investDate: "",
    type: "",
    customType: "",
    amount: "",
    platform: "",
    category: "",
    customCategory: "",
    notes: "",
  });

  const toggleModal = () => setShowModal(!showModal);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchInvestments = async () => {
    try {
      const response = await axios.get(`http://localhost:8082/api/investment/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setInvestments(response.data);
    } catch (err) {
      console.error("Error Fetching Investments", err);
    }
  };

  useEffect(() => {
    if (user?.userName) {
      fetchInvestments();
    }
  }, [user]);

  const openAddModal = () => {
    setEditingIndex(null);
    setFormData({
      investDate: "", type: "", customType: "",
      amount: "", platform: "", category: "", customCategory: "", notes: ""
    });
    setShowModal(true);
  };

  const handleUpdate = (index) => {
    const investmentToEdit = investments[index];
    setEditingIndex(index);

    const isCustomType = !predefinedTypes.includes(investmentToEdit.type);
    const isCustomCategory = !predefinedCategories.includes(investmentToEdit.category);

    setFormData({
      investDate: investmentToEdit.investDate || "",
      type: isCustomType ? "Other" : investmentToEdit.type,
      customType: isCustomType ? investmentToEdit.type : "",
      amount: investmentToEdit.amount || "",
      platform: investmentToEdit.platform || "",
      category: isCustomCategory ? "Other" : investmentToEdit.category,
      customCategory: isCustomCategory ? investmentToEdit.category : "",
      notes: investmentToEdit.notes || "",
    });

    setShowModal(true);
  };

  const handleDelete = async (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this investment?");
    if (!confirmDelete) return;

    const idToDelete = investments[index].id;
    try {
      await axios.delete(`http://localhost:8082/api/investment/${idToDelete}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      fetchInvestments();
    } catch (err) {
      console.error("Could Not Delete", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalType =
        formData.type === "Other" ? formData.customType : formData.type;
      const finalCategory =
        formData.category === "Other"
          ? formData.customCategory
          : formData.category;

      const investmentData = {
        ...formData,
        userName: user.userName,
        type: finalType,
        category: finalCategory,
      };

      if (editingIndex === null) {
        await axios.post("http://localhost:8082/api/investment", investmentData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        const idToUpdate = investments[editingIndex].id;
        await axios.put(`http://localhost:8082/api/investment/${idToUpdate}`, investmentData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setShowModal(false);
      setFormData({
        investDate: "", type: "", customType: "",
        amount: "", platform: "", category: "", customCategory: "", notes: ""
      });
      fetchInvestments();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>  <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      <Container sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Your Investments
        </Typography>

        {investments.length === 0 ? (
          <Typography variant="h6" color="text.secondary">
            No investments to track yet!
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ my: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Platform</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {investments.map((inv, index) => (
                  <TableRow key={index}>
                    <TableCell>{inv.investDate}</TableCell>
                    <TableCell>{inv.type}</TableCell>
                    <TableCell>₹{inv.amount}</TableCell>
                    <TableCell>{inv.category}</TableCell>
                    <TableCell>{inv.platform}</TableCell>
                    <TableCell>{inv.notes}</TableCell>
                    <TableCell align="center">
                      <Button variant="outlined" size="small" onClick={() => handleUpdate(index)} sx={{ mr: 1 }}>
                        Update
                      </Button>
                      <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(index)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box textAlign="center" mt={3}>
          <Button variant="contained" onClick={openAddModal}>
            Add an Investment
          </Button>
        </Box>
      </Container>

      {/* Modal */}
      <Dialog open={showModal} onClose={toggleModal} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingIndex === null ? "Add Investment" : "Update Investment"}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              type="date"
              name="investDate"
              label="Investment Date"
              fullWidth
              value={formData.investDate}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              select
              name="type"
              label="Investment Type"
              fullWidth
              value={formData.type}
              onChange={handleChange}
              margin="normal"
              required
            >
              <MenuItem value="">-- Select --</MenuItem>
              {predefinedTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
              <MenuItem value="Other">Other</MenuItem>
            </TextField>

            {formData.type === "Other" && (
              <TextField
                name="customType"
                label="Custom Type"
                fullWidth
                value={formData.customType}
                onChange={handleChange}
                margin="normal"
                required
              />
            )}

            <TextField
              type="number"
              name="amount"
              label="Amount"
              fullWidth
              value={formData.amount}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              name="platform"
              label="Investment Platform"
              fullWidth
              value={formData.platform}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              select
              name="category"
              label="Investment Category"
              fullWidth
              value={formData.category}
              onChange={handleChange}
              margin="normal"
              required
            >
              <MenuItem value="">-- Select --</MenuItem>
              {predefinedCategories.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
              <MenuItem value="Other">Other</MenuItem>
            </TextField>

            {formData.category === "Other" && (
              <TextField
                name="customCategory"
                label="Custom Category"
                fullWidth
                value={formData.customCategory}
                onChange={handleChange}
                margin="normal"
                required
              />
            )}

            <TextField
              name="notes"
              label="Notes"
              fullWidth
              multiline
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              margin="normal"
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={toggleModal}>Cancel</Button>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Footer />
      </Box>
    </>
  );
}

export default Investment;
