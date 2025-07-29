import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.secondary,
        textAlign: "center",
        py: 3,
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: "auto",
      }}
    >
      <Typography variant="subtitle1" fontWeight={600}>
        Finance Journal
      </Typography>
      <Typography variant="caption">
        A journal for your financial health
      </Typography>
    </Box>
  );
}

export default Footer;
