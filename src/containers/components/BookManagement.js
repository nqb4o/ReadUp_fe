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
    Rating
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
    fetchBookApi,
    createBookApi,
    updateBookApi,
    deleteBookApi
} from '../../services/BookService';

const BookManagement = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        author_last_name: '',
        author_first_name: '',
        rating: ''
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        const fetchBooksData = async () => {
            try {
                setLoading(true);
                const response = await fetchBookApi();
                setBooks(response.data);
            } catch (error) {
                showError(error.message || 'Không thể tải danh sách sách');
            } finally {
                setLoading(false);
            }
        };
        fetchBooksData();
    }, []);

    const addBook = async (bookData) => {
        try {
            setLoading(true);
            const response = await createBookApi(bookData);
            const newBook = response.data;
            setBooks((prevBooks) => [...prevBooks, newBook]);
            showSuccess('Thêm sách thành công!');
            return true;
        } catch (error) {
            showError(error.message || 'Không thể thêm sách');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateBook = async (id, bookData) => {
        try {
            setLoading(true);
            const response = await updateBookApi(id, bookData);
            const updatedBook = response.data;
            const updatedBooks = books.map((book) =>
                book.book_id === id ? { ...book, ...updatedBook } : book
            );
            setBooks(updatedBooks);
            showSuccess('Cập nhật sách thành công!');
            return true;
        } catch (error) {
            showError(error.message || 'Không thể cập nhật sách');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteBook = async (id) => {
        try {
            setLoading(true);
            await deleteBookApi(id);
            setBooks(books.filter(book => book.book_id !== id));
            showSuccess('Xóa sách thành công!');
        } catch (error) {
            showError(error.message || 'Không thể xóa sách');
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

    const handleAdd = () => {
        setEditMode(false);
        setFormData({
            title: '',
            author_last_name: '',
            author_first_name: '',
            rating: ''
        });
        setOpen(true);
    };

    const handleEdit = (book) => {
        setEditMode(true);
        setSelectedBook(book);
        setFormData({
            book_id: book.book_id,
            title: book.title,
            author_last_name: book.author_last_name,
            author_first_name: book.author_first_name,
            rating: book.rating
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedBook(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRatingChange = (newValue) => {
        setFormData(prev => ({
            ...prev,
            rating: newValue
        }));
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.title || !formData.author_last_name) {
            showError('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        if (formData.rating && (formData.rating < 1 || formData.rating > 10)) {
            showError('Đánh giá phải từ 1 đến 10');
            return;
        }

        const success = editMode
            ? await updateBook(selectedBook.book_id, formData)
            : await addBook(formData);

        if (success) {
            handleClose();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sách này?')) {
            await deleteBook(id);
        }
    };

    if (loading && !books.length) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" component="h1">
                    Quản lý sách
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                    disabled={loading}
                >
                    Thêm sách
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã sách</TableCell>
                            <TableCell>Tên sách</TableCell>
                            <TableCell>Họ tác giả</TableCell>
                            <TableCell>Tên tác giả</TableCell>
                            <TableCell>Đánh giá</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books.map((book) => (
                            <TableRow key={book.book_id}>
                                <TableCell>{book.book_id}</TableCell>
                                <TableCell>{book.title}</TableCell>
                                <TableCell>{book.author_last_name}</TableCell>
                                <TableCell>{book.author_first_name || '-'}</TableCell>
                                <TableCell>
                                    {book.rating ? ` ${book.rating}` : ' Chưa đánh giá'}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleEdit(book)}
                                        disabled={loading}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(book.book_id)}
                                        disabled={loading}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={open}
                onClose={handleClose}
                disableEscapeKeyDown={loading}
            >
                <DialogTitle>
                    {editMode ? 'Chỉnh sửa sách' : 'Thêm sách mới'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            name="title"
                            label="Tên sách"
                            fullWidth
                            required
                            value={formData.title}
                            onChange={handleChange}
                            disabled={loading}
                            error={!formData.title}
                            helperText={!formData.title && "Tên sách là bắt buộc"}
                        />
                        <TextField
                            name="author_last_name"
                            label="Họ tác giả"
                            fullWidth
                            required
                            value={formData.author_last_name}
                            onChange={handleChange}
                            disabled={loading}
                            error={!formData.author_last_name}
                            helperText={!formData.author_last_name && "Họ tác giả là bắt buộc"}
                        />
                        <TextField
                            name="author_first_name"
                            label="Tên tác giả"
                            fullWidth
                            value={formData.author_first_name}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <Box>
                            <Typography component="legend">Đánh giá</Typography>
                            <Rating
                                name="rating"
                                value={parseFloat(formData.rating) || null}
                                max={10}
                                precision={0.1}
                                onChange={(event, newValue) => handleRatingChange(newValue)}
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
        </Box >
    );
};

export default BookManagement;