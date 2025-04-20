import React, { useContext, useState } from 'react';
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import "./home.css";
import { Button, IconButton, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {
    const navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const { addToUserHistory } = useContext(AuthContext);

    const handleJoinVideoCall = async () => {
        if (meetingCode.trim() === "") return;
        await addToUserHistory(meetingCode);
        navigate(`/${meetingCode}`);
    };

    return (
        <div className="homePageContainer">
            <nav className="homeNavBar">
                <div className="navLogo">
                    <h2>Vision <span>Talk</span></h2>
                </div>
                <div className="navActions">
                    <IconButton title="History" onClick={() => navigate("/history")}>
                        <RestoreIcon style={{ color: "#fff" }} />
                    </IconButton>
                    <Button
                        startIcon={<LogoutIcon />}
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/auth");
                        }}
                        variant="outlined"
                        className="logoutBtn"
                    >
                        Logout
                    </Button>
                </div>
            </nav>

            <main className="homeMain">
                <section className="leftPanel">
                    <h1><span>Quality</span> Video Calls <br /> for Everyone</h1>
                    <p>Join your meeting instantly with Vision Talk.</p>
                    <div className="meetingInput">
                        <TextField
                            variant="outlined"
                            label="Enter Meeting Code"
                            onChange={(e) => setMeetingCode(e.target.value)}
                            className="meetingTextField"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleJoinVideoCall}
                            className="joinBtn"
                        >
                            Join
                        </Button>
                    </div>
                </section>
                <section className="rightPanel">
                    <img src="https://img.freepik.com/free-photo/office-worker-attending-business-meeting-videocall-conference-with-webcam-network-connection-talking-colleagues-remote-video-teleconference-telework-working-late-night_482257-48543.jpg?t=st=1745144344~exp=1745147944~hmac=fd997cc5e0a499b3ceb22e14fec8f29e30c28f859a388c460b4ca5387cc5ee21&w=1380" alt="Vision Talk Logo" className="logoImage" />
                </section>
            </main>
        </div>
    );
}

export default withAuth(HomeComponent);
