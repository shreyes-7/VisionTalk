import React from 'react';
import "../App.css";
import { Link, useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const router = useNavigate();

    return (
        <div className='landingPageContainer'>
            <nav className='navBar'>
                <div className='navHeader'>
                    <h2>Vision <span>Talk</span></h2>
                </div>
                <div className='navlist'>
                    
                    <button onClick={() => router("/auth")} className='loginBtn'>Login / Register</button>
                </div>
            </nav>

            <div className="landingMainContainer">
                <div className="content">
                    <h1><span>Connect</span> with your loved ones</h1>
                    <p>Bridge the distance with <strong>Vision Talk</strong></p>
                    <Link to="/auth" className='getStartedBtn'>Get Started</Link>
                </div>
                <div className="imageContainer">
                    <img src="/mobile.png" alt="Vision Talk Mobile" />
                </div>
            </div>
        </div>
    );
}
