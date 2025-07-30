import React, { useContext, useState, useEffect } from "react";
import {
  Container, Typography, Table, TableRow, TableCell, TableHead, TableBody, TableContainer,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Box
} from "@mui/material";
import Header from "../Header";
import Footer from "../Footer";
import axios from "axios";
import { LoginContext } from "../../context/LoginContext";

function Spends() {
  const { user, token } = useContext(LoginContext);
  const [showModal, setShowModal] = useState(false);
  const [spends, setSpends] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const [formData, setFormData] = useState({
    spendDate: "",
    type: "",
    customType: "",
    amount: "",
    paymentMethod: "",
    customPaymentMethod: "",
    recurring: "",
    recurringFrequency: "",
    endDate: "",
    notes: "",
  });

  const predefinedTypes = [
    "Food & Dining", "Groceries", "Transportation", "Rent", "Electricity Bill",
    "Wifi", "Subscriptions", "Shopping", "Entertainment", "Health Care",
    "Fitness", "Other Utilities", "Miscellaneous"
  ];

  const predefinedPaymentMethods = [
    "Cash", "Credit Card", "Debit Card", "UPI", "Wallet", "Bank Transfer", "Net Banking", "Cheque"
  ];

  const toggleModal = () => setShowModal(!showModal);

  // Data Handling
  const fetchSpends = async () => {
    try {
      const response = await axios.get("http://localhost:8088/api/spends", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setSpends(response.data);
    } catch (err) {
      console.error("Error Fetching Spends", err);
    }
  };

  useEffect(() => {
    if (user?.userName) fetchSpends();
  }, [user]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "recurring" && value === "No") {
        return { ...prev, [name]: value, recurringFrequency: "", endDate: "" };
      }

      return { ...prev, [name]: value };
    });
  };

  const openAddModal = () => {
    setEditingIndex(null);
    setFormData({
      spendDate: "", type: "", customType: "", amount: "", paymentMethod: "",
      customPaymentMethod: "", recurring: "", recurringFrequency: "", endDate: "", notes: "",
    });
    setShowModal(true);
  };

  const handleUpdate = (spend) => {
    const index = spends.findIndex((s) => s.id === spend.id);
    setEditingIndex(index);

    const isCustomType = !predefinedTypes.includes(spend.type);
    const isCustomPayMethod = !predefinedPaymentMethods.includes(spend.paymentMethod);

    setFormData({
      spendDate: spend.spendDate || "",
      type: isCustomType ? "Other" : spend.type,
      customType: isCustomType ? spend.type : "",
      amount: spend.amount || "",
      paymentMethod: isCustomPayMethod ? "Other" : spend.paymentMethod,
      customPaymentMethod: isCustomPayMethod ? spend.paymentMethod : "",
      recurring: spend.recurring || "",
      recurringFrequency: spend.recurringFrequency || "",
      endDate: spend.endDate || "",
      notes: spend.notes || "",
    });

    setShowModal(true);
  };

  const handleDelete = async (spend) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      await axios.delete(`http://localhost:8088/api/spends/${spend.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      fetchSpends();
    } catch (err) {
      console.error("Could Not Delete", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const finalType = formData.type === "Other" ? formData.customType : formData.type;
      const finalPaymentMethod = formData.paymentMethod === "Other"
        ? formData.customPaymentMethod
        : formData.paymentMethod;

      const spendsData = {
        ...formData,
        userName: user.userName,
        type: finalType,
        paymentMethod: finalPaymentMethod,
      };

      if (editingIndex === null) {
        await axios.post("http://localhost:8088/api/spends", spendsData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        const idToUpdate = spends[editingIndex].id;
        await axios.put(`http://localhost:8088/api/spends/${idToUpdate}`, spendsData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setShowModal(false);
      fetchSpends();
    } catch (err) {
      console.log(err);
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
      <Header />
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Track your Daily Spends
        </Typography>

        {spends.length === 0 ? (
          <Typography>No Expenses to track yet!</Typography>
        ) : (
          <>
            {/* One Time Spends */}
            <Typography variant="h6" mt={3}>
              One-Time Spends
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Payment Method</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {spends.filter((sp) => sp.recurring === "No").map((sp) => (
                    <TableRow key={sp.id}>
                      <TableCell>{sp.spendDate}</TableCell>
                      <TableCell>{sp.type}</TableCell>
                      <TableCell>₹{sp.amount}</TableCell>
                      <TableCell>{sp.paymentMethod}</TableCell>
                      <TableCell>{sp.notes}</TableCell>
                      <TableCell align="center">
                        <Button size="small" onClick={() => handleUpdate(sp)}>Update</Button>
                        <Button size="small" color="error" onClick={() => handleDelete(sp)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Recurring Spends */}
            <Typography variant="h6" mt={4}>
              Recurring Spends
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Frequency</TableCell>
                    <TableCell>Next Occurrence</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Payment Method</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {spends.filter((sp) => sp.recurring === "Yes").map((sp) => (
                    <TableRow key={sp.id}>
                      <TableCell>{sp.spendDate}</TableCell>
                      <TableCell>{sp.type}</TableCell>
                      <TableCell>₹{sp.amount}</TableCell>
                      <TableCell>{sp.recurringFrequency}</TableCell>
                      <TableCell>{sp.nextOccurrence || "—"}</TableCell>
                      <TableCell>{sp.endDate || "—"}</TableCell>
                      <TableCell>{sp.paymentMethod}</TableCell>
                      <TableCell>{sp.notes}</TableCell>
                      <TableCell align="center">
                        <Button size="small" onClick={() => handleUpdate(sp)}>Update</Button>
                        <Button size="small" color="error" onClick={() => handleDelete(sp)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        <Box textAlign="center" mt={3}>
          <Button variant="contained" onClick={openAddModal}>
            Add an Expense
          </Button>
        </Box>
      </Container>

      {/* MUI Modal Form */}
      <Dialog open={showModal} onClose={toggleModal} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingIndex === null ? "Add Expense" : "Update Expense"}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              type="date"
              required fullWidth
              name="spendDate"
              label="Date"
              value={formData.spendDate}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />

            {/* Type Select */}
            <TextField
              select name="type" fullWidth required
              label="Expense Type" value={formData.type}
              onChange={handleChange} margin="normal"
            >
              {predefinedTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
              <MenuItem value="Other">Other</MenuItem>
            </TextField>

            {formData.type === "Other" && (
              <TextField
                name="customType" fullWidth required
                label="Custom Type" value={formData.customType}
                onChange={handleChange} margin="normal"
              />
            )}

            <TextField
              type="number" required fullWidth
              name="amount"
              label="Amount"
              value={formData.amount}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              select name="paymentMethod" fullWidth required
              label="Payment Method" value={formData.paymentMethod}
              onChange={handleChange} margin="normal"
            >
              {predefinedPaymentMethods.map((method) => (
                <MenuItem key={method} value={method}>{method}</MenuItem>
              ))}
              <MenuItem value="Other">Other</MenuItem>
            </TextField>

            {formData.paymentMethod === "Other" && (
              <TextField
                name="customPaymentMethod"
                fullWidth required margin="normal"
                label="Custom Payment Method"
                value={formData.customPaymentMethod}
                onChange={handleChange}
              />
            )}

            <TextField
              select name="recurring" fullWidth required
              label="Is Recurring?" value={formData.recurring}
              onChange={handleChange} margin="normal"
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </TextField>

            {formData.recurring === "Yes" && (
              <>
                <TextField
                  select name="recurringFrequency" fullWidth required
                  label="Recurring Frequency" value={formData.recurringFrequency}
                  onChange={handleChange} margin="normal"
                >
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Yearly">Yearly</MenuItem>
                </TextField>

                <TextField
                  type="date" required fullWidth
                  name="endDate"
                  label="End Date"
                  value={formData.endDate}
                  onChange={handleChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </>
            )}

            <TextField
              label="Notes"
              name="notes"
              fullWidth multiline rows={2}
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

export default Spends;
