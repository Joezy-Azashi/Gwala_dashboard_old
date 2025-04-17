import React from "react";
import styled from "styled-components";
import Message from "./message";
const Container = styled.div`
  height: 100%;
  width: 100%;
  .nav {
    background-color: #87cefa;
    padding: 10px;
    font-weight: bold;
  }
  .boite {
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    background-color: #d9edff;
    padding: 8px;
    height: 100%;
  }
`;
const Conversation = ({ cnv }) => {
  return (
    <Container>
      <div className="nav">{cnv.phone}1</div>
      <div className="boite">
        {cnv.message?.map((el, key) => (
          <Message text={el.content} receive />
        ))}
      </div>
    </Container>
  );
};

export default Conversation;
