import React, { useEffect, useState } from 'react'
import { Box, Button, Dialog, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import styled from 'styled-components';
import { useLocale } from '../../../locales';
import { toast } from 'react-toastify';
import PageSpinner from '../../../components/pagespinner/PageSpinner';
import { IOSSwitch } from '../../../components/UI';
import ReimbursementDetails from '../../../components/Merchants/ReimbursementDetails';
import moment from 'moment';
import axiosMerchant from '../../../api/merchantRequest';

const TabContainer = styled.div`
  tbody > tr {
    :hover * {
    //   background-color: #d9edff;
    //   cursor: pointer;
    }
  }
`;

function ReimbursementsTable({ page, setPage, merchantId, status, services, sort, sortType, reimbursementTime, startDate, endDate }) {
    const { formatMessage } = useLocale();
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [count, setCount] = useState(0)
    const [checkLoading, setCheckLoading] = useState(false)
    const [cancelLoading, setCancelLoading] = useState(false)
    const [processedLoading, setProcessedLoading] = useState(false)
    const [openDetail, setOpenDetail] = useState({ data: "", state: false })

    const columns = [
        { id: "merhchant", label: formatMessage({ id: "merchants.merchant" }), width: "20%" },
        { id: "service", label: "Service", width: "16%" },
        { id: "date", label: "Date", width: "8%" },
        { id: "reimbursementtime", label: formatMessage({ id: "merchants.reimbursementtime" }), width: "8%" },
        { id: "amount", label: formatMessage({ id: "merchants.amount" }), width: "16%" },
        { id: "status", label: formatMessage({ id: "merchants.status" }), width: "16%" },
        { id: "action", label: "Action", width: "16%" },
    ];

    useEffect(() => {
        setLoading(true)

        // start date
        const UTCStartDate = new Date(
            new Date(startDate).getTime() -
            new Date(startDate).getTimezoneOffset() * 60000
        );
        // end date
        const endOfDay = new Date(
            moment(endDate).endOf("day").toISOString()
        );

        const UTCEndDate = new Date(
            endOfDay.getTime() - endOfDay.getTimezoneOffset() * 60000
        );

        const whereReimbursement = {
            ...((merchantId && { merchantId }) || {}),
            ...((status && { status }) || {}),
            ...((startDate && { startDate: { gte: UTCStartDate.toISOString() } }) || {}),
            ...((endDate && { endDate: { lte: UTCEndDate.toISOString() } }) || {}),
        };
        const includeReimbursement = [
            { relation: "merchant" }
        ];
        const filterReimbursement = {
            ...((whereReimbursement && { where: whereReimbursement }) || {}),
            ...((sortType && { order: `${sortType} ${sort} ` }) || {}),
            ...((includeReimbursement && { include: includeReimbursement }) || {}),
            ...{ limit: 10 },
            ...{ skip: (page - 1) * 10 },
        };

        axiosMerchant.get(`/reimbursements`, {
            params: {
                filter: {
                    ...filterReimbursement
                },
                ...((reimbursementTime && { reimburseFrequency: reimbursementTime }) || {})
            }
        })
            .then((res) => {
                setLoading(false)
                setData(res?.data?.docs)
                setCount(res?.data?.totalItems)
            })
            .catch((error) => {
                setLoading(false)
            })
    }, [page, merchantId, status, services, sort, sortType, reimbursementTime, startDate, endDate])

    const changeStatus = (e, status, id) => {
        e.stopPropagation()

        setCheckLoading(status === "handling" && true)
        setCancelLoading(status === "cancelled" && true)
        setProcessedLoading(status === "processed" && true)

        axiosMerchant.patch(`/reimbursements/${id}`, { status: status })
            .then((res) => {
                setCheckLoading(false)
                setCancelLoading(false)
                setProcessedLoading(false)
                const nextData = data?.map(el => {
                    if (el.id === id) {
                        return { ...el, status: status }
                    } else {
                        return el
                    }
                });
                setData(nextData);
                if (openDetail.state === true) {
                    setOpenDetail({ data: nextData.filter((ft) => ft.id === id)[0], state: false })
                }
            })
            .catch((error) => {
                toast(error?.response?.data?.message, {
                    position: "top-right",
                    type: "error",
                    theme: "colored",
                });
                setCheckLoading(false)
                setCancelLoading(false)
                setProcessedLoading(false)
            })
    }

    return (
        <TabContainer>
            <Box sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer
                    sx={{
                        overflowX: "auto",
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
                                                style={{ width: column.width }}
                                            >
                                                <span
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontWeight: "bolder",
                                                        padding: column.id === "icon" ? "" : ".5rem",
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
                                    {loading ?
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        height: "45vh",
                                                    }}
                                                >
                                                    <PageSpinner />
                                                </div>
                                            </TableCell>
                                        </TableRow> :
                                        data?.length < 1 ?
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
                                                        {formatMessage({ id: "employee.norecords" })}
                                                    </div>
                                                </TableCell>
                                            </TableRow> :
                                            data?.map((el, index) => {
                                                return (
                                                    <TableRow
                                                        hover
                                                        key={index}
                                                        role="checkbox"
                                                        tabIndex={-1}
                                                        sx={{
                                                            "& .MuiTableCell-root": {
                                                                border: "0px",
                                                                textAlign: "center",
                                                                padding: "3px",
                                                            },
                                                        }}
                                                        onClick={() => setOpenDetail({ data: el, state: true })}
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
                                                                {el?.merchant?.name || "-"}
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
                                                                    textTransform: "capitalize"
                                                                }}
                                                            >
                                                                {el?.merchant?.serviceType || "-"}
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
                                                                {el?.merchant?.reimburseFrequency}
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
                                                                    textTransform: "capitalize"
                                                                }}
                                                            >
                                                                {el?.amount.toFixed(2).replace(/\.?0+$/, '')} MAD
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
                                                                    color: el?.status === "processed" ? "green" : el?.status === "cancelled" ? "#FA3E3E" : el?.status === "handling" ? "var(--color-dark-blue)" : ""
                                                                }}
                                                            >
                                                                {el?.status}
                                                            </span>
                                                        </TableCell>

                                                        <TableCell>
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    gap: "10px",
                                                                    alignItems: "center",
                                                                    width: "100%",
                                                                }}
                                                            >

                                                                <Button id="detail_btn" disableElevation variant='contained' sx={{ backgroundColor: "var(--color-cyan) !important", color: "var(--color-dark-blue)", textTransform: "capitalize", borderRadius: "18px" }}>
                                                                    {formatMessage({ id: "edoc.details" })}
                                                                </Button>
                                                                <Tooltip title={formatMessage({ id: "evoucher.handling" })}>
                                                                    <Box
                                                                        id="handling"
                                                                        onClick={(e) => { el?.status !== "pending" || !el?.merchant?.name ? e.stopPropagation() : changeStatus(e, "handling", el?.id) }}
                                                                        sx={{
                                                                            backgroundColor: "var(--color-cyan)",
                                                                            padding: "5px 10px",
                                                                            borderRadius: "15px",
                                                                            display: 'flex',
                                                                            alignItems: "center",
                                                                            cursor: el?.status === "pending" ? "pointer" : !el?.merchant?.name ? "default" : "default",
                                                                            '&:hover': { backgroundColor: el?.status !== "pending" ? "" : "green" },
                                                                            opacity: el?.status !== "pending" || !el?.merchant?.name ? 0.5 : ""
                                                                        }}>
                                                                        <img src="/icons/transaction/confirm.svg" width={15} />
                                                                    </Box>
                                                                </Tooltip>
                                                                <Tooltip title={formatMessage({ id: "evoucher.rejected" })}>
                                                                    <Box
                                                                        id="rejected"
                                                                        onClick={(e) => { el?.status === "cancelled" || el?.status === "processed" || !el?.merchant?.name ? e.stopPropagation() : changeStatus(e, "cancelled", el?.id) }}
                                                                        sx={{
                                                                            border: "1px solid black !important",
                                                                            padding: "5px 10px",
                                                                            borderRadius: "15px",
                                                                            display: 'flex',
                                                                            alignItems: "center",
                                                                            cursor: el?.status === "cancelled" || el?.status === "processed" ? "default" : "pointer",
                                                                            '&:hover': { backgroundColor: el?.status === "cancelled" || el?.status === "processed" ? "" : "red" },
                                                                            opacity: el?.status === "cancelled" || el?.status === "processed" || !el?.merchant?.name ? 0.5 : ""
                                                                        }}>
                                                                        <img src="/icons/transaction/cancel.svg" width={15} />
                                                                    </Box>
                                                                </Tooltip>
                                                            </div>
                                                        </TableCell>

                                                        {el.status === "processed" || el.status === "handling" ?
                                                            <Tooltip title={formatMessage({ id: "evoucher.processed" })}>
                                                                <TableCell>
                                                                    <IOSSwitch
                                                                        id="processed"
                                                                        sx={{ opacity: el.status === "processed" && 0.5 }}
                                                                        checked={el.status === "processed"}
                                                                        onClick={(e) => { el.status === "processed" || el.status === "cancelled" ? "" : changeStatus(e, "processed", el?.id) }}
                                                                    />

                                                                </TableCell>
                                                            </Tooltip> : ""
                                                        }
                                                    </TableRow>
                                                )
                                            })
                                    }
                                </TableBody>
                            </>
                        }
                    </Table>
                </TableContainer>

                <Dialog
                    open={openDetail.state}
                    onClose={() => setOpenDetail({ state: false })}
                    fullWidth
                    maxWidth="md"
                    sx={{ '& .MuiPaper-root': { borderRadius: "20px" } }}
                >
                    <ReimbursementDetails
                        openDetail={openDetail}
                        setOpenDetail={setOpenDetail}
                        changeStatus={changeStatus}
                        checkLoading={checkLoading}
                        cancelLoading={cancelLoading}
                        processedLoading={processedLoading}
                    />
                </Dialog>
            </Box>

            {/* Pagination */}
            {count > 10 &&
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
                        count={Math.ceil(count / 10)}
                        variant="outlined"
                        shape="rounded"
                        onChange={(e, value) => setPage(value)}
                        page={page}
                    />
                </div>
            }
        </TabContainer>
    )
}

export default ReimbursementsTable