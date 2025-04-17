import styled from "styled-components";
export const Div = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
`;
export const Steper = styled.div`
  display: flex;
  width: 100%;
  border: 0.75px solid #b0b6c3;
  background: #f7f0f0;
  font-weight: 600;
  color: #b0b6c3;
  cursor: pointer;
  max-width: 880px;
  padding-top: 0;
`;
export const Step = styled.div`
  background-color: ${({ enable }) => enable && "var(--color-blue)"};
  color: ${({ enable }) => enable && "var(--color-dark-blue)"};
  width: 100%;
  text-align: center;
  padding: 14px;
  user-select: none;
`;
