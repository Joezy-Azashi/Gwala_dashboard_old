import React, { useEffect, useState } from 'react'
import SideContainer from '../../containers/SideContainer'
import { Autocomplete, Box, Grid, MenuItem, Tab, TextField, Typography } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useLocale } from '../../locales';
import { ContFilter, Field } from '../../components/employee/style';
import HREmployerTable from './HREmployerTable';
import HRVoucherRequestTable from './HRVoucherRequestTable';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from '../../api/request';
import newAxios from 'axios';
import { toast } from 'react-toastify';

const LeftSide = ({ subtabIndex, tabSubHandler, page, setPage, companyId, setSubTabIndex, setCompanyId, setCompanyName, loading, companyData, companyCount, voucherData, setVoucherData, voucherCount }) => {
    const { formatMessage } = useLocale();

    return (
        <Box>
            <TabContext value={subtabIndex} sx={{ overflow: "auto" }}>
                <TabList onChange={tabSubHandler}
                    sx={{
                        '& .MuiTabs-indicator': { backgroundColor: "var(--color-dark-blue)", height: "2px" },
                        '& .Mui-selected': { color: "var(--color-dark-blue) !important", backgroundColor: "var(--color-cyan)", borderRight: subtabIndex === "1" && "0 !important", borderLeft: subtabIndex === "2" && "0 !important" },
                        '& .MuiTab-root': { color: "#B0B6C3", padding: "0px 15px !important", textTransform: "capitalize", fontWeight: "600", border: "2px solid", width: {xs: "50%"} },
                        '& .MuiTabs-flexContainer': { justifyContent: "center" }
                    }}
                >
                    <Tab
                        label={formatMessage({ id: "nav.company" })}
                        value={"1"}
                        sx={{ width: "200px" }}
                    />
                    <Tab
                        label={formatMessage({ id: "evoucher.voucherrequest" })}
                        value={"2"}
                        sx={{ width: "200px" }}
                    />
                </TabList>

                <TabPanel value="1" sx={{ padding: "24px 0 0 0" }}>
                    <HREmployerTable
                        page={page}
                        setPage={setPage}
                        companyId={companyId}
                        setSubTabIndex={setSubTabIndex}
                        setCompanyId={setCompanyId}
                        setCompanyName={setCompanyName}
                        loading={loading}
                        companyData={companyData}
                        companyCount={companyCount}
                    />
                </TabPanel>

                <TabPanel value="2" sx={{ padding: "24px 0 0 0" }}>
                    <HRVoucherRequestTable
                        page={page}
                        loading={loading}
                        setPage={setPage}
                        companyId={companyId}
                        voucherData={voucherData}
                        setVoucherData={setVoucherData}
                        voucherCount={voucherCount}
                    />
                </TabPanel>
            </TabContext>
        </Box>
    )
}
const RightSide = ({ subtabIndex, setPage, status, setCompanyId, setStatus, startDate, setStartDate, endDate, setEndDate, voucherType, setVoucherType, companyName, setCompanyName, openDropDown, setOpenDropDown, setLoading, min, setMin, max, setMax, getCompanyData, minAmount, setMinAmount, maxAmount, setMaxAmount, getRequestedVouchers, companySort, setCompanySort, requestSort, setRequestSort, setRequestSortBy }) => {
    const { formatMessage } = useLocale();

    const [allCompanies, setAllCompanies] = useState([]);
    const [eNameLoading, setENameLoading] = useState(false);
    const [timeoutMulti, setTimeoutMulti] = useState(null)

    const searchEmployers = async (text) => {
        setRequestSortBy("")
        setENameLoading(true)
        if (text.length >= 2) {
            setOpenDropDown(true);
            const data = await axios.get(`/companies?page=1&limit=5&searchQuery=${text}&sort=-1`);
            if (data) {
                setENameLoading(false)
            }
            setAllCompanies(data?.data?.docs)
        } else {
            setOpenDropDown(false);
            const filteredUsers = allCompanies?.filter((user) => {
                const userName = `${user?.name}`;
                return userName.toLowerCase().includes(text.toLowerCase());
            });
            setAllCompanies([...filteredUsers]);
        }
    };

    useEffect(() => {
        if (companyName?.length > 1) {
            searchEmployers(companyName)
        }
    }, [companyName])

    const handleCompanyValue = (e, type) => {
        if (type === 'min') {
            setMin(e.target.value)
        } else {
            setMax(e.target.value)
        }

        try {
            clearTimeout(timeoutMulti)
        }
        catch {

        }

        setLoading(true)
        setTimeoutMulti(setTimeout(() => {
            getCompanyData(type === 'min' ? e.target.value : min, type !== 'min' ? e.target.value : max)
        }, 1500))
    }

    const handleAmountValue = (e, type) => {
        setRequestSortBy("")
        if (type === 'min') {
            setMinAmount(e.target.value)
        } else {
            setMaxAmount(e.target.value)
        }

        try {
            clearTimeout(timeoutMulti)
        }
        catch {

        }

        setLoading(true)
        setRequestSortBy("status")
        setTimeoutMulti(setTimeout(() => {
            getRequestedVouchers(type === 'min' ? e.target.value : minAmount, type !== 'min' ? e.target.value : maxAmount)
        }, 1500))
    }

    const clearFilter = () => {
        setPage(1)
        setStatus("")
        setStartDate("")
        setEndDate("")
        setVoucherType("")
        setCompanyId("")
        setCompanyName("")
        setOpenDropDown(false)
        setMin("")
        setMax("")
        setMinAmount("")
        setMaxAmount("")
        getCompanyData("", "")
        setRequestSortBy("")
        document?.getElementsByClassName("MuiAutocomplete-clearIndicator")[0]?.click()
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

                <Autocomplete
                    open={openDropDown}
                    loading={eNameLoading}
                    id="company_name"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            background: "#fff",
                            borderRadius: "50px",
                            backgroundColor: "var(--color-blue)",
                        },
                        "& fieldset": { border: "none" },
                        "& .MuiSvgIcon-root": { display: "none" },
                        "& .MuiFormLabel-root": {
                            color: "var(--color-dark-blue) !important",
                            fontWeight: "600",
                            fontSize: "15px",
                            textTransform: "capitalize",
                        },
                    }}
                    size="small"
                    InputLabelProps={{ shrink: false }}
                    fullWidth
                    options={allCompanies}
                    getOptionLabel={(option) => `${option?.name}`}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={formatMessage({ id: "advance.companyname" })}
                        />
                    )}
                    onChange={(_, value, reason) => {
                        if (reason === "clear") {
                            setCompanyId("")
                            setAllCompanies([])
                            return;
                        } else {
                            setPage(1)
                            setCompanyId(value?._id)
                            setOpenDropDown(false)
                        }
                    }}
                    onInputChange={(_, value, reason) => {
                        if (reason === "clear") {
                            // setFilter(INITIAL_FILTER);
                            setAllCompanies([])
                            return;
                        } else {
                            searchEmployers(value);
                        }
                    }}
                />

                {subtabIndex === "1" &&
                    <>
                        <div
                            style={{
                                background: "var(--color-blue)",
                                height: "100px",
                                borderRadius: 20,
                                padding: "13px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>{formatMessage({ id: "evoucher.totalvoucher" })} (MAD)</span>
                                    <img src="/icons/Employee/filter.svg" />
                                </div>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <TextField
                                            type="number"
                                            size="small"
                                            onKeyDown={(e) => {
                                                if (e.keyCode === 38 || e.keyCode === 40) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onWheel={(e) => e.target.blur()}
                                            label={formatMessage({ id: "advance.min" })}
                                            fullWidth
                                            margin="dense"
                                            value={min}
                                            onChange={(e) => handleCompanyValue(e, "min")}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            type="number"
                                            size="small"
                                            onKeyDown={(e) => {
                                                if (e.keyCode === 38 || e.keyCode === 40) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onWheel={(e) => e.target.blur()}
                                            label={formatMessage({ id: "advance.max" })}
                                            fullWidth
                                            margin="dense"
                                            value={max}
                                            onChange={(e) => handleCompanyValue(e, "max")}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        </div>

                        <Field onClick={() => setCompanySort(-companySort)}>
                            <span>{formatMessage({ id: "evoucher.sorttotalvoucher" })}</span>
                            <img src="/icons/Employee/filter.svg" />
                        </Field>
                    </>
                }

                {subtabIndex === "2" &&
                    <>
                        <div
                            style={{
                                background: "var(--color-blue)",
                                height: "100px",
                                borderRadius: 20,
                                padding: "13px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>{formatMessage({ id: "advance.montant" })} (MAD)</span>
                                    <img src="/icons/Employee/filter.svg" />
                                </div>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <TextField
                                            type="number"
                                            size="small"
                                            onKeyDown={(e) => {
                                                if (e.keyCode === 38 || e.keyCode === 40) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onWheel={(e) => e.target.blur()}
                                            label={formatMessage({ id: "advance.min" })}
                                            fullWidth
                                            margin="dense"
                                            value={minAmount}
                                            onChange={(e) => handleAmountValue(e, "min")}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            type="number"
                                            size="small"
                                            onKeyDown={(e) => {
                                                if (e.keyCode === 38 || e.keyCode === 40) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onWheel={(e) => e.target.blur()}
                                            label={formatMessage({ id: "advance.max" })}
                                            fullWidth
                                            margin="dense"
                                            value={maxAmount}
                                            onChange={(e) => handleAmountValue(e, "max")}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        </div>

                        <Field onClick={() => {setRequestSort(-requestSort); setRequestSortBy("totalQuantity")}}>
                            <span>{formatMessage({ id: "evoucher.sortbyamount" })}</span>
                            <img src="/icons/Employee/filter.svg" />
                        </Field>
                    </>
                }

                {subtabIndex === "2" && (
                    <>
                        <TextField
                            select
                            id="voucher_type"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    background: "#fff",
                                    borderRadius: "50px",
                                    backgroundColor: "var(--color-blue)",
                                    fontWeight: "600",
                                    color: "var(--color-dark-blue) !important",
                                    fontSize: "15px",
                                },
                                "& fieldset": { border: "none" },
                                "& .MuiFormLabel-root": {
                                    color: "var(--color-dark-blue) !important",
                                    fontWeight: "600",
                                    fontSize: "15px",
                                    textTransform: "capitalize",
                                },
                            }}
                            size="small"
                            label={voucherType.length > 0 ? "" : formatMessage({ id: "evoucher.vouchertype" })}
                            InputLabelProps={{ shrink: false }}
                            fullWidth
                            value={voucherType}
                            onChange={(e) => {setVoucherType(e.target.value); setRequestSortBy("")}}
                        >
                            <MenuItem value={"GENERAL"}>{formatMessage({ id: "evoucher.general" })}</MenuItem>
                            <MenuItem value={"RESTAURANT"}>{formatMessage({ id: "evoucher.restaurant" })}</MenuItem>
                        </TextField>

                        <TextField
                            select
                            id="request_status"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    background: "#fff",
                                    borderRadius: "50px",
                                    backgroundColor: "var(--color-blue)",
                                    fontWeight: "600",
                                    color: "var(--color-dark-blue) !important",
                                    fontSize: "15px",
                                },
                                "& fieldset": { border: "none" },
                                "& .MuiFormLabel-root": {
                                    color: "var(--color-dark-blue) !important",
                                    fontWeight: "600",
                                    fontSize: "15px",
                                    textTransform: "capitalize",
                                },
                            }}
                            size="small"
                            label={status.length > 0 ? "" : formatMessage({ id: "advance.status" })}
                            InputLabelProps={{ shrink: false }}
                            fullWidth
                            value={status}
                            onChange={(e) => {setStatus(e.target.value); setRequestSortBy("")}}
                        >
                            <MenuItem value={"PENDING"}>{formatMessage({ id: "evoucher.pending" })}</MenuItem>
                            <MenuItem value={"HANDLING"}>{formatMessage({ id: "evoucher.handling" })}</MenuItem>
                            <MenuItem value={"PROCESSED"}> {formatMessage({ id: "evoucher.processed" })}</MenuItem>
                            <MenuItem value={"REJECTED"}>{formatMessage({ id: "evoucher.rejected" })}</MenuItem>
                        </TextField>

                        <Box sx={{ background: "var(--color-blue)", borderRadius: "20px", padding: "13px" }} mb={2.5}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                <span>{formatMessage({ id: "advance.date" })}</span>
                                <img src="/icons/Employee/filter.svg" />
                            </Box>
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        id="start_date"
                                        label={formatMessage({ id: "timetracker.startdate" })}
                                        value={startDate}
                                        onChange={(value) => {setStartDate(value.startOf('day')); setRequestSortBy("")}}
                                        slotProps={{
                                            textField: { size: "small", error: false, fullWidth: true },
                                        }}
                                        disableFuture={true}
                                        views={["year", "month", "day"]}
                                        format="DD/MM/YYYY"
                                    />
                                </LocalizationProvider>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        id="end_date"
                                        minDate={startDate}
                                        label={formatMessage({ id: "timetracker.enddate" })}
                                        value={endDate}
                                        onChange={(value) => {setEndDate(value.endOf('day')); setRequestSortBy("")}}
                                        slotProps={{
                                            textField: { size: "small", error: false, fullWidth: true },
                                        }}
                                        disableFuture={true}
                                        views={["year", "month", "day"]}
                                        format="DD/MM/YYYY"
                                    />
                                </LocalizationProvider>
                            </Box>
                        </Box>
                    </>
                )}
            </ContFilter>
        </>
    )
}

function EvoucherHR() {
    const [subtabIndex, setSubTabIndex] = useState("1")
    const [companyId, setCompanyId] = useState("")
    const [max, setMax] = useState("")
    const [min, setMin] = useState("")
    const [minAmount, setMinAmount] = useState("")
    const [maxAmount, setMaxAmount] = useState("")
    const [openDropDown, setOpenDropDown] = useState(false);
    const [voucherType, setVoucherType] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [page, setPage] = useState(1)
    const [status, setStatus] = useState("")
    const [companySort, setCompanySort] = useState(-1)
    const [requestSort, setRequestSort] = useState(-1)
    const [requestSortBy, setRequestSortBy] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [loading, setLoading] = useState(false)
    const [companyData, setCompanyData] = useState([])
    const [companyCount, setCompanyCount] = useState(1)
    const [voucherData, setVoucherData] = useState([])
    const [voucherCount, setVoucherCount] = useState(1)

    const tabSubHandler = (e, val) => {
        setSubTabIndex(val)
        setPage(1)
        setCompanyName("")
        setCompanyId("")
        setOpenDropDown(false)
        setMax("")
        setMin("")
        setRequestSortBy("")
        document?.getElementsByClassName("MuiAutocomplete-clearIndicator")[0]?.click()
    }

    const getCompanyData = (min, max) => {
        if (Number(min) > Number(max) && max !== "") {
            setLoading(false)
            toast("Min Value shouldn't be greater than Max Value", {
                position: "top-right",
                type: "warning",
                theme: "colored",
            });
        } else {
            setLoading(true)
            const url = `${import.meta.env.VITE_BASE_URL}/`
            const token = localStorage.getItem("token");

            newAxios.get(`${url}companies?page=${page}&${companyId.length > 0 ? `_id=${companyId}` : ""}&limit=10&amountMin=${min}&amountMax=${max}&sortBy=totalAmount&sort=${companySort}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
                .then((res) => {
                    setCompanyData(res?.data)
                    setCompanyCount(res?.data?.data?.totalPages)
                    setLoading(false)
                })
                .catch((error) => {
                    toast(error?.response?.data?.message, {
                        position: "top-right",
                        type: "error",
                        theme: "colored",
                    });
                    setLoading(false)
                })
        }
    }

    useEffect(() => {
        getCompanyData(min, max)
    }, [page, companyId, companySort])

    const getRequestedVouchers = (minAmount, maxAmount) => {
        if (Number(minAmount) > Number(maxAmount) && maxAmount !== "") {
            setLoading(false)
            toast("Min Value shouldn't be greater than Max Value", {
                position: "top-right",
                type: "warning",
                theme: "colored",
            });
        } else {
            setLoading(true)
            const url = `${import.meta.env.VITE_BASE_URL}/`
            const token = localStorage.getItem("token");

            newAxios.get(`${url}v2/request/vouchers?page=${page}&status=${status}&startDate=${startDate}&endDate=${endDate}&type=${voucherType}&${companyId.length > 0 ? `companyId=${companyId}` : ""}&amountMin=${minAmount}&amountMax=${maxAmount}&${requestSortBy.length > 0 ? `sortBy=${requestSortBy}&sort=${requestSort}` : ""}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
                .then((res) => {
                    setVoucherData(res?.data?.data)
                    setVoucherCount(res?.data?.data?.totalPages)
                    setLoading(false)
                })
                .catch((error) => {
                    toast(error?.response?.data?.message, {
                        position: "top-right",
                        type: "error",
                        theme: "colored",
                    });
                    setLoading(false)
                })
        }
    }

    useEffect(() => {
        getRequestedVouchers(minAmount, maxAmount)
    }, [page, status, startDate, endDate, voucherType, companyId, requestSort])

    return (
        <SideContainer
            LeftSideComponent={
                <LeftSide
                    subtabIndex={subtabIndex}
                    tabSubHandler={tabSubHandler}
                    page={page}
                    setPage={setPage}
                    status={status}
                    startDate={startDate}
                    endDate={endDate}
                    voucherType={voucherType}
                    companyId={companyId}
                    setSubTabIndex={setSubTabIndex}
                    setCompanyId={setCompanyId}
                    setCompanyName={setCompanyName}
                    openDropDown={openDropDown}
                    setOpenDropDown={setOpenDropDown}
                    loading={loading}
                    setLoading={setLoading}
                    min={min}
                    max={max}
                    companyData={companyData}
                    companyCount={companyCount}
                    voucherData={voucherData}
                    setVoucherData={setVoucherData}
                    voucherCount={voucherCount}
                />
            }
            RightSideComponent={
                <RightSide
                    subtabIndex={subtabIndex}
                    setCompanyId={setCompanyId}
                    setPage={setPage}
                    status={status}
                    min={min}
                    setMin={setMin}
                    max={max}
                    setMax={setMax}
                    setStatus={setStatus}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    voucherType={voucherType}
                    setVoucherType={setVoucherType}
                    companyName={companyName}
                    setCompanyName={setCompanyName}
                    openDropDown={openDropDown}
                    setOpenDropDown={setOpenDropDown}
                    setLoading={setLoading}
                    getCompanyData={getCompanyData}
                    minAmount={minAmount}
                    setMinAmount={setMinAmount}
                    maxAmount={maxAmount}
                    setMaxAmount={setMaxAmount}
                    getRequestedVouchers={getRequestedVouchers}
                    companySort={companySort}
                    setCompanySort={setCompanySort}
                    requestSort={requestSort}
                    setRequestSort={setRequestSort}
                    setRequestSortBy={setRequestSortBy}
                />
            }
        />
    )
}

export default EvoucherHR