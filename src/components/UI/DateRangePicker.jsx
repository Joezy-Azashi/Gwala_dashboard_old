import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const DateRangePicker = ({ startDate, setStartDate, disableFuture = true }) => {
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        // label={formatMessage({ id: "advance.date" })}
        onChange={(value) => setStartDate(value)}
        value={startDate}
        slotProps={{
          textField: { size: "small", error: false, fullWidth: "true" },
        }}
        disableFuture={disableFuture}
        views={["year", "month", "day"]}
        format="DD/MM/YYYY"
      />
    </LocalizationProvider>
  );
};

export default DateRangePicker;
