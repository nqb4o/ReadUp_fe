import React from 'react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Button,
    Divider,
    ButtonGroup,
} from '@mui/material';
import {
    Close,
    Delete,
    ShoppingCart,
    Add as AddIcon,
    Remove as RemoveIcon,
} from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer({ open, onClose }) {
    const {
        cartItems,
        removeFromCart,
        incrementQuantity,
        decrementQuantity
    } = useCart();

    const total = cartItems.reduce((sum, item) => sum + (item.quantity * 299000), 0);

    const Navigate = useNavigate();

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: { xs: '100%', sm: 400 } }
            }}
        >
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ShoppingCart /> Giỏ hàng
                    </Typography>
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {cartItems.length === 0 ? (
                    <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                        Giỏ hàng trống
                    </Typography>
                ) : (
                    <>
                        <List>
                            {cartItems.map((item) => (
                                <ListItem
                                    key={item.book_id}
                                    sx={{
                                        py: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', width: '100%', mb: 1 }}>
                                        <ListItemAvatar>
                                            <Avatar
                                                variant="rounded"
                                                src={`https://picsum.photos/200/300?random=${item.id}`}
                                                alt={item.title}
                                                sx={{ width: 60, height: 60 }}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={item.title}
                                            secondary={
                                                <Typography variant="body2" color="text.secondary">
                                                    {(299000 * item.quantity).toLocaleString('vi-VN')}₫
                                                </Typography>
                                            }
                                        />
                                        {/* Quantity controls */}
                                        <ButtonGroup size="small" variant="outlined">
                                            <IconButton
                                                onClick={() => decrementQuantity(item.book_id)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <RemoveIcon fontSize="small" />
                                            </IconButton>
                                            <Button
                                                sx={{
                                                    minWidth: '40px',
                                                    pointerEvents: 'none',
                                                    borderLeft: '1px solid',
                                                    borderRight: '1px solid',
                                                    borderColor: 'divider',
                                                }}
                                            >
                                                {item.quantity}
                                            </Button>
                                            <IconButton
                                                onClick={() => incrementQuantity(item.book_id)}
                                            >
                                                <AddIcon fontSize="small" />
                                            </IconButton>
                                        </ButtonGroup>
                                        <IconButton
                                            edge="end"
                                            onClick={() => removeFromCart(item.book_id)}
                                            sx={{ alignSelf: 'flex-start' }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ p: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Tổng cộng: {total.toLocaleString('vi-VN')}₫
                            </Typography>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={() => Navigate('/payment')}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.5,
                                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                }}
                            >
                                Thanh toán
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Drawer>
    );
}