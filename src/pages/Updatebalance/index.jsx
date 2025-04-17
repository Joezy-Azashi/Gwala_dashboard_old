import React, { useState } from 'react'
import { Box, Grid, Autocomplete, MenuItem } from "@mui/material";
import { useLocale } from '../../locales';
import { BasicSelect, Button, TextField } from '../../components/UI';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import UploadEmployeeBalances from './UploadEmployeeBalances';

function UpdateBalance() {
  const { formatMessage } = useLocale();
  const url = `${import.meta.env.VITE_BASE_URL}`;
  const token = localStorage.getItem("token");

  const [visibleModal, setVisibleModal] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);
  const [ids, setIds] = useState([])
  const [allCompanies, setAllCompanies] = useState([]);
  const [companyID, setCompanyID] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [clearAutoCom, setClearAutoCom] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`${url}/account/users?companyId=${companyID}&limit=1000`, {
          // we need a route without pagination (easy fix from backend)
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAllEmployees(result?.data?.data?.docs);
      } catch (error) {
        setAllEmployees([]);
      }
    };
    fetchData();
  }, [companyID]);

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
        setAllCompanies(resultCompanies);
      } catch (error) {
        setAllCompanies([]);
      }
    };
    fetchData();
  }, [false]);

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const result = await axios.patch(`${url}/v2/account/balance`, { employeeIds: ids, amount }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast(formatMessage({ id: "employee.success" }), {
        position: "top-right",
        theme: "colored",
        type: "success",
      });
      setIds([])
      setAmount("")
      setClearAutoCom(!clearAutoCom)
      setLoading(false)
    } catch (error) {
      toast(error?.response?.data?.message, {
        position: "top-right",
        theme: "colored",
        type: "error",
      });
      setLoading(false)
    }
  }

  return (
    <Box sx={{ padding: "2rem 35px" }}>
      <Grid container spacing={3}>
        <Grid item xs={0} md={9} />
        <Grid item xs={0} md={3} >
          <Button
            text={formatMessage({ id: "employee.upload.button" })}
            bgColor={"var(--color-dark-blue)"}
            color={"#FFF"}
            onClick={() => setVisibleModal(true)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} pt={3}>
        <Grid item xs={0} md={3} />
        <Grid item xs={12} md={6}>
          <BasicSelect
            margin="dense"
            formControlProps={{ fullWidth: true, margin: "dense" }}
            label={formatMessage({ id: "employee.companylabel" })}
            value={companyID}
            onChange={(e) => setCompanyID(e.target.value)}
          >
            {allCompanies.map((company, i) => (
              <MenuItem key={company._id} value={company._id} style={{ textTransform: "capitalize" }}>
                {" "}
                {company.name}
              </MenuItem>
            ))}
          </BasicSelect>

          <Autocomplete
            key={clearAutoCom}
            multiple
            disabled={companyID === ""}
            margin="dense"
            options={allEmployees}
            getOptionLabel={(option) => option?.firstName + " " + option?.lastName}
            onChange={(e, employees) => {
              const employeeIds = employees.map(
                (employee) => employee._id
              );
              setIds(
                employeeIds
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="dense"
                label={formatMessage({ id: "employee.employeelabel" })}
                placeholder={formatMessage({ id: "nav.search" })}
                error={companyID === "" ? true : false}
                helperText={companyID === "" ? formatMessage({ id: "employee.helpertext" }) : ""}
              />
            )}
            sx={{ margin: "20px 0" }}
          />

          <TextField
            value={amount}
            label={formatMessage({ id: "employee.amountlabel" })}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="dense"
            inputProps={{ maxLength: 200 }}
          />
        </Grid>
        <Grid item xs={0} md={3} />
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center" }} mt={8}>
        <Box sx={{ width: "20rem" }}>
          <Button
            text={formatMessage({ id: "employee.submitbal" })}
            loading={loading}
            onClick={handleSubmit}
          />
        </Box>
      </Box>
      <UploadEmployeeBalances
        open={visibleModal}
        onClose={() => setVisibleModal(false)}
      />
    </Box>
  )
}

export default UpdateBalance