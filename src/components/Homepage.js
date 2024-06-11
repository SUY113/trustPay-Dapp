// src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css'; // Import file CSS cho component này

function HomePage() {
  return (
    <div className="home-container">
      <h1>Welcome to Salary App</h1>
      <p>An toàn - Minh bạch - Tin tưởng</p>
      <Link to="/enroll-admin" className="button">
        Enroll Admin
      </Link>
      <Link to="/login" className="button">
        Login
      </Link>
    </div>
  );
}

export default HomePage;
