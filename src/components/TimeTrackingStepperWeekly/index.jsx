import React, { useState } from "react";
import { Tab, Box, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import moment from "moment";
import { ArrowForwardIos, ArrowBackIosNew } from '@mui/icons-material';
import { getTimeTrackingStatistics } from "../../api";
import { useParams } from "react-router";
import SessionChart from "../Sessionchart";

function TimeTrackingStepperWeekly({ name }) {
    const { id } = useParams()

    const [selectedDate, setSelectedDate] = useState(moment().week(moment().week()).format('YYYY-MM-DD'))
    const [subtabIndex, setSubTabIndex] = useState("" + Math.floor(moment(selectedDate).week() % 5))
    const weekDates = [1, 2, 3, 4, 5].map(x => moment().week((Math.floor((moment(selectedDate).week() -1) / 5) * 5) + x))
    const getWeeklyWorkDay = getTimeTrackingStatistics(id, moment(selectedDate).startOf('week').add(1, 'day').format('YYYY/MM/DD'), moment(selectedDate).endOf('week').add(1, 'day').format('YYYY/MM/DD'), "WEEKLY")

    const tabSubHandler = (e, val) => {
        setSubTabIndex(val)
    }

    var decimalTimeString = getWeeklyWorkDay?.statistics?.totalWorkedHours;
    var decimalTime = parseFloat(decimalTimeString);
    decimalTime = decimalTime * 60 * 60;
    var hours = Math.floor((decimalTime / (60 * 60)));
    decimalTime = decimalTime - (hours * 60 * 60);
    var minutes = Math.floor((decimalTime / 60));

    return (
        <Box>
            <TabContext value={subtabIndex} sx={{ overflow: "auto" }}>
                <TabList onChange={tabSubHandler}
                    sx={{
                        '& .MuiTabs-indicator': { backgroundColor: "#fff", height: "3px" },
                        '& .MuiTabs-scroller': { backgroundColor: "var(--color-dark-blue)", padding: ".7rem 0", height: "5.7rem" },
                        '& .Mui-selected': { color: "#fff !important" },
                        '& .MuiTab-root': { color: "#B0B6C3", padding: "0px 15px !important", textTransform: "capitalize", fontWeight: "600" },
                        '& .MuiTabs-flexContainer': { justifyContent: "center", alignItems: "start" }
                    }}
                >
                    <span style={{ cursor: 'pointer' }} onClick={() => { setSelectedDate((moment(selectedDate).subtract(5, 'week')).format('YYYY-MM-DD')) }}>
                        <ArrowBackIosNew sx={{ color: "#fff", marginTop: '1rem' }} />
                    </span>
                    {weekDates.map((el, index) => {
                        return (
                            <Tab
                                key={index}
                                label={
                                    <div>
                                        <Typography fontSize={"1rem"} fontWeight={600}>
                                            {el?.startOf('week').add(1, 'day').format('DD MMM')} - {el.endOf('week').add(1, 'day').format('DD MMM')}
                                        </Typography>
                                        <Typography fontSize={".9rem"} fontWeight={600}>
                                            {el.startOf('week').format("YYYY")}
                                        </Typography>
                                        {subtabIndex == index + 1 ?
                                            <Typography fontSize={".8rem"} textTransform={"lowercase"}>
                                                {getWeeklyWorkDay.loading ? null :
                                                    getWeeklyWorkDay?.statistics?.totalWorkedHours === undefined ? null :
                                                        <>{hours}h {minutes}min</>
                                                }
                                            </Typography> :
                                            null
                                        }
                                    </div>
                                }
                                value={(index + 1).toString()}
                                onClick={() => setSelectedDate(el.startOf('week').subtract(1, 'day').format('YYYY-MM-DD'))}
                            />
                        )
                    })
                    }
                    <span style={{ cursor: 'pointer' }} onClick={() => { setSelectedDate((moment(selectedDate).add(5, 'week')).format('YYYY-MM-DD')) }} >
                        <ArrowForwardIos sx={{ color: "#fff", marginTop: '1rem' }} />
                    </span>
                </TabList>

                <TabPanel value="1">
                    <SessionChart
                        values={getWeeklyWorkDay}
                        type={"weekly"}
                        id={id}
                        startDate={moment(selectedDate).startOf('isoweek').toISOString()}
                        endDate={moment(selectedDate).endOf('isoweek').toISOString()}
                    />
                </TabPanel>

                <TabPanel value="2">
                    <SessionChart
                        values={getWeeklyWorkDay}
                        type={"weekly"}
                        id={id}
                        startDate={moment(selectedDate).startOf('isoweek').toISOString()}
                        endDate={moment(selectedDate).endOf('isoweek').toISOString()}
                    />
                </TabPanel>

                <TabPanel value="3">
                    <SessionChart
                        values={getWeeklyWorkDay}
                        type={"weekly"}
                        id={id}
                        startDate={moment(selectedDate).startOf('isoweek').toISOString()}
                        endDate={moment(selectedDate).endOf('isoweek').toISOString()}
                    />
                </TabPanel>
                <TabPanel value="4">
                    <SessionChart
                        values={getWeeklyWorkDay}
                        type={"weekly"}
                        id={id}
                        startDate={moment(selectedDate).startOf('isoweek').toISOString()}
                        endDate={moment(selectedDate).endOf('isoweek').toISOString()}
                    />
                </TabPanel>
                <TabPanel value="5">
                    <SessionChart
                        values={getWeeklyWorkDay}
                        type={"weekly"}
                        id={id}
                        startDate={moment(selectedDate).startOf('isoweek').toISOString()}
                        endDate={moment(selectedDate).endOf('isoweek').toISOString()}
                    />
                </TabPanel>
            </TabContext>
        </Box>
    );
}

export default TimeTrackingStepperWeekly;