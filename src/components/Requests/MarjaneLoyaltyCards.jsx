import React, { useEffect, useState } from 'react'
import { useLocale } from '../../locales';
import { Box, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import PageSpinner from '../pagespinner/PageSpinner';
import styled from 'styled-components';
import axios from '../../api/request';
import Button from '../transaction/Button';
import moment from 'moment';
import { toast } from 'react-toastify';

const TabContainer = styled.div`
  tbody > tr {
    :hover * {
      /* background-color: #d9edff; */
      // cursor: pointer;
    }
  }
`;

const MarjaneLoyaltyCards = ({ filter, page, setPage, cardLoading, setCardLoading }) => {
    const { formatMessage } = useLocale();

    const [data, setData] = useState([])
    const [count, setCount] = useState("")

    const columns = [
        { id: "phone", label: formatMessage({ id: "phone.request.concernednumber" }), width: 100 },
        { id: "requesterphone", label: formatMessage({ id: "phone.request.requestedby" }), width: 100 },
        { id: "date", label: formatMessage({ id: "advance.date" }), width: 70 },
        { id: "company", label: formatMessage({ id: "employee.companylabel" }), width: 70 },
        { id: "amount", label: formatMessage({ id: "employee.amountlabel" }), width: 70 },
        { id: "status", label: formatMessage({ id: "phone.request.status" }), width: 70 },
        { id: "actions", label: formatMessage({ id: "phone.request.actions" }), width: 70, },
    ];

    const getMarjaneDate = () => {
        setCardLoading(true)

        const { status, company, startDate, endDate, sort, phonenumber, requesterPhone } = filter;
        const filters = {
            ...((status && { status: status }) || {}),
            ...((startDate && { startDate }) || {}),
            ...((endDate && { endDate }) || {}),
            ...((sort && { sortByAmount: sort }) || {}),
            ...((phonenumber && { phone: phonenumber }) || {}),
            ...((requesterPhone && { requesterPhone }) || {}),
            ...((company && { companyId: company }) || {}),
        };
        const queryParams = new URLSearchParams({ ...filters });

        axios.get(`/v2/marjane/requests?page=${page}&limit=${10}&${queryParams}`)
            .then((res) => {
                setData(res)
                setCount(res?.giftCards?.totalPages)
                setCardLoading(false)
            })
            .catch((error) => {
                setCardLoading(false)
            })
    }

    useEffect(() => {
        getMarjaneDate()
    }, [page, filter])

    const confirmOrder = (e, status, id, amount, userId) => {
        e.stopPropagation()

        const dataToSend = {
            amount: amount,
            transactionId: id,
            userId: userId,
            status: status
        }
        axios.patch(`/v2/marjane/confirm/order`, dataToSend)
            .then((res) => {
                if (res?.status === "success") {
                    toast(formatMessage({ id: "phone.request.statuschangesuccess" }), {
                        position: "top-right",
                        theme: "colored",
                        type: "success",
                    });

                    const newData = data?.giftCards?.docs?.map(el => {
                        if (el?._id === res?.updatedData?._id) {
                            return { ...el, status: status }
                        } else {
                            return el
                        }
                    });
                    setData({ giftCards: { docs: newData } })
                } else if (res?.response?.data?.errorKey === "RemainingAmount.cannot.be.covered.with.vouchers") {
                    toast(formatMessage({ id: "phone.request.balanceerror" }), {
                        position: "top-right",
                        theme: "colored",
                        type: "error",
                    });
                } {
                    toast(res?.response?.data?.message, {
                        position: "top-right",
                        theme: "colored",
                        type: "error",
                    });
                }
            })
            .catch((error) => {
                toast(error?.response?.data?.message, {
                    position: "top-right",
                    theme: "colored",
                    type: "error",
                });
            })
    }

    return (
        <TabContainer>
            <TableContainer
                sx={{
                    "&::-webkit-scrollbar": {
                        width: 0,
                    },
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
                                {cardLoading ? (
                                    <TableRow>
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
                                    </TableRow>
                                ) : data?.giftCards?.docs?.length < 1 ? (
                                    <TableRow>
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
                                    </TableRow>
                                ) : (
                                    data?.giftCards?.docs?.map((el, key) => {

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
                                                        {el?.phonenumber}
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
                                                        {el?.user?.phone?.number || "-"}
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
                                                        {el?.company?.name || "-"}
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
                                                        {el?.amount}
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
                                                        {el?.status === "PURCHASED"
                                                            ? formatMessage({ id: "phone.request.purchased" })
                                                            : el?.status === "REJECTED"
                                                                ? formatMessage({ id: "filter.rejected" })
                                                                : formatMessage({ id: "phone.request.requested" })}
                                                    </span>
                                                </TableCell>

                                                <TableCell>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            gap: 15,
                                                            alignItems: "center",
                                                            width: "100%",
                                                        }}
                                                    >
                                                        <Tooltip title={formatMessage({ id: "phone.request.purchase" })}>
                                                            <Box
                                                                id="purchase"
                                                                onClick={(e) => { el?.status === "REQUESTED" ? confirmOrder(e, "PURCHASED", el?._id, el?.amount, el?.userId) : {} }}
                                                                sx={{
                                                                    backgroundColor: "var(--color-cyan)",
                                                                    padding: "5px 10px",
                                                                    borderRadius: "15px",
                                                                    display: 'flex',
                                                                    alignItems: "center",
                                                                    cursor: el?.status === "REQUESTED" ? "pointer" : "default",
                                                                    '&:hover': { backgroundColor: el?.status === "REQUESTED" ? "green" : "" },
                                                                    opacity: el?.status === "PURCHASED" || el?.status === "REJECTED" ? 0.5 : ""
                                                                }}>
                                                                <img src="/icons/transaction/confirm.svg" width={15} />
                                                            </Box>
                                                        </Tooltip>
                                                        <Tooltip title={formatMessage({ id: "advance.confirm.rejeter" })}>
                                                            <Box
                                                                id="rejected"
                                                                onClick={(e) => { el?.status === "REQUESTED" ? confirmOrder(e, "REJECTED", el?._id, el?.amount, el?.userId) : {} }}
                                                                sx={{
                                                                    border: "1px solid black !important",
                                                                    padding: "5px 10px",
                                                                    borderRadius: "15px",
                                                                    display: 'flex',
                                                                    alignItems: "center",
                                                                    cursor: el?.status === "REQUESTED" ? "pointer" : "default",
                                                                    '&:hover': { backgroundColor: el?.status === "REQUESTED" ? "red" : "" },
                                                                    opacity: el?.status === "PURCHASED" || el?.status === "REJECTED" ? 0.5 : ""
                                                                }}>
                                                                <img src="/icons/transaction/cancel.svg" width={15} />
                                                            </Box>
                                                        </Tooltip>
                                                    </div>
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
            {count > 1 && (
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
                        count={count || 1}
                        variant="outlined"
                        shape="rounded"
                        onChange={(e, value) => setPage(value)}
                        page={page}
                    />
                </div>
            )}
        </TabContainer>
    )
}

export default MarjaneLoyaltyCards