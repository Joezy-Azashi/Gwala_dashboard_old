import React, { useEffect } from "react";
import EdocsUpload from "../EdocsUpload";
import { Button, TextField } from "../../UI";
import { useState } from "react";
import { Autocomplete, Chip, DialogContent } from "@mui/material";
import { useLocale } from "../../../locales";
import { getEmployees, getEmployers } from "../../../api";
import axios from "../../../api/request";
import FormData from "form-data";
import { toast } from "react-toastify";
import UploadNewOne from "./UploadNewOne";
import { useSelector } from "react-redux";
const INITIAL_STATE = {
  title: "",
  employee: {
    firstName: "",
    lastName: "",
  },
  edoc_tags: [],
  shared_with: [],
  description: "",
  isSharedWithEmployee: false,
  isSharedWithAllEmployers: false,
};

const UploadManyFiles = ({
  edit,
  doc,
  requestId,
  companyIds,
  tags,
  setEditDoc,
  getData,
  refetch,
  accept,
  setEmployeeName
}) => {
  let data = [];
  tags?.map((el) => data.push({ name: el?.name, _id: el?.id }));
  const { formatMessage } = useLocale();
  const selectedUserState = useSelector((state) => state.userInfos);
  const [users, setUsers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState({ delete: false, submit: false });
  const [openDialog, setDialog] = useState(false);
  const [openDelete, setDelete] = useState(false);
  const [form, setForm] = useState(INITIAL_STATE);
  const [file, setFile] = useState([]);
  const [eNameLoading, setENameLoading] = useState(false)
  const [sharedLoading, setSharedLoading] = useState(false)
  const [openDropDown, setOpenDropDown] = useState(false);
  const [openShareDropDown, setOpenShareDropDown] = useState(false);
  const [summary, setSummary] = useState("")

  useEffect(() => {
    if (!edit && file?.length > 0)
      setForm({ ...form, title: file[0]?.name?.split(".")[0] });
  }, [file]);

  useEffect(() => {
    if (edit && doc?.title) {
      setFile([doc?.file]);
      setForm(doc);
    }
  }, [doc]);

  const searchEmployers = async (_, text) => {
    setSharedLoading(true)
    if (text.length >= 2) {
      setOpenShareDropDown(true);
      const data = await getEmployers(1, 100, `searchQuery=${text}`);
      if (data) {
        setSharedLoading(false)
      }
      setEmployers(data?.docs);
    } else {
      setOpenShareDropDown(false);
      const filteredUsers = employers.filter((user) => {
        const userName = `${user.firstName} ${user.lastName}`;
        return userName.toLowerCase().includes(text.toLowerCase());
      });
      setEmployers(filteredUsers);
    }
  };
  const searchUsers = async (_, text) => {
    setENameLoading(true)
    if (text.length >= 2) {
      setOpenDropDown(true);
      const data = await getEmployees(1, 100, `searchQuery=${text}`);

      if (data) {
        setENameLoading(false)
        setUsers(data?.docs);
      } else {
        setENameLoading(false)
        setUsers([]);
      }
    } else {
      setOpenDropDown(false);
      const filteredUsers = users?.filter((user) => {
        const userName = `${user.firstName} ${user.lastName}`;
        return userName.toLowerCase().includes(text.toLowerCase());
      });
      setUsers(filteredUsers);
    }
  };

  useEffect(() => {
    if (form.employee?.firstName !== "") {
      setOpenDropDown(false);
    }
  }, [form]);
  // const searchTags = async (_, text) => {
  //   if (text.length === 2) {
  //     const data = await getTags(text);
  //     if (data?.response?.data?.status !== "failure") setTags(data);
  //   }
  // };
  const deleteEdoc = async () => {
    try {
      if (edit && doc._id) {
        setLoading({ ...loading, delete: true });
        const result = await axios.delete(`/v2/edocuments/${doc?._id}`);
        if (result?.status === "success") {
          refetch(getData + 1);
          handleClose(false);
          setDelete(false)
          toast("File deleted", {
            position: "top-right",
            type: "success",
            theme: "colored",
          });
        }
      }
    } catch (e) {
    } finally {
      setLoading({ ...loading, delete: false });
      onClose();
      setDelete(false);
    }
  };

  const SubmitForm = async () => {
    if (form.edoc_tags?.length < 1) {
      toast(formatMessage({ id: "edoc.requiredtags" }), {
        position: "top-right",
        type: "error",
        theme: "colored",
      });
    } else if (form.title === "") {
      toast(formatMessage({ id: "edoc.requiredtitle" }), {
        position: "top-right",
        type: "error",
        theme: "colored",
      });
    } else if (!form.employee?._id) {
      toast(formatMessage({ id: "edoc.requiredemployeename" }), {
        position: "top-right",
        type: "error",
        theme: "colored",
      });
    } else if (file.length < 1) {
      toast(formatMessage({ id: "edoc.requiredfile" }), {
        position: "top-right",
        type: "error",
        theme: "colored",
      });
    } else {
      try {
        setLoading({ ...loading, submit: true });
        const formDataToSend = new FormData();
        formDataToSend.append("attachments", file[0]);
        formDataToSend.append("title", form.title);
        formDataToSend.append(
          "companyId",
          companyIds || selectedUserState?.company?._id
        );
        formDataToSend.append("description", form.description);
        formDataToSend.append(
          "isSharedWithAllEmployers",
          form.isSharedWithAllEmployers
        );
        formDataToSend.append("isSharedWithEmployee", form.isSharedWithEmployee);
        formDataToSend.append("employee", form.employee?._id);
        form.shared_with.map((item) =>
          formDataToSend.append("shared_with[]", item._id)
        );
        form.edoc_tags.map((item) =>
          formDataToSend.append("edoc_tags[]", item._id)
        );

        const result = !doc?._id
          ? await axios.post("/v2/edocuments/", formDataToSend)
          : await axios.patch(
            `/v2/edocuments/update/${doc?._id}`,
            formDataToSend
          );
        if (result?.status === "success") {
          toast(result?.message, {
            position: "top-right",
            type: "success",
            theme: "colored",
          });

          if (window.location.pathname === '/requests') {
            handleClose(false)
            return;
          } else if (!edit) {
            setDialog(true);
          } else onClose();
          setEmployeeName("")

          if (requestId) {
            await axios.patch(
              companyIds
                ? `/v2/edocuments/requests/${requestId}/fulfill`
                : `/v2/edocuments/requests/${requestId}/fulfill?companyId=${companyIds}`
            );
          }
        }
      } catch (e) {
      } finally {
        setLoading({ ...loading, submit: false });
        setForm(INITIAL_STATE);
        setFile([]);
        if (doc?._id) {
          setEditDoc(false);
        }
        refetch(getData + 1);
      }
    }
  };

  const handleClose = (type) => {
    try {
      if (type) {
        setForm(INITIAL_STATE);
        setFile([]);
      } else {
        setEditDoc(false);
      }
    } finally {
      setDialog(false);
    }
  };

  return (
    <DialogContent
      sx={{
        padding: "15px",
        display: "flex",
        gap: "19px",
        flexDirection: "column",
      }}
    >
      <UploadNewOne
        text={formatMessage({ id: "edoc.uploadanotheredoc" })}
        handleClose={() => handleClose(false)}
        openDialog={openDialog}
        handleAgree={() => handleClose(true)}
        setEditDoc={setEditDoc}
      />
      <UploadNewOne
        text={formatMessage({ id: "edoc.deleteuploadanotheredoc" })}
        handleClose={() => setDelete(false)}
        openDialog={openDelete}
        handleAgree={deleteEdoc}
      />
      <EdocsUpload setFile={setFile} file={file} form={form} setForm={setForm} accept={accept}>
        <div className="row">
          <div className="col-auto">
            <TextField
              label={formatMessage({ id: "edoc.docname" })}
              type={"text"}
              autoFocus
              autoComplete="off"
              fullWidth
              margin="dense"
              value={form.title}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="col">
            <Autocomplete
              open={openDropDown}
              loading={eNameLoading}
              sx={{
                "& .MuiChip-root": {
                  backgroundColor: "var(--color-dark-blue)",
                  color: "#fff",
                  borderRadius: "8px",
                },
                "& .MuiSvgIcon-root": {
                  backgroundColor: "var(--color-dark-blue) !important",
                  color: "#fff !important",
                  borderRadius: "50%",
                },
                "& .MuiAutocomplete-inputRoot": { flexWrap: "nowrap" },
                background: "none",
                marginTop: "8px",
                marginBottom: "8px",
              }}
              onInputChange={searchUsers}
              onChange={(_, value) => setForm({ ...form, employee: value })}
              limitTags={6}
              id="multiple-limit-tags"
              options={users}
              getOptionLabel={(option) =>
                `${option?.firstName} ${option?.lastName}`.trim()
              }
              value={form.employee}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    label={formatMessage({ id: "edoc.employeename" })}
                  />
                )
              }}
            />
            <div className="checkbox">
              <input
                type="checkbox"
                checked={form.isSharedWithEmployee}
                onChange={(e) =>
                  setForm({ ...form, isSharedWithEmployee: e.target.checked })
                }
              />
              <span>{formatMessage({ id: "edoc.checkboxemployee" })}</span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <Autocomplete
              multiple
              limitTags={2}
              id="multiple-limit-tags"
              // onInputChange={searchTags}
              options={data}
              onChange={(_, value) => setForm({ ...form, edoc_tags: value })}
              value={form?.edoc_tags}
              getOptionLabel={(option) => option?.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={formatMessage({ id: "edoc.tags" })}
                  fullWidth
                />
              )}
              fullWidth
              sx={{
                "& .MuiChip-root": {
                  backgroundColor: "var(--color-dark-blue)",
                  color: "#fff",
                  borderRadius: "8px",
                },
                "& .MuiSvgIcon-root": {
                  backgroundColor: "var(--color-dark-blue) !important",
                  color: "#fff !important",
                  borderRadius: "50%",
                },
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option?.name}
                    {...getTagProps({ index })}
                  />
                ))
              }
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <Autocomplete
              loading={sharedLoading}
              open={openShareDropDown}
              multiple
              limitTags={2}
              onInputChange={searchEmployers}
              sx={{
                "& .MuiChip-root": {
                  backgroundColor: "var(--color-dark-blue)",
                  color: "#fff",
                  borderRadius: "8px",
                },
                "& .MuiSvgIcon-root": {
                  backgroundColor: "var(--color-dark-blue) !important",
                  color: "#fff !important",
                  borderRadius: "50%",
                  display: form.isSharedWithAllEmployers && "none"
                },
              }}
              id="multiple-limit-tags"
              options={employers}
              onChange={(event, newValue, key, option) => {
                if (form?.shared_with?.filter((ex) => ex?._id === newValue?._id)?.length > 0) {
                  setForm(
                    form?.shared_with?.filter((item) => item?._id !== newValue?._id)
                  );
                } else {
                  setForm({ ...form, shared_with: newValue })
                }
              }}
              value={form.isSharedWithAllEmployers && [{ firstName: "All", lastName: "" }] || form.shared_with || []}
              getOptionLabel={(option) =>
                `${option?.firstName} ${option?.lastName}`
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={formatMessage({ id: "edoc.sharewith" })}
                  fullWidth
                />
              )}
              fullWidth
            />
            <div className="checkbox">
              <input
                type="checkbox"
                checked={form.isSharedWithAllEmployers}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isSharedWithAllEmployers: e.target.checked,
                  })
                }
              />
              <span>{formatMessage({ id: "edoc.sharewithall" })}</span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <TextField
              label={formatMessage({ id: "expense.description" })}
              type={"text"}
              autoComplete="off"
              fullWidth
              inputProps={{ maxLength: 200 }}
              margin="dense"
              multiline
              onChange={(e) => {
                setForm({ ...form, description: e.target.value });
                setSummary(e.target.value)
              }
              }
              value={form.description}
              helperText={
                summary?.length > 0 ? (
                  <p style={{ color: "#2E405B" }}>
                    {summary.length}{" "}
                    <span>
                      {formatMessage({ id: "phone.request.dialog.chars" })}
                    </span>
                  </p>
                ) : (
                  <div className="">
                    <p className="error-text">
                      {formatMessage({ id: "phone.request.dialog.max" })}
                    </p>
                  </div>
                )
              }
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Button
              text={
                edit
                  ? formatMessage({ id: "edoc.save" })
                  : formatMessage({ id: "edoc.upload" })
              }
              onClick={SubmitForm}
              loading={loading.submit}
            />
          </div>
          {edit && (
            <div className="col">
              <Button
                bgColor={"var(--color-danger)"}
                color={"#fff"}
                text={formatMessage({ id: "edoc.delete" })}
                loading={loading.delete}
                onClick={() => setDelete(true)}
              />
            </div>
          )}
        </div>
      </EdocsUpload>
    </DialogContent>
  );
};

export default UploadManyFiles;
