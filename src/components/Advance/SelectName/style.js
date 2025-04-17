import styled from "styled-components";

export const Option = styled.div`
  display: ${(props) => (props.isFocused ? "flex" : "none")};
  flex-direction: column;
  position: absolute;
  top: 110%;
  border-radius: var(--Count, 0px);
  border: 2px solid #002b69;
  background: #f7f0f0;
  padding: 13px;
  z-index: 3;
  gap: 9px;
  width: 100%;
  .sugguest {
    display: flex;
    justify-content: space-between;
    color: #002b69;
    font-weight: 600;
    gap: 20px;
  }
`;
export const Container = styled.div`
  position: relative;
  border: ${({ border }) => border};
  > span,
  input {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    background-color: #f7f0f0;
    white-space: nowrap;
    text-transform: capitalize;
    width: 100%;
  }
`;
