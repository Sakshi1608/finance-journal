import Header from "../Header";
import Footer from "../Footer";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../context/LoginContext";
import PieChartComponent from "../PieChartComponent";
import { Container,Paper, Box, Grid, Card, CardContent, Typography } from "@mui/material";
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
        <>

        <Box
  sx={{
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  }}
>
        <Header />
<Box
  sx={{
    minHeight: "calc(100vh - 128px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    px: 2,
    pt: 4,
  }}
> <Container maxWidth="lg">
    <Typography variant="h4" gutterBottom textAlign="center">
      Welcome {user.name || "Guest"} to your Dashboard
    </Typography>
     
       {!summary ? (
      <Typography variant="h6" textAlign="center" color="text.secondary">
        Nothing to Show!
      </Typography>
    ) : (
      <>
             
      <Typography variant="h5" textAlign="center" color="text.secondary" sx={{ mt: 6, mb: 3 }}>
  Financial Overview
</Typography>

        {/* Cards Section */}
        <Grid container spacing={3} justifyContent="center" alignItems="stretch" sx={{ mb: 4 }}>
  <Grid item xs={12} sm={6} md={4}>
    <Card elevation={4} sx={{ minHeight:100,minWidth:200,height: "100%", width:"100%", textAlign: "center" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          💰 Investment
        </Typography>
        <Typography variant="h5">
          Total: ₹{summary?.totalInvested || 0}
        </Typography>
        <Typography variant = "h6">
          This Month: ₹{monthlySummary?.investedMonthly || 0}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <Card elevation={4} sx={{ minHeight:100,minWidth:200,height: "100%", width:"100%",textAlign: "center" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          💳 Debt
        </Typography>
        <Typography variant="h5">
          Total: ₹{summary?.totalDebt || 0}
        </Typography>
        <Typography variant="h6">
          This Month: ₹{monthlySummary?.debtMonthly || 0}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <Card elevation={4} sx={{ minHeight:100,minWidth:200, height: "100%", width:"100%",textAlign: "center" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🧾 Spends
        </Typography>
        <Typography variant="h5">
          Total: ₹{summary?.totalSpends || 0}
        </Typography>
        <Typography variant="h6">
          This Month: ₹{monthlySummary?.spendMonthly || 0}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
</Grid>

        {/* Pie Charts Section */}
      
<Grid container spacing={3} justifyContent="center" alignItems="stretch" sx={{ mb: 4 }}>
  <Grid item xs={12} md={6}>
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
        height: 400,
         width:400
      }}
    >
      <Typography variant="subtitle1" gutterBottom>
        Total
      </Typography>
      <Box sx={{ width: "100%", height: "300" }}>
        <PieChartComponent
          data={[
            { name: "Invested", value: summary?.totalInvested || 0 },
            { name: "Debt", value: summary?.totalDebt || 0 },
            { name: "Spends", value: summary?.totalSpends || 0 },
          ]}
        />
      </Box>
    </Paper>
  </Grid>

  <Grid item xs={12} md={6}>
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
        height: 400,
        width:400
      }}
    >
      <Typography variant="subtitle1" gutterBottom>
        Monthly
      </Typography>
      <Box sx={{ width: "100%", height: "300" }}>
        <PieChartComponent
          data={[
            { name: "Invested", value: monthlySummary?.investedMonthly || 0 },
            { name: "Debt", value: monthlySummary?.debtMonthly || 0 },
            { name: "Spends", value: monthlySummary?.spendMonthly || 0 },
          ]}
        />
      </Box>
    </Paper>
  </Grid>
</Grid>

      </>)}
          </Container>
</Box>
<Footer/>
</Box>
        </>
    );
  }
export default Dashboard;
  