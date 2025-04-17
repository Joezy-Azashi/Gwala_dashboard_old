import React, { useState, useEffect } from "react";
import SideContainer from "../../containers/SideContainer";
import {
  Box,
  Button,
  Dialog,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Autocomplete,
  Typography,
  Pagination,
  Tooltip,
} from "@mui/material";
import { useLocale } from "../../locales";
import { ContFilter } from "../../components/employee/style";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import UsedVouchersDetail from "../../components/Evoucher/UsedVouchersDetail";
import { useNavigate, useParams } from "react-router";

import RequestVouchers from "../../components/Evoucher/RequestVouchers";
import { useSelector } from "react-redux";
import { getUsedVouchers, getVouchersUsersByName } from "../../api";
import dayjs from "dayjs";
import PageSpinner from "../../components/pagespinner/PageSpinner";

const LeftSide = ({
  usedVouchersData,
  loading,
  page,
  fetchData,
  selectedUserState,
}) => {
  const { formatMessage } = useLocale();
  const { type } = useParams();
  const [openDetail, setOpenDetail] = useState(false);
  const [detailInfo, setDetailInfo] = useState({})

  const columns = [
    {
      id: "amount",
      label: "Voucher Amount",
      style: { width: "25%", color: "gray" },
    },
    {
      id: "date",
      label: "Operation Date",
      style: { width: "16%", color: "gray" },
    },
    {
      id: "branch",
      label: "Branch",
      style: {
        width: "30%",
        display: selectedUserState?.manages?.length < 1 ? "none" : "",
        color: "gray",
      },
    },
    {
      id: "assigned_to",
      label: "Assigned To",
      style: { width: "44%", color: "gray" },
    },
    { id: "buttons", label: "", style: { width: "5%" } },
  ];

  return (
    <Box className="pageScroll">
      {/* General */}
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
            {type?.toUpperCase() === "GENERAL"
              ? formatMessage({ id: "evoucher.general" })
              : formatMessage({ id: "evoucher.restaurant" })}
          </Typography>
          <Typography variant="body2" mt={{xs: 2, sm : 0}}>{`Total Amount: ${!loading && usedVouchersData?.totalAssignVouchers?.length > 0 ? usedVouchersData?.totalAssignVouchers[0]?.total : "0.00"} MAD`}</Typography>
        </Box>

        <TableContainer
          sx={{
            overflowX: "auto",
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
                  {columns.map((header) => {
                    return (
                      <TableCell key={header.id} style={header.style}>
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
                          {header.label}
                        </span>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6}>
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
                ) : usedVouchersData?.docs?.length < 1 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
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
                  usedVouchersData?.docs?.map((el) => {
                    return (
                      <TableRow
                        onClick={() => {
                          setOpenDetail(true)
                          setDetailInfo(el)
                        }}
                        key={el._id}
                        hover
                        role="checkbox"
                        sx={{
                          "& .MuiTableCell-root": {
                            border: "0px",
                            padding: "3px",
                            fontSize: "15px",
                            marginBottom: "4px",
                            cursor: "pointer"
                          },
                        }}
                      >
                        <TableCell
                          onClick={() => {
                            setOpenDetail(true)
                            setDetailInfo(el)
                          }}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "#002B69",
                            cursor: "pointer",
                            userSelect: "none"
                          }}
                        >
                          <Box
                            sx={{
                              backgroundColor: "#DFEAFC",
                              textAlign: "center",
                              padding: ".2rem .5rem",
                              borderRadius: "8px",
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
                          <Typography fontWeight={"600"} noWrap>
                            {`Voucher of ${el.amount} MAD`}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          {new Date(el.createdAt).toISOString().split("T")[0]}
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

                        <Tooltip
                          title={el.vouchers
                            ?.map((voucher) => {
                              if (voucher.users)
                                return `${voucher.users?.firstName} ${voucher.users?.lastName}`;
                              return `${formatMessage({ id: "evoucher.notfound" })}`
                            })
                            .join(", ")}
                        >
                          <TableCell
                            sx={{
                              width: "100%",
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: "2",
                              WebkitBoxOrient: "vertical",
                              overflowWrap: "break-word"
                            }}
                          >
                            {el.vouchers
                              ?.map((voucher) => {
                                if (voucher.users)
                                  return `${voucher.users?.firstName} ${voucher.users?.lastName}`;
                                return `${formatMessage({ id: "evoucher.notfound" })}`
                              })
                              .join(", ")}
                          </TableCell>
                        </Tooltip>

                        <TableCell>
                          <Button
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
        {usedVouchersData?.totalPages > 1 && (
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
              count={usedVouchersData?.totalPages || 1}
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
        <UsedVouchersDetail detailInfo={detailInfo} />
      </Dialog>
    </Box>
  );
};

const RightSide = ({
  filter,
  setFilter,
  INITIAL_FILTER,
  selectedUserState,
}) => {
  const navigate = useNavigate();
  const { formatMessage } = useLocale();
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
      const data = await getVouchersUsersByName(1, 100, `?searchQuery=${text}`);
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
    setUsers([]);
    setOpenDropDown(false);
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
        <Autocomplete
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
              label={formatMessage({ id: "reimbursements.search" })}
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
            <span>{formatMessage({ id: "evoucher.operationdate" })}</span>
            <img src="/icons/Employee/filter.svg" />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
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
                : selectedUserState?.manages?.find((el) => el._id === filter?.companyId).name
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

function ViewallUsedVoucherHistory() {
  const { type } = useParams();
  const navigate = useNavigate();

  const INITIAL_FILTER = {
    amount: "",
    startDate: "",
    endDate: "",
    userId: "",
    companyId: "",
    type: type,
  };

  const [filter, setFilter] = useState(INITIAL_FILTER);
  const [filterPage, setPage] = useState(1);
  const [usedVouchers, setUsedVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const selectedUserState = useSelector((state) => state.userInfos);

  const fetchData = async () => {
    if (filterPage > 0) {
      setLoading(true);
      const { userId, amount, startDate, endDate, type, companyId } = filter;

      const filters = {
        ...((amount && { amount }) || {}),
        ...((startDate && { startDate }) || { startDate: dayjs("2023-01-01") }),
        ...((endDate && { endDate }) || {}),
        ...((userId && { userId }) || {}),
        ...((companyId && { companyId }) || {}),
        ...((type && { type: type?.toUpperCase() }) || {}),
      };
      const queryParams = new URLSearchParams({ ...filters });
      const data = await getUsedVouchers(filterPage, 10, queryParams);
      setUsedVouchers(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!["RESTAURANT", "GENERAL"].includes(type?.toUpperCase()))
      navigate("/404");
  }, [type]);

  useEffect(() => {
    fetchData();
  }, [filterPage]);

  return (
    <SideContainer
      LeftSideComponent={
        <LeftSide
          usedVouchersData={usedVouchers}
          filter={filter}
          page={filterPage}
          loading={loading}
          fetchData={setPage}
          selectedUserState={selectedUserState}
        />
      }
      RightSideComponent={
        <RightSide
          filter={filter}
          setFilter={setFilter}
          INITIAL_FILTER={INITIAL_FILTER}
          selectedUserState={selectedUserState}
        />
      }
    />
  );
}

export default ViewallUsedVoucherHistory;
