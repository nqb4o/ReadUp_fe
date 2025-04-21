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
    CircularProgress,
    Snackbar,
    Alert,
    FormControl, FormLabel, RadioGroup, FormControlLabel, Radio
} from "@mui/material";
import {
    Add,
    Edit,
    Delete,
    MoreVert as MoreVertIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
} from "../../services/UserService";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [isFetchingUsers, setIsFetchingUsers] = useState(false);
    const [userFetchError, setUserFetchError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [order, setOrder] = useState("asc");
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsFetchingUsers(true);
        try {
            const response = await getAllUsers();
            const fetchedUsers = response.data.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            }));
            setUsers(fetchedUsers);
            setUserFetchError(null);
        } catch (err) {
            setUserFetchError("Không thể tải người dùng. Vui lòng thử lại sau.");
            setUsers([]);
            showSnackbar("Failed to fetch users", "error");
        } finally {
            setIsFetchingUsers(false);
        }
    };

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSort = () => {
        const isAsc = order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        const sortedUsers = [...filteredUsers].sort((a, b) =>
            isAsc ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
        );
        setUsers(sortedUsers);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelected(filteredUsers.map((user) => user.id));
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

    const handleMenuClick = (event, user) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedUser(null);
    };

    const handleOpenModal = (mode, user = null) => {
        setModalMode(mode);
        if (mode === "edit" && user) {
            setFormData({
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                role: user.role,
            });
        } else {
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "",
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
        setIsSubmitting(true);
        try {
            if (modalMode === "add") {
                const response = await createUser(formData);
                const newUser = {
                    id: response.data.id,
                    name: response.data.name,
                    email: response.data.email,
                    password: response.data.password,
                    role: response.data.role,
                };
                setUsers([...users, newUser]);
                showSnackbar("User created successfully");
            } else if (modalMode === "edit") {
                await updateUser(formData.id, formData);
                setUsers(
                    users.map((user) =>
                        user.id === formData.id ? { ...formData } : user
                    )
                );
                showSnackbar("User updated successfully");
            }
            handleCloseModal();
        } catch (err) {
            showSnackbar(
                `Failed to ${modalMode === "add" ? "create" : "update"} user`,
                "error"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteUser(selectedUser.id);
            setUsers(users.filter((user) => user.id !== selectedUser.id));
            showSnackbar("User deleted successfully");
        } catch (err) {
            showSnackbar("Failed to delete user", "error");
        } finally {
            handleMenuClose();
        }
    };

    const handleDeleteSelected = async () => {
        try {
            // Delete multiple users in parallel
            await Promise.all(selected.map((id) => deleteUser(id)));
            setUsers(users.filter((user) => !selected.includes(user.id)));
            setSelected([]);
            showSnackbar("Selected users deleted successfully");
        } catch (err) {
            showSnackbar("Failed to delete selected users", "error");
        }
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
                    Users
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenModal("add")}
                >
                    New user
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
                    placeholder="Search user..."
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

                {isFetchingUsers ? (
                    <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : userFetchError ? (
                    <Typography color="error" textAlign="center" sx={{ my: 4 }}>
                        {userFetchError}
                    </Typography>
                ) : users.length === 0 ? (
                    <Typography textAlign="center" sx={{ my: 4, color: "#666" }}>
                        Không có người dùng nào được tìm thấy.
                    </Typography>
                ) : (
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
                        <Table stickyHeader sx={{ minWidth: 600 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={
                                                selected.length > 0 &&
                                                selected.length < filteredUsers.length
                                            }
                                            checked={
                                                filteredUsers.length > 0 &&
                                                selected.length === filteredUsers.length
                                            }
                                            onChange={handleSelectAllClick}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active
                                            direction={order}
                                            onClick={handleSort}
                                        >
                                            Tên người dùng
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Vai trò</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((user) => (
                                        <TableRow key={user.id} hover>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={selected.indexOf(user.id) !== -1}
                                                    onChange={() => handleSelectClick(user.id)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                                                >
                                                    {user.name}
                                                </Box>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.role}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    onClick={(e) => handleMenuClick(e, user)}
                                                    sx={{
                                                        border: "unset",
                                                        backgroundColor: "transparent",
                                                    }}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                {filteredUsers.length > 0 &&
                                    filteredUsers.slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    ).length < rowsPerPage &&
                                    Array.from(
                                        {
                                            length:
                                                rowsPerPage -
                                                filteredUsers.slice(
                                                    page * rowsPerPage,
                                                    page * rowsPerPage + rowsPerPage
                                                ).length,
                                        },
                                        (_, index) => (
                                            <TableRow
                                                key={`empty-${index}`}
                                                style={{ height: rowHeight }}
                                            >
                                                <TableCell colSpan={6} />
                                            </TableRow>
                                        )
                                    )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredUsers.length}
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
                <MenuItem onClick={() => handleOpenModal("edit", selectedUser)}>
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
                        {modalMode === "add" ? "Add New User" : "Edit User"}
                    </Typography>
                    <TextField
                        label="Username"
                        name="name"
                        value={formData.name}
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
                        label="Email"
                        name="email"
                        value={formData.email}
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
                        label="Password"
                        name="password"
                        value={formData.password}
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
                    <FormControl
                        component="fieldset"
                        fullWidth
                        margin="normal"
                        sx={{
                            "& .MuiFormLabel-root": { color: "grey.600" },
                            "& .MuiFormLabel-root.Mui-focused": { color: "grey.600" },
                        }}
                    >
                        <FormLabel component="legend">Role</FormLabel>
                        <RadioGroup
                            name="role"
                            value={formData.role}
                            onChange={handleFormChange}
                            row
                        >
                            <FormControlLabel
                                value="admin"
                                control={
                                    <Radio
                                        sx={{
                                            color: "grey.400",
                                            '&.Mui-checked': {
                                                color: "grey.600",
                                            },
                                        }}
                                    />
                                }
                                label="Admin"
                            />
                            <FormControlLabel
                                value="user"
                                control={
                                    <Radio
                                        sx={{
                                            color: "grey.400",
                                            '&.Mui-checked': {
                                                color: "grey.600",
                                            },
                                        }}
                                    />
                                }
                                label="User"
                            />
                        </RadioGroup>
                    </FormControl>
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
                            disabled={isSubmitting}
                        >
                            Close
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            fullWidth={window.innerWidth < 600}
                            disabled={isSubmitting}
                            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                        >
                            {modalMode === "add" ? "Add" : "Save"}
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UserManagement;