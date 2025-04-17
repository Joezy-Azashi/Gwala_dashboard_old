import React from "react";
import styled from "styled-components";
import ButtonSpinner from "../buttonspinner/ButtonSpinner";
const Btn = styled.div`
  width: 100%;
  color: ${(props) => props.color || "#002B69"};
  background-color: ${(props) => props.bgColor || "#87CEFA"};
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  pointer-events: ${(props) => props.disable && "none"};
  opacity: ${(props) => props.disable && 0.6};
  cursor: ${(props) => props.disable && "not-allowed"};
`;

const Button = ({ text, color, bgColor, onClick, loading, disable }) => {
  return (
    <Btn color={color} bgColor={bgColor} onClick={onClick} disable={disable}>
      {(loading && <ButtonSpinner />) || text}
    </Btn>
  );
};

export default Button;
