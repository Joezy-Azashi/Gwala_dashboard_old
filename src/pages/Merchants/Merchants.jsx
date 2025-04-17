import React, { useEffect, useState } from 'react'
import SideContainer from '../../containers/SideContainer'
import { Autocomplete, Box, Button, CircularProgress, Dialog, Grid, MenuItem, Tab, TextField, Typography } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useLocale } from '../../locales';
import { ContFilter, Field } from '../../components/employee/style';
import MerchantsTable from './Tables/MerchantsTable';
import TransactionsTable from './Tables/TransactionsTable';
import ReimbursementsTable from './Tables/ReimbursementsTable';
import EditRequestTable from './Tables/EditRequestTable';
import { useLocation, useNavigate } from 'react-router';
import axiosMerchant from '../../api/merchantRequest';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { cities } from '../../config/cities';
import axios from '../../api/request';
import GeolocationTable from './Tables/GeolocationTable';
import GenerateInvoice from '../../components/Merchants/GenerateInvoice';

const LeftSide = ({ subtabIndex, selectedOwner, selectedCategory, clearFilter, tabSubHandler, page, setPage, merchantId, services, category, sort, sortType, pageRequest, setPageRequest, status, transSort, transSortType, minVal, maxVal, minSalesVal, maxSalesVal, transLoading, setTransLoading, reimbursementTime, minSales, maxSales, loading, setLoading, startDate, endDate, city, geoType, merchantLogo }) => {
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
                        label={formatMessage({ id: "merchants.merchants" })}
                        value={"1"}
                        sx={{ width: "170px" }}
                    />
                    <Tab
                        label={formatMessage({ id: "merchants.transactions" })}
                        value={"2"}
                        sx={{ width: "170px", '&.MuiTab-root': { borderLeft: subtabIndex !== "2" && "0", borderRight: subtabIndex !== "2" && "0" } }}
                    />
                    <Tab
                        label={formatMessage({ id: "merchants.reimbursements" })}
                        value={"3"}
                        sx={{ width: "170px", '&.MuiTab-root': { borderRight: subtabIndex !== "3" && "0" } }}
                    />
                    <Tab
                        label={formatMessage({ id: "merchants.editrequest" })}
                        value={"4"}
                        sx={{ width: "170px" }}
                    />
                    <Tab
                        label={formatMessage({ id: "merchants.geolocation" })}
                        value={"5"}
                        sx={{ width: "170px", '&.MuiTab-root': { borderLeft: subtabIndex !== "5" && "0" } }}
                    />
                </TabList>

                <TabPanel value="1" sx={{ padding: "24px 0 0 0" }}>
                    <MerchantsTable
                        page={page}
                        setPage={setPage}
                        merchantId={merchantId}
                        services={services}
                        category={category}
                        sort={sort}
                        sortType={sortType}
                        minSalesVal={minSalesVal}
                        maxSalesVal={maxSalesVal}
                        minSales={minSales}
                        maxSales={maxSales}
                        loading={loading}
                        setLoading={setLoading}
                        selectedOwner={selectedOwner}
                        selectedCategory={selectedCategory}
                        clearFilter={clearFilter}
                        city={city}
                        merchantLogo={merchantLogo}
                    />
                </TabPanel>

                <TabPanel value="2" sx={{ padding: "24px 0 0 0" }}>
                    <TransactionsTable
                        page={page}
                        setPage={setPage}
                        merchantId={merchantId}
                        transSort={transSort}
                        transSortType={transSortType}
                        minVal={minVal}
                        maxVal={maxVal}
                        transLoading={transLoading}
                        setTransLoading={setTransLoading}
                        startDate={startDate}
                        endDate={endDate}
                    />
                </TabPanel>

                <TabPanel value="3" sx={{ padding: "24px 0 0 0" }}>
                    <ReimbursementsTable
                        page={page}
                        setPage={setPage}
                        merchantId={merchantId}
                        status={status}
                        services={services}
                        sort={sort}
                        sortType={sortType}
                        reimbursementTime={reimbursementTime}
                        startDate={startDate}
                        endDate={endDate}
                    />
                </TabPanel>

                <TabPanel value="4" sx={{ padding: "24px 0 0 0" }}>
                    <EditRequestTable
                        pageRequest={pageRequest}
                        setPageRequest={setPageRequest}
                        merchantId={merchantId}
                        status={status}
                        sort={sort}
                        sortType={sortType}
                        startDate={startDate}
                        endDate={endDate}
                    />
                </TabPanel>

                <TabPanel value="5" sx={{ padding: "24px 0 0 0" }}>
                    <GeolocationTable
                        pageRequest={pageRequest}
                        setPageRequest={setPageRequest}
                        merchantId={merchantId}
                        geoType={geoType}
                    />
                </TabPanel>
            </TabContext>
        </Box>
    )
}
const RightSide = ({ subtabIndex, setSelectedOwner, setSelectedCategory, clearFilter, setPageRequest, openDropDown, setOpenDropDown, status, setStatus, setMerchantId, setOwnerId, services, setServices, category, setCategory, sort, setSort, setSortType, setPage, transSort, setTransSort, setTransSortType, transMin, setTransMin, transMax, setTransMax, setMinVal, setMinSalesVal, setMaxVal, setMaxSalesVal, setTransLoading, reimbursementTime, setReimbursementTime, minSales, setMinSales, maxSales, setMaxSales, setLoading, startDate, setStartDate, endDate, setEndDate, setCity, geoType, setGeoType, merchantLogo, setMerchantLogo }) => {
    const { formatMessage } = useLocale();
    const navigate = useNavigate()
    const [allMerchants, setAllMerchants] = useState([]);
    const [eNameLoading, setENameLoading] = useState(false);
    const [timeoutMulti, setTimeoutMulti] = useState(null)
    const [cat, setCat] = useState([])
    const [owners, setOwners] = useState([])
    const [loadingExport, setLoadingExport] = useState(false)
    const [openInvoice, setOpenInvoice] = useState(false)

    const searchMerchants = async (text) => {

        const replacements = [['’', "'"], ['`', "'"], ['‘', "'"]];
        const replacedMerchantName = replacements.reduce((acc, [pattern, replacement]) => acc.replace(new RegExp(pattern, 'g'), replacement), text);

        setENameLoading(true)
        if (text[0] === "+") {
            setENameLoading(false)
            setOpenDropDown(true)
            setAllMerchants([])
        } else if (text?.length >= 2) {
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
            setAllMerchants(data?.data?.docs)
        } else {
            setOpenDropDown(false);
            const filteredUsers = allMerchants?.filter((user) => {
                const userName = `${user?.name}`;
                return userName.toLowerCase().includes(replacedMerchantName.toLowerCase());
            });
            setAllMerchants([...filteredUsers]);
        }
    };

    const searchLocations = async (text) => {

        const replacements = [['’', "'"], ['`', "'"], ['‘', "'"]];
        const replacedMerchantName = replacements.reduce((acc, [pattern, replacement]) => acc.replace(new RegExp(pattern, 'g'), replacement), text);

        setENameLoading(true)
        if (text[0] === "+") {
            setENameLoading(false)
            setOpenDropDown(true)
            setAllMerchants([])
        } else if (text?.length >= 2) {
            setOpenDropDown(true);
            const data = await axiosMerchant.get(`/locations`, {
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
            setAllMerchants(data?.data)
        } else {
            setOpenDropDown(false);
            const filteredUsers = allMerchants?.filter((user) => {
                const userName = `${user?.name}`;
                return userName.toLowerCase().includes(replacedMerchantName.toLowerCase());
            });
            setAllMerchants([...filteredUsers]);
        }
    };

    const handleAmountChange = (e, type) => {
        if (type === 'min') {
            setTransMin(e.target.value)
        } else {
            setTransMax(e.target.value)
        }

        try {
            clearTimeout(timeoutMulti)
        }
        catch {

        }
        setTransLoading(true)
        setTimeoutMulti(setTimeout(() => {
            if (type === 'min') {
                setMinVal(e.target.value)
            } else {
                setMaxVal(e.target.value)
            }
            setPage(1)
        }, 1500))
    }

    const handleSalesChange = (e, type) => {
        if (type === 'min') {
            setMinSales(e.target.value)
        } else {
            setMaxSales(e.target.value)
        }

        try {
            clearTimeout(timeoutMulti)
        }
        catch {

        }
        setLoading(true)
        setTimeoutMulti(setTimeout(() => {
            if (type === 'min') {
                setMinSalesVal(e.target.value)
            } else {
                setMaxSalesVal(e.target.value)
            }
            setPage(1)
        }, 1500))
    }

    // get categories
    useEffect(() => {
        const filterCategories = {
            ...(({ order: `${"createdAt"} ${"DESC"} ` }) || {}),
        };

        axiosMerchant.get(`/categories`, {
            params: {
                filter: {
                    ...filterCategories,
                    include: [
                        {
                            relation: "merchants",
                            scope: {
                                fields: {
                                    id: true
                                }
                            }
                        }
                    ]
                }
            }
        })
            .then((res) => {
                setCat(res?.data)
            })
            .catch((error) => {
            })
    }, [])

    // Get owners
    useEffect(() => {
        axiosMerchant.get(`/owners`, {
            params: {
                filter: {
                    include: [
                        {
                            relation: "merchants", scope: {
                                fields: {
                                    id: true,
                                }
                            }
                        }
                    ]
                }
            }
        })
            .then((res) => {
                setOwners(res?.data?.docs)
            })
            .catch((error) => {
            })
    }, [])

    const sortOwners = (a, b) => {
        if (a?.firstName?.toLowerCase() < b?.firstName?.toLowerCase()) return -1;
        if (a?.firstName?.toLowerCase() > b?.firstName?.toLowerCase()) return 1;
        return 0;
    };

    const sortCities = (a, b) => {
        if (a?.city?.toLowerCase() < b?.city?.toLowerCase()) return -1;
        if (a?.city?.toLowerCase() > b?.city?.toLowerCase()) return 1;
        return 0;
    };

    const onExportReimbursment = async () => {
        setLoadingExport(true)
        try {
            const endDateDefault = new Date(Date.now())
            const startDateDefault = new Date(endDateDefault.getFullYear(), endDateDefault.getMonth(), 1)

            const DateRange = [
                ((startDate && startDate.toISOString()) || startDateDefault.toISOString()),
                ((endDate && endDate.toISOString()) || endDateDefault.toISOString()),
            ];

            const whereReimbursement = {
                ...((DateRange?.length > 0 && { createdAt: { between: DateRange } }) || {})
            };

            const filterReimbursement = {
                ...((whereReimbursement && { where: whereReimbursement }) || {})
            };

            const response = await axios.get(`/v2/export/merchant/reimboursement`,
                {
                    params: {
                        filter: {
                            ...filterReimbursement,
                            include: [
                                { relation: "merchant" },
                                { relation: "transaction" }
                            ],
                            order: ["createdAt DESC"]
                        },
                        ...((reimbursementTime && { reimburseFrequency: reimbursementTime }) || {})
                    },
                    responseType: "blob"
                }
            )

            const blob = new Blob([response], { type: response.type });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "reimboursements";
            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            setLoadingExport(false)
            return null;
        }
        catch {
            setLoadingExport(false)
        }

    }

    const onExportTransactions = async () => {
        const endDateDefault = new Date(Date.now())
        const startDateDefault = new Date(endDateDefault.getFullYear(), endDateDefault.getMonth(), 1)

        setLoadingExport(true)
        const filterTransaction = {
            ...((startDate && { startDate }) || { startDate: startDateDefault.toISOString() }),
            ...((endDate && { endDate }) || { endDate: endDateDefault.toISOString() })
        };

        try {

            const response = await axios.get(`/v2/export/transactions`, {
                params: {
                    ...filterTransaction,
                    page: 1,
                    limit: 100000
                },
                responseType: "blob"
            })

            const blob = new Blob([response], { type: response.type });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "transactions";
            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            setLoadingExport(false)
            return null;
        }
        catch {
            setLoadingExport(false)
        }
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

                {subtabIndex !== "5" &&
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
                                setPageRequest(1)
                                setPage(1)
                                setMerchantId(value?.id)
                                setSelectedCategory(null)
                                setCategory("")
                                setSelectedOwner(null)
                                setOwnerId("")
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
                }

                {subtabIndex === "3" ?
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
                        label={status?.length > 0 ? "" : formatMessage({ id: "advance.status" })}
                        InputLabelProps={{ shrink: false }}
                        fullWidth
                        value={status}
                        onChange={(e) => { setStatus(e.target.value); setPage(1); setPageRequest(1) }}
                    >
                        <MenuItem value={"pending"}>{formatMessage({ id: "evoucher.pending" })}</MenuItem>
                        <MenuItem value={"handling"}>{formatMessage({ id: "evoucher.handling" })}</MenuItem>
                        <MenuItem value={"processed"}>{formatMessage({ id: "evoucher.processed" })}</MenuItem>
                        <MenuItem value={"cancelled"}>{formatMessage({ id: "evoucher.cancelled" })}</MenuItem>
                    </TextField>
                    : ""}

                {subtabIndex === "4" ?
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
                        label={status?.length > 0 ? "" : formatMessage({ id: "advance.status" })}
                        InputLabelProps={{ shrink: false }}
                        fullWidth
                        value={status}
                        onChange={(e) => { setStatus(e.target.value); setPage(1); setPageRequest(1) }}
                    >
                        <MenuItem value={"pending"}>{formatMessage({ id: "evoucher.pending" })}</MenuItem>
                        <MenuItem value={"accepted"}>{formatMessage({ id: "filter.accepted" })}</MenuItem>
                        <MenuItem value={"rejected"}> {formatMessage({ id: "filter.rejected" })}</MenuItem>
                    </TextField>
                    : ""}

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
                                    <span>{formatMessage({ id: "merchants.totalsales" })} (MAD)</span>
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
                                            value={minSales}
                                            onChange={(e) => handleSalesChange(e, "min")}
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
                                            value={maxSales}
                                            onChange={(e) => handleSalesChange(e, "max")}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        </div>

                        <Field onClick={() => { setSort(sort === 'ASC' ? 'DESC' : 'ASC'); setSortType('totalSales'); setPage(1) }}>
                            <span>{formatMessage({ id: "merchants.sorttotalsales" })}</span>
                            <img src="/icons/Employee/filter.svg" />
                        </Field>

                        {/* <Field onClick={() => { setSort(sort === 'ASC' ? 'DESC' : 'ASC'); setSortType('ranking') }}>
                            <span>Sort By Ranking</span>
                            <img src="/icons/Employee/filter.svg" />
                        </Field> */}

                        {/* <Field onClick={() => { setSort(sort === 'ASC' ? 'DESC' : 'ASC'); setSortType('city'); setPage(1) }}>
                            <span>{formatMessage({ id: "merchants.city" })}</span>
                            <img src="/icons/Employee/filter.svg" />
                        </Field> */}

                        <Autocomplete
                            id="city"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "50px",
                                    backgroundColor: "var(--color-blue)",
                                },
                                "& fieldset": { border: "none" },
                                // "& .MuiSvgIcon-root": { display: "none" },
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
                            options={cities?.sort(sortCities)}
                            getOptionLabel={(option) => `${option?.city}`}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={formatMessage({ id: "merchants.city" })}
                                />
                            )}
                            onChange={(_, value, reason) => {
                                if (reason === "clear") {
                                    setCity("");
                                    return;
                                } else {
                                    setCity(value?.city);
                                    setPage(1)
                                }
                            }}
                        />

                        <TextField
                            select
                            id="service"
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
                            label={services?.length > 0 ? "" : "Service"}
                            InputLabelProps={{ shrink: false }}
                            fullWidth
                            value={services}
                            onChange={(e) => { setServices(e.target.value); setPage(1) }}
                        >
                            <MenuItem value={"In-place"}>{formatMessage({ id: "merchants.inplace" })}</MenuItem>
                            <MenuItem value={"Delivery"}>{formatMessage({ id: "merchants.delivery" })}</MenuItem>
                            <MenuItem value={"In-place & Delivery"}>{formatMessage({ id: "merchants.inplaceanddelivery" })}</MenuItem>
                            <MenuItem value={"In-App"}>{formatMessage({ id: "merchants.inapp" })}</MenuItem>
                            <MenuItem value={"External"}>{formatMessage({ id: "merchants.external" })}</MenuItem>
                        </TextField>

                        <TextField
                            select
                            id="category"
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
                            label={category?.length > 0 ? "" : formatMessage({ id: "merchants.category" })}
                            InputLabelProps={{ shrink: false }}
                            fullWidth
                            value={category}
                            onChange={(e) => { setCategory(e.target.value); setPage(1) }}
                        >
                            {cat?.sort((a, b) => {
                                const nameA = a.name.toLowerCase();
                                const nameB = b.name.toLowerCase();
                                if (nameA < nameB) return -1;
                                if (nameA > nameB) return 1;
                                return 0;
                            })?.map((el, index) => {
                                return (
                                    <MenuItem
                                        key={index}
                                        value={el?.name}
                                        title={el?.name}
                                        onClick={() => { setSelectedCategory(el); setMerchantId(""); document?.getElementsByClassName("MuiAutocomplete-clearIndicator")[0]?.click() }}>
                                        <span style={{ width: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {el?.name}
                                        </span>
                                    </MenuItem>
                                )
                            })}
                        </TextField>

                        {/* <TextField
                            select
                            id="owner"
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
                            label={ownerId?.length > 0 ? "" : formatMessage({ id: "merchants.create.owner" })}
                            InputLabelProps={{ shrink: false }}
                            fullWidth
                            value={ownerId}
                            onChange={(e) => { setOwnerId(e.target.value); setPage(1) }}
                        >
                            {owners?.map((el, index) => {
                                return (
                                    <MenuItem
                                        key={index}
                                        value={el?.id}
                                        onClick={() => { setSelectedOwner(el); setMerchantId(""); document?.getElementsByClassName("MuiAutocomplete-clearIndicator")[0]?.click() }}>{`${el?.firstName} ${el?.lastName}`}</MenuItem>
                                )
                            })}
                        </TextField> */}

                        <Autocomplete
                            id="owners"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "50px",
                                    backgroundColor: "var(--color-blue)",
                                },
                                "& fieldset": { border: "none" },
                                // "& .MuiSvgIcon-root": { display: "none" },
                                "& .MuiFormLabel-root": {
                                    color: "var(--color-dark-blue) !important",
                                    fontWeight: "600",
                                    fontSize: "15px",
                                    textTransform: "capitalize",
                                },
                                "& .MuiButtonBase-root": { display: "none" }
                            }}
                            size="small"
                            InputLabelProps={{ shrink: false }}
                            fullWidth
                            options={owners?.sort(sortOwners)}
                            getOptionLabel={(option) => `${option?.firstName} ${option?.lastName}`}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={formatMessage({ id: "merchants.create.owner" })}
                                />
                            )}
                            onChange={(_, value, reason) => {
                                if (reason === "clear") {
                                    setPage(1)
                                    setOwnerId("")
                                    return;
                                } else {
                                    setOwnerId(value?.id);
                                    setPage(1)
                                    setSelectedOwner(value);
                                    setMerchantId("");
                                    document?.getElementsByClassName("MuiAutocomplete-clearIndicator")[0]?.click()
                                }
                            }}
                        />

                        <TextField
                            select
                            id="logo"
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
                            label={merchantLogo === "true" || merchantLogo === "false" ? "" : formatMessage({ id: "merchants.logo" })}
                            InputLabelProps={{ shrink: false }}
                            fullWidth
                            value={merchantLogo}
                            onChange={(e) => { setMerchantLogo(e.target.value); setPage(1) }}
                        >
                            <MenuItem value={"true"}>{formatMessage({ id: "merchants.added" })}</MenuItem>
                            <MenuItem value={"false"}>{formatMessage({ id: "merchants.notadded" })}</MenuItem>
                        </TextField>
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
                                    <span>{formatMessage({ id: "merchants.amount" })} (MAD)</span>
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
                                            value={transMin}
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
                                            value={transMax}
                                            onChange={(e) => handleAmountChange(e, "max")}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        </div>

                        <Field onClick={() => { setTransSort(-transSort); setTransSortType('amount'); setPage(1) }}>
                            <span>{formatMessage({ id: "merchants.amountsort" })}</span>
                            <img src="/icons/Employee/filter.svg" />
                        </Field>

                        {/* <Field onClick={() => { setTransSort(-transSort); setTransSortType('createdAt'); setPage(1) }}>
                            <span>Date</span>
                            <img src="/icons/Employee/filter.svg" />
                        </Field> */}

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

                        <hr />
                        <Button
                            onClick={() => onExportTransactions()}
                            id="request-voucher"
                            variant="outlined"
                            size="large"
                            disabled={loadingExport}
                            fullWidth
                            sx={{
                                color: "#fff",
                                backgroundColor: "var(--color-dark-blue) !important",
                                borderRadius: "20px",
                                textTransform: "capitalize",
                                fontWeight: "600",
                                borderColor: "var(--color-dark-blue) !important"
                            }}
                        >
                            {loadingExport ?
                                <CircularProgress
                                    size={25}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: "#fff"
                                    }}
                                /> :
                                formatMessage({ id: "merchants.exporttransactions" })}
                        </Button>
                    </>
                }

                {subtabIndex === "3" &&
                    <>
                        <TextField
                            select
                            id="service"
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
                            label={reimbursementTime?.length > 0 ? "" : formatMessage({ id: "merchants.reimbursementtime" })}
                            InputLabelProps={{ shrink: false }}
                            fullWidth
                            value={reimbursementTime}
                            onChange={(e) => { setReimbursementTime(e.target.value); setPage(1); setMerchantId(""); setAllMerchants([]); document?.getElementsByClassName("MuiAutocomplete-clearIndicator")[0]?.click() }}
                        >
                            <MenuItem value={"Daily"}>{formatMessage({ id: "merchants.daily" })}</MenuItem>
                            <MenuItem value={"Weekly"}>{formatMessage({ id: "merchants.weekly" })}</MenuItem>
                            <MenuItem value={"Bi-Weekly"}>{formatMessage({ id: "merchants.biweekly" })}</MenuItem>
                            <MenuItem value={"Monthly"}>{formatMessage({ id: "merchants.monthly" })}</MenuItem>
                        </TextField>

                        {/* <Field onClick={() => { setSort(sort === 'ASC' ? 'DESC' : 'ASC'); setPage(1) }}>
                            <span>Date</span>
                            <img src="/icons/Employee/filter.svg" />
                        </Field> */}

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

                        <hr />
                        <Button
                            onClick={() => onExportReimbursment()}
                            id="request-voucher"
                            variant="outlined"
                            size="large"
                            disabled={loadingExport}
                            fullWidth
                            sx={{
                                color: "#fff",
                                backgroundColor: "var(--color-dark-blue) !important",
                                borderRadius: "20px",
                                textTransform: "capitalize",
                                fontWeight: "600",
                                borderColor: "var(--color-dark-blue) !important"
                            }}
                        >
                            {loadingExport ?
                                <CircularProgress
                                    size={25}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: "#fff"
                                    }}
                                /> :
                                formatMessage({ id: "merchants.exportreimbursment" })}
                        </Button>

                        <Button
                            onClick={() => setOpenInvoice(true)}
                            id="request-voucher"
                            variant="contained"
                            size="large"
                            fullWidth
                            disableElevation
                            sx={{
                                color: "var(--color-dark-blue)",
                                backgroundColor: "transparent !important",
                                borderRadius: "20px",
                                textTransform: "capitalize",
                                fontWeight: "600",
                                border: "1px solid var(--color-dark-blue) !important"
                            }}
                        >
                            {formatMessage({ id: "merchants.generateinvoice" })}
                        </Button>
                    </>
                }

                {subtabIndex === "4" &&
                    <>
                        {/* <Field onClick={() => { setSort(sort === 'ASC' ? 'DESC' : 'ASC'); setPageRequest(1) }}>
                            <span>Date</span>
                            <img src="/icons/Employee/filter.svg" />
                        </Field> */}

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
                    </>
                }

                {subtabIndex === "5" &&
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
                                    setPageRequest(1)
                                    setPage(1)
                                    setMerchantId(value?.id)
                                    setSelectedCategory(null)
                                    setCategory("")
                                    setSelectedOwner(null)
                                    setOwnerId("")
                                    setOpenDropDown(false)
                                }
                            }}
                            onInputChange={(_, value, reason) => {
                                if (reason === "clear") {
                                    setAllMerchants([])
                                    return;
                                } else {
                                    searchLocations(value);
                                }
                            }}
                        />

                        <TextField
                            select
                            id="geotype"
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
                            label={geoType?.length > 0 ? "" : formatMessage({ id: "filter.type" })}
                            InputLabelProps={{ shrink: false }}
                            fullWidth
                            value={geoType}
                            onChange={(e) => { setGeoType(e.target.value); setPageRequest(1) }}
                        >
                            <MenuItem value={"true"}>{formatMessage({ id: "merchants.merchant" })}</MenuItem>
                            <MenuItem value={"false"}>{formatMessage({ id: "merchants.partner" })}</MenuItem>
                        </TextField>

                        <hr />

                        <Button
                            onClick={() => navigate(`/partner-profile`)}
                            id="request-voucher"
                            variant="outlined"
                            size="large"
                            fullWidth
                            sx={{
                                color: "#fff",
                                backgroundColor: "var(--color-dark-blue) !important",
                                borderRadius: "20px",
                                textTransform: "capitalize",
                                fontWeight: "600",
                                borderColor: "var(--color-dark-blue) !important",
                                marginBottom: { xs: "1rem", sm: "0" }
                            }}
                        >
                            {formatMessage({ id: "merchants.addpartner" })}
                        </Button>

                        <Button
                            onClick={() => navigate(`/manage-map`)}
                            id="request-voucher"
                            variant="outlined"
                            size="large"
                            fullWidth
                            sx={{
                                color: "var(--color-dark-blue)",
                                borderRadius: "20px",
                                textTransform: "capitalize",
                                fontWeight: "600",
                                borderColor: "var(--color-dark-blue) !important",
                                marginBottom: { xs: "1rem", sm: "0" }
                            }}
                        >
                            {formatMessage({ id: "merchants.managemap" })}
                        </Button>
                    </>
                }

                <Dialog
                    open={openInvoice}
                    onClose={() => setOpenInvoice(false)}
                    fullWidth
                    sx={{ "& .MuiDialog-paper": { borderRadius: "35px" } }}
                    maxWidth={"md"}
                >
                    <GenerateInvoice setOpenInvoice={setOpenInvoice} />
                </Dialog>
            </ContFilter>
        </>
    )
}

function Merchants() {
    const location = useLocation();

    const [subtabIndex, setSubTabIndex] = useState(location?.state?.geolocation ? "5" : "1")
    const [status, setStatus] = useState("")
    const [maxSales, setMaxSales] = useState("")
    const [minSales, setMinSales] = useState("")
    const [openDropDown, setOpenDropDown] = useState(false);
    const [transLoading, setTransLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [merchantId, setMerchantId] = useState("")
    const [ownerId, setOwnerId] = useState(location?.state?.data?.id || "")
    const [selectedOwner, setSelectedOwner] = useState(location?.state?.data || null)
    const [page, setPage] = useState(Number(localStorage.getItem("merchantPageNumber")) || 1)
    const [pageRequest, setPageRequest] = useState(1)
    const [services, setServices] = useState("")
    const [category, setCategory] = useState(location?.state?.category?.name || "")
    const [selectedCategory, setSelectedCategory] = useState(location?.state?.category || null)
    const [sort, setSort] = useState("DESC")
    const [sortType, setSortType] = useState("createdAt")
    const [transSort, setTransSort] = useState(-1)
    const [transSortType, setTransSortType] = useState("createdAt")
    const [transMin, setTransMin] = useState("")
    const [transMax, setTransMax] = useState("")
    const [minVal, setMinVal] = useState("")
    const [maxVal, setMaxVal] = useState("")
    const [minSalesVal, setMinSalesVal] = useState("")
    const [maxSalesVal, setMaxSalesVal] = useState("")
    const [reimbursementTime, setReimbursementTime] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [city, setCity] = useState("")
    const [geoType, setGeoType] = useState("")
    const [merchantLogo, setMerchantLogo] = useState()

    const tabSubHandler = (e, val) => {
        setSubTabIndex(val)
        setPage(1)
        setPageRequest(1)
        setStatus("")
        setMerchantId("")
        setOpenDropDown(false)
        setServices("")
        setCategory("")
        setSort("DESC")
        setSortType("createdAt")
        setTransSort(-1)
        setTransSortType("createdAt")
        setTransMin("")
        setTransMax("")
        setMinVal("")
        setMaxVal("")
        setMinSalesVal("")
        setMaxSalesVal("")
        setReimbursementTime("")
        setMinSales("")
        setMaxSales("")
        setOwnerId("")
        setSelectedOwner(null)
        setSelectedCategory(null)
        setStartDate("")
        setEndDate("")
        setCity("")
        setGeoType("")
        setMerchantLogo()
        document?.getElementsByClassName("MuiAutocomplete-clearIndicator")[0]?.click()
    }

    const clearFilter = () => {
        setServices("")
        setCategory("")
        setSort("DESC")
        setSortType("createdAt")
        setMerchantId("")
        setOwnerId("")
        setPageRequest(1)
        setPage(1)
        setStatus("")
        setTransSort(-1)
        setTransMin("")
        setTransMax("")
        setMinVal("")
        setMaxVal("")
        setMinSalesVal("")
        setMaxSalesVal("")
        setTransSortType("createdAt")
        setReimbursementTime("")
        setMinSales("")
        setMaxSales("")
        setSelectedOwner(null)
        setSelectedCategory(null)
        setStartDate("")
        setEndDate("")
        setCity("")
        setGeoType("")
        setMerchantLogo()
        window.history.replaceState({}, document.title)
        document?.getElementsByClassName("MuiAutocomplete-clearIndicator")[0]?.click()
    }

    return (
        <SideContainer
            LeftSideComponent={
                <LeftSide
                    tabSubHandler={tabSubHandler}
                    subtabIndex={subtabIndex}
                    page={page}
                    setPage={setPage}
                    merchantId={merchantId}
                    services={services}
                    category={category}
                    sort={sort}
                    sortType={sortType}
                    pageRequest={pageRequest}
                    setPageRequest={setPageRequest}
                    status={status}
                    transSort={transSort}
                    transSortType={transSortType}
                    minVal={minVal}
                    maxVal={maxVal}
                    minSalesVal={minSalesVal}
                    maxSalesVal={maxSalesVal}
                    minSales={minSales}
                    maxSales={maxSales}
                    transLoading={transLoading}
                    setTransLoading={setTransLoading}
                    reimbursementTime={reimbursementTime}
                    loading={loading}
                    setLoading={setLoading}
                    selectedOwner={selectedOwner}
                    selectedCategory={selectedCategory}
                    startDate={startDate}
                    endDate={endDate}
                    clearFilter={clearFilter}
                    city={city}
                    geoType={geoType}
                    merchantLogo={merchantLogo}
                />
            }
            RightSideComponent={
                <RightSide
                    subtabIndex={subtabIndex}
                    setSubTabIndex={setSubTabIndex}
                    openDropDown={openDropDown}
                    setOpenDropDown={setOpenDropDown}
                    setMerchantId={setMerchantId}
                    setOwnerId={setOwnerId}
                    services={services}
                    category={category}
                    setCategory={setCategory}
                    setPage={setPage}
                    setServices={setServices}
                    sort={sort}
                    setSort={setSort}
                    setSortType={setSortType}
                    setPageRequest={setPageRequest}
                    status={status}
                    setStatus={setStatus}
                    transSort={transSort}
                    setTransSort={setTransSort}
                    setTransSortType={setTransSortType}
                    transMin={transMin}
                    setTransMin={setTransMin}
                    transMax={transMax}
                    setTransMax={setTransMax}
                    minVal={minVal}
                    setMinVal={setMinVal}
                    maxVal={maxVal}
                    setMaxVal={setMaxVal}
                    setMinSalesVal={setMinSalesVal}
                    setMaxSalesVal={setMaxSalesVal}
                    setTransLoading={setTransLoading}
                    reimbursementTime={reimbursementTime}
                    setReimbursementTime={setReimbursementTime}
                    minSales={minSales}
                    setMinSales={setMinSales}
                    maxSales={maxSales}
                    setMaxSales={setMaxSales}
                    setLoading={setLoading}
                    setSelectedOwner={setSelectedOwner}
                    setSelectedCategory={setSelectedCategory}
                    clearFilter={clearFilter}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    setCity={setCity}
                    geoType={geoType}
                    setGeoType={setGeoType}
                    merchantLogo={merchantLogo}
                    setMerchantLogo={setMerchantLogo}
                />
            }
        />
    )
}

export default Merchants