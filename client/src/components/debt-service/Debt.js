import Header from "../Header";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../context/LoginContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    <div>
      <Header />{" "}
      <div className="container">
        <h2>Your Debts</h2>
        {debts.length === 0 && credits.length === 0 ? (
          <h2>No Debts to track yet!</h2>
        ) : (
          <>
            <h2>Your Loans & Other Debts</h2>
            <div className="table-container">
              <table
                border="1"
                cellPadding="8"
                cellSpacing="0"
                style={{ borderCollapse: "collapse", width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Platform</th>
                    <th>Amount (₹)</th>
                    <th>Debt Taking Date</th>
                    <th>Tenure</th>
                    <th>Enable Emi Tracking</th>
                    <th>Due Date (Total Amount)</th>
                    <th>Paid Status</th>
                    <th>Additional Notes</th>

                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {debts.map((inv, index) => (
                    <tr key={index}>
                      <td>{inv.type}</td>
                      <td>{inv.platform}</td>
                      <td>{inv.amount}</td>
                      <td>{inv.debtDate}</td>
                      <td>{inv.tenure}</td>
                      <td>
                        {inv.enableEmiTracking === "Yes" && !inv.paid ? (
                          <button
                            type="button"
                            onClick={() => handleShowEmiSchedule(index)}
                            className="btn update"
                          >
                            Show
                          </button>
                        ) : (
                          "No"
                        )}
                      </td>
                      <td>{inv.dueDate}</td>
                      <td>
                        {!inv.paid && (
                          <button
                            className="btn update"
                            onClick={() => handleMarkAsPaid(inv, index)}
                          >
                            Mark as Paid
                          </button>
                        )}
                        {inv.paid && <span>Paid</span>}
                      </td>
                      <td>{inv.notes}</td>
                      <td>
                        <button
                          className="btn update"
                          onClick={() => handleUpdate(index, "debt")}
                        >
                          Update
                        </button>
                        <button
                          className="btn delete"
                          onClick={() => handleDelete(index, "debt")}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {credits.length > 0 && (
          <>
            <h2>Your Credit Card Bills</h2>
            <div className="table-container">
              <table
                border="1"
                cellPadding="8"
                cellSpacing="0"
                style={{ borderCollapse: "collapse", width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>Provider</th>
                    <th>Nickname</th>
                    <th>Bill Date</th>
                    <th>Total Due (₹)</th>
                    <th>Min Due (₹)</th>
                    <th>Due Date (Total Amount)</th>
                    <th>Paid Status</th>
                    <th>Additional Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {credits.map((card, index) => (
                    <tr key={index}>
                      <td>{card.provider}</td>
                      <td>{card.nickname}</td>
                      <td>{card.billDate}</td>
                      <td>{card.totalAmountDue}</td>
                      <td>{card.minAmountDue}</td>
                      <td>{card.dueDate}</td>
                      <td>
                        {card.paid ? (
                          <button
                            className="btn update"
                            onClick={() => handleTogglePaid(card.id, false)}
                          >
                            Undo
                          </button>
                        ):(
                          <button
                            className="btn update"
                            onClick={() => handleTogglePaid(card.id, true)}
                          >
                            Mark as Paid
                          </button>
                        ) }
                      </td>
                      <td>{card.notes}</td>
                      <td>
                        <button
                          className="btn update"
                          onClick={() => handleUpdate(index, "Credit Card")}
                        >
                          Update
                        </button>
                        <button
                          className="btn delete"
                          onClick={() => handleDelete(index, "Credit Card")}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {showEmiModal && (
          <div className="modal-overlay">
            <div
              className="modal-content"
              style={{
                maxHeight: "80vh",
                overflowY: "auto",
                background: "#fff",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <button
                onClick={() => setShowEmiModal(false)}
                className="close-button"
                style={{ float: "right" }}
              >
                X
              </button>
              <h3>Unpaid EMIs</h3>
              <table
                border="1"
                cellPadding="6"
                cellSpacing="0"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {emiSchedule
                    .filter((e) => !e.paid)
                    .map((emi, index) => (
                      <tr key={index}>
                        <td>{emi.emiDate}</td>
                        <td>₹{emi.emiAmount}</td>
                        <td>Unpaid</td>
                        <td>
                          <button
                            onClick={() => togglePaidStatus(emi.id, true)}
                            className="btn update"
                          >
                            Mark as Paid
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {emiSchedule.some((e) => e.paid) && (
                <>
                  <br />
                  <h3>Paid EMIs</h3>
                  <table
                    border="1"
                    cellPadding="6"
                    cellSpacing="0"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emiSchedule
                        .filter((e) => e.paid)
                        .map((emi, index) => (
                          <tr key={index}>
                            <td>{emi.emiDate}</td>
                            <td>₹{emi.emiAmount}</td>
                            <td>Paid</td>
                            <td>
                              <button
                                onClick={() => togglePaidStatus(emi.id, false)}
                                className="btn update"
                              >
                                Undo
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </>
              )}
              <br />
              <h4>
                Total EMI Amount: ₹
                {emiSchedule.reduce((sum, emi) => sum + emi.emiAmount, 0)}
              </h4>
              <h4>
                Remaining Balance: ₹
                {emiSchedule
                  .filter((e) => !e.paid)
                  .reduce((sum, emi) => sum + emi.emiAmount, 0)}
              </h4>
              <h4>
                Tenure Left:
                {emiSchedule.filter((emi) => !emi.paid).length} months
              </h4>
            </div>
          </div>
        )}

        <br />
        <button type="button" className="my-button" onClick={openAddModal}>
          Add a Debt
        </button>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={toggleModal} className="close-button">
              X
            </button>
            <center>
              {" "}
              <h3>
                Hi {user.name || "Guest"}! Please enter your debt details:
              </h3>
            </center>
            <form
              onSubmit={handleSubmit}
              style={{ maxWidth: "400px", margin: "0 auto" }}
            >
              {formStage === "select-type" && (
                <>
                  {formData.type === "" && (
                    <>
                      <label htmlFor="type">Debt Type:</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={(e) => {
                          handleChange(e);
                          setFormStage("fill-form");
                        }}
                        required
                      >
                        <option value="">--Select Debt Type--</option>
                        <option value="Personal Loan">Personal Loan</option>
                        <option value="Car Loan">Car Loan</option>
                        <option value="Home Loan">Home Loan</option>
                        <option value="Credit Card">Credit Card Bill</option>
                        <option value="Cash">Cash</option>
                        <option value="Credit Lending">
                          Credit Lending(Krazy Bee, Slice Pay)
                        </option>
                        <option value="Other">Other</option>
                      </select>
                      {formData.type === "Other" && (
                        <input
                          type="text"
                          name="customType"
                          placeholder="Enter Debt Type"
                          value={formData.customType}
                          onChange={handleChange}
                          required={formData.type === "Other"}
                          disabled={formData.type !== "Other"}
                        />
                      )}
                      <br />
                    </>
                  )}
                </>
              )}

              {formStage === "fill-form" && (
                <>
                  {formData.type === "Credit Card" ? (
                    <>
                      <label htmlFor="provider">Credit Card Provider:</label>
                      <input
                        type="text"
                        name="provider"
                        value={creditData.provider}
                        onChange={handleChange}
                        placeholder="Enter Credit Card Provider Name"
                        required
                      />
                      <br />
                      <label htmlFor="nickname">Credit Card Nickname:</label>
                      <input
                        type="text"
                        name="nickname"
                        value={creditData.nickname}
                        onChange={handleChange}
                        placeholder="Enter a Nickname you'd like to give"
                      />
                      <br />
                      <label htmlFor="billDate">
                        Credit Card Bill Generation Date:
                      </label>
                      <input
                        type="date"
                        name="billDate"
                        value={creditData.billDate}
                        placeholder="Enter Credit Card Bill Generation Date:"
                        onChange={handleChange}
                        required
                      />
                      <br />
                      <label htmlFor="totalAmountDue">Total Amount Due:</label>
                      <input
                        type="number"
                        name="totalAmountDue"
                        value={creditData.totalAmountDue}
                        onChange={handleChange}
                        placeholder="Enter Total Amount Due:"
                        required
                      />
                      <br />
                      <label htmlFor="minAmountDue">Minimum Amount Due:</label>
                      <input
                        type="number"
                        name="minAmountDue"
                        value={creditData.minAmountDue}
                        onChange={handleChange}
                        placeholder="Enter Minimum Amount Due:"
                        
                      />
                      <br />

                      <label htmlFor="dueDate">Bill Due Date:</label>
                      <input
                        type="date"
                        name="dueDate"
                        value={creditData.dueDate}
                        placeholder="Enter Credit Card Bill Due Date:"
                        onChange={handleChange}
                        required
                      />
                      <br />

                      <label htmlFor="notes">Notes:</label>
                      <textarea
                        name="notes"
                        value={creditData.notes}
                        onChange={handleChange}
                        placeholder="Additional Details (optional)"
                      ></textarea>
                      <br />
                    </>
                  ) : (
                    <>
                      <label htmlFor="platform">Debt Platform:</label>
                      <input
                        type="text"
                        name="platform"
                        value={formData.platform}
                        onChange={handleChange}
                        placeholder="Enter Debt Platform {eg. Bank Name, Credit Lending Party's name etc.}"
                        required
                      />
                      <br />
                      <label htmlFor="amount">Amount:</label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="Enter Total Debt Amount"
                        required
                      />
                      <br />

                      <label htmlFor="debtDate">Debt Taking Date:</label>
                      <input
                        type="date"
                        name="debtDate"
                        value={formData.debtDate}
                        placeholder="Enter Debt Taking Date"
                        onChange={handleChange}
                        required
                      />
                      <br />
                      <label htmlFor="enableEmiTracking">
                        Do you want to create an emi schedule?
                      </label>
                      <select
                        name="enableEmiTracking"
                        value={formData.enableEmiTracking}
                        onChange={handleChange}
                        required
                      >
                        <option value="">--Select Yes/No--</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      <br />
                      {formData.enableEmiTracking === "No" && (
                        <div>
                          <label htmlFor="dueDate">
                            Enter Due Date For total Amount:
                          </label>
                          <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            placeholder="Enter Due Date For Total Amount:"
                            required
                          />
                        </div>
                      )}

                      {formData.enableEmiTracking === "Yes" && (
                        <div>
                          <label htmlFor="emiDate">Enter First Emi Date:</label>
                          <input
                            type="date"
                            name="emiDate"
                            value={formData.emiDate}
                            onChange={handleChange}
                            placeholder="Enter the First Emi date"
                            required
                          />
                          
                          <br />
                           <label htmlFor="tenure">Tenure:</label>
                      <input
                        type="number"
                        name="tenure"
                        value={formData.tenure}
                        onChange={handleChange}
                        placeholder="Enter Tenure in Months"
                        required
                      />
                      <br />

                          <label htmlFor="emiAmount">Monthly Emi Amount:</label>
                          <input
                            type="number"
                            name="emiAmount"
                            value={formData.emiAmount}
                            onChange={handleChange}
                            placeholder="Enter Monthly Emi Amount"
                            required
                          />
                        </div>
                      )}

                      <label htmlFor="notes">Notes:</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Additional Details (optional)"
                      ></textarea>
                      <br />
                    </>
                  )}
                  <center>
                    <button
                      onClick={() => {
                        formData.type = "";
                        setFormStage("select-type");
                      }}
                      className="my-button"
                    >
                      ← Back
                    </button>{" "}
                    <button type="submit" className="my-button">
                      Submit
                    </button>
                  </center>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default Debt;
