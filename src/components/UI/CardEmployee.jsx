import React from "react";
import styled from "styled-components";
const Container = styled.div`
  background-color: var(--color-white);
  border-radius: 15px;
  width: 100%;
  padding: 19px;
  .solde {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }
  .name {
    font-size: 17px;
  }
  hr {
    border: 3px solid #fff;
    margin: 5px;
  }
`;
const CardEmployee = ({ name, solde, statu }) => {
  return (
    <Container>
      <div className="name">{name}</div>
      <hr />
      <div className="solde">
        <span>Solde : {solde}</span>
        <span>Statut : {statu}</span>
      </div>
    </Container>
  );
};

export default CardEmployee;
