import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calculator from '../components/Calculator';
import { removeToken, getToken } from '../utils/auth';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>PWA</h1>
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>
      <Calculator />
    </div>
  );
}

export default Dashboard;
