'use client';

import React, { useState } from 'react';
import './about-us2.css'; // Assuming you will paste the CSS below into this file

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="container">
        <div className="black-gradient-background"></div>
        <div className="in-content">
          <div className="logo-search">
            <img src="https://i.ibb.co/Y4RQdJPT/logo.png" alt="Logo" />
            <input type="text" placeholder="Search" />
            <div className="hamburger" onClick={toggleMenu}>
              <i className="fa-solid fa-bars"></i>
            </div>
          </div>

          <div className={`navlink ${isMenuOpen ? 'active' : ''}`}>
            <a href="">About</a>
            <a href="">Food & Nutrition</a>
            <a href="">Livelihood</a>
            <a href="">Environment Protection</a>
            <a href="">Training</a>
            <a href="">Contact</a>
          </div>

          <div className="content">
            <div className="about-content">
              <h1>About <span style={{ color: '#CFD737' }}>Us</span></h1>
              <p>
                Agri value chain Services Pvt Ltd is an Agribusiness consulting firm established in 2014 at Chennai,
                India that encourages and guides Agri value chain private and public sector Agri food business
                Infrastructure investments from concept to completion of the project. AVC collaborates with public
                sector, international institutions for implementing projects for sustainable growth of food and
                nutrition security for common man.
              </p>
            </div>

            <div className="about-content">
              <h1>Our <span style={{ color: '#CFD737' }}>Impact</span></h1>
              <p>
                Agri value chain services efforts are focussed on Socio economic development and Environmental
                protection in food chain from production stage till it reaches the customer.
              </p>
            </div>

            <div className="our-business">
              <h1>
                Our <span style={{ color: '#CFD737' }}>Business Pillars</span><br />
                and <span style={{ color: '#CFD737' }}>Strategic Goals</span>
              </h1>
            </div>

            <div className="cards">
              <div className="card">
                <div className="inner-content">
                  <img src="https://i.ibb.co/fVG9HH7S/IMG-3341.png" alt="" />
                  <h1>Food & Nutrition<br />Security support</h1>
                </div>
              </div>

              <div className="card">
                <div className="inner-content">
                  <img src="https://i.ibb.co/N2rcGQ4q/IMG-3342.png" alt="" />
                  <h1>Rural Livelihood<br />Development</h1>
                </div>
              </div>

              <div className="card">
                <div className="inner-content">
                  <img src="https://i.ibb.co/Hwd0dW7/IMG-3343.png" alt="" />
                  <h1>Environment<br />Protection</h1>
                </div>
              </div>

              <div className="card">
                <div className="inner-content">
                  <img src="https://i.ibb.co/5h5pjjbn/IMG-3344.png" alt="" />
                  <h1>Global Value<br />Chain Development</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}