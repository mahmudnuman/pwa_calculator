
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      alert('Registration successful');
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
<div className="container mt-5">
  <h2 className="mb-4">Register</h2>
  <form onSubmit={handleSubmit}>
    <div className="mb-3">
      <input
        className="form-control"
        placeholder="Username"
        onChange={e => setForm({ ...form, username: e.target.value })}
        required
      />
    </div>
    <div className="mb-3">
      <input
        type="password"
        className="form-control"
        placeholder="Password"
        onChange={e => setForm({ ...form, password: e.target.value })}
        required
      />
    </div>
    <button type="submit" className="btn btn-primary">Register</button>
  </form>
</div>

  );
}

export default Register;
