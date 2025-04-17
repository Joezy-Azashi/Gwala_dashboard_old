import React, { useState, useEffect } from "react";
import { getEmployees, getExpenses } from "../../api";
import Button from "../../components/transaction/Button";
import StatusButton from "../../components/UI/Button";
import { Field, ContFilter } from "../../components/employee/style";
import styled from "styled-components";
import { DateRangePicker } from "../../components/UI";

import { useLocale } from "../../locales";
import SideContainer from "../../containers/SideContainer";
import { useSelector } from "react-redux";

import Pagination from "@mui/material/Pagination";
import {
  TableContainer,
  Typography,
  Grid,
  Hidden,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  TextField,
  MenuItem,
  Autocomplete,
  Checkbox,
  Tooltip,
} from "@mui/material";
import PageSpinner from "../../components/pagespinner/PageSpinner";
import { IOSSwitch } from "../../components/UI";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import axios from "../../api/request";
import DocumentsExpense from "../../components/UI/DisplayeExpenses";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const TabContainer = styled.div`
  tbody > tr {
    :hover * {
      /* background-color: #d9edff; */
      cursor: pointer;
    }
  }
`;

const INITIAL_FILTER = {
  status: "",
  type: "",
  startDate: "",
  endDate: "",
  userId: "",
  companyId: "",
};
const LeftSide = ({
  data,
  page,
  fetchData,
  setRefetch,
  refetch,
  setExpenses,
  expenses,
  filter,
  selectedUserState
}) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState();
  const [ids, setIds] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const { formatMessage } = useLocale();

  const payExpense = async (id, type, index) => {
    const result = await axios.put(`/v2/expenses/${id}?status=paid`);
    if (result?.status === "success") {
      toast(formatMessage({ id: "reimbursements.paid" }), {
        position: "top-right",
        theme: "colored",
        type: "success",
      });
      let newExpense = { ...expenses[index], status: "PAID" };
      expenses[index] = { ...newExpense };
      setExpenses([...expenses]);
    }
  };
  const approveAttachement = async (userId, type) => {
    if (type === "NOT") setRejectLoading(true);
    if (type === "VERIFIED") setApproveLoading(true);
    const result = await axios.put(`/v2/expenses`, {
      status:
        type === "NOT" ? "REJECTED" : type === "VERIFIED" ? "APPROVED" : type,
      expenseIds: [visible._id],
    });

    let message =
      type == "NOT" ? "reimbursements.reject" : "reimbursements.approve";
    if (result?.status === "success") {
      let index = expenses.findIndex((expense) => expense._id === visible._id);
      let newExpense = {
        ...expenses[index],
        status: type === "VERIFIED" ? "APPROVED" : "REJECTED",
      };
      expenses[index] = { ...newExpense };
      setExpenses([...expenses]);
      toast(formatMessage({ id: message }), {
        position: "top-right",
        theme: "colored",
        type: "success",
      });
    }
    setRejectLoading(false);
    setApproveLoading(false);
    setVisible();
  };

  const getApproveIds = (e) => {
    if (e.target.checked) {
      setIds((prevState) => [...prevState, e.target.value]);
    } else {
      setIds(ids.filter((item) => item !== e.target.value));
    }
  };

  const bulkUpdate = async () => {
    setBulkLoading(true);
    const result = await axios.put(`/v2/expenses`, {
      expenseIds: ids,
      status: "PAID",
    });
    if (result?.status === "success") {
      setBulkLoading(false);
      toast(formatMessage({ id: "reimbursements.paid" }), {
        position: "top-right",
        theme: "colored",
        type: "success",
      });
      setIds([])
      setRefetch(!refetch);
    } else {
      setBulkLoading(false);
      toast("error", {
        position: "top-right",
        theme: "colored",
        type: "error",
      });
    }
  };
  const generateRepport = async () => {
    if (ids.length > 0) {
      const result = await axios.get(`/v2/expenses/generate-report`, {
        params: { expenseIds: [...ids], userId: filter.userId },
      });

      if (result?.status === "success")
        toast(formatMessage({ id: "response.repport.generate" }), {
          position: "top-right",
          theme: "colored",
          type: "success",
        });
    } else {
      toast("You must select expenses", {
        position: "top-right",
        theme: "colored",
        type: "error",
      });
    }
  };

  return (
    <TabContainer>
      <DocumentsExpense
        title={visible?.title}
        visible={visible}
        setVisible={setVisible}
        files={visible?.attachment}
        type="attachement"
        approuveKyc={approveAttachement}
        approveLoading={approveLoading}
        rejectLoading={rejectLoading}
        hideButton={visible?.status !== "PENDING"}
      />
      <TableContainer
        sx={{
          // height: "68vh",
          // overflowX: "scroll",
          "&::-webkit-scrollbar": {
            width: 0,
          },
        }}
      >
        <Table stickyHeader aria-label="sticky table" size="small">
          {
            <>
              <TableHead>
                <TableRow
                  sx={{
                    "& .MuiTableCell-root": {
                      border: "0px",
                      textAlign: "center",
                      padding: "3px",
                    },
                  }}
                >
                  {filter.userId != "" ? (
                    <TableCell key={"notitle"}></TableCell>
                  ) : (
                    ""
                  )}
                  <TableCell>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bolder",
                        padding: ".5rem",
                        whiteSpace: "nowrap",
                        backgroundColor: "#D9EDFF",
                      }}
                    >
                      {formatMessage({ id: "advance.name" })}
                    </span>
                  </TableCell>
                  <TableCell sx={{ display: selectedUserState?.manages?.length < 1 ? "none" : "" }}>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bolder",
                        padding: ".5rem",
                        whiteSpace: "nowrap",
                        backgroundColor: "#D9EDFF",
                      }}
                    >
                      {formatMessage({ id: "filter.branch" })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bolder",
                        padding: ".5rem",
                        whiteSpace: "nowrap",
                        backgroundColor: "#D9EDFF",
                      }}
                    >
                      {formatMessage({ id: "advance.date" })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bolder",
                        padding: ".5rem",
                        whiteSpace: "nowrap",
                        backgroundColor: "#D9EDFF",
                      }}
                    >
                      {formatMessage({ id: "reimbursements.type" })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bolder",
                        padding: ".5rem",
                        whiteSpace: "nowrap",
                        backgroundColor: "#D9EDFF",
                      }}
                    >
                      {formatMessage({ id: "advance.status" })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bolder",
                        padding: ".5rem",
                        whiteSpace: "nowrap",
                        backgroundColor: "#D9EDFF",
                      }}
                    >
                      {formatMessage({ id: "advance.montant" })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bolder",
                        padding: ".5rem",
                        whiteSpace: "nowrap",
                        backgroundColor: "#D9EDFF",
                      }}
                    >
                      {formatMessage({ id: "reimbursements.invoices" })}
                    </span>
                  </TableCell>
                  <TableCell key={"empty"}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.loading ? (
                  <TableCell colSpan={8}>
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
                ) : expenses?.length < 1 ? (
                  <TableCell colSpan={8}>
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
                ) : (
                  expenses?.map((el, key) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={key}
                        sx={{
                          "& .MuiTableCell-root": {
                            border: "0px",
                            textAlign: "center",
                            padding: "3px",
                            color:
                              el?.status === "REJECTED"
                                ? "rgba(0, 0, 0, 0.40)"
                                : "",
                          },
                        }}
                        onClick={() => navigate(`/expense/detail/${el?._id}`)}
                      >
                        {filter?.userId !== "" ? (
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            {el.status === "APPROVED" ||
                              el.status === "PAID" ? (
                              <Checkbox
                                disabled={
                                  el.status !== "APPROVED" &&
                                  el.status !== "PAID"
                                }
                                checked={ids.includes(el._id)}
                                value={el?._id}
                                onChange={(e) => getApproveIds(e)}
                              />
                            ) : (
                              ""
                            )}
                          </TableCell>
                        ) : (
                          ""
                        )}
                        <TableCell>
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: ".45rem",
                              backgroundColor: "#F7F0F0",
                              whiteSpace: "nowrap",
                              textTransform: "capitalize",
                              borderLeft:
                                el.status === "REJECTED"
                                  ? "12px solid  #FA3E3E"
                                  : el.status === "PENDING"
                                    ? ""
                                    : "12px solid  #22F476",
                            }}
                          >
                            {el.user.firstName} {el.user.lastName}
                          </span>
                        </TableCell>

                        <TableCell style={{ display: selectedUserState?.manages?.length < 1 ? "none" : "" }}>
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: ".45rem",
                              backgroundColor: "#F7F0F0",
                              whiteSpace: "nowrap",
                              textTransform: "capitalize",
                            }}
                          >
                            {el.user.company?.name}
                          </span>
                        </TableCell>

                        <TableCell>
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: ".45rem",
                              backgroundColor: "#F7F0F0",
                              whiteSpace: "nowrap",
                              textTransform: "capitalize",
                            }}
                          >
                            {el.createdAt.split("T")[0]}
                          </span>
                        </TableCell>

                        <TableCell>
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: ".45rem",
                              backgroundColor: "#F7F0F0",
                              whiteSpace: "nowrap",
                              textTransform: "capitalize",
                            }}
                          >
                            {el.type}
                          </span>
                        </TableCell>

                        <TableCell>
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: ".45rem",
                              backgroundColor: "#F7F0F0",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {el.status}
                          </span>
                        </TableCell>
                        {/* Ammount */}
                        <TableCell>
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: ".45rem",
                              backgroundColor: "#F7F0F0",
                              whiteSpace: "nowrap",
                              textTransform: "capitalize",
                            }}
                          >
                            {`${el.amount} DH`}
                          </span>
                        </TableCell>

                        <TableCell sx={{ textAlign: "center" }}>
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              // padding: ".45rem",
                              // backgroundColor: "#F7F0F0",
                              whiteSpace: "nowrap",
                              textTransform: "capitalize",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                                width: "100%",
                                fontWeight: 600,
                              }}
                            >
                              <Button
                                border={"none"}
                                color={
                                  el?.attachment?.length < 1
                                    ? "rgba(133, 205, 250, 0.5)"
                                    : "#87CEFA"
                                }
                                textcolor={
                                  el?.attachment?.length < 1
                                    ? "rgba(0, 45, 107, 0.65)"
                                    : "var(--color-dark-blue"
                                }
                                onClick={(e) => {
                                  setVisible(el);
                                  e.stopPropagation();
                                }}
                              >
                                {formatMessage({
                                  id: "reimbursements.invoice",
                                })}
                              </Button>
                            </div>
                          </span>
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          <Tooltip
                            title={
                              el.status === "APPROVED"
                                ? formatMessage({ id: "reimbursements.mark" })
                                : formatMessage({ id: "reimbursements.marked" })
                            }
                          >
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                                width: "100%",
                                fontWeight: 600,
                              }}
                            >
                              {el.status === "PENDING" ||
                                el.status === "REJECTED" ? (
                                ""
                              ) : (
                                <IOSSwitch
                                  checked={el.status === "PAID"}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    el.status === "APPROVED"
                                      ? payExpense(el._id, "PAID", key)
                                      : "";
                                  }}
                                />
                              )}
                            </div>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </>
          }
        </Table>
      </TableContainer>

      {filter?.userId !== "" ? (
        <Grid container spacing={3} >
          <Hidden mdDown>
            <Grid item xs={0} sm={0} md={3} mt={2} />
          </Hidden>

          <Grid item xs={12} sm={6} md={3} mt={2}>
            <StatusButton
              color={"var(--color-dark-blue)"}
              text={formatMessage({ id: "reimbursements.generate" })}
              onClick={() => generateRepport()}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} mt={2}>
            <StatusButton
              color={"var(--color-white)"}
              bgColor={"#65C466"}
              loading={bulkLoading}
              disable={ids.length < 1 || expenses?.filter((ft) => ft?.status === "APPROVED")?.length < 1 && true}
              text={formatMessage({ id: "reimbursements.change" })}
              onClick={() => {
                ids.length < 1 || expenses?.filter((ft) => ft?.status === "APPROVED")?.length < 1 ? "" : bulkUpdate();
              }}
            />
          </Grid>

          <Grid item xs={0} sm={0} md={3} mt={2} />
        </Grid>
      ) : (
        ""
      )}

      {data?.data?.totalPages > 1 && (
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
            count={data?.data?.totalPages || 1}
            variant="outlined"
            shape="rounded"
            onChange={(e, value) => fetchData(value)}
            page={page}
          />
        </div>
      )}
    </TabContainer>
  );
};
const RightSide = ({
  filter,
  setFilter,
  branches,
  companyName,
  setCompanyName,
  isNormalEmployer,
  setPage
}) => {
  const { formatMessage } = useLocale();
  const [allUsers, setUsers] = useState([]);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [eNameLoading, setENameLoading] = useState(false);
  const clearFilter = () => {
    setFilter(INITIAL_FILTER);
    setCompanyName("");
    setUsers([]);
    setOpenDropDown(false)
    setPage(1)
    document.getElementsByClassName("MuiAutocomplete-clearIndicator")[0].click()
  };

  const searchUsers = async (text) => {
    setENameLoading(true)
    if (text.length >= 2) {
      setOpenDropDown(true);
      const data = await getEmployees(1, 100, `searchQuery=${text}`);
      if (data) {
        setENameLoading(false)
        setUsers(data?.docs);
      } else {
        setENameLoading(false)
        setUsers([])
      }
    } else {
      setOpenDropDown(false);
      const filteredUsers = allUsers.filter((user) => {
        const userName = `${user.firstName} ${user.lastName}`;
        return userName.toLowerCase().includes(text.toLowerCase());
      });
      setUsers([...filteredUsers]);
    }
  };

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
        onClick={clearFilter}
      >
        {formatMessage({ id: "employee.clearfilter" })}
      </Typography>

      <Autocomplete
        open={openDropDown}
        loading={eNameLoading}
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
        options={allUsers}
        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
        renderInput={(params) => (
          <TextField
            {...params}
            label={formatMessage({ id: "reimbursements.search" })}
          />
        )}
        onChange={(_, value, reason) => {
          if (reason === "clear") {
            setFilter(INITIAL_FILTER);
            setUsers([])
            return;
          } else {
            setFilter({
              ...filter,
              userId: value?._id,
            });
            setOpenDropDown(false)
          }
        }}
        onInputChange={(_, value, reason) => {
          if (reason === "clear") {
            setFilter(INITIAL_FILTER);
            setUsers([])
            return;
          } else {
            searchUsers(value);
          }
        }}
      />

      {branches != [] && !isNormalEmployer && (
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
            companyName?.length > 0
              ? companyName
              : formatMessage({ id: "filter.branch" })
          }
          InputLabelProps={{ shrink: false }}
          fullWidth
        >
          {branches?.map((branch, key) => (
            <MenuItem
              onClick={() => {
                setFilter({ ...filter, companyId: branch._id });
                setCompanyName(branch.name);
                setPage(1)
              }}
              key={key}
            >
              <span style={{ textTransform: "capitalize" }}>{branch.name}</span>
            </MenuItem>
          ))}
        </TextField>
      )}

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
            textTransform: "capitalize"
          },
          "& .MuiInputLabel-root": { textTransform: "capitalize !important" }
        }}
        size="small"
        label={filter?.type === "FOOD" ? formatMessage({ id: "reimbursements.food" }) :
          filter?.type === "ACCOMMODATION" ? formatMessage({ id: "reimbursements.accommodation" }) :
            filter?.type === "TRANSPORT" ? formatMessage({ id: "reimbursements.transportation" }) :
              filter?.type === "OTHER" ? formatMessage({ id: "reimbursements.other" }) :
                formatMessage({ id: "reimbursements.type" })}
        InputLabelProps={{ shrink: false }}
        fullWidth
      >
        <MenuItem
          onClick={() => { setFilter({ ...filter, type: "FOOD" }); setPage(1) }}
        >
          {formatMessage({ id: "reimbursements.food" })}
        </MenuItem>
        <MenuItem
          onClick={() => { setFilter({ ...filter, type: "ACCOMMODATION" }); setPage(1) }}
        >
          {formatMessage({ id: "reimbursements.accommodation" })}
        </MenuItem>
        <MenuItem
          onClick={() => { setFilter({ ...filter, type: "TRANSPORT" }); setPage(1) }}
        >
          {formatMessage({ id: "reimbursements.transportation" })}
        </MenuItem>
        <MenuItem
          onClick={() => { setFilter({ ...filter, type: "OTHER" }); setPage(1) }}
        >
          {formatMessage({ id: "reimbursements.other" })}
        </MenuItem>
      </TextField>
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
          filter?.status === ""
            ? formatMessage({ id: "filter.statusAdvance" })
            : filter?.status === "APPROVED"
              ? formatMessage({ id: "reimbursements.approve" })
              : filter?.status === "PENDING"
                ? formatMessage({ id: "advance.pending" })
                : filter?.status === "REJECTED"
                  ? formatMessage({ id: "reimbursements.reject" })
                  : formatMessage({ id: "reimbursements.paid" })
        }
        InputLabelProps={{ shrink: false }}
        fullWidth
      >
        <MenuItem
          onClick={() => { setFilter({ ...filter, status: "APPROVED" }); setPage(1) }}
          style={{ textTransform: "capitalize" }}
        >
          {formatMessage({ id: "reimbursements.filter.approve" })}
        </MenuItem>
        <MenuItem
          onClick={() => { setFilter({ ...filter, status: "PAID" }); setPage(1) }}
          style={{ textTransform: "capitalize" }}
        >
          {formatMessage({ id: "reimbursements.filter.paid" })}
        </MenuItem>
        <MenuItem
          onClick={() => { setFilter({ ...filter, status: "REJECTED" }); setPage(1) }}
          style={{ textTransform: "capitalize" }}
        >
          {formatMessage({ id: "reimbursements.filter.reject" })}
        </MenuItem>
        <MenuItem
          onClick={() => { setFilter({ ...filter, status: "PENDING" }); setPage(1) }}
          style={{ textTransform: "capitalize" }}
        >
          {formatMessage({ id: "advance.pending" })}
        </MenuItem>
      </TextField>

      <div
        style={{
          background: "var(--color-blue)",
          height: "100px",
          borderRadius: 20,
          padding: "13px"
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
        {/* <DateRangePicker
          endDate={filter.endDate}
          startDate={filter.startDate}
          setEndDate={(value) => setFilter({ ...filter, endDate: value })}
          setStartDate={(value) => setFilter({ ...filter, startDate: value })}
        /> */}
        <div style={{ display: "flex", gap: 8 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              maxDate={filter?.endDate}
              label={formatMessage({ id: "timetracker.startdate" })}
              onChange={(value) => { setFilter({ ...filter, startDate: value.startOf('day') }); setPage(1) }}
              value={filter?.startDate}
              slotProps={{
                textField: { size: "small", error: false, fullWidth: "true" },
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
              onChange={(value) => { setFilter({ ...filter, endDate: value.endOf('day') }); setPage(1) }}
              value={filter?.endDate}
              slotProps={{
                textField: { size: "small", error: false, fullWidth: "true" },
              }}
              disableFuture={true}
              views={["year", "month", "day"]}
              format="DD/MM/YYYY"
            />
          </LocalizationProvider>
        </div>
      </div>
    </ContFilter>
  );
};
const Reimbursements = () => {
  const [filter, setFilter] = useState(INITIAL_FILTER);
  const selectedUserState = useSelector((state) => state.userInfos);
  const [branches, setBranches] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [filterPage, setPage] = useState(1);
  const [expenses, setExpenses] = useState([]);
  const [refetch, setRefetch] = useState(true);
  const data = getExpenses(filterPage, 10, filter, refetch);

  const isNormalEmployer =
    Array.isArray(selectedUserState?.manages) &&
    selectedUserState.manages.length === 0;

  useEffect(() => {
    if (selectedUserState?.manages) {
      setBranches(selectedUserState.manages);
    }
  }, [selectedUserState]);
  useEffect(() => {
    setExpenses(data?.data?.docs);
  }, [data]);
  return (
    <SideContainer
      LeftSideComponent={
        <LeftSide
          page={filterPage}
          data={data}
          filter={filter}
          expenses={expenses}
          setExpenses={setExpenses}
          fetchData={setPage}
          setRefetch={setRefetch}
          refetch={refetch}
          selectedUserState={selectedUserState}
        />
      }
      RightSideComponent={
        <RightSide
          filter={filter}
          setFilter={setFilter}
          branches={branches}
          companyName={companyName}
          setCompanyName={setCompanyName}
          isNormalEmployer={isNormalEmployer}
          setPage={setPage}
        />
      }
    />
  );
};

export default Reimbursements;
