import React, { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RssFeedRoundedIcon from "@mui/icons-material/RssFeedRounded";

export function Search({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value); // Gọi hàm tìm kiếm từ parent
  };

  return (
    <FormControl sx={{ width: { xs: "100%", md: "25ch" } }} variant="outlined">
      <OutlinedInput
        size="small"
        id="search"
        placeholder="Search…"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ flexGrow: 1 }}
        startAdornment={
          <InputAdornment position="start" sx={{ color: "text.primary" }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        inputProps={{
          "aria-label": "search",
        }}
      />
    </FormControl>
  );
}

export default function MainContent({ onTagSelect, onSearch }) {
  const [selectedTag, setSelectedTag] = useState("All categories");

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    onTagSelect(tag); // Truyền tag được chọn lên parent
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div>
        <Typography variant="h1" gutterBottom>
          ReadUp
        </Typography>
        <Typography>
          AI-integrated English learning application helps shopping and reading effectively
        </Typography>
      </div>
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          flexDirection: "row",
          gap: 1,
          width: { xs: "100%", md: "fit-content" },
          overflow: "auto",
        }}
      >
        <Search onSearch={onSearch} />
        <IconButton size="small" aria-label="RSS feed">
          <RssFeedRoundedIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          width: "100%",
          justifyContent: "space-between",
          alignItems: { xs: "start", md: "center" },
          gap: 4,
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "row",
            gap: 3,
            overflow: "auto",
          }}
        >
          <Chip
            onClick={() => handleTagClick("All categories")}
            size="medium"
            label="All categories"
            sx={{
              border: selectedTag === "All categories" ? "1px solid" : "none",
              backgroundColor: "transparent",
            }}
          />
          <Chip
            onClick={() => handleTagClick("Family")}
            size="medium"
            label="Family"
            sx={{
              border: selectedTag === "Family" ? "1px solid" : "none",
              backgroundColor: "transparent",
            }}
          />
          <Chip
            onClick={() => handleTagClick("Travel")}
            size="medium"
            label="Travel"
            sx={{
              border: selectedTag === "Travel" ? "1px solid" : "none",
              backgroundColor: "transparent",
            }}
          />
          <Chip
            onClick={() => handleTagClick("Technology")}
            size="medium"
            label="Technology"
            sx={{
              border: selectedTag === "Technology" ? "1px solid" : "none",
              backgroundColor: "transparent",
            }}
          />
          <Chip
            onClick={() => handleTagClick("Food")}
            size="medium"
            label="Food"
            sx={{
              border: selectedTag === "Food" ? "1px solid" : "none",
              backgroundColor: "transparent",
            }}
          />
          <Chip
            onClick={() => handleTagClick("Health")}
            size="medium"
            label="Health"
            sx={{
              border: selectedTag === "Health" ? "1px solid" : "none",
              backgroundColor: "transparent",
            }}
          />
          <Chip
            onClick={() => handleTagClick("Flora and fauna")}
            size="medium"
            label="Flora and fauna"
            sx={{
              border: selectedTag === "Flora and fauna" ? "1px solid" : "none",
              backgroundColor: "transparent",
            }}
          />
        </Box>
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "row",
            gap: 1,
            width: { xs: "100%", md: "fit-content" },
            overflow: "auto",
          }}
        >
          <Search onSearch={onSearch} />
          <IconButton size="small" aria-label="RSS feed">
            <RssFeedRoundedIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}