import React, { useState } from "react";
import { Tab, Box, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import SessionCard from "../UI/SessionCard";
import moment from "moment";
import absent from "../../assets/absent.png"
import { ArrowForwardIos, ArrowBackIosNew } from '@mui/icons-material';
import { getDailyWorkdays } from "../../api";
import { useParams } from "react-router";
import PageSpinner from "../pagespinner/PageSpinner";
import { useLocale } from "../../locales";
import ExportTimeTrackerReport from "../TimeTracker/ExportTimeTrackerReport";
import { useEffect } from "react";

function TimeTrackingStepperDaily({ name, selectDay }) {
    const { id } = useParams()
    const { formatMessage } = useLocale();

    const [selectedDate, setSelectedDate] = useState()
    const [subtabIndex, setSubTabIndex] = useState(moment(selectedDate).day().toString() === "0" ? "7" : moment(selectedDate).day().toString())
    const [getData, setGetData] = useState(0)

    var startDate;
    var endDate;

    if (moment(selectedDate).format('dddd') === "Sunday") {
        startDate = moment(selectedDate).startOf('week')
        endDate = moment(selectedDate).endOf('week')
    } else {
        startDate = moment(selectedDate).startOf('week')
        endDate = moment(selectedDate).endOf('week')
    }

    useEffect(() => {
        setSelectedDate(moment(selectDay).day().toString() === "0" ? moment(selectDay).subtract(1, 'week').format('YYYY-MM-DD') : moment(selectDay).format('YYYY-MM-DD'))
        startDate = moment(selectDay).startOf('week')
        endDate = moment(selectDay).endOf('week')
        setSubTabIndex(moment(selectDay).day().toString() === "0" ? "7" : moment(selectDay).day().toString())
    }, [selectDay])

    const getDailyWorkDay = getDailyWorkdays(id, moment(selectedDate).startOf('day').toISOString(), moment(selectedDate).endOf('day').toISOString(), getData)

    let currentDate = startDate
    let dates = []
    while (currentDate.unix() < endDate.unix()) {
        let x = currentDate.add(1, 'day')
        dates.push({ label: x.format('dddd'), date: x.clone() })
    }

    const tabSubHandler = (e, val) => {
        setSubTabIndex(val)
    }

    let sessionData = []
    let statusData = []
    getDailyWorkDay?.workDays?.docs?.map((el) => el.sessions.map((data) => sessionData.push(data)))
    getDailyWorkDay?.workDays?.docs?.map((el) => { el.sessions?.length < 1 ? statusData.push(el?.status) : "" })

    var decimalTimeString = getDailyWorkDay?.workDays?.docs[0]?.totalWorkedTime?.workedSeconds;
    var hours = Math.floor(decimalTimeString / 3600)
    var minutes = Math.floor((decimalTimeString - (hours * 3600)) / 60)
    var seconds = decimalTimeString - (hours * 3600) - (minutes * 60)

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
                    <span style={{ cursor: 'pointer' }} onClick={() => { setSelectedDate((moment(selectedDate).subtract(1, 'week')).format('YYYY-MM-DD')) }}>
                        <ArrowBackIosNew sx={{ color: "#fff", marginTop: '1rem' }} />
                    </span>
                    {dates.map((el, index) => {
                        return (
                            <Tab
                                key={index}
                                label={
                                    <div>
                                        <Typography fontSize={"1.3rem"} fontWeight={600}>
                                            {el.label}
                                        </Typography>
                                        <Typography fontSize={".9rem"} fontWeight={600}>{(el.date).format('DD MMM YYYY')}</Typography>
                                        {subtabIndex == index + 1 ?
                                            <Typography fontSize={".8rem"} textTransform={"lowercase"}>
                                                {getDailyWorkDay.loading ? null :
                                                    getDailyWorkDay?.workDays?.docs[0]?.totalWorkedTime?.workedMinutes === undefined ? null :
                                                        <>{hours}h {minutes}min {seconds}sec</>
                                                }
                                            </Typography> :
                                            null
                                        }
                                    </div>
                                }
                                value={(index + 1).toString()}
                                onClick={() => setSelectedDate((el.date).format('YYYY-MM-DD'))}
                            />
                        )
                    })
                    }
                    <span style={{ cursor: 'pointer' }} onClick={() => { setSelectedDate((moment(selectedDate).add(1, 'week')).format('YYYY-MM-DD')) }} >
                        <ArrowForwardIos sx={{ color: "#fff", marginTop: '1rem' }} />
                    </span>
                </TabList>

                <TabPanel value="1" sx={{ paddingBottom: "0" }}>
                    {getDailyWorkDay.loading ?
                        <Box sx={{ display: "flex", justifyContent: "center" }} mt={5}><PageSpinner /></Box> :
                        getDailyWorkDay?.workDays?.docs?.length < 1 ?
                            <Typography variant="h5" fontWeight={550} color={"var(--color-dark-blue)"} mt={5} textAlign={"center"}>
                                {formatMessage({ id: "timetracker.norecord" })}
                            </Typography> :
                            getDailyWorkDay?.workDays?.docs?.length > 0 && sessionData?.length < 1 ?
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography variant="h5" fontWeight={550} color={"var(--color-dark-blue)"} mb={2}>Oops, <span style={{ textTransform: "capitalize" }}>{name}</span> {statusData[0] === "ON_VACATION" ? formatMessage({ id: "timetracker.onvacation" }) : statusData[0] === "ABSENT" ? formatMessage({ id: "timetracker.absent" }) : statusData[0]}</Typography>
                                    <img src={absent} width={150} alt="icon" />
                                    <Typography variant="h5" fontWeight={550} color={"var(--color-dark-blue)"} mt={2}>
                                        {/* Absent Status: <span style={{ color: "green" }}>Justified</span> */}
                                    </Typography>
                                </Box> :
                                <>
                                    <Box sx={{ height: { sm: "33vh", xl: "53vh" }, overflow: 'auto' }}>
                                        {sessionData.sort(function (a, b) { return a.session_start.localeCompare(b.session_start) }).reverse().map((el, index) => {
                                            let num = sessionData?.length
                                            return (
                                                <span key={index}>
                                                    <SessionCard
                                                        el={el}
                                                        sessionNum={num - index}
                                                        description={el?.session_description}
                                                        clockIn={el?.session_start}
                                                        clockOut={el?.session_end}
                                                        time={el?.workedTimeInSeconds}
                                                        user={getDailyWorkDay?.workDays?.docs[0]?.user}
                                                        setGetData={setGetData}
                                                        getData={getData}
                                                    />
                                                </span>
                                            );
                                        })}
                                    </Box>
                                    <ExportTimeTrackerReport
                                        id={id}
                                        startDate={moment(selectedDate).startOf('day').toISOString()}
                                        endDate={moment(selectedDate).endOf('day').toISOString()}
                                    />
                                </>
                    }
                </TabPanel>

                <TabPanel value="2" sx={{ paddingBottom: "0" }}>
                    {getDailyWorkDay.loading ?
                        <Box sx={{ display: "flex", justifyContent: "center" }} mt={5}><PageSpinner /></Box> :
                        getDailyWorkDay?.workDays?.docs?.length < 1 ?
                            <Typography variant="h5" fontWeight={550} color={"var(--color-dark-blue)"} mt={5} textAlign={"center"}>
                                {formatMessage({ id: "timetracker.norecord" })}
                            </Typography> :
                            getDailyWorkDay?.workDays?.docs?.length > 0 && sessionData?.length < 1 ?
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography variant="h5" fontWeight={550} color={"var(--color-dark-blue)"} mb={2}>Oops, <span style={{ textTransform: "capitalize" }}>{name}</span> {statusData[0] === "ON_VACATION" ? formatMessage({ id: "timetracker.onvacation" }) : statusData[0] === "ABSENT" ? formatMessage({ id: "timetracker.absent" }) : statusData[0]}</Typography>
                                    <img src={absent} width={150} alt="icon" />
                                    <Typography variant="h5" fontWeight={550} color={"var(--color-dark-blue)"} mt={2}>
                                        {/* Absent Status: <span style={{ color: "green" }}>Justified</span> */}
                                    </Typography>
                                </Box> :
                                <>
                                    <Box sx={{ height: { sm: "33vh", xl: "53vh" }, overflow: 'auto' }}>
                                        {sessionData.sort(function (a, b) { return a.session_start.localeCompare(b.session_start) }).reverse().map((el, index) => {
                                            let num = sessionData?.length
                                            return (
                                                <span key={index}>
                                                    <SessionCard
                                                        el={el}
                                                        sessionNum={num - index}
                                                        description={el?.session_description}
                                                        clockIn={el?.session_start}
                                                        clockOut={el?.session_end}
                                                        time={el?.workedTimeInSeconds}
                                                        user={getDailyWorkDay?.workDays?.docs[0]?.user}
                                                        setGetData={setGetData}
                                                        getData={getData}
                                                    />
                                                </span>
                                            );
                                        })}
                                    </Box>
                                    <ExportTimeTrackerReport
                                        id={id}
                                        startDate={moment(selectedDate).startOf('day').toISOString()}
                                        endDate={moment(selectedDate).endOf('day').toISOString()}
                                    />
                                </>
                    }
                </TabPanel>

                <TabPanel value="3" sx={{ paddingBottom: "0" }}>
                    {getDailyWorkDay.loading ?
                        <Box sx={{ display: "flex", justifyContent: "center" }} mt={5}><PageSpinner /></Box> :
                        getDailyWorkDay?.workDays?.docs?.length < 1 ?
                            <Typography variant="h5" fontWeight={550} color={"var(--color-dark-blue)"} mt={5} textAlign={"center"}>
                                {formatMessage({ id: "timetracker.norecord" })}
                            </Typography> :
                            getDailyWorkDay?.workDays?.docs?.length > 0 && sessionData?.length < 1 ?
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography variant="h5" fontWeight={550} color={"var(--color-dark-blue)"} mb={2}>Oops, <span style={{ textTransform: "capitalize" }}>{name}</span> {statusData[0] === "ON_VACATION" ? formatMessage({ id: "timetracker.onvacation" }) : statusData[0] === "ABSENT" ? formatMessage({ id: "timetracker.absent" }) : statusData[0]}</Typography>
                                    <img src={absent} width={150} alt="icon" />
                                    <Typography variant="h5" fontWeight={550} color={"var(--color-dark-blue)"} mt={2}>
                                        {/* Absent Status: <span style={{ color: "green" }}>Justified</span> */}
                                    </Typography>
                                </Box> :
                                <>
                                    <Box sx={{ height: { sm: "33vh", xl: "53vh" }, overflow: 'auto' }}>
                                        {sessionData.sort(function (a, b) { return a.session_start.localeCompare(b.session_start) }).reverse().map((el, index) => {
                                            let num = sessionData?.length
                                            return (
                                                <span key={index}>
                                                    <SessionCard
                                                        el={el}
                                                        sessionNum={num - index}
                                                        description={el?.session_description}
                                                        clockIn={el?.session_start}
                                                        clockOut={el?.session_end}
                                                        time={el?.workedTimeInSeconds}
                                                        user={getDailyWorkDay?.workDays?.docs[0]?.user}
                                                        setGetData={setGetData}
                                                        getData={getData}
                                                    />
                                                </span>
                                            );
                                        })}
                                    </Box>
                                    <ExportTimeTrackerReport
                                        id={id}
                                        startDate={moment(selectedDate).startOf('day').toISOString()}
                                        endDate={moment(selectedDate).endOf('day').toISOString()}
                                    />
                                </>
                    }
                </TabPanel>
                <TabPanel value="4" sx={{ paddingBottom: "0" }}>
                    {getDailyWorkDay.loading ?
                        <Box sx={{ display: "flex", justifyContent: "center" }} mt={5}><PageSpinner /></Box> :
                        getDailyWorkDay?.workDays?.docs?.length < 1 ?
                            <Typography variant="h5" fontWeight={550} color={"var(--color-dark-blue)"} mt={5} textAlign={"center"}>
                                {formatMessage({ id: "timetracker.norecord" })}
                            </Typography> :
                            getDailyWorkDay?.workDays?.docs?.length > 0 && sessionData?.length < 1 ?
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography variant="h5" fontWeight={550} color={"var(--color-dark-blue)"} mb={2}>Oops, <span style={{ textTransform: "capitalize" }}>{name}</span> {statusData[0] === "ON_VACATION" ? formatMessage({ id: "timetracker.onvacation" }) : statusData[0] === "ABSENT" ? formatMessage({ id: "timetracker.absent" }) : statusData[0]}</Typography>
                                    <img src={absent} width={150} alt="icon" />
                                    <Typography variant="h5" fontWeight={550} color={"var(--color-dark-blue)"} mt={2}>
                                        {/* Absent Status: <span style={{ color: "green" }}>Justified</span> */}
                                    </Typography>
                                </Box> :
                                <>
                                    <Box sx={{ height: { sm: "33vh", xl: "53vh" }, overflow: 'auto' }}>
                                        {sessionData.sort(function (a, b) { return a.session_start.localeCompare(b.session_start) }).reverse().map((el, index) => {
                                            let num = sessionData?.length
                                            return (
                                                <span key={index}>
                                                    <SessionCard
                                                        el={el}
                                                        sessionNum={num - index}
                                                        description={el?.session_description}
                                                        clockIn={el?.session_start}
                                                        clockOut={el?.session_end}
                                                        time={el?.workedTimeInSeconds}
                                                        user={getDailyWorkDay?.workDays?.docs[0]?.user}
                                                        setGetData={setGetData}
                                                        getData={getData}
                                                    />
                                                </span>
                                            );
                                        })}
                                    </Box>
                                    <ExportTimeTrackerReport
                                        id={id}
                                        startDate={moment(selectedDate).startOf('day').toISOString()}
                                        endDate={moment(selectedDate).endOf('day').toISOString()}
                                    />
                                </>
                    }
                </TabPanel>
                <TabPanel value="5" sx={{ paddingBottom: "0" }}>
                    {getDailyWorkDay.loading ?
                        <Box sx={{ display: "flex", justifyContent: "center" }} mt={5}><PageSpinner /></Box> :
                        getDailyWorkDay?.workDays?.docs?.length < 1 ?
                            <Typography variant="h5" fontWeight={550} color={"var(--color-dark-blue)"} mt={5} textAlign={"center"}>
                                {formatMessage({ id: "timetracker.norecord" })}
                            </Typography> :
                            getDailyWorkDay?.workDays?.docs?.length > 0 && sessionData?.length < 1 ?
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography variant="h5" fontWeight={550} color={"var(--color-dark-blue)"} mb={2}>Oops, <span style={{ textTransform: "capitalize" }}>{name}</span> {statusData[0] === "ON_VACATION" ? formatMessage({ id: "timetracker.onvacation" }) : statusData[0] === "ABSENT" ? formatMessage({ id: "timetracker.absent" }) : statusData[0]}</Typography>
                                    <img src={absent} width={150} alt="icon" />
                                    <Typography variant="h5" fontWeight={550} color={"var(--color-dark-blue)"} mt={2}>
                                        {/* Absent Status: <span style={{ color: "green" }}>Justified</span> */}
                                    </Typography>
                                </Box> :
                                <>
                                    <Box sx={{ height: { sm: "33vh", xl: "53vh" }, overflow: 'auto' }}>
                                        {sessionData.sort(function (a, b) { return a.session_start.localeCompare(b.session_start) }).reverse().map((el, index) => {
                                            let num = sessionData?.length
                                            return (
                                                <span key={index}>
                                                    <SessionCard
                                                        el={el}
                                                        sessionNum={num - index}
                                                        description={el?.session_description}
                                                        clockIn={el?.session_start}
                                                        clockOut={el?.session_end}
                                                        time={el?.workedTimeInSeconds}
                                                        user={getDailyWorkDay?.workDays?.docs[0]?.user}
                                                        setGetData={setGetData}
                                                        getData={getData}
                                                    />
                                                </span>
                                            );
                                        })}
                                    </Box>
                                    <ExportTimeTrackerReport
                                        id={id}
                                        startDate={moment(selectedDate).startOf('day').toISOString()}
                                        endDate={moment(selectedDate).endOf('day').toISOString()}
                                    />
                                </>
                    }
                </TabPanel>
                <TabPanel value="6" sx={{ paddingBottom: "0" }}>
                    {getDailyWorkDay.loading ?
                        <Box sx={{ display: "flex", justifyContent: "center" }} mt={5}><PageSpinner /></Box> :
                        getDailyWorkDay?.workDays?.docs?.length < 1 ?
                            <Typography variant="h5" fontWeight={550} color={"var(--color-dark-blue)"} mt={5} textAlign={"center"}>
                                {formatMessage({ id: "timetracker.norecord" })}
                            </Typography> :
                            getDailyWorkDay?.workDays?.docs?.length > 0 && sessionData?.length < 1 ?
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography variant="h5" fontWeight={550} color={"var(--color-dark-blue)"} mb={2}>Oops, <span style={{ textTransform: "capitalize" }}>{name}</span> {statusData[0] === "ON_VACATION" ? formatMessage({ id: "timetracker.onvacation" }) : statusData[0] === "ABSENT" ? formatMessage({ id: "timetracker.absent" }) : statusData[0]}</Typography>
                                    <img src={absent} width={150} alt="icon" />
                                    <Typography variant="h5" fontWeight={550} color={"var(--color-dark-blue)"} mt={2}>
                                        {/* Absent Status: <span style={{ color: "green" }}>Justified</span> */}
                                    </Typography>
                                </Box> :
                                <>
                                    <Box sx={{ height: { sm: "33vh", xl: "53vh" }, overflow: 'auto' }}>
                                        {sessionData.sort(function (a, b) { return a.session_start.localeCompare(b.session_start) }).reverse().map((el, index) => {
                                            let num = sessionData?.length
                                            return (
                                                <span key={index}>
                                                    <SessionCard
                                                        el={el}
                                                        sessionNum={num - index}
                                                        description={el?.session_description}
                                                        clockIn={el?.session_start}
                                                        clockOut={el?.session_end}
                                                        time={el?.workedTimeInSeconds}
                                                        user={getDailyWorkDay?.workDays?.docs[0]?.user}
                                                        setGetData={setGetData}
                                                        getData={getData}
                                                    />
                                                </span>
                                            );
                                        })}
                                    </Box>
                                    <ExportTimeTrackerReport
                                        id={id}
                                        startDate={moment(selectedDate).startOf('day').toISOString()}
                                        endDate={moment(selectedDate).endOf('day').toISOString()}
                                    />
                                </>
                    }
                </TabPanel>
                <TabPanel value="7" sx={{ paddingBottom: "0" }}>
                    {getDailyWorkDay.loading ?
                        <Box sx={{ display: "flex", justifyContent: "center" }} mt={5}><PageSpinner /></Box> :
                        getDailyWorkDay?.workDays?.docs?.length < 1 ?
                            <Typography variant="h5" fontWeight={550} color={"var(--color-dark-blue)"} mt={5} textAlign={"center"}>
                                {formatMessage({ id: "timetracker.norecord" })}
                            </Typography> :
                            getDailyWorkDay?.workDays?.docs?.length > 0 && sessionData?.length < 1 ?
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography variant="h5" fontWeight={550} color={"var(--color-dark-blue)"} mb={2}>Oops, <span style={{ textTransform: "capitalize" }}>{name}</span> {statusData[0] === "ON_VACATION" ? formatMessage({ id: "timetracker.onvacation" }) : statusData[0] === "ABSENT" ? formatMessage({ id: "timetracker.absent" }) : statusData[0]}</Typography>
                                    <img src={absent} width={150} alt="icon" />
                                    <Typography variant="h5" fontWeight={550} color={"var(--color-dark-blue)"} mt={2}>
                                        {/* Absent Status: <span style={{ color: "green" }}>Justified</span> */}
                                    </Typography>
                                </Box> :
                                <>
                                    <Box sx={{ height: { sm: "33vh", xl: "53vh" }, overflow: 'auto' }}>
                                        {sessionData.sort(function (a, b) { return a.session_start.localeCompare(b.session_start) }).reverse().map((el, index) => {
                                            let num = sessionData?.length
                                            return (
                                                <span key={index}>
                                                    <SessionCard
                                                        el={el}
                                                        sessionNum={num - index}
                                                        description={el?.session_description}
                                                        clockIn={el?.session_start}
                                                        clockOut={el?.session_end}
                                                        time={el?.workedTimeInSeconds}
                                                        user={getDailyWorkDay?.workDays?.docs[0]?.user}
                                                        setGetData={setGetData}
                                                        getData={getData}
                                                    />
                                                </span>
                                            );
                                        })}
                                    </Box>
                                    <ExportTimeTrackerReport
                                        id={id}
                                        startDate={moment(selectedDate).startOf('day').toISOString()}
                                        endDate={moment(selectedDate).endOf('day').toISOString()}
                                    />
                                </>
                    }
                </TabPanel>
            </TabContext>
        </Box>
    );
}

export default TimeTrackingStepperDaily;


