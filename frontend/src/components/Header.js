import React, { useContext, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { useCustomTheme } from "../context/ThemeContext";

import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

function Header() {
  const { user, token, logout } = useContext(LoginContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useCustomTheme();

  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const isLoggedIn = token != null;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const disabledIfNotLoggedIn = {
    style: (isLoggedIn) => ({
      pointerEvents: isLoggedIn ? "auto" : "none",
      opacity: isLoggedIn ? 1 : 0.5,
      cursor: isLoggedIn ? "pointer" : "not-allowed",
      textDecoration: "none",
      color: "inherit",
    }),
    title: (isLoggedIn) => (isLoggedIn ? "" : "Please login first"),
  };

  const navLinks = [
    { label: "Home", to: "/", showWhenLoggedOut: true },
    { label: "Dashboard", to: "/dashboard" },
    { label: "Investment Tracker", to: "/investment" },
    { label: "Debt Tracker", to: "/debt" },
    { label: "Spends Tracker", to: "/spends" },
    { label: "Profile", to: "/profile" },
  ];
const renderNavLinks = () =>
  navLinks.map(({ label, to, showWhenLoggedOut }) => {
    const show = isLoggedIn || showWhenLoggedOut;

    const isPublicLink = showWhenLoggedOut;

    return (
      show && (
        <Button
          key={label}
          component={NavLink}
          to={to}
          title={isPublicLink ? "" : disabledIfNotLoggedIn.title(isLoggedIn)}
          sx={isPublicLink ? {} : disabledIfNotLoggedIn.style(isLoggedIn)}
          style={({ isActive }) => ({
            fontWeight: isActive ? "bold" : 500,
            textDecoration: "none",
            color: "inherit",
          })}
        >
          {label}
        </Button>
      )
    );
  });


  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>

          <Box>
            <Typography variant="h6" noWrap>
              Finance Journal
            </Typography>
          </Box>

          {!isMobile && (
            <Box display="flex" alignItems="center" gap={2}>
              {renderNavLinks()}
              <IconButton onClick={toggleTheme} color="inherit">
                {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              {isLoggedIn && location.pathname !== "/" && (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleLogout}
                  sx={{ ml: 1 }}
                >
                  Logout
                </Button>
              )}
            </Box>
          )}


          {isMobile && (
            <IconButton color="inherit" edge="end" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>


      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }}>
          <List>
            {navLinks.map(({ label, to, showWhenLoggedOut }) => {
              const show =
                isLoggedIn || (!isLoggedIn && showWhenLoggedOut === true);

              return (
                show && (
                  <ListItem key={label} disablePadding onClick={toggleDrawer}>
                    <ListItemButton
                      component={NavLink}
                      to={to}
                      title={disabledIfNotLoggedIn.title(isLoggedIn)}
                      sx={disabledIfNotLoggedIn.style(isLoggedIn)}
                    >
                      <ListItemText primary={label} />
                    </ListItemButton>
                  </ListItem>
                )
              );
            })}
          </List>
          <Box textAlign="center" py={2}>
            <IconButton onClick={toggleTheme} color="inherit">
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            {isLoggedIn && location.pathname !== "/" && (
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleLogout}
                sx={{ mt: 2 }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default Header;
