import React, { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Button, TextField } from "../../components/UI";
import { useLocale } from "../../locales";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "../../api/request";
import { toast } from "react-toastify";
import EmployerCDPForm from "../../components/EmployerCDPForm";
import ChangeEmail from "../../components/ChangeEmail";
const phoneNumberRegex = /^(0|\+212|00212|001|00216|00233|\+1|\+216|\+233)\d{9,10}$/;

function Profile() {
  const { formatMessage } = useLocale();
  const [change, setChange] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEmail, setEmailOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const userInfos = useSelector((state) => state.userInfos);

  useEffect(() => {
    setUserData({
      firstName: userInfos.firstName,
      lastName: userInfos.lastName,
      phone: userInfos.phone,
      email: userInfos.email,
    });
  }, [userInfos]);

  const UpdateEmployer = async () => {
    setSaveLoading(true)
    try {
      const result = await axios.patch("/employers", userData);
      if (result.status === "success")
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      toast(formatMessage({ id: "response.employer.edit" }), {
        position: "top-right",
        autoClose: 5000,
        type: "success",
        theme: "colored",
      });
      setSaveLoading(false)
    } catch (e) {
      setSaveLoading(false)
    }
  };

  /* Form Valid Logic */
  const [formValidData, setFormValidData] = useState({
    isValidPhone: "init",
    /* ... rest of form properties should be here */
  });

  return (
    <>
      <EmployerCDPForm open={open} setOpen={setOpen} />
      {openEmail && <ChangeEmail closeModal={() => setEmailOpen(false)} />}
      <Box sx={{ padding: "2rem 35px" }}>
        <Typography
          variant="h4"
          fontWeight={"600"}
          color={"var(--color-dark-blue)"}
          textAlign={"center"}
          paddingBottom={{ sm: "1.5rem" }}
        >
          {formatMessage({ id: "profile.title" })}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={0} md={2} lg={3.5} />

          <Grid item xs={12} md={8} lg={5}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  label={formatMessage({ id: "profile.firstname" })}
                  type="text"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                  value={userData?.firstName}
                  onChange={(e) => {
                    setUserData({ ...userData, firstName: e.target.value });
                    setChange(true);
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label={formatMessage({ id: "profile.lastname" })}
                  type="text"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                  value={userData?.lastName}
                  onChange={(e) => {
                    setUserData({ ...userData, lastName: e.target.value });
                    setChange(true);
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label={formatMessage({ id: "profile.phone" })}
                  type="text"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                  value={userData?.phone}
                  onChange={(e) => {
                    setUserData({ ...userData, phone: e.target.value });
                    setChange(true);
                    setFormValidData(prev => ({
                      ...prev,
                      isValidPhone: (
                        phoneNumberRegex.test(`${e.target.value}`))
                    }))
                  }}
                  error={!formValidData.isValidPhone}
                  helperText={!formValidData.isValidPhone && formatMessage({ id: "common.invalid_phone" })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label={formatMessage({ id: "profile.email" })}
                  type="email"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                  value={userData?.email}
                  disabled
                  onChange={(e) => {
                    setUserData({ ...userData, email: e.target.value });
                    setChange(true);
                  }}
                />
              </Grid>

              {/* <Grid item xs={12}>
              <TextField
              label={formatMessage({ id: "profile.address" })}
              type="address"
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
              value={userData.address}
              onChange={(e) => {
                setUserData({ ...userData, address: e.target.value });
                setChange(true);
              }}
              />
            </Grid> */}

              <Grid item xs={12} md={4} mt={{ xs: 0, sm: 3 }}>
                <Button
                  loading={saveLoading}
                  color={"var(--color-dark-blue)"}
                  bgColor={!change ? "#BDBDBD" : ""}
                  text={formatMessage({ id: "profile.save" })}
                  onClick={UpdateEmployer}
                />
              </Grid>

              <Grid
                item
                xs={12}
                md={4}
                mt={{ xs: 0, sm: 3 }}
                style={{ textAlign: "center" }}
              >
                <Button
                  color={"var(--color-dark-blue)"}
                  text={formatMessage({ id: "profile.changepass" })}
                  onClick={() => setOpen(true)}
                />
              </Grid>
              <Grid item xs={12} md={4} mt={{ xs: 0, sm: 3 }}>
                <Button
                  color={"var(--color-dark-blue)"}
                  text={formatMessage({ id: "profile.changeEmail" })}
                  onClick={() => setEmailOpen(true)}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={0} md={2} lg={3.5} />
        </Grid>
      </Box>
    </>
  );
}

export default Profile;
