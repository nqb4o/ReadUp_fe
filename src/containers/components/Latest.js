import React from "react";
import { Box, Typography, Grid2 as Grid, Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';

const StyledTypography = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const TitleTypography = styled(Typography)(({ theme }) => ({
  position: 'relative',
  textDecoration: 'none',
  '&:hover': { cursor: 'pointer' },
  '& .arrow': {
    visibility: 'hidden',
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  '&:hover .arrow': {
    visibility: 'visible',
    opacity: 0.7,
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '3px',
    borderRadius: '8px',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    width: 0,
    height: '1px',
    bottom: 0,
    left: 0,
    backgroundColor: (theme.vars || theme).palette.text.primary,
    opacity: 0.3,
    transition: 'width 0.3s ease, opacity 0.3s ease',
  },
  '&:hover::before': {
    width: '100%',
  },
}));

export default function Latest({ articles, selectedTag, searchTerm }) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const articlesPerPage = 4;
  const navigate = useNavigate();
  const [focusedCardIndex, setFocusedCardIndex] = React.useState(null);

  const filteredArticles = articles.filter((article) => {
    const matchesTag = selectedTag === "All categories" || article.tag === selectedTag;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleViewDetails = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  const handleFocus = (index) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Latest Articles
      </Typography>
      <Grid container spacing={8} columns={12} sx={{ my: 4 }}>
        {currentArticles.map((article, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 1,
                height: '100%',
              }}
            >
              <Typography gutterBottom variant="caption" component="div">{article.tag}</Typography>
              <TitleTypography
                gutterBottom
                variant="h6"
                onFocus={() => handleFocus(index)}
                onBlur={handleBlur}
                tabIndex={0}
                className={focusedCardIndex === index ? 'Mui-focused' : ''}
              >{article.title}
              </TitleTypography>
              <Typography variant="body2" color="text.secondary">
                {article.publication_date}
              </Typography>
              <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                {article.summary}
              </StyledTypography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}