import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import React from "react";
import { Button } from "../../UI";
import { useLocale } from "../../../locales";
import { Padding } from "@mui/icons-material";

const UploadNewOne = ({ handleClose, openDialog, text, handleAgree, setEditDoc }) => {
  const { formatMessage } = useLocale();
  return (
    <div style={{ zIndex: 9}}>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAgree} text={formatMessage({ id: "edoc.yes" })} />
          <Button onClick={handleClose} text={formatMessage({ id: "edoc.no" })} />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UploadNewOne;
