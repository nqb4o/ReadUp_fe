import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const token = sessionStorage.getItem('authToken'); // Lấy token từ sessionStorage

    if (token) {
        return <Navigate to="/" replace />;
    }

    return children;
}
