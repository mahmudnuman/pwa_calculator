import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

        <div className="dropdown">
          <button
            className="btn btn-outline-primary dropdown-toggle"
            type="button"
            id="accountDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Account
          </button>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="accountDropdown">
            <li>
              <Link className="dropdown-item" to="/change-password">
                Change Password
              </Link>
            </li>
            <li>
              <button className="dropdown-item text-danger" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      <Calculator />
    </div>
  );
}

export default Dashboard;
