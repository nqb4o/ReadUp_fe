import {
  AdminPanelSettings,
  Email,
  Home,
  Language,
  LocalShipping,
  Notifications,
  Search,
  Settings,
  ShoppingCart,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Slide,
  Toolbar,
  Typography,
  Badge,
  Divider,
  TextField,
  Modal,
} from "@mui/material";
import React, { useState } from "react";

const AdminHeader = ({ isMobile, onDrawerToggle }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Giả định thông tin người dùng hiện tại
  const currentUser = {
    username: "current_user",
    email: "current.user@example.com",
    role: "Admin",
    createdAt: "2023-01-01",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  };
  const [formData, setFormData] = useState(currentUser);
  const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsClick = (event) => {
    setAnchorElNotif(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElNotif(null);
  };

  const handleProfileClick = () => {
    setOpenProfileModal(true);
    setEditMode(false);
    setAnchorEl(null);
    setFormData(currentUser);
  };

  const handleCloseProfileModal = () => {
    setOpenProfileModal(false);
    setEditMode(false);
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log("Saved user data:", formData);
    setEditMode(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: {
            xs: "100%",
            sm: "100%",
            md: `calc(100% - 250px)`,
          },
          ml: {
            xs: 0,
            sm: 0,
            md: "250px",
          },
          px: {
            sx: 0,
            sm: 0,
            md: 2,
          },
          top: "-1px",
          background: "transparent",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "unset",
        }}
      >
        <Toolbar
          sx={{
            gap: { xs: 1, sm: 1.5, md: 2 },
            py: { xs: 0.5, sm: 0.75, md: 1 },
            px: { xs: 1, sm: 2, md: 3 },
          }}
        >
          {/* Menu Icon */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={onDrawerToggle}
              sx={{
                color: "#333",
                mr: { xs: 1, sm: 2 },
                zIndex: 1200,
                border: "unset",
                background: "transparent",
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>

          {/* Search Icon */}
          <IconButton
            onClick={() => setShowSearch(true)}
            sx={{
              color: "#333",
              border: "unset",
              p: { xs: 0.5, sm: 1 },
            }}
          >
            <Search sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </IconButton>

          {/* Language - Hide on mobile */}
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <IconButton
              color="inherit"
              sx={{
                border: "unset",
                p: { xs: 0.5, sm: 1 },
              }}
            >
              <Language color="action" sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
          </Box>

          {/* Notifications */}
          <IconButton
            color="inherit"
            sx={{
              border: "unset",
              p: { xs: 0.5, sm: 1 },
            }}
            onClick={handleNotificationsClick}
          >
            <Badge
              badgeContent={2}
              color="error"
              overlap="circular"
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#FF5630",
                  color: "#fff",
                  fontSize: { xs: "10px", sm: "12px" },
                  width: { xs: "16px", sm: "18px" },
                  height: { xs: "16px", sm: "18px" },
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: "translate(50%, -50%)",
                  padding: "2px",
                },
              }}
            >
              <Notifications
                color="action"
                sx={{ fontSize: { xs: 20, sm: 24 } }}
              />
            </Badge>
          </IconButton>

          {/* Avatar */}
          <Avatar
            alt="User"
            src="https://randomuser.me/api/portraits/women/44.jpg"
            onClick={handleAvatarClick}
            sx={{
              cursor: "pointer",
              width: { xs: 28, sm: 32, md: 40 },
              height: { xs: 28, sm: 32, md: 40 },
            }}
          />
        </Toolbar>
      </AppBar>

      {/* Search Overlay and Slide */}
      {showSearch && (
        <Box
          onClick={() => setShowSearch(false)}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "transparent",
            zIndex: 1299,
            cursor: "pointer",
          }}
        />
      )}

      <Slide in={showSearch} direction="down" mountOnEnter unmountOnExit>
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            position: "fixed",
            top: 0,
            left: { xs: 0, sm: 0, md: "250px" },
            right: 0,
            backgroundColor: "#fff",
            border: "1px solid #e0e0e0",
            height: "64px",
            display: "flex",
            alignItems: "center",
            px: { xs: 2, sm: 3 },
            zIndex: 1300,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            width: {
              xs: "100%",
              sm: "100%",
              md: `calc(100% - 250px)`,
            },
            gap: { xs: 1, sm: 2 },
          }}
        >
          <InputBase
            placeholder="Tìm kiếm..."
            fullWidth
            autoFocus
            sx={{
              flex: 1,
              fontSize: { xs: "14px", sm: "16px" },
              "& .MuiInputBase-input": {
                padding: { xs: "6px 0", sm: "8px 0" },
              },
            }}
            startAdornment={
              <Search
                sx={{
                  color: "#888",
                  fontSize: { xs: "18px", sm: "20px" },
                  mr: { xs: 0.5, sm: 1 },
                }}
              />
            }
          />
          <Button
            variant="contained"
            disableElevation
            onClick={() => setShowSearch(false)}
            sx={{
              color: "#fff",
              borderRadius: "4px",
              textTransform: "none",
              height: { xs: "36px", sm: "40px" },
              fontSize: { xs: "13px", sm: "14px" },
              px: { xs: 2, sm: 3 },
              minWidth: { xs: "70px", sm: "80px" },
              mr: 5,
              flexShrink: 0,
              "&:hover": {
                backgroundColor: "#fff",
                color: "#000",
              },
            }}
          >
            Search
          </Button>
        </Box>
      </Slide>

      <Menu
        anchorEl={anchorElNotif}
        open={Boolean(anchorElNotif)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            mt: 1,
            minWidth: "300px",
            maxHeight: "none",
            "& .MuiList-root": {
              padding: 0,
              display: "flex",
              flexDirection: "column",
              height: { xs: "400px", sm: "500px" },
            },
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box
          sx={{
            p: 2,
            bgcolor: "#fff",
            borderRadius: "12px 12px 0 0",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="body1" fontWeight="bold">
            Notifications
          </Typography>
          <Typography variant="caption" color="text.secondary">
            You have 2 unread messages
          </Typography>
        </Box>

        <Box
          sx={{
            overflowY: "auto",
            flex: 1,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "3px",
              "&:hover": {
                backgroundColor: "#555",
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography
              variant="caption"
              color="primary"
              fontWeight="bold"
              sx={{ color: "#1976d2" }}
            >
              NEW
            </Typography>
          </Box>
          {/* Thông báo 1 */}
          <MenuItem>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 1 }}>
              <ShoppingCart sx={{ color: "#888", fontSize: "20px" }} />
              <Box>
                <Typography variant="body2">
                  Your order is placed waiting for shipping
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  a year
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          <Divider />
          {/* Thông báo 2 */}
          <MenuItem>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 1 }}>
              <Avatar
                alt="User"
                src="https://randomuser.me/api/portraits/women/44.jpg"
                sx={{ width: "24px", height: "24px" }}
              />
              <Box>
                <Typography variant="body2">
                  Teresa Luettgen commented the minimal
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  2 years
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          <Divider />
          <Box sx={{ px: 2, py: 1 }}>
            <Typography
              variant="caption"
              color="primary"
              fontWeight="bold"
              sx={{ color: "#1976d2" }}
            >
              BEFORE THAT
            </Typography>
          </Box>
          {/* Thông báo 3 */}
          <MenuItem>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 1 }}>
              <Email sx={{ color: "#888", fontSize: "20px" }} />
              <Box>
                <Typography variant="body2">
                  You have new message 5 unread messages
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  a year
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          <Divider />
          {/* Thông báo 4 */}
          <MenuItem>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 1 }}>
              <Avatar
                alt="User"
                src="https://randomuser.me/api/portraits/men/44.jpg"
                sx={{ width: "24px", height: "24px" }}
              />
              <Box>
                <Typography variant="body2">
                  You have new mail sent from Guido Padberg
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  a year
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          <Divider />
          {/* Thông báo 5 */}
          <MenuItem>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 1 }}>
              <LocalShipping sx={{ color: "#888", fontSize: "20px" }} />
              <Box>
                <Typography variant="body2">
                  Delivery processing. Your order is being shipped
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  a year
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        </Box>

        <Box
          sx={{
            borderTop: "1px solid #e0e0e0",
            bgcolor: "#fff",
            borderRadius: "0 0 12px 12px",
          }}
        >
          <MenuItem>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                py: 1,
              }}
            >
              <Typography variant="body2" color="primary">
                View all
              </Typography>
            </Box>
          </MenuItem>
        </Box>
      </Menu>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            mt: 1,
            minWidth: "220px",
            "& .MuiMenuItem-root": {
              py: 1.5,
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            },
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: "12px 12px 0 0" }}>
          <Typography variant="body2" color="text.secondary">
            {currentUser.username}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {currentUser.email}
          </Typography>
        </Box>
        <MenuItem>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Home sx={{ color: "#888" }} />
            <Typography>Home</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleProfileClick}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AdminPanelSettings sx={{ color: "#888" }} />
            <Typography>Profile</Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Settings sx={{ color: "#888" }} />
            <Typography>Settings</Typography>
          </Box>
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          sx={{
            justifyContent: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography color="error" sx={{ color: "#FF5630" }}>
              Logout
            </Typography>
          </Box>
        </MenuItem>
      </Menu>

      <Modal open={openProfileModal} onClose={handleCloseProfileModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {editMode ? "Edit Profile" : "Profile"}
          </Typography>

          {!editMode ? (
            // Chế độ xem Profile
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Avatar src={formData.avatar} sx={{ width: 56, height: 56 }} />
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    {formData.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formData.email}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2">
                <strong>Role:</strong> {formData.role}
              </Typography>
              <Typography variant="body2">
                <strong>Created At:</strong> {formData.createdAt}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 3,
                  gap: 2,
                }}
              >
                <Button variant="outlined" onClick={handleCloseProfileModal}>
                  Close
                </Button>
                <Button variant="contained" onClick={handleEditClick}>
                  Edit
                </Button>
              </Box>
            </Box>
          ) : (
            // Chế độ chỉnh sửa Profile
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Avatar src={avatarPreview} sx={{ width: 56, height: 56 }} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ flex: 1 }}
                />
              </Box>
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="New Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                placeholder="Enter new password"
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 3,
                  gap: 2,
                }}
              >
                <Button variant="outlined" onClick={() => setEditMode(false)}>
                  Close
                </Button>
                <Button variant="contained" onClick={handleSave}>
                  Save
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default AdminHeader;
