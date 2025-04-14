import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUsersApi } from '../services/AuthService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            try {
                const response = await fetchUsersApi();
                if (response.status === 200) {
                    setUser(response.data);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                sessionStorage.removeItem('authToken');
                sessionStorage.removeItem('user');
                setUser(null);
                setIsAuthenticated(false);
            }
        }
        setLoading(false);
    };

    const login = async (token) => {
        sessionStorage.setItem('authToken', token);
        try {
            const response = await fetchUsersApi();
            if (response.status === 200) {
                setUser(response.data);
                setIsAuthenticated(true);
                sessionStorage.setItem('user', JSON.stringify(response.data));
            }
        } catch (error) {
            console.error('Login failed:', error);
            logout();
        }
    };

    const logout = () => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    };

    const isAdmin = () => {
        return user?.role === 'admin';
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                isAdmin,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);