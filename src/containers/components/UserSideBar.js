import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import FolderIcon from "@mui/icons-material/Folder";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import SchoolIcon from "@mui/icons-material/School";
import MenuIcon from "@mui/icons-material/Menu";
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import QuizIcon from '@mui/icons-material/Quiz';
import Logo from "../../assets/icons/logo_ReadUp.svg";

const SidebarContainer = styled(Box)(({ theme, collapsed }) => ({
    width: collapsed ? 60 : 240,
    height: "100vh",
    backgroundColor: theme.palette.background.paper,
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,
    paddingTop: theme.spacing(2),
    borderRight: `1px solid ${theme.palette.divider}`,
    transition: "width 0.3s ease",
    [theme.breakpoints.down("sm")]: {
        position: "relative", // For drawer
        height: "auto",
    },
}));

const SidebarItem = styled(Box)(({ theme, collapsed, active }) => ({
    display: "flex",
    alignItems: "center",
    padding: collapsed ? theme.spacing(1.5, 2) : theme.spacing(1.5, 3),
    color: active ? "#4255ff" : theme.palette.text.secondary,
    "&:hover": {
        backgroundColor: theme.palette.action.hover,
        cursor: "pointer",
    },
    justifyContent: collapsed ? "center" : "flex-start",
    [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(1.5, 3), // Consistent padding in drawer
    },
}));

const MenuButton = styled(Box)(({ theme, collapsed }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: collapsed ? "center" : "flex-start",
    padding: collapsed ? theme.spacing(1.5, 2) : theme.spacing(1.5, 2, 1.5, 3),
    color: theme.palette.text.secondary,
    "&:hover": {
        cursor: "pointer",
    },
}));

const UserSideBar = ({ collapsed, setCollapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setCollapsed((prev) => !prev);
    };

    const sidebarItems = [
        { path: "/", icon: HomeIcon, label: "Trang chủ" },
        { path: "/library", icon: FolderIcon, label: "Thư viện của bạn" },
        { path: "/flashcards", icon: FlashOnIcon, label: "Thẻ ghi nhớ" },
        {
            path: "/articles",
            icon: SchoolIcon,
            label: "Bài báo",
        },
        {
            path: "/vocabulary",
            icon: FormatColorTextIcon,
            label: "Từ vựng",
        },
        {
            path: "/quiz",
            icon: QuizIcon,
            label: "Bài tập trắc nghiệm",
        }
    ];

    const handleItemClick = (path) => {
        navigate(path);
    };

    return (
        <SidebarContainer collapsed={collapsed}>
            <MenuButton onClick={toggleSidebar} collapsed={collapsed}>
                <MenuIcon
                    sx={{ marginBottom: "10px", marginRight: !collapsed && "10px" }}
                />
                {!collapsed && <img src={Logo} alt="ReadUp Logo" height={48} />}
            </MenuButton>

            {sidebarItems.slice(0, 2).map((item) => (
                <SidebarItem
                    key={item.path}
                    collapsed={collapsed}
                    active={location.pathname === item.path}
                    sx={{
                        mx: 2,
                        my: 1,
                        borderRadius: 1,
                        backgroundColor:
                            location.pathname === item.path ? "#edefff" : "none",
                    }}
                    onClick={() => handleItemClick(item.path)}
                >
                    <item.icon
                        sx={{
                            mr: collapsed ? 0 : 2,
                            color: location.pathname === item.path ? "#4255ff" : "inherit",
                        }}
                    />
                    {!collapsed && (
                        <Typography
                            variant="body1"
                            sx={{
                                color: location.pathname === item.path ? "#4255ff" : "inherit",
                                fontSize: { xs: "0.9rem", sm: "1rem" },
                            }}
                        >
                            {item.label}
                        </Typography>
                    )}
                </SidebarItem>
            ))}

            <Divider sx={{ my: 1, width: "100%", borderWidth: "1.5px" }} />

            {!collapsed && (
                <Box sx={{ px: 3, py: 2 }}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                        Bắt đầu ở đây
                    </Typography>
                </Box>
            )}

            {sidebarItems.slice(2).map((item) => (
                <SidebarItem
                    key={item.path}
                    collapsed={collapsed}
                    active={location.pathname === item.path}
                    sx={{
                        mx: 2,
                        my: 1,
                        borderRadius: 1,
                        backgroundColor:
                            location.pathname === item.path ? "#edefff" : "none",
                    }}
                    onClick={() => handleItemClick(item.path)}
                >
                    <item.icon
                        sx={{
                            mr: collapsed ? 0 : 2,
                            color: location.pathname === item.path ? "#4255ff" : "inherit",
                        }}
                    />
                    {!collapsed && (
                        <Typography
                            variant="body1"
                            sx={{
                                color: location.pathname === item.path ? "#4255ff" : "inherit",
                                fontSize: { xs: "0.9rem", sm: "1rem" },
                            }}
                        >
                            {item.label}
                        </Typography>
                    )}
                </SidebarItem>
            ))}
        </SidebarContainer>
    );
};

export default UserSideBar;