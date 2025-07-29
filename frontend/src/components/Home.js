import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

import { Box, Typography, Button, Stack } from "@mui/material";

function Home() {
  return (
    <>
      <Header />

      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          px: 2,
          py: 4,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontSize: { xs: "2rem", md: "3rem" }, mb: 2 }}
        >
          Finance Journal
        </Typography>

        <Typography
          variant="h6"
          sx={{ color: "text.secondary", mb: 4 }}
        >
          A journal for your financial health!
        </Typography>

        <Stack spacing={2} direction="column" alignItems="center">
          <Button
            component={Link}
            to="/login"
            variant="contained"
            size="large"
            color="primary"
          >
            Login
          </Button>

          <Typography variant="body1">
            New here?{" "}
            <Button
              component={Link}
              to="/signup"
              color="secondary"
              size="small"
                sx={{ textTransform: "none" }} 
            >
              Sign Up Here!
            </Button>
          </Typography>
        </Stack>
      </Box>
    </>
  );
}

export default Home;
