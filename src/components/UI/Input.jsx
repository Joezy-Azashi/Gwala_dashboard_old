import React from "react";
import styled from "styled-components";
const InputStyled = styled.div`
  width: 100%;
  position: relative;
  background-color: var(--color-white);
  margin-top: 11px;
  input {
    display: ${({ type }) => type == "range" && "flex"};
    justify-content: ${({ type }) => type == "range" && "center"};
    background-color: var(--color-white);
    height: 48px;
    width: ${({ type }) => type != "range" && "100%"};
    border: none;
    box-sizing: border-box;
    padding: 16px;
    font-size: 16px;
  }
  .label {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 16px;
    display: flex;
    align-items: center;
    pointer-events: none;
    color: var(--color-dark-blue);
  }
  input:focus {
    outline: none;
    border: 1px solid #43b0ff;
  }
  input:not([value=""]) + .label .text,
  input[type="range"] + .label .text,
  input[type="file"] + .label .text,
  input:focus + .label .text {
    font-size: 12px;
    transform: translate(0, -100%);
    background-color: var(--color-white);
    font-style: italic;
    padding-left: 4px;
    padding-right: 4px;
    color: var(--color-dark-blue);
  }
  .label .text {
    transition: all 0.15s ease-out;
  }
`;
const Input = ({
  type,
  value,
  onChange,
  placeholder,
  autoComplete = "off",
  disabled,
}) => {
  return (
    <InputStyled type={type}>
      <input
        type={type}
        id="fname"
        name="fname"
        value={value}
        aria-labelledby="label-fname"
        onChange={!disabled ? onChange : () => {}}
        disabled={disabled}
        autoComplete={autoComplete}
      />
      <label className="label" htmlFor="fname" id="label-fname">
        <div className="text">{placeholder}</div>
      </label>
    </InputStyled>
  );
};

export default Input;
