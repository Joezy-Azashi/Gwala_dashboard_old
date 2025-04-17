import React, { useState, useEffect } from "react";

import Button from "../../../components/transaction/Button";

import styled from "styled-components";
import { Confirm } from "../../../components/UI";
import axios from "../../../api/request";
import { useLocale } from "../../../locales";
import Pagination from "@mui/material/Pagination";

import {
  TableContainer,
  Typography,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  TextField,
  MenuItem,
} from "@mui/material";
import PageSpinner from "../../../components/pagespinner/PageSpinner";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { getPhoneRequestsById } from "../../../api";
import { useTimeTrackerContext } from "../../../store/context/TimeTrackerContext";

const TabContainer = styled.div`
  tbody > tr {
    :hover * {
      /* background-color: #d9edff; */
      cursor: pointer;
    }
  }
`;
const Phones = ({}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { filter, sort } = useTimeTrackerContext();
  const [visible, setVisible] = useState();
  const [page, setPage] = useState(1);
  const [fetch, setFetch] = useState(0);
  const { formatMessage } = useLocale();
  const { data, loading } = getPhoneRequestsById(id, page, 10, sort, filter,fetch);
  const approveRequest = async (type, requestId = visible) => {
    try {
      const result = await axios.put(
        `/support/phone/lost/${requestId}?status=${type}`
      );

      let message =
        type == "accepted"
          ? "response.request.phone.approve"
          : "response.request.phone.reject";
      if (result?.status === "success") {
        setFetch(fetch + 1)
        toast(formatMessage({ id: message }), {
          position: "top-right",
          theme: "colored",
          type: "success",
        });
      setVisible();
      }
    } catch (e) {}
  };

  const columns = [
    {
      id: "name",
      label: formatMessage({ id: "phone.request.name" }),
      width: 100,
    },
    {
      id: "date",
      label: formatMessage({ id: "phone.request.date" }),
      width: 70,
    },
    {
      id: "ancien",
      label: formatMessage({ id: "phone.request.old" }),
      width: 70,
    },
    {
      id: "nouveau",
      label: formatMessage({ id: "phone.request.new" }),
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
            visible={visible}
            cancelText={formatMessage({ id: "advance.confirm.cancel" })}
            confirmText={formatMessage({ id: "advance.confirm.approve" })}
            setHidden={() => setVisible()}
            onCancel={() => setVisible()}
            onSubmit={() => approveRequest("accepted")}
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
                          backgroundColor: "#D9EDFF",
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
                  <TableCell colSpan={6}>
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
                  <TableCell colSpan={6}>
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
                            cursor : "default"
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
                            {el?.user?.firstName} {el?.user?.lastName}
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
                            }}
                          >
                            {el?.requestDate &&
                              new Date(el.requestDate)
                                .toISOString()
                                .split("T")[0]}
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
                            {el?.oldPhone}
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
                            {el?.newPhone}
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
                            {el?.status === "ACCEPTED"
                              ? formatMessage({ id: "filter.accepted" })
                              : el?.status === "REJECTED"
                              ? formatMessage({ id: "filter.rejected" })
                              : formatMessage({ id: "filter.pending" })}
                          </span>
                        </TableCell>

                        <TableCell sx={{ textAlign: "center",cursor: el?.status.toLowerCase() !== "pending" ? "default" : "" }} >
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: ".35rem",
                              backgroundColor: "#F7F0F0",
                              whiteSpace: "nowrap",
                              textTransform: "capitalize",
                              cursor: el?.status.toLowerCase() !== "pending" ? "default" : ""
                            }}
                            //style={{ cursor: el?.status.toLowerCase() !== "pending" ? "default" : "" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                                width: "100%",
                                cursor: el?.status.toLowerCase() !== "pending" ? "default" : ""
                              }}
                            >
                              {/* <Button
                                border={"none"}
                                color="#87CEFA"
                                onClick={() =>
                                  navigate(`/employee/${el.user._id}`)
                                }
                              >
                                <img src="/icons/profile.svg" />
                              </Button> */}

                              <span
                                style={{
                                  opacity:
                                  el?.status.toLowerCase() !== "pending"
                                      ? "0.5"
                                      : "",
                                  width: "100%",
                                  cursor: el?.status.toLowerCase() !== "pending" ? "default" : ""
                                }}
                              >
                                <Button
                                  color="#FFFFFF"
                                  onClick={() => {
                                    el?.status.toLowerCase() !== "pending"
                                      ? ""
                                      : setVisible(el._id);
                                  }}
                                  hover={el?.status.toLowerCase() === "pending" ? "#6fff2bc7" : "none"}
                                  style={{ cursor: el?.status.toLowerCase() !== "pending" ? "default" : "" }}
                                  isEnabled = {el?.status.toLowerCase() !== "pending"}
                                >
                                  <img style={{ cursor: el?.status.toLowerCase() !== "pending" ? "default" : "" }} src="/icons/transaction/confirm.svg" />
                                </Button>
                              </span>

                              <span
                                style={{
                                  opacity:
                                  el?.status.toLowerCase() !== "pending"
                                      ? "0.5"
                                      : "",
                                  width: "100%",
                                  cursor: el?.status.toLowerCase() !== "pending" ? "default" : ""
                                }}
                              >
                                <Button
                                  color="#F7F0F0"
                                  onClick={() => {
                                    el?.status.toLowerCase() !== "pending"
                                      ? ""
                                      : approveRequest("rejected", el._id);
                                  }}
                                  hover={el?.status.toLowerCase() === "pending" ? "var(--color-danger)" : "none"}
                                  style={{ cursor: el?.status.toLowerCase() !== "pending" ? "default" : "" }}
                                  isEnabled = {el?.status.toLowerCase() !== "pending"}
                                >
                                  <img src="/icons/transaction/cancel.svg"  style={{ cursor: el?.status.toLowerCase() !== "pending" ? "default" : "" }}/>
                                </Button>
                              </span>
                            </div>
                          </span>
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

export default Phones;
