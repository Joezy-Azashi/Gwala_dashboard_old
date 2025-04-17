import React, { useEffect, useState } from "react";
import { useLocale } from "../../locales";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "../UI";
import * as XLSX from "xlsx";
import Dropzone from "react-dropzone";
import axios from "axios";
import { BasicSelect } from "../UI";
import MenuItem from "@mui/material/MenuItem";
import { useSelector } from "react-redux";

import { toast } from "react-toastify";
import { FieldB } from "../../pages/employee/style";

const AddEmployeesViaExcel = () => {
  const token = localStorage.getItem("token");
  const url = `${import.meta.env.VITE_BASE_URL}`;
  /* user Selector logic */
  const userInfos = useSelector((state) => state.userInfos);
  const isEmployer = userInfos?.role === "Employer";
  /* user Selector logic */
  /* Comanies Fetch Logic */
  const [allCompanies, setAllCompanies] = useState([]);
  const [company, setCompany] = useState({});
  const [companyId, setCompanyId] = useState("")
  const { formatMessage } = useLocale();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`${url}/companies?limit=1000`, {
          // we need a route without pagination (easy fix from backend)
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAllCompanies(result.data?.data?.docs || []);
      } catch (error) {
        setAllCompanies([]);
      }
    };
    !isEmployer && fetchData();
  }, [false]);

  /* Comanies Fetch Logic */

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setCompanyId("");
    setCompany({});
    setFile(null);
    setFileSize(null);
    setXlData({});
    setSheetName("");
  };

  /* file drop handler */
  const [file, setFile] = useState(null);
  const [fileSize, setFileSize] = useState(null);
  const [xlData, setXlData] = useState({});
  const handleFileDrop = (acceptedFiles) => {
    if (acceptedFiles.length) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        setXlData(workbook);
        setFile(acceptedFiles[0]);
        setFileSize(acceptedFiles[0].size);
      };
      reader.readAsBinaryString(acceptedFiles[0]);
    }
  };
  /* file drop handler */

  /* excel sheet name handler */
  const [sheetName, setSheetName] = useState("");
  useEffect(() => {
    if (xlData.hasOwnProperty("SheetNames")) {
      setSheetName(xlData?.SheetNames[0]);
    }
  }, [xlData]);
  /* excel sheet name handler */

  /** file upload handler */
  const handleFileUpload = async () => {
    if ((userInfos?.manages?.length > 0 || userInfos?.role === "Admin") && companyId === "") {
      toast(formatMessage({ id: "employee.helpertext" }), {
        theme: "colored",
        type: "error",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("list", file);
      if (!formData.has("list")) throw new Error("Please select a file");
      const result = await axios.post(
        `${url}/register/employees/excel?companyId=${userInfos?.manages?.length > 0 || userInfos?.role === "Admin" ? companyId : userInfos?._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (result) {
        // toast logic
        const message = "Employees are added successfully!";
        toast(message, {
          position: "top-right",
          type: "success",
          theme: "colored",
        });
      }
    } catch (error) {
      // toast logic
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong.";
      toast(message, {
        position: "top-right",
        autoClose: 5000,
        type: "error",
        theme: "colored",
      });
    } finally {
      setFile(null);
      setOpen(false);
      setCompany({})
      setCompanyId("")
      setSheetName("")
      setFileSize(null)
    }
  };

  /** file upload handler */

  return (
    <div>
      <FieldB style={{ width: "100%" }} onClick={handleClickOpen}>
        {formatMessage({ id: "filter.addExcel" })}
      </FieldB>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          backdropFilter: "blur(5px) sepia(5%)",
        }}
        PaperProps={{ sx: { borderRadius: "22px" } }}
      >
        <DialogTitle id="alert-dialog-title">
          <h3>{formatMessage({ id: "employee.upload.uploadviaexcel" })}</h3>
        </DialogTitle>
        <DialogContent>
          {!isEmployer ? (
            <BasicSelect
              formControlProps={{ fullWidth: true, margin: "dense" }}
              label="Company"
              value={companyId}
              onChange={(e) => {
                setCompanyId(e.target.value)
                setCompany((prev) => {
                  return (allCompanies.find(el => el._id === e.target.value))
                })
              }
              }
            >
              {allCompanies.map((el) => (
                <MenuItem key={el._id} value={el._id}>
                  {el.name}
                </MenuItem>
              ))}
            </BasicSelect>
          ) :
            userInfos?.manages?.length > 0 ?
              <BasicSelect
                formControlProps={{ fullWidth: true, margin: "dense" }}
                label="Company"
                value={companyId}
                onChange={(e) => {
                  setCompanyId(e.target.value)
                  setCompany((prev) => {
                    return (allCompanies.find(el => el._id === e.target.value))
                  })
                }
                }
              >
                {userInfos?.manages.map((el) => {
                  return (
                    < MenuItem key={el._id} value={el._id} >
                      {el.name}
                    </MenuItem>
                  )
                })}
              </BasicSelect> : ""
          }
          <DialogContentText id="alert-dialog-description">
            <ul style={{ padding: 15 }}>
              <li>
                <a href={userInfos?.role === "Admin" ? "/exampleGwalaExcel.xlsx" : "/exampleEmployerGwalaExcel.xlsx"} download>
                  {formatMessage({ id: "employee.upload.bullet1" })}
                </a>
              </li>
              <li>{formatMessage({ id: "employee.upload.bullet2" })}</li>
              <li>{formatMessage({ id: "employee.upload.bullet3" })}</li>
            </ul>
          </DialogContentText>
          <div>
            <Dropzone onDrop={handleFileDrop}
              accept={{
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"]
              }}
              maxFiles={1}>
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  style={{
                    border: "2px solid var(--color-dark-blue)",
                    backgroundColor: "var(--color-white)",
                    color: "var(--color-dark-blue)",
                    padding: 10,
                    borderRadius: 0,
                    cursor: "pointer",
                  }}
                >
                  <input {...getInputProps()} />
                  <p>
                    {sheetName ||
                      formatMessage({ id: "employee.upload.drop" })}
                  </p>
                  {fileSize && <p>File size: {fileSize / 1024} KB</p>}
                </div>
              )}
            </Dropzone>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            text={"Close"}
            color={"var(--color-blue)"}
            bgColor={"var(--color-dark-blue)"}
            onClick={handleClose}
          />
          {file && (
            <Button
              text={"Upload"}
              color={"var(--color-dark-blue)"}
              bgColor={"var(--color-blue)"}
              onClick={handleFileUpload}
              autoFocus
            />
          )}
        </DialogActions>
      </Dialog>
    </div >
  );
};

export default AddEmployeesViaExcel;
