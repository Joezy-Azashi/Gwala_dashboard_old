import React, { useState, useEffect } from "react";
import SideContainer from "../../containers/SideContainer";
import {
    Autocomplete,
    Badge,
    Box,
    Button,
    Dialog,
    MenuItem,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { useLocale } from "../../locales";
import { ContFilter } from "../../components/employee/style";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import NondigitalVoucherDetail from "../../components/Evoucher/NondigitalVoucherDetail";
import { useNavigate } from "react-router";
import RequestVouchers from "../../components/Evoucher/RequestVouchers";
import { getNondigitalAssignedVouchers, getVouchersUsersByEmployer } from "../../api";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import PageSpinner from "../../components/pagespinner/PageSpinner";
import moment from "moment";

const RightSide = ({
    filter,
    setFilter,
    INITIAL_FILTER,
    selectedUserState,
}) => {
    const { formatMessage } = useLocale();
    const navigate = useNavigate();
    const [eNameLoading, setENameLoading] = useState(false);
    const [allUsers, setUsers] = useState([]);
    const [openDropDown, setOpenDropDown] = useState(false);
    const [openRequestVouchers, setOpenRequestVouchers] = useState(false);

    const handleCloseRequest = (event, reason) => {
        if (reason && reason == "backdropClick") {
            return;
        } else {
            setOpenRequestVouchers(false);
        }
    };

    const searchVoucherUsers = async (text) => {
        setENameLoading(true);
        if (text.length >= 2) {
            setOpenDropDown(true);
            const data = await getVouchersUsersByEmployer(1, 20, `?searchQuery=${text}`);
            if (data) {
                setENameLoading(false);
            }
            setUsers([...data?.docs]);
        } else {
            setOpenDropDown(false);
            const filteredUsers = allUsers.filter((user) => {
                const userName = `${user.firstName} ${user.lastName}`;
                return userName.toLowerCase().includes(text.toLowerCase());
            });
            setUsers([...filteredUsers]);
        }
    };

    const clearFilter = () => {
        setFilter(INITIAL_FILTER);
        navigate(location.pathname, {});
        document
            .querySelectorAll(".MuiAutocomplete-clearIndicator")
            .forEach((element) => element.click());
    };

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
                    onClick={clearFilter}
                >
                    {formatMessage({ id: "employee.clearfilter" })}
                </Typography>

                {selectedUserState?.manages?.length > 0 &&
                    <Autocomplete
                        id="search-employees"
                        open={openDropDown}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        loading={eNameLoading}
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
                        size="small"
                        fullWidth
                        options={allUsers}
                        getOptionLabel={(option) => {
                            return `${option.firstName} ${option.lastName}`;
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={formatMessage({ id: "reimbursements.searchemployer" })}
                            />
                        )}
                        onChange={(_, value, reason) => {
                            if (reason === "clear") {
                                setFilter(INITIAL_FILTER);
                                setUsers([]);
                                return;
                            } else {
                                setFilter({
                                    ...filter,
                                    userId: value?._id,
                                });
                                setOpenDropDown(false);
                            }
                        }}
                        onInputChange={(_, value, reason) => {
                            if (reason === "clear") {
                                setFilter(INITIAL_FILTER);
                                setUsers([]);
                                return;
                            } else {
                                searchVoucherUsers(value);
                            }
                        }}
                    />
                }

                <div
                    style={{
                        background: "var(--color-blue)",
                        height: "100px",
                        borderRadius: 20,
                        padding: "13px",
                    }}
                >
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
                                id="start_date"
                                maxDate={filter?.endDate}
                                label={formatMessage({ id: "timetracker.startdate" })}
                                onChange={(value) =>
                                    setFilter({ ...filter, startDate: value.startOf("day") })
                                }
                                value={filter?.startDate}
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
                                minDate={filter?.startDate}
                                label={formatMessage({ id: "timetracker.enddate" })}
                                onChange={(value) =>
                                    setFilter({ ...filter, endDate: value.endOf("day") })
                                }
                                value={filter?.endDate}
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

                <TextField
                    id="voucher_type"
                    select
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
                    size="small"
                    label={
                        filter?.type === ""
                            ? formatMessage({ id: "filter.evoucher.type" })
                            : filter?.type === "GENERAL"
                                ? formatMessage({ id: "evoucher.general" })
                                : formatMessage({ id: "evoucher.restaurant" })
                    }
                    InputLabelProps={{ shrink: false }}
                    fullWidth
                >
                    <MenuItem onClick={() => setFilter({ ...filter, type: "GENERAL" })}>
                        {formatMessage({ id: "evoucher.general" })}
                    </MenuItem>
                    <MenuItem
                        onClick={() => setFilter({ ...filter, type: "RESTAURANT" })}
                    >
                        {formatMessage({ id: "evoucher.restaurant" })}
                    </MenuItem>
                </TextField>

                <TextField
                    id="status"
                    select
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
                    size="small"
                    label={
                        filter?.category === ""
                            ? formatMessage({ id: "merchants.category" })
                            : filter?.category === "SMS"
                                ? formatMessage({ id: "evoucher.sms" })
                                : formatMessage({ id: "evoucher.physical" })
                    }
                    InputLabelProps={{ shrink: false }}
                    fullWidth
                >
                    <MenuItem onClick={() => setFilter({ ...filter, category: "SMS" })}>
                        {formatMessage({ id: "evoucher.sms" })}
                    </MenuItem>
                    <MenuItem
                        onClick={() => setFilter({ ...filter, category: "PHYSICAL" })}
                    >
                        {formatMessage({ id: "evoucher.physical" })}
                    </MenuItem>
                </TextField>

                <Box
                    sx={{
                        background: "var(--color-blue)",
                        borderRadius: 20,
                        padding: "2px 5px",
                        display: selectedUserState?.manages?.length > 0 ? "flex" : "none",
                        justifyContent: "space-between",
                        cursor: "pointer",
                    }}
                >
                    <TextField
                        id="branch"
                        select
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
                        size="small"
                        label={
                            filter?.companyId === ""
                                ? formatMessage({ id: "filter.evoucher.branch" })
                                : selectedUserState?.manages?.find(
                                    (el) => el._id === filter?.companyId
                                )?.name
                        }
                        InputLabelProps={{ shrink: false }}
                        fullWidth
                    >
                        {selectedUserState?.manages?.length > 0 &&
                            selectedUserState?.manages?.map((el) => {
                                return (
                                    <MenuItem
                                        key={el?._id}
                                        onClick={() => setFilter({ ...filter, companyId: el?._id })}
                                    >
                                        {el?.name}
                                    </MenuItem>
                                );
                            })}
                    </TextField>
                </Box>

                <hr
                    style={{
                        border: "1px solid",
                        width: "100%",
                    }}
                />

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: "100%",
                    }}
                >
                    <Button
                        id="request_voucher"
                        onClick={() => setOpenRequestVouchers(true)}
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
                        }}
                    >
                        {formatMessage({ id: "evoucher.requestvoucher" })}
                    </Button>
                    <Button
                        id="assign_voucher"
                        onClick={() => navigate("/assign-voucher")}
                        variant="outlined"
                        fullWidth
                        size="large"
                        sx={{
                            color: "var(--color-dark-blue)",
                            borderRadius: "20px",
                            textTransform: "capitalize",
                            fontWeight: "600",
                            borderColor: "var(--color-dark-blue) !important",
                        }}
                    >
                        {formatMessage({ id: "evoucher.assignvoucher" })}
                    </Button>
                </Box>

                {/* Request vouchers */}
                <Dialog
                    open={openRequestVouchers}
                    onClose={handleCloseRequest}
                    fullWidth
                    maxWidth="sm"
                    sx={{ "& .MuiPaper-root": { borderRadius: "20px" } }}
                >
                    <RequestVouchers handleCloseRequest={handleCloseRequest} />
                </Dialog>
            </ContFilter>
        </>
    );
};

const LeftSide = ({
    requestedVouchersData,
    loading,
    page,
    fetchData,
    filter,
    selectedUserState,
}) => {
    const { formatMessage } = useLocale();
    const [openDetail, setOpenDetail] = useState(false);
    const [detailInfo, setDetailInfo] = useState({});

    const columns = [
        { id: "type", label: formatMessage({ id: "evoucher.singletypeof" }), style: { width: "14%" } },
        { id: "category", label: formatMessage({ id: "merchants.category" }), style: { width: "14%" } },
        {
            id: "branch", label: formatMessage({ id: "filter.branch" }),
            style: {
                width: "14%",
                display: selectedUserState?.manages?.length < 1 ? "none" : "",
            },
        },
        { id: "doneby", label: formatMessage({ id: "evoucher.doneby" }), style: { width: "20%" } },
        { id: "amount", label: formatMessage({ id: "merchants.amount" }), style: { width: "14%" } },
        { id: "date", label: formatMessage({ id: "evoucher.operationdate" }), style: { width: "14%" } },
        { id: "details", label: "", style: { width: "10%" } }
    ];

    return (
        <Box className="pageScroll">
            <Box sx={{ width: "100%", overflow: "hidden" }} mb={3}>
                <Box
                    sx={{ display: {xs: "block", sm: "flex"}, alignItems: "end", gap: 1.5 }}
                    my={2.5}
                    px={1}
                >
                    <Typography
                        variant="h5"
                        fontWeight={600}
                        lineHeight={"1"}
                        textTransform={"capitalize"}
                    >
                        {formatMessage({ id: "evoucher.nondigitalassignedvouchers" })}
                    </Typography>
                    <Typography variant="body2" mt={{xs: 2, sm : 0}}>
                        {formatMessage({ id: "evoucher.totalamount" })}:{" "}
                        {!requestedVouchersData?.totalAmountCodeVouchers || loading ? "0.00 MAD" : requestedVouchersData?.totalAmountCodeVouchers[0]?.total}
                    </Typography>
                </Box>

                <TableContainer
                    sx={{
                        overflowX: "scroll",
                        "&::-webkit-scrollbar": {
                            width: 0,
                        },
                        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                    }}
                >
                    <Table stickyHeader aria-label="sticky table" size="small">
                        <>
                            <TableHead>
                                <TableRow
                                    sx={{
                                        "& .MuiTableCell-root": {
                                            border: "0px",
                                            borderBottom: "1px solid #EFEFEF",
                                            textAlign: "center",
                                            padding: "3px",
                                        },
                                    }}
                                >
                                    {columns.map((column) => (
                                        <TableCell key={column.id} style={column.style}>
                                            <span
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "start",
                                                    fontWeight: "bolder",
                                                    padding: ".5rem 0",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {column.label}
                                            </span>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    height: "50vh",
                                                }}
                                            >
                                                <PageSpinner />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : requestedVouchersData?.docs?.length < 1 ? (
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    height: "50vh",
                                                    fontSize: "1.2rem",
                                                }}
                                            >
                                                {formatMessage({ id: "advance.norecords" })}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    requestedVouchersData?.docs?.map((el) => {
                                        return (
                                            <TableRow
                                                key={el._id}
                                                onClick={() => {
                                                    setOpenDetail(true)
                                                    setDetailInfo(el)
                                                }}
                                                hover
                                                role="checkbox"
                                                sx={{
                                                    "& .MuiTableCell-root": {
                                                        border: "0px",
                                                        padding: "3px",
                                                        fontSize: "15px",
                                                        marginBottom: "4px",
                                                        cursor: "pointer",
                                                        userSelect: "none",
                                                        marginTop: ".7rem"
                                                    },
                                                }}
                                            >
                                                <TableCell

                                                >
                                                    <Typography
                                                        color={"#002B69"}
                                                        fontWeight={"600"}
                                                        noWrap
                                                    >
                                                        {el.voucherType === "GENERAL"
                                                            ? formatMessage({ id: "evoucher.general" })
                                                            : formatMessage({ id: "evoucher.restaurant" })}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    {el?.category === "PHYSICAL" ? formatMessage({ id: "evoucher.physical" }) :
                                                        el?.category === "DIGITAL" ? formatMessage({ id: "evoucher.digital" }) :
                                                            el?.category}
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        display:
                                                            selectedUserState?.manages?.length < 1
                                                                ? "none"
                                                                : "",
                                                    }}
                                                >
                                                    {el.company?.name}
                                                </TableCell>

                                                <TableCell style={{ whiteSpace: "nowrap" }}>
                                                    {`${el?.employer?.firstName} ${el?.employer?.lastName}`}
                                                </TableCell>

                                                <TableCell sx={{ display: "flex", gap: 1 }}>
                                                    <Badge
                                                        max={10000}
                                                        key={el?.amount}
                                                        badgeContent={el?.count}
                                                        sx={{
                                                            "& .MuiBadge-badge": {
                                                                backgroundColor: "var(--color-dark-blue)",
                                                                color: "#fff",
                                                            }
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                backgroundColor: "#DFEAFC",
                                                                textAlign: "center",
                                                                padding: ".2rem .5rem",
                                                                borderRadius: "8px",
                                                                color: "var(--color-dark-blue)"
                                                            }}
                                                        >
                                                            <Typography
                                                                fontSize={"15px"}
                                                                fontWeight={"600"}
                                                                marginBottom={"-4px"}
                                                            >
                                                                {el.amount}
                                                            </Typography>
                                                            <Typography fontSize={"11px"}>MAD</Typography>
                                                        </Box>
                                                    </Badge>
                                                </TableCell>

                                                <TableCell
                                                    sx={{ color: el?.status === "PROCESSED" ? "green" : el?.status === "REJECTED" ? "#FA3E3E" : el?.status === "HANDLING" ? "var(--color-dark-blue)" : "" }}
                                                >
                                                    {moment(el?.date).format("DD/MM/YYYY")}
                                                </TableCell>

                                                <TableCell>
                                                    <Button
                                                        id="detail"
                                                        variant="outlined"
                                                        sx={{
                                                            textTransform: "capitalize",
                                                            color: "#000",
                                                            borderColor: "gray !important",
                                                            fontWeight: "600",
                                                            padding: "1px 8px",
                                                        }}
                                                    >
                                                        {formatMessage({ id: "edoc.details" })}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </>
                    </Table>
                </TableContainer>
                {requestedVouchersData?.totalPages > 1 && (
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            margin: "10px 0",
                        }}
                    >
                        <Pagination
                            hidePrevButton
                            hideNextButton
                            count={requestedVouchersData?.totalPages || 1}
                            variant="outlined"
                            shape="rounded"
                            onChange={(e, value) => fetchData(value)}
                            page={page}
                        />
                    </div>
                )}
            </Box>
            <Dialog
                open={openDetail}
                onClose={() => setOpenDetail(false)}
                fullWidth
                maxWidth="sm"
                sx={{ "& .MuiPaper-root": { borderRadius: "20px" } }}
            >
                <NondigitalVoucherDetail detailInfo={detailInfo} />
            </Dialog>
        </Box>
    );
};

function HistoryNondigitalVouchers() {
    const selectedUserState = useSelector((state) => state.userInfos);

    const INITIAL_FILTER = {
        category: "",
        amount: "",
        startDate: "",
        endDate: "",
        userId: "",
        companyId: "",
        type: "",
    };

    const [filter, setFilter] = useState(INITIAL_FILTER);
    const [page, setPage] = useState(1);
    const [requestedVouchers, setRequestedVouchers] = useState([]);

    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const { category, amount, startDate, endDate, type, userId, companyId } = filter;

        const filters = {
            ...((category && { category }) || {}),
            ...((amount && { amount }) || {}),
            ...((startDate && { startDate }) || { startDate: dayjs("2023-01-01") }),
            ...((endDate && { endDate }) || {}),
            ...((userId && { employerId: userId }) || {}),
            ...((companyId && { companyId }) || {}),
            ...((type && { voucherType: type }) || {}),
        };
        const queryParams = new URLSearchParams({ ...filters });
        const data = await getNondigitalAssignedVouchers(page, 10, queryParams);
        setRequestedVouchers(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [page, filter]);

    return (
        <SideContainer
            LeftSideComponent={
                <LeftSide
                    requestedVouchersData={requestedVouchers}
                    loading={loading}
                    page={page}
                    fetchData={setPage}
                    filter={filter}
                    selectedUserState={selectedUserState}
                />
            }
            RightSideComponent={
                <RightSide
                    requestedVouchersData={requestedVouchers}
                    setRequestedVouchers={setRequestedVouchers}
                    filter={filter}
                    setFilter={setFilter}
                    INITIAL_FILTER={INITIAL_FILTER}
                    selectedUserState={selectedUserState}
                />
            }
        />
    );
}

export default HistoryNondigitalVouchers;
