import React, { useState } from "react";
import { ContFilter, Field } from "../../components/employee/style";
import { useLocation, useNavigate } from "react-router";
import { useLocale } from "../../locales";
import { Autocomplete, MenuItem, Typography } from "@mui/material";
import { TextField } from "../../components/UI";
import { getCompanies, getEmployees } from "../../api";
const INITIAL_FILTER = {
  employee: "",
  branch: "",
  sort: 1,
};
const RightSide = ({ filter, setFilter }) => {
  const { formatMessage } = useLocale();
  const { data } = getCompanies();
  const [allUsers, setUsers] = useState([]);
  const searchUsers = async (text) => {
    if (text.length === 2) {
      const data = await getEmployees(1, 100, `searchQuery=${text}`);
      setUsers(data?.docs);
    } else {
      const filteredUsers = allUsers.filter((user) => {
        const userName = `${user.firstName} ${user.lastName}`;
        return userName.toLowerCase().includes(text.toLowerCase());
      });
      setUsers([...filteredUsers]);
    }
  };
  return (
    <>
      <ContFilter>
        <Typography
          variant="body2"
          sx={{
            textDecoration: "underline",
            cursor: "pointer",
            fontWeight: "bold",
            textAlign: "center",
          }}
          onClick={() => setFilter(INITIAL_FILTER)}
        >
          {formatMessage({ id: "employee.clearfilter" })}
        </Typography>
        <Autocomplete
          sx={{
            "& .MuiOutlinedInput-root": {
              background: "#fff",
              borderRadius: "50px",
              backgroundColor: "var(--color-blue)",
            },
            "& fieldset": { border: "none" },
            "& .MuiFormLabel-root": {
              color: "var(--color-dark-blue) !important",
              fontWeight: "600",
              fontSize: "15px",
              textTransform: "capitalize",
            },
          }}
          size="small"
          InputLabelProps={{ shrink: false }}
          fullWidth
          options={allUsers}
          getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
          renderInput={(params) => (
            <TextField
              {...params}
              label={formatMessage({ id: "reimbursements.search" })}
            />
          )}
          onChange={(_, value, reason) => {
            if (reason === "clear") {
              setFilter(INITIAL_FILTER);
              return;
            } else {
              setFilter({
                ...filter,
                employee: value,
              });
            }
          }}
          onInputChange={(_, value, reason) => {
            if (reason === "clear") {
              setFilter(INITIAL_FILTER);
              return;
            } else {
              searchUsers(value);
            }
          }}
        />

        <TextField
          select
          sx={{
            "& .MuiOutlinedInput-root": {
              background: "#fff",
              borderRadius: "50px",
              backgroundColor: "var(--color-blue)",
            },
            "& fieldset": { border: "none" },
            "& .MuiFormLabel-root": {
              color: "var(--color-dark-blue) !important",
              fontWeight: "600",
              fontSize: "15px",
              textTransform: "capitalize",
            },
          }}
          size="small"
          label={
            filter.branch === "" ? formatMessage({ id: "advance.branch" }) : ""
          }
          value={filter.branch}
          onChange={(e) => setFilter({ ...filter, branch: e.target.value })}
          InputLabelProps={{ shrink: false }}
          fullWidth
        >
          {data != undefined &&
            data?.map((el, index) => {
              return (
                <MenuItem
                  key={index}
                  value={el?.name}
                  style={{ textTransform: "capitalize" }}
                >
                  {el?.name}
                </MenuItem>
              );
            })}
        </TextField>
        {/* 
        <Field onClick={() => setFilter({ ...filter, sort: -filter.sort })}>
          <span>{formatMessage({ id: "edoc.sort" })}</span>
          <img src="/icons/Employee/filter.svg" />
        </Field> */}
      </ContFilter>
    </>
  );
};

export default RightSide;
