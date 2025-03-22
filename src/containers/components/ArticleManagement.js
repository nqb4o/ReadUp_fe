import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  TablePagination,
  InputAdornment,
  Typography,
  Modal,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const ArticleManagement = () => {
  const initialArticles = [
    {
      id: 1,
      title: "Introduction to UI Design",
      content: "Learn the basics of UI design and its principles.",
      publicationDate: "2023-01-20",
      createdAt: "2023-01-15",
      updatedAt: "2023-01-18",
    },
    {
      id: 2,
      title: "Advanced React Techniques",
      content: "Explore advanced techniques in React development.",
      publicationDate: "2023-02-25",
      createdAt: "2023-02-20",
      updatedAt: "2023-02-22",
    },
    {
      id: 3,
      title: "CSS Grid vs Flexbox",
      content:
        "A comparison of CSS Grid and Flexbox for layouts. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
      publicationDate: "2023-03-15",
      createdAt: "2023-03-10",
      updatedAt: "2023-03-12",
    },
    {
      id: 4,
      title: "JavaScript Best Practices",
      content: "Best practices for writing clean JavaScript code.",
      publicationDate: "2023-04-10",
      createdAt: "2023-04-05",
      updatedAt: "2023-04-08",
    },
    {
      id: 5,
      title: "Building Scalable Apps",
      content: "Tips for building scalable web applications.",
      publicationDate: "2023-05-15",
      createdAt: "2023-05-12",
      updatedAt: "2023-05-14",
    },
  ];

  const [articles, setArticles] = useState(initialArticles);
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    publicationDate: "",
    createdAt: "",
    updatedAt: "",
  });

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = () => {
    const isAsc = order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    const sortedArticles = [...filteredArticles].sort((a, b) =>
      isAsc ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title)
    );
    setArticles(sortedArticles);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(filteredArticles.map((article) => article.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else if (selectedIndex === 0) {
      newSelected = selected.slice(1);
    } else if (selectedIndex === selected.length - 1) {
      newSelected = selected.slice(0, -1);
    } else if (selectedIndex > 0) {
      newSelected = [
        ...selected.slice(0, selectedIndex),
        ...selected.slice(selectedIndex + 1),
      ];
    }

    setSelected(newSelected);
  };

  const handleMenuClick = (event, article) => {
    setAnchorEl(event.currentTarget);
    setSelectedArticle(article);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedArticle(null);
  };

  const handleOpenModal = (mode, article = null) => {
    setModalMode(mode);
    if (mode === "edit" && article) {
      setFormData({ ...article });
    } else {
      setFormData({
        title: "",
        content: "",
        publicationDate: "",
        createdAt: "",
        updatedAt: "",
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (modalMode === "add") {
      const newArticle = {
        ...formData,
        id: articles.length + 1,
      };
      setArticles([...articles, newArticle]);
    } else if (modalMode === "edit") {
      setArticles(
        articles.map((article) =>
          article.id === formData.id ? { ...formData } : article
        )
      );
    }
    handleCloseModal();
  };

  const handleDelete = () => {
    setArticles(
      articles.filter((article) => article.id !== selectedArticle.id)
    );
    handleMenuClose();
  };

  const handleDeleteSelected = () => {
    setArticles(articles.filter((article) => !selected.includes(article.id)));
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rowHeight = 70;
  const headerHeight = 56;
  const tableHeight = headerHeight + rowHeight * rowsPerPage;

  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" component="h1">
          Articles
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenModal("add")}
        >
          New article
        </Button>
      </Box>

      {selected.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#e3f2fd",
            p: 1,
            mb: 2,
            borderRadius: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#1976d2", fontWeight: "medium" }}
          >
            {selected.length} selected
          </Typography>
          <IconButton onClick={handleDeleteSelected}>
            <Delete sx={{ color: "#1976d2" }} />
          </IconButton>
        </Box>
      )}

      <Box
        sx={{
          borderRadius: 2,
          backgroundColor: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          p: 2,
        }}
      >
        <TextField
          placeholder="Search article..."
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "none",
            height: tableHeight,
            backgroundColor: "#fff",
            overflowX: "auto",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "6px",
              height: "6px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "#555",
              },
            },
            scrollbarWidth: "thin",
            scrollbarColor: "#888 #f1f1f1",
            [(theme) => theme.breakpoints.down("sm")]: {
              height: "auto",
            },
          }}
        >
          <Table stickyHeader sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 &&
                      selected.length < filteredArticles.length
                    }
                    checked={
                      filteredArticles.length > 0 &&
                      selected.length === filteredArticles.length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>
                  <TableSortLabel active direction={order} onClick={handleSort}>
                    Title
                  </TableSortLabel>
                </TableCell>
                <TableCell>Content</TableCell>
                <TableCell>Publication Date</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredArticles
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((article) => (
                  <TableRow key={article.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.indexOf(article.id) !== -1}
                        onChange={() => handleSelectClick(article.id)}
                      />
                    </TableCell>
                    <TableCell>{article.title}</TableCell>
                    <TableCell>
                      {article.content.length > 50
                        ? `${article.content.substring(0, 50)}...`
                        : article.content}
                    </TableCell>
                    <TableCell>{article.publicationDate}</TableCell>
                    <TableCell>{article.createdAt}</TableCell>
                    <TableCell>{article.updatedAt}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => handleMenuClick(e, article)}
                        sx={{ border: "unset", backgroundColor: "transparent" }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredArticles.length > 0 &&
                filteredArticles.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                ).length < rowsPerPage &&
                Array.from(
                  {
                    length:
                      rowsPerPage -
                      filteredArticles.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      ).length,
                  },
                  (_, index) => (
                    <TableRow
                      key={`empty-${index}`}
                      style={{ height: rowHeight }}
                    >
                      <TableCell colSpan={7} />
                    </TableRow>
                  )
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredArticles.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => handleOpenModal("edit", selectedArticle)}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "#d32f2f" }}>
          <Delete sx={{ mr: 1, color: "#d32f2f" }} /> Delete
        </MenuItem>
      </Menu>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            maxHeight: "90vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: { xs: 2, sm: 4 },
            borderRadius: 2,
            overflowY: "auto",
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            {modalMode === "add" ? "Add New Article" : "Edit Article"}
          </Typography>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "grey.400" },
                "&:hover fieldset": { borderColor: "grey.600" },
                "&.Mui-focused fieldset": {
                  borderColor: "grey.400",
                  boxShadow: "none",
                },
              },
              "& .MuiInputLabel-root": { color: "grey.600" },
              "& .MuiInputLabel-root.Mui-focused": { color: "grey.600" },
            }}
          />
          <TextField
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleFormChange}
            fullWidth
            multiline
            margin="normal"
            variant="outlined"
            maxRows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                minHeight: "100px",
                alignItems: "flex-start",
                "& textarea": {
                  paddingTop: "0px",
                },
                "& fieldset": { borderColor: "grey.400" },
                "&:hover fieldset": { borderColor: "grey.600" },
                "&.Mui-focused fieldset": {
                  borderColor: "grey.400",
                  boxShadow: "none",
                },
              },
              "& .MuiInputLabel-root": { color: "grey.600" },
              "& .MuiInputLabel-root.Mui-focused": { color: "grey.600" },
            }}
          />
          <TextField
            label="Publication Date"
            name="publicationDate"
            type="date"
            value={formData.publicationDate}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "grey.400" },
                "&:hover fieldset": { borderColor: "grey.600" },
                "&.Mui-focused fieldset": {
                  borderColor: "grey.400",
                  boxShadow: "none",
                },
              },
              "& .MuiInputLabel-root": { color: "grey.600" },
              "& .MuiInputLabel-root.Mui-focused": { color: "grey.600" },
            }}
          />
          <TextField
            label="Created At"
            name="createdAt"
            type="date"
            value={formData.createdAt}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "grey.400" },
                "&:hover fieldset": { borderColor: "grey.600" },
                "&.Mui-focused fieldset": {
                  borderColor: "grey.400",
                  boxShadow: "none",
                },
              },
              "& .MuiInputLabel-root": { color: "grey.600" },
              "& .MuiInputLabel-root.Mui-focused": { color: "grey.600" },
            }}
          />
          <TextField
            label="Updated At"
            name="updatedAt"
            type="date"
            value={formData.updatedAt}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "grey.400" },
                "&:hover fieldset": { borderColor: "grey.600" },
                "&.Mui-focused fieldset": {
                  borderColor: "grey.400",
                  boxShadow: "none",
                },
              },
              "& .MuiInputLabel-root": { color: "grey.600" },
              "& .MuiInputLabel-root.Mui-focused": { color: "grey.600" },
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 3,
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Button
              variant="outlined"
              onClick={handleCloseModal}
              fullWidth={window.innerWidth < 600}
            >
              Close
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              fullWidth={window.innerWidth < 600}
            >
              {modalMode === "add" ? "Add" : "Edit"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ArticleManagement;
