import React, { useState, useEffect, useCallback } from "react";
import Table from '@mui/joy/Table'
import {
    TableContainer,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    Box,
    Typography
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Save as SaveIcon,
    NavigateBefore,
    NavigateNext
} from '@mui/icons-material';
import Header from './Header'

const EditableCell = ({ value, onSave, isEditing, subject }) => {
    const [editedName, setEditedName] = useState(subject?.subject_name || '');
    const [editedCode, setEditedCode] = useState(subject?.subject_code || '');

    if (!isEditing) {
        return (
            <Box sx={{ minHeight: '60px', p: 1 }}>
                {subject && (
                    <>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {subject.subject_name}
                        </Typography>
                        <Typography variant="body2">({subject.subject_code})</Typography>
                    </>
                )}
            </Box>
        );
    }

    return (
        <Box sx={{ p: 1 }}>
            <TextField
                fullWidth
                size="small"
                label="Subject Name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                margin="dense"
            />
            <TextField
                fullWidth
                size="small"
                label="Subject Code"
                value={editedCode}
                onChange={(e) => setEditedCode(e.target.value)}
                margin="dense"
            />
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                <Button
                    size="small"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={() => onSave({
                        subject_name: editedName,
                        subject_code: editedCode,
                        date: subject?.date
                    })}
                >
                    Save
                </Button>
                <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => onSave(null)}
                >
                    Delete
                </Button>
            </Box>
        </Box>
    );
};

function Calendar() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentWeek, setCurrentWeek] = useState(null);
    const [editingCell, setEditingCell] = useState(null);

    const saveDataToLocal = useCallback((rawData) => {
        const processedData = processScheduleData(rawData);
        localStorage.setItem("scheduleData", JSON.stringify(rawData));
        localStorage.setItem("processedScheduleData", JSON.stringify(processedData));
        localStorage.setItem("lastFetch", Date.now().toString());
    }, []);

    const loadDataFromLocal = () => {
        const processedData = localStorage.getItem("processedScheduleData");
        return processedData ? JSON.parse(processedData) : null;
    };

    const fetchDataFromApi = useCallback(async () => {
        try {
            const loginResponse = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `username=2201040018&password=nguyenbaoctntn@3004&grant_type=password`,
            });

            if (!loginResponse.ok) {
                throw new Error(`Login failed: ${loginResponse.status}`);
            }

            const loginResult = await loginResponse.json();
            const token = `Bearer ${loginResult.access_token}`;
            const body = {
                filter: { hoc_ky: 20242, ten_hoc_ky: "" },
                additional: {
                    paging: { limit: 100, page: 1 },
                    ordering: [{ name: null, order_type: null }],
                },
            };

            const scheduleResponse = await fetch(
                "/api/sch/w-locdstkbtuanusertheohocky",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                    body: JSON.stringify(body),
                }
            );

            if (!scheduleResponse.ok) {
                throw new Error(`Fetch schedule failed: ${scheduleResponse.status}`);
            }

            const scheduleResult = await scheduleResponse.json();
            saveDataToLocal(scheduleResult);
            return scheduleResult;
        } catch (err) {
            throw new Error(err.message);
        }
    }, [saveDataToLocal]);

    const processScheduleData = (jsonData) => {
        if (!jsonData?.data) return null;

        const periods = {};
        jsonData.data.ds_tiet_trong_ngay.forEach((period) => {
            periods[period.tiet] = {
                start: period.gio_bat_dau,
                end: period.gio_ket_thuc,
            };
        });

        const weeklySchedules = {};
        jsonData.data.ds_tuan_tkb.forEach((week) => {
            const weekData = Array.from({ length: 12 }, () => Array(7).fill(null));
            week.ds_thoi_khoa_bieu.forEach((classInfo) => {
                for (let i = 0; i < classInfo.so_tiet; i++) {
                    const periodIndex = classInfo.tiet_bat_dau + i - 1;
                    if (weekData[periodIndex]) {
                        weekData[periodIndex][classInfo.thu_kieu_so - 2] = {
                            subject_name: classInfo.ten_mon,
                            subject_code: classInfo.ma_mon,
                            date: classInfo.ngay_hoc
                        };
                    }
                }
            });
            weeklySchedules[week.tuan_hoc_ky] = weekData;
        });

        return { periods, weeklySchedules };
    };

    const updateScheduleCell = (periodIndex, dayIndex, newValue) => {
        if (!data || !currentWeek) return;

        const newSchedule = JSON.parse(JSON.stringify(data.weeklySchedules[currentWeek]));
        newSchedule[periodIndex][dayIndex] = newValue;

        const newData = {
            ...data,
            weeklySchedules: {
                ...data.weeklySchedules,
                [currentWeek]: newSchedule
            }
        };

        setData(newData);

        const rawData = JSON.parse(localStorage.getItem("scheduleData"));
        localStorage.setItem("processedScheduleData", JSON.stringify(newData));
        localStorage.setItem("scheduleData", JSON.stringify(rawData)); // Keep the original data structure

        setEditingCell(null);
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const lastFetch = localStorage.getItem("lastFetch");
                const oneMonth = 7 * 24 * 60 * 60 * 1000;
                const now = Date.now();

                if (!lastFetch || now - lastFetch > oneMonth) {
                    const apiData = await fetchDataFromApi();
                    const processedData = processScheduleData(apiData);
                    setData(processedData);
                    setCurrentWeek(processedData?.weeklySchedules ?
                        Object.keys(processedData.weeklySchedules)[0] : null);
                } else {
                    const processedData = loadDataFromLocal();
                    if (processedData) {
                        setData(processedData);
                        setCurrentWeek(Object.keys(processedData.weeklySchedules)[0]);
                    } else {
                        const apiData = await fetchDataFromApi();
                        const processedData = processScheduleData(apiData);
                        setData(processedData);
                        setCurrentWeek(Object.keys(processedData.weeklySchedules)[0]);
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [fetchDataFromApi]);

    const renderScheduleTable = (periods, schedule) => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        const formatDate = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        };

        const getDatesForWeek = () => {
            const dates = Array(7).fill(null);
            schedule.forEach(row => {
                row.forEach((cell, dayIndex) => {
                    if (cell?.date && !dates[dayIndex]) {
                        dates[dayIndex] = cell.date;
                    }
                });
            });
            return dates;
        };

        const weekDates = getDatesForWeek();

        return (
            <TableContainer component={Paper}>
                <Table borderAxis="both" sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                            {days.map((day, index) => (
                                <TableCell key={index} align="center">
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                        {day}
                                    </Typography>
                                    <Typography variant="body2">
                                        {weekDates[index] ? formatDate(weekDates[index]) : ''}
                                    </Typography>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.from({ length: 12 }, (_, index) => index + 1).map((periodIndex) => (
                            <TableRow key={periodIndex}>
                                <TableCell>
                                    {periods[periodIndex]?.start} - {periods[periodIndex]?.end}
                                </TableCell>
                                {schedule[periodIndex - 1].map((entry, dayIndex) => (
                                    <TableCell
                                        key={dayIndex}
                                        onClick={() => setEditingCell({ periodIndex: periodIndex - 1, dayIndex })}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                            }
                                        }}
                                    >
                                        <EditableCell
                                            value={entry}
                                            isEditing={editingCell?.periodIndex === periodIndex - 1 && editingCell?.dayIndex === dayIndex}
                                            subject={entry}
                                            onSave={(newValue) => updateScheduleCell(periodIndex - 1, dayIndex, newValue)}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    const handleWeekChange = (direction) => {
        if (!data || !data.weeklySchedules) return;
        const weekKeys = Object.keys(data.weeklySchedules);
        const currentIndex = weekKeys.indexOf(currentWeek);
        const newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < weekKeys.length) {
            setCurrentWeek(weekKeys[newIndex]);
        }
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">Error: {error}</Typography>;
    if (!data || !data.weeklySchedules) return <Typography>No data available.</Typography>;

    return (
        <>
            <Header />
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4">Thời Khóa Biểu</Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Button
                            variant="outlined"
                            startIcon={<NavigateBefore />}
                            onClick={() => handleWeekChange(-1)}
                            disabled={!currentWeek || currentWeek === Object.keys(data?.weeklySchedules || {})[0]}
                        >
                            Previous Week
                        </Button>
                        <Typography>Week {currentWeek}</Typography>
                        <Button
                            variant="outlined"
                            endIcon={<NavigateNext />}
                            onClick={() => handleWeekChange(1)}
                            disabled={!currentWeek || currentWeek === Object.keys(data?.weeklySchedules || {}).slice(-1)[0]}
                        >
                            Next Week
                        </Button>
                    </Box>
                </Box>
                {data && currentWeek && renderScheduleTable(data.periods, data.weeklySchedules[currentWeek])}
            </Box>
        </>
    );
}

export default Calendar;