import React, { useEffect, useState } from "react";
import Button from "../../components/UI/Button";
import { IOSSwitch, Redirect } from "../../components/UI";
import { useParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Slider from "../../components/UI/Slider";
import TextField from "../../components/UI/TextField";
import MenuItem from "@mui/material/MenuItem";
import { BasicSelect } from "../../components/UI";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Grid,
  Avatar,
  IconButton,
  Typography,
} from "@mui/material";
import { useLocale } from "../../locales";
import CountryList from "country-list-with-dial-code-and-flag";
import { EditOutlined } from "@mui/icons-material";
import UploadProfileImage from "../../components/Merchants/UploadProfileImage";

const phoneNumberRegex = /^(0|\+212|00212|001|00216|00233|\+1|\+216|\+233)\d{9,10}$/;
const supportedCountries = ["MA", "US", "TN", "GH"].map((code) =>
  CountryList.findOneByCountryCode(code)
);

// const monetizationsMethods = [
//   { name: "Fees Per Advance", value: "FEES_PER_ADVANCE" },
//   {
//     name: "Company's Monthly Subscription",
//     value: "PAYED_BY_COMPANY",
//   },
// ];

const Company = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatMessage } = useLocale();
  // const url = `${import.meta.env.VITE_BASE_URL}`;
  const token = localStorage.getItem("token");
  const defaultForm = {
    name: "",
    phone: "",
    email: "",
    address: "",
    salaryDay: "",
    monetizationMethod: "",
    isAdvanceEnabled: "",
    advanceType: "",
    montant: "", // feature not implemented
    givenSalaryPercentage: 0,
    features: []
  };
  /* Form Valid Logic */
  const [formValidData, setFormValidData] = useState({
    isValidPhone: "init",
    /* ... rest of form properties should be here */
  });
  const [formData, setForm] = useState(defaultForm);
  const [logo, setLogo] = useState("")
  const [logoToSend, setLogoToSend] = useState("")
  const [openPicUpload, setOpenPicUpload] = useState({ type: "", state: false });
  const [isUpdated, setIsUpdated] = useState(false);
  const [timestamp, setTimestamp] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDisabledCompanyMethod, setIsDisabledCompanyMethod] = useState(false);
  const [countryCode, setCountryCode] = useState(supportedCountries[0].dial_code)
  const selectedUserState = useSelector((state) => state.userInfos);
  const isEmployer = selectedUserState.role === "Employer";
  const role = localStorage.getItem("role")
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const url = `${import.meta.env.VITE_BASE_URL}`
    const fetchData = async () => {
      try {
        const result = await axios.get(`${url}/companies?_id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData =
          (Array.isArray(result.data?.data?.docs) &&
            result.data?.data?.docs[0]) ||
          null;
        if (!responseData)
          throw new Error("Something Went Wrong, Contact Support");
        setForm({
          ...responseData,
          givenSalaryPercentage: Number(
            responseData.givenSalaryPercentage * 100
          ).toFixed(),
          features: responseData?.features?.filter((ft) => ft !== "TIME_TRACKER"),
          isLogoActive: !responseData?.isLogoActive ? false : responseData?.isLogoActive
        });
        setIsDisabledCompanyMethod(responseData?.monetizationMethod === "PAYED_BY_COMPANY")
        setTimestamp((prev) => ({
          ...prev,
          createdAt: responseData.createdAt,
          updatedAt: responseData.updatedAt,
        }));
      } catch (error) {
        if (error.response.status === 403) navigate("/home");
        else
          toast(
            error?.response?.data?.message ||
            formatMessage({ id: "common.something_went_wrong" }),
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              type: "error",
              theme: "colored",
            }
          );
      }
    };
    fetchData();
  }, [isUpdated]);

  const handleFormSubmit = async () => {
    setSaveLoading(true);
    const url = `${import.meta.env.VITE_BASE_URL}`

    try {

      const postData = {
        ...formData,
        givenSalaryPercentage: formData.givenSalaryPercentage / 100,
        logoUrl: undefined
      };

      const imageFormData = new FormData();
      imageFormData.append('logo', logoToSend);
      imageFormData.append('data', JSON.stringify(postData));

      const result = await axios.patch(`${url}/companies/form-data?_id=${id}`, imageFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (result) {
        //
        setSaveLoading(false);

        toast(formatMessage({ id: "response.company.edited" }), {
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

        selectedUserState?.role === "Employer"
          ? window.location.assign("/branches")
          : window.location.assign("/companies");
      }
      setIsUpdated((prev) => !prev);
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

  const handleDelete = async () => {
    setDeleteLoading(true);
    const url = `${import.meta.env.VITE_BASE_URL}`
    try {
      const postData = {}; // id should be in either url param or in body
      const result = await axios.delete(`${url}/companies?_id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result) {
        // toast logic
        setDeleteLoading(false);

        toast(formatMessage({ id: "response.company.delited" }), {
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
        handleClose();
      }
      selectedUserState?.role === "Employer"
        ? navigate("/branches")
        : navigate("/companies");
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
    }
    // finally {
    //   // wait 5s then relocate page
    //   const timeOutSec = 5500 // => 5.5ms after toast
    //   setTimeout(() => { window.location.href = "/company" }, timeOutSec)
    // }
  };

  return (
    <Box mt={{ xs: 0, sm: "32px" }} sx={{ padding: "0 35px" }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: '1.5rem' }}>
        <Avatar src={logo?.length > 0 ? logo : formData?.logoUrl} sx={{ width: 86, height: 86 }} />
        <IconButton
          onClick={() => setOpenPicUpload({ type: "logo", state: true })}
          sx={{
            width: "2rem",
            height: "2rem",
            bgcolor: '#fff',
            border: "1px solid #BDBDBD",
            marginLeft: "-1rem",
            ':hover': { bgcolor: 'var(--color-cyan)' }
          }}><EditOutlined sx={{ fontSize: '1.5rem', color: '#000' }} />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }} my={2}>
        <Typography variant="body3">{formatMessage({ id: "employee.logovisibility" })}</Typography>
        <IOSSwitch
          id="active"
          checked={formData?.isLogoActive}
          onClick={() => { setForm({ ...formData, isLogoActive: !formData?.isLogoActive }) }}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={0} md={2} />

        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                value={formData.name || ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                label={role === "Admin" ? formatMessage({ id: "company.companyname" }) : formatMessage({ id: "company.company" })}
                fullWidth
                margin="dense"
                InputProps={{
                  readOnly: isEmployer,
                  disabled: isEmployer,
                }}
              />
            </Grid>

            {/* <Grid item xs={12} sm={2}>
                <BasicSelect
                  margin="dense"
                  formControlProps={{ fullWidth: true, margin: "dense" }}
                  label={formatMessage({ id: "employee.country" })}
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
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

            <Grid item xs={12} sm={6}>
              <TextField
                label={formatMessage({ id: "company.phonenumber" })}
                value={formData.phone}
                type={"tel"}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, phone: e.target.value }));
                  setFormValidData((prev) => ({
                    ...prev,
                    isValidPhone: phoneNumberRegex.test(e.target.value),
                  }));
                }}
                error={!formValidData.isValidPhone}
                helperText={
                  !formValidData.isValidPhone &&
                  formatMessage({ id: "common.invalid_phone" })
                }
                fullWidth
                margin="dense"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label={formatMessage({ id: "company.address" })}
                value={formData.address}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, address: e.target.value }))
                }
                fullWidth
                margin="dense"
              />
            </Grid>

            {/* <Grid item xs={12} sm={6}>
              <TextField
                label={"ICE"}
                value={formData.ice}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, ice: e.target.value }))
                }
                fullWidth
                margin="dense"
              />
            </Grid> */}

            {/* <Grid item xs={12} sm={6}>
              <TextField
                label={"Register Commercial"}
                value={formData.registerCommercial}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, registerCommercial: e.target.value }))
                }
                fullWidth
                margin="dense"
              />
            </Grid> */}

            {/* Feature */}
            <Grid item xs={12} sm={6}>
              <BasicSelect
                margin="dense"
                formControlProps={{ fullWidth: true, margin: "dense" }}
                label={"Products"}
                value={formData.features}
                disabled={role === "Admin" ? false : true}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    features: [e.target.value],
                  }))
                }
              >
                <MenuItem value={"ALL"}>
                  {formatMessage({ id: "filter.evoucher.all" })}
                </MenuItem>
                <MenuItem value={"DEFAULT"}>
                  {formatMessage({ id: "company.advances" })}
                </MenuItem>
                <MenuItem value={"EVOUCHERS"}>
                  {formatMessage({ id: "nav.evoucher" })}
                </MenuItem>
              </BasicSelect>
            </Grid>

            {formData?.features?.filter((ft) => ft !== "TIME_TRACKER")?.includes("DEFAULT") || formData?.features?.filter((ft) => ft !== "TIME_TRACKER")?.includes("ALL") ?
              <Grid item xs={12} sm={6}>
                <Slider
                  size="medium"
                  aria-label="Small"
                  label={formatMessage({ id: "company.percentage" })}
                  valueLabelDisplay="auto"
                  defaultValue={0}
                  value={Number(formData.givenSalaryPercentage)}
                  onChange={(e, newValue) => {
                    setForm((prev) => ({
                      ...prev,
                      givenSalaryPercentage: newValue,
                    }));
                  }}
                />
              </Grid> : ""
            }

            {/* {role === "Admin" && 
            formData?.features.includes("DEFAULT") || formData?.features.includes("ALL")) ||
              (role !== "Admin" && selectedUserState?.company?.features?.includes("DEFAULT") ||
                selectedUserState?.company?.features?.includes("ALL")) ? */}
            {formData?.features?.filter((ft) => ft !== "TIME_TRACKER")?.includes("DEFAULT") || formData?.features?.filter((ft) => ft !== "TIME_TRACKER")?.includes("ALL") ?
              <Grid item xs={12} sm={6}>
                <TextField
                  label={formatMessage({ id: "company.date" })}
                  value={formData.salaryDay || ""}
                  InputProps={{
                    readOnly: isEmployer,
                    disabled: isEmployer,
                  }}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, salaryDay: e.target.value }))
                  }
                  fullWidth
                  margin="dense"
                />
              </Grid> : ""}

            {/* {(role === "Admin" && formData?.features.includes("DEFAULT") || formData?.features.includes("ALL")) ||
              (role !== "Admin" && selectedUserState?.company?.features?.includes("DEFAULT") ||
                selectedUserState?.company?.features?.includes("ALL")) ? */}

            {formData?.features?.filter((ft) => ft !== "TIME_TRACKER")?.includes("DEFAULT") || formData?.features?.filter((ft) => ft !== "TIME_TRACKER")?.includes("ALL") ?
              <Grid item xs={12} sm={6}>
                <BasicSelect
                  margin="dense"
                  formControlProps={{ fullWidth: true, margin: "dense" }}
                  label={formatMessage({ id: "company.monmethod" })}
                  value={formData.monetizationMethod}
                  disabled={isDisabledCompanyMethod}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      monetizationMethod: e.target.value,
                    }))
                  }
                >
                  <MenuItem value={"FEES_PER_ADVANCE"}>
                    {formatMessage({ id: "employee.fees" })}
                  </MenuItem>
                  <MenuItem value={"PAYED_BY_COMPANY"}>
                    {formatMessage({ id: "employee.sponsor" })}
                  </MenuItem>
                </BasicSelect>
              </Grid> : ""}

            {/* {(role === "Admin" && formData?.features.includes("DEFAULT") || formData?.features.includes("ALL")) ||
              (role !== "Admin" && selectedUserState?.company?.features?.includes("DEFAULT") ||
                selectedUserState?.company?.features?.includes("ALL")) ? */}
            {formData?.features?.filter((ft) => ft !== "TIME_TRACKER")?.includes("DEFAULT") || formData?.features?.filter((ft) => ft !== "TIME_TRACKER")?.includes("ALL") ?
              <Grid item xs={12} sm={6}>
                <BasicSelect
                  margin="dense"
                  formControlProps={{ fullWidth: true, margin: "dense" }}
                  label={formatMessage({ id: "company.advancesenabled" })}
                  value={formData.isAdvanceEnabled}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      isAdvanceEnabled: JSON.parse(e.target.value), // convert str to boolean
                    }))
                  }
                >
                  {[
                    {
                      name: formatMessage({ id: "company.active" }),
                      value: true,
                    },
                    {
                      name: formatMessage({ id: "company.inactive" }),
                      value: false,
                    },
                  ].map((option, i) => (
                    <MenuItem key={i} value={option.value}>
                      {option.name}
                    </MenuItem>
                  ))}
                </BasicSelect>
              </Grid> : ""}

            {/* {(role === "Admin" && formData?.features.includes("DEFAULT") || formData?.features.includes("ALL")) ||
              (role !== "Admin" && selectedUserState?.company?.features?.includes("DEFAULT") ||
                selectedUserState?.company?.features?.includes("ALL")) ? */}
            {formData?.features?.filter((ft) => ft !== "TIME_TRACKER")?.includes("DEFAULT") || formData?.features?.filter((ft) => ft !== "TIME_TRACKER")?.includes("ALL") ?
              <Grid item xs={12} sm={6}>
                <BasicSelect
                  margin="dense"
                  formControlProps={{ fullWidth: true, margin: "dense" }}
                  label={formatMessage({ id: "settings.advanceapproval" })}
                  value={formData?.advanceType}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      advanceType: e.target.value,
                    }))
                  }
                  InputProps={{
                    readOnly: isEmployer,
                    disabled: isEmployer,
                  }}
                >
                  <MenuItem value="AUTOMATIC">
                    {formatMessage({ id: "settings.automatic" })}
                  </MenuItem>
                  <MenuItem value="BY_PROMPT">
                    {formatMessage({ id: "settings.manual" })}
                  </MenuItem>
                </BasicSelect>
              </Grid> : ""}

            <Grid item xs={12} sm={12} />
            <Grid
              item
              xs={12}
              sm={4}
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <span
                onClick={() => navigate("/employer", { state: { formData } })}
                style={{ cursor: "pointer" }}
              >
                <Redirect
                  text={formatMessage({ id: "company.employers" })}
                // link={"/employer"}
                />
              </span>
            </Grid>

            <Grid
              item
              xs={12}
              sm={4}
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <span
                onClick={() => navigate("/employee", { state: { formData } })}
                style={{ cursor: "pointer" }}
              >
                <Redirect
                  text={formatMessage({ id: "company.employees" })}
                // link={"/employee"}
                />
              </span>
            </Grid>

            {/* {(role === "Admin" && formData?.features.includes("DEFAULT") || formData?.features.includes("ALL")) ||
              (role !== "Admin" && selectedUserState?.company?.features?.includes("DEFAULT") ||
                selectedUserState?.company?.features?.includes("ALL")) ? */}
            {formData?.features?.filter((ft) => ft !== "TIME_TRACKER")?.includes("DEFAULT") || formData?.features?.filter((ft) => ft !== "TIME_TRACKER")?.includes("ALL") ||
              (localStorage.getItem("superAdminManage") === "ADVANCEADMIN" ||
                localStorage.getItem("superAdminManage") === "SUPERADMIN")
              ?
              <Grid
                item
                xs={12}
                sm={4}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "1rem",
                }}
              >{

                  localStorage.getItem("superAdminManage") !== "EVOUCHER" &&
                  <span
                    onClick={() =>
                      navigate("/transaction", { state: { formData } })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <Redirect
                      text={formatMessage({ id: "company.advancesenabled" })}
                    />
                  </span>
                }
              </Grid> : ""}

            <Grid item xs={12} />
            <Grid item xs={0} sm={3} />

            <Grid item xs={12} sm={3} my={{ xs: 0, sm: 2 }}>
              <Button
                color={"var(--color-white)"}
                bgColor={"var(--color-danger)"}
                text={formatMessage({ id: "company.delete" })}
                onClick={handleClickOpen}
              />
            </Grid>

            <Grid item xs={12} sm={3} my={{ xs: 0, sm: 2 }}>
              <Button
                text={formatMessage({ id: "company.save" })}
                loading={saveLoading}
                onClick={handleFormSubmit}
              />
            </Grid>

            <Grid item xs={0} sm={3} />
          </Grid>
        </Grid>

        <Grid item xs={0} md={2} />
      </Grid>

      {/* Profile Image upload dialog */}
      <Dialog
        open={openPicUpload.state}
        onClose={() => setOpenPicUpload({ type: "", state: false })}
        fullWidth
        maxWidth={openPicUpload.type === "logo" ? "xs" : "md"}
      >
        <UploadProfileImage
          openPicUpload={openPicUpload}
          setOpenPicUpload={setOpenPicUpload}
          setLogo={setLogo}
          setLogoToSend={setLogoToSend}
          type="Gwala"
        />
      </Dialog>

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
          {formatMessage({ id: "company.deletequestion" })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {formatMessage({ id: "company.deletenote" })}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            text={formatMessage({ id: "company.delete" })}
            loading={deleteLoading}
            color={"var(--color-white)"}
            bgColor={"var(--color-danger)"}
            onClick={handleDelete}
            autoFocus
          />
          <Button
            text={formatMessage({ id: "company.close" })}
            onClick={handleClose}
          />
        </DialogActions>
      </Dialog>
    </Box >
  );
};

export default Company;
