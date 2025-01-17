import React from 'react';
import Container from '@mui/material/Container';
import AppTheme from '../shared-theme/AppTheme';
import BookManagement from '../components/BookManagement';
import AppAppBar from '../components/AppAppBar';

function AdminPage(props) {

    return (
        <AppTheme {...props}>
            <AppAppBar />
            <Container
                maxWidth="lg"
                component="main"
                sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
            >
                <BookManagement />
            </Container>
        </AppTheme >
    );
}
export default AdminPage;