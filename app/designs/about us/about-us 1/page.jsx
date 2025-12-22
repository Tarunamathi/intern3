import React from 'react';
import AboutShared from '../components/AboutShared';

const headingA = (
  <>
    About <span style={{ color: '#CFD737' }}>Us</span>
  </>
);

const paragraphA = `Agri value chain Services Pvt Ltd is an Agribusiness consulting firm established in 2014 at Chennai, India that encourages and guides Agri value chain private and public sector Agri food business Infrastructure investments from concept to completion of the project. AVC collaborates with public sector, international institutions for implementing projects for sustainable growth of food and nutrition security for common man.`;

const headingB = (
  <>
    Our <span style={{ color: '#CFD737' }}>Approach</span>
  </>
);

const paragraphB = `Variant 2 layout — replace this copy with the alternate design content you want to show when users click Learn More.`;

export default function AboutUs1Page() {
  return (
    <AboutShared
      headingA={headingA}
      paragraphA={paragraphA}
      headingB={headingB}
      paragraphB={paragraphB}
      showLearnMore={true}
    />
  );
}
