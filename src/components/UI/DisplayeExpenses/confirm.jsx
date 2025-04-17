import React from "react";
import PropTypes from "prop-types";

import DialogTitle from "@mui/material/DialogTitle";
import Button from "../Button";
import { Hidden, Grid, Dialog, DialogContent, Box } from "@mui/material";
import { useLocale } from "../../../locales";
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
  approveLoading,
  rejectLoading,
}) => {
  const { formatMessage } = useLocale();
  return (
    <Dialog
      open={
        visible?.attachment === undefined || visible?.attachment.length < 1
          ? false
          : visible
      }
      onClose={setHidden}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="sm"
      sx={{
        backdropFilter: "blur(5px) sepia(5%)",
      }}
      PaperProps={{ sx: { minHeight: "20rem" } }}
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          textAlign: "center",
          fontSize: "1.25rem",
          "&:first-letter": { textTransform: "capitalize" },
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      {visible?.status === "PENDING" ? (
        <Grid container spacing={3} mb={3}>
          <Hidden mdDown>
            <Grid item xs={0} sm={0} md={3} />
          </Hidden>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              color={"var(--color-dark-blue)"}
              text={confirmText}
              loading={approveLoading}
              onClick={onSubmit}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              color={"var(--color-white)"}
              bgColor={"var(--color-danger)"}
              text={cancelText}
              loading={rejectLoading}
              onClick={onCancel}
            />
          </Grid>

          <Grid item xs={0} sm={0} md={3} />
        </Grid>
      ) : visible?.status === "APPROVED" ? (
        <Box
          sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          mt={3}
          mb={2}
        >
          <Box sx={{ width: "30%" }}>
            <Button
              color={"var(--color-dark-blue)"}
              text={formatMessage({ id: "reimbursements.mark" })}
              loading={approveLoading}
              onClick={() => UpdatePaid(data?.data?.expense?._id)}
            />
          </Box>
        </Box>
      ) : (
        ""
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
