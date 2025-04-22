import React from 'react';
import Container from '@mui/material/Container';
import AppTheme from '../shared-theme/AppTheme';
import ArticleManagement from '../components/ArticleManagement';
import AppBarLanding from '../components/AppBarLanding';

function AdminPage(props) {

    return (
        <AppTheme {...props}>
            <AppBarLanding />
            <Container
                maxWidth="lg"
                component="main"
                sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
            >
                <ArticleManagement />
            </Container>
        </AppTheme >
    );
}
export default AdminPage;