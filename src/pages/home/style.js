import styled from "styled-components";
export const DivHome = styled.div`
  padding: 0.5rem;
  padding-top: 2rem;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  .col2 {
    width: 100%;
    gap: 15px;
    display: flex;
    flex-direction: column;
    max-width: 615px;
  }
  .col3,
  .col1 {
    width: 100%;
    max-width: 216px;
  }
  .col1 {
    display: flex;
    flex-direction: column;
    gap: 35px;
  }
  @media (max-width: 500px) {
    padding: 20px 0 0 0;
  }
  @media (max-width: 885px) {
    .col1,
    .col2,
    .col3 {
      max-width: unset;
    }
  }
`;
