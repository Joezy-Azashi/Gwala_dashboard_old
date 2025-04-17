import React, { useState } from "react";
import { useLocale } from "../../locales";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Grid,
} from "@mui/material";
import TextField from "../UI/TextField";
import { Button } from "../UI/";
import { toast } from "react-toastify";
import axios from "../../api/request";
import { useCallback } from "react";
import ButtonSpinner from "../buttonspinner/ButtonSpinner";
import { useDispatch } from "react-redux";
import { setLogout } from "../../store/reducer/userReducer";
import { useNavigate } from "react-router";

const ChangeEmail = ({ closeModal }) => {
  const { formatMessage } = useLocale();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* Form Logic */

  const defaultForm = {
    email: "",
    code: "",
  };
  const [formData, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [verify, setVerify] = useState(false);
  const handleFormSubmit = async () => {
    try {
      const result = await axios.post(`/employers/update/email/verify`, {
        code: formData.code,
      });
      if (result.status === "success") {
        toast(formatMessage({ id: "profile.changedemail" }), {
          position: "top-right",
          type: "success",
          theme: "colored",
        });
        closeModal();
        localStorage.clear();
        dispatch(setLogout());
        navigate("/login");
      }
    } catch (error) {
      // toast logic
      const message =
        error?.response?.data?.message ||
        formatMessage({ id: "common.something_went_wrong" });
      toast(message, {
        position: "top-right",
        type: "error",
        theme: "colored",
      });
    }
  };

  /* Form Logic */
  const verifyEmail = async () => {
    try {
      setLoading(true);
      if (formData.email != "") {
        const result = await axios.post("/employers/update/email/init", {
          email: formData.email,
        });
        if (result.status === "success") {
          setVerify(true);
          toast("WE sent a verification code check your email", {
            position: "top-right",
            type: "success",
            theme: "colored",
          });
        }
        setLoading(false);
      }
    } catch (e) { }
  };
  return (
    <Dialog
      open={true}
      onClose={closeModal}
      fullWidth
      maxWidth="sm"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        backdropFilter: "blur(5px) sepia(5%)",
        "& .MuiPaper-root": { padding: ".5rem" },
      }}
    >
      <DialogTitle id="alert-dialog-title">
        <h3>{formatMessage({ id: "profile.changeEmail" })}</h3>
      </DialogTitle>
      <DialogContent>
        <p style={{ color: "black" }}>
          {formatMessage({ id: "profile.dialog.email" })}
        </p>
        <div>
          <Box mt={{ xs: 0, sm: "32px" }}>
            <Grid item xs={12}>
              {
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    label={formatMessage({ id: "profile.new.email" })}
                    type={"text"}
                    value={formData.email}
                    onChange={(e) => {
                      setForm({
                        ...formData,
                        email: e.target.value,
                      });
                    }}
                    fullWidth
                    margin="dense"
                  />
                </div>
              }
            </Grid>
            {verify && (
              <Grid item xs={12}>
                {
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      label={formatMessage({ id: "profile.verify.email.code" })}
                      type={"text"}
                      value={formData.code}
                      onChange={(e) =>
                        setForm({
                          ...formData,
                          code: e.target.value,
                        })
                      }
                      fullWidth
                      margin="dense"
                    />
                  </div>
                }
              </Grid>
            )}
          </Box>
        </div>
      </DialogContent>
      <DialogActions
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "30%" }}>
          {!verify ? (
            !loading ? (
              <Button
                onClick={verifyEmail}
                text={formatMessage({ id: "profile.veriyEmail" })}
              />
            ) : (
              <Button text={<ButtonSpinner />} />
            )
          ) : !loading ? (
            <Button
              onClick={handleFormSubmit}
              text={formatMessage({ id: "profile.submit.email" })}
            />
          ) : (
            <Button text={<ButtonSpinner />} />
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeEmail;
