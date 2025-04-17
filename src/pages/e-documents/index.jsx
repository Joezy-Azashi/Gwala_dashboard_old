import React, { useEffect } from "react";
import SideContainer from "../../containers/SideContainer";
import { useLocale } from "../../locales";
import { ContFilter, Field } from "../../components/employee/style";
import { getAllTags } from "../../api";
import { useState } from "react";
import pic from "../../assets/picture.png";
import word from "../../assets/word.png";
import pdf from "../../assets/pdf.png";
import excel from "../../assets/excel.png";
import {
  MenuItem,
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
  Dialog,
  InputAdornment,
  Pagination,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import PageSpinner from "../../components/pagespinner/PageSpinner";
import moment from "moment";
import EdocDetail from "../../components/edocuments/EdocDetail";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "../../api/request";
import UploadManyFiles from "../../components/E-documents/UploadManyFiles";
import { Search } from "@mui/icons-material";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const LeftSide = ({
  data,
  loading,
  searchPage,
  setSearchPage,
  searchLoading,
  getData,
  setGetData,
  limit,
  setLimit,
  AllEdocs,
  employeeName,
  setEmployeeName,
  docsByEmployeeName,
  companyIds,
  companyName,
  tags,
  tag
}) => {
  const navigate = useNavigate();

  const { formatMessage } = useLocale();
  const [openDetails, setOpenDetails] = useState(false);
  const [openDownload, setOpenDownload] = useState(false);
  const [docInfo, setEditDoc] = useState(false);
  const [detailInfo, setDetailInfo] = useState();

  const columns = [
    { id: "name", label: formatMessage({ id: "edoc.name" }), width: "22%" },
    { id: "tags", label: formatMessage({ id: "edoc.tags" }), width: "16%" },
    { id: "employee", label: formatMessage({ id: "edoc.employee" }), width: "16%" },
    { id: "share", label: formatMessage({ id: "edoc.sharedwith" }), width: "20%" },
    { id: "date", label: formatMessage({ id: "edoc.addeddate" }), width: "10%" },
    { id: "buttons", label: "", width: "16%" },
  ];

  const downloadFile = async (file) => {
    if (
      !file?.isSharedWithAllEmployers &&
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

  const closeModal = () => {
    setEditDoc(false);
    AllEdocs();
  };
  const selectedUserState = useSelector((state) => state.userInfos);
  return (
    <Box className="pageScroll">
      <Dialog
        open={docInfo}
        onClose={closeModal}
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
          setEmployeeName={setEmployeeName}
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
      {employeeName.length < 1 ? (
        <>
          {loading ? (
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
          ) : data?.docs?.length < 1 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
                fontSize: "1.2rem",
              }}
            >
              {formatMessage({ id: "employee.norecords" })}
            </div>
          ) : (
            <InfiniteScroll
              dataLength={data?.totalDocs || 100}
              next={() => {
                setLimit(limit + 10);
              }}
              hasMore={data?.docs?.length === data?.totalDocs ? false : true}
              loader={
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
              }
              endMessage={
                loading ? (
                  ""
                ) : tag !== "" ? (
                  <p style={{ textAlign: "center" }}>
                    <b>{formatMessage({ id: "edoc.clickviewall" })}</b>
                  </p>
                ) : (
                  <p style={{ textAlign: "center" }}>
                    <b>{formatMessage({ id: "edoc.listend" })}</b>
                  </p>
                )
              }
              height={"78vh"}
            >
              {data?.docs?.map((el, index) => {
                return (
                  <Box
                    sx={{ width: "100%", overflow: "hidden" }}
                    mb={3}
                    key={index}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "end",
                      }}
                      my={2.5}
                      px={1}
                    >
                      <Typography
                        variant="h5"
                        fontWeight={600}
                        lineHeight={"1"}
                        textTransform={"capitalize"}
                      >
                        {el?.name}
                      </Typography>

                      <Typography
                        onClick={() =>
                          navigate(`/e-documents/${el?._id}`, {
                            state: {
                              name: el.name,
                              companyId: companyIds,
                              companyName: companyName,
                            },
                          })
                        }
                        color={"#002B69"}
                        fontWeight={"600"}
                        fontSize={"14px"}
                        sx={{ cursor: "pointer" }}
                      >
                        {formatMessage({ id: "edoc.viewall" })}
                      </Typography>
                    </Box>

                    <TableContainer
                      sx={{
                        // height: "68vh",
                        overflowX: "auto",
                        "&::-webkit-scrollbar": {
                          width: 0,
                        },
                        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                      }}
                    >
                      <Table
                        stickyHeader
                        aria-label="sticky table"
                        size="small"
                      >
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
                            {el?.edocuments?.length < 1 ? (
                              <TableRow>
                                <TableCell colSpan={6}>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      fontSize: "1.2rem",
                                      margin: "1rem 0",
                                    }}
                                  >
                                    <div>
                                      <div>
                                        {formatMessage({ id: "edoc.nodoc" })}
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : (
                              el?.edocuments?.map((docEl, index) => {
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
                                            docEl?.name.split(".").pop() === "pdf" ? pdf :
                                              docEl?.name.split(".").pop() === "docx" ||
                                                docEl?.name.split(".").pop() === "doc" ||
                                                docEl?.name.split(".").pop() === "txt" ? word :
                                                docEl?.name.split(".").pop() === "xls" ||
                                                  docEl?.name.split(".").pop() === "xlsx" ? excel :
                                                  pic
                                          }
                                          alt="file"
                                        />
                                      </span>
                                      <Typography noWrap>
                                        {docEl?.title}
                                      </Typography>
                                    </TableCell>

                                    <TableCell>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "5px",
                                        }}
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
                                                  <div key={index}>
                                                    {el?.name}
                                                  </div>
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
                                        (docEl?.employee?.firstName || "") +
                                        " " +
                                        (docEl?.employee?.lastName || "")
                                      }
                                    >
                                      {docEl?.employee?.firstName ===
                                        undefined ||
                                        docEl?.employee?.lastName ===
                                        undefined ? (
                                        ""
                                      ) : (
                                        <Typography noWrap width={"160px"}>
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
                                      }}
                                      title={
                                        (docEl?.shared_with[0]?.firstName ||
                                          "") +
                                        " " +
                                        (docEl?.shared_with[0]?.lastName || "")
                                      }
                                    >
                                      {docEl?.shared_with?.length < 1 ? (
                                        formatMessage({ id: "edoc.allemployers" })
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
                                          setEditDoc(true);
                                          setDetailInfo(docEl);
                                        }}
                                        disabled={!docEl?.isSharedWithAllEmployers &&
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
                      </Table>
                    </TableContainer>
                  </Box>
                );
              })}
            </InfiniteScroll>
          )}
        </>
      ) : (
        // search by employee name
        <>
          {searchLoading ? (
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
          ) : docsByEmployeeName?.docs?.length < 1 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
                fontSize: "1.2rem",
              }}
            >
              {formatMessage({ id: "employee.norecords" })}
            </div>
          ) : (
            <>
              <TableContainer
                sx={{
                  height: "71vh",
                  overflowX: "auto",
                  "&::-webkit-scrollbar": {
                    width: 0,
                  },
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
              >
                <Table stickyHeader aria-label="sticky table" size="small">
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
                      {docsByEmployeeName?.docs?.length < 1 ? (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "1.2rem",
                                margin: "1rem 0",
                              }}
                            >
                              <div>
                                <div>{formatMessage({ id: "edoc.nodoc" })}</div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        docsByEmployeeName?.docs?.map((docEl, index) => {
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
                                        : docEl?.name.split(".").pop() ===
                                          "docx" ||
                                          docEl?.name.split(".").pop() ===
                                          "doc" ||
                                          docEl?.name.split(".").pop() === "txt"
                                          ? word
                                          : docEl?.name.split(".").pop() ===
                                            "xls" ||
                                            docEl?.name.split(".").pop() ===
                                            "xlsx"
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
                                  }}
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
                                  (docEl?.employee?.firstName || "") +
                                  " " +
                                  (docEl?.employee?.lastName || "")
                                }
                              >
                                {docEl?.employee?.firstName === undefined ||
                                  docEl?.employee?.lastName === undefined ? (
                                  ""
                                ) : (
                                  <Typography noWrap width={"210px"}>
                                    {docEl?.employee?.firstName +
                                      " " +
                                      docEl?.employee?.lastName}
                                  </Typography>
                                )}
                              </TableCell>

                              <TableCell
                                title={
                                  (docEl?.shared_with[0]?.firstName || "") +
                                  " " +
                                  (docEl?.shared_with[0]?.lastName || "")
                                }
                              >
                                {docEl?.shared_with?.length < 1 ? (
                                  ""
                                ) : (
                                  <Typography noWrap width={"180px"}>
                                    {docEl?.shared_with[0]?.firstName +
                                      " " +
                                      docEl?.shared_with[0]?.lastName}
                                  </Typography>
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
                                    setEditDoc(true);
                                    setDetailInfo(docEl);
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
                </Table>
              </TableContainer>
              {docsByEmployeeName?.totalPages > 1 && (
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
                    count={docsByEmployeeName?.totalPages || 1}
                    variant="outlined"
                    shape="rounded"
                    onChange={(e, value) => setSearchPage(value)}
                    page={searchPage}
                  />
                </div>
              )}
            </>
          )}
        </>
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
};
const RightSide = ({
  setLoading,
  load,
  setTitle,
  employeeName,
  setEmployeeName,
  tags,
  tag,
  setTag,
  sort,
  setSort,
  AllEdocs,
  setSearchPage,
  companies,
  getData,
  setGetData,
  companyName,
  setCompanyName,
  setCompanyIds,
  companyIds,
  setData,
  AllEdocsByName,
  setSearchLoading
}) => {
  const { formatMessage } = useLocale();
  const [docInfo, setEditDoc] = useState(false);
  const [timeoutMulti, setTimeoutMulti] = useState(null)
  const navigate = useNavigate();
  const clearFilter = () => {
    setData([])
    setEmployeeName("");
    setCompanyIds(companies ? companies[0]?._id : null);
    setCompanyName(companies ? companies[0]?.name : null);
    setTag("");
    setSearchPage(1);
    setTitle("");
    setSort(1);
    // AllEdocs()
    setLoading(true)
    navigate(location.pathname, {});
  };
  const closeModal = () => {
    setEditDoc(false);
    AllEdocs();
  };

  const handleSearchChange = (e) => {
    try {
      clearTimeout(timeoutMulti)
    }
    catch {

    }
    setEmployeeName(e.target.value)
    setSearchLoading(true)
    setTimeoutMulti(setTimeout(() => {
      AllEdocsByName(e.target.value)
    }, 1500))
  }

  return (
    <>
      <Dialog
        open={docInfo}
        onClose={closeModal}
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
          companies={companies}
          companyName={companyName}
          setCompanyName={setCompanyName}
          setEditDoc={setEditDoc}
          setEmployeeName={setEmployeeName}
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
      <ContFilter>
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

        {employeeName.length < 1 ? (
          <TextField
            select
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "#fff",
                borderRadius: "50px",
                backgroundColor: "var(--color-blue)",
                color: "var(--color-dark-blue)",
                fontWeight: "600",
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
            label={tag === "" ? formatMessage({ id: "edoc.tags" }) : ""}
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            InputLabelProps={{ shrink: false }}
            fullWidth
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
            ) : tags?.length < 1 ? (
              <MenuItem>{formatMessage({ id: "employee.norecords" })}</MenuItem>
            ) : (
              tags?.map((el, index) => {
                return (
                  <MenuItem
                    key={index}
                    value={el?.name}
                    style={{ textTransform: "capitalize" }}
                  >
                    {el?.name}
                  </MenuItem>
                );
              })
            )}
          </TextField>
        ) : (
          ""
        )}

        <Field
          onClick={() => {
            setSort(-sort);
            setLoading(true);
          }}
        >
          <span>{formatMessage({ id: "edoc.sort" })}</span>
          <img src="/icons/Employee/filter.svg" />
        </Field>

        {/* <Field
        >
          <span>{formatMessage({ id: "edoc.date" })}</span>
          <img src="/icons/Employee/filter.svg" />
        </Field> */}

        <hr />
        <Button
          onClick={() => setEditDoc(true)}
          variant="contained"
          size="large"
          sx={{
            backgroundColor: "#002B69 !important",
            borderRadius: "20px",
            textTransform: "capitalize",
            fontWeight: "600",
          }}
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
          }}
        >
          {formatMessage({ id: "edoc.managetags" })}
        </Button>
      </ContFilter>
    </>
  );
};
const Edocuments = () => {
  const companies = JSON.parse(localStorage.getItem("managedCompanies"));
  const { state } = useLocation();
  const [companyIds, setCompanyIds] = useState(
    state?.companyId ? state?.companyId : companies ? companies[0]?._id : null
  );
  const [companyName, setCompanyName] = useState(
    state?.companyId ? companies?.filter((ft) => ft?._id === state?.companyId)[0]?.name : companies ? companies[0]?.name : null
  );

  const [page, setPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState(1);
  const [title, setTitle] = useState("");
  const [employeeName, setEmployeeName] = useState(
    state?.firstName === undefined
      ? ""
      : state?.firstName + " " + state?.lastName
  );
  const [endDate, setEndDate] = useState(dayjs().endOf("day").toISOString());
  const [getData, setGetData] = useState(0);
  const [data, setData] = useState([]);
  const [docsByEmployeeName, setDocsByEmployeeName] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [limit, setLimit] = useState(10);

  // get all edocs by tagname
  const AllEdocs = async () => {
    try {
      const response = await axios.get(
        companyIds
          ? `/v2/edocuments/tags/all?name=${tag}&az_sort=${sort}&title=${title}&page=${page}&limit=${limit}&companyId=${companyIds}`
          : `/v2/edocuments/tags/all?name=${tag}&az_sort=${sort}&title=${title}&page=${page}&limit=${limit}`
      );
      setData(response?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  let tags = [];
  const { allTags, load } = getAllTags(getData, companyIds);
  allTags?.docs?.map((el) => tags.push({ name: el?.name, id: el?._id }));

  useEffect(() => {
    AllEdocs();
  }, [tag, title, sort, page, limit, getData, companyIds, loading]);

  // get edocs by employee name
  const AllEdocsByName = async (searchTerm) => {
    setSearchLoading(true);
    // setSearchPage(1)
    try {
      const response = await axios.get(
        companyIds
          ? `/v2/edocuments?endDate=${endDate}&searchQuery=${searchTerm}&az_sort=${sort}&page=${searchPage}&limit=10&companyId=${companyIds}`
          : `/v2/edocuments?endDate=${endDate}&searchQuery=${searchTerm}&az_sort=${sort}&page=${searchPage}&limit=10`
      );
      setDocsByEmployeeName(response?.data);
      setSearchLoading(false);
    } catch (error) {
      setError(error);
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (employeeName === "") {
      setSearchPage(1);
    }
    if (state?.firstName) {
      AllEdocsByName(state?.firstName + " " + state?.lastName)
    }
  }, [searchPage, sort, getData, companyIds, state]);

  return (
    <SideContainer
      LeftSideComponent={
        <LeftSide
          data={data}
          loading={loading}
          searchLoading={searchLoading}
          getData={getData}
          setGetData={setGetData}
          AllEdocs={AllEdocs}
          searchPage={searchPage}
          setSearchPage={setSearchPage}
          limit={limit}
          setLimit={setLimit}
          employeeName={employeeName}
          setEmployeeName={setEmployeeName}
          docsByEmployeeName={docsByEmployeeName}
          companyIds={companyIds}
          allTags={allTags}
          companyName={companyName}
          tags={tags}
          tag={tag}
        />
      }
      RightSideComponent={
        <RightSide
          AllEdocs={AllEdocs}
          title={title}
          setTitle={setTitle}
          employeeName={employeeName}
          setEmployeeName={setEmployeeName}
          tags={tags}
          tag={tag}
          setTag={setTag}
          setLoading={setLoading}
          load={load}
          sort={sort}
          getData={getData}
          setGetData={setGetData}
          setSort={setSort}
          setSearchPage={setSearchPage}
          companies={companies}
          companyName={companyName}
          setCompanyName={setCompanyName}
          setCompanyIds={setCompanyIds}
          companyIds={companyIds}
          setData={setData}
          AllEdocsByName={AllEdocsByName}
          setSearchLoading={setSearchLoading}
        />
      }
    />
  );
};

export default Edocuments;
