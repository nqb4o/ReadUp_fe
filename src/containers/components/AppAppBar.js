import React, { useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  Container,
  MenuItem,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Badge,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ColorModeIconDropdown from "../shared-theme/ColorModeIconDropdown";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import FavoritesDrawer from "./FavoritesDrawer";
import logo from "../../assets/icons/logo_ReadUp.svg";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

export default function AppAppBar() {
  const { logout } = useAuth();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { cartItemCount, favoritesCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setOpen(false);
  };

  const token = sessionStorage.getItem("authToken");

  // Hàm xử lý điều hướng và đóng Drawer
  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <img
              src={logo}
              alt="ReadUp Logo"
              style={{ height: "40px", width: "auto", paddingTop: "5px" }}
            />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => navigate("/")}
              >
                Home
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => navigate("/vocabulary")}
              >
                Vocabulary
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => navigate("/article")}
              >
                Article
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => navigate("/flashcard")}
              >
                Flashcard
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => navigate("/blog")}
              >
                Blog
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {token ? (
              <Button
                color="primary"
                variant="outlined"
                size="small"
                onClick={handleLogout}
              >
                Log out
              </Button>
            ) : (
              <Button
                color="primary"
                variant="outlined"
                size="small"
                onClick={() => navigate("/login")}
              >
                Log in
              </Button>
            )}
            <IconButton
              aria-label="Favorites"
              onClick={() => setFavoritesOpen(true)}
            >
              <Badge badgeContent={favoritesCount} color="primary" title="Favorites">
                <FavoriteIcon />
              </Badge>
            </IconButton>
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <IconButton
              aria-label="Favorites"
              onClick={() => setFavoritesOpen(true)}
            >
              <Badge badgeContent={favoritesCount} color="primary" title="Favorites">
                <FavoriteIcon />
              </Badge>
            </IconButton>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: "var(--template-frame-height, 0px)",
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem onClick={() => handleNavigate("/")}>Home</MenuItem>
                <MenuItem onClick={() => handleNavigate("/vocabulary")}>
                  Vocabulary
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/article")}>
                  Article
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/flashcard")}>
                  Flashcard
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/blog")}>Blog</MenuItem>
                <Divider sx={{ my: 3 }} />
                {token ? (
                  <MenuItem>
                    <Button
                      color="primary"
                      variant="outlined"
                      fullWidth
                      onClick={handleLogout}
                    >
                      Log out
                    </Button>
                  </MenuItem>
                ) : (
                  <MenuItem>
                    <Button
                      color="primary"
                      variant="outlined"
                      fullWidth
                      onClick={() => handleNavigate("/login")}
                    >
                      Log in
                    </Button>
                  </MenuItem>
                )}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
      <FavoritesDrawer
        open={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
      />
    </AppBar>
  );
}