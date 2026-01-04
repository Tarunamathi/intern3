'use client';

import React, { useState, useEffect, useRef } from 'react';
import './about-us2.css'; // Assuming you will paste the CSS below into this file

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [pdfModal, setPdfModal] = useState<string | null>(null);

  const toggleDetails = (i: number) => {
    setOpenIndex(prev => (prev === i ? null : i));
  };

  const openPdf = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
    if (href) {
      setPdfModal(href);
    }
  };

  const closePdf = () => {
    setPdfModal(null);
  };

  useEffect(() => {
    if (!pdfModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePdf();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pdfModal]);

  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openIndex === null) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (cardsContainerRef.current && !cardsContainerRef.current.contains(e.target as Node)) {
        setOpenIndex(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openIndex]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="container">
        <div className="black-gradient-background"></div>
        <div className="in-content">
          <div className="logo-search">
            <div className="hamburger" onClick={toggleMenu}>
              <i className="fa-solid fa-bars"></i>
            </div>
          </div>

          <div className={`navlink ${isMenuOpen ? 'active' : ''}`}>
            <a href="/">Home</a>
            <a href="/contact">Contact</a>
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

            <div className="cards" ref={cardsContainerRef}>
              <div className={`card ${openIndex === 0 ? 'open' : ''}`} tabIndex={0}>
                <div className="inner-content">
                  <img src="https://i.ibb.co/fVG9HH7S/IMG-3341.png" alt="" />
                  <h1>Food & Nutrition<br />Security support</h1>
                </div>
                <button type="button" className="details-toggle" onClick={() => toggleDetails(0)} aria-expanded={openIndex === 0}>
                  <span>View Project Details</span>
                  <span className={`arrow ${openIndex === 0 ? 'rotated' : ''}`}>▾</span>
                </button>
                <div className="tooltip">
                  <strong>Food and Nutrition Security Support</strong>
                  <div className="tooltip-body">
                    <ul>
                      <li>Strengthening cold chain and food logistics systems by encouraging and guiding the <a href="/pdfs/food-and-nutrition.pdf" className="pdf-link" onClick={openPdf}>Private Sector Agribusiness investments</a></li>
                      <li>Support <a href="/pdfs/food-and-nutrition-public.pdf" className="pdf-link" onClick={openPdf}>Public Sector Investments</a> in Agri value chain and Food Processing</li>
                      <li>Support international institutions to reach sustainable development goals on reducing poverty and hunger</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={`card ${openIndex === 1 ? 'open' : ''}`} tabIndex={0}>
                <div className="inner-content">
                  <img src="https://i.ibb.co/N2rcGQ4q/IMG-3342.png" alt="" />
                  <h1>Rural Livelihood<br />Development</h1>
                </div>
                <button type="button" className="details-toggle" onClick={() => toggleDetails(1)} aria-expanded={openIndex === 1}>
                  <span>View Project Details</span>
                  <span className={`arrow ${openIndex === 1 ? 'rotated' : ''}`}>▾</span>
                </button>
                <div className="tooltip">
                  <strong>Rural Livelihood Development</strong>
                  <div className="tooltip-body">
                    <ul>
                      <li>Integrating farmers to the market through establishing <a href="/pdfs/post-harvest-infrastructure.pdf" className="pdf-link" onClick={openPdf}>post-harvest infrastructure</a> in production belts</li>
                      <li>Implementing <a href="/pdfs/skill-development-programs.pdf" className="pdf-link" onClick={openPdf}>Skill development programs</a> for rural employment generation by partnering with Agriculture University</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={`card ${openIndex === 2 ? 'open' : ''}`} tabIndex={0}>
                <div className="inner-content">
                  <img src="https://i.ibb.co/Hwd0dW7/IMG-3343.png" alt="" />
                  <h1>Environment<br />Protection</h1>
                </div>
                <button type="button" className="details-toggle" onClick={() => toggleDetails(2)} aria-expanded={openIndex === 2}>
                  <span>View Project Details</span>
                  <span className={`arrow ${openIndex === 2 ? 'rotated' : ''}`}>▾</span>
                </button>
                <div className="tooltip">
                  <strong>Environment Protection in Food Supply Chain</strong>
                  <div className="tooltip-body">
                    <ul>
                      <li>Encouraging Energy efficient Thermal building systems</li>
                      <li>Advocating use of Natural refrigerants and <a href="/pdfs/energy-efficient-cooling.pdf" className="pdf-link" onClick={openPdf}>energy efficient cooling system</a> (environmental energy-efficient cooling system)</li>
                      <li>Integration of <a href="/pdfs/solar-energy-system.pdf" className="pdf-link" onClick={openPdf}>Solar energy system</a> (envi(solar roof system)) in projects</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={`card ${openIndex === 3 ? 'open' : ''}`} tabIndex={0}>
                <div className="inner-content">
                  <img src="https://i.ibb.co/5h5pjjbn/IMG-3344.png" alt="" />
                  <h1>Global Value<br />Chain Development</h1>
                </div>
                <button type="button" className="details-toggle" onClick={() => toggleDetails(3)} aria-expanded={openIndex === 3}>
                  <span>View Project Details</span>
                  <span className={`arrow ${openIndex === 3 ? 'rotated' : ''}`}>▾</span>
                </button>
                <div className="tooltip">
                  <strong>Global Value Chain Development</strong>
                  <div className="tooltip-body">
                    <ul>
                      <li>Integration of local producers to Global markets through <a href="/pdfs/capacity-development.pdf" className="pdf-link" onClick={openPdf}>capacity development</a>, innovation, international partnerships and competitiveness</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* PDF Modal */}
      {pdfModal && (
        <div className="pdf-modal-overlay" onClick={closePdf}>
          <div className="pdf-modal" onClick={(e) => e.stopPropagation()}>
            <button className="pdf-modal-close" onClick={closePdf}>✕</button>
            <iframe
              src={pdfModal}
              title="PDF Viewer"
              className="pdf-modal-iframe"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}