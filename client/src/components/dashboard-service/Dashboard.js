import Header from "../Header";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../context/LoginContext";
import PieChartComponent from "../PieChartComponent";
function Dashboard() {
  const {user,token} = useContext(LoginContext);
  const [summary, setSummary] = useState(null);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [loading, setLoading] = useState(true);
console.log("Current token value in useEffect:", token);
useEffect(() => {
    setLoading(true);
  if (!token) return;

  console.log("Fetching monthly summary with token:", token);

  axios.get("http://localhost:8089/api/dashboard/summary/monthly", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then(res => {
    setMonthlySummary(res.data);
    console.log("Monthly Summary:", res.data);
  })
  .catch(err => {
    console.error("Dashboard fetch failed (monthly):", err.response?.data || err.message);
  })
   .finally(() => {
    setLoading(false);
  });
}, [token]);



useEffect(() => {
   setLoading(true);
  if (!token) return;

  console.log("Fetching total summary with token:", token);

  axios.get("http://localhost:8089/api/dashboard/summary", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then(res => {
    setSummary(res.data);
    console.log("Total Summary:", res.data);
  })
  .catch(err => {
    console.error("Dashboard fetch failed (summary):", err.response?.data || err.message);
  })
    .finally(() => {
    setLoading(false);
  });
}, [token]);

if (loading) {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
    </div>
  );
}

    return (
        <><Header/> <div className="container">  <h2>Welcome {user.name || "Guest"} to your Dashboard</h2>
        
     
        {!summary ? (
    <h4>Nothing to Show!</h4>
  ) : (<>
       <h2 className="dashboard-header">📊 Financial Overview</h2>

        {/* Cards Section */}
        <div className="dashboard-card-group">
          <div className="dashboard-card">
            <h3>💰 Investment</h3>
            <p>Total: ₹{summary?.totalInvested || 0}</p>
            <p>This Month: ₹{monthlySummary?.investedMonthly || 0}</p>
          </div>

          <div className="dashboard-card">
            <h3>💳 Debt</h3>
            <p>Total: ₹{summary?.totalDebt || 0}</p>
            <p>This Month: ₹{monthlySummary?.debtMonthly || 0}</p>
          </div>

          <div className="dashboard-card">
            <h3>🧾 Spends</h3>
            <p>Total: ₹{summary?.totalSpends || 0}</p>
            <p>This Month: ₹{monthlySummary?.spendMonthly || 0}</p>
          </div>
        </div>

        {/* Pie Charts Section */}
        
        <h2 className="dashboard-header">📈 Financial Breakdown</h2>
        <div className="dashboard-chart-group">
          <div className="dashboard-chart">
            <h4>Total</h4>
            <PieChartComponent 
              data={[
                { name: "Invested", value: summary?.totalInvested || 0 },
                { name: "Debt", value: summary?.totalDebt || 0 },
                { name: "Spends", value: summary?.totalSpends || 0 },
              ]}
            />
          </div>

          <div className="dashboard-chart">
            <h4>Monthly</h4>
            <PieChartComponent 
              data={[
                { name: "Invested", value: monthlySummary?.investedMonthly || 0 },
                { name: "Debt", value: monthlySummary?.debtMonthly || 0 },
                { name: "Spends", value: monthlySummary?.spendMonthly || 0 },
              ]}
            />
          </div>
        </div>
      </>)}
    </div>
        
        </>
    );
  }
export default Dashboard;
  