import React, { useState } from "react";
import { getEmployees } from "../../../api";
import { Container } from "./style";
import { Autocomplete } from "@mui/material";
import { TextField } from "../../UI";
const Input = ({ name, index, onClick, error }) => {
  const [active, setActive] = useState(false);
  const [userName, setName] = useState(name);
  const [Users, setUsers] = useState([]);
  const searchUsers = async (_, text) => {
    if (text.length >= 2) {
      const data = await getEmployees(1, 100, `searchQuery=${text}`);
      setUsers(data?.docs);
    }
  };
  const onChange = (value) => {
    onClick(index, value);
    setName(value);
  };
  return (
    <Container
      onClick={() => setActive(true)}
      border={error && "1px solid #FA3E3E"}
    >
      {!active ? (
        <span>{`${name.firstName} ${name.lastName}`}</span>
      ) : (
        <div style={{ width: "100%" }}>
          <Autocomplete
            sx={{
              "& .MuiChip-root": {
                backgroundColor: "var(--color-dark-blue)",
                color: "#fff",
                borderRadius: "8px",
                border: "none",
              },
              "& .MuiSvgIcon-root": {
                color: "#fff !important",
                border: "none",
              },
              "& .MuiAutocomplete-inputRoot": { flexWrap: "nowrap" },
              background: "none",
              marginTop: "8px",
              marginBottom: "8px",
              border: "none",
            }}
            onInputChange={searchUsers}
            onChange={(_, value) => onChange(value)}
            id="multiple-limit-tags"
            options={Users}
            getOptionLabel={(option) =>
              `${option?.firstName} ${option?.lastName} ${
                option?.phone?.number || ""
              }`
            }
            value={userName}
            renderInput={(params) => <TextField {...params} label="" />}
            onBlur={() => setActive(false)}
          />
        </div>
      )}
    </Container>
  );
};

export default Input;

{
  /* <input
  style={{
    border: "2px solid #002B69",
  }}
  value={userName}
  onChange={(e) => searchUsers(e.target.value)}
  onFocus={() => setInputFocused(true)}
  // onBlur={() => {
  //   setInputFocused(false);
  //   setActive(false);
  // }}
/>
{Users.length > 0 && (
  <Option isFocused={isInputFocused}>
    {Users?.map((el) => (
      <div
        className="sugguest"
        onClick={() => {
          onClick(index, el);
          setActive(false);
        }}
      >
        <div
          style={{ fontSize: "14px" }}
        >{`${el.firstName} ${el.lastName}`}</div>
        <div style={{ fontSize: "12px" }}>({el.phone.number})</div>
      </div>
    ))}
  </Option>
)} */
}
