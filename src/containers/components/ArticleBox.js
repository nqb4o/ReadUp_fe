import React, { useState } from "react";
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Pagination,
    Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Article = ({ articles, selectedTag, searchTerm }) => {
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const postsPerPage = 4;

    const filteredPosts = articles.filter((post) => {
        const matchesTag = selectedTag === "All categories" || post.category === selectedTag;
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTag && matchesSearch;
    });

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const startIndex = (page - 1) * postsPerPage;
    const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleViewDetails = (postId) => {
        navigate(`/article/${postId}`);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={3}>
                {currentPosts.map((post) => (
                    <Grid item xs={12} sm={6} md={3} key={post.id}>
                        <Card
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                borderRadius: 2,
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="140"
                                image={post.image}
                                alt={post.title}
                                sx={{ objectFit: "cover" }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                                    {post.category} | {post.date}
                                </Typography>
                                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                                    {post.title}
                                </Typography>
                                <Button
                                    variant="text"
                                    color="primary"
                                    sx={{ textTransform: "none", fontWeight: "medium" }}
                                    onClick={() => handleViewDetails(post.id)}
                                >
                                    Details {">"}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                />
            </Box>
        </Container>
    );
};

export default Article;