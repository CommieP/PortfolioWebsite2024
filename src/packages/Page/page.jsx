import React, { useRef, useCallback, useState, useEffect } from 'react';
import './page.css';

const Page = ({ children }) => {
    const childrenArray = React.Children.toArray(children);
    const sectionsRef = useRef([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showArrow, setShowArrow] = useState(true);

    // Initialize refs array
    if (sectionsRef.current.length !== childrenArray.length) {
        sectionsRef.current = Array(childrenArray.length).fill(null);
    }

    const setRef = useCallback((element, index) => {
        sectionsRef.current[index] = element;
    }, []);

    const scrollToSection = useCallback((index) => {
        if (index < sectionsRef.current.length && sectionsRef.current[index]) {
            sectionsRef.current[index].scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
            setCurrentIndex(index);
        }
    }, []);

    const handleArrowClick = () => {
        if (currentIndex < childrenArray.length - 1) {
            scrollToSection(1);
        }
    };

    useEffect(() => {
        const rootElement = document.getElementById('root');
        if (!rootElement) return;

        const handleScroll = () => {
            const viewportHeight = rootElement.clientHeight;
            const firstSectionTop = sectionsRef.current[0]?.getBoundingClientRect().top;

            if (firstSectionTop !== undefined) {
                setShowArrow(firstSectionTop > -viewportHeight * 0.5);
            }
        };

        rootElement.addEventListener('scroll', handleScroll);
        return () => {
            rootElement.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="page">
            {childrenArray.map((child, index) =>
                React.cloneElement(child, {
                    key: child.key || index,
                    ref: (element) => setRef(element, index),
                })
            )}
            {showArrow && (
                <div className="down-arrow" onClick={handleArrowClick}>
                    ↓
                </div>
            )}
        </div>
    );
};

export default Page;
