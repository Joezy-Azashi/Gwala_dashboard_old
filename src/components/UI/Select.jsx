import React from "react";
import styled from "styled-components";
const SelectStyle = styled.select`
  width: 100%;
  height: 100%;
  background-color: #f7f0f0;
  color: #002b69;
  border: none;
  padding: 12px;
  ::-webkit-input-placeholder {
    color: #002b69;
    opacity: 1;
  }
  ::-ms-expand {
    display: none;
  }
  -webkit-appearance: none;
  -moz-appearance: none;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 15px;
`;

const Container = styled.div`
  position: relative;
  .text {
    font-size: 11px;
    position: absolute;
    left: 10px;
    top: 13px;
    font-style: italic;
    color: var(--color-dark-blue);
  }
`;
const Select = ({ children, onChange, placeholder, disabled }) => {
  return (
    <Container>
      <img
        src="/icons/arrow-down.svg"
        style={{
          position: "absolute",
          top: "50%",
          right: 8,
          height: ".8vw",
          width: ".8vw",
          maxHeight: 13,
          maxWidth: 13,
          minHeight: 10,
          minWidth: 10,
        }}
      />
      <SelectStyle
        onChange={!disabled ? onChange : () => {}}
        disabled={disabled}
      >
        {children}
      </SelectStyle>

      <div className="text">{placeholder}</div>
    </Container>
  );
};

export default Select;
