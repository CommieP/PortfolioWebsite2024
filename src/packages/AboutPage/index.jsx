import React, { useEffect, useRef } from 'react';
import Page from '../Page/page';
import PageSection from '../Page/pageSection';
import './about.css';

const AboutPage = () => {
    const glitchRef = useRef(null);
    const glowRef = useRef(null);

    useEffect(() => {
        const colors = ['red', 'blue', 'magenta'];

        const updateColors = () => {
            if (!glitchRef.current || !glowRef.current) return;

            const nonPinkColors = colors.filter((color) => color !== 'magenta');
            const randomNonPinkColor = nonPinkColors[Math.floor(Math.random() * nonPinkColors.length)];

            if (Math.random() > 0.5) {
                glitchRef.current.style.setProperty('--color-before', 'magenta');
                glitchRef.current.style.setProperty('--color-after', randomNonPinkColor);
                glowRef.current.style.setProperty('--color-before', 'magenta');
                glowRef.current.style.setProperty('--color-after', randomNonPinkColor);
            } else {
                glitchRef.current.style.setProperty('--color-before', randomNonPinkColor);
                glitchRef.current.style.setProperty('--color-after', 'magenta');
                glowRef.current.style.setProperty('--color-before', 'magenta');
                glowRef.current.style.setProperty('--color-after', randomNonPinkColor);
            }
        };

        updateColors();
        const interval = setInterval(updateColors, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Page>
            <PageSection>
                <div className="aboutPageHeader">
                    <div className="glitch" ref={glitchRef} data-text="Aditya De">
                        Aditya De
                    </div>
                    <div className="glow" ref={glowRef}>
                        Aditya De
                    </div>
                    <p className="subtitle">Creative Technologist</p>
                </div>
            </PageSection>
            <PageSection>
                <div className='fullSection'>

                </div>
            </PageSection>
            <PageSection>
                <p>Hello</p>
            </PageSection>
            <PageSection>
                <p>End of sections</p>
            </PageSection>
        </Page>
    );
};

export default AboutPage;
