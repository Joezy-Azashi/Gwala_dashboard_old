import React, { useState, useEffect } from "react";
import SideContainer from "../../containers/SideContainer";
import {
  Box,
  Button,
  Autocomplete,
  MenuItem,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import { useLocale } from "../../locales";
import { ContFilter } from "../../components/employee/style";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate } from "react-router";
import UsedVouchersDetail from "../../components/Evoucher/UsedVouchersDetail";
import RequestVouchers from "../../components/Evoucher/RequestVouchers";
import { useSelector } from "react-redux";
import { getUsedVouchers, getVouchersUsersByName } from "../../api";
import dayjs from "dayjs";
import PageSpinner from "../../components/pagespinner/PageSpinner";

const LeftSide = ({
  usedVouchersGeneral,
  usedVouchersRestaurant,
  loading,
  selectedUserState,
}) => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const [openDetail, setOpenDetail] = useState(false);
  const [detailInfo, setDetailInfo] = useState({});
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
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
          }}
          my={2.5}
          px={1}
        >
          <Box sx={{ display: { xs: "block", sm: "flex" }, alignItems: "end", gap: 1.5 }}>
            <Typography
              variant="h5"
              fontWeight={600}
              lineHeight={"1"}
              textTransform={"capitalize"}
            >
              {formatMessage({ id: "evoucher.general" })}
            </Typography>
            <Typography variant="body2" mt={{ xs: 2, sm: 0 }}>
              {`${formatMessage({ id: "evoucher.totalamount" })}: ${!loading && usedVouchersGeneral?.totalAssignVouchers?.length > 0 ? usedVouchersGeneral?.totalAssignVouchers[0]?.total : "0.00"} MAD`}
            </Typography>
          </Box>

          <Typography
            onClick={() => navigate("/used-voucher-history/general")}
            color={"#002B69"}
            fontWeight={"600"}
            fontSize={"14px"}
            sx={{ cursor: "pointer" }}
          >
            {formatMessage({ id: "edoc.viewall" })}
          </Typography>
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
                          height: "20vh",
                        }}
                      >
                        <PageSpinner />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : usedVouchersGeneral?.docs?.length < 1 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "20vh",
                          fontSize: "1.2rem",
                        }}
                      >
                        {formatMessage({ id: "advance.norecords" })}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  usedVouchersGeneral?.docs?.map((el) => {
                    return (
                      <TableRow
                        key={el._id}
                        hover
                        role="checkbox"
                        sx={{
                          "& .MuiTableCell-root": {
                            border: "0px",
                            padding: "3px",
                            fontSize: "15px",
                            marginBottom: "4px",
                          },
                        }}
                        onClick={() => {
                          setOpenDetail(true);
                          setDetailInfo(el);
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
                            {`${formatMessage({ id: "evoucher.vouchersof" })} ${el.amount} MAD`}
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
                            }}>
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
      </Box>

      {/* Restaurant */}
      <Box sx={{ width: "100%", overflow: "hidden" }} mb={3}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
          }}
          my={2.5}
          px={1}
        >
          <Box sx={{ display: { xs: "block", sm: "flex" }, alignItems: "end", gap: 1.5 }}>
            <Typography
              variant="h5"
              fontWeight={600}
              lineHeight={"1"}
              textTransform={"capitalize"}
            >
              {formatMessage({ id: "evoucher.restaurant" })}
            </Typography>
            <Typography variant="body2" mt={{ xs: 2, sm: 0 }}>
              {`Total Amount: ${!loading && usedVouchersRestaurant?.totalAssignVouchers?.length > 0 ? usedVouchersRestaurant?.totalAssignVouchers[0]?.total : "0.00"} MAD`}
            </Typography>
          </Box>

          <Typography
            color={"#002B69"}
            fontWeight={"600"}
            fontSize={"14px"}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/used-voucher-history/restaurant")}
          >
            {formatMessage({ id: "edoc.viewall" })}
          </Typography>
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
                        height: "20vh",
                      }}
                    >
                      <PageSpinner />
                    </div>
                  </TableCell>
                </TableRow>
              ) : usedVouchersRestaurant?.docs?.length < 1 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "20vh",
                        fontSize: "1.2rem",
                      }}
                    >
                      {formatMessage({ id: "advance.norecords" })}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                usedVouchersRestaurant?.docs?.map((el) => {
                  return (
                    <TableRow

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
                      onClick={() => {
                        setOpenDetail(true);
                        setDetailInfo(el);
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
                          {`${formatMessage({ id: "evoucher.vouchersof" })} ${el.amount} MAD`}
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
          </Table>
        </TableContainer>
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
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const [eNameLoading, setENameLoading] = useState(false);
  const [allUsers, setUsers] = useState([]);
  const [timeoutMulti, setTimeoutMulti] = useState(null)
  const [openDropDown, setOpenDropDown] = useState(false);

  const [openRequestVouchers, setOpenRequestVouchers] = useState(false);

  const handleCloseRequest = (event, reason) => {
    if (reason && reason == "backdropClick") {
      return;
    } else {
      setOpenRequestVouchers(false);
    }
  };

  const searchVoucherUsers = (text) => {
    setENameLoading(true)
    setOpenDropDown(true);
    try {
      clearTimeout(timeoutMulti)
    }
    catch {

    }
    setTimeoutMulti(setTimeout(() => {
      searchVocuherFunction(text)
    }, 1500))
  }

  const searchVocuherFunction = async (text) => {
    if (text.length >= 2) {
      const data = await getVouchersUsersByName(1, 9, `searchQuery=${text}`);

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
  }

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
            <span>{formatMessage({ id: "advance.date" })}</span>
            <img src="/icons/Employee/filter.svg" />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                id="startDate"
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
                id="endDate"
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
            id="request-voucher"
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
            id="assign-voucher"
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

function UsedVoucherHistory() {
  const INITIAL_FILTER = {
    startDate: "",
    endDate: "",
    userId: "",
    companyId: "",
    type: ["GENERAL", "RESTAURANT"],
  };

  const [filter, setFilter] = useState(INITIAL_FILTER);
  const [filterPage, setPage] = useState(1);
  const [usedVouchersGeneral, setUsedVouchersGeneral] = useState([]);
  const [usedVouchersRestaurant, setUsedVouchersRestaurant] = useState([]);
  const [loading, setLoading] = useState(false);
  const selectedUserState = useSelector((state) => state.userInfos);

  const fetchData = async () => {
    if (filterPage > 0) {
      setLoading(true);
      const { userId, startDate, endDate, companyId, type } = filter;

      const filtersGeneral = {
        ...((startDate && { startDate }) || { startDate: dayjs("2023-01-01") }),
        ...((endDate && { endDate }) || {}),
        ...((userId && { userId }) || {}),
        ...((companyId && { companyId }) || {}),
        ...({ type: type[0] } || {}),
      };
      const queryParamsGeneral = new URLSearchParams({ ...filtersGeneral });
      const dataGeneral = await getUsedVouchers(
        filterPage,
        4,
        queryParamsGeneral
      );
      setUsedVouchersGeneral(dataGeneral);

      const filtersRestaurant = {
        ...((startDate && { startDate }) || { startDate: dayjs("2023-01-01") }),
        ...((endDate && { endDate }) || {}),
        ...((userId && { userId }) || {}),
        ...((companyId && { companyId }) || {}),
        ...({ type: type[1] } || {}),
      };
      const queryParamsRestaurant = new URLSearchParams({
        ...filtersRestaurant,
      });
      const dataRestaurant = await getUsedVouchers(
        filterPage,
        4,
        queryParamsRestaurant
      );
      setUsedVouchersRestaurant(dataRestaurant);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterPage, filter]);

  return (
    <SideContainer
      LeftSideComponent={
        <LeftSide
          usedVouchersGeneral={usedVouchersGeneral}
          usedVouchersRestaurant={usedVouchersRestaurant}
          loading={loading}
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

export default UsedVoucherHistory;