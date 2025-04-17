import React from "react";
import styled from "styled-components";

const Container = styled.div`
  background-color: ${(props) => (props.color ? props.color : "#F7F0F0")};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: .45rem;
  font-weight: ${(props) => (props.color || props.txtColor ? 600 : "normal")};
  font-size: 15px;
  line-height: 18px;
  height: 100%;
  width: 100%;
  color: ${({ txtColor }) => txtColor && txtColor};
`;
const Cellul = ({ txtColor, color, children }) => {
  return (
    <Container color={color} txtColor={txtColor}>
      {children}
    </Container>
  );
};

export default Cellul;
