import "./range-input.css";
import React, { useCallback, useEffect, useState, useRef } from "react";
import styled from "styled-components";

const InputStyledContainer = styled.div`
  width: 100%;
  position: relative;
  background-color: var(--color-white);
  margin-top: 11px;
  .label {
    position: absolute;
    font-size: 12px;
    font-style: italic;
    top: -5px;
    left: 10%;
    display: flex;
    align-items: center;
    pointer-events: none;
    color: var(--color-dark-blue);
  }
`;

const RangeInput = ({
  min = 0,
  max = 100,
  setRangeValue,
  initialValue = 0,
}) => {
  const [maxVal, setMaxVal] = useState(max);
  const maxValRef = useRef(max);
  const range = useRef(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const maxPercent = getPercent(maxVal);
    if (range.current) {
      range.current.style.width = `${maxPercent - 0}%`;
    }
  }, [maxVal, getPercent]);

  /* Set intitial value */
  useEffect(() => {
    setMaxVal(initialValue);
  }, [initialValue]);

  return (
    <InputStyledContainer>
      <label className="label" htmlFor="fname" id="label-fname">
        <div className="text">{"Pourcentage accessible"}</div>
      </label>
      <div
        style={{
          height: "3rem",
          display: "flex",
          alignItems: "center",
          marginTop: 10,
          justifyContent: "start",
          padding: 20,
        }}
      >
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), 1);
            setMaxVal(value);
            setRangeValue(value);
            maxValRef.current = value;
          }}
          className="thumb-one thumb-one--right"
        />
        <div className="slider-one">
          <div className="slider-one__track" />
          <div ref={range} className="slider-one__range" />
          {/* <div className="slider-one__left-value">{}</div> */}
          <div className="slider-one__right-value">{maxVal}%</div>
        </div>
      </div>
    </InputStyledContainer>
  );
};

export default RangeInput;
