import React, { useState } from "react";
import { Tab, Box, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import moment from "moment";
import { ArrowForwardIos, ArrowBackIosNew } from '@mui/icons-material';
import { getTimeTrackingStatistics } from "../../api";
import { useParams } from "react-router";
import SessionChart from "../Sessionchart";

function TimeTrackingStepperYearly({ name }) {
    const { id } = useParams()

    const [selectedDate, setSelectedDate] = useState(moment().year(moment().year()).format('YYYY-MM-DD'))
    const [subtabIndex, setSubTabIndex] = useState("" + Math.floor(moment(selectedDate).year() % 5))
    const yearDates = [1, 2, 3, 4, 5].map(x => moment().year((Math.floor((moment(selectedDate).year() - 1) / 5) * 5) + x))
    const getYearlyWorkDay = getTimeTrackingStatistics(id, moment(selectedDate).startOf('year').toISOString(), moment(selectedDate).endOf('year').toISOString(), "YEARLY")

    const tabSubHandler = (e, val) => {
        setSubTabIndex(val)
    }

    var decimalTimeString = getYearlyWorkDay?.statistics?.totalWorkedHours;
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
                        '& .MuiTabs-scroller': { backgroundColor: "var(--color-dark-blue)", padding: ".7rem 0", height: "4.7rem" },
                        '& .Mui-selected': { color: "#fff !important" },
                        '& .MuiTab-root': { color: "#B0B6C3", padding: "0px 30px !important", textTransform: "capitalize", fontWeight: "600" },
                        '& .MuiTabs-flexContainer': { justifyContent: "center", alignItems: "start" }
                    }}
                >
                    <span style={{ cursor: 'pointer' }} onClick={() => { setSelectedDate((moment(selectedDate).subtract(5, 'year')).format('YYYY-MM-DD')) }}>
                        <ArrowBackIosNew sx={{ color: "#fff", marginTop: '1rem' }} />
                    </span>
                    {yearDates.map((el, index) => {
                        return (
                            <Tab
                                key={index}
                                label={
                                    <div>
                                        <Typography fontSize={".9rem"} fontWeight={600}>
                                            {el.startOf('year').format("YYYY")}
                                        </Typography>
                                        {subtabIndex == index + 1 ?
                                            <Typography fontSize={".8rem"} textTransform={"lowercase"}>
                                                {getYearlyWorkDay.loading ? null :
                                                    getYearlyWorkDay?.statistics?.totalWorkedHours === undefined ? null :
                                                        <>{hours}h {minutes}min</>
                                                }
                                            </Typography> :
                                            null
                                        }
                                    </div>
                                }
                                value={(index + 1).toString()}
                                onClick={() => setSelectedDate(el.format('YYYY-MM-DD'))}
                            />
                        )
                    })
                    }
                    <span style={{ cursor: 'pointer' }} onClick={() => { setSelectedDate((moment(selectedDate).add(5, 'year')).format('YYYY-MM-DD')) }} >
                        <ArrowForwardIos sx={{ color: "#fff", marginTop: '1rem' }} />
                    </span>
                </TabList>

                <TabPanel value="1">
                    <SessionChart
                        values={getYearlyWorkDay}
                        type={"yearly"}
                        startDate={moment(selectedDate).startOf('year').toISOString()}
                        endDate={moment(selectedDate).endOf('year').toISOString()}
                    />
                </TabPanel>

                <TabPanel value="2">
                    <SessionChart
                        values={getYearlyWorkDay}
                        type={"yearly"}
                        id={id}
                        startDate={moment(selectedDate).startOf('year').toISOString()}
                        endDate={moment(selectedDate).endOf('year').toISOString()}
                    />
                </TabPanel>

                <TabPanel value="3">
                    <SessionChart
                        values={getYearlyWorkDay}
                        type={"yearly"}
                        id={id}
                        startDate={moment(selectedDate).startOf('year').toISOString()}
                        endDate={moment(selectedDate).endOf('year').toISOString()}
                    />
                </TabPanel>
                <TabPanel value="4">
                    <SessionChart
                        values={getYearlyWorkDay}
                        type={"yearly"}
                        id={id}
                        startDate={moment(selectedDate).startOf('year').toISOString()}
                        endDate={moment(selectedDate).endOf('year').toISOString()}
                    />
                </TabPanel>
                <TabPanel value="5">
                    <SessionChart
                        values={getYearlyWorkDay}
                        type={"yearly"}
                        id={id}
                        startDate={moment(selectedDate).startOf('year').toISOString()}
                        endDate={moment(selectedDate).endOf('year').toISOString()}
                    />
                </TabPanel>
            </TabContext>
        </Box>
    );
}

export default TimeTrackingStepperYearly;