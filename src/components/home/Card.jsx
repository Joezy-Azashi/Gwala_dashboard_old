import { CircularProgress, Box } from "@mui/material";
import styled from "styled-components";
import { useLocale } from "../../locales";

const Div = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  .title {
    text-align: center;
    background-color: #d9edff;
    padding: 9px;
  }
  .title,
  .childs {
    background: #d9edff;
    border-radius: 22px;
    font-weight: 600;
    font-size: 0, 875rem;
    line-height: 17px;
    color: #002b69;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .childs {
    padding: 18px;
  }
  .List {
    display: flex;
    justify-content: space-between;
    font-weight: 500;
  }
  .voir {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: underline;
    margin-top: 15px;
    > span {
      cursor: pointer;
    }
  }
`;
const Card = ({ array, title, loading, voir, voirFunc }) => {
  const { formatMessage } = useLocale();
  return (
    <Div>
      <div className="title">{title}</div>
      <div className="childs">
        {loading ?
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "7.8rem" }}>
            <CircularProgress
              size={20}
              sx={{
                color: "var(--color-dark-blue) !important",
              }}
            />
          </Box> :
          array?.length < 1 ?
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "7rem",
                fontSize: "1.2rem",
              }}
            >
              {formatMessage({ id: "advance.norecords" })}
            </div> :
            array?.map((el, key) => (
              <div className="List" key={key}>
                <div>
                  {el.user.firstName} {el.user.lastName}
                </div>
                <div>{el.amount}</div>
              </div>
            ))}
        {voir && (
          <div className="voir">
            <span onClick={voirFunc}>{formatMessage({ id: "stats.seeAll" })}</span>
          </div>
        )}
      </div>
    </Div>
  );
};

export default Card;
