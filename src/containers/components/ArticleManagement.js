import React, { useState, useEffect } from 'react';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Typography,
    Snackbar,
    Alert,
    CircularProgress,
    TablePagination,
    Collapse,
    Tooltip,
    Chip,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import {
    fetchArticleApi,
    createArticleApi,
    updateArticleApi,
    deleteArticleApi
} from '../../services/ArticleService';

const ArticleManagement = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [expandedRows, setExpandedRows] = useState({});
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
    });
    const [formErrors, setFormErrors] = useState({
        title: '',
        content: '',
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        const fetchArticlesData = async () => {
            try {
                setLoading(true);
                const response = await fetchArticleApi();
                setArticles(response.data);
            } catch (error) {
                showError(error.message || 'Không thể tải danh sách bài báo');
            } finally {
                setLoading(false);
            }
        };
        fetchArticlesData();
    }, []);

    const addArticle = async (articleData) => {
        try {
            setLoading(true);
            const response = await createArticleApi(articleData);
            const newArticle = response.data;
            setArticles((prevArticles) => [...prevArticles, newArticle]);
            showSuccess('Thêm bài báo thành công!');
            return true;
        } catch (error) {
            showError(error.message || 'Không thể thêm bài báo');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateArticle = async (id, articleData) => {
        try {
            setLoading(true);
            const response = await updateArticleApi(id, articleData);
            const updatedArticle = response.data;
            const updatedArticles = articles.map((article) =>
                article.id === id ? updatedArticle : article
            );
            setArticles(updatedArticles);
            showSuccess('Cập nhật bài báo thành công!');
            return true;
        } catch (error) {
            showError(error.message || 'Không thể cập nhật bài báo');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteArticle = async (id) => {
        try {
            setLoading(true);
            await deleteArticleApi(id);
            setArticles(articles.filter(article => article.id !== id));
            showSuccess('Xóa bài báo thành công!');
        } catch (error) {
            showError(error.message || 'Không thể xóa bài báo');
        } finally {
            setLoading(false);
        }
    };

    const showSuccess = (message) => {
        setSnackbar({
            open: true,
            message,
            severity: 'success'
        });
    };

    const showError = (message) => {
        setSnackbar({
            open: true,
            message,
            severity: 'error'
        });
    };

    const validateForm = () => {
        const errors = {
            title: '',
            content: '',
        };
        let isValid = true;

        if (!formData.title.trim()) {
            errors.title = 'Tên bài báo là bắt buộc';
            isValid = false;
        } else if (formData.title.trim().length < 5) {
            errors.title = 'Tên bài báo phải có ít nhất 5 ký tự';
            isValid = false;
        } else if (formData.title.trim().length > 100) {
            errors.title = 'Tên bài báo không được vượt quá 100 ký tự';
            isValid = false;
        }

        if (!formData.content.trim()) {
            errors.content = 'Nội dung bài báo là bắt buộc';
            isValid = false;
        } else if (formData.content.trim().length < 10) {
            errors.content = 'Nội dung bài báo phải có ít nhất 10 ký tự';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleAdd = () => {
        setEditMode(false);
        setFormData({
            title: '',
            content: '',
        });
        setFormErrors({
            title: '',
            content: '',
        });
        setOpen(true);
    };

    const handleEdit = (article) => {
        setEditMode(true);
        setSelectedArticle(article);
        setFormData({
            title: article.title,
            content: article.content,
        });
        setFormErrors({
            title: '',
            content: '',
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedArticle(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user types
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        const success = editMode
            ? await updateArticle(selectedArticle.id, formData)
            : await addArticle(formData);

        if (success) {
            handleClose();
        }
    };

    const handleDeleteClick = (article) => {
        setArticleToDelete(article);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (articleToDelete) {
            await deleteArticle(articleToDelete.id);
            setDeleteDialogOpen(false);
            setArticleToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setArticleToDelete(null);
    };

    const toggleRowExpand = (id) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const truncateText = (text, maxLength = 50) => {
        if (!text) return '';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    if (loading && !articles.length) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    // Apply pagination
    const paginatedArticles = articles.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" component="h1">
                    Quản lý bài báo
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                    disabled={loading}
                >
                    Thêm bài báo
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã bài báo</TableCell>
                            <TableCell>Tên bài báo</TableCell>
                            <TableCell>Nội dung bài báo</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedArticles.map((article) => (
                            <React.Fragment key={article.id}>
                                <TableRow>
                                    <TableCell>{article.id}</TableCell>
                                    <TableCell>{article.title}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {truncateText(article.content)}
                                            <IconButton
                                                size="small"
                                                onClick={() => toggleRowExpand(article.id)}
                                            >
                                                {expandedRows[article.id] ?
                                                    <ExpandLessIcon fontSize="small" /> :
                                                    <ExpandMoreIcon fontSize="small" />
                                                }
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Chỉnh sửa">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleEdit(article)}
                                                disabled={loading}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Xóa">
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteClick(article)}
                                                disabled={loading}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell
                                        style={{ paddingBottom: 0, paddingTop: 0 }}
                                        colSpan={4}
                                    >
                                        <Collapse
                                            in={expandedRows[article.id]}
                                            timeout="auto"
                                            unmountOnExit
                                        >
                                            <Box sx={{ margin: 1, padding: 2, backgroundColor: '#f5f5f5' }}>
                                                <Typography variant="h6" gutterBottom component="div">
                                                    Nội dung đầy đủ
                                                </Typography>
                                                <Typography>
                                                    {article.content}
                                                </Typography>
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={articles.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Số hàng mỗi trang:"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} của ${count}`
                    }
                />
            </TableContainer>

            {/* Add/Edit Article Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                disableEscapeKeyDown={loading}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    {editMode ? 'Chỉnh sửa bài báo' : 'Thêm bài báo mới'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            name="title"
                            label="Tên bài báo"
                            fullWidth
                            required
                            value={formData.title}
                            onChange={handleChange}
                            disabled={loading}
                            error={!!formErrors.title}
                            helperText={formErrors.title}
                            inputProps={{ maxLength: 100 }}
                        />
                        <TextField
                            name="content"
                            label="Nội dung"
                            fullWidth
                            required
                            multiline
                            rows={4}
                            value={formData.content}
                            onChange={handleChange}
                            disabled={loading}
                            error={!!formErrors.content}
                            helperText={formErrors.content}
                        />
                        <Box sx={{ mt: 1 }}>
                            <Chip
                                label={`Độ dài tiêu đề: ${formData.title.length}/100`}
                                size="small"
                                color={formData.title.length > 0 && formData.title.length < 5 ? "error" : "default"}
                                sx={{ mr: 1 }}
                            />
                            <Chip
                                label={`Độ dài nội dung: ${formData.content.length}`}
                                size="small"
                                color={formData.content.length > 0 && formData.content.length < 10 ? "error" : "default"}
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>Hủy</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} />
                        ) : (
                            editMode ? 'Cập nhật' : 'Thêm'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa bài báo "{articleToDelete?.title}"?
                    </Typography>
                    <Typography color="error" sx={{ mt: 2 }}>
                        Lưu ý: Hành động này không thể hoàn tác.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Hủy</Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        color="error"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Xóa'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ArticleManagement;