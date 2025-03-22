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
  Avatar,
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

const UserManagement = () => {
  const initialUsers = [
    {
      id: 1,
      username: "adam_trantow",
      email: "adam.trantow@example.com",
      role: "UI Designer",
      createdAt: "2023-01-15",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      username: "angel_rolfson",
      email: "angel.rolfson@example.com",
      role: "UI Designer",
      createdAt: "2023-02-20",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      id: 3,
      username: "betty_hammes",
      email: "betty.hammes@example.com",
      role: "UI Designer",
      createdAt: "2023-03-10",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      id: 4,
      username: "billy_braun",
      email: "billy.braun@example.com",
      role: "UI Designer",
      createdAt: "2023-04-05",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
      id: 5,
      username: "billy_stoltenberg",
      email: "billy.stoltenberg@example.com",
      role: "Leader",
      createdAt: "2023-05-12",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    },
  ];

  const [users, setUsers] = useState(initialUsers);
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
    username: "",
    email: "",
    role: "",
    createdAt: "",
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = () => {
    const isAsc = order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    const sortedUsers = [...filteredUsers].sort((a, b) =>
      isAsc
        ? b.username.localeCompare(a.username)
        : a.username.localeCompare(b.username)
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
      setFormData({ ...user });
      setAvatarPreview(user.avatar);
    } else {
      setFormData({
        username: "",
        email: "",
        role: "",
        createdAt: "",
        avatar: null,
      });
      setAvatarPreview(null);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setAvatarPreview(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (modalMode === "add") {
      const newUser = {
        ...formData,
        id: users.length + 1,
        avatar:
          avatarPreview ||
          formData.avatar ||
          "https://randomuser.me/api/portraits/lego/1.jpg",
      };
      setUsers([...users, newUser]);
    } else if (modalMode === "edit") {
      setUsers(
        users.map((user) =>
          user.id === formData.id
            ? { ...formData, avatar: avatarPreview || formData.avatar }
            : user
        )
      );
    }
    handleCloseModal();
  };

  const handleDelete = () => {
    setUsers(users.filter((user) => user.id !== selectedUser.id));
    handleMenuClose();
  };

  const handleDeleteSelected = () => {
    setUsers(users.filter((user) => !selected.includes(user.id)));
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
                  <TableSortLabel active direction={order} onClick={handleSort}>
                    Username
                  </TableSortLabel>
                </TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created At</TableCell>
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
                        <Avatar
                          src={user.avatar}
                          sx={{ width: 28, height: 28 }}
                        />
                        {user.username}
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => handleMenuClick(e, user)}
                        sx={{ border: "unset", backgroundColor: "transparent" }}
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
            name="username"
            value={formData.username}
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
            label="Role"
            name="role"
            value={formData.role}
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
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Avatar
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "center" },
                gap: 2,
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ flex: 1 }}
              />
              {avatarPreview && (
                <Avatar
                  src={avatarPreview}
                  sx={{ width: 56, height: 56, alignSelf: "center" }}
                />
              )}
            </Box>
          </Box>
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

export default UserManagement;
