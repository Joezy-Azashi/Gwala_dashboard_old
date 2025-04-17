import React, { useState, useEffect } from "react";
import { getCompanies, getTransactions } from "../../api";
import { Field, ContFilter } from "../../components/employee/style";
import styled from "styled-components";
import { Confirm } from "../../components/UI";
import axios from "../../api/request";
import { useLocale } from "../../locales";
import SideContainer from "../../containers/SideContainer";
import { useSelector } from "react-redux";
import { sortArrayAlphabetically } from "../../utils";
import dayjs from 'dayjs';
import Pagination from "@mui/material/Pagination";
import {
  TableContainer,
  Typography,
  Grid,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  TextField,
  MenuItem,
  Dialog,
  DialogContent,
  Box,
  FormLabel,
  CircularProgress,
  Tooltip,
  Autocomplete,
} from "@mui/material";
import PageSpinner from "../../components/pagespinner/PageSpinner";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import ManualAdvance from "../../components/ManualAdvance";
import { FieldB } from "../employee/style";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const TabContainer = styled.div`
  tbody > tr {
    :hover * {
      /* background-color: #d9edff; */
      // cursor: pointer;
    }
  }
`;

const LeftSide = ({
  data,
  page,
  fetchData,
  loading,
  refetchData,
  setRefetch,
  role,
  selectedUserState
}) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState();
  const { formatMessage } = useLocale();

  const approveAdvance = async (
    type,
    transactionId = visible._id,
    userId = visible.userId,
    isVerified = visible.isVerified
  ) => {
    try {
      if (!isVerified)
        toast(formatMessage({ id: "employee.not.verified" }), {
          position: "top-right",
          theme: "colored",
          type: "info",
        });
      const result = await axios.put(
        `/advances/${type}/${transactionId}?userId=${userId}`
      );

      let message =
        type == "approve"
          ? "response.advance.approve"
          : "response.advance.reject";
      if (result?.status === "success")
        if (isVerified)
          toast(formatMessage({ id: message }), {
            position: "top-right",
            theme: "colored",
            type: "success",
          });
      setVisible();
      setRefetch(!refetchData);
    } catch (e) { }
  };

  return (
    <TabContainer>
      <TableContainer
        sx={{
          // height: "70vh",
          overflowX: "scroll",
          "&::-webkit-scrollbar": {
            width: 0,
          },
        }}
      >
        <Table stickyHeader aria-label="sticky table" size="small">
          <Confirm
            visible={visible}
            cancelText={formatMessage({ id: "advance.confirm.cancel" })}
            confirmText={formatMessage({ id: "advance.confirm.approve" })}
            setHidden={() => setVisible()}
            onCancel={() => setVisible()}
            onSubmit={() => approveAdvance("approve")}
          >
            {formatMessage({ id: "advance.confirm.text" })}
          </Confirm>
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
                  <TableCell style={{ width: "16%" }}>
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
                  <TableCell style={{ width: "16%", display: selectedUserState?.manages?.length < 1 ? "none" : "" }}>
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
                      {role === "Admin" ? formatMessage({ id: "employee.company" }) : formatMessage({ id: "employer.branch" })}
                    </span>
                  </TableCell>
                  <TableCell style={{ width: "16%" }}>
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
                  <TableCell style={{ width: "16%" }}>
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
                  <TableCell style={{ width: "16%" }}>
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
                  <TableCell style={{ width: "10%" }}>
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
                      {formatMessage({ id: "advance.actions" })}
                    </span>
                  </TableCell>
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
                ) : data?.docs?.length < 1 ? (
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
                  data?.docs?.map((el, key) => {
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
                          },
                        }}
                      // onClick={() => navigate(`/employee/${el._id}`)}
                      >
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
                            {el.user.firstName} {el.user.lastName}
                          </span>
                        </TableCell>

                        <TableCell sx={{ display: selectedUserState?.manages?.length < 1 ? "none" : "" }}>
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
                            {el.user.company.name}
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
                            {el.amount}
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
                            {
                              new Date(el.requestedDate)
                                .toISOString()
                                .split("T")[0]
                            }
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
                            {el?.status === "SENT"
                              ? formatMessage({ id: "advance.sent" })
                              : el?.status === "PENDING"
                                ? formatMessage({ id: "advance.pending" })
                                : formatMessage({ id: "advance.refuse" })}
                          </span>
                        </TableCell>

                        <TableCell sx={{ textAlign: "center" }}>
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: ".35rem",
                              backgroundColor: "#F7F0F0",
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
                              }}
                            >
                              <Tooltip title={formatMessage({ id: "advance.profil" })}>
                                <Box
                                  id="profile"
                                  onClick={() => {
                                    role === "Admin"
                                      ? navigate(`/employee-edit/${el.user._id}`)
                                      : navigate(`/employee/${el.user._id}`, {
                                        state: { name: el?.user?.firstName },
                                      });
                                  }}
                                  sx={{
                                    backgroundColor: "var(--color-cyan)",
                                    padding: "1px 6px",
                                    borderRadius: "15px",
                                    display: 'flex',
                                    alignItems: "center",
                                    cursor: "pointer",
                                  }}>
                                  <img src="/icons/profile.svg" width={22} />
                                </Box>
                              </Tooltip>

                              <Tooltip title={formatMessage({ id: "advance.send" })}>
                                <Box
                                  id="send"
                                  onClick={() => {
                                    el?.isActionClosed
                                      ? ""
                                      : setVisible({
                                        _id: el._id,
                                        userId: el.user._id,
                                        isVerified: !el?.needsKycCheck,
                                      });
                                  }}
                                  sx={{
                                    backgroundColor: "var(--color-cyan)",
                                    padding: "5px 10px",
                                    borderRadius: "15px",
                                    display: 'flex',
                                    alignItems: "center",
                                    cursor: el?.isActionClosed && "default",
                                    '&:hover': { backgroundColor: el?.isActionClosed ? "" : "green" },
                                    opacity: el?.isActionClosed ? "0.5" : ""
                                  }}>
                                  <img src="/icons/transaction/confirm.svg" width={15} />
                                </Box>
                              </Tooltip>

                              <Tooltip title={formatMessage({ id: "advance.refusetip" })}>
                                <Box
                                  id="refuse"
                                  onClick={() => {
                                    el?.isActionClosed
                                      ? ""
                                      : approveAdvance(
                                        "refuse",
                                        el._id,
                                        el.user._id,
                                        !el?.needsKycCheck
                                      );
                                  }}
                                  sx={{
                                    backgroundColor: "var(--color-cyan)",
                                    padding: "5px 10px",
                                    borderRadius: "15px",
                                    display: 'flex',
                                    alignItems: "center",
                                    cursor: el?.isActionClosed && "default",
                                    '&:hover': { backgroundColor: el?.isActionClosed ? "" : "var(--color-danger)" },
                                    opacity: el?.isActionClosed ? "0.5" : ""
                                  }}>
                                  <img src="/icons/transaction/cancel.svg" width={15} />
                                </Box>
                              </Tooltip>
                            </div>
                          </span>
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
      {data?.totalPages > 1 && (
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
            count={data?.totalPages || 1}
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
  transactions,
  setTransaction,
  filter,
  setFilter,
  companies,
  branches,
  companyName,
  setCompanyName,
  INITIAL_FILTER,
  role,
  isNormalEmployer,
  location,
  selectedUserState
}) => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate()
  const [sortOrder, setOrder] = useState(1);
  const [visibleModal, setVisibleModal] = useState(false);
  const [openExport, setOpenExport] = useState(false)
  const [company, setCompany] = useState("")
  const [exportCompanyName, setExportCompanyName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [loading, setLoading] = useState(false)

  const triAlpha = () => {
    const newArray = sortArrayAlphabetically({
      arr: transactions?.docs,
      order: sortOrder,
      key: { user: "firstName" },
    });
    setTransaction({ ...transactions, docs: [...newArray] });
    setOrder(-sortOrder);
  };

  const clearFilter = () => {
    setOrder(1);
    setFilter((filter.amountMin = "100"), (filter.amountMax = ""));
    setFilter(INITIAL_FILTER);
    setCompanyName("");
    navigate(location.pathname, {});
    document?.getElementsByClassName("MuiAutocomplete-clearIndicator")[0]?.click()
  };

  const onExportAdvances = async () => {
    if (!startDate || !endDate || !company) {
      toast(formatMessage({ id: "profile.required" }), {
        position: "top-right",
        theme: "colored",
        type: "error",
      });
    } else {
      setLoading(true)
      const result = await axios.get(`v1/advances/export/excel/monthlyReport?companyId=${company}&startDate=${startDate.startOf('day').toISOString()}&endDate=${endDate.endOf('day').toISOString()}`, { responseType: "blob" });

      if (result?.response?.status === 404) {
        setLoading(false)
        toast(formatMessage({ id: "advance.notransactions" }), {
          position: "top-right",
          theme: "colored",
          type: "error",
        });
      } else {
        setLoading(false)
        const blob = new Blob([result], { type: result.type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Downloaded Advance";
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setOpenExport(false)
      }
    }
  }

  return (
    <ContFilter>
      <ManualAdvance
        open={visibleModal}
        onClose={() => setVisibleModal(false)}
      />
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
      {companies.data != undefined && role === "Admin" && (
        <Autocomplete
            id="merchant_name"
          sx={{
            "& .MuiOutlinedInput-root": {
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
          InputLabelProps={{ shrink: false }}
          fullWidth
          options={companies?.data}
          getOptionLabel={(option) => `${option?.name}`}
          renderInput={(params) => (
            <TextField
              {...params}
              label={formatMessage({ id: "filter.company" })}
            />
          )}
          onChange={(_, value, reason) => {
            if (reason === "clear") {
              setFilter({ ...filter, company: "" });
              setCompanyName("")
              return;
            } else {
              setFilter({ ...filter, company: value._id });
              setCompanyName(value.name)
            }
          }}
          />
      )}

      {
        branches != [] && !isNormalEmployer && role !== "Admin" && (
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
                  setFilter({ ...filter, company: branch._id });
                  setCompanyName(branch.name);
                }}
                key={key}
              >
                <span style={{ textTransform: "capitalize" }}>{branch.name}</span>
              </MenuItem>
            ))}
          </TextField>
        )
      }

      <Field onClick={triAlpha}>
        <span>{formatMessage({ id: "filter.sortAlpha" })}</span>
        <img src="/icons/Employee/filter.svg" />
      </Field>

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
            <span>{formatMessage({ id: "advance.montant" })} (DH)</span>
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
                value={filter.amountMin || ""}
                onChange={(e) =>
                  setFilter({ ...filter, amountMin: e.target.value })
                }
                label={formatMessage({ id: "advance.min" })}
                fullWidth
                margin="dense"
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
                value={filter.amountMax || ""}
                onChange={(e) =>
                  setFilter({ ...filter, amountMax: e.target.value })
                }
                label={formatMessage({ id: "advance.max" })}
                fullWidth
                margin="dense"
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
                maxDate={filter?.endDate}
                label={formatMessage({ id: "timetracker.startdate" })}
                onChange={(value) => setFilter({ ...filter, startDate: value.startOf('day') })}
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
                onChange={(value) => setFilter({ ...filter, endDate: value.endOf('day') })}
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
      </div>

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
          filter?.statu === ""
            ? formatMessage({ id: "filter.status" })
            : filter?.statu === "SENT"
              ? formatMessage({ id: "advance.sent" })
              : filter?.statu === "PENDING"
                ? formatMessage({ id: "advance.pending" })
                : formatMessage({ id: "advance.refuse" })
        }
        InputLabelProps={{ shrink: false }}
        fullWidth
      >
        <MenuItem
          onClick={() => setFilter({ ...filter, statu: "SENT" })}
          style={{ textTransform: "capitalize" }}
        >
          {formatMessage({ id: "advance.sent" })}
        </MenuItem>
        <MenuItem
          onClick={() => setFilter({ ...filter, statu: "PENDING" })}
          style={{ textTransform: "capitalize" }}
        >
          {formatMessage({ id: "advance.pending" })}
        </MenuItem>
        <MenuItem
          onClick={() => setFilter({ ...filter, statu: "REFUSED" })}
          style={{ textTransform: "capitalize" }}
        >
          {formatMessage({ id: "advance.refuse" })}
        </MenuItem>
      </TextField>

      {
        role === "Admin" || selectedUserState?.manages?.length > 0 ?
          <>
            <hr />
            <Box
              style={{ textDecoration: "none", color: "var(--color-dark-blue)", marginBottom: "20px" }}
              onClick={() => setOpenExport(true)}
            >
              <FieldB>{formatMessage({ id: "filter.exportadvance" })}</FieldB>
            </Box>
          </> : ""
      }

      <Dialog
        open={openExport}
        onClose={() => { setOpenExport(false); setStartDate(""); setEndDate(""); setCompany(""); setExportCompanyName("") }}
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
            borderRadius: "10px",
            maxHeight: "100vh",
          },
        }}
        maxWidth={"xs"}
      >
        <DialogContent>
          <Typography variant="h6" sx={{ marginBottom: "18px" }}>{formatMessage({ id: "filter.exportadvance" })}</Typography>

          <FormLabel>{formatMessage({ id: "advance.companyname" })}</FormLabel>
          <TextField
            select
            sx={{ marginBottom: "15px", color: 'red !important' }}
            variant="outlined"
            value={company}
            size="small"
            label={
              exportCompanyName?.length > 0
                ? exportCompanyName
                : formatMessage({ id: "filter.company" })
            }
            InputLabelProps={{ shrink: false }}
            fullWidth
          >
            {companies.data?.map((company, key) => (
              <MenuItem
                onClick={() => {
                  setExportCompanyName(company?.name);
                  setCompany(company?._id)
                }}
                key={key}
              >
                <span style={{ textTransform: "capitalize" }}>
                  {company.name}
                </span>
              </MenuItem>
            ))}
          </TextField>

          {/* Start date */}
          <FormLabel>{formatMessage({ id: "timetracker.startdate" })}</FormLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              onChange={(value) => setStartDate(value)}
              sx={{ marginBottom: "15px" }}
              value={startDate}
              slotProps={{
                textField: { size: "small", error: false, fullWidth: true },
              }}
              disableFuture={true}
              views={["year", "month", "day"]}
              format="DD/MM/YYYY"
            />
          </LocalizationProvider>

          {/* End date */}
          <FormLabel>{formatMessage({ id: "timetracker.enddate" })}</FormLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ marginBottom: "20px" }}
              onChange={(value) => setEndDate(value)}
              value={endDate}
              slotProps={{
                textField: { size: "small", error: false, fullWidth: true },
              }}
              disableFuture={true}
              views={["year", "month", "day"]}
              format="DD/MM/YYYY"
            />
          </LocalizationProvider>

          <Box
            style={{ textDecoration: "none", color: "var(--color-dark-blue)", marginBottom: "20px" }}
            onClick={() => onExportAdvances()}
          >
            <FieldB>{loading ?
              <CircularProgress
                size={20}
                sx={{
                  color: "var(--color-dark-blue) !important",
                }}
              />
              : "Export"}</FieldB>
          </Box>
          <Box>

          </Box>
        </DialogContent>
      </Dialog>
    </ContFilter >
  );
};
const Transaction = () => {
  const location = useLocation();

  const INITIAL_FILTER = {
    statu: "",
    company: location?.state?.formData ? location?.state?.formData?._id : "",
    amountMax: "",
    amountMin: "100",
    startDate: "",
    endDate: "",
  };

  const [filter, setFilter] = useState(INITIAL_FILTER);
  const [filterPage, setPage] = useState(1);
  const [refetchData, setRefetch] = useState(true);
  const [transactions, setTransaction] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState(
    location?.state?.formData ? location?.state?.formData?.name : ""
  );

  // const role = useSelector((state) => state.userInfos.role);
  const role = localStorage.getItem("role");
  const selectedUserState = useSelector((state) => state.userInfos);

  const isNormalEmployer =
    Array.isArray(selectedUserState?.manages) &&
    selectedUserState.manages.length === 0;
  const companies = getCompanies(1, 10, role === "Admin");

  useEffect(() => {
    if (selectedUserState?.manages) {
      setBranches(selectedUserState.manages);
    }
  }, [selectedUserState]);

  const fetchData = async () => {
    if (filterPage > 0) {
      setLoading(true);
      const { statu, company, amountMax, amountMin, startDate, endDate } =
        filter;

      const filters = {
        ...((statu && { "status[]": statu }) || {}),
        ...((amountMin && { amountMax, amountMin }) || {}),
        ...((amountMax && { amountMax, amountMin }) || {}),
        ...((startDate && { startDate }) || { startDate: dayjs('2023-01-01') }),
        ...((endDate && { endDate }) || {}),
        ...((company && { companyId: company }) || {}),
      };
      const queryParams = new URLSearchParams({ ...filters });
      const data = await getTransactions(filterPage, 10, queryParams, location?.state?.id);
      setTransaction(data);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [filterPage, refetchData, location?.state?.id, filter]);

  return (
    <SideContainer
      LeftSideComponent={
        <LeftSide
          data={transactions}
          fetchData={setPage}
          loading={loading}
          refetchData={refetchData}
          setRefetch={setRefetch}
          page={filterPage}
          role={role}
          selectedUserState={selectedUserState}
        />
      }
      RightSideComponent={
        <RightSide
          transactions={transactions}
          setTransaction={setTransaction}
          filter={filter}
          setFilter={setFilter}
          companies={companies}
          refetchData={refetchData}
          setRefetch={setRefetch}
          branches={branches}
          companyName={companyName}
          setCompanyName={setCompanyName}
          INITIAL_FILTER={INITIAL_FILTER}
          role={role}
          isNormalEmployer={isNormalEmployer}
          location={location}
          selectedUserState={selectedUserState}
        />
      }
    />
  );
};
export default Transaction;
