import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "../../components/UI/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "../../components/UI/Button";
import CountryList from "country-list-with-dial-code-and-flag";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  IconButton,
  Grid
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useLocale } from "../../locales";
const phoneNumberRegex = /^(0|\+212|00212|001|00216|00233|\+1|\+216|\+233)\d{9,10}$/;

const EditEmployer = () => {
  const token = localStorage.getItem("token");
  const url = `${import.meta.env.VITE_BASE_URL}`;
  const { formatMessage } = useLocale();
  const { id } = useParams();
  const navigate = useNavigate();

  /* user Selector logic */
  const userInfos = useSelector((state) => state.userInfos);
  /* user Selector logic */

  /** is employer logic */
  const [isEmployer, setIsEmployer] = useState(true);

  useEffect(() => {
    if (userInfos?._id) setIsEmployer(userInfos?.role === "Employer");
  }, [userInfos]);

  const defaultForm = {
    firstName: "",
    lastName: "",
    email: "", // needs to be added in v2
    company: "", // needs to be added in v2 also should get from companies api
    countryCode: "+212", // default
    phone: "", // employers dont have phone numbers in v1 for now it replaced by company phone number
    isDefaultPasswordChanged: false,
    password: "",
    manages: [],
    role: ""
  };
  const [formData, setForm] = useState(defaultForm);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isEmployerEnabled, setIsEmployerEnabled] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deactivateLoading, setDeactivateLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [timestamp, setTimestamp] = useState({});
  /* Form Valid Logic */
  const [formValidData, setFormValidData] = useState({
    isValidPhone: "init",
    /* ... rest of form properties should be here */
  });

  const supportedCountries = ["MA", "US", "TN", "GH"].map((code) =>
    CountryList.findOneByCountryCode(code)
  );

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  /* employer data fetching logic */
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = defaultForm;
        const result = await axios.get(`${url}/employers/?id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (result.data?.data?.docs[0])
          data = {
            ...data,
            ...result.data?.data?.docs[0],
            company: result.data?.data?.docs[0]?.company?.name,
            // phone:
            //   result.data?.data?.docs[0]?.phone?.replace(/(\+212|00212|001|00216|00233|\+1|\+216|\+233)/g, "") ||
            //   result.data?.data?.docs[0]?.company?.phone?.replace(/(\+212|00212|001|00216|00233|\+1|\+216|\+233)/g, ""),
          };
        setForm(data);
        setIsEmployerEnabled(data.isEnabled);
        setTimestamp((prev) => ({
          ...prev,
          createdAt: data?.createdAt,
          updatedAt: data?.updatedAt,
        }));
      } catch (error) {
        navigate("/employer");
      }
    };
    fetchData();
  }, [isUpdated, isEmployerEnabled]);
  /* employer data fetching logic */

  /* Form Logic */
  const handleFormSubmit = async () => {
    // setForm((prev) => ({ ...prev, phone: formData?.countryCode + formData?.phone }));
    setSaveLoading(true);
    try {
      const postData = {
        ...formData,
      };
      delete postData.company;
      if (!postData.password.length) delete postData.password;
      const result = await axios.patch(`${url}/employers/${id}`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result) {
        setSaveLoading(false);
        // toast logic

        toast(formatMessage({ id: "response.employer.edit" }), {
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
      }
      setIsUpdated((prev) => !prev);
      navigate("/employer")
    } catch (error) {
      setSaveLoading(false);
      // toast logic
      const message =
        error?.response?.data?.message ||
        formatMessage({ id: "common.something_went_wrong" });
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
  };
  /* Form Logic */

  /* EnableDisable Logic */
  const handleEnableDisable = async () => {
    setDeactivateLoading(true);
    try {
      const postData = {
        isEnabled: !isEmployerEnabled,
      };
      // const actionUrl = `${url}/employers/${!isEmployerEnabled ? "enable" : "disable"}/${id}`
      const result = await axios.patch(`${url}/employers/${id}`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result) {
        setDeactivateLoading(false);
        // toast logic

        toast(formatMessage({ id: "response.employer.edit" }), {
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
      }
      setIsEmployerEnabled((prev) => !prev);
    } catch (error) {
      setDeactivateLoading(false);
      // toast logic
      const message =
        error?.response?.data?.message ||
        formatMessage({ id: "common.something_went_wrong" });
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
  };
  /* EnableDisable Logic */

  /* Delete Logic */
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const result = await axios.patch(
        `${url}/employers/delete/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (result) {
        setDeleteLoading(false);
        setOpen(false);
        // toast logic

        toast(formatMessage({ id: "response.employee.deleted" }), {
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
      }
      setIsUpdated((prev) => !prev);
    } catch (error) {
      setDeleteLoading(false);
      // toast logic
      const message =
        error?.response?.data?.message ||
        formatMessage({ id: "common.something_went_wrong" });
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
    } finally {
      // wait 5s then relocate page
      const timeOutSec = 5500; // => 5.5s after toast
      setTimeout(() => {
        navigate("/employer");
      }, timeOutSec);
    }
  };
  /* Delete Logic */

  return (
    <>
      <Box mt={{ xs: 0, sm: "32px" }} sx={{ padding: "0 35px" }}>
        <Grid container spacing={3}>
          <Grid item xs={0} md={2} />
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  value={formData.firstName}
                  label={formatMessage({ id: "employer.firstname" })}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                  fullWidth
                  margin="dense"
                  InputProps={{
                    readOnly: isEmployer,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label={formatMessage({ id: "employer.lastname" })}
                  value={formData.lastName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                  fullWidth
                  margin="dense"
                  InputProps={{
                    readOnly: isEmployer,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label={formatMessage({ id: "employer.email" })}
                  value={formData.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  fullWidth
                  margin="dense"
                  InputProps={{
                    readOnly: isEmployer,
                  }}
                />
              </Grid>

              {formData.role === "NORMAL" && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={formatMessage({ id: "employer.company" })}
                    value={formData.company}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, company: e.target.value }))
                    }
                    fullWidth
                    margin="dense"
                    InputProps={{
                      readOnly: true,
                    }}
                    disabled
                  />
                </Grid>
              )}
              {formData.role === "MANAGER" && (
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    multiple
                    margin="dense"
                    options={formData.manages}
                    getOptionLabel={(option) => option?.name || "N/A"}
                    InputProps={{
                      readOnly: true,
                    }}
                    value={formData.manages}
                    disabled
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="dense"
                        label={formatMessage({ id: "employer.branch" })}
                        placeholder={formatMessage({ id: "nav.search" })}
                      />
                    )}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <Grid container spacing={1}>
                  {/* <Grid item xs={4}>
                    <BasicSelect
                      margin="dense"
                      InputProps={{
                        readOnly: isEmployer,
                      }}
                      formControlProps={{ fullWidth: true, margin: "dense" }}
                      label={formatMessage({ id: "employer.country" })}
                      value={formData.countryCode || supportedCountries[0].code}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          countryCode: e.target.value,
                        }))
                      }
                    >
                      {supportedCountries.map((country, i) => (
                        <MenuItem key={i} value={country.dial_code}>
                          {" "}
                          {country.flag}
                          {` ${country.code}`}
                          {` (${country.dial_code})`}
                        </MenuItem>
                      ))}
                    </BasicSelect>
                  </Grid> */}
                  <Grid item xs={12}>
                    <TextField
                      label={formatMessage({ id: "employer.phone" })}
                      value={formData.phone}
                      type={"tel"}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, phone: e.target.value }));
                        setFormValidData((prev) => ({
                          ...prev,
                          isValidPhone: phoneNumberRegex.test(
                            `${formData.countryCode}${e.target.value}`
                          ),
                        }));
                      }}
                      error={!formValidData.isValidPhone}
                      helperText={
                        !formValidData.isValidPhone &&
                        formatMessage({ id: "common.invalid_phone" })
                      }
                      fullWidth
                      margin="dense"
                      InputProps={{
                        readOnly: isEmployer,
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6}>
                {
                  /** Currently in backend admin cant set this value */
                  // (!isEmployer &&
                  //   (
                  //   <BasicSelect
                  //     margin="dense"
                  //     InputProps={{
                  //       readOnly: isEmployer,
                  //     }}
                  //     formControlProps={{ fullWidth: true, margin: "dense" }}
                  //     label={formatMessage({ id: "employer.defaultpassword" })}
                  //     value={formData.isDefaultPasswordChanged}
                  //     onChange={(e) =>{
                  //       setForm((prev) => ({
                  //         ...prev,
                  //         isDefaultPasswordChanged: e.target.value,
                  //       }))}
                  //     }
                  //   >
                  //     <MenuItem value={true}>
                  //       {formatMessage({ id: "employer.changed" })}
                  //     </MenuItem>
                  //     <MenuItem value={false}>
                  //       {formatMessage({ id: "employer.notchanged" })}
                  //     </MenuItem>
                  //   </BasicSelect>
                  // )) ||
                  /** ********************** */
                  <TextField
                    label={formatMessage({ id: "employer.defaultpassword" })}
                    value={
                      (formData.isDefaultPasswordChanged &&
                        formatMessage({ id: "employer.changed" })) ||
                      formatMessage({ id: "employer.notchanged" })
                    }
                    fullWidth
                    margin="dense"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                }
              </Grid>

              {!isEmployer && (
                <Grid item xs={12} sm={6}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      label={formatMessage({ id: "employer.password" })}
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          password: e.target.value,
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
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label={formatMessage({ id: "employer.seehistory" })}
                  value={formData?.isAllowedToSeeHistory ? true : false}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      isAllowedToSeeHistory: e.target.value,
                    }))
                  }
                  fullWidth
                  margin="dense"
                >
                  <MenuItem value={true}>{formatMessage({ id: "employer.true" })}</MenuItem>
                  <MenuItem value={false}>{formatMessage({ id: "employer.false" })}</MenuItem>
                </TextField>
              </Grid>

              < Grid item xs={0} sm={12} />

              {!isEmployer && (
                <Grid item xs={12} sm={4} mt={{ xs: 0, sm: 3 }}>
                  <Button
                    color={"var(--color-white)"}
                    bgColor={"var(--color-danger)"}
                    text={formatMessage({ id: "employer.delete" })}
                    onClick={handleClickOpen}
                  />
                </Grid>
              )}

              {!isEmployer && (
                <Grid item xs={12} sm={4} mt={{ xs: 0, sm: 3 }}>
                  <Button
                    text={
                      (isEmployerEnabled &&
                        formatMessage({ id: "employer.deactivate" })) ||
                      formatMessage({ id: "employer.activate" })
                    }
                    loading={deactivateLoading}
                    onClick={handleEnableDisable}
                  />
                </Grid>
              )}

              {!isEmployer && (
                <Grid item xs={12} sm={4} mt={{ xs: 0, sm: 3 }}>
                  <Button
                    text={formatMessage({ id: "employer.save" })}
                    loading={saveLoading}
                    onClick={handleFormSubmit}
                  />
                </Grid>
              )}

              {/* <Grid item xs={0} sm={3} /> */}
            </Grid>
          </Grid>

          <Grid item xs={0} md={2} />
        </Grid>

        <Dialog
          open={open}
          onClose={handleClose}
          sx={{
            "& .MuiDialog-paper": { padding: ".5rem" },
            backdropFilter: "blur(5px) sepia(5%)",
          }}
          PaperProps={{ sx: { borderRadius: "22px" } }}
        >
          <DialogTitle id="alert-dialog-title">
            {formatMessage({ id: "employer.deletequestion" })}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {formatMessage({ id: "employer.note" })}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button
              text={formatMessage({ id: "employer.delete" })}
              loading={deleteLoading}
              color={"var(--color-white)"}
              bgColor={"var(--color-danger)"}
              onClick={handleDelete}
              autoFocus
            />
            <Button
              text={formatMessage({ id: "employer.close" })}
              onClick={handleClose}
            />
          </DialogActions>
        </Dialog>
      </Box>
      {/* <SideContainer
        LeftSideComponent={<LeftSide {...{ formData, setForm, isEmployer }} />}
        RightSideComponent={
          <RightSide
            {...{
              handleFormSubmit,
              isEmployerEnabled,
              handleEnableDisable,
              timestamp,
              handleDelete,
              isEmployer,
            }}
          />
        }
      /> */}
    </>
  );
};

export default EditEmployer;
