import React, { useEffect, useState } from "react";
import TextField from "../../components/UI/TextField";
import MenuItem from "@mui/material/MenuItem";
import { BasicSelect } from "../../components/UI";
import Button from "../../components/UI/Button";
import Cellul from "../../components/UI/Cellul";
import SideContainer from "../../containers/SideContainer";
import CountryList from "country-list-with-dial-code-and-flag";
import axios from "axios";
import { toast } from "react-toastify";
import { Box, Grid, Typography } from "@mui/material";
import { useLocale } from "../../locales";
import { Navigate, useNavigate } from "react-router";
import Autocomplete from "@mui/material/Autocomplete";
import useQuery from "../../hooks/useQuery";
import { useSelector } from "react-redux";
import isEmail from "validator/lib/isEmail";
const phoneNumberRegex = /^(0|\+212|00212|001|00216|00233|\+1|\+216|\+233)\d{9,10}$/;


const AddEmployer = () => {
  const token = localStorage.getItem("token");
  const url = `${import.meta.env.VITE_BASE_URL}`;
  const { formatMessage } = useLocale();
  const [saveLoading, setSaveLoading] = useState(false);
  const navigate = useNavigate();
  const query = useQuery();
  const supportedCountries = ["MA", "US", "TN", "GH"].map((code) =>
    CountryList.findOneByCountryCode(code)
  );
  /** permissions logic */
  const selectedUserState = useSelector((state) => state.userInfos);

  const [userRole, setUserRole] = useState({
    isEmployer: true,
    isManagerEmployer: false,
    isAdmin: false,
  });

  const {
    isEmployer,
    isManagerEmployer, // for future use
    isAdmin, // for future use
  } = userRole;

  useEffect(() => {
    if (selectedUserState?._id) {
      const isEmployer = selectedUserState?.type_employer === "NORMAL";
      const isManagerEmployer = selectedUserState?.type_employer === "MANAGER";
      const isAdmin = selectedUserState.role === "Admin";
      setUserRole((prev) => ({
        ...prev,
        isEmployer,
        isManagerEmployer,
        isAdmin,
      }));
    }
  }, [selectedUserState]);
  /** permissions logic */

  /* Comanies Fetch Logic */
  const [allCompanies, setAllCompanies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`${url}/companies?limit=10000`, {
          // we need a route without pagination (easy fix from backend)
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const resultCompanies = result.data?.data?.docs;
        setAllCompanies(resultCompanies || []);
      } catch (error) {
        setAllCompanies([]);
      }
    };
    fetchData();
  }, [false]);

  /* Comanies Fetch Logic */

  /* Form Logic */
  const [formData, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "", // needs to be added in v2
    company: "", // needs to be added in v2 also should get from companies api
    countryCode: "+212", // default
    phone: "",
    isDefaultPasswordChanged: false,
    password: "",
    role: "NORMAL",
    manages: [],
  });

  /* Form Valid Logic */
  const [formValidData, setFormValidData] = useState({
    isValidPhone: "init",
    isValidEmail: "init"
    /* ... rest of form properties should be here */
  });

  useEffect(() => {
    if (!allCompanies) return;
    const findCompanyById = allCompanies?.findIndex(
      (company) => company?._id === query.get("company_id")
    );
    const indexOfSelectedCompany = findCompanyById === -1 ? 0 : findCompanyById;
    if (allCompanies[indexOfSelectedCompany]?._id)
      setForm((prev) => ({
        ...prev,
        company: allCompanies[indexOfSelectedCompany]?._id,
      }));
  }, [allCompanies]);

  const handleFormSubmit = async () => {
    const addemployeeurl = `${import.meta.env.VITE_BASE_URL}`;
    if (formData.role !== "NORMAL" && formData.manages.length < 1) {
      toast(formatMessage({ id: "employer.addbranch" }), {
        position: "top-right",
        type: "error",
        theme: "colored",
      });
    } else if (formData?.phone === "") {
      toast(formatMessage({ id: "employer.validphone" }), {
        position: "top-right",
        type: "error",
        theme: "colored",
      });
    } else {
      setSaveLoading(true);
      try {
        let postData = {
          ...formData,
          phone: `${formData.countryCode}${formData.phone}`,
        };

        const result = await axios.post(`${addemployeeurl}/employers`, postData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (result) {
          setSaveLoading(false);
          // toast logic
          const message = "Employer added successfully!";
          toast(formatMessage({ id: "response.employer.add" }), {
            position: "top-right",
            type: "success",
            theme: "colored",
          });
          navigate("/employer");
        }
      } catch (error) {
        setSaveLoading(false);
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
    }
  };
  /* Form Logic */

  return (
    <>
      <Box mt={{ xs: 0, sm: "32px" }} sx={{ padding: "0 35px" }}>
        <Typography variant="h4" color={"var(--color-dark-blue)"} textAlign={'center'} fontWeight={600} padding={'0 0 2rem 0'}>{formatMessage({ id: "filter.addanewemployer" })}</Typography>
        <Grid container spacing={3}>
          <Grid item xs={0} md={2} />

          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  value={formData.firstName}
                  label={formatMessage({ id: "employer.firstname" })}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                  fullWidth
                  margin="dense"
                  inputProps={{ maxLength: 200 }}
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
                  inputProps={{ maxLength: 200 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    {
                      <BasicSelect
                        margin="dense"
                        formControlProps={{ fullWidth: true, margin: "dense" }}
                        label={formatMessage({ id: "employer.country" })}
                        value={
                          formData.countryCode || supportedCountries[0].code
                        }
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
                    }
                  </Grid>
                  <Grid item xs={8}>
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
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label={formatMessage({ id: "employer.email" })}
                  autoComplete="off"
                  value={formData.email}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                    setFormValidData((prev) => ({
                      ...prev,
                      isValidEmail: isEmail(
                        `${e.target.value}`
                      ),
                    }));
                  }}
                  error={!formValidData.isValidEmail}
                  helperText={
                    !formValidData.isValidEmail &&
                    formatMessage({ id: "common.invalid_email" })
                  }
                  fullWidth
                  margin="dense"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <BasicSelect
                  margin="dense"
                  formControlProps={{ fullWidth: true, margin: "dense" }}
                  label={formatMessage({ id: "employer.role" })}
                  value={formData.role}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      role: e.target.value,
                    }))
                  }
                >
                  <MenuItem value={"NORMAL"}>
                    {formatMessage({ id: "employer.normal" })}
                  </MenuItem>
                  <MenuItem value={"MANAGER"}>
                    {formatMessage({ id: "employer.manager" })}
                  </MenuItem>
                </BasicSelect>
              </Grid>

              {formData.role === "MANAGER" && (
                <Grid item xs={12} sm={8}>
                  <Autocomplete
                    multiple
                    margin="dense"
                    options={allCompanies}
                    getOptionLabel={(option) => option?.name}
                    // filterSelectedOptions
                    onChange={(e, companies) => {
                      const selected_ids = companies.map(
                        (company) => company._id
                      );
                      setForm((prev) => ({
                        ...prev,
                        manages: selected_ids,
                      }));
                    }}
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

              {formData.role === "NORMAL" && (
                <Grid item xs={12} sm={8}>
                  <BasicSelect
                    margin="dense"
                    formControlProps={{ fullWidth: true, margin: "dense" }}
                    label={formatMessage({ id: "employer.company" })}
                    value={formData.company}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, company: e.target.value }))
                    }
                  >
                    {allCompanies.map((company, i) => (
                      <MenuItem key={company._id} value={company._id}>
                        {" "}
                        {company.name}
                      </MenuItem>
                    ))}
                  </BasicSelect>
                </Grid>
              )}
              <Grid item xs={0} sm={4} />

              <Grid item xs={12} sm={4} mt={{ xs: 0, sm: 3 }}>
                <Button
                  text={formatMessage({ id: "employer.save" })}
                  loading={saveLoading}
                  onClick={handleFormSubmit}
                />
              </Grid>

              <Grid item xs={0} sm={4} />
            </Grid>
          </Grid>

          <Grid item xs={0} md={2} />
        </Grid>
      </Box>
    </>
  );
};

export default AddEmployer;
