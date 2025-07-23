import Header from "../Header";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../context/LoginContext";



function Spends() {
  const { user, token } = useContext(LoginContext);
  const [showModal, setShowModal] = useState(false);
  const [spends, setSpends] = useState([]);
  const toggleModal = () => setShowModal(!showModal);
  const [formData, setFormData] = useState({
    spendDate: "",
    type: "",
    customType: "",
    amount: "",
    paymentMethod: "",
    customPaymentMethod: "",
    recurring: "",
    recurringFrequency:"",
    endDate:"",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
  setFormData((prev) => {
        if (name === "recurring" && value === "No") {
          return {
            ...prev,
            [name]: value,
            recurringFrequency: "",
            endDate:""
          };
        }

        return {
          ...prev,
          [name]: value,
        };
      });
  };

  const fetchSpends = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8088/api/spends`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSpends(response.data);
    } catch (err) {
      console.error("Error Fetching Spends", err);
    }
  };

  useEffect(() => {
    if (user?.userName) {
      fetchSpends();
    }
  }, [user]);

  const [editingIndex, setEditingIndex] = useState(null);
  const openAddModal = () => {
    setEditingIndex(null);
    setFormData({
    spendDate: "",
    type: "",
    customType: "",
    amount: "",
    paymentMethod: "",
    customPaymentMethod: "",
    recurring: "",
    recurringFrequency:"",
    endDate:"",
    notes: "",
    });
    setShowModal(true);
  };

  const predefinedTypes = [
"Food & Dining",
  "Groceries",
  "Transportation",
  "Rent",
  "Electricity Bill",
  "Wifi",
  "Subscriptions",
  "Shopping",
  "Entertainment",
  "Health Care",
  "Fitness",
  "Other Utilities",
  "Miscellaneous",
  ];

  const predefinedPaymentMethods = [
 "Cash",
  "Credit Card",
  "Debit Card",
  "UPI",
  "Wallet",
  "Bank Transfer",
  "Net Banking",
  "Cheque"
  ];

  const handleUpdate = (spend) => {
    const spendToEdit = spends.findIndex(sp => sp.id === spend.id);
    setEditingIndex(spendToEdit);

    const isCustomType = !predefinedTypes.includes(spend.type);
  const isCustomPaymentMethod = !predefinedPaymentMethods.includes(
  spend.paymentMethod
);

    setFormData({
      spendDate: spend.spendDate || "",
      type: isCustomType ? "Other" : spend.type,
      customType: isCustomType ? spend.type : "",
      amount: spend.amount || "",
      paymentMethod: isCustomPaymentMethod ? "Other" : spend.paymentMethod,
      customPaymentMethod: isCustomPaymentMethod ? spend.paymentMethod : "",
      recurring: spend.recurring || "",
      recurringFrequency: spend.recurringFrequency || "",
      endDate:spend.endDate || "",
      notes: spend.notes || "",
    });
    setShowModal(true);
    console.log("Handles Update");
  };
  const handleDelete = async (spend) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense entry? This action cannot be undone!"
    );
    if (!confirmDelete) return;

    const idToDelete = spend.id;
    console.log(idToDelete);
    try {
      await axios.delete(`http://localhost:8088/api/spends/${idToDelete}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      fetchSpends();
    } catch (err) {
      console.error("Could Not Delete", err);
    }
    console.log("Handles Delete");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalType =
        formData.type === "Other" ? formData.customType : formData.type;
      const finalPaymentMethod =
        formData.paymentMethod === "Other"
          ? formData.customPaymentMethod
          : formData.paymentMethod;
      const spendsData = {
        ...formData,
        userName: user.userName,
        type: finalType,
        paymentMethod: finalPaymentMethod,
      };
      console.log("New Expense Added!", spendsData);

      if (editingIndex === null) {
        const response = await axios.post(
          "http://localhost:8088/api/spends",
          spendsData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
      } else {
        const idToUpdate = spends[editingIndex].id;
        await axios.put(
          `http://localhost:8088/api/spends/${idToUpdate}`,
          spendsData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setFormData({
       spendDate: "",
    type: "",
    customType: "",
    amount: "",
    paymentMethod: "",
    customPaymentMethod: "",
    recurring: "",
    recurringFrequency:"",
    endDate:"",
    notes: "",
      });
      setShowModal(false);
      fetchSpends();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    
    <div>
       <Header/>
      <div className="container">
        <h2>Track your Daily Spends here</h2>
        {spends.length === 0 ? (
          <h2>No Expenses to track yet!</h2>
        ) : (
        <>
          <h3>One Time Spends:</h3>
          <div className="table-container">
            <table
              border="1"
              cellPadding="8"
              cellSpacing="0"
              style={{ borderCollapse: "collapse", width: "100%" }}
            >
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount (₹)</th>
                  <th>Payment Method</th>
                  <th>Additional Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {spends.filter(sp => sp.recurring === "No").map((sp) => (
                  <tr key={sp.id}>
                    <td>{sp.spendDate}</td>
                    <td>{sp.type}</td>
                    <td>{sp.amount}</td>
                    <td>{sp.paymentMethod}</td>
                    <td>{sp.notes}</td>
                    <td>
                      <button
                        className="btn update"
                        onClick={() => handleUpdate(sp)}
                      >
                        Update
                      </button>
                      <button
                        className="btn delete"
                        onClick={() => handleDelete(sp)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
     
          <h3>Recurring Spends</h3>
          <div className="table-container">
            <table
              border="1"
              cellPadding="8"
              cellSpacing="0"
              style={{ borderCollapse: "collapse", width: "100%" }}
            >
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount (₹)</th>
                  <th>Frequency</th>
                  <th>Next Occurrence</th>
                  <th>End Date</th>
                  <th>Payment Method</th>
                  <th>Additional Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {spends.filter(sp => sp.recurring === "Yes").map((sp) => (
                  <tr key={sp.id}>
                    <td>{sp.spendDate}</td>
                    <td>{sp.type}</td>
                    <td>{sp.amount}</td>
                    <td>{sp.recurringFrequency}</td>
                    <td>{sp.nextOccurrence ? sp.nextOccurrence : "—"}</td>
                    <td>{sp.endDate}</td>
                    <td>{sp.paymentMethod}</td>
                    <td>{sp.notes}</td>
                    <td>
                      <button
                        className="btn update"
                        onClick={() => handleUpdate(sp)}
                      >
                        Update
                      </button>
                      <button
                        className="btn delete"
                        onClick={() => handleDelete(sp)}
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
       

        <br />
        <button type="button" className="my-button" onClick={openAddModal}>
          Add an Expense
        </button>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={toggleModal} className="close-button">
              X
            </button>
           <center><h3>
              Hi {user.name || "Guest"}! Please enter details of your expense:
            </h3></center> 
            <form
              onSubmit={handleSubmit}
              style={{ maxWidth: "400px", margin: "0 auto" }}
            >
              <label htmlFor="spendDate">Date:</label>
              <input
                type="date"
                name="spendDate"
                value={formData.spendDate}
                onChange={handleChange}
                placeholder="Enter date of spending"
                required
              />
              <br />
              <label htmlFor="type">Expense Type:</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">--Select Expense Type--</option>
                <option value="Food & Dining">Food & Dining</option>
                <option value="Groceries">Groceries</option>
                <option value="Transportation">Transportation</option>
                <option value="Rent">Rent</option>
                <option value="Electricity Bill">Electricity Bill</option>
                <option value="Wifi">Wifi</option>
                <option value="Subscriptions">Subscriptions</option>
                <option value="Other Utilities">Other Utilities</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Health Care">HealthCare</option>
                <option value="Fitness">Fitness</option>
                <option value="Miscellaneous">Miscellaneous</option>
                <option value="Other">Other</option>
              </select>
              {formData.type === "Other" && (
                <input
                  type="text"
                  name="customType"
                  placeholder="Enter Expense Type:"
                  value={formData.customType}
                  onChange={handleChange}
                  required={formData.type === "Other"}
                  disabled={formData.type !== "Other"}
                />
              )}
              <br />
              <label htmlFor="amount">Amount:</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter Spent Amount"
                required
              />
              <br />
              <label htmlFor="paymentMethod">Payment Method:</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
              >
                <option value="">--Select Payment Method--</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="Wallet">Wallet</option>
                <option value="Bank Transfer">Bank Transfer</option>
                 <option value="Net Banking">Net Banking</option>
                  <option value="Cheque">Cheque</option>
                <option value="Other">Other</option>
              </select>
              {formData.paymentMethod === "Other" && (
                <input
                  type="text"
                  name="customPaymentMethod"
                  placeholder="Enter Payment Method"
                  value={formData.customPaymentMethod}
                  onChange={handleChange}
                  required={formData.paymentMethod === "Other"}
                  disabled={formData.paymentMethod !== "Other"}
                />
              )}
              <br />
              <label htmlFor="recurring">
                        Is this a recurring payment?
                      </label>
                      <select
                        name="recurring"
                        value={formData.recurring}
                        onChange={handleChange}
                        required
                      >
                        <option value="">--Select Yes/No--</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      <br />

                       {formData.recurring === "Yes" && (
                        <div>
                        <label htmlFor="recurringFrequency">Select Recurring Frequency:</label>
                        <select
                        name="recurringFrequency"
                        value={formData.recurringFrequency}
                        onChange={handleChange}
                        required
                      >
                        <option value="">--Select--</option>
                        <option value="Daily">Daily</option>
                          <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                      <br/>
                      <label htmlFor="endDate">Enter end date for recurrence:</label>
                          <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            placeholder="Enter end date for recurrence"
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
              <center>
                {" "}
                <button type="submit" className="my-button">
                  Submit
                </button>
              </center>
            </form>
          </div>
        </div>
      )}
    </div>
  );

        

  }
  export default Spends;