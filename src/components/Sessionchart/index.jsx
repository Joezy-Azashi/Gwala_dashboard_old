import React from "react";
import styled from "styled-components";
import { Bar } from "react-chartjs-2";
import { Grid, Box, Typography } from '@mui/material';
import arrow from "../../assets/arrowdown.svg"
import ExportTimeTrackerReport from '../TimeTracker/ExportTimeTrackerReport';
import PageSpinner from "../pagespinner/PageSpinner";
import { useLocale } from "../../locales";
import moment from "moment";

const Div = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: "10px";
  .title {
    text-align: center;
    background-color: #d9edff;
    padding: 9px;
  }
  .title,
  .childs {
    background: #fff;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    padding: 30px;
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

function SessionChart({ values, type, id, startDate, endDate }) {
  const { formatMessage } = useLocale();

  let arr = []
  if (values?.statistics?.statistics) {
    arr = Object?.values(values?.statistics?.statistics)
  }

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
      // y: {
      //   grid: {
      //     display: false,
      //   },
      // },
    },
  };

  const labels = [
    ...type === "yearly" ? [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ] : [],
    ...type === "weekly" ? [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ] : [],
    ...type === "monthly" ? [
      "Day 1",
      "Day 2",
      "Day 3",
      "Day 4",
      "Day 5",
      "Day 6",
      "Day 7",
      "Day 8",
      "Day 9",
      "Day 10",
      "Day 11",
      "Day 12",
      "Day 13",
      "Day 14",
      "Day 15",
      "Day 16",
      "Day 17",
      "Day 18",
      "Day 19",
      "Day 20",
      "Day 21",
      "Day 22",
      "Day 23",
      "Day 24",
      "Day 25",
      "Day 26",
      "Day 27",
      "Day 28",
      "Day 29",
      "Day 30",
      "Day 31",
    ] : [],
  ]

  const data = {
    labels,
    datasets: [
      {
        label: "Hours",
        data: arr,
        backgroundColor: "#002b69",
        borderWidth: 1,
        barThickness: 10,
        borderRadius: 50,
      },
    ],
  };

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3} lg={3} />
        <Grid item xs={12} sm={12} md={6} lg={6}>
          {values?.loading ?
            <Box sx={{ display: "flex", justifyContent: "center" }} mt={5}><PageSpinner /></Box> :
            <Div>
              <div className="childs">
                <Typography
                  variant="h6"
                  fontWeight={"600"}
                  color={"black"}
                  width={"100%"}
                >
                  {formatMessage({ id: "timetracker.workedhours" })}
                </Typography>
                <Bar
                  options={options}
                  data={data}
                  redraw={true}
                  updateMode="resize"
                />
              </div>


            </Div>
          }
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={3} />
      </Grid>
      <ExportTimeTrackerReport
        id={id}
        startDate={startDate}
        endDate={endDate}
      />
    </Box>
  );
}

export default SessionChart;
