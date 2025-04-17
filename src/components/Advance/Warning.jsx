import { Dialog, DialogActions, DialogContent } from "@mui/material";
import React from "react";
import { Button } from "../UI";
import { useLocale } from "../../locales";
import styled from "styled-components";
const DivWarning = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  > label {
    font-size: 18px;
    font-weight: 600;
  }
`;
const Warning = ({ text, onSubmit, onCancel, open }) => {
  const { formatMessage } = useLocale();
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      sx={{
        "& .MuiDialog-paper": { width: "50%", padding: "26px" },
      }}
      PaperProps={{ sx: { borderRadius: "35px" } }}
      maxWidth="md"
    >
      <DialogContent>
        <DivWarning>
          <img src="/icons/warning.png" />
          <label>Warning</label>
        </DivWarning>
        <p style={{ fontSize: "15px", textAlign: "center" }}>{text}</p>
      </DialogContent>
      <DialogActions>
        <Button
          text={formatMessage({ id: "advance.confirm.cancel" })}
          onClick={onCancel}
        />
        <Button
          text={formatMessage({ id: "advance.sent" })}
          onClick={onSubmit}
          bgColor={"var(--color-dark-blue)"}
          color="#fff"
        />
      </DialogActions>
    </Dialog>
  );
};

export default Warning;
