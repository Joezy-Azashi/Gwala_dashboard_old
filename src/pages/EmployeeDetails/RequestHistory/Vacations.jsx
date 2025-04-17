import React, { useState, useEffect } from "react";

import Button from "../../../components/transaction/Button";

import styled from "styled-components";
import { Confirm } from "../../../components/UI";
import axios from "../../../api/request";
import { useLocale } from "../../../locales";
import Pagination from "@mui/material/Pagination";

import {
  TableContainer,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Box,
  Dialog,
} from "@mui/material";
import PageSpinner from "../../../components/pagespinner/PageSpinner";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { getOffdays } from "../../../api";
import { differenceTwoDate } from "../../../utils";
import { useTimeTrackerContext } from "../../../store/context/TimeTrackerContext";
import moment from "moment";
import RejectInfoDialog from "../../../components/UI/RejectInfoDialog";
import RejectApproval from "../../../components/UI/RejectApproval";

const TabContainer = styled.div`
  tbody > tr {
    :hover * {
      /* background-color: #d9edff; */
      // cursor: pointer;
    }
  }
`;
const Vacation = () => {
  const [visible, setVisible] = useState();
  const [page, setPage] = useState(1);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { formatMessage } = useLocale();
  const { id } = useParams();
  const [rejectInfo, setRejectInfo] = useState("");
  const [reason, setReason] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [rejectId, setRejectId] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [getData, setGetData] = useState("");
  const { filter, setRepport } = useTimeTrackerContext();
  const { data, loading } = getOffdays({
    userId: id,
    type: "VACATION",
    filter,
    page,
    getData,
  });
  const approveRequest = async (type, id) => {
    setSubmitLoading(true);
    try {
      const result = await axios.patch(`/v2/off-days/${id}`, {
        status: type,
        rejectReason: rejectReason,
      });

      let message =
        type === "APPROVED"
          ? "response.request.vacation.approve"
          : "response.request.vacation.reject";
      if (result?.status === "success")
        toast(formatMessage({ id: message }), {
          position: "top-right",
          theme: "colored",
          type: "success",
        });
      setOpenReject(false);
      setSaveLoading(false);
      setSubmitLoading(false);
      setRejectReason("");
      setGetData("get");
      setVisible();
    } catch (e) {}
  };

  const columns = [
    {
      id: "name",
      label: formatMessage({ id: "timetracker.vacation.day.requested" }),
      width: 100,
    },
    {
      id: "date",
      label: formatMessage({ id: "timetracker.vacation.from" }),
      width: 70,
    },
    {
      id: "ancien",
      label: formatMessage({ id: "timetracker.vacation.to" }),
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

  return (
    <TabContainer>
      <TableContainer
        sx={{
          height: "68vh",
          overflowX: "scroll",
          "&::-webkit-scrollbar": {
            width: 0,
          },
        }}
      >
        <Table stickyHeader aria-label="sticky table" size="small">
          <Confirm
            submitLoading={submitLoading}
            visible={visible}
            cancelText={formatMessage({ id: "advance.confirm.cancel" })}
            confirmText={formatMessage({ id: "advance.confirm.approve" })}
            setHidden={() => setVisible()}
            onCancel={() => setVisible()}
            onSubmit={() => approveRequest("APPROVED", visible)}
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
                              padding: "1rem",
                              backgroundColor: "#F7F0F0",
                              whiteSpace: "nowrap",
                              textTransform: "capitalize",
                            }}
                          >
                            {`${differenceTwoDate(
                              el.startDate,
                              el.endDate
                            )} days`}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "1rem",
                              backgroundColor: "#F7F0F0",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {el?.startDate &&
                              moment(el.startDate).format("DD/MM/YYYY")}
                          </span>
                        </TableCell>

                        <TableCell>
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "1rem",
                              backgroundColor: "#F7F0F0",
                              whiteSpace: "nowrap",
                              textTransform: "capitalize",
                            }}
                          >
                            {el?.endDate &&
                              moment(el.endDate).format("DD/MM/YYYY")}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "1rem",
                              backgroundColor: "#F7F0F0",
                              whiteSpace: "nowrap",
                              textTransform: "capitalize",
                            }}
                          >
                            {el?.status}
                          </span>
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: ".35rem",
                              backgroundColor: "#F7F0F0",
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
                              {el.status === "APPROVED" ||
                              el.status === "REJECTED" ? (
                                <Button
                                  color="#FFF"
                                  onClick={() => {
                                    setRepport(el);
                                  }}
                                >
                                  {formatMessage({
                                    id: "timetracker.vacation.details",
                                  })}
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    color="#FFFFFF"
                                    onClick={() => setRepport(el)}
                                  >
                                    <img src="/icons/timetracker/document.svg" />
                                  </Button>
                                  <span
                                    style={{
                                      opacity:
                                        el?.status === "APPROVED" ||
                                        el?.status === "REJECTED" ||
                                        el?.status === "EXPIRED"
                                          ? "0.5"
                                          : "",
                                      width: "100%",
                                    }}
                                  >
                                    <Button
                                      color="#FFFFFF"
                                      onClick={() => {
                                        el?.status === "APPROVED" ||
                                        el?.status === "REJECTED" ||
                                        el?.status === "EXPIRED"
                                          ? ""
                                          : setVisible(el._id);
                                      }}
                                      hover={"#6fff2bc7"}
                                      style={{
                                        cursor:
                                          el?.status === "APPROVED" ||
                                          el?.status === "REJECTED" ||
                                          el?.status === "EXPIRED"
                                            ? "default"
                                            : "pointer",
                                      }}
                                    >
                                      <img src="/icons/transaction/confirm.svg" />
                                    </Button>
                                  </span>
                                  <span
                                    style={{
                                      opacity:
                                        el?.status === "APPROVED" ||
                                        el?.status === "REJECTED" ||
                                        el?.status === "EXPIRED"
                                          ? "0.5"
                                          : "",
                                      width: "100%",
                                    }}
                                  >
                                    <Button
                                      color="#F7F0F0"
                                      onClick={() => {
                                        el?.status === "APPROVED" ||
                                          el?.status === "REJECTED";
                                        el?.status === "EXPIRED"
                                          ? ""
                                          : setOpenReject(true);
                                        setRejectId(el?._id);
                                      }}
                                      hover={"var(--color-danger)"}
                                      style={{
                                        cursor:
                                          el?.status === "APPROVED" ||
                                          el?.status === "REJECTED" ||
                                          el?.status === "EXPIRED"
                                            ? "default"
                                            : "pointer",
                                      }}
                                    >
                                      <img src="/icons/transaction/cancel.svg" />
                                    </Button>
                                  </span>
                                </>
                              )}
                            </div>
                          </span>
                        </TableCell>

                        <TableCell>
                          {el?.status === "REJECTED" ? (
                            <img
                              src="/icons/info.svg"
                              onClick={() => {
                                setRejectInfo(el), setReason(true);
                              }}
                              width={24}
                              style={{ cursor: "pointer" }}
                            />
                          ) : null}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </>
          }
        </Table>

        <Dialog
          open={openReject}
          onClose={() => setOpenReject(false)}
          fullWidth
          maxWidth="xs"
        >
          <RejectApproval
            setOpenReject={setOpenReject}
            approveRequest={approveRequest}
            rejectId={rejectId}
            rejectReason={rejectReason}
            setRejectReason={setRejectReason}
            saveLoading={saveLoading}
          />
        </Dialog>

        <Dialog
          open={reason}
          onClose={() => setReason(false)}
          fullWidth
          maxWidth="xs"
        >
          <RejectInfoDialog rejectInfo={rejectInfo} setReason={setReason} />
        </Dialog>
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

export default Vacation;
