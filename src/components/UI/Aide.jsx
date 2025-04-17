import React from "react";
import styled from "styled-components";
const DivContainer = styled.div`
  position: fixed;
  cursor: pointer;
  z-index: 1;
  bottom: 11px;
  right: 18px;
  width: 50px;
  height: 50px;
  display: flex;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  background-color: #87cefa;
  img {
    width: 60%;
  }
  img:nth-child(2) {
    display: none;
  }
  @media (max-width: 916px) {
    img:nth-child(1) {
      display: none;
    }
    img:nth-child(2) {
      display: block;
    }
  }
`;
const Aide = () => {
  return (
    <DivContainer className="aide">
      <img
        src="/icons/whatsapp.svg"
        onClick={() => window.location.replace("https://wa.me/212770752838")}
      />
      <img src="/icons/Employee/filter.svg" />
    </DivContainer>
  );
};

export default Aide;
