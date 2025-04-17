import styled from "styled-components";
import { Field } from "../../components/employee/style";

export const FieldB = styled(Field)`
  justify-content: center;
`;
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  .cards {
    display: none;
    flex-direction: column;
    width: 100%;
    gap: 20px;
  }
  @media (max-width: 900px) {
    .cards {
      display: flex;
    }
    .table {
      display: none;
    }
  }
`;
