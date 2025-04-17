import React, { useState } from "react";
import styled from "styled-components";
const Container = styled.div`
  position: relative;
  border: ${({ border }) => border || "0.75px solid #000;"};
  > span,
  input {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    /* background-color: #f7f0f0; */
    white-space: nowrap;
    text-transform: capitalize;
    width: 100%;
  }
`;
const InputAmount = ({ amount, index, onChange, error }) => {
  const [active, setActive] = useState(false);
  const [number, setNumber] = useState(amount);

  return (
    <Container
      onClick={() => setActive(true)}
      border={error && " 0.75px solid #FFB636"}
    >
      {!active ? (
        <span>{amount || 0}</span>
      ) : (
        <div style={{ width: "100%" }}>
          <input
            style={{
              border: "2px solid #002B69",
            }}
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            onBlur={() => {
              onChange(index, number);
              setActive(false);
            }}
          />
        </div>
      )}
    </Container>
  );
};

export default InputAmount;
