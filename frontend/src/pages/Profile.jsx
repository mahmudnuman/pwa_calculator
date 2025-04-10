import React from 'react';
import { useNavigate, Link } from 'react-router-dom';


const Profile = ({ user }) => {
  return (
    <div className="container mt-5">
      <h2>👤 Profile</h2>
      <p><strong>Username:</strong> {user?.username}</p>
      <Link to="/change-password" className="btn btn-outline-warning mt-3">Change Password</Link>

    </div>
  );
};

export default Profile;
