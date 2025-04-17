import React from "react";
import styled from "styled-components";

const InputStyle = styled.input`
  width: 100%;
  border-radius: 10px;
  padding: 10px;
  font-size: 13px;
  font-style: italic;
  line-height: 15.41px;
  background: #f7f0f0;
  color: #002b69;
  border: ${({ success }) => (success ? "1px solid #1cfe00" : "none")};
`;
const Input = ({ type, value, onChange, placeholder, success }) => {
  return (
    <InputStyle
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      success={success}
    />
  );
};

export default Input;
