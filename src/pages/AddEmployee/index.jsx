import React, { useEffect, useState } from "react";
import Button from "../../components/UI/Button";
import SideContainer from "../../containers/SideContainer";
import CountryList from "country-list-with-dial-code-and-flag";
import axios from "axios";
import { toast } from "react-toastify";
import TextField from "../../components/UI/TextField";
import MenuItem from "@mui/material/MenuItem";
import { BasicSelect } from "../../components/UI";
import { useSelector } from "react-redux";
import { Box, Grid, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { useLocale } from "../../locales";
import useQuery from "../../hooks/useQuery";
import isEmail from "validator/lib/isEmail";

const phoneNumberRegex =
  /^(0|\+212|00212|001|00216|00233|\+1|\+216|\+233)\d{9}$/;
const ribNumberRegex = /^\d{24}$/;
const salaryNumberRegex = /^(1000|[1-9]\d{2,5})(\.\d{1,2})?$/;
const supportedCountries = ["MA", "US", "TN", "GH"].map((code) =>
  CountryList.findOneByCountryCode(code)
);

const AddEmployee = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const token = localStorage.getItem("token");
  const query = useQuery();
  const { formatMessage } = useLocale();
  const [companyData, setCompanyData] = useState("")
  const url = `${import.meta.env.VITE_BASE_URL}`;
  const [saveLoading, setSaveLoading] = useState(false);
  /* user Selector logic */
  const userInfos = useSelector((state) => state.userInfos);
  const isEmployer = userInfos?.role === "Normal";
  const isAdmin = userInfos?.role === "Admin";
  const isEmployerWithManager = userInfos?.manages?.length;

  const EmployerCompanyId = userInfos?.company?._id;

  /* user Selector logic */

  /* Comanies Fetch Logic */
  const [allCompanies, setAllCompanies] = useState(null);

  useEffect(() => {
    const fetchDataAdmin = async () => {
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
    if (isAdmin) {
      fetchDataAdmin();
      return;
    }
    if (isEmployerWithManager) {
      setAllCompanies(userInfos?.manages);
      return;
    }
  }, [isAdmin, isEmployerWithManager]);

  const defaultFormAdvance = {
    firstName: "",
    lastName: "",
    // email: "", // needs to be added in v2
    company: location?.state?.id || "",
    countryCode: "+212", // default
    phone: "",
    // salary: "",
    startedDate: "",
    address: "",
    cni: "",
    // rib: "",
  };

  /* Comanies Fetch Logic */

  /* Form Logic */
  const [formData, setForm] = useState();

  useEffect(() => {
    setForm(defaultFormAdvance)
  }, [userInfos])

  /* Form Valid Logic */
  const [formValidData, setFormValidData] = useState({
    isValidPhone: "init",
    isValidRIB: "init",
    isValidSalary: "init",
    isValidEmail: "init",
    /* ... rest of form properties should be here */
  });

  useEffect(() => {
    if (!allCompanies) return;
    const findCompanyById = allCompanies?.findIndex(
      (company) => company?._id === query.get("company_id")
    );
    const indexOfSelectedCompany = findCompanyById === -1 ? 0 : findCompanyById;
    // setForm((prev) => ({
    //   ...prev,
    //   company: allCompanies[indexOfSelectedCompany]._id,
    // }));
  }, [allCompanies]);

  const handleFormSubmit = async () => {
    if ((userInfos?.manages?.length || userInfos?.role === "Admin") && formData?.company === "") {
      toast(formatMessage({ id: "employee.helpertext" }), {
        theme: "colored",
        type: "error",
      });
      return
    }

    if((companyData?.features?.includes("ALL") || companyData?.features?.includes("DEFAULT")) && (formData?.rib === undefined || formData?.rib === "")){
      toast(formatMessage({ id: "employee.ribrequired" }), {
        theme: "colored",
        type: "error",
      });
      return
    }

    setSaveLoading(true);
    try {
      if (formData?.salary && (companyData?.features?.includes("ALL") || companyData?.features?.includes("DEFAULT"))) formData.salary = formData?.salary
      if (formData?.rib && (companyData?.features?.includes("ALL") || companyData?.features?.includes("DEFAULT"))) formData.rib = formData?.rib
      const postData = {
        ...formData,
        phone: `${formData.countryCode}${formData.phone}`,
      };
      const result = await axios.post(
        `${url}/register/employees/single?companyId=${isEmployerWithManager || userInfos?.role === "Admin" ? postData.company : EmployerCompanyId}`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (result) {
        // toast logic

        toast(formatMessage({ id: "response.employee.add" }), {
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
        setSaveLoading(false);
        navigate("/employee");
        setCompanyData("")
      }
    } catch (error) {
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
      setSaveLoading(false);
    }
  };
  /* Form Logic */

  // Disable save button
  const disableButton = () => {
    if (
      formData?.firstName === "" ||
      formData?.lastName === "" ||
      // formData.email === "" ||
      formData?.phone === "" ||
      ((userInfos?.manages?.length || userInfos?.role === "Admin") && formData?.company === "")
      // formData?.salary === "" ||
      // formData?.rib?.length < 24 && formData?.rib?.length > 0
    ) {
      return true
    } else {
      return false
    }
  }

  return (
    <>
      <Box mt={{ xs: 0, sm: "32px" }} sx={{ padding: "0 35px" }}>
        <Typography variant="h4" color={"var(--color-dark-blue)"} textAlign={'center'} fontWeight={600} padding={'0 0 2rem 0'}>{formatMessage({ id: "filter.addanewemployee" })}</Typography>
        <Grid container spacing={3}>
          <Grid item xs={0} md={2} />

          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  defaultValue={formData?.firstName}
                  label={formatMessage({ id: "employee.firstname" })}
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
                  label={formatMessage({ id: "employee.lastname" })}
                  value={formData?.lastName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                  fullWidth
                  margin="dense"
                  inputProps={{ maxLength: 200 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label={formatMessage({ id: "employee.mail" })}
                  value={formData?.email}
                  onChange={(e) => {
                    setFormValidData((prev) => ({
                      ...prev,
                      isValidEmail: isEmail(`${e.target.value}`),
                    }));
                    setForm((prev) => ({ ...prev, email: e.target.value }));
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

              {!isEmployer && Array.isArray(allCompanies) && (
                <Grid item xs={12} sm={6}>
                  <BasicSelect
                    formControlProps={{ fullWidth: true, margin: "dense" }}
                    label={formatMessage({ id: "employee.company" })}
                    value={formData?.company}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, company: e.target.value }))
                    }
                  >
                    {allCompanies.map((company) => (
                      <MenuItem
                        sx={{ textTransform: "capitalize" }}
                        key={company._id}
                        value={company._id}
                        onClick={() => setCompanyData(company)}
                      >
                        {company.name}
                      </MenuItem>
                    ))}
                  </BasicSelect>
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <BasicSelect
                      margin="dense"
                      formControlProps={{ fullWidth: true, margin: "dense" }}
                      label={formatMessage({ id: "employee.country" })}
                      value={formData?.countryCode || supportedCountries[0]?.code}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          countryCode: e.target.value,
                        }))
                      }
                    >
                      {supportedCountries?.map((country, i) => (
                        <MenuItem key={i} value={country?.dial_code}>
                          {" "}
                          {country.flag}
                          {` ${country?.code}`}
                          {` (${country?.dial_code})`}
                        </MenuItem>
                      ))}
                    </BasicSelect>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      label={formatMessage({ id: "employee.phone" })}
                      value={formData?.phone}
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
                  label={formatMessage({ id: "employee.hiring" })}
                  value={formData?.startedDate || new Date().getDate()}
                  type="date"
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      startedDate: e.target.value,
                    }))
                  }
                  fullWidth
                  inputProps={{ max: new Date().toISOString().split("T")[0] }}
                  margin="dense"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label={formatMessage({ id: "employee.address" })}
                  value={formData?.address}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, address: e.target.value }))
                  }
                  fullWidth
                  margin="dense"
                  inputProps={{ maxLength: 500 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label={"CIN"}
                  value={formData?.cni}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, cni: e.target.value }))
                  }
                  inputProps={{ maxLength: 50 }}
                  fullWidth
                  margin="dense"
                />
              </Grid>

              {companyData?.features?.includes("ALL") ||
                companyData?.features?.includes("DEFAULT") ?
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={formatMessage({ id: "employee.salaire" })}
                    value={formData?.salary}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, salary: e.target.value }));
                      setFormValidData((prev) => ({
                        ...prev,
                        isValidSalary: salaryNumberRegex.test(
                          `${e.target.value}`
                        ),
                      }));
                    }}
                    error={!formValidData.isValidSalary}
                    helperText={
                      !formValidData.isValidSalary &&
                      formatMessage({ id: "common.invalid_salary" })
                    }
                    fullWidth
                    margin="dense"
                  />
                </Grid> : ""}

              {companyData?.features?.includes("ALL") ||
                companyData?.features?.includes("DEFAULT") ?
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={"RIB"}
                    value={formData?.rib}
                    inputProps={{ maxLength: 24 }}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, rib: e.target.value }));
                      setFormValidData((prev) => ({
                        ...prev,
                        isValidRIB: ribNumberRegex.test(`${e.target.value}`),
                      }));
                    }}
                    error={!formValidData.isValidRIB}
                    helperText={
                      !formValidData.isValidRIB &&
                      formatMessage({ id: "common.invalid_rib" })
                    }
                    fullWidth
                    margin="dense"
                  />
                </Grid>
                : ""}

              <Grid item xs={12} sm={12} />
              <Grid item xs={0} sm={2} />
              <Grid item xs={12} sm={4} mb={3}>
                <Button
                  disable={disableButton()}
                  text={formatMessage({ id: "employee.save" })}
                  loading={saveLoading}
                  onClick={handleFormSubmit}
                />
              </Grid>
              <Grid item xs={12} sm={4} mb={3}>
                <Button
                  color={"#fff"}
                  bgColor={"var(--color-danger)"}
                  text={formatMessage({ id: "employee.cancel" })}
                  onClick={() => {
                    navigate("/employee");
                  }}
                />
              </Grid>

              <Grid item xs={0} sm={2} />
            </Grid>
          </Grid>

          <Grid item xs={0} md={2} />
        </Grid>
      </Box>
    </>
  );
};

export default AddEmployee;
