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

// Hardcoded data
const blogPosts = [
  {
    id: 1,
    title: "Applying technology to learning English?",
    date: "03/03/2025",
    image:
      "https://img.freepik.com/free-vector/online-learning-concept_52683-37481.jpg",
  },
  {
    id: 2,
    title: "Applying technology to learning English?",
    date: "03/03/2025",
    image:
      "https://img.freepik.com/free-vector/education-concept-illustration_114360-3896.jpg",
  },
  {
    id: 3,
    title: "Applying technology to learning English?",
    date: "03/03/2025",
    image:
      "https://img.freepik.com/free-vector/online-education-concept_23-2148533386.jpg",
  },
  {
    id: 4,
    title: "Applying technology to learning English?",
    date: "03/03/2025",
    image:
      "https://img.freepik.com/free-vector/studying-concept-illustration_114360-1319.jpg",
  },
  {
    id: 5,
    title: "Applying technology to learning English?",
    date: "03/03/2025",
    image:
      "https://img.freepik.com/free-vector/online-learning-concept_52683-37481.jpg",
  },
  {
    id: 6,
    title: "Applying technology to learning English?",
    date: "03/03/2025",
    image:
      "https://img.freepik.com/free-vector/education-concept-illustration_114360-3896.jpg",
  },
  {
    id: 7,
    title: "Applying technology to learning English?",
    date: "03/03/2025",
    image:
      "https://img.freepik.com/free-vector/online-education-concept_23-2148533386.jpg",
  },
  {
    id: 8,
    title: "Applying technology to learning English?",
    date: "03/03/2025",
    image:
      "https://img.freepik.com/free-vector/studying-concept-illustration_114360-1319.jpg",
  },
  {
    id: 9,
    title: "Applying technology to learning English?",
    date: "03/03/2025",
    image:
      "https://img.freepik.com/free-vector/online-learning-concept_52683-37481.jpg",
  },
  {
    id: 10,
    title: "Applying technology to learning English?",
    date: "03/03/2025",
    image:
      "https://img.freepik.com/free-vector/education-concept-illustration_114360-3896.jpg",
  },
];

const Blog = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const postsPerPage = 4; // Số bài viết trên mỗi trang
  const totalPages = Math.ceil(blogPosts.length / postsPerPage); // Tổng số trang

  // Lấy bài viết cho trang hiện tại
  const startIndex = (page - 1) * postsPerPage;
  const currentPosts = blogPosts.slice(startIndex, startIndex + postsPerPage);

  // Sửa hàm handlePageChange để nhận đúng tham số
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleViewDetails = (postId) => {
    console.log(postId);
    navigate(`/blog/${postId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Danh sách bài viết */}
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
              {/* Hình ảnh minh họa */}
              <CardMedia
                component="img"
                height="140"
                image={post.image}
                alt={post.title}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                {/* Ngày đăng */}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  BLOG FOR IELTS | {post.date}
                </Typography>
                {/* Tiêu đề */}
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                  {post.title}
                </Typography>
                {/* Nút Details */}
                <Button
                  variant="text"
                  color="primary"
                  sx={{ textTransform: "none", fontWeight: "medium" }}
                  onClick={() => handleViewDetails(post.id)} // Xử lý bấm vào Details
                >
                  Details {">"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Phân trang */}
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

export default Blog;