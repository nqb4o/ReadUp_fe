import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from '../components/AppAppBar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';
import ScrollToTop from '../../utils/scrollToTop';

export default function HomePage(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', marginTop: 16, marginBottom: 4, gap: 4 }}
      >
        <ScrollToTop />
        <Outlet />
      </Container>
      <Footer />
    </AppTheme>
  );
}