import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
    InputAdornment,
    TablePagination,
    Paper,
    Typography,
    CircularProgress,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Box
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
    handleGetVocabularyByUserId,
    handleAddVocabulary,
    handleDeleteVocabulary
} from "../../services/VocabularyServices";

const VocabularyTable = () => {
    const [vocabulary, setVocabulary] = useState([]);
    const [filteredVocabulary, setFilteredVocabulary] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("word");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [translations, setTranslations] = useState({});
    const [loading, setLoading] = useState(true);

    // CRUD state
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentVocab, setCurrentVocab] = useState(null);
    const [formData, setFormData] = useState({ word: "", article_id: "" });
    const [formError, setFormError] = useState("");

    const fetchVocabulary = async () => {
        setLoading(true);
        const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
        const user_id = userData.id;
        try {
            const response = await handleGetVocabularyByUserId(user_id);
            const vocabularyData = Array.isArray(response.data.data) ? response.data.data : [];
            setVocabulary(vocabularyData);
            setFilteredVocabulary(vocabularyData);

            // Translate each word and save to translations
            const newTranslations = { ...translations };
            for (const item of vocabularyData) {
                if (!newTranslations[item.word]) {
                    const meaning = await translateText(item.word);
                    newTranslations[item.word] = meaning;
                }
            }
            setTranslations(newTranslations);
        } catch (error) {
            console.error("Failed to fetch vocabulary data", error);
            setVocabulary([]);
            setFilteredVocabulary([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVocabulary();
        // eslint-disable-next-line
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        const filtered = vocabulary.filter((item) =>
            item.word.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredVocabulary(filtered);
    };

    const handleSort = (property) => {
        const isAscending = orderBy === property && order === "asc";
        setOrder(isAscending ? "desc" : "asc");
        setOrderBy(property);

        const sorted = [...filteredVocabulary].sort((a, b) => {
            if (isAscending) {
                return a[property] < b[property] ? -1 : 1;
            } else {
                return a[property] > b[property] ? -1 : 1;
            }
        });
        setFilteredVocabulary(sorted);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const translateText = async (text) => {
        if (!text) return "";
        try {
            const response = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
                    text
                )}&langpair=en|vi`
            );
            if (!response.ok) throw new Error("Failed to fetch translation");
            const data = await response.json();
            if (data.responseStatus !== 200) throw new Error("Translation API error: " + data.responseDetails);
            return data.responseData.translatedText;
        } catch (err) {
            return "Không thể dịch";
        }
    };

    // Form input change handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Add vocabulary handlers
    const handleOpenAddDialog = () => {
        setFormData({ word: "", article_id: "" });
        setFormError("");
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
    };

    const handleAddSubmit = async () => {
        if (!formData.word.trim()) {
            setFormError("Từ vựng không được để trống");
            return;
        }

        try {
            const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
            const newVocab = {
                user_id: userData.id,
                word: formData.word.trim(),
                article_id: formData.article_id || null
            };

            await handleAddVocabulary(newVocab);
            handleCloseAddDialog();
            // Refresh vocabulary list
            fetchVocabulary();
        } catch (error) {
            console.error("Failed to add vocabulary", error);
            setFormError("Không thể thêm từ vựng. Vui lòng thử lại.");
        }
    };

    // Edit vocabulary handlers
    const handleOpenEditDialog = (vocab) => {
        setCurrentVocab(vocab);
        setFormData({
            word: vocab.word,
            article_id: vocab.article_id || ""
        });
        setFormError("");
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };

    // Delete vocabulary handlers
    const handleOpenDeleteDialog = (vocab) => {
        setCurrentVocab(vocab);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleDeleteSubmit = async () => {
        try {
            await handleDeleteVocabulary(currentVocab.id);
            handleCloseDeleteDialog();
            // Refresh vocabulary list
            fetchVocabulary();
        } catch (error) {
            console.error("Failed to delete vocabulary", error);
        }
    };

    return (
        <Paper sx={{ padding: 2, marginTop: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography variant="h5">
                    Từ vựng của tôi
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddDialog}
                >
                    Thêm từ mới
                </Button>
            </Box>

            <TextField
                fullWidth
                placeholder="Tìm kiếm từ vựng..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                sx={{ marginBottom: 2 }}
            />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', padding: 3 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === "word"}
                                            direction={order}
                                            onClick={() => handleSort("word")}
                                        >
                                            Từ vựng
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>Nghĩa</TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === "created_at"}
                                            direction={order}
                                            onClick={() => handleSort("created_at")}
                                        >
                                            Ngày tạo
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>Bài báo</TableCell>
                                    <TableCell align="center">Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredVocabulary.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            Không có từ vựng nào
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredVocabulary
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((vocab) => (
                                            <TableRow key={vocab.id}>
                                                <TableCell>{vocab.word}</TableCell>
                                                <TableCell>
                                                    {translations[vocab.word] ||
                                                        <CircularProgress size={20} />
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(vocab.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>{vocab.article_id || "—"}</TableCell>
                                                <TableCell align="center">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => handleOpenEditDialog(vocab)}
                                                        size="small"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleOpenDeleteDialog(vocab)}
                                                        size="small"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredVocabulary.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Số hàng mỗi trang:"
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from}–${to} của ${count}`
                        }
                    />
                </>
            )}

            {/* Add Vocabulary Dialog */}
            <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Thêm từ vựng mới</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Nhập thông tin từ vựng bạn muốn thêm.
                    </DialogContentText>
                    {formError && (
                        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                            {formError}
                        </Typography>
                    )}
                    <TextField
                        autoFocus
                        margin="dense"
                        name="word"
                        label="Từ vựng"
                        type="text"
                        fullWidth
                        value={formData.word}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="article_id"
                        label="ID Bài báo"
                        type="text"
                        fullWidth
                        value={formData.article_id}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddDialog}>Hủy</Button>
                    <Button onClick={handleAddSubmit} color="primary" variant="contained">
                        Thêm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Vocabulary Dialog */}
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Chỉnh sửa từ vựng</DialogTitle>
                <DialogContent>
                    {formError && (
                        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                            {formError}
                        </Typography>
                    )}
                    <TextField
                        autoFocus
                        margin="dense"
                        name="word"
                        label="Từ vựng"
                        type="text"
                        fullWidth
                        value={formData.word}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="article_id"
                        label="ID Bài báo"
                        type="text"
                        fullWidth
                        value={formData.article_id}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog}>Xóa</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Vocabulary Dialog */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa từ vựng "{currentVocab?.word}" không?
                        Hành động này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
                    <Button onClick={handleDeleteSubmit} color="error" variant="contained">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default VocabularyTable;