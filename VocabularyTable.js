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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { handleGetVocabulary } from "../../services/VocabularyServices";

const VocabularyTable = () => {
    const [vocabulary, setVocabulary] = useState([]);
    const [filteredVocabulary, setFilteredVocabulary] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("word");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const fetchVocabulary = async () => {
            try {
                const response = await handleGetVocabulary();
                setVocabulary(response.data);
                setFilteredVocabulary(response.data);
            } catch (error) {
                console.error("Failed to fetch vocabulary data", error);
            }
        };
        fetchVocabulary();
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

    return (
        <Paper sx={{ padding: 2, marginTop: 3 }}>
            <Typography variant="h5" gutterBottom>
                Vocabulary Table
            </Typography>
            <TextField
                fullWidth
                placeholder="Search vocabulary..."
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
                                    Word
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "type"}
                                    direction={order}
                                    onClick={() => handleSort("type")}
                                >
                                    Type
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "dateAdded"}
                                    direction={order}
                                    onClick={() => handleSort("dateAdded")}
                                >
                                    Date Added
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Article</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredVocabulary
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((vocab, index) => (
                                <TableRow key={index}>
                                    <TableCell>{vocab.word}</TableCell>
                                    <TableCell>{vocab.type}</TableCell>
                                    <TableCell>{new Date(vocab.dateAdded).toLocaleDateString()}</TableCell>
                                    <TableCell>{vocab.article}</TableCell>
                                </TableRow>
                            ))}
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
            />
        </Paper>
    );
};

export default VocabularyTable;