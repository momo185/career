import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/homepage.css'; 

const Homepage = () => {
  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="logo">CareerCrafters</div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/universities">Universities</Link></li>
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
       
      </nav>

      <div className="hero-section">
        <div className="quote">
       
        </div>
      </div>

      
    </div>
  );
};

export default Homepage;
