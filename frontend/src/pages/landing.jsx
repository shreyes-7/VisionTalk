import React from 'react';
import "../App.css";
import { Link } from 'react-router-dom';
// import MenuIcon from '@mui/icons-material/Menu';
// import HomeIcon from '@mui/icons-material/Home';
// import HistoryIcon from '@mui/icons-material/History';
// import VideoCallIcon from '@mui/icons-material/VideoCall';
// import GroupAddIcon from '@mui/icons-material/GroupAdd';
// import PersonIcon from '@mui/icons-material/Person';
import Navbar from '../Components/Navbar';
export default function LandingPage() {
    

    return (
        <div className='landingPageContainer'>
            

    <Navbar/>

            <div className="landingMainContainer">
                <div className="content">
                    <h1><span>Connect</span> with your loved ones</h1>
                    <p>Bridge the distance with <strong>Vision Talk</strong></p>
                    <Link to="/auth" className='getStartedBtn'>Get Started</Link>
                </div>
                <div className="imageContainer">
                    <img src="https://www.vyopta.com/wp-content/uploads/2020/04/iStock-1213470229-1.jpg" alt="Vision Talk Mobile" />
                </div>
            </div>
        </div>
    );
}
