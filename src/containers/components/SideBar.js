import {
    Assignment,
    DashboardSharp,
    Logout,
    Portrait,
} from "@mui/icons-material";
import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
    IconButton,
} from "@mui/material";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

const drawerWidth = {
    xs: "100%",
    sm: "350px",
    md: "250px",
};

const menuItems = [
    {
        text: "Dashboard",
        icon: <DashboardSharp />,
        path: "/admin",
    },
    { text: "User", icon: <Portrait />, path: "/admin/user" },
    { text: "Article", icon: <Assignment />, path: "/admin/article" },
    { text: "Exit", icon: <Logout />, path: "/" },
];

const SideBar = ({ mobileOpen, handleDrawerToggle, isMobile }) => {
    const location = useLocation();

    const drawer = (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2.5,
                }}
            >
                <Typography
                    variant="h6"
                    component="a"
                    href="/"
                    sx={{
                        fontWeight: "bold",
                        cursor: "pointer",
                        textDecoration: "none",
                        color: "primary.main",
                    }}
                >
                    ReadUp
                </Typography>
                {isMobile && (
                    <IconButton onClick={handleDrawerToggle} sx={{ border: "unset" }}>
                        <CloseIcon />
                    </IconButton>
                )}
            </Box>
            <List sx={{ px: 2 }}>
                {menuItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItemButton
                            key={index}
                            component={Link}
                            to={item.path}
                            onClick={isMobile ? handleDrawerToggle : undefined}
                            sx={{
                                py: 1.5,
                                mb: 1,
                                borderRadius: 1,
                                letterSpacing: 0.7,
                                backgroundColor: isActive ? "#edf4fe" : "transparent",
                                "&:hover": {
                                    backgroundColor: isActive ? "#D0ECFE" : "rgba(0, 0, 0, 0.04)",
                                },
                                "& .MuiListItemIcon-root": {
                                    color: isActive ? "#1877F2" : "inherit",
                                },
                                "& .MuiListItemText-primary": {
                                    color: isActive ? "#1877F2" : "inherit",
                                    fontWeight: isActive ? 600 : 400,
                                },
                            }}
                        >
                            <ListItemIcon sx={{ mr: 1 }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    );
                })}
            </List>
        </>
    );

    return (
        <Box
            component="nav"
            sx={{
                width: { md: drawerWidth.md },
                flexShrink: { md: 0 },
            }}
        >
            {/* Mobile drawer */}
            {isMobile ? (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: "block", md: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: { xs: drawerWidth.xs, sm: drawerWidth.sm },
                            bgcolor: "#fff",
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            ) : (
                /* Desktop drawer */
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", md: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth.md,
                            bgcolor: "#fff",
                            border: "none",
                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            )}
        </Box>
    );
};

export default SideBar;