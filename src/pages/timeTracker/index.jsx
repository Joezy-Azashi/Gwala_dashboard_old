import React from "react";
import SideContainer from "../../containers/SideContainer";
import Cellul from "../../components/UI/Cellul";
import { useLocale } from "../../locales";
import { ContFilter, Field } from "../../components/employee/style";
import { useGetSession } from "../../api";
import { useState } from "react";
import { MenuItem, Pagination, TextField } from "@mui/material";
import { useNavigate } from "react-router";
import moment from "moment";
import dayjs from "dayjs";
import PageSpinner from "../../components/pagespinner/PageSpinner";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const INITIAL_FILTER = {
  sort_worked_minutes: 1,
  sort_alphabeticaly: 1,
  statuses: ["WORKING", "ON_PAUSE", "FINISHED"],
  startDate: dayjs().startOf('day'),
};
const LeftSide = ({ data, page, setPage, loading }) => {
  const navigate = useNavigate();
  const { formatMessage } = useLocale();
  return (
    <div>
      <table
        style={{
          borderSpacing: "12px",
          width: "100%",
          height: "100%",
        }}
      >
        <thead>
          <tr>
            <th>
              <Cellul color="#D9EDFF">
                {formatMessage({ id: "timetracker.name" })}
              </Cellul>
            </th>
            <th>
              <Cellul color="#D9EDFF">
                {formatMessage({ id: "timetracker.status" })}
              </Cellul>
            </th>
            <th>
              <Cellul color="#D9EDFF">
                {formatMessage({ id: "timetracker.totalHours" })}
              </Cellul>
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
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
              </td>
            </tr>
          ) :
            data?.docs.length < 1 ?
              (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
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
                  </td>
                </tr>
              ) :
              (
                data?.docs.map((el, index) => {
                  let sessionDataAuto = []
                  let sessionDataManual = []
                  // el?.sessions?.map((data) => sessionDataAuto.push(data?.autoEnded))
                  // el?.sessions?.map((data) => sessionDataManual.push(data?.addedManually))
                  return (
                    <tr
                      key={index}
                      onClick={() => {
                        navigate(`/timetracker/${el?.user?._id}`, {
                          state: { name: el.user.firstName },
                        });
                        localStorage.setItem("timetrackertab", 1)
                      }
                      }
                      style={{
                        cursor: "pointer",
                        opacity: el.status === "N/A" ? 0.5 : 1,
                        pointerEvents: el.status === "N/A" && "none",
                      }}
                    >
                      <td>
                        <Cellul>
                          {el.user.firstName} {el.user.lastName}
                        </Cellul>
                      </td>
                      <td>
                        {el.status === "FINISHED" ? (
                          <Cellul txtColor="#F33124">
                            {formatMessage({
                              id: "filter.timetracker.status.finished",
                            })}
                          </Cellul>
                        ) : el.status === "ON_PAUSE" ? (
                          <Cellul txtColor="#F4A125">
                            {formatMessage({
                              id: "filter.timetracker.status.onPause",
                            })}
                          </Cellul>
                        ) : el.status === "WORKING" ? (
                          <Cellul txtColor="#09833A">
                            {formatMessage({
                              id: "filter.timetracker.status.working",
                            })}
                          </Cellul>
                        ) :
                          // : el.status === "ON_VACATION" ? (
                          //   <Cellul txtColor="#F33124">
                          //     {formatMessage({
                          //       id: "filter.timetracker.status.onVacation",
                          //     })}
                          //   </Cellul>
                          // ) : el.status === "ABSENT" ? (
                          //   <Cellul txtColor="#F33124">
                          //     {formatMessage({
                          //       id: "filter.timetracker.status.absent",
                          //     })}
                          //   </Cellul>
                          // ) 
                          (
                            <Cellul txtColor="#F33124">{el.status}</Cellul>
                          )}
                      </td>
                      <td style={{ color: "var(--color-dark-blue" }}>
                        <Cellul>
                          {`${Math.floor(
                            el.totalWorkedTime.workedHours
                          )}h ${Math.round(
                            (el.totalWorkedTime.workedHours % 1) * 60
                          )}min`}
                          {el?.sessions.filter(ft => ft.autoEnded || ft.addedManually).length > 0 ?
                            <img
                              src="/icons/infoclock.svg"
                              width={20}
                              style={{ position: 'absolute', right: "20px", top: "65px" }}
                            /> : null
                          }
                        </Cellul>
                      </td>
                    </tr>
                  )
                })
              )}
        </tbody>
      </table>
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
            onChange={(e, value) => setPage(value)}
            page={page}
          />
        </div>
      )}
    </div>
  );
};
const RightSide = ({ filter, setFilter }) => {
  const { formatMessage } = useLocale();

  return (
    <ContFilter>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>{moment().format("D MMMM YYYY")}</div>
        <div
          style={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={() => setFilter(INITIAL_FILTER)}
        >
          {formatMessage({ id: "employee.clearfilter" })}
        </div>
      </div>

      <div
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            // label={formatMessage({ id: "advance.date" })}
            onChange={(value) => setFilter({ ...filter, startDate: value, endDate: value })}
            value={filter?.startDate}
            slotProps={{
              textField: { size: "small", error: false, fullWidth: "true" },
            }}
            disableFuture={true}
            views={["year", "month", "day"]}
            format="DD/MM/YYYY"
          />
        </LocalizationProvider>
      </div>
      <Field
        onClick={() =>
          setFilter({
            ...filter,
            sort_worked_minutes: filter.sort_worked_minutes * -1,
          })
        }
      >
        <span>{formatMessage({ id: "filter.sortByHours" })}</span>
        <img src="/icons/Employee/filter.svg" />
      </Field>

      <Field
        onClick={() =>
          setFilter({
            ...filter,
            sort_alphabeticaly: filter.sort_alphabeticaly * -1,
          })
        }
      >
        <span>{formatMessage({ id: "filter.sortAlpha" })}</span>
        <img src="/icons/Employee/filter.svg" />
      </Field>
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
          filter?.statuses.length === 3
            ? formatMessage({ id: "filter.timetracker.status.label" })
            : filter?.statuses[0] === "WORKING"
              ? formatMessage({ id: "filter.timetracker.status.working" })
              : filter?.statuses[0] === "ON_PAUSE"
                ? formatMessage({ id: "filter.timetracker.status.onPause" })
                : formatMessage({ id: "filter.timetracker.status.finished" })
        }
        InputLabelProps={{ shrink: false }}
        fullWidth
      >
        <MenuItem
          onClick={() => setFilter({ ...filter, statuses: ["WORKING"] })}
          style={{ textTransform: "capitalize" }}
        >
          {formatMessage({ id: "filter.timetracker.status.working" })}
        </MenuItem>
        <MenuItem
          onClick={() => setFilter({ ...filter, statuses: ["ON_PAUSE"] })}
          style={{ textTransform: "capitalize" }}
        >
          {formatMessage({ id: "filter.timetracker.status.onPause" })}
        </MenuItem>
        <MenuItem
          onClick={() => setFilter({ ...filter, statuses: ["FINISHED"] })}
          style={{ textTransform: "capitalize" }}
        >
          {formatMessage({ id: "filter.timetracker.status.finished" })}
        </MenuItem>
        {/* <MenuItem
          onClick={() => setFilter({ ...filter, status: "ON_VACATION" })}
          style={{ textTransform: "capitalize" }}
        >
          {formatMessage({ id: "filter.timetracker.status.onVacation" })}
        </MenuItem>
        <MenuItem
          onClick={() => setFilter({ ...filter, status: "ABSENT" })}
          style={{ textTransform: "capitalize" }}
        >
          {formatMessage({ id: "filter.timetracker.status.absent" })}
        </MenuItem> */}
      </TextField>
    </ContFilter>
  );
};
const TimeTracker = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState(INITIAL_FILTER);
  const { sessions, loading } = useGetSession(filter, page);

  return (
    <SideContainer
      LeftSideComponent={
        <LeftSide
          data={sessions}
          page={page}
          setPage={setPage}
          loading={loading}
        />
      }
      RightSideComponent={<RightSide filter={filter} setFilter={setFilter} />}
    />
  );
};

export default TimeTracker;
