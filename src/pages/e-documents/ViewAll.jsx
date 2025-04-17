import React, { useEffect } from "react";
import SideContainer from "../../containers/SideContainer";
import { useLocale } from "../../locales";
import { ContFilter } from "../../components/employee/style";
import { getAllTags } from "../../api";
import { useState } from "react";
import pic from "../../assets/picture.png";
import word from "../../assets/word.png";
import pdf from "../../assets/pdf.png";
import excel from "../../assets/excel.png";
import manage from "../../assets/manage.png";
import {
  MenuItem,
  Pagination,
  TextField,
  TableContainer,
  Table,
  Box,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
  InputAdornment,
  Dialog,
  Tooltip,
  Chip,
  Checkbox,
  Divider,
  OutlinedInput,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { KeyboardBackspace, Search } from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router";
import dayjs from "dayjs";
import PageSpinner from "../../components/pagespinner/PageSpinner";
import moment from "moment";
import EdocDetail from "../../components/edocuments/EdocDetail";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import styled from "styled-components";
import UploadManyFiles from "../../components/E-documents/UploadManyFiles";
import axios from "../../api/request";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Field = styled.div`
  background: #87cefa;
  border-radius: 20px;
  border-radius: 20px;
  padding: 13px;
  cursor: pointer;
`;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const LeftSide = ({
  data,
  loading,
  tag,
  getData,
  setGetData,
  selectedTagName,
  page,
  setPage,
  refreshData,
  tags,
  companyIds,
}) => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate()
  const selectedUserState = useSelector((state) => state.userInfos);
  const [openDetails, setOpenDetails] = useState(false);
  const [detailInfo, setDetailInfo] = useState();
  const [docInfo, setEditDoc] = useState(false);
  const [openDownload, setOpenDownload] = useState(false);

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
  const handleClose = () => {
    setEditDoc();
    refreshData(); // Call this to refresh the data manually
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
        const response = await axios(`/v2/edocuments/download/${file?._id}`, {
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
    <>
      <Dialog
        open={docInfo}
        onClose={handleClose}
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
          companyIds={companyIds}
          tags={tags}
          getData={getData}
          refetch={setGetData}
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
      <Box sx={{ width: "100%", overflow: "hidden" }} mb={3}>
      <IconButton
          sx={{
            gap: 1,
            color: "#000",
            backgroundColor: "#fff !important",
            cursor: "pointer"
          }}
          onClick={() => navigate(-1)}
        >
          <KeyboardBackspace />
          <Typography fontWeight={600}>{formatMessage({ id: "evoucher.previous" })}</Typography>
        </IconButton>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
          }}
          my={2.5}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "end",
              gap: 1.5,
            }}
          >
            {selectedTagName?.map((el, index) => {
              return (
                <Button
                  key={index}
                  sx={{
                    borderRadius: "20px",
                    border: "1px solid var(--color-dark-blue) !important",
                    color: "var(--color-dark-blue) !important",
                    backgroundColor: "#fff",
                    textTransform: "capitalize",
                    padding: ".5rem",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {el}
                </Button>
              );
            })}
            <Typography variant="body2">
              {data?.totalDocs} {formatMessage({ id: "edoc.documents" })}
            </Typography>
          </Box>
        </Box>

        <TableContainer
          sx={{
            height: "68vh",
            overflowX: "hidden",
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
                          height: "50vh",
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
                          height: "50vh",
                        }}
                      >
                        <div>
                          <div>
                            {"Oops, looks like there's no document here yet."}
                          </div>
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
                            title={docEl?.title}
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
                                    : docEl?.name.split(".").pop() === "docx" ||
                                      docEl?.name.split(".").pop() === "doc" ||
                                      docEl?.name.split(".").pop() === "txt"
                                      ? word
                                      : docEl?.name.split(".").pop() === "xls" ||
                                        docEl?.name.split(".").pop() === "xlsx"
                                        ? excel
                                        : pic
                                }
                                alt="file"
                              />
                            </span>
                            <Typography noWrap>{docEl?.title}</Typography>
                          </TableCell>

                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                // marginRight: "8px",
                                // width: "90px",
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
                                  title={docEl?.edoc_tags.map((el, index) => {
                                    return <div key={index}>{el?.name}</div>;
                                  })}
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
                              <Typography noWrap width={"135px"}>
                                {docEl?.employee?.firstName +
                                  " " +
                                  docEl?.employee?.lastName}
                              </Typography>
                            )}
                          </TableCell>

                          <TableCell
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                            title={
                              (docEl?.shared_with[0]?.firstName || "") +
                              " " +
                              (docEl?.shared_with[0]?.lastName || "")
                            }
                          >
                            {docEl?.shared_with?.length < 1 ? (
                              ""
                            ) : (
                              <Typography noWrap width={"135px"}>
                                {docEl?.shared_with[0]?.firstName +
                                  " " +
                                  docEl?.shared_with[0]?.lastName}
                              </Typography>
                            )}
                            {docEl?.shared_with?.length > 1 ? (
                              <Tooltip
                                title={docEl?.shared_with.map((el, index) => {
                                  return (
                                    <div key={index}>
                                      {el?.firstName + " " + el?.lastName}
                                    </div>
                                  );
                                })}
                              >
                                <span
                                  style={{
                                    padding: "3px",
                                    backgroundColor: "var(--color-cyan-light)",
                                    color: "var(--color-dark-blue)",
                                    borderRadius: "50%",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                  }}
                                >
                                  +{docEl?.shared_with?.length - 1}
                                </span>
                              </Tooltip>
                            ) : (
                              ""
                            )}
                          </TableCell>

                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            {moment(docEl?.createdAt).format("DD MMM YYYY")}
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
                                  (sm) => sm?._id === selectedUserState?._id
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

          {data?.totalPages > 1 && (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                margin: "10px 0",
              }}
            >
              <Pagination
                hidePrevButton
                hideNextButton
                count={data?.totalPages}
                variant="outlined"
                shape="rounded"
                onChange={(e, value) => setPage(value)}
                page={page}
              />
            </div>
          )}
        </TableContainer>

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
    </>
  );
};
const RightSide = ({
  employeeName,
  load,
  setEmployeeName,
  tags,
  tag,
  setTag,
  getData,
  setGetData,
  selectedTagName,
  setSelectedTagName,
  setPage,
  tagName,
  tagId,
  setStartDate,
  setEndDate,
  refreshData,
  companyIds,
  AllEdocsByTag,
  setLoading,
  sort,
  setSort
}) => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const [docInfo, setEditDoc] = useState(false);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [timeoutMulti, setTimeoutMulti] = useState(null)
  const [searchTag, setSearchTag] = useState("");
  const clearFilter = () => {
    // navigate("/e-documents");
    setTag([tagId]);
    setIsCheckAll(false);
    setSelectedTagName([tagName]);
    setEmployeeName("");
    setSearchTag("");
    setPage(1);
  };
  const handleClose = () => {
    setEditDoc(false);
    refreshData();
  };
  const handleToggleSelectAll = (tags) => {
    setIsCheckAll(!isCheckAll);
    setSearchTag("");
    setTag(tags.map((el) => el?.id));
    setSelectedTagName(tags.map((el) => el?.name));
    if (isCheckAll) {
      setTag([tagId]);
      setSelectedTagName([tagName]);
    }
  };
  const handleChange = (data) => {
    if (tag.includes(data?.id)) {
      setTag(tag.filter((item) => item !== data?.id));
    } else {
      setTag((prev) => [...prev, data?.id]);
    }

    if (selectedTagName.includes(data?.name)) {
      setSelectedTagName(selectedTagName.filter((item) => item !== data?.name));
    } else {
      setSelectedTagName((prev) => [...prev, data?.name]);
    }
  };

  const handleSearchChange = (e) => {
    try {
      clearTimeout(timeoutMulti)
    }
    catch {

    }
    setEmployeeName(e.target.value)
    setLoading(true)
    setTimeoutMulti(setTimeout(() => {
      AllEdocsByTag(e.target.value)
    }, 1500))
  }

  return (
    <ContFilter>
      <Dialog
        open={docInfo}
        onClose={handleClose}
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
          companyIds={companyIds}
          tags={tags}
          getData={getData}
          refetch={setGetData}
          setEditDoc={setEditDoc}
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
      <Typography
        variant="body2"
        sx={{
          textDecoration: "underline",
          cursor: "pointer",
          fontWeight: "bold",
          textAlign: "center",
        }}
        onClick={clearFilter}
      >
        {formatMessage({ id: "employee.clearfilter" })}
      </Typography>

      {/* <TextField
        size="small"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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
        placeholder={formatMessage({ id: "edoc.title" })}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      /> */}

      <TextField
        size="small"
        variant="outlined"
        value={employeeName}
        onChange={(e) => handleSearchChange(e)}
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
        placeholder={formatMessage({ id: "edoc.employeenametitle" })}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <Field>
        <FormControl
          sx={{
            m: 1,
            width: "100%",
            backgroundColor: "var(--color-blue)",
            borderRadius: "20px",
            margin: "0",
          }}
        >
          <InputLabel id="demo-multiple-chip-label">
            {formatMessage({ id: "edoc.tagname" })}
          </InputLabel>
          <Select
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={selectedTagName}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                border: "0",
              },
            }}
          >
            {load ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress
                  size={20}
                  sx={{
                    color: "var(--color-dark-blue) !important",
                  }}
                />
              </Box>
            ) : (
              <Box>
                <MenuItem onClick={() => handleToggleSelectAll(tags)}>
                  <Checkbox checked={isCheckAll} sx={{ paddingLeft: "0" }} />
                  {isCheckAll ? (
                    <>{formatMessage({ id: "edoc.unselectall" })}</>
                  ) : (
                    <>{formatMessage({ id: "edoc.selectall" })}</>
                  )}
                </MenuItem>
                <MenuItem>
                  <TextField
                    size="small"
                    variant="standard"
                    value={searchTag}
                    onChange={(e) => setSearchTag(e.target.value)}
                    fullWidth
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
                    placeholder={formatMessage({ id: "nav.search" })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                </MenuItem>
                <Divider />
                {tags
                  .filter((el) =>
                    el?.name
                      ?.toLocaleLowerCase()
                      .includes(searchTag.toLocaleLowerCase())
                  )
                  .map((el) => (
                    <MenuItem
                      key={el?.id}
                      value={el?.name}
                      onClick={() => handleChange(el)}
                      sx={{ textTransform: "capitalize" }}
                    >
                      <Checkbox
                        checked={tag?.includes(el?.id)}
                        sx={{ paddingLeft: "0" }}
                      />
                      {el?.name}
                    </MenuItem>
                  ))}
              </Box>
            )}
          </Select>
        </FormControl>
      </Field>

      <Field onClick={() => { setSort(-sort) }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <span>{formatMessage({ id: "edoc.sortbydate" })}</span>
          <img src="/icons/Employee/filter.svg" />
        </Box>
      </Field>

      <Field>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <span>{formatMessage({ id: "edoc.date" })}</span>
          <img src="/icons/Employee/filter.svg" />
        </Box>

        <div style={{ marginTop: "12px", display: "flex", gap: 10 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={formatMessage({ id: "timetracker.startdate" })}
              onChange={(value) => setStartDate(value.toISOString())}
              // value={dayjs()}
              slotProps={{ textField: { size: "small", error: false } }}
              sx={{ width: "100%" }}
              disableFuture={true}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={formatMessage({ id: "timetracker.enddate" })}
              onChange={(value) =>
                setEndDate(dayjs(value).endOf("day").toISOString())
              }
              // value={dayjs()}
              slotProps={{ textField: { size: "small", error: false } }}
              sx={{ width: "100%" }}
              disableFuture={true}
            />
          </LocalizationProvider>
        </div>
      </Field>

      <hr />
      <Button
        variant="contained"
        size="large"
        sx={{
          backgroundColor: "#002B69 !important",
          borderRadius: "20px",
          textTransform: "capitalize",
        }}
        onClick={() => setEditDoc(true)}
      >
        {formatMessage({ id: "edoc.adddocument" })}
      </Button>
      <Button
        onClick={() => navigate(`/e-documents/manage-tags`)}
        variant="outlined"
        size="large"
        sx={{
          color: "var(--color-dark-blue) !important",
          borderRadius: "20px",
          textTransform: "capitalize",
          fontWeight: "600",
          borderColor: "var(--color-dark-blue) !important",
          marginBottom: "20px",
        }}
      >
        {formatMessage({ id: "edoc.managetags" })}
      </Button>
    </ContFilter>
  );
};
const ViewAll = () => {
  const location = useLocation();
  const companies = JSON.parse(localStorage.getItem("managedCompanies"));
  const [companyIds, setCompanyIds] = useState(
    companies ? companies[0]?._id : null
  );
  const [page, setPage] = useState(1);
  const { id } = useParams();
  const [getData, setGetData] = useState(0);
  const [employeeName, setEmployeeName] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(dayjs().endOf("day").toISOString());
  const [tag, setTag] = useState([id]);
  const [sort, setSort] = useState(-1);
  const [selectedTagName, setSelectedTagName] = useState([
    location?.state?.name,
  ]);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const AllEdocsByTag = async (searchTerm) => {
    setLoading(true);
    try {
      const response = await axios.get(
        companyIds ?
          `/v2/edocuments?startDate=${startDate}&endDate=${endDate}&searchQuery=${searchTerm}&page=${page}&limit=${10}&companyId=${companyIds}&sort=${sort}` :
          `/v2/edocuments?startDate=${startDate}&endDate=${endDate}&searchQuery=${searchTerm}&page=${page}&limit=${10}&sort=${sort}`,
        {
          params: {
            tagIds: tag,
          },
        }
      );
      setData(response?.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    AllEdocsByTag("")
  }, [tag, startDate, endDate, page, companyIds, getData, sort]);

  const refreshData = () => {
    AllEdocsByTag("");
  };

  const { allTags, load } = getAllTags(0, companyIds);
  let tags = [];
  allTags?.docs?.map((el) => tags.push({ name: el?.name, id: el?._id }));

  return (
    <SideContainer
      LeftSideComponent={
        <LeftSide
          data={data}
          loading={loading}
          tag={tag}
          getData={getData}
          setGetData={setGetData}
          selectedTagName={selectedTagName}
          page={page}
          setPage={setPage}
          refreshData={refreshData}
          tags={tags}
          companyIds={companyIds}
        />
      }
      RightSideComponent={
        <RightSide
          id={id}
          setEmployeeName={setEmployeeName}
          employeeName={employeeName}
          setPage={setPage}
          getData={getData}
          setGetData={setGetData}
          tagName={location?.state?.name}
          tagId={id}
          selectedTagName={selectedTagName}
          setSelectedTagName={setSelectedTagName}
          tags={tags}
          tag={tag}
          setTag={setTag}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          load={load}
          companyIds={companyIds}
          AllEdocsByTag={AllEdocsByTag}
          setLoading={setLoading}
          sort={sort}
          setSort={setSort}
        />
      }
    />
  );
};

export default ViewAll;
