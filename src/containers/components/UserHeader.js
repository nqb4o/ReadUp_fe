import React, { useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear"; // Thêm biểu tượng Clear
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import PolicyIcon from "@mui/icons-material/Policy";
import HelpIcon from "@mui/icons-material/Help";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import { useNavigate } from "react-router-dom";

const mockSearchResults = [
  "algebra 2",
  "algebra 1",
  "anatomy and physiology",
  "advanced engineering math",
  "anatomy",
  "algebra 2 common core",
];

const placeholders = [
  "Tìm kiếm bài báo",
  "Tìm kiếm nhanh hơn bằng cách tìm kiếm",
  "Thẻ thẻ ghi nhớ, câu hỏi",
  "Tìm kiếm thẻ ghi nhớ",
  "Tìm kiếm câu hỏi",
];

const UserHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchAnchorEl, setSearchAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [placeholder] = useState(
    placeholders[Math.floor(Math.random() * placeholders.length)]
  );
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const searchOpen = Boolean(searchAnchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setSearchAnchorEl(event.currentTarget);

    if (query) {
      const filteredResults = mockSearchResults.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchClose = () => {
    setSearchAnchorEl(null);
    setSearchResults([]);
  };

  const handleSearchResultClick = (result) => {
    console.log("Selected:", result);
    setSearchQuery(result);
    handleSearchClose();
  };

  // Hàm xử lý khi nhấn vào biểu tượng dấu "X"
  const handleClearSearch = () => {
    setSearchQuery(""); // Xóa nội dung ô input
    setSearchResults([]); // Xóa kết quả tìm kiếm
    setSearchAnchorEl(null); // Đóng danh sách kết quả
  };

  const handleClickAway = () => {
    handleSearchClose();
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: { xs: 1, sm: 2 },
        width: "100%",
        px: { xs: 1, sm: 0 },
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          width: { xs: "100%", sm: "calc(100% - 60px)" },
          position: "relative",
        }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={placeholder}
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && ( // Hiển thị dấu "X" khi có nội dung
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClearSearch}
                      size="small"
                      sx={{
                        backgroundColor: "#000",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        "&:hover": {
                          backgroundColor: "#000",
                        },
                      }}
                    >
                      <ClearIcon
                        fontSize="small"
                        sx={{
                          color: "#fff",
                          "&:hover": {
                            color: "#fff",
                          },
                        }}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#f5f7fb",
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                  padding: { xs: "4px 8px", sm: "8px 12px" },
                },
              }}
            />

            {searchOpen && (
              <Paper
                sx={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0,
                  right: 0,
                  zIndex: 1300,
                  borderRadius: "8px",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  maxHeight: "400px",
                  overflowY: "auto",
                  backgroundColor: "#fff",
                }}
              >
                <List>
                  {searchResults.length > 0 ? (
                    searchResults.map((result, index) => (
                      <ListItem
                        key={index}
                        button
                        onClick={() => handleSearchResultClick(result)}
                        sx={{ py: 0.5 }}
                      >
                        <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                        <ListItemText primary={result} />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText
                        primary={
                          searchQuery
                            ? "No results found"
                            : "Start typing to search"
                        }
                        sx={{ color: "text.secondary" }}
                      />
                    </ListItem>
                  )}
                </List>
              </Paper>
            )}
          </Box>
        </ClickAwayListener>
      </Box>

      <Box sx={{ flexShrink: 0 }}>
        <IconButton
          onClick={handleAvatarClick}
          sx={{ border: "none", "&:hover": { backgroundColor: "transparent" } }}
        >
          <Avatar
            alt="User Avatar"
            src="https://via.placeholder.com/40"
            sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}
          />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              width: { xs: "280px", sm: "320px" },
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Avatar
              alt="User Avatar"
              src="https://via.placeholder.com/40"
              sx={{ width: { xs: 48, sm: 64 }, height: { xs: 48, sm: 64 } }}
            />
            <Box>
              <Box
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              >
                user
              </Box>
              <Box
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.85rem" },
                  color: "text.secondary",
                }}
              >
                user@gmail.com
              </Box>
            </Box>
          </Box>
          <Box sx={{ borderBottom: "1px solid #e0e0e0", my: 1 }} />
          <MenuItem>
            <EmojiEventsIcon sx={{ mr: 1, color: "text.secondary" }} />
            Achievements
          </MenuItem>
          <MenuItem>
            <SettingsIcon sx={{ mr: 1, color: "text.secondary" }} />
            Settings
          </MenuItem>
          <Box sx={{ borderBottom: "1px solid #e0e0e0", my: 1 }} />
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1, color: "text.secondary" }} />
            Log out
          </MenuItem>
          <Box sx={{ borderBottom: "1px solid #e0e0e0", my: 1 }} />
          <MenuItem>
            <PolicyIcon sx={{ mr: 1, color: "text.secondary" }} />
            Privacy policy
          </MenuItem>
          <MenuItem>
            <HelpIcon sx={{ mr: 1, color: "text.secondary" }} />
            Help and feedback
          </MenuItem>
          <MenuItem>
            <UpgradeIcon sx={{ mr: 1, color: "text.secondary" }} />
            Upgrade
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default UserHeader;
