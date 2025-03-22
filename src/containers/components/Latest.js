import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

const articleInfo = [
  {
    tag: "Family",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
  {
    tag: "Travel",
    title: "The future of AI in software engineering",
    content:
      "Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality. This article dives deep into the various applications of AI, including automated code generation, bug detection, and performance optimization, providing insights into how these technologies are shaping the future of software development.",
    publication_date: "20-03-2025",
  },
];

const StyledTypography = styled(Typography)(({ expanded }) => ({
  display: expanded ? "block" : "-webkit-box",
  WebkitBoxOrient: expanded ? "unset" : "vertical",
  WebkitLineClamp: expanded ? "unset" : 2,
  overflow: expanded ? "visible" : "hidden",
  textOverflow: expanded ? "unset" : "ellipsis",
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  position: "relative",
  textDecoration: "none",
  "&:hover": { cursor: "pointer" },
  "& .arrow": {
    visibility: "hidden",
    position: "absolute",
    right: 0,
    top: "50%",
    transform: "translateY(-50%)",
  },
  "&:hover .arrow": {
    visibility: "visible",
    opacity: 0.7,
  },
  "&:focus-visible": {
    outline: "3px solid",
    outlineColor: "hsla(210, 98%, 48%, 0.5)",
    outlineOffset: "3px",
    borderRadius: "8px",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    width: 0,
    height: "1px",
    bottom: 0,
    left: 0,
    backgroundColor: (theme.vars || theme).palette.text.primary,
    opacity: 0.3,
    transition: "width 0.3s ease, opacity 0.3s ease",
  },
  "&:hover::before": {
    width: "100%",
  },
}));

export default function Latest({ selectedTag, searchTerm }) {
  const [focusedCardIndex, setFocusedCardIndex] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [expandedArticle, setExpandedArticle] = React.useState(null); // Theo dõi bài viết được mở rộng
  const articlesPerPage = 24;

  const handleFocus = (index) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  // Toggle trạng thái mở rộng khi click vào tiêu đề
  const handleTitleClick = (index) => {
    setExpandedArticle(expandedArticle === index ? null : index);
  };

  // Lọc bài viết dựa trên tag và search term
  const filteredArticles = articleInfo.filter((article) => {
    const matchesTag =
      selectedTag === "All categories" || article.tag === selectedTag;
    const matchesSearch =
      !searchTerm ||
      article.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    setExpandedArticle(null); // Đóng tất cả nội dung mở rộng khi chuyển trang
  };

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        Latest
      </Typography>
      <Grid container spacing={8} columns={12} sx={{ my: 4 }}>
        {currentArticles.map((article, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 1,
                height: "100%",
              }}
            >
              <Typography gutterBottom variant="caption" component="div">
                {article.tag}
              </Typography>
              <TitleTypography
                gutterBottom
                variant="h6"
                onFocus={() => handleFocus(index)}
                onBlur={handleBlur}
                onClick={() => handleTitleClick(index)} // Thêm sự kiện click
                tabIndex={0}
                className={focusedCardIndex === index ? "Mui-focused" : ""}
              >
                {article.title}
                <NavigateNextRoundedIcon
                  className="arrow"
                  sx={{ fontSize: "1rem" }}
                />
              </TitleTypography>
              <StyledTypography
                variant="body2"
                color="text.secondary"
                gutterBottom
                expanded={expandedArticle === index} // Truyền prop expanded
              >
                {article.content}
              </StyledTypography>
              <Typography variant="caption" color="text.secondary">
                {article.publication_date}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", pt: 4 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          boundaryCount={2}
          siblingCount={1}
        />
      </Box>
    </div>
  );
}
