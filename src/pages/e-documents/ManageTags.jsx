import React, { useState } from "react";
import {
  Autocomplete,
  Box,
  Container,
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  IconButton,
  CircularProgress,
  Chip,
  Dialog,
  Tooltip,
  MenuItem,
  TextField,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import TextInput from "../../components/UI/TextField";
import warning from "../../assets/warning.png";
import { SomeEdocsByTag, getAllTags } from "../../api";
import pic from "../../assets/picture.png";
import word from "../../assets/word.png";
import pdf from "../../assets/pdf.png";
import excel from "../../assets/excel.png";
import manage from "../../assets/manage.png";
import axios from "axios";
import axioss from "../../api/request";
import { toast } from "react-toastify";
import PageSpinner from "../../components/pagespinner/PageSpinner";
import moment from "moment";
import { useLocale } from "../../locales";
import EdocDetail from "../../components/edocuments/EdocDetail";
import { useNavigate } from "react-router";
import DeleteTag from "../../components/edocuments/DeleteTag";
import UploadManyFiles from "../../components/E-documents/UploadManyFiles";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function ManageTags() {
  const { formatMessage } = useLocale();
  const [docInfo, setEditDoc] = useState(false);

  const columns = [
    { id: "name", label: formatMessage({ id: "edoc.name" }), width: 60 },
    { id: "tags", label: formatMessage({ id: "edoc.tags" }), width: 60 },
    {
      id: "employee",
      label: formatMessage({ id: "edoc.employee" }),
      width: 60,
    },
    { id: "share", label: formatMessage({ id: "edoc.sharedwith" }), width: 60 },
    {
      id: "status",
      label: formatMessage({ id: "edoc.addeddate" }),
      width: 60,
    },
    {
      id: "buttons",
      label: "",
      width: 60,
    },
  ];

  const token = localStorage.getItem("token");
  const companies = JSON.parse(localStorage.getItem("managedCompanies"));
  const [companyIds, setCompanyIds] = useState(
    companies ? companies[0]?._id : null
  );
  const [companyName, setCompanyName] = useState(
    companies ? companies[0]?.name : null
  );
  const selectedUserState = useSelector((state) => state.userInfos);
  const navigate = useNavigate();
  const url = `${import.meta.env.VITE_BASE_URL}`;
  const [isAdd, setIsAdd] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [getData, setGetData] = useState(0);
  const [newTag, setNewTag] = useState("");
  const [renameTag, setRenameTag] = useState({ name: "", id: "" });
  const [renameTagValue, setRenameTagValue] = useState("");
  const [existingTags, setExistingTags] = useState([]);
  const [openDetails, setOpenDetails] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDownload, setOpenDownload] = useState(false);
  const [detailInfo, setDetailInfo] = useState();

  const { allTags, load } = getAllTags(getData, companyIds);
  let tags = [];
  let tagDropDown = [];
  allTags?.docs
    ?.filter((ft) => ft?.edocuments !== renameTag?.name)
    ?.map((el) => tags.push({ name: el?.name, id: el?._id }));
  allTags?.docs
    ?.filter(
      (ft) =>
        ft?.name?.toLocaleLowerCase() !== renameTag?.name?.toLocaleLowerCase()
    )
    ?.map((el) => tagDropDown.push({ name: el?.name, id: el?._id }));

  useEffect(() => {
    if (existingTags.length < 1) {
      setRenameTag({ name: "", id: "" });
      setRenameTagValue("");
    }
  }, [existingTags]);

  const AddNewTag = async () => {
    if (
      tags
        .map((tg) => tg.name.toLowerCase() === newTag.toLocaleLowerCase())
        .includes(true)
    ) {
      toast(formatMessage({ id: "edoc.tagexists" }), {
        position: "top-right",
        type: "error",
        theme: "colored",
      });
      return;
    } else {
      setAddLoading(true);
      try {
        const result = await axios.post(
          `${url}/v2/edocuments/tags`,
          {
            name: newTag,
            companyId: companyIds || "",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (result?.data?.status === "success") {
          toast(formatMessage({ id: "edoc.addtagsuccess" }), {
            position: "top-right",
            type: "success",
            theme: "colored",
          });
          setAddLoading(false);
          setIsAdd(false);
          setNewTag("");
          setRenameTag({ name: "", id: "" });
          setRenameTagValue("");
          setExistingTags([]);
          setGetData(getData + 1);
        }
      } catch (error) {
        setAddLoading(false);
      }
    }
  };

  const { data, loading } = SomeEdocsByTag(renameTag.id, "", 1, 3, companyIds);

  const SaveChanges = async (type) => {
    setSaveLoading(true);
    try {
      const renameResult = await axios.patch(
        `${url}/v2/edocuments/tags/${renameTag.id}`,
        { name: renameTagValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const addExistingResult = await axios.patch(
        `${url}/v2/edocuments/tags/${renameTag.id}/append`,
        { tag: existingTags[1]?.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (renameResult?.data?.status === "success") {
        toast(formatMessage({ id: "edoc.savesuccess" }), {
          position: "top-right",
          theme: "colored",
          type: "success",
        });
        setSaveLoading(false);
        setRenameTag({ name: "", id: "" });
        setRenameTagValue("");
        setExistingTags([]);
        setGetData(getData + 1);
      }
    } catch (error) {
      setSaveLoading(false);
    }
  };

  const downloadFile = async (file) => {
    if (
      !file?.shared_with.some((sm) => sm?._id === selectedUserState?._id) &&
      file?.uploaded_by?._id !== selectedUserState?._id
    ) {
      toast(formatMessage({ id: "edoc.unauthorized" }), {
        position: "top-right",
        type: "error",
        theme: "colored",
      });
    } else {
      setOpenDownload(true);
      try {
        const response = await axioss(`/v2/edocuments/download/${file?._id}`, {
          responseType: "blob",
        });
        const blob = new Blob([response], { type: response.type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file?.title;
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setOpenDownload(false);
      } catch (error) {
        setOpenDownload(false);
      }
    }
  };

  return (
    <Box sx={{ padding: "1rem 35px 2rem 35px" }}>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={3}>
          <Typography variant="h5" fontWeight={600} lineHeight={"1"}>
            {formatMessage({ id: "edoc.managetags" })}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6} />

        <Grid item xs={12} md={3}>
          {companies != undefined && (
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
                companyName?.length > 0
                  ? companyName
                  : formatMessage({ id: "filter.company" })
              }
              InputLabelProps={{ shrink: false }}
              fullWidth
            >
              {companies?.map((company, key) => (
                <MenuItem
                  onClick={() => {
                    setCompanyName(company.name);
                    setCompanyIds(company?._id);
                  }}
                  key={key}
                >
                  <span style={{ textTransform: "capitalize" }}>
                    {company.name}
                  </span>
                </MenuItem>
              ))}
            </TextField>
          )}
        </Grid>
      </Grid>
      {load ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "20vh",
          }}
        >
          <PageSpinner />
        </div>
      ) : (
        <Container maxWidth={"lg"}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            {tags?.length < 1 ? (
              <Typography textAlign={"center"}>
                {formatMessage({ id: "edoc.notags" })}
              </Typography>
            ) : (
              tags.map((el, index) => {
                return (
                  <Button
                    key={index}
                    onClick={() => {
                      setRenameTag(el);
                      setRenameTagValue(el?.name);
                      setExistingTags([el]);
                    }}
                    sx={{
                      borderRadius: "20px",
                      border: "1px solid var(--color-dark-blue) !important",
                      color:
                        el?.name === renameTag?.name
                          ? "#fff"
                          : "var(--color-dark-blue) !important",
                      backgroundColor:
                        el?.name === renameTag?.name
                          ? "var(--color-dark-blue) !important"
                          : "#fff",
                      textTransform: "capitalize",
                      padding: ".5rem",
                      cursor: "pointer",
                    }}
                  >
                    {el?.name}
                  </Button>
                );
              })
            )}

            {isAdd ? (
              <>
                <TextInput
                  label={formatMessage({ id: "edoc.tagname" })}
                  autoFocus
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  margin="dense"
                  size={"small"}
                  inputProps={{ maxLength: 200 }}
                  onKeyDown={(event) => {
                    if (event.keyCode === 13) {
                      document.getElementById("add-new-tag").click();
                    }
                  }}
                />
                <Button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "var(--color-dark-blue)",
                    color: "#fff",
                    padding: ".4rem 1rem",
                    borderRadius: "10px",
                    cursor: "pointer !important",
                    textTransform: "none",
                  }}
                  onClick={() => AddNewTag()}
                  id="add-new-tag"
                >
                  {addLoading ? (
                    <CircularProgress
                      size={20}
                      sx={{
                        color: "#fff !important",
                      }}
                    />
                  ) : (
                    formatMessage({ id: "edoc.add" })
                  )}
                </Button>
                <IconButton onClick={() => setIsAdd(false)}>
                  <Close />
                </IconButton>
              </>
            ) : (
              <Button
                onClick={() => setIsAdd(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "var(--color-dark-blue)",
                  color: "#fff",
                  padding: ".4rem 1rem",
                  borderRadius: "10px",
                  cursor: "pointer !important",
                  textTransform: "none",
                }}
              >
                <Add /> {formatMessage({ id: "edoc.addatag" })}
              </Button>
            )}
          </Box>

          <hr style={{ margin: "1rem 0", opacity: "0.2" }} />

          <Grid container spacing={10}>
            <Grid item xs={12} md={6}>
              <Typography>{formatMessage({ id: "edoc.renametag" })}</Typography>
              <Typography fontSize={"0.75rem"} mb={1.5}>
                {formatMessage({ id: "edoc.renametagnote" })}
              </Typography>
              <TextInput
                label={formatMessage({ id: "edoc.tagname" })}
                value={renameTagValue}
                onChange={(e) => setRenameTagValue(e.target.value)}
                InputLabelProps={{ shrink: renameTag.name.length > 0 && true }}
                disabled={renameTag.name.length < 1}
                fullWidth
                margin="dense"
                inputProps={{ maxLength: 200 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <Typography>
                  {formatMessage({ id: "edoc.addnewtag" })}
                </Typography>
                <img src={warning} alt="warning" />
              </Box>
              <Typography fontSize={"0.75rem"} mb={2.5}>
                {formatMessage({ id: "edoc.addnewtagnote" })} “{renameTag.name}”
              </Typography>
              <Autocomplete
                multiple
                disableClearable
                includeInputInList
                disabled={renameTag.name.length < 1}
                id="tags-filled"
                filterSelectedOptions
                options={existingTags?.length < 2 ? tagDropDown : []}
                getOptionLabel={(option) => option?.name}
                fullWidth
                value={existingTags?.map((option) => option?.name)}
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
                }}
                onChange={(event, newValue, key, option) => {
                  if (
                    existingTags.filter((ex) => ex.name === option.option)
                      .length > 0
                  ) {
                    setExistingTags(
                      existingTags.filter((item) => item.name !== option.option)
                    );
                  } else {
                    setExistingTags((prev) => [...prev, option.option]);
                  }
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextInput
                    InputLabelProps={{ shrink: true }}
                    {...params}
                    label={formatMessage({ id: "edoc.tags" })}
                  />
                )}
              />
            </Grid>
          </Grid>

          {renameTag.id !== "" && (
            <>
              <TableContainer
                sx={{
                  height: "38vh",
                  overflowX: "auto",
                  "&::-webkit-scrollbar": {
                    width: 0,
                  },
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
              >
                <Table stickyHeader aria-label="sticky table" size="small">
                  {
                    <>
                      <TableHead>
                        <TableRow
                          sx={{
                            "& .MuiTableCell-root": {
                              border: "0px",
                              borderBottom: "1px solid #EFEFEF",
                              textAlign: "center",
                              padding: "3px",
                            },
                          }}
                        >
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ width: column.width, color: "gray" }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "start",
                                  fontWeight: "bolder",
                                  padding: ".5rem 0",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {column.label}
                              </span>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableCell colSpan={5}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "20vh",
                              }}
                            >
                              <PageSpinner />
                            </div>
                          </TableCell>
                        ) : data?.docs?.length < 1 ? (
                          <TableCell colSpan={5}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "1.2rem",
                                marginTop: "1rem",
                              }}
                            >
                              <div>
                                <Typography>{formatMessage({ id: "edoc.nodoc" })}</Typography>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: "1rem",
                                  }}
                                >
                                  <img src={manage} alt="file" />
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        ) : (
                          data?.docs?.map((docEl, index) => {
                            return (
                              <TableRow
                                key={index}
                                hover
                                role="checkbox"
                                sx={{
                                  "& .MuiTableCell-root": {
                                    border: "0px",
                                    padding: "3px",
                                    fontSize: "15px",
                                    marginBottom: "4px",
                                  },
                                }}
                              >
                                <TableCell
                                  onClick={() => downloadFile(docEl)}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    color: "#002B69",
                                    width: "200px",
                                    cursor: "pointer",
                                  }}
                                  title={docEl?.name}
                                >
                                  <span
                                    style={{
                                      padding: "10px 10px 5px 10px",
                                      backgroundColor: "#DFEAFC",
                                      borderRadius: "5px",
                                    }}
                                  >
                                    <img
                                      src={
                                        docEl?.name.split(".").pop() === "pdf"
                                          ? pdf
                                          : docEl?.name?.split(".").pop() ===
                                              "docx" ||
                                            docEl?.name?.split(".").pop() ===
                                              "doc" ||
                                            docEl?.name.split(".").pop() ===
                                              "txt"
                                          ? word
                                          : docEl?.name?.split(".").pop() ===
                                              "xls" ||
                                            docEl?.name?.split(".").pop() ===
                                              "xlsx"
                                          ? excel
                                          : pic
                                      }
                                      alt="file"
                                    />
                                  </span>
                                  <Typography noWrap>{docEl?.name}</Typography>
                                </TableCell>

                                <TableCell>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "5px",
                                      marginRight: "8px",
                                      width: "120px",
                                    }}
                                    title={docEl?.edoc_tags[0]?.name || null}
                                  >
                                    {docEl?.edoc_tags?.length < 1 ? (
                                      ""
                                    ) : (
                                      <Typography noWrap>
                                        {docEl?.edoc_tags[0]?.name}
                                      </Typography>
                                    )}
                                    {docEl?.edoc_tags?.length > 1 ? (
                                      <Tooltip
                                        title={docEl?.edoc_tags.map(
                                          (el, index) => {
                                            return (
                                              <div key={index}>{el?.name}</div>
                                            );
                                          }
                                        )}
                                      >
                                        <span
                                          style={{
                                            padding: "3px",
                                            backgroundColor:
                                              "var(--color-cyan-light)",
                                            color: "var(--color-dark-blue)",
                                            borderRadius: "50%",
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                          }}
                                        >
                                          +{docEl?.edoc_tags?.length - 1}
                                        </span>
                                      </Tooltip>
                                    ) : (
                                      ""
                                    )}
                                  </Box>
                                </TableCell>

                                <TableCell
                                  title={
                                    docEl?.employee?.firstName +
                                    " " +
                                    docEl?.employee?.lastName
                                  }
                                >
                                  {docEl?.employee?.firstName === undefined ||
                                  docEl?.employee?.lastName === undefined ? (
                                    ""
                                  ) : (
                                    <Typography noWrap>
                                      {docEl?.employee?.firstName +
                                        " " +
                                        docEl?.employee?.lastName}
                                    </Typography>
                                  )}
                                </TableCell>

                                <TableCell
                                  title={
                                    docEl?.shared_with[0]?.firstName +
                                    " " +
                                    docEl?.shared_with[0]?.lastName
                                  }
                                >
                                  {docEl?.shared_with?.length < 1 ? (
                                    ""
                                  ) : (
                                    <Typography noWrap>
                                      {docEl?.shared_with[0]?.firstName +
                                        " " +
                                        docEl?.shared_with[0]?.lastName}
                                    </Typography>
                                  )}
                                </TableCell>

                                <TableCell>
                                  {moment(docEl?.createdAt).format(
                                    "DD MMM YYYY"
                                  )}
                                </TableCell>

                                <TableCell
                                  sx={{
                                    display: "flex",
                                    justifyContent: "start",
                                    gap: 1,
                                  }}
                                >
                                  <Button
                                    onClick={() => {
                                      setOpenDetails(true);
                                      setDetailInfo(docEl);
                                    }}
                                    variant="outlined"
                                    sx={{
                                      textTransform: "capitalize",
                                      color: "#000",
                                      borderColor: "gray !important",
                                      fontWeight: "600",
                                      padding: "1px 8px",
                                    }}
                                  >
                                    {formatMessage({ id: "edoc.details" })}
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    sx={{
                                      textTransform: "capitalize",
                                      color: "#000",
                                      borderColor: "gray !important",
                                      fontWeight: "600",
                                      padding: "1px 8px",
                                    }}
                                    onClick={() => {
                                      setDetailInfo(docEl);
                                      setEditDoc(true);
                                    }}
                                    disabled={
                                      !docEl?.shared_with.some(
                                        (sm) =>
                                          sm?._id === selectedUserState?._id
                                      ) &&
                                      docEl?.uploaded_by?._id !==
                                        selectedUserState?._id
                                    }
                                  >
                                    {formatMessage({ id: "edoc.edit" })}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </>
                  }
                </Table>
              </TableContainer>

              {data?.docs?.length > 0 ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="body2"
                    sx={{
                      textDecoration: "underline",
                      cursor: "pointer",
                      fontWeight: "bold",
                      textAlign: "center",
                      marginTop: "-2.5rem",
                      textTransform: "capitalize",
                    }}
                    onClick={() =>
                      navigate(`/e-documents/${renameTag?.id}`, {
                        state: { name: renameTag?.name },
                      })
                    }
                  >
                    {formatMessage({ id: "edoc.viewalldocs" })}
                  </Button>
                </Box>
              ) : null}
            </>
          )}

          {renameTag.name.length > 0 && (
            <Box sx={{ marginTop: "2.3rem" }}>
              <Grid container spacing={{xs: 3, sm: 8}}>
                <Grid item xs={0} sm={2} />
                <Grid item xs={12} sm={4}>
                  <Button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "var(--color-blue)",
                      color: "var(--color-dark-blue)",
                      padding: ".4rem 1rem",
                      borderRadius: "40px",
                      fontWeight: "600",
                      textTransform: "capitalize",
                    }}
                    onClick={() => SaveChanges()}
                    fullWidth
                  >
                    {saveLoading ? (
                      <CircularProgress
                        size={20}
                        sx={{
                          color: "var(--color-dark-blue) !important",
                        }}
                      />
                    ) : (
                      formatMessage({ id: "edoc.savechanges" })
                    )}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#FA3E3E",
                      color: "#fff",
                      padding: ".4rem 1rem",
                      borderRadius: "40px",
                      cursor: "pointer !important",
                      fontWeight: "600",
                      textTransform: "capitalize",
                    }}
                    onClick={() => setOpenDelete(true)}
                    fullWidth
                  >
                    {addLoading ? (
                      <CircularProgress
                        size={20}
                        sx={{
                          color: "#fff !important",
                        }}
                      />
                    ) : (
                      formatMessage({ id: "edoc.deletetag" })
                    )}
                  </Button>
                </Grid>
                <Grid item xs={0} sm={2} />
              </Grid>
            </Box>
          )}
        </Container>
      )}

      {/* Details */}
      <Dialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        fullWidth
        maxWidth={"sm"}
        sx={{ "& .MuiDialog-paper": { borderRadius: "35px" } }}
      >
        <EdocDetail detailInfo={detailInfo} />
      </Dialog>

      <Dialog
        open={docInfo}
        onClose={() => setEditDoc()}
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
            borderRadius: "30px",
            maxHeight: "100vh",
          },
        }}
        maxWidth={"sm"}
      >
        <UploadManyFiles
          doc={detailInfo}
          getData={getData}
          refetch={setGetData}
          companyIds={companyIds}
          tags={tags}
          setEditDoc={setEditDoc}
          edit
          accept={{
            "image/*": [],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            [".docx"],
            "application/msexcel": [".xls"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            [".xlsx"],
            "application/pdf": [".pdf"],
          }}
        />
      </Dialog>

      {/* Delete Tag */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDetails(false)}
        fullWidth
        maxWidth={"xs"}
        sx={{ "& .MuiDialog-paper": { borderRadius: "35px" } }}
      >
        <DeleteTag
          setOpenDelete={setOpenDelete}
          renameTag={renameTag}
          setRenameTag={setRenameTag}
          setRenameTagValue={setRenameTagValue}
          setExistingTags={setExistingTags}
          getData={getData}
          setGetData={setGetData}
          companyIds={companyIds}
        />
      </Dialog>

      {/* Download file */}
      <Dialog
        open={openDownload}
        onClose={() => setOpenDownload(false)}
        fullWidth
        maxWidth={"xs"}
        sx={{ "& .MuiDialog-paper": { borderRadius: "15px" } }}
      >
        <Typography
          variant="h5"
          textAlign={"center"}
          fontWeight={"600"}
          color={"var(--color-dark-blue)"}
          py={3}
        >
          {formatMessage({ id: "edoc.preparedownload" })}
        </Typography>
      </Dialog>
    </Box>
  );
}

export default ManageTags;
