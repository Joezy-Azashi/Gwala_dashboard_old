import React, { useState } from "react";
import Button from "../../components/UI/Button";
import { IOSSwitch } from "../../components/UI";
import axios from "axios";
import { toast } from "react-toastify";
import Slider from "../../components/UI/Slider";
import TextField from "../../components/UI/TextField";
import MenuItem from "@mui/material/MenuItem";
import { BasicSelect } from "../../components/UI";
import { Avatar, Box, Dialog, Grid, IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useLocale } from "../../locales";
import { EditOutlined } from "@mui/icons-material";
import UploadProfileImage from "../../components/Merchants/UploadProfileImage";
// import CountryList from "country-list-with-dial-code-and-flag";

const phoneNumberRegex =
  /^(0|\+212|00212|001|00216|00233|\+1|\+216|\+233)\d{9,10}$/;
// const supportedCountries = ["MA", "US", "TN", "GH"].map((code) =>
//       CountryList.findOneByCountryCode(code)
//   );

const AddCompany = ({ isEmployer = false }) => {
  // const url = `${import.meta.env.VITE_BASE_URL}`;
  const token = localStorage.getItem("token");
  const { formatMessage } = useLocale();
  const [saveLoading, setSaveLoading] = useState(false);
  const navigate = useNavigate();
  // const [countryCode, setCountryCode] = useState(supportedCountries[0].dial_code)

  const monetizationsMethods = [
    // { name: formatMessage({ id: "company.monthly" }), value: "SUBSCRIPTION" },
    { name: formatMessage({ id: "company.fees" }), value: "FEES_PER_ADVANCE" },
    { name: formatMessage({ id: "company.companys" }), value: "PAYED_BY_COMPANY" },
    // { name: formatMessage({ id: "company.freemium" }), value: "FREEMIUM" },
  ];

  const defaultForm = {
    name: "",
    address: "",
    phone: "",
    // salaryDay: "",
    // givenSalaryPercentage: 0,
    // advanceType: "",
    // monetizationMethod: "",
    features: [],
    isLogoActive: false
  };
  const [formData, setForm] = useState(defaultForm);
  const [logo, setLogo] = useState("")
  const [logoToSend, setLogoToSend] = useState("")
  const [openPicUpload, setOpenPicUpload] = useState({ type: "", state: false });

  /* Form Valid Logic */
  const [formValidData, setFormValidData] = useState({
    isValidPhone: "init",
    /* ... rest of form properties should be here */
  });

  const handleFormSubmit = async () => {
    const url = `${import.meta.env.VITE_BASE_URL}`

    if (formData?.features?.length < 1) {
      toast(formatMessage({ id: "employer.selectfeature" }), {
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
    } else {
      setSaveLoading(true);
      try {
        if (formData?.givenSalaryPercentage) formData.givenSalaryPercentage = formData?.givenSalaryPercentage
        if (formData?.salaryDay) formData.salaryDay = formData?.salaryDay
        if (formData?.advanceType) formData.advanceType = formData?.advanceType
        if (formData?.monetizationMethod) formData.monetizationMethod = formData?.monetizationMethod

        const imageFormData = new FormData();
        imageFormData.append('logo', logoToSend)
        imageFormData.append("data", JSON.stringify(formData));

        const result = await axios.post(`${url}/companies/form-data`, imageFormData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (result) {
          //
          setSaveLoading(false);

          toast(formatMessage({ id: "response.company.created" }), {
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
          navigate("/companies");
        }
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
    }
  };

  return (
    <>
      <Box mt={{ xs: 0, sm: "32px" }} sx={{ padding: "0 35px" }}>
        <Typography variant="h4" color={"var(--color-dark-blue)"} textAlign={'center'} fontWeight={600} padding={'0 0 2rem 0'}>{formatMessage({ id: "company.addnew" })}</Typography>

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
              <Grid item xs={12} sm={6}>
                <TextField
                  value={formData.name || ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  label={formatMessage({ id: "company.companyname" })}
                  fullWidth
                  margin="dense"
                  InputProps={{
                    readOnly: isEmployer,
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
                      isValidPhone: phoneNumberRegex.test(`${e.target.value}`),
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
                  label={"Register Commecial"}
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

              {formData?.features?.includes("DEFAULT") || formData?.features?.includes("ALL") ?
                <Grid item xs={12} sm={6}>
                  <Slider
                    size="medium"
                    aria-label="Small"
                    label={formatMessage({ id: "company.percentage" })}
                    valueLabelDisplay="auto"
                    defaultValue={0}
                    value={formData.givenSalaryPercentage}
                    onChange={(e, newValue) => {
                      setForm((prev) => ({
                        ...prev,
                        givenSalaryPercentage: newValue,
                      }));
                    }}
                  />
                </Grid> : ""}

              {formData?.features?.includes("DEFAULT") || formData?.features?.includes("ALL") ?
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={formatMessage({ id: "company.date" })}
                    value={formData.salaryDay || ""}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, salaryDay: e.target.value }))
                    }
                    fullWidth
                    margin="dense"
                  />
                </Grid> : ""}

              {formData?.features?.includes("DEFAULT") || formData?.features?.includes("ALL") ?
                <Grid item xs={12} sm={6}>
                  <BasicSelect
                    margin="dense"
                    formControlProps={{ fullWidth: true, margin: "dense" }}
                    label={formatMessage({ id: "company.monmethod" })}
                    value={formData.monetizationMethod}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        monetizationMethod: e.target.value,
                      }))
                    }
                  >
                    {monetizationsMethods.map((option, i) => (
                      <MenuItem key={i} value={option.value}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </BasicSelect>
                </Grid> : ""}

              {formData?.features?.includes("DEFAULT") || formData?.features?.includes("ALL") ?
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
                  >
                    <MenuItem value="AUTOMATIC">
                      {formatMessage({ id: "settings.automatic" })}
                    </MenuItem>
                    <MenuItem value="BY_PROMPT">
                      {formatMessage({ id: "settings.manual" })}
                    </MenuItem>
                  </BasicSelect>
                </Grid> : ""}
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              mt={{ xs: 10, sm: 3 }}
            >
              <Grid item xs={12} sm={6}>
                <Button
                  text={formatMessage({ id: "company.add" })}
                  loading={saveLoading}
                  onClick={handleFormSubmit}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={0} md={2} />
        </Grid>
      </Box>

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
    </>
  );
};

export default AddCompany;
