import styled from "styled-components";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useLocale } from "../../locales";

const Div = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 190px;
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
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    > select {
      background: none;
      border: none;
    }
  }
  .childs {
    canvas {
      width: 100%;
      height: 100%;
      max-width: 507px;
      max-height: 190px;
      margin: 15px;
    }
    display: flex;
    justify-content: center;
    align-items: center;
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

ChartJS.register(ArcElement, Tooltip, Legend);
const CircleChart = ({ verified, pending }) => {
  const { formatMessage } = useLocale();

  const [dataChart, setData] = useState({
    labels: ["Verified: ", "not Verified: "],
    datasets: [],
  });
  useEffect(() => {
    setData({
      labels: [`Verified: ${verified}`, `not Verified: ${pending}`],

      datasets: [
        {
          label: "",
          data: [verified, pending],
          backgroundColor: ["#54d579", "#ff8f84"],
          borderColor: ["#54d579", "#ff8f84"],
          borderWidth: 1,
        },
      ],
    });
  }, [verified, pending]);

  return (
    <Div>
      <div className="title">
        <span>{formatMessage({ id: "statsnombre.home" })}</span>
      </div>
      <div className="childs">
        {dataChart && <Doughnut data={dataChart} redraw={true} />}
      </div>
    </Div>
  );
};

export default CircleChart;
