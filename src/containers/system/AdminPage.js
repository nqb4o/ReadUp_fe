import React, { useState } from "react";
import Box from "@mui/material/Box";
import AppTheme from "../shared-theme/AppTheme";
import SideBar from "../components/SideBar";
import AdminHeader from "../components/AdminHeader";
import { useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";

function AdminPage(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppTheme {...props}>
      <Box sx={{ display: "flex" }}>
        <SideBar
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          isMobile={isMobile}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: {
              xs: "100%",
              sm: "100%",
              md: `calc(100% - 250px)`,
            },
            minHeight: "100vh",
            backgroundColor: "background.paper",
          }}
        >
          <AdminHeader
            isMobile={isMobile}
            onDrawerToggle={handleDrawerToggle}
          />
          <Box sx={{ p: 3, mt: 8 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}
export default AdminPage;
