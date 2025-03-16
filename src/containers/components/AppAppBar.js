import React, { useState } from 'react';
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
  Badge
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';
import Sitemark from './SitemarkIcon';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import FavoritesDrawer from './FavoritesDrawer';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
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
    navigate('/login');
  };

  const token = sessionStorage.getItem('authToken');

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <Sitemark />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button variant="text" color="info" size="small">
                Các tính năng
              </Button>
              <Button variant="text" color="info" size="small">
                Lời chứng thực
              </Button>
              <Button variant="text" color="info" size="small">
                Điểm nhấn
              </Button>
              <Button variant="text" color="info" size="small">
                Giá
              </Button>
              <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
                FAQ
              </Button>
              <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
                Blog
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            {token ? (
              <Button color="primary" variant="outlined" size="small" onClick={handleLogout}>
                Đăng xuất
              </Button>
            ) : (
              <Button color="primary" variant="outlined" size="small" onClick={() => navigate('/login')}>
                Đăng nhập
              </Button>
            )}
            <IconButton
              aria-label="Favorites"
              onClick={() => setFavoritesOpen(true)}
            >
              <Badge badgeContent={favoritesCount} color="primary">
                <FavoriteIcon />
              </Badge>
            </IconButton>
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <IconButton
              aria-label="Favorites"
              onClick={() => navigate('/favorites')}
            >
              <Badge badgeContent={favoritesCount} color="primary">
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
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem>Features</MenuItem>
                <MenuItem>Testimonials</MenuItem>
                <MenuItem>Highlights</MenuItem>
                <MenuItem>Pricing</MenuItem>
                <MenuItem>FAQ</MenuItem>
                <MenuItem>Blog</MenuItem>
                <Divider sx={{ my: 3 }} />
                {token ? (
                  <MenuItem>
                    <Button color="primary" variant="outlined" fullWidth onClick={handleLogout}>
                      Đăng xuất
                    </Button>
                  </MenuItem>
                ) : (
                  <MenuItem>
                    <Button color="primary" variant="outlined" fullWidth onClick={() => navigate('/login')}>
                      Đăng nhập
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
