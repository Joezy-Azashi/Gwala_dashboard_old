import React, { useState } from "react";
import styled from "styled-components";
import { Confirm } from "../../components/UI";
import axios from "../../api/request";
import { useLocale } from "../../locales";
import Pagination from "@mui/material/Pagination";

import {
  TableContainer,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Dialog,
} from "@mui/material";
import PageSpinner from "../../components/pagespinner/PageSpinner";
import { toast } from "react-toastify";
import { getAllTags, getEdocs } from "../../api";
import moment from "moment";
import Button from "../../components/transaction/Button";
import UploadManyFiles from "../../components/E-documents/UploadManyFiles";
import { useNavigate } from "react-router";

const TabContainer = styled.div`
  tbody > tr {
    :hover * {
      /* background-color: #d9edff; */
      cursor: pointer;
    }
  }
`;
const Edocuments = ({ filter, setData, companyIds, sort }) => {
  const companies = JSON.parse(localStorage.getItem("managedCompanies"));
  const [visible, setVisible] = useState();
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState();
  const [visibleKyc, setVisibleKyc] = useState();
  const [page, setPage] = useState(1);
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const { data, loading, refetch } = getEdocs({ page, limit: 10, filter, companyIds, sort });
  const approveRequest = async (type, requestId = visible) => {
    try {
      const result = await axios.patch(
        `v2/edocuments/requests/${requestId}/fulfill`
      );
      if (result?.status === "success") {
        toast(formatMessage({ id: "response.request.edoc.approve" }), {
          position: "top-right",
          theme: "colored",
          type: "success",
        });
        refetch();
      }

      setVisible();
    } catch (e) { }
  };

  const columns = [
    {
      id: "name",
      label: formatMessage({ id: "phone.request.name" }),
      width: 100,
    },
    {
      id: "day",
      label: formatMessage({ id: "phone.request.date" }),
      width: 100,
    },
    {
      id: "date",
      label: formatMessage({ id: "expense.description" }),
      width: 70,
    },
    {
      id: "status",
      label: formatMessage({ id: "phone.request.status" }),
      width: 70,
    },
    {
      id: "actions",
      label: formatMessage({ id: "phone.request.actions" }),
      width: 70,
    },
    {
      id: "",
      label: "",
      width: 30,
    },
  ];
  const handleClose = () => {
    refetch();
    setOpen(false);
  };

  let tags = [];
  const { allTags, load } = getAllTags(0, companyIds);
  allTags?.docs?.map((el) => tags.push({ name: el?.name, id: el?._id }));
  return (
    <TabContainer>
      <Dialog
        open={open}
        onClose={() => handleClose()}
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
          requestId={details}
          tags={tags}
          companies={companies}
          companyIds={companyIds}
          setEditDoc={setOpen}
          refetch={refetch}
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
      <TableContainer
        sx={{
          // height: "63vh",
          // overflowX: "scroll",
          "&::-webkit-scrollbar": {
            width: 0,
          },
        }}
      >
        <Table stickyHeader aria-label="sticky table" size="small">
          <Confirm
            visible={visible}
            cancelText={formatMessage({ id: "advance.confirm.cancel" })}
            confirmText={formatMessage({ id: "advance.confirm.approve" })}
            setHidden={() => setVisible()}
            onCancel={() => setVisible()}
            onSubmit={() => approveRequest("APPROVED")}
          >
            {formatMessage({ id: "advance.confirm.text" })}
          </Confirm>
          {
            <>
              <TableHead>
                <TableRow
                  sx={{
                    "& .MuiTableCell-root": {
                      border: "0px",
                      textAlign: "center",
                      padding: "3px",
                    },
                  }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ width: column.width }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bolder",
                          padding: ".5rem",
                          whiteSpace: "nowrap",
                          backgroundColor: column.label !== "" && "#D9EDFF",
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
                        height: "50vh",
                        fontSize: "1.2rem",
                      }}
                    >
                      {formatMessage({ id: "advance.norecords" })}
                    </div>
                  </TableCell>
                ) : (
                      data?.docs?.map((el, key) => {
                        if (el?.employee.length < 1) return;
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={key}
                        sx={{
                          "& .MuiTableCell-root": {
                            border: "0px",
                            textAlign: "center",
                            padding: "3px",
                          },
                        }}
                      >
                        <TableCell>
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: ".45rem",
                              backgroundColor: "#F7F0F0",
                              whiteSpace: "nowrap",
                              textTransform: "capitalize",
                            }}
                          >
                            {`${el?.employee[0]?.firstName} ${el?.employee[0]?.lastName}`}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: ".45rem",
                              backgroundColor: "#F7F0F0",
                              whiteSpace: "nowrap",
                              textTransform: "capitalize",
                            }}
                          >
                            {moment(el?.createdAt).format("DD/MM/YYYY")}
                          </span>
                        </TableCell>
                        <TableCell
                          sx={{ maxWidth: "400px" }}
                          title={el?.description}
                        >
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: ".45rem",
                              backgroundColor: "#F7F0F0",
                              textTransform: "capitalize",
                            }}
                          >
                            <span
                              style={{
                                width: "100%",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {el?.Message || "N/A"}
                            </span>
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: ".45rem",
                              backgroundColor: "#F7F0F0",
                              whiteSpace: "nowrap",
                              textTransform: "capitalize",
                            }}
                          >
                            {el?.status === "PENDING" ? formatMessage({ id: "advance.pending" }) :
                              el?.status === "pending" ? formatMessage({ id: "advance.pending" }) :
                                el?.status === "PROCESSED" ? formatMessage({ id: "advance.processed" }) :
                                  formatMessage({ id: "advance.rejected" })
                            }
                          </span>
                        </TableCell>
                        <TableCell
                          sx={{
                            textAlign: "center",
                            pointerEvents: el.status !== "PENDING" && "none",
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: ".35rem",
                              // backgroundColor: "#F7F0F0",
                              whiteSpace: "nowrap",
                              textTransform: "capitalize",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                                width: "100%",
                              }}
                            >
                              {el.status !== "APPROVED" ? (
                                <>
                                  <span
                                    style={{
                                      opacity:
                                        el.status !== "PENDING" ? "0.5" : "",
                                      width: "100%",
                                      cursor:
                                        el.status !== "PENDING" &&
                                        "not-allowed",
                                      pointerEvents:
                                        el.status !== "PENDING" && "none",
                                    }}
                                  >
                                    <Button
                                      color="#FFFFFF"
                                      onClick={() => {
                                        el.status === "PENDING" &&
                                          setVisible(el._id);
                                      }}
                                      hover={"#6fff2bc7"}
                                    >
                                      <img src="/icons/transaction/confirm.svg" width={15} />
                                    </Button>
                                  </span>
                                  <span
                                    style={{
                                      opacity:
                                        el.status !== "PENDING" ? "0.5" : "",
                                      width: "100%",
                                      cursor:
                                        el.status !== "PENDING" &&
                                        "not-allowed",
                                      pointerEvents:
                                        el.status !== "PENDING" && "none",
                                    }}
                                  >
                                    <Button
                                      color="#87CEFA"
                                      onClick={() => {
                                        navigate("/e-documents", {
                                          state: {
                                            id: el?.employee[0]?._id,
                                            firstName: el?.employee[0]?.firstName,
                                            lastName: el?.employee[0]?.lastName,
                                            companyId: el?.employee[0]?.company
                                          },
                                        });
                                      }}
                                    >
                                      <img src="/icons/Edocs/document.svg" width={18} />
                                    </Button>
                                  </span>
                                </>
                              ) : (
                                <Button
                                  color="#FFF"
                                  onClick={() => {
                                    setData(el);
                                  }}
                                >
                                  {formatMessage({
                                    id: "timetracker.vacation.details",
                                  })}
                                </Button>
                              )}
                            </div>
                          </span>
                        </TableCell>

                        <TableCell
                          style={{
                            opacity: el.status !== "PENDING" ? "0.5" : "",

                            cursor: el.status !== "PENDING" && "not-allowed",
                            pointerEvents: el.status !== "PENDING" && "none",
                          }}
                        >
                          <img
                            src="/icons/Edocs/upload.svg"
                            onClick={() => {
                              setOpen(true);
                              setDetails(el?._id);
                            }}
                            width={27}
                          />
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
            count={data?.totalPages || 1}
            variant="outlined"
            shape="rounded"
            onChange={(e, value) => setPage(value)}
            page={page}
          />
        </div>
      )}
    </TabContainer>
  );
};

export default Edocuments;
