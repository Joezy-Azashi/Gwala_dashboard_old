import styled from "styled-components";
export const FirstSection = styled.div`
  align-items: center;
  display: flex;
  .type {
    padding: 15px;
    background: #0061ff1a;
    border-radius: 13px;
  }
`;
export const SecondSection = styled.div`
  gap: 20px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  .checkbox {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
  }
`;
export const File = styled.div`
  border-radius: 8px;
  border: ${({ selected }) =>
    selected ? "2px solid #002b69" : "2px dashed #002b69"};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 150px;
  padding: 16px;
  gap: 8px;
  cursor: pointer;
  justify-content: center;
  position: relative;
  background-color: ${({ selected }) => selected && "#0061ff1a"}; //////
  h5 {
    color: var(--color-dark-blue);
  }
  p {
    font-size: 14px;
  }
  .remove {
    padding: 6px;
    background-color: #fa3e3e;
    color: #fff;
    font-weight: 600;
    border-radius: 50%;
    width: 25px;
    text-align: center;
    height: 25px;
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 14px;
    cursor: pointer;
  }
`;
