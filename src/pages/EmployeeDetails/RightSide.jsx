import React from "react";
import { useTimeTrackerContext } from "../../store/context/TimeTrackerContext";
import { useLocale } from "../../locales";
import { RightCnt } from "../editEmployee/style";
import { Avatar, Box, Dialog, MenuItem } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { getExpensesByUserId, getTransactionByUserId } from "../../api";
import { convertDate, differenceTwoDate } from "../../utils";
import { ContFilter } from "../../components/employee/style";
import {
  DateRangePicker,
  DisplayDocuments,
  Redirect,
  TextField,
} from "../../components/UI";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import moment from "moment";
import dayjs from "dayjs";
const INITIAL_FILTER = {
  status: "",
  endDate: "",
  startDate: "",
};
const AccountInfoSide = () => {
  const { employee } = useTimeTrackerContext();
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const { id } = useParams();
  const { transactions, loading, error } = getTransactionByUserId(id, 1, 5);
  const { expenses } = getExpensesByUserId(id, 1, 5);

  const formData = {
    _id: employee?.data?.company?._id,
  };

  return (
    <RightCnt>
      <div style={{ paddingTop: "2rem" }}>
        <Avatar
          sx={{
            width: 140,
            height: 140,
            textTransform: "capitalize",
            fontSize: "5rem",
          }}
        >
          {employee?.data?.firstName && employee?.data?.firstName[0]}
          {employee?.data?.lastName && employee?.data?.lastName[0]}
        </Avatar>
      </div>
      <div className="transactions">
        <span
          onClick={() => navigate("/transaction", { state: { id } })}
          style={{ cursor: "pointer" }}
        >
          <Redirect text={formatMessage({ id: "employee.lastTrans" })} />
        </span>
        <div className="lastTransations">
          {transactions?.data?.docs < 1 ||
            transactions?.data?.docs === undefined ? (
            <p>{formatMessage({ id: "advance.norecords" })}</p>
          ) : (
            transactions?.data?.docs?.map((el, key) => (
              <div key={key}>
                <span>{convertDate(el.requestedDate)}</span>
                <span>{el.requestedAmount} DH</span>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="transactions">
        <span
          onClick={() => navigate("/reimbursements")}
          style={{ cursor: "pointer" }}
        >
          <Redirect text={formatMessage({ id: "employee.lastExpene" })} />
        </span>
        <div className="lastTransations">
          {expenses?.data?.docs < 1 || expenses?.data?.docs === undefined ? (
            <p>{formatMessage({ id: "advance.norecords" })}</p>
          ) : (
            expenses?.data?.docs?.map((el, key) => (
              <div key={key}>
                <span>{convertDate(el.createdAt)}</span>
                <span>{el.amount} DH</span>
              </div>
            ))
          )}
        </div>
      </div>
      {employee?.data?.createdAt && (
        <div className="infos">
          <span
            style={{
              fontWeight: "bold",
              textTransform: "capitalize",
              marginBottom: "5px",
            }}
          >
            {employee?.data?.company?.name}
          </span>
          <span>
            {formatMessage({ id: "employee.addDate" })}
            {convertDate(employee?.data?.createdAt)}
          </span>
          <span>
            {formatMessage({ id: "employee.updateDate" })}
            {convertDate(employee?.data?.updatedAt)}
          </span>
        </div>
      )}
    </RightCnt>
  );
};
const RepportSide = ({ setReportTabChange, setSelectDay }) => {
  const { formatMessage } = useLocale();

  const { tabIndex, setTabIndex } = useTimeTrackerContext(0);
  return (
    <ContFilter>
      <TextField
        select
        sx={{
          "& .MuiOutlinedInput-root": {
            // background: "#fff",
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
          "&.MuiFormControl-root": { backgroundColor: "transparent" }
        }}
        size="small"
        label={
          tabIndex === 1
            ? formatMessage({ id: "timetracker.weekly" })
            : tabIndex === 2
              ? formatMessage({ id: "timetracker.monthly" })
              : tabIndex === 3
                ? formatMessage({ id: "timetracker.yearly" })
                : formatMessage({ id: "timetracker.daily" })
        }
        InputLabelProps={{ shrink: false }}
        fullWidth
      >
        <MenuItem
          onClick={() => {
            setReportTabChange(0);
            setTabIndex(0);
          }}
          style={{ textTransform: "capitalize" }}
        >
          {formatMessage({ id: "timetracker.daily" })}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setReportTabChange(1);
            setTabIndex(1);
          }}
          style={{ textTransform: "capitalize" }}
        >
          {formatMessage({ id: "timetracker.weekly" })}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setReportTabChange(2);
            setTabIndex(2);
          }}
          style={{ textTransform: "capitalize" }}
        >
          {formatMessage({ id: "timetracker.monthly" })}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setReportTabChange(3);
            setTabIndex(3);
          }}
          style={{ textTransform: "capitalize" }}
        >
          {formatMessage({ id: "timetracker.yearly" })}
        </MenuItem>
      </TextField>

      {tabIndex === 1 || tabIndex === 2 || tabIndex === 3 ? null : (
        <div style={{ marginTop: "12px" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={formatMessage({ id: "timetracker.selectdate" })}
              onChange={(value) => setSelectDay(value.toISOString())}
              // value={dayjs()}
              slotProps={{ textField: { size: "small", error: false } }}
              sx={{ width: "100%" }}
              disableFuture={true}
            />
          </LocalizationProvider>
        </div>
      )}
    </ContFilter>
  );
};
const RequestSide = () => {
  const { formatMessage } = useLocale();
  const [open, setOpen] = useState(false);
  const { filter, setFilter, repport, setRepport, employee, sort, setSort } =
    useTimeTrackerContext();

  return (
    <ContFilter>
      <DisplayDocuments
        files={repport?.attachment}
        visible={open}
        setVisible={setOpen}
        hideButton={true}
      />
      {repport != undefined ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
          }}
        >
          <div
            style={{
              fontSize: "22px",
              fontWeight: "normal",
              alignSelf: "flex-end",
              cursor: "pointer",
            }}
            onClick={() => setRepport()}
          >
            X
          </div>
          <Avatar
            sx={{
              width: 140,
              height: 140,
              textTransform: "capitalize",
              fontSize: "5rem",
            }}
          >
            {employee?.data?.firstName && employee?.data?.firstName[0]}
            {employee?.data?.lastName && employee?.data?.lastName[0]}
          </Avatar>
          <TextField
            value={employee?.data?.firstName + " " + employee?.data?.lastName}
            label={formatMessage({ id: "employee.name" })}
            fullWidth
            margin="dense"
            InputProps={{
              readOnly: true,
            }}
            size="small"
          />
          <TextField
            value={employee?.data?.phone.number}
            label={formatMessage({ id: "employee.phone" })}
            fullWidth
            margin="dense"
            InputProps={{
              readOnly: true,
            }}
            size="small"
          />
          <TextField
            value={employee?.data?.email}
            label={formatMessage({ id: "employee.mail" })}
            fullWidth
            margin="dense"
            InputProps={{
              readOnly: true,
            }}
            size="small"
          />
          <TextField
            value={employee?.data?.company.name}
            label={formatMessage({ id: "employee.company" })}
            fullWidth
            margin="dense"
            InputProps={{
              readOnly: true,
            }}
            size="small"
          />
          <TextField
            value={repport?.type}
            label={formatMessage({ id: "reimbursements.type" })}
            fullWidth
            margin="dense"
            InputProps={{
              readOnly: true,
            }}
            size="small"
          />
          {repport?.type === "ABSENCE" ? (
            <TextField
              value={repport?.description}
              label={formatMessage({ id: "expense.description" })}
              fullWidth
              margin="dense"
              InputProps={{
                readOnly: true,
              }}
              multiline
            />
          ) : null}
          <TextField
            value={`${differenceTwoDate(
              repport.startDate,
              repport.endDate
            )} days`}
            label={"Requested Days"}
            fullWidth
            margin="dense"
            InputProps={{
              readOnly: true,
            }}
            size="small"
          />
          <TextField
            value={moment(repport.startDate).format("DD/MM/YYYY")}
            label={formatMessage({ id: "timetracker.startdate" })}
            fullWidth
            margin="dense"
            InputProps={{
              readOnly: true,
            }}
            size="small"
          />
          <TextField
            value={moment(repport.endDate).format("DD/MM/YYYY")}
            label={formatMessage({ id: "timetracker.enddate" })}
            fullWidth
            margin="dense"
            InputProps={{
              readOnly: true,
            }}
            size="small"
          />
          {/* <TextField
            value={`${differenceTwoDate(
              repport.startDate,
              repport.endDate
            )} days | ${moment(repport.startDate).format(
              "DD/MM/YYYY"
            )} - ${moment(repport.endDate).format("DD/MM/YYYY")} `}
            label={formatMessage({ id: "timetracker.vacation.day.requested" })}
            fullWidth
            margin="dense"
            InputProps={{
              readOnly: true,
            }}
          /> */}
          {repport?.attachment?.length > 0 && (
            <div
              style={{
                backgroundColor: "var(--color-blue)",
                padding: 10,
                borderRadius: "15px",
                display: "flex",
                gap: 10,
                justifyContent: "center",
                marginTop: 10,
                cursor: "pointer",
              }}
              onClick={() => setOpen(true)}
            >
              <span>Attachement</span>
              <img src="/icons/docs.svg" />
            </div>
          )}
        </div>
      ) : (
        <>
          <div
            style={{ cursor: "pointer", textAlign: "center" }}
            onClick={() => setFilter(INITIAL_FILTER)}
          >
            {formatMessage({ id: "employee.clearfilter" })}
          </div>
          {/* <div
            style={{
              background: "var(--color-blue)",
              height: "100px",
              borderRadius: 20,
              padding: "13px",
              // display: "flex",
              // justifyContent: "center",
              // alignItems: "center",
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
              <DateRangePicker
                endDate={filter.endDate}
                startDate={filter.startDate}
                setEndDate={(value) => setFilter({ ...filter, endDate: value })}
                setStartDate={(value) =>
                  setFilter({ ...filter, startDate: value })
                }
              />
            </div>
          </div> */}
          <div
            style={{
              background: "var(--color-blue)",
              height: "100px",
              borderRadius: 20,
              padding: "13px"
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
                    onChange={(value) => setFilter({ ...filter, endDate: value.endOf('day') })}
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
          </div>

          <div
            style={{
              background: "var(--color-blue)",
              borderRadius: 20,
              padding: "13px",
              cursor: "pointer"
            }}
            onClick={() => setSort(-sort)}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <span>{formatMessage({ id: "edoc.sortbydate" })}</span>
              <img src="/icons/Employee/filter.svg" />
            </Box>
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
              "&.MuiFormControl-root": { backgroundColor: "transparent" }
            }}
            size="small"
            label={
              filter?.status === "" || !filter?.status
                ? formatMessage({ id: "advance.status" })
                : filter?.status === "APPROVED"
                  ? formatMessage({ id: "filter.accepted" })
                  : filter?.status === "REJECTED"
                    ? formatMessage({ id: "filter.rejected" })
                    : filter?.status === "PENDING"
                      ? formatMessage({ id: "advance.pending" })
                      : ""
            }
            InputLabelProps={{ shrink: false }}
            fullWidth
          >
            <MenuItem
              onClick={() => setFilter({ ...filter, status: "APPROVED" })}
              style={{ textTransform: "capitalize" }}
            >
              {formatMessage({ id: "phone.request.accept" })}
            </MenuItem>
            <MenuItem
              onClick={() => setFilter({ ...filter, status: "PENDING" })}
              style={{ textTransform: "capitalize" }}
            >
              {formatMessage({ id: "advance.pending" })}
            </MenuItem>
            <MenuItem
              onClick={() => setFilter({ ...filter, status: "REJECTED" })}
              style={{ textTransform: "capitalize" }}
            >
              {formatMessage({ id: "phone.request.reject" })}
            </MenuItem>
            <MenuItem
              onClick={() => setFilter({ ...filter, status: "EXPIRED" })}
              style={{ textTransform: "capitalize" }}
            >
              {formatMessage({ id: "phone.request.expired" })}
            </MenuItem>
          </TextField>
        </>
      )}
    </ContFilter>
  );
};

const RightSide = ({ setReportTabChange, setSelectDay }) => {
  const { step } = useTimeTrackerContext();
  return (
    <div style={{ height: "100%" }}>
      {step === 0 ? (
        <AccountInfoSide />
      ) : step === 1 ? (
        <>
          {/* <RepportSide
            etReportTabChange={setReportTabChange}
            setSelectDay={setSelectDay}
          /> */}
          <RequestSide />
        </>
      ) : (
        <RequestSide />
      )}
    </div>
  );
};

export default RightSide;
