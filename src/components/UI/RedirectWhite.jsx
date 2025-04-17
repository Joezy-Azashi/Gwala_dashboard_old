import React from "react";
import styled from "styled-components";
const Container = styled.a`
  color: #fff;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
`;
const RedirectWhite = ({ text, link }) => {
  return (
    <Container href={link}>
      <span>{text}</span>
      <img src="/icons/redirectwhite.svg"/>
    </Container>
  );
};

export default RedirectWhite;
