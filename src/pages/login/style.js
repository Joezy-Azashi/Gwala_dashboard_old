import styled from "styled-components";

export const Login = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #d9edff;
  .rectangle {
    display: flex;
    background-color: #43b0ff;
    width: 80%;
    height: 60%;
    max-height: 479px;
    max-width: 801px;
    box-shadow: 0px 4px 100px rgba(0, 0, 0, 0.25);
    border-radius: 25px;
    overflow: hidden;
  }
  .rightSection {
    background-color: #fff;
    width: 50%;
    padding: 12px;
    color: #43b0ff;
    display: flex;
    flex-direction: column;
    gap: 30px;
    justify-content: center;
    font-size: 0.9rem;
    p {
      line-height: 18px;
    }
    span {
      font-style: normal;
      font-weight: 600;
      font-size: 25px;
      line-height: 30px;
      color: #002b69;
    }
    .line {
      width: 100%;
      border: 1px dashed #43b0ff;
      margin-top: 19px;
    }
    .inpts {
      display: flex;
      flex-direction: column;
      gap: 19px;
    }
    .btn {
      display: flex;
      justify-content: center;
    }
    label {
      font-size: 0.7rem;
      font-style: italic;
      text-decoration: underline;
      float: right;
      cursor: pointer;
    }
  }

  .leftSection {
    background-color: #43b0ff;
    display: flex;
    flex-direction: column;
    font-weight: 600;
    width: 50%;
    flex-direction: column;
    justify-content: space-evenly;
    .firstSec {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 30px;
      align-items: center;

      > svg {
        width: 50%;
        margin-bottom: 27px;
      }
    }

    .lastSec {
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      text-align: center;
      gap: 14px;
      .line {
        height: 1.5px;
        background: #002b69;
        width: 50%;
      }
      > hr {
        width: 100%;
        border-top: 1.5px solid #002b69;
      }
      > div {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8%;
        width: 100%;
      }
      > span {
        font-size: 1.2rem;
      }
    }
  }
  @media (max-width: 500px) {
    .rectangle {
      display: flex;
      width: 100%;
      height: 100%;
      max-height: unset;
      max-width: unset;
      overflow: unset;
      flex-direction: column;
    }
    .leftSection {
      width: 100%;
      .lastSec {
        display: none;
      }
    }
    .rightSection {
      width: 100%;
      height: 100%;
      border-radius: 30px 30px 0px 0px;
    }
  }
`;
