import React from "react";
import styled from "styled-components";
const Container = styled.div`
  /* width: 100%; */
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: ${(props) => `url(${props.source})`};
  background-size: cover;
  background-repeat: no-repeat;
`;
const Avatar = ({ source }) => {
  return <Container source={source}></Container>;
};

export default Avatar;
