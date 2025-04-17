import React, { useState } from 'react'
import { Box, Button, Dialog, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import styled from 'styled-components';
import { useLocale } from '../../locales';
import axios from 'axios';
import PageSpinner from '../../components/pagespinner/PageSpinner';
import moment from 'moment';
import { IOSSwitch } from '../../components/UI';
import HRVoucherRequestDetail from '../../components/Evoucher/HRVoucherRequestDetail';
import { toast } from "react-toastify";

const TabContainer = styled.div`
  tbody > tr {
    :hover * {
      cursor: pointer;
    }
  }
`;


function HRVoucherRequestTable({ page, setPage, loading, voucherData, setVoucherData, voucherCount }) {
    const { formatMessage } = useLocale();
    const [checkLoading, setCheckLoading] = useState(false)
    const [openDetail, setOpenDetail] = useState({ data: "", state: false })

    const columns = [
        { id: "company", label: formatMessage({ id: "employee.company" }), width: "29%" },
        { id: "type", label: formatMessage({ id: "evoucher.singletypeof" }), width: "14%" },
        { id: "date", label: formatMessage({ id: "advance.date" }), width: "14%" },
        { id: "amount", label: formatMessage({ id: "expense.amount" }), width: "14%" },
        { id: "status", label: formatMessage({ id: "advance.status" }), width: "14%" },
        { id: "action", label: formatMessage({ id: "advance.actions" }), width: "10%" },
        { id: "toggle", label: "", width: "5%" }
    ];

    const changeStatus = (e, status, id) => {
        e.stopPropagation()
        const url = `${import.meta.env.VITE_BASE_URL}/`
        const token = localStorage.getItem("token");

        setCheckLoading(status === "HANDLING" && true)

        axios.patch(`${url}v2/request/vouchers/${id}`, { status: status }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((res) => {
                setCheckLoading(false)
                const nextData = voucherData?.docs?.map(el => {
                    if (el._id === id) {
                        return { ...el, status: status }
                    } else {
                        return el
                    }
                });
                setVoucherData({ docs: nextData });
                if (openDetail.state === true) {
                    setOpenDetail({ data: nextData.filter((ft) => ft._id === id)[0], state: true })
                }
            })
            .catch((error) => {
                toast(error?.response?.data?.message, {
                    position: "top-right",
                    type: "error",
                    theme: "colored",
                });
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
                                                        display: column.id === "toggle" ? "none" : "flex",
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
                                            <TableCell colSpan={7}>
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
                                        </TableRow> :
                                        voucherData?.docs?.length < 1 ?
                                            <TableRow>
                                                <TableCell colSpan={7}>
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
                                            voucherData?.docs?.map((el, index) => {
                                                return (
                                                    <TableRow
                                                        key={index}
                                                        hover
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
                                                                {el?.company?.name}
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
                                                                {el?.voucherType === "GENERAL" ? formatMessage({ id: "evoucher.general" }) : formatMessage({ id: "evoucher.restaurant" })}
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
                                                                {moment(el.createdAt).format("DD/MM/YYYY")}
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
                                                                {el?.vouchers?.reduce((index, rd) => {
                                                                    return index + (rd?.amount * rd?.remainingQantity);
                                                                }, 0)}
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
                                                                    color: el?.status === "PROCESSED" ? "green" : el?.status === "REJECTED" ? "#FA3E3E" : el?.status === "HANDLING" ? "var(--color-dark-blue)" : ""
                                                                }}
                                                            >
                                                                {el?.status === "PENDING" ? formatMessage({ id: "evoucher.pending" }) : el?.status === "REJECTED" ? formatMessage({ id: "evoucher.rejected" }) : el?.status === "HANDLING" ? formatMessage({ id: "evoucher.handling" }) : formatMessage({ id: "evoucher.processed" })}
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
                                                                        onClick={(e) => { el?.status !== "PENDING" ? "" : changeStatus(e, "HANDLING", el?._id) }}
                                                                        sx={{
                                                                            backgroundColor: "var(--color-cyan)",
                                                                            padding: "5px 10px",
                                                                            borderRadius: "15px",
                                                                            display: 'flex',
                                                                            alignItems: "center",
                                                                            cursor: el?.status === "PENDING" ? "pointer" : "default",
                                                                            '&:hover': {backgroundColor: el?.status !== "PENDING" ? "" : "green" },
                                                                            opacity: el?.status !== "PENDING" ? 0.5 : ""
                                                                        }}>
                                                                        <img src="/icons/transaction/confirm.svg" width={15} />
                                                                    </Box>
                                                                </Tooltip>
                                                                <Tooltip title={formatMessage({ id: "evoucher.rejected" })}>
                                                                    <Box
                                                                        id="rejected"
                                                                        onClick={(e) => { el?.status === "REJECTED" || el?.status === "PROCESSED" ? "" : changeStatus(e, "REJECTED", el?._id) }}
                                                                        sx={{
                                                                            border: "1px solid black !important",
                                                                            padding: "5px 10px",
                                                                            borderRadius: "15px",
                                                                            display: 'flex',
                                                                            alignItems: "center",
                                                                            cursor: el?.status === "REJECTED" || el?.status === "PROCESSED" ? "default" : "pointer",
                                                                            '&:hover': {backgroundColor: el?.status === "REJECTED" || el?.status === "PROCESSED" ? "" : "red" },
                                                                            opacity: el?.status === "REJECTED" || el?.status === "PROCESSED" ? 0.5 : ""
                                                                        }}>
                                                                        <img src="/icons/transaction/cancel.svg" width={15} />
                                                                    </Box>
                                                                </Tooltip>
                                                            </div>
                                                        </TableCell>

                                                        {el.status === "PROCESSED" || el.status === "HANDLING" ?
                                                            <Tooltip title={formatMessage({ id: "evoucher.processed" })}>
                                                                <TableCell>
                                                                    <IOSSwitch
                                                                        id="processed"
                                                                        sx={{ opacity: el.status === "PROCESSED" && 0.5 }}
                                                                        checked={el.status === "PROCESSED"}
                                                                        onClick={(e) => { el.status === "PROCESSED" || el.status === "REJECTED" ? "" : changeStatus(e, "PROCESSED", el?._id) }}
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
            </Box>

            {voucherCount > 1 &&
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
                        count={voucherCount}
                        variant="outlined"
                        shape="rounded"
                        onChange={(e, value) => setPage(value)}
                        page={page}
                    />
                </div>
            }

            <Dialog
                open={openDetail.state}
                onClose={() => setOpenDetail({ state: false })}
                fullWidth
                maxWidth="sm"
                sx={{ '& .MuiPaper-root': { borderRadius: "20px" } }}
            >
                <HRVoucherRequestDetail
                    openDetail={openDetail}
                    setOpenDetail={setOpenDetail}
                    changeStatus={changeStatus}
                    checkLoading={checkLoading}
                />
            </Dialog>
        </TabContainer >
    )
}

export default HRVoucherRequestTable