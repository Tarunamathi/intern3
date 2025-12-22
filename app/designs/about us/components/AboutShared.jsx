'use client';
import React, { useState } from 'react';
import styles from '../styles.module.css';

export default function AboutShared({
  headingA,
  paragraphA,
  headingB,
  paragraphB,
  showLearnMore = true,
  icons = [],
}) {
  const [open, setOpen] = useState(false);

  function toggle() {
    setOpen((v) => !v);
  }

  function go(path) {
    if (typeof window !== 'undefined') window.location.href = path;
  }

  return (
    <div className={styles.container}>
      <div className={styles['black-gradient-background']} />
      <div className={styles['in-content']}>
        <div className={styles['logo-search']}>
          <img src="https://i.ibb.co/Y4RQdJPT/logo.png" alt="logo" />
          <input type="text" placeholder="Search" />
          <div className={styles.hamburger}>
            <i className="fa-solid fa-bars" />
          </div>
        </div>

        <div className={styles.navlink}>
          <a href="">About</a>
          <a href="">Food & Nutrition</a>
          <a href="">Livelihood</a>
          <a href="">Environment Protection</a>
          <a href="">Training</a>
          <a href="">Contact</a>
        </div>

        <div className={styles.content}>
          <div className={styles['about-content']}>
            <h1>{headingA}</h1>
            <p>{paragraphA}</p>
          </div>

          <div className={styles['about-content']}>
            <h1>{headingB}</h1>
            <p>{paragraphB}</p>
          </div>

          <div className={styles['our-business']}>
            <h1>
              Our <span style={{ color: '#CFD737' }}>Business Pillars</span>
              <br />and <span style={{ color: '#CFD737' }}>Strategic Goals</span>
            </h1>
          </div>

          {icons.length > 0 && (
            <div className={styles['icon-grid']}>
              {icons.map((ic, i) => (
                <div key={i} className={styles['icon-card']} aria-hidden={false}>
                  <div className={styles['icon-graphic']}>{ic.symbol}</div>
                  <div className={styles['icon-label']}>{ic.label}</div>
                </div>
              ))}
            </div>
          )}

          {showLearnMore && (
            <div>
              <div className={styles['learn-more-btn']}>
                <button onClick={toggle} type="button">
                  Learn More
                  <div className={styles['learn-icon']}>
                    <i className="fa-solid fa-arrow-right" />
                  </div>
                </button>
              </div>

              {open && (
                <div className={styles.popup} role="dialog" aria-label="Learn more options">
                  <button onClick={() => go('/designs/about-us-2/angular.html?v=1')}>Option 1</button>
                  <button onClick={() => go('/designs/about-us-2/angular.html?v=2')}>Option 2</button>
                  <button onClick={() => go('/designs/about-us-2/angular.html?v=3')}>Option 3</button>
                  <button onClick={() => go('/designs/about-us-2/angular.html?v=4')}>Option 4</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
