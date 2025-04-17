import React, { useState } from "react"
import { CircularProgress, Box, Tab, Typography, Badge } from "@mui/material";
import styled from "styled-components";
import { useLocale } from "../../locales";
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { NavLink } from "react-router-dom";
import moment from "moment/moment";
import { getAllWorkdaysCurrentUser } from "../../api";

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
    // padding: 18px;
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
const TimeTrackingCard = () => {
    const { formatMessage } = useLocale();
    const [tabIndex, setTabIndex] = useState('1')

    const tabHandler = (e, val) => {
        setTabIndex(val)
    }

    const getAllTimeTrackingWorking = getAllWorkdaysCurrentUser(moment().startOf('day').toISOString(), moment().endOf('day').toISOString(), "WORKING");
    const getAllTimeTrackingPause = getAllWorkdaysCurrentUser(moment().startOf('day').toISOString(), moment().endOf('day').toISOString(), "ON_PAUSE");
    const getAllTimeTrackingFinished = getAllWorkdaysCurrentUser(moment().startOf('day').toISOString(), moment().endOf('day').toISOString(), "FINISHED");

    return (
        <Div>
            <div className="title">{formatMessage({ id: "timetracker.title" })}</div>
            <div className="childs">
                <TabContext value={tabIndex}>
                    <TabList fullWidth onChange={tabHandler}
                        sx={{
                            '& .MuiTabs-indicator': { backgroundColor: tabIndex === "1" ? "#09833A" : tabIndex === "2" ? "#F4A125" : "#F33124" },
                            '& .Mui-selected': { backgroundColor: "#87CEFA !important", color: tabIndex === "1" ? "#09833A !important" : tabIndex === "2" ? "#F4A125 !important" : "#F33124 !important", width: "33.33%", borderRadius: tabIndex === "1" ? "22px 0 0 0" : tabIndex === "3" ? "0 22px 0 0" : "" },
                            '& .MuiTab-root': { color: "#B0B6C3", textTransform: "capitalize", fontWeight: "600", width: "33.33%" }
                        }}
                    >
                        <Tab label={<Badge badgeContent={getAllTimeTrackingWorking?.allWorkDays?.docs?.filter((ft) => ft?.status === "WORKING")?.length} max={9} sx={{ '& .MuiBadge-badge': { backgroundColor: tabIndex === "1" ? "#09833A" : "#B0B6C3", color: "#fff", left: "45px" } }}>{formatMessage({ id: "timetracker.working" })}</Badge>} value="1" />
                        <Tab label={<Badge badgeContent={getAllTimeTrackingPause?.allWorkDays?.docs?.filter((ft) => ft?.status === "ON_PAUSE")?.length} max={9} sx={{ '& .MuiBadge-badge': { backgroundColor: tabIndex === "2" ? "#F4A125" : "#B0B6C3", color: "#fff", left: "32px" } }}>{formatMessage({ id: "timetracker.pause" })}</Badge>} value="2" />
                        <Tab label={<Badge badgeContent={getAllTimeTrackingFinished?.allWorkDays?.docs?.filter((ft) => ft?.status === "FINISHED")?.length} max={9} sx={{ '& .MuiBadge-badge': { backgroundColor: tabIndex === "3" ? "#F33124" : "#B0B6C3", color: "#fff", left: "48px" } }}>{formatMessage({ id: "timetracker.finish" })}</Badge>} value="3" />
                    </TabList>

                    <TabPanel value='1' sx={{ padding: ".4rem 24px" }}>
                        {getAllTimeTrackingWorking?.loading ?
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "7rem" }}>
                                <CircularProgress
                                    size={20}
                                    sx={{
                                        color: "var(--color-dark-blue) !important",
                                    }}
                                />
                            </Box> :
                            getAllTimeTrackingWorking?.allWorkDays?.docs?.filter((ft) => ft?.status === "WORKING")?.length < 1 ?
                                <Typography variant="h6" textAlign={"center"} color={"var(--color-dark-blue)"} fontWeight={600} my={2}>{formatMessage({ id: "timetracker.norecord" })}s</Typography> :
                                getAllTimeTrackingWorking?.allWorkDays?.docs?.filter((ft) => ft?.status === "WORKING")?.slice(0, 4)?.map((el, index) => {
                                    return (
                                        <Box key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} mb={3}>
                                            <Box>
                                                <Typography fontWeight={600} textTransform={"capitalize"}>{el?.user?.firstName} <span style={{ textTransform: "uppercase" }}>{el?.user?.lastName}</span></Typography>
                                                {/* <Box>
                                            <span style={{ borderRadius: "50%", backgroundColor: '#09833A', color: "#fff", padding: "5px", fontSize: "8px", marginRight: "4px" }}>1st</span>
                                            <span style={{ fontSize: "11px" }}>9:28am</span>
                                        </Box> */}
                                            </Box>

                                            <Box>
                                                <Typography fontSize={"15px"} fontWeight={"bold"}>{Math.floor(el?.totalWorkedTime?.workedMinutes / 60)}h {el?.totalWorkedTime?.workedMinutes % 60}min</Typography>
                                            </Box>
                                        </Box>
                                    )
                                })}
                    </TabPanel>

                    <TabPanel value='2' sx={{ padding: ".4rem 24px" }}>
                        {getAllTimeTrackingPause?.loading ?
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "7rem" }}>
                                <CircularProgress
                                    size={20}
                                    sx={{
                                        color: "var(--color-dark-blue) !important",
                                    }}
                                />
                            </Box> :
                            getAllTimeTrackingPause?.allWorkDays?.docs?.filter((ft) => ft?.status === "ON_PAUSE")?.length < 1 ?
                                <Typography variant="h6" textAlign={"center"} color={"var(--color-dark-blue)"} fontWeight={600} my={2}>{formatMessage({ id: "timetracker.norecord" })}s</Typography> :
                                getAllTimeTrackingPause?.allWorkDays?.docs?.filter((ft) => ft?.status === "ON_PAUSE")?.map((el, index) => {
                                    return (
                                        <Box key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} mb={3}>
                                            <Box>
                                                <Typography fontWeight={600} textTransform={"capitalize"}>{el?.user?.firstName} <span style={{ textTransform: "uppercase" }}>{el?.user?.lastName}</span></Typography>
                                                {/* <Box>
                                            <span style={{ borderRadius: "50%", backgroundColor: '#F4A125', color: "#fff", padding: "5px", fontSize: "8px", marginRight: "4px" }}>1st</span>
                                            <span style={{ fontSize: "11px" }}>9:28am</span>
                                        </Box> */}
                                            </Box>

                                            <Box>
                                                {/* <Typography fontSize={"15px"} fontWeight={"bold"}>{parseFloat(el?.totalWorkedTime?.workedHours.toFixed(2))}h {parseFloat(el?.totalWorkedTime?.workedMinutes.toFixed(2))}min</Typography> */}
                                                <Typography fontSize={"15px"} fontWeight={"bold"}>{Math.floor(el?.totalWorkedTime?.workedMinutes / 60)}h {el?.totalWorkedTime?.workedMinutes % 60}min</Typography>
                                            </Box>
                                        </Box>
                                    )
                                })}
                    </TabPanel>

                    <TabPanel value='3' sx={{ padding: ".4rem 24px" }}>
                        {getAllTimeTrackingFinished?.loading ?
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "7rem" }}>
                                <CircularProgress
                                    size={20}
                                    sx={{
                                        color: "var(--color-dark-blue) !important",
                                    }}
                                />
                            </Box> :
                            getAllTimeTrackingFinished?.allWorkDays?.docs?.filter((ft) => ft?.status === "FINISHED")?.length < 1 ?
                                <Typography variant="h6" textAlign={"center"} color={"var(--color-dark-blue)"} fontWeight={600} my={2}>{formatMessage({ id: "timetracker.norecord" })}s</Typography> :
                                getAllTimeTrackingFinished?.allWorkDays?.docs?.filter((ft) => ft?.status === "FINISHED")?.slice(0, 4)?.map((el, index) => {
                                    return (
                                        <Box key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} mb={3}>
                                            <Box>
                                                <Typography fontWeight={600} textTransform={"capitalize"}>{el?.user?.firstName} <span style={{ textTransform: "uppercase" }}>{el?.user?.lastName}</span></Typography>
                                                {/* <Box>
                                            <span style={{ borderRadius: "50%", backgroundColor: '#F33124', color: "#fff", padding: "5px", fontSize: "8px", marginRight: "4px" }}>1st</span>
                                            <span style={{ fontSize: "11px" }}>9:28am</span>
                                        </Box> */}
                                            </Box>

                                            <Box>
                                                <Typography fontSize={"15px"} fontWeight={"bold"}>{Math.floor(el?.totalWorkedTime?.workedMinutes / 60)}h {el?.totalWorkedTime?.workedMinutes % 60}min</Typography>
                                            </Box>
                                        </Box>
                                    )
                                })}
                    </TabPanel>
                    <NavLink to={'/timetracker'} style={{ textAlign: "center", marginBottom: "1rem", color: "var(--color-dark-blue)" }}>{formatMessage({ id: "timetracker.seeall" })}</NavLink>
                </TabContext>
            </div>
        </Div >
    );
};

export default TimeTrackingCard;
