import React, { useState } from 'react'
import { Box, IconButton, MenuItem, Tab, TextField, Typography } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import SMSSideContainer from '../../../containers/SMSSideContainer'
import SendSMSPage from './SendSMSPage'
import SMSHistory from './SMSHistory'
import { ContFilter } from '../../../components/employee/style'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import styled from 'styled-components'
import dayjs from 'dayjs'
import { useLocale } from '../../../locales'
import { KeyboardBackspace } from '@mui/icons-material'
import { useNavigate } from 'react-router'

const Field = styled.div`
  background: #87cefa;
  border-radius: 20px;
  border-radius: 20px;
  padding: 13px;
  cursor: pointer;
`;

const LeftSide = ({ subtabIndex, tabSubHandler, phoneNumber, status, type, startDate, endDate, loading, setLoading, page, setPage }) => {
    const { formatMessage } = useLocale();
    const navigate = useNavigate()

    return (
        <Box>
            <IconButton
                sx={{
                    display: {xs: 'none', sm: "block"},
                    color: "#000",
                    position: "absolute",
                    top: { md: "10px" },
                    backgroundColor: "#fff !important",
                    marginLeft: "1.5rem",
                    zIndex: 1
                }}
                onClick={() => navigate(-1)}
            >
                <KeyboardBackspace sx={{ fontSize: "2rem" }} />
            </IconButton>
            <TabContext value={subtabIndex}>
                <TabList onChange={tabSubHandler} variant='scrollable'
                    sx={{
                        '& .MuiTabs-indicator': { backgroundColor: "var(--color-dark-blue)", height: "2px" },
                        '& .Mui-selected': { color: "var(--color-dark-blue) !important", backgroundColor: "var(--color-cyan)" },
                        '& .MuiTab-root': { color: "#B0B6C3", padding: "0px 15px !important", textTransform: "capitalize", fontWeight: "600", border: "2px solid" },
                        '& .MuiTabs-flexContainer': { justifyContent: "center" }
                    }}
                >
                    <Tab
                        label={formatMessage({ id: "sms.tab1" })}
                        value={"1"}
                        sx={{ width: "200px" }}
                    />
                    <Tab
                        label={formatMessage({ id: "sms.tab2" })}
                        value={"2"}
                        sx={{ width: "200px" }}
                    />
                </TabList>

                <TabPanel value="1" sx={{ padding: "15px 0 0 0" }}>
                    <SendSMSPage />
                </TabPanel>

                <TabPanel value="2" sx={{ padding: "15px 0 0 0" }}>
                    <SMSHistory
                        phoneNumber={phoneNumber}
                        status={status}
                        type={type}
                        startDate={startDate}
                        endDate={endDate}
                        loading={loading}
                        setLoading={setLoading}
                        page={page}
                        setPage={setPage}
                    />
                </TabPanel>
            </TabContext>
        </Box>
    )
}

const RightSide = ({ searchPhone, setPhoneNumber, setSearchPhone, status, setStatus, type, setType, startDate, setStartDate, endDate, setEndDate, setLoading, setPage }) => {
    const { formatMessage } = useLocale();
    const [timeoutMulti, setTimeoutMulti] = useState(null)

    const clearFilter = () => {
        setStatus("")
        setType("")
        setSearchPhone("")
        setPhoneNumber("")
        setStartDate("")
        setEndDate("")
        setPage(1)
    }

    const handlePhoneSearch = (e) => {
        try {
            clearTimeout(timeoutMulti)
        }
        catch {

        }
        setSearchPhone(e.target.value)
        setLoading(true)
        setPage(1)
        setTimeoutMulti(setTimeout(() => {
            setPhoneNumber(e.target.value)
        }, 1500))
    }

    return (
        <>
            <ContFilter>
                <Typography
                    variant="body2"
                    sx={{
                        textDecoration: "underline",
                        cursor: "pointer",
                        fontWeight: "bold",
                        textAlign: "center",
                    }}
                    onClick={() => clearFilter()}
                >
                    {formatMessage({ id: "employee.clearfilter" })}
                </Typography>

                <TextField
                    size="small"
                    variant="outlined"
                    type='number'
                    value={searchPhone}
                    onChange={(e) => handlePhoneSearch(e)}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            background: "#fff",
                            borderRadius: "50px",
                            backgroundColor: "var(--color-blue)",
                        },
                        "& fieldset": { border: "none" },
                        "& .MuiFormLabel-root": {
                            color: "var(--color-dark-blue) !important",
                            fontWeight: "600",
                            fontSize: "15px",
                            textTransform: "capitalize",
                        },
                    }}
                    placeholder={formatMessage({ id: "settings.phone" })}
                />

                <TextField
                    select
                    size="small"
                    variant="outlined"
                    value={type}
                    onChange={(e) => { setType(e.target.value); setPage(1) }}
                    label={formatMessage({ id: "sms.smstype" })}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            background: "#fff",
                            borderRadius: "50px",
                            backgroundColor: "var(--color-blue)",
                        },
                        "& fieldset": { border: "none" },
                        "& .MuiFormLabel-root": {
                            color: "var(--color-dark-blue) !important",
                            fontWeight: "600",
                            fontSize: "15px",
                            textTransform: "capitalize",
                        },
                    }}
                    placeholder={formatMessage({ id: "settings.phone" })}
                >
                    <MenuItem value="otp">OTP</MenuItem>
                    <MenuItem value="welcome">Welcome</MenuItem>
                    <MenuItem value="voucher">Voucher</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                </TextField>

                <TextField
                    select
                    size="small"
                    variant="outlined"
                    value={status}
                    onChange={(e) => { setStatus(e.target.value); setPage(1) }}
                    label={formatMessage({ id: "sms.sentstatus" })}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            background: "#fff",
                            borderRadius: "50px",
                            backgroundColor: "var(--color-blue)",
                        },
                        "& fieldset": { border: "none" },
                        "& .MuiFormLabel-root": {
                            color: "var(--color-dark-blue) !important",
                            fontWeight: "600",
                            fontSize: "15px",
                            textTransform: "capitalize",
                        },
                    }}
                    placeholder={formatMessage({ id: "settings.phone" })}
                >
                    <MenuItem value={true}>{formatMessage({ id: "sms.sent" })}</MenuItem>
                    <MenuItem value={false}>{formatMessage({ id: "advance.notsent" })}</MenuItem>
                </TextField>

                <Field>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{formatMessage({ id: "edoc.date" })}</span>
                        <img src="/icons/Employee/filter.svg" />
                    </Box>

                    <div style={{ marginTop: "12px", display: "flex", gap: 10 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                maxDate={dayjs(endDate)}
                                label={formatMessage({ id: "timetracker.startdate" })}
                                onChange={(value) => { setStartDate(value.toISOString()); setPage(1) }}
                                value={dayjs(startDate)}
                                slotProps={{ textField: { size: "small", error: false } }}
                                sx={{ width: "100%" }}
                                disableFuture={true}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                minDate={dayjs(startDate)}
                                label={formatMessage({ id: "timetracker.enddate" })}
                                onChange={(value) => { setEndDate(dayjs(value).endOf("day").toISOString()); setPage(1) }
                                }
                                value={dayjs(endDate)}
                                slotProps={{ textField: { size: "small", error: false } }}
                                sx={{ width: "100%" }}
                                disableFuture={true}
                            />
                        </LocalizationProvider>
                    </div>
                </Field>
            </ContFilter >
        </>
    )
}

const GwalaSMS = () => {
    const [subtabIndex, setSubTabIndex] = useState("1")
    const [page, setPage] = useState(1)
    const [searchPhone, setSearchPhone] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [type, setType] = useState("")
    const [status, setStatus] = useState("")
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false)

    const tabSubHandler = (e, val) => {
        setSubTabIndex(val)
        setStatus("")
        setType("")
        setSearchPhone("")
        setPhoneNumber("")
        setStartDate("")
        setEndDate("")
        setPage(1)
    }

    return (
        <SMSSideContainer
            LeftSideComponent={
                <LeftSide
                    subtabIndex={subtabIndex}
                    tabSubHandler={tabSubHandler}
                    phoneNumber={phoneNumber}
                    status={status}
                    type={type}
                    startDate={startDate}
                    endDate={endDate}
                    loading={loading}
                    setLoading={setLoading}
                    page={page}
                    setPage={setPage}
                />
            }
            RightSideComponent={
                <RightSide
                    searchPhone={searchPhone}
                    setSearchPhone={setSearchPhone}
                    setPhoneNumber={setPhoneNumber}
                    status={status}
                    setStatus={setStatus}
                    type={type}
                    setType={setType}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    setLoading={setLoading}
                    setPage={setPage}
                />
            }
            subtabIndex={subtabIndex}
        />
    )
}

export default GwalaSMS