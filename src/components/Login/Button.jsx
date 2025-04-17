import styled from "styled-components";
import ButtonSpinner from "../buttonspinner/ButtonSpinner";

const Btn = styled.div`
  width: 100%;
  max-width: 207px;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #fff;
  background-color: #43b0ff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 12px;
  justify-content: center;
  cursor: pointer;
`;
const Button = ({ text, onClick, loading }) => {
  return <Btn onClick={onClick}>{loading && <ButtonSpinner/> || text}</Btn>;
};

export default Button;
