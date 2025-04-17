import React, { useState } from "react";
import { getCompanies } from "../../api";
import { Field, ContFilter } from "../../components/employee/style";
import { useLocale } from "../../locales";
import SideContainer from "../../containers/SideContainer";
import { useSelector } from "react-redux";
import { sortArrayAlphabetically } from "../../utils";
import { Typography, TextField, MenuItem, Tab, Box, Grid, InputAdornment, Autocomplete, } from "@mui/material";
import PhoneRequests from "../../components/Requests/PhoneRequests";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import MarjaneLoyaltyCards from "../../components/Requests/MarjaneLoyaltyCards";
import { Search } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const INITIAL_FILTER = {
  status: "",
  company: "",
  requestDate: 1,
  sort: "",
  startDate: "",
  endDate: "",
  phonenumber: ""
};
const LeftSide = ({ subtabIndex, tabSubHandler, data, cardLoading, setCardLoading, page, setPhoneRequests, setPage, refetch, setRefetch, filter, setFilter, selectedUserState }) => {
  const [visible, setVisible] = useState();
  const { formatMessage } = useLocale();

  return (
    <Box>
      <TabContext value={subtabIndex} sx={{ overflow: "auto" }}>
        <TabList onChange={tabSubHandler}
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: "var(--color-dark-blue)", height: "2px" },
            '& .Mui-selected': {
              color: "var(--color-dark-blue) !important",
              backgroundColor: "var(--color-cyan)",
              // borderRight: localStorage.getItem("superAdminManage") !== "EVOUCHER" || localStorage.getItem("superAdminManage") !== "SUPERADMIN" ? "2px solid" : subtabIndex === "1" ? "0 !important" : "",
              // borderLeft: localStorage.getItem("superAdminManage") === "EVOUCHER" || localStorage.getItem("superAdminManage") === "SUPERADMIN" ? "2px solid" : subtabIndex === "2" ? "0 !important" : ""
            },
            '& .MuiTab-root': {
              color: "#B0B6C3",
              padding: "0px 15px !important",
              textTransform: "capitalize",
              fontWeight: "600",
              border: "2px solid",
              width: { xs: "50%" }
            },
            '& .MuiTabs-flexContainer': { justifyContent: "center" }
          }}
        >
          <Tab
            label={formatMessage({ id: "phone.request.phonechange" })}
            value={"1"}
            sx={{ width: "200px" }}
          />
          {localStorage.getItem("superAdminManage") === "EVOUCHER" ||
            localStorage.getItem("superAdminManage") === "SUPERADMIN" ?
            <Tab
              label={formatMessage({ id: "phone.request.marjane" })}
              value={"2"}
              sx={{ width: "200px" }}
            /> : null
          }
        </TabList>

        <TabPanel value="1" sx={{ padding: "24px 0 0 0" }}>
          <PhoneRequests
            visible={visible}
            setVisible={setVisible}
            data={data}
            page={page}
            setPage={setPage}
            setPhoneRequests={setPhoneRequests}
            filter={filter}
            setFilter={setFilter}
            refetch={refetch}
            setRefetch={setRefetch}
            selectedUserState={selectedUserState}
          />
        </TabPanel>

        <TabPanel value="2" sx={{ padding: "24px 0 0 0" }}>
          <MarjaneLoyaltyCards
            filter={filter}
            page={page}
            setPage={setPage}
            cardLoading={cardLoading}
            setCardLoading={setCardLoading}
          />
        </TabPanel>
      </TabContext>

    </Box>
  );
};
const RightSide = ({
  subtabIndex,
  phoneNumber,
  setPhoneNumber,
  requesterPhone,
  setRequesterPhone,
  phoneRequests,
  setPhoneRequests,
  filter,
  setFilter,
  companies,
  role,
  isNormalEmployer,
  setPage,
  setCardLoading,
  companyName,
  setCompanyName
}) => {
  const { formatMessage } = useLocale();
  const [timeoutMulti, setTimeoutMulti] = useState(null)
  const [sortOrder, setOrder] = useState(1);

  const triAlpha = () => {
    const newArray = sortArrayAlphabetically({
      arr: phoneRequests?.docs,
      order: sortOrder,
      key: { user: "firstName" },
    });
    setPhoneRequests({ ...phoneRequests, docs: [...newArray] });
    setOrder(-sortOrder);
  };

  const handlePhoneChange = (e) => {
    try {
      clearTimeout(timeoutMulti)
    }
    catch {

    }
    setCardLoading(true)
    setPhoneNumber(e.target.value)
    setTimeoutMulti(setTimeout(() => {
      setPage(1)
      setFilter({ ...filter, phonenumber: e.target.value })
    }, 1500))
  }

  const handleRequesterPhoneChange = (e) => {
    try {
      clearTimeout(timeoutMulti)
    }
    catch {

    }
    setCardLoading(true)
    setRequesterPhone(e.target.value)
    setTimeoutMulti(setTimeout(() => {
      setPage(1)
      setFilter({ ...filter, requesterPhone: e.target.value })
    }, 1500))
  }

  const clearFilter = () => {
    setFilter(INITIAL_FILTER);
    setCompanyName("");
    setPhoneNumber("")
    setRequesterPhone("")
    setPage(1)
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

      {subtabIndex === "2" &&
        <>
          <TextField
            size="small"
            type="number"
            onKeyDown={(e) => {
              if (e.keyCode === 38 || e.keyCode === 40) {
                e.preventDefault();
              }
            }}
            onWheel={(e) => e.target.blur()}
            variant="outlined"
            value={phoneNumber}
            onChange={(e) => handlePhoneChange(e)}
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
            placeholder={formatMessage({ id: "phone.request.concernednumber" })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            size="small"
            type="number"
            onKeyDown={(e) => {
              if (e.keyCode === 38 || e.keyCode === 40) {
                e.preventDefault();
              }
            }}
            onWheel={(e) => e.target.blur()}
            variant="outlined"
            value={requesterPhone}
            onChange={(e) => handleRequesterPhoneChange(e)}
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
            placeholder={formatMessage({ id: "phone.request.requestedby" })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <Field
            onClick={() => {
              setFilter((prev) => ({
                ...filter,
                sort: filter.sort === "" ? -1 : -filter?.sort,
              }));
              setPage(1)
            }}
          >
            <span>{formatMessage({ id: "advance.montant" })}</span>
            <img src="/icons/Employee/filter.svg" />
          </Field>
        </>
      }

      <>
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
                setCompanyName(value.name);
                setPage(1)
              }
            }}
          />
        )}

        {subtabIndex === "1" &&
          <>
            <Field
              onClick={() => {
                setFilter((prev) => ({
                  ...filter,
                  requestDate: prev.requestDate * -1,
                }));
              }}
            >
              <span>Date</span>
              <img src="/icons/Employee/filter.svg" />
            </Field>
            <Field onClick={triAlpha}>
              <span>{formatMessage({ id: "filter.sortAlpha" })}</span>
              <img src="/icons/Employee/filter.svg" />
            </Field>
          </>
        }

        {subtabIndex === "1" ?
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
                : filter?.status === "ACCEPTED"
                  ? formatMessage({ id: "filter.accepted" })
                  : filter?.status === "REJECTED"
                    ? formatMessage({ id: "filter.rejected" })
                    : formatMessage({ id: "advance.pending" })
            }
            InputLabelProps={{ shrink: false }}
            fullWidth
          >
            <MenuItem
              onClick={() => { setFilter({ ...filter, status: "ACCEPTED" }); setPage(1) }}
              style={{ textTransform: "capitalize" }}
            >
              {formatMessage({ id: "phone.request.accept" })}
            </MenuItem>
            <MenuItem
              onClick={() => { setFilter({ ...filter, status: "REJECTED" }); setPage(1) }}
              style={{ textTransform: "capitalize" }}
            >
              {formatMessage({ id: "phone.request.reject" })}
            </MenuItem>
            <MenuItem
              onClick={() => { setFilter({ ...filter, status: "PENDING" }); setPage(1) }}
              style={{ textTransform: "capitalize" }}
            >
              {formatMessage({ id: "advance.pending" })}
            </MenuItem>
          </TextField> :
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
                : filter?.status === "REQUESTED"
                  ? formatMessage({ id: "phone.request.requested" })
                  : filter?.status === "PURCHASED"
                    ? formatMessage({ id: "phone.request.purchased" })
                    : formatMessage({ id: "filter.rejected" })
            }
            InputLabelProps={{ shrink: false }}
            fullWidth
          >
            <MenuItem
              onClick={() => { setFilter({ ...filter, status: "REQUESTED" }); setPage(1) }}
              style={{ textTransform: "capitalize" }}
            >
              {formatMessage({ id: "phone.request.requested" })}
            </MenuItem>
            <MenuItem
              onClick={() => { setFilter({ ...filter, status: "PURCHASED" }); setPage(1) }}
              style={{ textTransform: "capitalize" }}
            >
              {formatMessage({ id: "phone.request.purchased" })}
            </MenuItem>
            <MenuItem
              onClick={() => { setFilter({ ...filter, status: "REJECTED" }); setPage(1) }}
              style={{ textTransform: "capitalize" }}
            >
              {formatMessage({ id: "phone.request.reject" })}
            </MenuItem>
          </TextField>
        }
      </>

      {subtabIndex === "2" &&
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
                  onChange={(value) => { setFilter({ ...filter, startDate: value.startOf('day') }); setPage(1) }}
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
                  onChange={(value) => { setFilter({ ...filter, endDate: value.endOf('day') }); setPage(1) }}
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
      }
    </ContFilter>
  );
};
const PhoneRequest = () => {
  const [subtabIndex, setSubTabIndex] = useState("1")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [requesterPhone, setRequesterPhone] = useState("")
  const [filter, setFilter] = useState(INITIAL_FILTER);
  const [page, setPage] = useState(1);
  const [phoneRequests, setPhoneRequests] = useState([]);
  const [refetch, setRefetch] = useState(1);
  const [cardLoading, setCardLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");

  const role = localStorage.getItem("role");

  const selectedUserState = useSelector((state) => state.userInfos);
  const isNormalEmployer =
    Array.isArray(selectedUserState?.manages) &&
    selectedUserState.manages.length === 0;
  const companies = getCompanies(1, 10, role === "Admin");

  const tabSubHandler = (e, val) => {
    setSubTabIndex(val)
    setFilter(INITIAL_FILTER)
    setPhoneNumber("")
    setRequesterPhone("")
    setCompanyName("")
    setPage(1)
    document?.getElementsByClassName("MuiAutocomplete-clearIndicator")[0]?.click()
  }

  return (
    <SideContainer
      LeftSideComponent={
        <LeftSide
          subtabIndex={subtabIndex}
          tabSubHandler={tabSubHandler}
          data={phoneRequests}
          fetchData={setPage}
          page={page}
          setPage={setPage}
          setPhoneRequests={setPhoneRequests}
          setRefetch={setRefetch}
          refetch={refetch}
          filter={filter}
          setFilter={setFilter}
          selectedUserState={selectedUserState}
          cardLoading={cardLoading}
          setCardLoading={setCardLoading}
        />
      }
      RightSideComponent={
        <RightSide
          subtabIndex={subtabIndex}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          requesterPhone={requesterPhone}
          setRequesterPhone={setRequesterPhone}
          phoneRequests={phoneRequests}
          setPhoneRequests={setPhoneRequests}
          filter={filter}
          setFilter={setFilter}
          companies={companies}
          role={role}
          isNormalEmployer={isNormalEmployer}
          setPage={setPage}
          setCardLoading={setCardLoading}
          companyName={companyName}
          setCompanyName={setCompanyName}
        />
      }
    />
  );
};
export default PhoneRequest;
