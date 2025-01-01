import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import AppTheme from '../shared-theme/AppTheme';
import { fetchUsersApi } from '../../services/AuthService';
import Header from './Header'

function HomePage(props) {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('authToken');

        if (!token) {
            setError('Vui lòng đăng nhập để xem thông tin.');
            setLoading(false);
            return;
        }
        setTimeout(() => {
            const fetchUserData = async () => {
                try {
                    const response = await fetchUsersApi();
                    setUser(response.data);
                } catch (err) {
                    setError(err.response ? err.response.data.message : 'Có lỗi xảy ra.');
                } finally {
                    setLoading(false);
                }
            };
            fetchUserData();
        }, 1500);
    }, []);

    return (
        <AppTheme {...props}>
            <Header />
            <Container>
                {loading && <div>Đang tải...</div>}

                {error && <div>{error}</div>}

                {!loading && !error && (
                    <>
                        <div>
                            {user && (
                                <div>
                                    <p><strong>Họ tên:</strong> {user.name}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>Ngày tạo tài khoản:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </Container>
        </AppTheme >
    );
}
export default HomePage;