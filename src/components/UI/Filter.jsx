import React from "react";
import styled from "styled-components";
const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: #d9edff;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-items: center;
  justify-content: space-around;
  .btn {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 11px;
  }
`;
const Filter = ({ children }) => {
  return <Container className="col-md-3 col-sm-12">{children}</Container>;
};
export default Filter;
