import Header from "../Header";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../context/LoginContext";

function Investment() {
  const { user, token } = useContext(LoginContext);
  const [showModal, setShowModal] = useState(false);
  const [investments, setInvestments] = useState([]);
  const toggleModal = () => setShowModal(!showModal);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchInvestments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8082/api/investment/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  const [editingIndex, setEditingIndex] = useState(null);
  const openAddModal = () => {
    setEditingIndex(null);
    setFormData({
      investDate: "",
      type: "",
      customType: "",
      amount: "",
      platform: "",
      category: "",
      customCategory: "",
      notes: "",
    });
    setShowModal(true);
  };

  const predefinedTypes = [
    "Gold",
    "Fixed Deposit",
    "Recurring Deposit",
    "Stock",
    "Mutual Fund",
    "Crypto",
    "National Pension Scheme",
  ];

  const predefinedCategories = [
    "Emergency Fund",
    "Retirement",
    "Long Term",
    "Short Term",
    "Tax Saving",
  ];

  const handleUpdate = (index) => {
    const investmentToEdit = investments[index];
    setEditingIndex(index);

    const isCustomType = !predefinedTypes.includes(investmentToEdit.type);
    const isCustomCategory = !predefinedCategories.includes(
      investmentToEdit.category
    );

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
    console.log("Handles Update");
  };
  const handleDelete = async (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this investment? This action cannot be undone!"
    );
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
    console.log("Handles Delete");
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
      console.log("New Investment Added!", investmentData);

      if (editingIndex === null) {
        const response = await axios.post(
          "http://localhost:8082/api/investment",
          investmentData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
      } else {
        const idToUpdate = investments[editingIndex].id;
        await axios.put(
          `http://localhost:8082/api/investment/${idToUpdate}`,
          investmentData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setFormData({
        investDate: "",
        type: "",
        customType: "",
        amount: "",
        platform: "",
        category: "",
        customCategory: "",
        notes: "",
      });
      setShowModal(false);
      fetchInvestments();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Header />{" "}
      <div className="container">
        <h2>Your Investments</h2>
        {investments.length === 0 ? (
          <h2>No Investments to track yet!</h2>
        ) : (
          <div className="table-container">
            <table
              border="1"
              cellPadding="8"
              cellSpacing="0"
              style={{ borderCollapse: "collapse", width: "100%" }}
            >
              <thead>
                <tr>
                  <th>investDate</th>
                  <th>Type</th>
                  <th>Amount (₹)</th>
                  <th>Category</th>
                  <th>Platform</th>
                  <th>Additional Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv, index) => (
                  <tr key={index}>
                    <td>{inv.investDate}</td>
                    <td>{inv.type}</td>
                    <td>{inv.amount}</td>
                    <td>{inv.category}</td>
                    <td>{inv.platform}</td>
                    <td>{inv.notes}</td>
                    <td>
                      <button
                        className="btn update"
                        onClick={() => handleUpdate(index)}
                      >
                        Update
                      </button>
                      <button
                        className="btn delete"
                        onClick={() => handleDelete(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <br />
        <button type="button" className="my-button" onClick={openAddModal}>
          Add an Investment
        </button>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={toggleModal} className="close-button">
              X
            </button>
          <center>  <h3>
              Hi {user.name || "Guest"}! Please enter your investment details:
            </h3></center>
            <form
              onSubmit={handleSubmit}
              style={{ maxWidth: "400px", margin: "0 auto" }}
            >
              <label htmlFor="investDate">Investment Date:</label>
              <input
                type="date"
                name="investDate"
                value={formData.investDate}
                onChange={handleChange}
                required
              />
              <br />
              <label htmlFor="type">Investment Type:</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">--Select Investment Type--</option>
                <option value="Gold">Gold</option>
                <option value="Fixed Deposit">Fixed Deposit</option>
                <option value="Recurring Deposit">Recurring Deposit</option>
                <option value="Stock">Stock</option>
                <option value="Mutual Fund">Mutual Fund</option>
                <option value="Crypto">Crypto</option>
                <option value="National Pension Scheme">
                  National Pension Scheme
                </option>
                <option value="Other">Other</option>
              </select>
              {formData.type === "Other" && (
                <input
                  type="text"
                  name="customType"
                  placeholder="Enter Investment Type"
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
                placeholder="Enter Invested Amount"
                required
              />
              <br />
              <label htmlFor="platform">Investment Platform:</label>
              <input
                type="text"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                placeholder="Enter Investment Platform {eg. Groww,FD in Bank etc.}"
                required
              />
              <br />
              <label htmlFor="category">Investment Category:</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">--Select Investment Category--</option>
                <option value="Emergency Fund">Emergency Fund</option>
                <option value="Retirement">Retirement</option>
                <option value="Long Term">Long Term</option>
                <option value="Short Term">Short Term</option>
                <option value="Tax Saving">Tax Saving</option>
                <option value="Other">Other</option>
              </select>
              {formData.category === "Other" && (
                <input
                  type="text"
                  name="customCategory"
                  placeholder="Enter Investment Category"
                  value={formData.customCategory}
                  onChange={handleChange}
                  required={formData.category === "Other"}
                  disabled={formData.category !== "Other"}
                />
              )}
              <br />
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
export default Investment;
