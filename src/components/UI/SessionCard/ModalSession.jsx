import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";
import TextField from "../TextField";
import Button from "../Button";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";

const ModalSession = ({ open, handleClose, data }) => {
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle sx={{ fontWeight: "bold", color: "var(--color-dark-blue)" }}>
        Edit Session’s Time
      </DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TextField label={"Full name"} fullWidth margin="dense" />
          <TextField label={"Session No"} fullWidth margin="dense" />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "5px",
            }}
          >
            <DatePicker
              label="Date"
              sx={{
                width: "100%",
                background: "#F7F0F0",
              }}
            />
            <TimePicker
              ampm={false}
              sx={{
                width: "100%",
                background: "#F7F0F0",
              }}
              label="End at"
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
              }}
            />
            <TimePicker
              ampm={false}
              sx={{
                width: "100%",
                background: "#F7F0F0",
              }}
              label="Start at"
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
              }}
            />
          </div>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button text={formatMessage({ id: "timetracker.save" })} />
        <Button
          text={"Delete the Session"}
          color={"#fff"}
          bgColor={"var(--color-danger)"}
        />
      </DialogActions>
    </Dialog>
  );
};

export default ModalSession;
