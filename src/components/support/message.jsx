import React from "react";
import styled from "styled-components";
const Msg = styled.div`
  background-color: #f7f0f0;
  font-weight: 400;
  align-self: ${(props) => (props.receive ? "flex-start" : "flex-end")};
  width: 90%;
  padding: 18px;
  margin-bottom: 5px;
`;
const Message = ({ text, receive }) => {
  return <Msg receive={receive}>{text}</Msg>;
};

export default Message;
