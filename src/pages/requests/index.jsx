import React, { useState, useEffect } from "react";
import { getCompanies } from "../../api";
import { ContFilter } from "../../components/employee/style";
import { useLocale } from "../../locales";
import SideContainer from "../../containers/SideContainer";
import { useSelector } from "react-redux";
import {
  Typography,
  TextField,
  MenuItem,
  Box,
  Autocomplete,
} from "@mui/material";
import Phones from "./Phones";
import Vacations from "./Vacations";
import Absences from "./Absences";
import Stepper from "../../components/TimeTracker/Stepper";
import ModalRequest from "../../components/ModalRequest";
import Edocuments from "./Edocuments";
import dayjs from 'dayjs';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const INITIAL_FILTER = {
  status: "",
  company: "",
  startDate: "",
  endDate: "",
};
const LeftSide = ({ filter, setFilter, companyIds, sort }) => {
  const { formatMessage } = useLocale();
  const [data, setData] = useState();
  const steps = [
    formatMessage({ id: "timetracker.steper.phone" }),
    // formatMessage({ id: "timetracker.steper.vacation" }),
    // formatMessage({ id: "timetracker.steper.absence" }),
    formatMessage({ id: "timetracker.steper.edocs" }),
  ];
  return (
    <>
      <ModalRequest
        open={data}
        data={data}
        type={data?.type}
        onClose={() => setData()}
      />
      <Stepper steps={steps}>
        <Phones filter={filter} setFilter={setFilter} setData={setData} companyIds={companyIds} sort={sort} />
        {/* <Vacations filter={filter} setFilter={setFilter} setData={setData} companyIds={companyIds} sort={sort} /> */}
        {/* <Absences filter={filter} setFilter={setFilter} setData={setData} companyIds={companyIds} sort={sort} /> */}
        <Edocuments filter={filter} setFilter={setFilter} setData={setData} companyIds={companyIds} sort={sort} />
      </Stepper>
    </>
  );
};
const RightSide = ({
  filter,
  setFilter,
  companies,
  role,
  isNormalEmployer,
  branches,
  setCompanyIds,
  companyName,
  setCompanyName,
  comp,
  sort,
  setSort
}) => {
  const { formatMessage } = useLocale();
  const [allUsers, setUsers] = useState([]);

  const clearFilter = () => {
    setFilter(INITIAL_FILTER);
    setCompanyName(comp[0]?.name);
    setCompanyIds(comp[0]?._id)
    setUsers([]);
    document?.getElementsByClassName("MuiAutocomplete-clearIndicator")[0]?.click()
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
      {companies.data != undefined && role === "Admin" && (
        <Autocomplete
        id="companies"
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
        options={companies?.data?.data?.docs}
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

      {branches != [] && !isNormalEmployer && role !== "Admin" && (
        <Autocomplete
        id="companies"
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
        options={branches}
        getOptionLabel={(option) => `${option?.name}`}
        renderInput={(params) => (
          <TextField
            {...params}
            label={formatMessage({ id: "filter.branch" })}
          />
        )}
        onChange={(_, value, reason) => {
          if (reason === "clear") {
            setFilter({ ...filter, company: "" });
            setCompanyName("")
            return;
          } else {
            setFilter({ ...filter, company: value._id });
            setCompanyName(value?.name);
          }
        }}
      />
      )}

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
              ? formatMessage({ id: "filter.accepted" })
              : filter?.status === "REJECTED"
                ? formatMessage({ id: "filter.rejected" })
                : filter?.status === "PENDING"
                  ? formatMessage({ id: "advance.pending" })
                  : "N/A"
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
      </TextField>
    </ContFilter>
  );
};
const Transaction = () => {
  const [filter, setFilter] = useState(INITIAL_FILTER);
  const comp = JSON.parse(localStorage.getItem("managedCompanies"));
  const [companyIds, setCompanyIds] = useState(
    comp ? comp[0]?._id : null
  );
  const [companyName, setCompanyName] = useState(comp ? comp[0]?.name : "");
  const [branches, setBranches] = useState([]);
  const [sort, setSort] = useState(-1);
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

  return (
    <SideContainer
      LeftSideComponent={<LeftSide filter={filter} setFilter={setFilter} companyIds={companyIds} sort={sort} />}
      RightSideComponent={
        <RightSide
          filter={filter}
          setFilter={setFilter}
          companies={companies}
          branches={branches}
          role={role}
          isNormalEmployer={isNormalEmployer}
          setCompanyIds={setCompanyIds}
          companyName={companyName}
          setCompanyName={setCompanyName}
          comp={comp}
          sort={sort}
          setSort={setSort}
        />
      }
    />
  );
};
export default Transaction;
