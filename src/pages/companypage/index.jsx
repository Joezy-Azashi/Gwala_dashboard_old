import React, { useEffect, useState } from "react";
import { Box, Grid, MenuItem } from "@mui/material";
import { useLocale } from "../../locales";
import { BasicSelect, Redirect, Button, TextField } from "../../components/UI";
import { useSelector } from "react-redux";
import axios from "../../api/request";
import { toast } from "react-toastify";

function CompanyPage() {
  const company = useSelector((state) => state.userInfos.company);
  const selectedUserState = useSelector((state) => state.userInfos);
  const [companyData, setCompany] = useState({ isAdvanceEnabled: false, monetizationMethod: "FEES_PER_ADVANCE", advanceType: "AUTOMATIC" });
  const [saveLoading, setLoading] = useState(false);
  const role = localStorage.getItem("role");
  const { formatMessage } = useLocale();
  const updateCompany = async () => {
    setLoading(true);
    const result = await axios.patch("/v2/companies/current", companyData);
    if (result?.status === "success")
      toast(formatMessage({ id: "response.company.edited" }), {
        position: "top-right",
        theme: "colored",
        type: "success",
      });
    setLoading(false);
  };
  useEffect(() => {
    setCompany(company);
  }, [company]);
  return (
    <Box mt={{ xs: 0, sm: "32px" }} sx={{ padding: "0 35px" }}>
      <Grid container spacing={3}>
        <Grid item xs={0} md={2} />

        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label={formatMessage({ id: "settings.enterprise" })}
                fullWidth
                margin="dense"
                value={companyData?.name}
                InputLabelProps={{ shrink: true }}
                onChange={(e) =>
                  setCompany({ ...company, name: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label={formatMessage({ id: "settings.phone" })}
                type={"tel"}
                fullWidth
                margin="dense"
                value={companyData?.phone}
                InputLabelProps={{ shrink: true }}
                onChange={(e) =>
                  setCompany({ ...company, phone: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label={formatMessage({ id: "settings.address" })}
                fullWidth
                margin="dense"
                value={companyData?.address}
                InputLabelProps={{ shrink: true }}
                onChange={(e) =>
                  setCompany({ ...company, address: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <BasicSelect
                margin="dense"
                formControlProps={{ fullWidth: true, margin: "dense" }}
                label={formatMessage({ id: "settings.advances" })}
                inputProps={{
                  name: formatMessage({ id: "settings.advances" }),
                }}
                value={companyData?.isAdvanceEnabled}
                onChange={(e) =>
                  setCompany({ ...company, isAdvanceEnabled: e.target.value })
                }
              >
                <MenuItem value={true}>
                  {formatMessage({ id: "settings.active" })}
                </MenuItem>
                <MenuItem value={false}>
                  {formatMessage({ id: "settings.inactive" })}
                </MenuItem>
              </BasicSelect>
            </Grid>

            <Grid item xs={12} sm={6}>
              <BasicSelect
                margin="dense"
                formControlProps={{ fullWidth: true, margin: "dense" }}
                label={formatMessage({ id: "settings.monetization" })}
                inputProps={{
                  name: formatMessage({ id: "settings.advances" }),
                }}
                disabled
                value={companyData?.monetizationMethod}
                onChange={(e) =>
                  setCompany({ ...company, monetizationMethod: e.target.value })
                }
              >
                <MenuItem value={"SUBSCRIPTION"}>
                  {formatMessage({ id: "company.subscription" })}
                </MenuItem>
                <MenuItem value={"FEES_PER_ADVANCE"}>
                  {formatMessage({ id: "company.fees_per_advance" })}
                </MenuItem>
                <MenuItem value={"PAYED_BY_COMPANY"}>
                  {formatMessage({ id: "company.payed_by_company" })}
                </MenuItem>
              </BasicSelect>
            </Grid>

            <Grid item xs={12} sm={6}>
              <BasicSelect
                margin="dense"
                formControlProps={{ fullWidth: true, margin: "dense" }}
                label={formatMessage({ id: "settings.advanceapproval" })}
                value={companyData?.advanceType}
                onChange={(e) =>
                  setCompany({ ...company, advanceType: e.target.value })
                }
              >
                <MenuItem value="AUTOMATIC">
                  {formatMessage({ id: "settings.automatic" })}
                </MenuItem>
                <MenuItem value="BY_PROMPT">
                  {formatMessage({ id: "settings.manual" })}
                </MenuItem>
              </BasicSelect>
            </Grid>

            {selectedUserState?.manages?.length > 0 &&
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
                <Redirect
                  text={formatMessage({ id: "nav.admins" })}
                  link={"/employer"}
                />
              </Grid>
            }

            <Grid
              item
              xs={12}
              sm={selectedUserState?.manages?.length > 0 ? 4 : 6}
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <Redirect
                text={formatMessage({ id: "company.employees" })}
                link={"/employee"}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={selectedUserState?.manages?.length > 0 ? 4 : 6}
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <Redirect
                text={formatMessage({ id: "settings.advances" })}
                link={"/transaction"}
              />
            </Grid>

            <Grid item xs={0} sm={4} />

            <Grid item xs={12} sm={4} mt={{ xs: 0, sm: 3 }}>
              <Button
                text={formatMessage({ id: "company.save" })}
                loading={saveLoading}
                onClick={updateCompany}
              />
            </Grid>

            <Grid item xs={0} sm={4} />
          </Grid>
        </Grid>

        <Grid item xs={0} md={2} />
      </Grid>
    </Box>
  );
}

export default CompanyPage;
