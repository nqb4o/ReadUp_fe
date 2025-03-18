import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArticleByIdApi } from '../../services/ArticleService';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from '../components/AppAppBar';
import Footer from '../components/Footer';
import {
    Grid2 as Grid,
    CssBaseline,
    Snackbar,
    IconButton,
    Tooltip,
    Box,
    Typography,
    Avatar,
    Paper,
    Divider,
    Chip,
    Container
} from '@mui/material';
import {
    Favorite,
    FavoriteBorder,
    AccessTime,
    Person,
    LocalOffer,
} from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';

export default function ArticlePage(props) {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const { toggleFavorite, favorites } = useCart();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const review = {
        title: "Review: 'Atomic Habits' - Nghệ thuật thay đổi tư duy và thiết lập thói quen",
        author: "Nguyễn Thanh Tùng",
        authorRole: "Article Reviewer",
        publishDate: "18 tháng 1, 2025",
        readingTime: "8 phút đọc",
        authorAvatar: "https://i.pravatar.cc/150?img=3",
        tags: ["Self-help", "Psychology", "Personal Development"],
        coverImage: "https://picsum.photos/1200/600?random=1",
        galleryImages: [
            "https://picsum.photos/600/400?random=2",
            "https://picsum.photos/600/400?random=3",
            "https://picsum.photos/600/400?random=4"
        ]
    };
    useEffect(() => {
        const fetchArticleDetails = async () => {
            try {
                setLoading(true);
                const response = await getArticleByIdApi(id);
                setArticle(response.data);
            } catch (error) {
                console.error('Failed to fetch article details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticleDetails();
    }, [id]);

    useEffect(() => {
        if (article) {
            setIsFavorite(favorites.some(item => item.id === article.id));
        }
    }, [favorites, article]);

    const handleToggleFavorite = () => {
        toggleFavorite(article);
        setSnackbarMessage(isFavorite ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích');
        setOpenSnackbar(true);
    };

    if (loading) {
        return <div>Loading article details...</div>;
    }

    if (!article) {
        return <div>article not found.</div>;
    }

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <AppAppBar />
            <Container
                component="article"
                sx={{
                    maxWidth: "lg",
                    margin: '0 auto',
                    padding: { xs: 2, md: 4 },
                    marginTop: 16,
                    marginBottom: 8,
                }}
            >
                {/* Header Section */}
                <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        fontWeight: 800,
                        lineHeight: 1.2,
                        marginBottom: 3,
                        background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    {review.title}
                </Typography>

                {/* Author Info & Meta */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    marginBottom: 4,
                    justifyContent: 'space-between'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                            src={review.authorAvatar}
                            sx={{ width: 56, height: 56 }}
                        />
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Person sx={{ fontSize: 20, color: 'primary.main' }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {review.author}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {review.authorRole}
                            </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                {review.publishDate} • {review.readingTime}
                            </Typography>
                        </Box>
                    </Box>
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

                {/* Introduction */}
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        marginBottom: 2,
                        fontStyle: 'italic',
                        color: 'text.secondary'
                    }}
                >
                    "Atomic Habits không chỉ là một cuốn sách về thói quen, mà còn là một hành trình khám phá về sức mạnh của những thay đổi nhỏ nhất..."
                </Typography>

                {/* Main Content */}
                <Box sx={{ marginY: 4 }}>
                    <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                        Trong thế giới ngày càng phức tạp và đầy áp lực, việc hình thành và duy trì những thói quen tích cực trở nên quan trọng hơn bao giờ hết. James Clear, với "Atomic Habits", đã mang đến một cách tiếp cận mới mẻ và khoa học về việc xây dựng thói quen, dựa trên những nghiên cứu sâu rộng về tâm lý học và khoa học thần kinh.
                    </Typography>
                </Box>

                {/* Tags */}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', marginTop: 4 }}>
                    <LocalOffer sx={{ color: 'text.secondary' }} />
                    {review.tags.map((tag, index) => (
                        <Chip
                            key={index}
                            label={tag}
                            sx={{
                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                color: 'primary.main',
                                fontWeight: 500,
                            }}
                        />
                    ))}
                </Box>

                {/* Author Bio */}
                <Paper
                    elevation={2}
                    sx={{
                        padding: 3,
                        marginTop: 6,
                        borderRadius: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Avatar
                            src={review.authorAvatar}
                            sx={{ width: 64, height: 64 }}
                        />
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Về tác giả
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {review.author} là một article reviewer với hơn 5 năm kinh nghiệm trong lĩnh vực sách self-help và phát triển bản thân. Anh đã review hơn 200 cuốn sách và là tác giả của blog "Đọc Sách Mỗi Ngày".
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
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

