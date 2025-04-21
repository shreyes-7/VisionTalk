import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import './Navbar.css';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const router = useNavigate();
  const { userData, setUserData } = useContext(AuthContext);

  const handleLogout = () => {
    setUserData(null);
    localStorage.removeItem('token');
    router('/home');
  };

  const handleHomeClick = () => {
    if (userData) {
      router('/homepage');
    } else {
      router('/home');
    }
  };

  const handleJoinClick = () => {
    if (userData) {
      router('/join');
    } else {
      alert('Please login to join a meeting.');
    }
  };

  const handleCreateClick = () => {
    if (userData) {
      router('/homepage');
    } else {
      alert('Please login to create a meeting.');
    }
  };

  const handleHistoryClick = () => {
    if (userData) {
      router('/history');
    }
  };

  const handleLogoClick = () => {
    router('/home');
  };

  return (
    <nav className="navBar">
      <div className="navHeader" style={{ cursor: 'pointer' }} onClick={handleLogoClick}>
        <h2>Vision <span>Talk</span></h2>
      </div>

      <div className="navLinks">
        <button onClick={handleHomeClick}><HomeIcon /> Home</button>
        <button onClick={handleJoinClick}><GroupAddIcon /> Join</button>
        <button onClick={handleCreateClick}><VideoCallIcon /> Create</button>
        {userData && (
          <button onClick={handleHistoryClick}><HistoryIcon /> History</button>
        )}
      </div>

      <div className="navProfile">
        {userData ? (
          <button onClick={handleLogout} className="loginBtn">
            <PersonIcon /> Logout
          </button>
        ) : (
          <button onClick={() => router('/auth')} className="loginBtn">
            <PersonIcon /> Login / Register
          </button>
        )}
      </div>

      <div className="hamburgerMenu">
        <MenuIcon />
      </div>
    </nav>
  );
};

export default Navbar;
