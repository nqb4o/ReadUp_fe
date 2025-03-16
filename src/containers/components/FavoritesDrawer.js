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
    ListItemSecondaryAction,
    Divider,
} from '@mui/material';
import { Close, Delete, Favorite } from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';

export default function FavoritesDrawer({ open, onClose }) {
    const { favorites, toggleFavorite } = useCart();


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
                        <Favorite /> Danh sách yêu thích
                    </Typography>
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {favorites.length === 0 ? (
                    <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                        Chưa có sách yêu thích
                    </Typography>
                ) : (
                    <List>
                        {favorites.map((item) => (
                            <ListItem key={item.book_id} sx={{ py: 2 }}>
                                <ListItemAvatar>
                                    <Avatar
                                        variant="rounded"
                                        src={`https://picsum.photos/200/300?random=${item.id}`}
                                        alt={item.title}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={item.title}
                                    secondary={`${item.author_first_name} ${item.author_last_name}`}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" onClick={() => toggleFavorite(item)}>
                                        <Delete />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>
        </Drawer>
    );
}