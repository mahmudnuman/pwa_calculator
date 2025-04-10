import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const ChangePassword = () => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await axios.put('http://localhost:5000/api/auth/change-password', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.message);
      setForm({ currentPassword: '', newPassword: '' });
      setTimeout(() => {
        navigate('/'); // Redirect to the root directory
      }, 5000);

    } catch (err) {
      setMessage(err.response?.data?.message || 'Error updating password');
    }
  };

  return (
    <div className="container mt-5">
      <h2>🔒 Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="password"
            name="currentPassword"
            className="form-control"
            placeholder="Current Password"
            value={form.currentPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="newPassword"
            className="form-control"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-warning">Update Password</button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default ChangePassword;
