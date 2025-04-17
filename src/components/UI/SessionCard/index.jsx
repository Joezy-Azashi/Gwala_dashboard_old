import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import moment from "moment";
import { Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from "@mui/material";
import TextField from "../TextField";
import { useLocale } from "../../../locales";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import Button from "../Button";
import dayjs from "dayjs";
import axios from "../../../api/request";
import { toast } from "react-toastify";

const ToBeStyledTooltip = ({ className, ...props }) => (
  <Tooltip {...props} classes={{ tooltip: className }} />
);

const StyledTooltipAuto = styled(ToBeStyledTooltip)(({ theme }) => ({
  backgroundColor: 'var(--color-danger) !important',
  color: 'rgba(0, 0, 0, 0.87)',
  border: '1px solid #dadde9',
  borderRadius: '20px !important',
  padding: '7px !important'
}));

const StyledTooltipManual = styled(ToBeStyledTooltip)(({ theme }) => ({
  backgroundColor: '#FFF1D2 !important',
  color: '#000 !important',
  border: '1px solid #dadde9',
  borderRadius: '20px !important',
  padding: '7px !important'
}));

const Card = styled.div`
  width: 100%;
  margin: auto;
  max-width: 633px;
  border-radius: 8px;
  border: 1px solid #eaecf0;
  background: #fff;
  padding: 13px;
  margin-bottom: 10px;
  .title {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
  }
  p {
    color: #777c8e;
    font-size: 10px;
    margin-top: 5px;
    margin-bottom: 20px;
  }
  .time {
    display: flex;
    justify-content: space-around;
  }
  .edit {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    > img {
      cursor: pointer;
    }
  }
  .CheckIn,
  .CheckOut {
    display: flex;
    align-items: center;
    flex-direction: column;
    span:first-child {
      font-weight: 600;
    }
    span:last-child {
      color: #777c8e;
      font-size: 12px;
    }
  }
`;
const SessionCard = ({
  el,
  sessionNum,
  description,
  time,
  clockIn,
  clockOut,
  user,
  setGetData,
  getData
}) => {

  const [openEdit, setOpenEdit] = useState(false)
  const { formatMessage } = useLocale();
  const [startDate, setStartDate] = useState(dayjs(clockIn))
  const [endDate, setEndDate] = useState(dayjs(clockOut))
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const EditSession = async () => {
    const data = { startDate: startDate, endDate: endDate }
    setLoading(true)
    const result = await axios.patch(`/v2/time-tracking/sessions/${el?._id}`, data);
    if (result.status === "success") {
      toast(formatMessage({ id: "timetracker.updatesuccess" }), {
        theme: "colored",
        type: "success",
      });
      setOpenEdit(false)
      setLoading(false)
      setStartDate(dayjs(""))
      setEndDate(dayjs(""))
      setGetData(getData + 1)
    } else {
      setLoading(false)
      toast("Error, try again", {
        theme: "colored",
        type: "error",
      });
    }
  }

  const DeleteSession = async () => {
    setDeleteLoading(true)
    const result = await axios.delete(`/v2/time-tracking/sessions/${el?._id}`);
    if (result.status === "success") {
      toast(formatMessage({ id: "timetracker.deletesuccess" }), {
        theme: "colored",
        type: "success",
      });
      setOpenEdit(false)
      setDeleteLoading(false)
      setStartDate(dayjs(""))
      setEndDate(dayjs(""))
      setGetData("getdata")
    } else {
      setDeleteLoading(false)
      toast("Error, try again", {
        theme: "colored",
        type: "error",
      });
    }
  }

  return (
    <Card>
      <div className="title">
        <span>{formatMessage({ id: "timetracker.session.session" })} {sessionNum}</span>
        <div className="edit">
          <span>{time === undefined || time === null ? "--:--" : ((Math.floor(time / 3600)).toString().length < 2 ? "0" : "") + Math.floor(time / 3600) + ":" + ((Math.floor((time % 3600) / 60)).toString().length < 2 ? "0" : "") + Math.floor((time % 3600) / 60) + ":" + (((time % 3600) % 60).toString().length < 2 ? "0" : "") + (time % 3600) % 60}</span>
          {clockOut === undefined ? null : <img src="/icons/edit-pen.svg" onClick={() => setOpenEdit(true)} />}
        </div>
      </div>
      <p>{description}</p>
      <div className="time">
        <div className="CheckIn" />
        <div className="CheckOut" style={{ marginLeft: "50px" }}>
          {el?.autoEnded ?
            <StyledTooltipAuto placement="top" title={formatMessage({ id: "timetracker.session.nomanual" })}>
              <img
                src="/icons/infoclock.svg"
                onClick={() => { setRejectInfo(el), setReason(true) }}
                width={20}
                style={{ color: "red" }}
              />
            </StyledTooltipAuto> : null
          }
          {el?.addedManually ?
            <StyledTooltipManual placement="top" title={formatMessage({ id: "timetracker.session.manual" })}>
              <img
                src="/icons/danger.png"
                onClick={() => { setRejectInfo(el), setReason(true) }}
                width={18}
                style={{ color: "red" }}
              />
            </StyledTooltipManual> : null
          }
        </div>
      </div>
      <div className="time">
        <div className="CheckIn">
          <span>{clockIn === undefined || clockIn === null ? "--:--" : moment(clockIn).format('h:mm:ss a')}</span>
          <span>{formatMessage({ id: "timetracker.session.begin" })}</span>
        </div>
        <div className="CheckOut">
          <span style={{ fontWeight: "600" }}>{clockOut === undefined || clockOut === null ? "--:--" : moment(clockOut).format('h:mm:ss a')}</span>
          <span>{formatMessage({ id: "timetracker.session.clockOut" })}</span>
        </div>
      </div>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle sx={{ fontWeight: "bold", color: "var(--color-dark-blue)", padding: "2rem 4rem" }}>
          {formatMessage({ id: "timetracker.edit" })}
        </DialogTitle>
        <DialogContent sx={{ padding: "0 4rem 2rem 4rem" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TextField label={formatMessage({ id: "timetracker.name" })} value={user?.firstName + " " + user?.lastName} fullWidth margin="dense" />
            <TextField label={formatMessage({ id: "timetracker.sessionnum" })} value={sessionNum} fullWidth margin="dense" />
            <TextField label={formatMessage({ id: "timetracker.date" })} value={moment(el?.createdAt).format('DD MMM YYYY')} fullWidth margin="dense" />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "5px",
              }}
            >
              <TimePicker
                sx={{
                  width: "100%",
                  background: "#F7F0F0",
                }}
                label={formatMessage({ id: "timetracker.startat" })}
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue.toISOString());
                }}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                }}
              />
              <TimePicker
                sx={{
                  width: "100%",
                  background: "#F7F0F0",
                }}
                label={formatMessage({ id: "timetracker.endedat" })}
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue.toISOString());
                }}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                }}
              />
            </div>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions sx={{ padding: "0rem 4rem 2rem 4rem" }}>
          <Button text={formatMessage({ id: "timetracker.save" })} loading={loading} onClick={() => EditSession()} />
          <Button
            loading={deleteLoading}
            text={formatMessage({ id: "timetracker.delete" })}
            color={"#fff"}
            bgColor={"var(--color-danger)"}
            onClick={() => DeleteSession()}
          />
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default SessionCard;

SessionCard.PropTypes = {
  sessionNum: Number,
  description: String,
  time: String,
  clockIn: String,
  clockOut: String,
  editable: Boolean,
};
