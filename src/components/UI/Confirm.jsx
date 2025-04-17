import React from "react";

import PropTypes from "prop-types";
// import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";
import Button from "./Button";
const Confirm = ({
  children,
  onSubmit,
  onCancel,
  setHidden,
  confirmText = "Yes",
  cancelText = "No",
  visible,
  title,
  hideButton = false,
  submitLoading
}) => {
  return (
    <Dialog
      open={visible}
      onClose={setHidden}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        backdropFilter: "blur(5px) sepia(5%)",
      }}
      PaperProps={{ sx: { borderRadius: "22px" } }}
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{ textAlign: "center", fontSize: "1.25rem" }}
      >
        {title}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      {!hideButton && (
        <DialogActions>
          <Button
            onClick={onCancel}
            text={cancelText}
            bgColor={"var(--color-danger)"}
            color={"#fff"}
          >
            {cancelText}
          </Button>
          <Button onClick={onSubmit} autoFocus text={confirmText} loading={submitLoading}>
            {confirmText}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
Confirm.propTypes = {
  text: PropTypes.string,
  visible: PropTypes.any,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
};
export default Confirm;
