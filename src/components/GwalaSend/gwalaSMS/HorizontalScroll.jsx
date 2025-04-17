import React, { useRef } from 'react';
import { IconButton } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

const HorizontalScroll = ({ children }) => {
  const scrollContainerRef = useRef(null);

  const scrollContainer = document.querySelector("main");

  if (scrollContainer) {
    scrollContainer.addEventListener("wheel", (evt) => {
      evt.preventDefault();
      scrollContainer.scrollLeft += evt.deltaY;
    });
  }

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({
      left: -200, // Adjust the value as needed
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({
      left: 200, // Adjust the value as needed
      behavior: 'smooth',
    });
  };

  return (
    <div className="horizontal-scroll horScroll">
      <IconButton sx={{ backgroundColor: "#EBF2F9", padding: "2px" }} className="scroll-button left" onClick={scrollLeft}>
        <KeyboardArrowLeft sx={{ color: "#000" }} />
      </IconButton>
      <main className="scroll-container" ref={scrollContainerRef}>
        {children}
      </main>
      <IconButton sx={{ backgroundColor: "#EBF2F9", padding: "2px" }} className="scroll-button right" onClick={scrollRight}>
        <KeyboardArrowRight sx={{ color: "#000" }} />
      </IconButton>
    </div>
  );
};

export default HorizontalScroll;