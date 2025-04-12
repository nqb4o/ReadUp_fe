import React from "react";
import {
    Container,
    Typography,
    Box,
    CardMedia,
    Divider,
    Chip,
} from "@mui/material";
import { useLoaderData } from "react-router-dom";

// Hardcoded data
const blogPosts = [
    {
        id: 1,
        title: "Applying technology to learning English?",
        date: "03/03/2025",
        author: "John Doe",
        image:
            "https://img.freepik.com/free-vector/online-learning-concept_52683-37481.jpg",
        content: `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

      Technology has revolutionized the way we learn languages, especially English. With the advent of mobile apps, online courses, and AI-powered tools, learners can now practice speaking, listening, reading, and writing anytime, anywhere. For example, apps like Duolingo and Grammarly use AI to provide personalized feedback, making learning more effective.

      Another great tool is virtual reality (VR), which allows learners to immerse themselves in English-speaking environments without leaving their homes. Imagine practicing a job interview in English with a virtual interviewer! These advancements make learning English not only more accessible but also more engaging and fun.
    `,
    },
    {
        id: 2,
        title: "Applying technology to learning English?",
        date: "03/03/2025",
        author: "Jane Smith",
        image:
            "https://img.freepik.com/free-vector/education-concept-illustration_114360-3896.jpg",
        content: `
      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

      Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.

      Technology in education is a game-changer. For English learners, tools like speech recognition software can help improve pronunciation by providing instant feedback. Online platforms like Coursera and Udemy offer courses taught by native speakers, giving learners access to high-quality education.

      Additionally, social media platforms like YouTube and TikTok have become unexpected learning tools. Many creators share tips, vocabulary, and grammar lessons in short, engaging videos. This makes learning English more interactive and less intimidating for beginners.
    `,
    },
];
for (let i = 3; i <= 10; i++) {
    blogPosts.push({
        id: i,
        title: "Applying technology to learning English?",
        date: "03/03/2025",
        author: i % 2 === 0 ? "Jane Smith" : "John Doe",
        image:
            i % 2 === 0
                ? "https://img.freepik.com/free-vector/education-concept-illustration_114360-3896.jpg"
                : "https://img.freepik.com/free-vector/online-learning-concept_52683-37481.jpg",
        content: `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

      Technology has revolutionized the way we learn languages, especially English. With the advent of mobile apps, online courses, and AI-powered tools, learners can now practice speaking, listening, reading, and writing anytime, anywhere.
    `,
    });
}

const BlogDetail = () => {
    const { postId } = useLoaderData();
    console.log(postId); // Lấy postId từ loader

    // Tìm bài viết theo ID
    const post = blogPosts.find((p) => p.id === parseInt(postId));

    if (!post) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h6" color="text.secondary" textAlign="center">
                    Blog post not found.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            {/* Hình ảnh lớn */}
            <CardMedia
                component="img"
                height="400"
                image={post.image}
                alt={post.title}
                sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    mb: 4,
                    objectFit: "cover",
                }}
            />

            {/* Tiêu đề */}
            <Typography
                variant="h3"
                component="h1"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "primary.main" }}
            >
                {post.title}
            </Typography>

            {/* Thông tin bài viết: Ngày đăng, Tác giả */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                    {post.date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    •
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    By {post.author}
                </Typography>
                <Chip
                    label="Education"
                    size="small"
                    sx={{ bgcolor: "primary.light", color: "primary.contrastText" }}
                />
            </Box>

            {/* Đường phân cách */}
            <Divider sx={{ mb: 4 }} />

            {/* Nội dung bài viết */}
            <Typography
                variant="body1"
                color="text.primary"
                sx={{
                    lineHeight: 1.8,
                    "& p": {
                        mb: 2,
                    },
                }}
                dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<p></p>") }}
            />
        </Container>
    );
};

export default BlogDetail;