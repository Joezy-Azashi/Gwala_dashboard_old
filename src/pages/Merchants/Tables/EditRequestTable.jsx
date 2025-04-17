import React, { useEffect, useState } from 'react'
import { Box, Button, Dialog, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import styled from 'styled-components';
import { useLocale } from '../../../locales';
import PageSpinner from '../../../components/pagespinner/PageSpinner';
import EditRequestsDetails from '../../../components/Merchants/EditRequestsDetails';
import moment from 'moment';
import { toast } from 'react-toastify';
import axiosMerchant from '../../../api/merchantRequest';

const TabContainer = styled.div`
  tbody > tr {
    :hover * {
      cursor: pointer;
    }
  }
`;

function EditRequestTable({ pageRequest, setPageRequest, merchantId, status, sort, sortType, startDate, endDate }) {
    const { formatMessage } = useLocale();
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [acceptLoading, setAcceptLoading] = useState(false)
    const [rejectLoading, setRejectLoading] = useState(false)
    const [count, setCount] = useState(1)
    const [openDetail, setOpenDetail] = useState({ data: "", state: false })

    const columns = [
        { id: "manager", label: formatMessage({ id: "merchants.accountowner" }), width: "20%" },
        { id: "concerned", label: formatMessage({ id: "merchants.merchantconcerned" }), width: "16%" },
        { id: "type", label: formatMessage({ id: "merchants.requesttype" }), width: "16%" },
        { id: "date", label: "Date", width: "16%" },
        { id: "status", label: formatMessage({ id: "merchants.status" }), width: "16%" },
        { id: "actions", label: "Actions", width: "16%" }
    ];

    useEffect(() => {
        setLoading(true)

        const endDateDefault = new Date(Date.now())

        const DateRange = [
            ((startDate && startDate.toISOString()) || "2023-01-01T00:00:00.000Z"),
            ((endDate && endDate.toISOString()) || endDateDefault.toISOString()),
        ];

        const whereEdit = {
            ...((merchantId && { merchantId }) || {}),
            ...((status && { requestStatus: status }) || {}),
            ...((DateRange?.length > 0 && { createdAt: { between: DateRange } }) || {}),
        };
        const includeEdit = [
            { relation: "merchant" },
            { relation: "user" }
        ];
        const filterEdit = {
            ...((whereEdit && { where: whereEdit }) || {}),
            ...((sortType && { order: `${sortType} ${sort} ` }) || {}),
            ...((includeEdit && { include: includeEdit }) || {}),
            ...{ limit: 10 },
            ...{ skip: (pageRequest - 1) * 10 },
        };

        axiosMerchant.get(`/edit-requests`, {
            params: {
                filter: {
                    ...filterEdit
                }
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
    }, [pageRequest, merchantId, status, sort, startDate, endDate])

    const changeStatus = (status, id) => {
        setAcceptLoading(status === "accepted" && true)
        setRejectLoading(status === "rejected" && true)

        axiosMerchant.patch(`/edit-requests/${id}`, { requestStatus: status })
            .then((res) => {
                setAcceptLoading(false)
                setRejectLoading(false)
                const nextData = data?.map(el => {
                    if (el.id === id) {
                        return { ...el, requestStatus: status }
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
                                                                    textTransform: "capitalize"
                                                                }}
                                                            >
                                                                {!el?.user ? "-" : `${el?.user?.firstName} ${el?.user?.lastName}`}
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
                                                                {el?.merchant?.name || '-'}
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
                                                                {el?.requestType}
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
                                                                    color: "var(--color-dark-blue)"
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
                                                                    color: el?.requestStatus === 'accepted' ? "green" : el?.requestStatus === 'rejected' ? "rgb(250, 62, 62)" : "var(--color-dark-blue)"
                                                                }}
                                                            >
                                                                {el?.requestStatus}
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

                                                                <Tooltip title={formatMessage({ id: "evoucher.accept" })}>
                                                                    <Box
                                                                        id="accept"
                                                                        onClick={(e) => { el?.requestStatus === "accepted" || el?.requestStatus === "rejected" ? "" : changeStatus("accepted", el?.id), e.stopPropagation() }}
                                                                        sx={{
                                                                            backgroundColor: "var(--color-cyan)",
                                                                            padding: "5px 10px",
                                                                            borderRadius: "15px",
                                                                            display: 'flex',
                                                                            alignItems: "center",
                                                                            '&:hover': { backgroundColor: el?.requestStatus === "rejected" || el?.requestStatus === "accepted" ? "" : "green" },
                                                                            opacity: el?.requestStatus === "rejected" || el?.requestStatus === "accepted" ? "0.5" : ""
                                                                        }}>
                                                                        <img src="/icons/transaction/confirm.svg" width={15} />
                                                                    </Box>
                                                                </Tooltip>

                                                                <Tooltip title={formatMessage({ id: "advance.confirm.rejeter" })}>
                                                                    <Box
                                                                        id="rejected"
                                                                        onClick={(e) => { el?.requestStatus === "accepted" || el?.requestStatus === "rejected" ? "" : changeStatus("rejected", el?.id), e.stopPropagation() }}
                                                                        sx={{
                                                                            border: "1px solid black !important",
                                                                            padding: "5px 10px",
                                                                            borderRadius: "15px",
                                                                            display: 'flex',
                                                                            alignItems: "center",
                                                                            '&:hover': { backgroundColor: el?.requestStatus === "rejected" || el?.requestStatus === "accepted" ? "" : "red" },
                                                                            opacity: el?.requestStatus === "rejected" || el?.requestStatus === "accepted" ? "0.5" : ""
                                                                        }}>
                                                                        <img src="/icons/transaction/cancel.svg" width={15} />
                                                                    </Box>
                                                                </Tooltip>
                                                            </div>
                                                        </TableCell>
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
                        onChange={(e, value) => setPageRequest(value)}
                        page={pageRequest}
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
                <EditRequestsDetails
                    openDetail={openDetail}
                    setOpenDetail={setOpenDetail}
                    acceptLoading={acceptLoading}
                    rejectLoading={rejectLoading}
                    changeStatus={changeStatus}
                />
            </Dialog>
        </TabContainer >
    )
}

export default EditRequestTable