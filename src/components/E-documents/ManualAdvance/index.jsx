import React from "react";
import EdocsUpload from "../EdocsUpload";

import { useLocale } from "../../../locales";
import { Button, TextField } from "../../UI";
import { Autocomplete, Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import { getEmployees } from "../../../api";

const ManualAdvance = () => {
  const { formatMessage } = useLocale();
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [file, setFile] = useState([]);

  const searchUsers = async (event, text) => {
    if (text.length === 2) {
      const data = await getEmployees(1, 100, `searchQuery=${text}`);
      setUsers(data?.docs);
    } else {
      const filteredUsers = users.filter((user) => {
        const userName = `${user.firstName} ${user.lastName}`;
        return userName.toLowerCase().includes(text.toLowerCase());
      });
      setUsers(filteredUsers);
    }
  };
  return (
    <Dialog
      open={true}
      onClose={() => {}}
      sx={{
        "& .MuiDialog-paper": { width: "100%" },
      }}
      maxWidth="md"
    >
      <DialogContent
        sx={{
          padding: "15px",
          display: "flex",
          gap: "19px",
          flexDirection: "column",
        }}
      >
        <EdocsUpload setFile={setFile} file={file}>
          <hr />
          <div>
            <span style={{ fontSize: "16px" }}>Enter Employees Names</span>
            <p style={{ fontSize: "13px" }}>
              The system will automatically identify the employees names after
              writing them
            </p>
          </div>
          <Autocomplete
            sx={{
              "& .MuiChip-root": {
                backgroundColor: "var(--color-dark-blue)",
                color: "#fff",
                borderRadius: "8px",
              },
              "& .MuiSvgIcon-root": {
                color: "#fff !important",
              },
              "& .MuiAutocomplete-inputRoot": { flexWrap: "nowrap" },
              background: "none",
              marginTop: "8px",
              marginBottom: "8px",
            }}
            onInputChange={searchUsers}
            multiple
            aria-multiline
            onChange={(_, value) => setSelected(value)}
            id="multiple-limit-tags"
            value={selected}
            options={users}
            getOptionLabel={(option) =>
              `${option?.firstName} ${option?.lastName}`
            }
            renderInput={(params) => (
              <TextField {...params} label="Employee Name " />
            )}
          />
          <Button text="Next" />
        </EdocsUpload>
      </DialogContent>
    </Dialog>
  );
};

export default ManualAdvance;
