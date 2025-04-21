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
    Grid,
} from "@mui/material";
import {
    Add,
    Edit,
    Delete,
    MoreVert as MoreVertIcon,
    Search as SearchIcon,
    FileUpload as FileUploadIcon,
} from "@mui/icons-material";
import { parse } from "papaparse"; // For CSV file handling
import {
    getAllQuizQuestions,
    createQuizQuestion,
    updateQuizQuestion,
    deleteQuizQuestion
} from "../../services/QuizService";

const QuizManagement = () => {
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("question");
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [formData, setFormData] = useState({
        question: "",
        correct_question: "",
        wrong1: "",
        wrong2: "",
        wrong3: "",
    });

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // Fetch quiz questions from backend
    useEffect(() => {
        const fetchQuizQuestions = async () => {
            try {
                // Use the imported getAllQuizQuestions function instead of getQuizQuestionApi
                const response = await getAllQuizQuestions();
                setQuizQuestions(response.data);
            } catch (error) {
                console.error("Error fetching quiz questions:", error);
            }
        };
        fetchQuizQuestions();
    }, []);

    const filteredQuestions = quizQuestions.filter((question) =>
        (question.question || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);

        const sortedQuestions = [...filteredQuestions].sort((a, b) => {
            if (property === "vocabulary_id") {
                return isAsc
                    ? b[property] - a[property]
                    : a[property] - b[property];
            } else {
                return isAsc
                    ? b[property].localeCompare(a[property])
                    : a[property].localeCompare(b[property]);
            }
        });

        setQuizQuestions(sortedQuestions);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelected(filteredQuestions.map((question) => question.id));
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

    const handleMenuClick = (event, question) => {
        setAnchorEl(event.currentTarget);
        setSelectedQuestion(question);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedQuestion(null);
    };

    const handleOpenModal = (mode, question = null) => {
        setModalMode(mode);
        if (mode === "edit" && question) {
            setFormData({
                id: question.id,
                question: question.question,
                correct_answer: question.correct_answer,
                wrong1: question.wrong1,
                wrong2: question.wrong2,
                wrong3: question.wrong3,
            });
        } else {
            setFormData({
                question: "",
                correct_answer: "",
                wrong1: "",
                wrong2: "",
                wrong3: "",
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
                // Use the imported createQuizQuestion function
                const response = await createQuizQuestion(formData);
                setQuizQuestions([...quizQuestions, response.data]);
            } else if (modalMode === "edit") {
                // Use the imported updateQuizQuestion function
                const response = await updateQuizQuestion(formData.id, formData);
                setQuizQuestions(
                    quizQuestions.map((question) =>
                        question.id === formData.id ? response.data : question
                    )
                );
            }
            handleCloseModal();
        } catch (error) {
            console.error("Error submitting quiz question:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteQuizQuestion(selectedQuestion.id);
            setQuizQuestions(quizQuestions.filter((question) => question.id !== selectedQuestion.id));
            handleMenuClose();
        } catch (error) {
            console.error("Error deleting quiz question:", error);
        }
    };

    const handleDeleteSelected = async () => {
        try {
            // Use the imported deleteQuizQuestion function for each selected question
            await Promise.all(selected.map((id) => deleteQuizQuestion(id)));
            setQuizQuestions(quizQuestions.filter((question) => !selected.includes(question.id)));
            setSelected([]);
        } catch (error) {
            console.error("Error deleting selected quiz questions:", error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleUploadCsv = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const { data } = parse(text, { header: true });

            // Filter valid data from CSV file
            const validQuestions = data.map((row) => ({
                question: row.question || row.Question || "",
                correct_answer: row.correct_answer || row.CorrectAnswer || "",
                wrong1: row.wrong1 || row.WrongAnswer1 || "",
                wrong2: row.wrong2 || row.WrongAnswer2 || "",
                wrong3: row.wrong3 || row.WrongAnswer3 || "",
            })).filter(
                (question) => question.question && question.correct_answer &&
                    question.wrong1 && question.wrong2 && question.wrong3
            );

            console.log("Valid questions to upload:", validQuestions);

            // Send each valid question to the API using the imported createQuizQuestion function
            const responses = await Promise.all(
                validQuestions.map((question) => createQuizQuestion(question))
            );

            // Update the questions list
            setQuizQuestions([...quizQuestions, ...responses.map((res) => res.data)]);
            alert("Quiz questions added successfully!");
        } catch (error) {
            console.error("Error uploading CSV:", error);
            alert("Failed to upload quiz questions from CSV.");
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h5" component="h1" sx={{ fontWeight: "bold" }}>
                    Quiz Management
                </Typography>
                <Box>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleOpenModal("add")}
                        sx={{ mr: 2 }}
                    >
                        New Question
                    </Button>
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<FileUploadIcon />}
                    >
                        Upload CSV
                        <input
                            type="file"
                            accept=".csv"
                            hidden
                            onChange={handleUploadCsv}
                        />
                    </Button>
                </Box>
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
                    placeholder="Search questions..."
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

                <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={
                                            selected.length > 0 &&
                                            selected.length < filteredQuestions.length
                                        }
                                        checked={
                                            filteredQuestions.length > 0 &&
                                            selected.length === filteredQuestions.length
                                        }
                                        onChange={handleSelectAllClick}
                                    />
                                </TableCell>
                                {/* XÓA CỘT Vocabulary ID */}
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === "question"}
                                        direction={orderBy === "question" ? order : "asc"}
                                        onClick={() => handleSort("question")}
                                    >
                                        Question
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Correct Answer</TableCell>
                                <TableCell>Wrong Answers</TableCell>
                                <TableCell>Date Created</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredQuestions
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((question) => (
                                    <TableRow key={question.id} hover>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selected.indexOf(question.id) !== -1}
                                                onChange={() => handleSelectClick(question.id)}
                                            />
                                        </TableCell>
                                        {/* XÓA CELL vocabulary_id */}
                                        <TableCell>
                                            {question.question.length > 50
                                                ? `${question.question.substring(0, 50)}...`
                                                : question.question}
                                        </TableCell>
                                        <TableCell>
                                            {question.correct_answer && question.correct_answer.length > 30
                                                ? `${question.correct_answer.substring(0, 30)}...`
                                                : question.correct_answer}
                                        </TableCell>
                                        <TableCell>
                                            {`1. ${question.wrong1?.substring(0, 15) ?? ""}${question.wrong1?.length > 15 ? '...' : ''}`} <br />
                                            {`2. ${question.wrong2?.substring(0, 15) ?? ""}${question.wrong2?.length > 15 ? '...' : ''}`} <br />
                                            {`3. ${question.wrong3?.substring(0, 15) ?? ""}${question.wrong3?.length > 15 ? '...' : ''}`}
                                        </TableCell>
                                        <TableCell>{formatDate(question.created_at)}</TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                onClick={(e) => handleMenuClick(e, question)}
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
                count={filteredQuestions.length}
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
                <MenuItem onClick={() => handleOpenModal("edit", selectedQuestion)}>
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
                        width: { xs: "90%", sm: 600 },
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        maxHeight: "90vh",
                        overflow: "auto"
                    }}
                >
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                        {modalMode === "add" ? "Add New Quiz Question" : "Edit Quiz Question"}
                    </Typography>
                    <Grid container spacing={2}>
                        {/* XÓA GRID Vocabulary ID */}
                        <Grid item xs={12}>
                            <TextField
                                label="Question"
                                name="question"
                                value={formData.question}
                                onChange={handleFormChange}
                                fullWidth
                                multiline
                                rows={2}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Correct Answer"
                                name="correct_answer"
                                value={formData.correct_answer}
                                onChange={handleFormChange}
                                fullWidth
                                multiline
                                rows={2}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>
                                Wrong Answers
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Wrong Answer 1"
                                name="wrong1"
                                value={formData.wrong1}
                                onChange={handleFormChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Wrong Answer 2"
                                name="wrong2"
                                value={formData.wrong2}
                                onChange={handleFormChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Wrong Answer 3"
                                name="wrong3"
                                value={formData.wrong3}
                                onChange={handleFormChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
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

export default QuizManagement;