import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import AppTheme from "../shared-theme/AppTheme";
import AppAppBar from "../components/AppAppBar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../../utils/scrollToTop";
import { useAuth } from "../../contexts/AuthContext";
import { Box, Drawer, IconButton } from "@mui/material";
import UserSideBar from "../components/UserSideBar";
import MainContent from "../components/MainContent";
import UserHeader from "../components/UserHeader";
import MenuIcon from "@mui/icons-material/Menu";

export default function HomePage(props) {
  const { isAuthenticated, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); // State for mobile drawer

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      {/* Show AppAppBar only if the user is NOT authenticated */}
      {/* {!isAuthenticated && <AppAppBar />} */}
      {/* {!isAuthenticated && (
        <Container
          maxWidth="xl"
          component="main"
          sx={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 4,
            gap: 4,
          }}
        >
          <ScrollToTop />
          <Outlet />
        </Container>
      )} */}
      <Box sx={{ display: "flex" }}>
        {/* Use the Sidebar component */}
        <Box
          sx={{
            display: { xs: "none", sm: "block" }, // Hide on mobile, show on tablet+
          }}
        >
          <UserSideBar collapsed={collapsed} setCollapsed={setCollapsed} />
        </Box>

        {/* Drawer for mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better performance on mobile
          }}
          sx={{
            display: { xs: "block", sm: "none" }, // Show on mobile, hide on tablet+
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
            },
          }}
        >
          <UserSideBar collapsed={false} setCollapsed={setCollapsed} />
        </Drawer>

        {/* Main Content */}
        <Box
          sx={{
            marginLeft: {
              xs: 0,
              sm: collapsed ? "60px" : "240px",
            },
            p: { xs: 2, sm: 3 },
            width: "100%",
            transition: "margin-left 0.3s ease",
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              width: "100%",
              px: { xs: 0, sm: 3 }, // Padding for tablet/PC
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexDirection: { xs: "row", sm: "column" },
              }}
            >
              <Box sx={{ display: { xs: "block", sm: "none" } }}>
                <IconButton onClick={handleDrawerToggle}>
                  <MenuIcon />
                </IconButton>
              </Box>
              <Box sx={{ flexGrow: 1, width: "100%" }}>
                <UserHeader />
              </Box>
            </Box>
          </Box>

          <Container maxWidth="xl">
            <Outlet />
          </Container>
        </Box>
      </Box>
      {/* Show Footer only if the user is NOT authenticated */}
      {/* {!isAuthenticated && <Footer />} */}
    </AppTheme>
  );
}