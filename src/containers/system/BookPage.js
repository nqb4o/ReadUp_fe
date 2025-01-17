import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBookByIdApi } from '../../services/BookService';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from '../components/AppAppBar';
import Footer from '../components/Footer';
import Grid from '@mui/material/Grid2';
import CardMedia from '@mui/material/CardMedia';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

export default function BookDetail(props) {
    const { book_id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

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
                sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
            >
                <Grid container spacing={2} columns={12}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <div style={{ width: '100%', height: '75vh', border: '1px solid white' }} >
                            <CardMedia
                                component="img"
                                alt="green iguana"
                                image={'https://picsum.photos/800/450?random=' + Math.floor(Math.random() * 10)}
                                sx={{
                                    height: '75vh',
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                }}
                            />
                        </div>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <div style={{ width: '100%', height: '75vh', border: '1px solid white' }} >
                            <Typography gutterBottom variant="h2" component="div">
                                {book.title}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {book.author_first_name || '-'} {book.author_last_name}
                            </Typography>

                            <Rating
                                name="rating"
                                value={book.rating ? ` ${book.rating}` : ' Chưa đánh giá'}
                                max={10}
                                precision={0.1}
                                readOnly
                            />
                            <Typography variant="body1" gutterBottom>
                                {book.rating ? ` ${book.rating}` : ' Chưa đánh giá'}
                            </Typography>
                        </div>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </AppTheme>

    );
};

