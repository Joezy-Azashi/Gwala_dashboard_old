import styled from "styled-components";

export const ContFilter = styled.div`
  padding-top: 2rem;
  padding-bottom: 2rem;
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  line-height: 18px;
  color: #002b69;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
`;

export const Field = styled.div`
  background: #87cefa;
  border-radius: 20px;
  display: flex;
  border-radius: 20px;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  cursor: pointer;
`;

export const DropDown = styled.div`
  display: none;

  background-color: #43b0ff;
  font-size: 11px;
  font-weight: normal;
  width: 100%;
  gap: 6px;
  > div {
    cursor: pointer;
  }
`;
