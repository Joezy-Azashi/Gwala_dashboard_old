import styled from "styled-components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { getAdvancesByDay } from "../../api/index";
import axios from "../../api/request";
import { useLocale } from "../../locales";
import { Select, MenuItem, Box } from "@mui/material";

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
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    > select {
      background: none;
      border: none;
    }
  }
  @media (max-width: 600px) {
    .title {
      display: block;
      > select {
        margin-top: 15px;
      }
    }
  }
  .childs {
    canvas {
      width: 100%;
      height: 100%;
      max-width: 507px;
      max-height: 807px;
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

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
      text: "",
    },
  },
};
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
function sortObjectsByDate(objects) {
  objects?.sort((a, b) => new Date(a.date) - new Date(b.date));
  return objects;
}

const ChartCard = () => {
  const result = getAdvancesByDay(30);
  const { formatMessage } = useLocale();
  const [dataChart, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "Amount",
        data: [],
        backgroundColor: ["#002b69"],
      },
    ],
  });
  const [select, setSelect] = useState(30);
  const getNewData = async (number) => {
    setSelect(number);
    let data = {
      labels: [],
      datasets: [
        {
          label: "Amount",
          data: [],
          backgroundColor: ["#002b69"],
        },
      ],
    };
    const newData = await axios.get(`/statistics/advances/by/${number}/days`);
    if (newData) {
      let sortData = sortObjectsByDate(newData?.data);
      sortData?.map((el) => {
        data.labels.push(el.date);
        data.datasets[0].data.push(el.amount);
      });
      setData(data);
    }
  };
  useEffect(() => {
    let data = {
      labels: [],
      datasets: [
        {
          label: "Amount",
          data: [],
          backgroundColor: ["#002b69"],
        },
      ],
    };
    if (result?.data) {
      let sortData = sortObjectsByDate(result?.data?.data);
      sortData?.map((el) => {
        data.labels.push(el.date);
        data.datasets[0].data.push(el.amount);
      });
      setData(data);
    }
  }, [result?.data]);

  return (
    <Div>
      <div className="title">
        <span>{formatMessage({ id: "statstransaction.home" })}</span>
        <Select
          id="languageSelect"
          variant="standard"
          size="small"
          value={select}
          onChange={(e) => getNewData(e.target.value)}
          renderValue={() => {
            return (
              <span style={{ backgroundColor: "var(--color-cyan-light)" }}>
                {select === 30 && formatMessage({ id: "last30d.home" })}
                {select === 15 && formatMessage({ id: "last15d.home" })}
                {select === 7 && formatMessage({ id: "last7d.home" })}
              </span>
            );
          }}
          disableUnderline
          className="w-[135px]"
          sx={{
            "& .MuiSelect-select": {
              display: "flex",
              padding: "0",
              backgroundColor: "#fff",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "0",
              margin: "0",
            },
            "& .MuiSvgIcon-root": {
              backgroundColor: "var(--color-cyan-light)",
            },
          }}
        >
          <MenuItem value={30}>
            {formatMessage({ id: "last30d.home" })}
          </MenuItem>
          <MenuItem value={15}>
            {formatMessage({ id: "last15d.home" })}
          </MenuItem>
          <MenuItem value={7}>{formatMessage({ id: "last7d.home" })}</MenuItem>
        </Select>
      </div>
      <div className="childs">
        {dataChart && <Bar options={options} data={dataChart} redraw={true} />}
      </div>
    </Div>
  );
};

export default ChartCard;
