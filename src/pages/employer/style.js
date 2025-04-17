import styled from "styled-components";
import { Field } from "../../components/employee/style";

export const ContainerLeft = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  /* height: 100%; */
  th,
  tr,
  td {
    height: 20px;
  }
  tbody > tr {
    :hover * {
      background-color: #d9edff !important;
      cursor: pointer;
    }
  }
  > div:nth-child(1) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  @media (max-width: 916px) {
    .filter {
      display: none;
    }
  }
  .pagination {
    display: flex;
    gap: 20px;
    list-style: none;
    li {
      min-width: 30px;
      height: 30px;
      background-color: #f7f0f0;
      justify-content: center;
      align-items: center;
      display: flex;
      cursor: pointer;
    }
    .selected {
      background-color: #d9edff;
    }
  }
`;
export const FieldB = styled(Field)`
  justify-content: center;
`;
