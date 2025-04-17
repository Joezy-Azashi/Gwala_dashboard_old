import PageSpinner from "../../components/pagespinner/PageSpinner";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import styled from "styled-components";
import React, { useState } from "react";
import { getLostPhoneRequests } from "../../api";
import Button from "../../components/transaction/Button";
import { Confirm, FieldSelect, DateRangePicker } from "../../components/UI";
import axios from "../../api/request";
import { useLocale } from "../../locales";
import Pagination from "@mui/material/Pagination";
import { TableContainer, Table, TableCell, TableHead, TableRow, TableBody } from "@mui/material";
const TabContainer = styled.div`
  tbody > tr {
    :hover * {
      /* background-color: #d9edff; */
      // cursor: pointer;
    }
  }
`;
const Phones = ({ filter, setFilter, companyIds, sort }) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState();
  const [page, setPage] = useState(1);
  const [fetch, setFetch] = useState(0);

  const { formatMessage } = useLocale();
  const { data, loading } = getLostPhoneRequests(page, 10, filter, companyIds, sort, fetch);

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
        setFilter(INITIAL_FILTER);
      }
    } catch (e) { }
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
          // height: "63vh",
          // overflowX: "scroll",
          "&::-webkit-scrollbar": {
            width: 0,
          },
        }}
      >
        {/* <InfiniteScroll
            dataLength={data?.docs?.length || 1}
            next={fetchData}
            hasMore={page != null}
            height={"550px"}
          > */}
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
                        if (Object.keys(el?.user).length == 0) return;
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
                      // onClick={() => navigate(`/employee/${el._id}`)}
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
                            <span style={{ width: "7rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{el?.oldPhone}</span>
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
                            <span style={{ width: "7rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{el?.newPhone}</span>
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
                              <Button
                                border={"none"}
                                color="#87CEFA"
                                onClick={() =>
                                  navigate(`/employee/${el.user._id}`)
                                }
                              >
                                {/* {formatMessage({ id: "advance.profil" })} */}
                                <img src="/icons/profile.svg" width={20} />
                              </Button>

                              <span
                                style={{
                                  opacity:
                                    el?.status === "ACCEPTED" ||
                                      el?.status === "REJECTED"
                                      ? "0.5"
                                      : "",
                                  width: "100%",
                                }}
                              >
                                <Button
                                  color="#FFFFFF"
                                  onClick={() => {
                                    el?.status === "ACCEPTED" ||
                                      el?.status === "REJECTED"
                                      ? ""
                                      : setVisible(el._id);
                                  }}
                                  hover={el?.status === "ACCEPTED" || el?.status === "REJECTED" ? "" : "#6fff2bc7"}
                                  style={{ cursor: el?.status === "ACCEPTED" || el?.status === "REJECTED" ? "default" : "" }}
                                >
                                  <img src="/icons/transaction/confirm.svg" width={15} />
                                </Button>
                              </span>

                              <span
                                style={{
                                  opacity:
                                    el?.status === "ACCEPTED" ||
                                      el?.status === "REJECTED"
                                      ? "0.5"
                                      : "",
                                  width: "100%",
                                }}
                              >
                                <Button
                                  color="#F7F0F0"
                                  onClick={() => {
                                    el?.status === "ACCEPTED" ||
                                      el?.status === "REJECTED"
                                      ? ""
                                      : approveRequest("rejected", el._id);
                                  }}
                                  hover={el?.status === "ACCEPTED" || el?.status === "REJECTED" ? "" : "var(--color-danger)"}
                                  style={{ cursor: el?.status === "ACCEPTED" || el?.status === "REJECTED" ? "default" : "" }}
                                >
                                  <img src="/icons/transaction/cancel.svg" width={15} />
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
        {/* </InfiniteScroll> */}
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
