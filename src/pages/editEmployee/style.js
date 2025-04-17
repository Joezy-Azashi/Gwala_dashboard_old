import styled from "styled-components";
export const LeftCnt = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  .cellul {
    margin-top: 11px;
  }
  display: flex;
  flex-direction: column;
  height: 100% !important;
  justify-content: space-around;
  hr {
    border: 1px solid #43b0ff;
    width: 50%;
    margin: auto;
    margin-top: 11px;
  }
`;
export const RightCnt = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  align-items: center;
  .infos {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
    width: 100%;
  }
  .transactions {
    display: flex;
    flex-direction: column;
    gap: 15px;
    font-size: 14px;
    font-weight: 600;
    color: #002b69;
  }
  .lastTransations {
    display: flex;
    flex-direction: column;
    gap: 15px;
    font-size: 14px;
    font-weight: normal;
    > div {
      display: flex;
      justify-content: space-between;
      width: 100%;
      gap: 5px;
    }
  }
  .company {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    > div {
      display: flex;
      flex-direction: column;
    }
  }
`;
