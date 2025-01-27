import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBookByIdApi } from '../../services/BookService';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from '../components/AppAppBar';
import Footer from '../components/Footer';
import BlogReview from './BlogReview';
import {
    Button,
    Typography,
    Rating,
    CardMedia,
    Grid2 as Grid,
    Container,
    CssBaseline,
    Paper,
    Box,
    Divider,
    Chip,
    IconButton,
    Tooltip,
    Snackbar
} from '@mui/material';
import {
    Favorite,
    FavoriteBorder,
    Share,
    ShoppingCart,
    LocalLibrary,
} from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';

export default function BookPage(props) {
    const { book_id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const { addToCart, toggleFavorite, favorites } = useCart();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                setLoading(true);
                const response = await getBookByIdApi(book_id);
                setBook(response.data);
            } catch (error) {
                console.error('Failed to fetch book details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [book_id]);

    useEffect(() => {
        if (book) {
            setIsFavorite(favorites.some(item => item.id === book.id));
        }
    }, [favorites, book]);

    const handleAddToCart = () => {
        addToCart(book);
        setSnackbarMessage('Đã thêm vào giỏ hàng');
        setOpenSnackbar(true);
    };

    const handleToggleFavorite = () => {
        toggleFavorite(book);
        setSnackbarMessage(isFavorite ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích');
        setOpenSnackbar(true);
    };

    if (loading) {
        return <div>Loading book details...</div>;
    }

    if (!book) {
        return <div>Book not found.</div>;
    }

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <AppAppBar />
            <Container
                maxWidth="lg"
                component="main"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    mt: 16,
                    gap: 4,
                    minHeight: '90vh',
                }}
            >
                <Grid container spacing={2} columns={12}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper
                            elevation={6}
                            sx={{
                                height: '100%',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                borderRadius: 3,
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                },
                            }}
                        >
                            <CardMedia
                                component="img"
                                alt={book.title}
                                image={`https://picsum.photos/800/450?random=${Math.floor(Math.random() * 10)}`}
                                sx={{
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    display: 'flex',
                                    gap: 1,
                                }}
                            >
                                <Tooltip title="Chia sẻ">
                                    <IconButton
                                        sx={{
                                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                                            '&:hover': { bgcolor: 'white' },
                                        }}
                                    >
                                        <Share />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}>
                                    <IconButton
                                        onClick={handleToggleFavorite}
                                        sx={{
                                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                                            '&:hover': { bgcolor: 'white' },
                                        }}
                                    >
                                        {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper
                            elevation={6}
                            sx={{
                                height: '100%',
                                padding: 6,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                borderRadius: 3,
                                bgcolor: 'rgba(255, 255, 255, 0.98)',
                            }}
                        >
                            <Box>
                                <Box sx={{ display: 'flex', gap: 1, marginBottom: 2 }}>
                                    <Chip label="Bestseller" color="success" />
                                    <Chip label="Mới phát hành" color="primary" />
                                </Box>

                                <Typography
                                    variant="h2"
                                    component="h1"
                                    sx={{
                                        marginBottom: 2,
                                        fontWeight: 800,
                                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        letterSpacing: '-0.5px',
                                    }}
                                >
                                    {book.title}
                                </Typography>

                                <Typography
                                    variant="h5"
                                    sx={{
                                        marginBottom: 3,
                                        color: 'text.secondary',
                                        fontWeight: 500,
                                    }}
                                >
                                    bởi {book.author_first_name || '-'} {book.author_last_name}
                                </Typography>

                                <Divider sx={{ marginY: 4 }} />

                                <Box sx={{ marginBottom: 4 }}>
                                    <Rating
                                        name="rating"
                                        value={book.rating || 0}
                                        max={10}
                                        precision={0.1}
                                        readOnly
                                        sx={{
                                            color: '#FFB400',
                                        }}
                                    />
                                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                        {book.rating ? `${book.rating}/10` : 'Chưa đánh giá'}
                                    </Typography>
                                </Box>

                                <Box sx={{ marginBottom: 4 }}>
                                    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                                        Khám phá câu chuyện tuyệt vời này qua từng trang sách. Một tác phẩm đầy cảm xúc
                                        và sâu sắc sẽ để lại dấu ấn khó quên trong lòng độc giả.
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<ShoppingCart />}
                                    onClick={handleAddToCart}
                                    sx={{
                                        padding: '16px 32px',
                                        fontSize: '1.2rem',
                                        fontWeight: 700,
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                        },
                                    }}
                                >
                                    Thêm vào giỏ hàng - 299.000₫
                                </Button>

                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<LocalLibrary />}
                                    sx={{
                                        padding: '16px 32px',
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        borderWidth: 2,
                                        '&:hover': {
                                            borderWidth: 2,
                                        },
                                    }}
                                >
                                    Đọc thử miễn phí
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
            <BlogReview />
            <Footer />
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
            />
        </AppTheme>
    );
};

