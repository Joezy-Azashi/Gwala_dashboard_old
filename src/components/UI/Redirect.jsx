import React from "react";
import styled from "styled-components";
const Container = styled.a`
  color: var(--color-dark-blue);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
`;
const Redirect = ({ text, link }) => {
  return (
    <Container href={link}>
      <span>{text}</span>
      <img src="/icons/redirect.svg"/>
    </Container>
  );
};

export default Redirect;
