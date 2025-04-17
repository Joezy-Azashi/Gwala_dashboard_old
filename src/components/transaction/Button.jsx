import React from "react";
import styled from "styled-components";
const Container = styled.div`
  padding: .1rem;
  text-align: center;
  border-radius: 15px;
  width: 100%;
  background-color: ${({ color }) => color};
  border: ${({ border }) => (border ? border : "0.5px solid #000000")};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  color: ${({textcolor}) => textcolor};
  &:hover {
    background-color: ${({ hover }) => (hover? `${hover} !important` : "")};
  }
`;
const Button = ({ children, color = "#D9D9D9", onClick, textcolor, border, hover, style, isEnabled = true }) => {
  return (
    <Container color={color} onClick={onClick} border={border} hover={hover} textcolor={textcolor} style={style}>
      {children}
    </Container>
  );
};

export default Button;
