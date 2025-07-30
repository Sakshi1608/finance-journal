import Header from "../Header";
import Footer from "../Footer";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../context/LoginContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Paper,
  Button,
  Stack,
  MenuItem,
} from "@mui/material";

function Debt() {
  const { user, token } = useContext(LoginContext);
  const [showModal, setShowModal] = useState(false);
  const [debts, setDebts] = useState([]);
  const toggleModal = () => setShowModal(!showModal);

  const [emiSchedule, setEmiSchedule] = useState([]);
  const [showEmiModal, setShowEmiModal] = useState(false);
  const [selectedDebtId, setSelectedDebtId] = useState(null);

  const [formStage, setFormStage] = useState("select-type");
  const [credits, setCredits] = useState([]);

  const handleShowEmiSchedule = async (index) => {
    try {
      const idToShow = debts[index].id;
      const response = await axios.get(
        `http://localhost:8084/api/debt/${idToShow}/emis`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedDebtId(idToShow);
      setEmiSchedule(response.data);
      setShowEmiModal(true);
    } catch (err) {
      console.error("Error fetching EMI schedule", err);
    }
  };

  const [formData, setFormData] = useState({
    type: "",
    customType: "",
    platform: "",
    amount: "",
    debtDate: "",
    tenure: "",
    enableEmiTracking: "",
    emiDate: "",
    emiAmount: "",
    dueDate: "",
    notes: "",
  });

  const [creditData, setCreditData] = useState({
    provider: "",
    nickname: "",
    billDate: "",
    totalAmountDue: "",
    minAmountDue: "",
    dueDate: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (formData.type === "Credit Card") {
      setCreditData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => {
        if (name === "enableEmiTracking" && value === "No") {
          return {
            ...prev,
            [name]: value,
            emiDate: "",
            emiAmount: "",
          };
        }
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  const fetchDebts = async () => {
    try {
      const response = await axios.get(`http://localhost:8084/api/debt/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setDebts(response.data);
    } catch (err) {
      console.error("Error Fetching Debts", err);
    }
  };

  useEffect(() => {
    if (user?.userName) {
      fetchDebts();
    }
  }, [user]);

  const fetchCredits = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8084/api/debt/credit`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCredits(response.data);
    } catch (err) {
      console.error("Error Fetching Debts", err);
    }
  };

  useEffect(() => {
    if (user?.userName) {
      fetchCredits();
    }
  }, [user]);

  const [editingIndex, setEditingIndex] = useState(null);

  const openAddModal = () => {
    setEditingIndex(null);
     setFormStage("select-type");
    setFormData({
      type: "",
      customType: "",
      platform: "",
      amount: "",
      debtDate: "",
      tenure: "",
      enableEmiTracking: "",
      emiDate: "",
      emiAmount: "",
      dueDate: "",
      notes: "",
    });

    setCreditData({
      provider: "",
      nickname: "",
      billDate: "",
      totalAmountDue: "",
      minAmountDue: "",
      dueDate: "",
      notes: "",
    });
    setShowModal(true);
  };

  const predefinedTypes = [
    "Personal Loan",
    "Car Loan",
    "Home Loan",
    "Credit Card",
    "Cash",
    "Credit Lending",
  ];

  const handleUpdate = (index, type) => {
    if (type === "Credit Card") {
      const creditToEdit = credits[index];
      setEditingIndex(index);

      setCreditData({
        provider: creditToEdit.provider || "",
        nickname: creditToEdit.nickname || "",
        billDate: creditToEdit.billDate || "",
        totalAmountDue: creditToEdit.totalAmountDue || "",
        minAmountDue: creditToEdit.minAmountDue || "",
        dueDate: creditToEdit.dueDate || "",
        notes: creditToEdit.notes || "",
      });

      setFormData({
        type: "Credit Card",
      });
    } else {
      const debtToEdit = debts[index];
      setEditingIndex(index);

      const isCustomType = !predefinedTypes.includes(debtToEdit.type);
      setFormData({
        type: isCustomType ? "Other" : debtToEdit.type,
        customType: isCustomType ? debtToEdit.type : "",
        platform: debtToEdit.platform || "",
        amount: debtToEdit.amount || "",
        debtDate: debtToEdit.debtDate || "",
        tenure: debtToEdit.tenure || "",
        enableEmiTracking: debtToEdit.enableEmiTracking || "",
        emiDate: debtToEdit.emiDate || "",
        emiAmount: debtToEdit.emiAmount || "",
        dueDate: debtToEdit.dueDate || "",
        notes: debtToEdit.notes || "",
      });
    }
    setFormStage("fill-form");
    setShowModal(true);
  };
  const handleDelete = async (index, type) => {
    const isCredit = type === "Credit Card";
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this ${
        isCredit ? "credit card bill" : "debt"
      }? This action cannot be undone!`
    );
    if (!confirmDelete) return;

    const idToDelete = isCredit ? credits[index].id : debts[index].id;

    try {
      const endpoint = isCredit
        ? `http://localhost:8084/api/debt/credit/${idToDelete}`
        : `http://localhost:8084/api/debt/${idToDelete}`;

      await axios.delete(endpoint, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      fetchDebts();
      fetchCredits();
    } catch (err) {
      console.error("Could Not Delete", err);
    }

    console.log("Handles Delete");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.type === "Credit Card") {
      try {
        const creditPayload = {
          ...creditData,
          userName: user.userName,
          type: "Credit Card",
        };

        if (editingIndex === null) {
          // Create new credit card debt
          const response = await axios.post(
            "http://localhost:8084/api/debt/credit",
            creditPayload,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("New credit card entry added:", response.data);
        } else {
          const idToUpdate = credits[editingIndex].id;

          await axios.put(
            `http://localhost:8084/api/debt/credit/${idToUpdate}`,
            creditPayload,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Existing credit card entry updated.");
        }

        // Reset both forms
        setCreditData({
          provider: "",
          nickname: "",
          billDate: "",
          totalAmountDue: "",
          minAmountDue: "",
          dueDate: "",
          notes: "",
        });

        setFormData({
          type: "",
          platform: "",
          amount: "",
          debtDate: "",
          tenure: "",
          enableEmiTracking: "",
          emiDate: "",
          emiAmount: "",
          dueDate: "",
          notes: "",
        });

        setShowModal(false);
        fetchCredits();
      } catch (err) {
        console.error("Credit Card Submit Error:", err);
      }
    } else {
      try {
        const finalType =
          formData.type === "Other" ? formData.customType : formData.type;
        const debtData = {
          ...formData,
          userName: user.userName,
          type: finalType,
        };

        if (editingIndex === null) {
          const response = await axios.post(
            "http://localhost:8084/api/debt",
            debtData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response.data, "new debt added js");
          const newDebtId = response.data.id;

          if (formData.enableEmiTracking === "Yes") {
            const response = await axios.post(
              `http://localhost:8084/api/debt/${newDebtId}/emis`,
              {
                emiDate: formData.emiDate,
                emiAmount: formData.emiAmount,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log("created emi schedule js");
          } else {
            console.log("no emi required js");
          }
        } else {
          const idToUpdate = debts[editingIndex].id;
          console.log("existing debt here js");

          const previousValue = debts[editingIndex].enableEmiTracking;
          const newValue = formData.enableEmiTracking;

          const isTrackingChanged = previousValue !== newValue;
          const confirmReset = isTrackingChanged
            ? window.confirm(
                "Changing EMI tracking status will reset all EMI entries and payment statuses. Do you want to continue?"
              )
            : true;

          if (!confirmReset) return;
          await axios.put(
            `http://localhost:8084/api/debt/${idToUpdate}`,
            debtData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(" existing debt other info js");
          if (formData.enableEmiTracking === "Yes") {
            const response = await axios.put(
              `http://localhost:8084/api/debt/${idToUpdate}/emis`,
              {
                emiDate: formData.emiDate,
                emiAmount: formData.emiAmount,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log("existing debt emi update here js");
          }
        }

        setFormData({
          type: "",
          platform: "",
          amount: "",
          debtDate: "",
          tenure: "",
          enableEmiTracking: "",
          emiDate: "",
          emiAmount: "",
          dueDate: "",
          notes: "",
        });
        setShowModal(false);
        fetchDebts();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const togglePaidStatus = async (emiId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8084/api/debt/emi/${emiId}/paid`,
        { paid: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const response = await axios.get(
        `http://localhost:8084/api/debt/${selectedDebtId}/emis`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedSchedule = emiSchedule.map((emi) =>
        emi.id === emiId ? { ...emi, paid: newStatus } : emi
      );

      updatedSchedule.sort((a, b) => new Date(a.emiDate) - new Date(b.emiDate));

      setEmiSchedule(updatedSchedule);
      if(newStatus){
        toast.success("Marked Emi as Paid");
      }
      else{
        toast.success("Marked Emi as Unpaid");
      }
    } catch (err) {
      console.error("Error updating EMI status", err);
    }
  };

  const handleTogglePaid = async (id, paidStatus) => {
    try {
      await axios.put(
        `http://localhost:8084/api/debt/credit/${id}/paid`,
        {
          paid: paidStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (paidStatus) {
        console.log(true)
        toast.success("Credit Card Bill marked as paid!");
      } else {
        toast.success("Credit Card Bill Marked as Unpaid!");
      }
      fetchCredits(); // refresh after toggle
    } catch (err) {
      toast.error("Could not mark as paid");
      console.error("Error updating paid status", err);
    }
  };

  const handleMarkAsPaid = async (debt, index) => {
    const isEmiEnabled = debt.enableEmiTracking === "Yes";
    const confirm =
      !isEmiEnabled ||
      window.confirm(
        "Marking this debt as paid will delete all EMI entries. Do you want to continue?"
      );

    if (!confirm) return;

    try {
      await axios.put(
        `http://localhost:8084/api/debt/${debt.id}/mark-paid`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchDebts();
      toast.success(
        "Debt marked as paid! To Undo click on update and add the details again!"
      );
    } catch (err) {
      console.error("Error marking as paid", err);
      toast.error("Could not mark as paid");
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
      <Header />{" "}
<Box textAlign="center" mt={4}>
     {debts.length === 0 && credits.length === 0 ? (
  <Typography variant="h6" color="text.secondary">
    No Debts to track yet!
  </Typography>
) : (
  <>
    <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
      Your Loans & Other Debts
    </Typography>

    <Paper elevation={3} sx={{ overflowX: "auto", mb: 4 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Platform</TableCell>
              <TableCell>Amount (₹)</TableCell>
              <TableCell>Debt Taking Date</TableCell>
              <TableCell>Tenure</TableCell>
              <TableCell>Enable EMI Tracking</TableCell>
              <TableCell>Due Date (Total Amount)</TableCell>
              <TableCell>Paid Status</TableCell>
              <TableCell>Additional Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {debts.map((inv, index) => (
              <TableRow key={index}>
                <TableCell>{inv.type}</TableCell>
                <TableCell>{inv.platform}</TableCell>
                <TableCell>{inv.amount}</TableCell>
                <TableCell>{inv.debtDate}</TableCell>
                <TableCell>{inv.tenure}</TableCell>
                <TableCell>
                  {inv.enableEmiTracking === "Yes" && !inv.paid ? (
                    <Button
                      size="small"
                      onClick={() => handleShowEmiSchedule(index)}
                      variant="outlined"
                    >
                      Show
                    </Button>
                  ) : (
                    "No"
                  )}
                </TableCell>
                <TableCell>{inv.dueDate}</TableCell>
                <TableCell>
                  {!inv.paid ? (
                    <Button
                      size="small"
                      color="success"
                      onClick={() => handleMarkAsPaid(inv, index)}
                      variant="outlined"
                    >
                      Mark as Paid
                    </Button>
                  ) : (
                    <Typography color="success.main">Paid</Typography>
                  )}
                </TableCell>
                <TableCell>{inv.notes}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleUpdate(index, "debt")}
                    >
                      Update
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => handleDelete(index, "debt")}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  </>
)}



{credits.length > 0 && (
  <>
    <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
      Your Credit Card Bills
    </Typography>

    <Paper elevation={3} sx={{ mb: 4 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Provider</TableCell>
              <TableCell>Nickname</TableCell>
              <TableCell>Bill Date</TableCell>
              <TableCell>Total Due (₹)</TableCell>
              <TableCell>Min Due (₹)</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Paid Status</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {credits.map((card, index) => (
              <TableRow key={index}>
                <TableCell>{card.provider}</TableCell>
                <TableCell>{card.nickname}</TableCell>
                <TableCell>{card.billDate}</TableCell>
                <TableCell>{card.totalAmountDue}</TableCell>
                <TableCell>{card.minAmountDue}</TableCell>
                <TableCell>{card.dueDate}</TableCell>
                <TableCell>
                  {card.paid ? (
                    <Button
                      size="small"
                      variant="outlined"
                      color="warning"
                      onClick={() => handleTogglePaid(card.id, false)}
                    >
                      Undo
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => handleTogglePaid(card.id, true)}
                    >
                      Mark as Paid
                    </Button>
                  )}
                </TableCell>
                <TableCell>{card.notes}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleUpdate(index, "Credit Card")}
                    >
                      Update
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(index, "Credit Card")}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  </>
)}



        <Dialog
  open={showEmiModal}
  onClose={() => setShowEmiModal(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>EMI Schedule</DialogTitle>
  <DialogContent dividers>
    <Typography variant="h6" gutterBottom>
      Unpaid EMIs
    </Typography>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {emiSchedule
          .filter((e) => !e.paid)
          .map((emi, index) => (
            <TableRow key={index}>
              <TableCell>{emi.emiDate}</TableCell>
              <TableCell>₹{emi.emiAmount}</TableCell>
              <TableCell>Unpaid</TableCell>
              <TableCell>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={() => togglePaidStatus(emi.id, true)}
                >
                  Mark as Paid
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>

    {emiSchedule.some((e) => e.paid) && (
      <>
        <Typography variant="h6" mt={3}>
          Paid EMIs
        </Typography>
        <Table size="small" sx={{ mt: 1 }}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emiSchedule
              .filter((e) => e.paid)
              .map((emi, index) => (
                <TableRow key={index}>
                  <TableCell>{emi.emiDate}</TableCell>
                  <TableCell>₹{emi.emiAmount}</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      color="warning"
                      onClick={() => togglePaidStatus(emi.id, false)}
                    >
                      Undo
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </>
    )}

    {/* Summary box */}
    <Box mt={3}>
      <Typography variant="subtitle2">
        💰 Total EMI Amount: ₹
        {emiSchedule.reduce((sum, emi) => sum + emi.emiAmount, 0)}
      </Typography>
      <Typography variant="subtitle2">
        🧾 Remaining Balance: ₹
        {emiSchedule
          .filter((e) => !e.paid)
          .reduce((sum, emi) => sum + emi.emiAmount, 0)}
      </Typography>
      <Typography variant="subtitle2">
        📆 Tenure Left: {emiSchedule.filter((emi) => !emi.paid).length} months
      </Typography>
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setShowEmiModal(false)} color="primary">
      Close
    </Button>
  </DialogActions>
 </Dialog>

        <Button
    variant="contained"
    color="primary"
    size="large"
    onClick={openAddModal}
  >
    Add a Debt
  </Button>
</Box>
    <Dialog open={showModal} onClose={toggleModal} maxWidth="sm" fullWidth>
  <DialogTitle>
    Hi {user.name || "Guest"}! Please enter your debt details:
  </DialogTitle>

  <Box
    component="form"
    onSubmit={handleSubmit}
    noValidate
    sx={{ px: 3, pb: 2 }}
  >
    <DialogContent dividers>
      {formStage === "select-type" && formData.type === "" && (
        <>
          <TextField
            select
            fullWidth
            label="Debt Type"
            name="type"
            value={formData.type}
            onChange={(e) => {
              handleChange(e);
              setFormStage("fill-form");
            }}
            required
            margin="normal"
          >
            <MenuItem value="">--Select Debt Type--</MenuItem>
            <MenuItem value="Personal Loan">Personal Loan</MenuItem>
            <MenuItem value="Car Loan">Car Loan</MenuItem>
            <MenuItem value="Home Loan">Home Loan</MenuItem>
            <MenuItem value="Credit Card">Credit Card Bill</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Credit Lending">Credit Lending (Slice, KrazyBee)</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>

          {formData.type === "Other" && (
            <TextField
              fullWidth
              name="customType"
              label="Enter Custom Debt Type"
              value={formData.customType}
              onChange={handleChange}
              required
              margin="normal"
            />
          )}
        </>
      )}

      {formStage === "fill-form" && (
        <>
          {formData.type === "Credit Card" ? (
            <>
              <TextField
                fullWidth
                label="Credit Card Provider"
                name="provider"
                value={creditData.provider}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Nickname"
                name="nickname"
                value={creditData.nickname}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                type="date"
                label="Bill Generation Date"
                name="billDate"
                value={creditData.billDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Total Amount Due"
                name="totalAmountDue"
                type="number"
                value={creditData.totalAmountDue}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Minimum Amount Due"
                name="minAmountDue"
                type="number"
                value={creditData.minAmountDue}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                type="date"
                label="Due Date"
                name="dueDate"
                value={creditData.dueDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                name="notes"
                label="Notes (optional)"
                multiline
                minRows={2}
                value={creditData.notes}
                onChange={handleChange}
                margin="normal"
              />
            </>
          ) : (
            <>
              <TextField
                fullWidth
                name="platform"
                label="Debt Platform"
                value={formData.platform}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                type="number"
                name="amount"
                label="Amount"
                value={formData.amount}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                type="date"
                name="debtDate"
                label="Debt Date"
                value={formData.debtDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                margin="normal"
              />

              <TextField
                select
                fullWidth
                name="enableEmiTracking"
                label="Enable EMI Tracking?"
                value={formData.enableEmiTracking}
                onChange={handleChange}
                required
                margin="normal"
              >
                <MenuItem value="">--Select--</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>

              {formData.enableEmiTracking === "No" && (
                <TextField
                  fullWidth
                  type="date"
                  name="dueDate"
                  label="Due Date (Total Amount)"
                  value={formData.dueDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  margin="normal"
                />
              )}

              {formData.enableEmiTracking === "Yes" && (
                <>
                  <TextField
                    fullWidth
                    type="date"
                    name="emiDate"
                    label="First EMI Date"
                    value={formData.emiDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    required
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    type="number"
                    name="tenure"
                    label="Tenure (months)"
                    value={formData.tenure}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    type="number"
                    name="emiAmount"
                    label="Monthly EMI Amount"
                    value={formData.emiAmount}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />
                </>
              )}

              <TextField
                fullWidth
                name="notes"
                label="Notes (optional)"
                multiline
                minRows={2}
                value={formData.notes}
                onChange={handleChange}
                margin="normal"
              />
            </>
          )}
        </>
      )}
    </DialogContent>

    <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
      {formStage === "fill-form" && (
        <Button
          onClick={() => {
            formData.type = "";
            setFormStage("select-type");
          }}
        >
          ← Back
        </Button>
      )}

      <Box sx={{ flexGrow: 1 }} />

      <Button onClick={toggleModal}>Cancel</Button>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </DialogActions>
  </Box>
</Dialog>
  <Footer/>
  </Box>
    </>
  
  );
}
export default Debt;
