import React, { useEffect, useState } from 'react'
import { Autocomplete, Box, Grid, InputAdornment, MenuItem, Tab, TextField, Typography } from '@mui/material'
import { useLocale } from '../../locales'
import { ContFilter } from '../../components/employee/style'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import GiftCardTracker from './GiftCardTracker'
import SMSSideContainer from '../../containers/SMSSideContainer'
import BalanceSharing from './BalanceSharing'
import { Search } from '@mui/icons-material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useLocation, useNavigate } from 'react-router'
import CashBackTracker from './CashBackTracker'
import axiosMerchant from '../../api/merchantRequest'
import axios from '../../api/request'

const LeftSide = ({ tabSubHandler, subtabIndex, page, setPage, searchQuery, type, minAmountVal, maxAmountVal, mincashBackVal, maxcashBackVal, phoneNumber, startDate, endDate, loading, setLoading, merchantId, benId }) => {
    const { formatMessage } = useLocale();

    return (
        <Box>
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
                        label={formatMessage({ id: "tracker.tab1" })}
                        value={"1"}
                        sx={{ width: "250px" }}
                    />
                    <Tab
                        label={formatMessage({ id: "tracker.tab2" })}
                        value={"2"}
                        sx={{ width: "250px" }}
                    />
                    <Tab
                        label={formatMessage({ id: "tracker.tab3" })}
                        value={"3"}
                        sx={{ width: "250px" }}
                    />
                </TabList>

                <TabPanel value="1" sx={{ padding: "24px 0 0 0" }}>
                    <GiftCardTracker />
                </TabPanel>

                <TabPanel value="2" sx={{ padding: "24px 0 0 0" }}>
                    <BalanceSharing
                        page={page}
                        setPage={setPage}
                        searchQuery={searchQuery}
                        type={type}
                        minAmountVal={minAmountVal}
                        maxAmountVal={maxAmountVal}
                        phoneNumber={phoneNumber}
                        startDate={startDate}
                        endDate={endDate}
                        loading={loading}
                        setLoading={setLoading}
                    />
                </TabPanel>

                <TabPanel value="3" sx={{ padding: "24px 0 0 0" }}>
                    <CashBackTracker
                        page={page}
                        setPage={setPage}
                        minAmountVal={minAmountVal}
                        maxAmountVal={maxAmountVal}
                        mincashBackVal={mincashBackVal}
                        maxcashBackVal={maxcashBackVal}
                        startDate={startDate}
                        endDate={endDate}
                        loading={loading}
                        setLoading={setLoading}
                        merchantId={merchantId}
                        benId={benId}
                    />
                </TabPanel>
            </TabContext>
        </Box>
    )
}

const RightSide = ({ setSearchQuery, refInput, setRefInput, type, setType, minAmount, setMinAmount, setMinAmountVal, setMaxAmountVal, maxAmount, setMaxAmount, mincashBack, setMincashBack, setMincashBackVal, setMaxcashBackVal, maxcashBack, setMaxcashBack, startDate, setStartDate, endDate, setEndDate, setLoading, setPage, subtabIndex, setMerchantId, setBenId, location }) => {
    const { formatMessage } = useLocale();
    const navigate = useNavigate()
    const [timeoutMulti, setTimeoutMulti] = useState(null)
    const [allMerchants, setAllMerchants] = useState([]);
    const [eNameLoading, setENameLoading] = useState(false);
    const [openDropDown, setOpenDropDown] = useState(false)
    const [eNameLoadingBen, setENameLoadingBen] = useState(false);
    const [openDropDownBen, setOpenDropDownBen] = useState(false)
    const [allUsers, setUsers] = useState([]);

    const searchMerchants = async (text) => {

        const replacements = [['’', "'"], ['`', "'"], ['‘', "'"]];
        const replacedMerchantName = location?.state?.id ? "" : replacements.reduce((acc, [pattern, replacement]) => acc.replace(new RegExp(pattern, 'g'), replacement), text);

        setENameLoading(true)
        if (text[0] === "+") {
            setENameLoading(false)
            setOpenDropDown(true)
            setAllMerchants([])
        } else if (text?.length >= 2 || location?.state?.id) {
            setOpenDropDown(true);
            const data = await axiosMerchant.get(`/merchants`, {
                params: {
                    filter: {
                        limit: 1000,
                        where: {
                            name: {
                                regexp: `/${replacedMerchantName}/i`
                            }
                        },
                        fields: {
                            name: true,
                            id: true
                        }
                    }
                }
            })
            if (data) {
                setENameLoading(false)
            }
            setAllMerchants(location?.state?.id ? data?.data?.docs?.filter(ft => ft?.id === location?.state?.id) : data?.data?.docs)
        } else {
            setOpenDropDown(false);
            const filteredUsers = allMerchants?.filter((user) => {
                const userName = `${user?.name}`;
                return userName.toLowerCase().includes(replacedMerchantName.toLowerCase());
            });
            setAllMerchants([...filteredUsers]);
        }
    };

    useEffect(() => {
        if (location?.state?.id) {
            searchMerchants("")
        }
    }, [location?.state?.id])

    const getEmployees = async (text) => {
        const result = await axios.get(
            `/account/users?page=${1}&limit=${100}&searchQuery=${text}&kycDocumentsSort=1`
        );
        return result
    }

    const handleSearchEmployeeChange = async (text) => {
        const replacements = [['’', "'"], ['`', "'"], ['‘', "'"]];
        const replacedMerchantName = replacements.reduce((acc, [pattern, replacement]) => acc.replace(new RegExp(pattern, 'g'), replacement), text);

        setENameLoadingBen(true)
        if (text[0] === "+") {
            setENameLoadingBen(false)
            setOpenDropDownBen(true)
            setUsers([])
        } else if (text?.length >= 2) {
            setOpenDropDownBen(true);
            const data = await getEmployees(text)

            if (data) {
                setENameLoadingBen(false)
            }
            setUsers(data?.data?.docs)
        } else {
            setOpenDropDownBen(false);
            const filteredUsers = allUsers?.filter((user) => {
                const userName = `${user?.name}`;
                return userName.toLowerCase().includes(replacedMerchantName.toLowerCase());
            });
            setUsers([...filteredUsers]);
        }
    }

    const handleRefSearch = (e) => {
        try {
            clearTimeout(timeoutMulti)
        }
        catch {

        }
        setRefInput(e.target.value)
        setLoading(true)
        setPage(1)
        setTimeoutMulti(setTimeout(() => {
            setSearchQuery(e.target.value)
        }, 1500))
    }

    const handleAmountChange = (e, type) => {
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
        setTimeoutMulti(setTimeout(() => {
            if (type === 'min') {
                setMinAmountVal(e.target.value)
            } else {
                setMaxAmountVal(e.target.value)
            }
            setPage(1)
        }, 1500))
    }

    const handlecashBackChange = (e, type) => {
        if (type === 'min') {
            setMincashBack(e.target.value)
        } else {
            setMaxcashBack(e.target.value > 100 ? 100 : e.target.value)
        }

        try {
            clearTimeout(timeoutMulti)
        }
        catch {

        }
        setLoading(true)
        setTimeoutMulti(setTimeout(() => {
            if (type === 'min') {
                setMincashBackVal(e.target.value)
            } else {
                setMaxcashBackVal(e.target.value)
            }
            setPage(1)
        }, 1500))
    }

    const clearFilter = () => {
        setSearchQuery("")
        setType("")
        setMinAmount("")
        setMinAmountVal("")
        setMaxAmount("")
        setMaxAmountVal("")
        setMincashBack("")
        setMincashBackVal("")
        setMaxcashBack("")
        setMaxcashBackVal("")
        setStartDate("")
        setEndDate("")
        setRefInput("")
        setPage(1)
        setMerchantId("")
        setAllMerchants([])
        setBenId("")
        setOpenDropDown(false)
        navigate('/tracker')
        window.history.replaceState({}, document.title)
        document?.getElementsByClassName("MuiAutocomplete-clearIndicator")[0]?.click()
    }

    return (
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

            {subtabIndex === "2" &&
                <>
                    <TextField
                        size="small"
                        variant="outlined"
                        value={refInput}
                        onChange={(e) => handleRefSearch(e)}
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
                        placeholder={formatMessage({ id: "nav.search" })}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        select
                        size="small"
                        variant="outlined"
                        value={type}
                        onChange={(e) => { setType(e.target.value); setPage(1) }}
                        label={"Operations Type"}
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
                        <MenuItem value="GWALA_USERS">To a Gwala User</MenuItem>
                        <MenuItem value="NON_GWALA_USERS">Not to a Gwala User</MenuItem>
                    </TextField>
                </>
            }

            {subtabIndex === "3" &&
                <>
                    <Autocomplete
                        open={openDropDown}
                        loading={eNameLoading}
                        id="merchant_name"
                        sx={{
                            "& .MuiOutlinedInput-root": {
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
                        options={allMerchants}
                        getOptionLabel={(option) => `${option?.name}`}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={formatMessage({ id: subtabIndex === "5" ? "merchants.businessname" : "merchants.merchantname" })}
                            />
                        )}
                        onChange={(_, value, reason) => {
                            if (reason === "clear") {
                                setMerchantId("")
                                setAllMerchants([])
                                return;
                            } else {
                                setPage(1)
                                setMerchantId(value?.id)
                                setOpenDropDown(false)
                            }
                        }}
                        onInputChange={(_, value, reason) => {
                            if (reason === "clear") {
                                setAllMerchants([])
                                return;
                            } else {
                                searchMerchants(value);
                            }
                        }}
                    />

                    <Autocomplete
                        open={openDropDownBen}
                        loading={eNameLoadingBen}
                        id="merchant_name"
                        sx={{
                            "& .MuiOutlinedInput-root": {
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
                        options={allUsers}
                        getOptionLabel={(option) => `${option?.firstName} ${option?.lastName}`}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={formatMessage({ id: "merchants.category.searchcatemployee" })}
                            />
                        )}
                        onChange={(_, value, reason) => {
                            if (reason === "clear") {
                                setUsers([])
                                return;
                            } else {
                                setPage(1)
                                setBenId(value?._id)
                                setOpenDropDownBen(false)
                            }
                        }}
                        onInputChange={(_, value, reason) => {
                            if (reason === "clear") {
                                setUsers([])
                                return;
                            } else {
                                handleSearchEmployeeChange(value);
                            }
                        }}
                    />
                </>
            }

            {/* Cashback range */}
            {subtabIndex === "3" &&
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
                            <span>{formatMessage({ id: "merchants.cashbackrate" })} (MAD)</span>
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
                                    value={mincashBack}
                                    onChange={(e) => handlecashBackChange(e, "min")}
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
                                    value={maxcashBack}
                                    onChange={(e) => handlecashBackChange(e, "max")}
                                />
                            </Grid>
                        </Grid>
                    </div>
                </div>
            }

            {/* amount range */}
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
                                onChange={(e) => handleAmountChange(e, "min")}
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
                                onChange={(e) => handleAmountChange(e, "max")}
                            />
                        </Grid>
                    </Grid>
                </div>
            </div>

            <div
                style={{
                    background: "var(--color-blue)",
                    height: "100px",
                    borderRadius: 20,
                    padding: "13px",
                }}
            >
                <div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                        }}
                    >
                        <span>{formatMessage({ id: "advance.date" })}</span>
                        <img src="/icons/Employee/filter.svg" />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                maxDate={endDate}
                                label={formatMessage({ id: "timetracker.startdate" })}
                                onChange={(value) => { setStartDate(value.startOf('day')); setPage(1) }}
                                value={startDate}
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
                                minDate={startDate}
                                label={formatMessage({ id: "timetracker.enddate" })}
                                onChange={(value) => { setEndDate(value.endOf('day')); setPage(1) }}
                                value={endDate}
                                slotProps={{
                                    textField: { size: "small", error: false, fullWidth: true },
                                }}
                                disableFuture={true}
                                views={["year", "month", "day"]}
                                format="DD/MM/YYYY"
                            />
                        </LocalizationProvider>
                    </div>
                </div>
            </div>
        </ContFilter>
    )
}

const Tracker = () => {
    const location = useLocation()

    const [subtabIndex, setSubTabIndex] = useState(location?.state?.cashback ? "3" : "1")
    const [searchPhone, setSearchPhone] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [page, setPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    const [refInput, setRefInput] = useState("")
    const [type, setType] = useState("")
    const [minAmount, setMinAmount] = useState("")
    const [minAmountVal, setMinAmountVal] = useState("")
    const [maxAmount, setMaxAmount] = useState("")
    const [maxAmountVal, setMaxAmountVal] = useState("")
    const [mincashBack, setMincashBack] = useState("")
    const [mincashBackVal, setMincashBackVal] = useState("")
    const [maxcashBack, setMaxcashBack] = useState("")
    const [maxcashBackVal, setMaxcashBackVal] = useState(200)
    const [merchantId, setMerchantId] = useState(location?.state?.id ? location?.state?.id : "")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [benId, setBenId] = useState("")
    const [loading, setLoading] = useState(false)

    const tabSubHandler = (e, val) => {
        setSubTabIndex(val)
        setPhoneNumber("")
        setSearchPhone("")
        setSearchQuery("")
        setType("")
        setMinAmount("")
        setMinAmountVal("")
        setMaxAmount("")
        setMaxAmountVal("")
        setMincashBack("")
        setMincashBackVal("")
        setMaxcashBack("")
        setMaxcashBackVal("")
        setStartDate("")
        setEndDate("")
        setBenId("")
        window.history.replaceState({}, document.title)
        document?.getElementsByClassName("MuiAutocomplete-clearIndicator")[0]?.click()
    }

    return (
        <SMSSideContainer
            LeftSideComponent={
                <LeftSide
                    tabSubHandler={tabSubHandler}
                    subtabIndex={subtabIndex}
                    page={page}
                    setPage={setPage}
                    searchQuery={searchQuery}
                    type={type}
                    minAmountVal={minAmountVal}
                    maxAmountVal={maxAmountVal}
                    mincashBackVal={mincashBackVal}
                    maxcashBackVal={maxcashBackVal}
                    phoneNumber={phoneNumber}
                    startDate={startDate}
                    endDate={endDate}
                    loading={loading}
                    setLoading={setLoading}
                    merchantId={merchantId}
                    benId={benId}
                />
            }
            RightSideComponent={
                <RightSide
                    setSearchQuery={setSearchQuery}
                    refInput={refInput}
                    setRefInput={setRefInput}
                    type={type}
                    setType={setType}
                    minAmount={minAmount}
                    setMinAmount={setMinAmount}
                    minAmountVal={minAmountVal}
                    setMinAmountVal={setMinAmountVal}
                    maxAmountVal={maxAmountVal}
                    setMaxAmountVal={setMaxAmountVal}
                    maxAmount={maxAmount}
                    setMaxAmount={setMaxAmount}
                    mincashBack={mincashBack}
                    setMincashBack={setMincashBack}
                    mincashBackVal={mincashBackVal}
                    setMincashBackVal={setMincashBackVal}
                    maxcashBackVal={maxcashBackVal}
                    setMaxcashBackVal={setMaxcashBackVal}
                    maxcashBack={maxcashBack}
                    setMaxcashBack={setMaxcashBack}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    setLoading={setLoading}
                    setPage={setPage}
                    subtabIndex={subtabIndex}
                    setMerchantId={setMerchantId}
                    setBenId={setBenId}
                    location={location}
                />
            }
            subtabIndex={subtabIndex}
        />
    )
}

export default Tracker