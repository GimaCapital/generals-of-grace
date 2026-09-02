import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children, requiredRole }) {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-gold"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userProfile?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;