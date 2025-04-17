import React, { useState } from "react";
import { useLocale } from "../../locales";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  IconButton,
  Grid,
} from "@mui/material";
import TextField from "../../components/UI/TextField";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { toast } from "react-toastify";
import axios from "../../api/request";
import { useDispatch } from "react-redux";
import { setPasswordChanged } from "../../store/reducer/userReducer";
import { Button } from "../UI";

const EmployerCDPForm = ({ open, setOpen }) => {
  const { formatMessage } = useLocale();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  /* Form Logic */

  const defaultForm = {
    isDefaultPasswordChanged: true,
    password: "",
    confirm_password: "",
    oldPassword: "",
  };

  const [formData, setForm] = useState(defaultForm);
  const [showError, setShowError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFormSubmit = async () => {
    if (formData.oldPassword === "" || formData.password === "" || formData.confirm_password === "") {
      toast(formatMessage({ id: "profile.required" }), {
        position: "top-right",
        autoClose: 5000,
        type: "error",
        theme: "colored",
      });
    } else if (formData.oldPassword === formData.password) {
      toast(formatMessage({ id: "profile.warning" }), {
        position: "top-right",
        autoClose: 5000,
        type: "error",
        theme: "colored",
      });
    } else {
      setLoading(true)
      const postData = {
        ...formData,
      };

      if (postData.password !== postData.confirm_password)
        throw new Error("Passwords do not match");
      delete postData.confirm_password;

      const result = await axios.patch(`/employers`, postData);
      if (result.status === "success") {
        // toast logic
        toast(formatMessage({ id: "response.employee.edit" }), {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          type: "success",
          theme: "colored",
        });
        setLoading(false)
        setOpen(false)
        dispatch(setPasswordChanged(result?.data?.isDefaultPasswordChanged));

      } else {
        setLoading(false)
        // toast logic
        const message = error?.response?.data?.message || formatMessage({ id: "common.something_went_wrong" });
        toast(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          type: "error",
          theme: "colored",
        });
      }
    }
  };
  /* Form Logic */

  const handleChangePassword = (e) => {
    setForm((prev) => ({
      ...prev,
      password: e.target.value,
    }))
    if (e.target.value === "") {
      setShowError(false)
      return;
    }
    // eslint-disable-next-line
    if (e.target.value?.match(/[a-z]/) && e.target.value?.match(/[A-Z]/) && e.target.value.match(/[0-9]/) && e.target.value?.match(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/) && e.target.value?.length > 7) {
      setShowError(false)
      return
    }
    if (e.target.value?.match(/[a-z]/) && e.target.value?.match(/[A-Z]/) && e.target.value.match(/[0-9]/) && e.target.value.match(/[0-9]/)) {
      setShowError(true)
      return
    }
    // eslint-disable-next-line
    if (e.target.value?.match(/[a-z]/) && e.target.value?.match(/[A-Z]/) && e.target.value?.match(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)) {
      setShowError(true)
      return
    }
    if (e.target.value?.match(/[a-z]/) && e.target.value?.match(/[A-Z]/)) {
      setShowError(true)
      return
    }
    if (e.target.value.match(/[0-9]/)) {
      setShowError(true)
      return
    }
    if (e.target.value.match(/[^\\s+$]/)) {
      setShowError(true)
      return
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (reason && reason == "backdropClick")
          return;
        setOpen(false);
      }}
      fullWidth
      maxWidth="sm"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        backdropFilter: "blur(5px) sepia(5%)",
        '& .MuiPaper-root': { padding: ".5rem" }
      }}
    >
      <DialogTitle id="alert-dialog-title">
        <h3>{formatMessage({ id: "profile.change.password" })}</h3>
      </DialogTitle>
      <DialogContent>
        {/* <DialogContentText id="alert-dialog-description">
          <p style={{ color: "black" }}>
            {" "}
            Its required to change your password after your first login.
          </p>
        </DialogContentText> */}
        <div>
          <Box mt={{ xs: 0, sm: "32px" }} sx={{}}>
            <Grid item xs={10} sm={6}>
              {
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    label={formatMessage({ id: "profile.old.password" })}
                    type={showOldPassword ? "text" : "password"}
                    autoComplete="off"
                    value={formData.oldPassword}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        oldPassword: e.target.value,
                      }))
                    }
                    fullWidth
                    margin="dense"
                  />
                  <Box
                    sx={{
                      backgroundColor: "#f7f0f0",
                      borderRadius: "0",
                      width: "3.5rem",
                      display: "flex",
                      height: "3.5rem",
                      marginTop: "4px",
                    }}
                  >
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      edge="end"
                      sx={{ margin: "auto" }}
                    >
                      {showOldPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </Box>
                </div>
              }
            </Grid>
            <Grid item xs={10} sm={6}>
              {
                <>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      label={formatMessage({ id: "profile.change.password" })}
                      type={showPassword ? "text" : "password"}
                      autoComplete="off"
                      value={formData.password}
                      onChange={(e) => handleChangePassword(e)}
                      fullWidth
                      margin="dense"
                    />
                    <Box
                      sx={{
                        backgroundColor: "#f7f0f0",
                        borderRadius: "0",
                        width: "3.5rem",
                        display: "flex",
                        height: "3.5rem",
                        marginTop: "4px",
                      }}
                    >
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ margin: "auto" }}
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </Box>
                  </div>
                  {
                    showError ?
                      <ul style={{ fontSize: "0.75rem", color: "#d32f2f" }}>
                        <li className="list-disc ml-4">{formatMessage({ id: "profile.error.charlength" })}</li>
                        <li className="list-disc ml-4">{formatMessage({ id: "profile.error.case" })}</li>
                        <li className="list-disc ml-4">{formatMessage({ id: "profile.error.specialchar" })}</li>
                      </ul> : ""
                  }
                </>
              }
            </Grid>
            <Grid item xs={10} sm={6}>
              {
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    label={formatMessage({ id: "profile.confirm.password" })}
                    type={showPassword ? "text" : "password"}
                    autoComplete="off"
                    value={formData.confirm_password}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        confirm_password: e.target.value,
                      }))
                    }
                    fullWidth
                    margin="dense"
                    error={formData.password !== formData.confirm_password}
                    helperText={
                      formData.password !== formData.confirm_password &&
                      formatMessage({ id: "profile.match.password" })
                    }
                  />
                </div>
              }
            </Grid>
          </Box>
        </div>
      </DialogContent>
      <DialogActions>
        {
          window.location.pathname === '/home' ? "" :
            <Button
              color={"#fff"}
              bgColor={"var(--color-danger)"}
              text={formatMessage({ id: "profile.cancel" })}
              onClick={() => setOpen(false)}
            />
        }
        <Button
          loading={loading}
          text={formatMessage({ id: "profile.change" })}
          onClick={() => { showError || formData.confirm_password !== formData.password ? "" : handleFormSubmit() }}
        />
      </DialogActions>
    </Dialog>
  );
};

export default EmployerCDPForm;
