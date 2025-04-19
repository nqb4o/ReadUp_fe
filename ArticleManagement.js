import React, { useState, useEffect } from "react";
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
import {
    fetchArticleApi,
    deleteArticleApi,
    createArticleWithImageApi,
    updateArticleWithImageApi,
} from "../../services/ArticleService";

const ArticleManagement = () => {
    const [articles, setArticles] = useState([]);
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
    });

    // Fetch articles from backend
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetchArticleApi();
                setArticles(response.data);
            } catch (error) {
                console.error("Error fetching articles:", error);
            }
        };
        fetchArticles();
    }, []);

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

    const handleSubmit = async () => {
        try {
            if (modalMode === "add") {
                const response = await createArticleWithImageApi(formData);
                setArticles([...articles, response.data]);
            } else if (modalMode === "edit") {
                const response = await updateArticleWithImageApi(formData.id, formData);
                setArticles(
                    articles.map((article) =>
                        article.id === formData.id ? response.data : article
                    )
                );
            }
            handleCloseModal();
        } catch (error) {
            console.error("Error submitting article:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteArticleApi(selectedArticle.id);
            setArticles(articles.filter((article) => article.id !== selectedArticle.id));
            handleMenuClose();
        } catch (error) {
            console.error("Error deleting article:", error);
        }
    };

    const handleDeleteSelected = async () => {
        try {
            await Promise.all(selected.map((id) => deleteArticleApi(id)));
            setArticles(articles.filter((article) => !selected.includes(article.id)));
            setSelected([]);
        } catch (error) {
            console.error("Error deleting selected articles:", error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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

                <TableContainer component={Paper}>
                    <Table stickyHeader>
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
                                        <TableCell>
                                            <IconButton
                                                onClick={(e) => handleMenuClick(e, article)}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
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
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        {modalMode === "add" ? "Add New Article" : "Edit Article"}
                    </Typography>
                    <TextField
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleFormChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Content"
                        name="content"
                        value={formData.content}
                        onChange={handleFormChange}
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                    />
                    <TextField
                        label="Publication Date"
                        name="publicationDate"
                        type="date"
                        value={formData.publicationDate}
                        onChange={handleFormChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button onClick={handleCloseModal} sx={{ mr: 2 }}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleSubmit}>
                            {modalMode === "add" ? "Add" : "Save"}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default ArticleManagement;