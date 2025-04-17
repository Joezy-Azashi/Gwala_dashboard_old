import React, { useEffect, useState } from 'react'
import { Box, Button, Dialog, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import styled from 'styled-components';
import { useLocale } from '../../../locales';
import { Send } from '@mui/icons-material';
import SmsDetails from '../../../components/GwalaSend/gwalaSMS/SmsDetails';
import axios from '../../../api/request';
import PageSpinner from '../../../components/pagespinner/PageSpinner';
import { toast } from 'react-toastify';
import moment from 'moment';

const TabContainer = styled.div`
  tbody > tr {
    :hover * {
    //   background-color: #d9edff;
    //   cursor: pointer;
    }
  }
`;

const SMSHistory = ({ phoneNumber, status, type, startDate, endDate, loading, setLoading, page, setPage }) => {
    const { formatMessage } = useLocale();
    const [data, setData] = useState([])
    const [count, setCount] = useState(0)
    const [openDetail, setOpenDetail] = useState({ data: "", state: false })
    const [sendLoading, setSendLoading] = useState(false)

    const columns = [
        { id: "phone", label: formatMessage({ id: "settings.phone" }), width: "15%" },
        { id: "type", label: formatMessage({ id: "sms.smstype" }), width: "15%" },
        { id: "body", label: formatMessage({ id: "sms.smsbody" }), width: "30%" },
        { id: "date", label: "Date", width: "10%" },
        { id: "sent", label: formatMessage({ id: "sms.sent" }), width: "15%" },
        { id: "action", label: "Action", width: "15%" },
    ];

    const getSMSHistory = () => {
        setLoading(true)
        axios.get(`/v2/sms?paginated=true&sort=-1&limit=10&page=${page}&phoneNumber=${phoneNumber}&smsType=${type}&isSent=${status}&startDate=${startDate}&endDate=${endDate}`)
            .then((res) => {
                setLoading(false)
                setData(res?.data?.docs)
                setCount(res?.data?.totalPages)
            })
            .catch((error) => {
                setLoading(false)
            })
    }

    useEffect(() => {
        getSMSHistory()
    }, [page, phoneNumber, status, type, startDate, endDate])

    const ResendSMS = (el) => {
        const dataToSend = {
            recipients: [el?.phonenumber],
            message: el?.message,
            type: el?.type || "other"
        }

        setSendLoading(true)
        axios.post('/v2/sms/resend', dataToSend)
            .then((res) => {
                toast(formatMessage({ id: "sms.sendsuccess" }), {
                    position: "top-right",
                    theme: "colored",
                    type: "success",
                });
                setSendLoading(false)
                getSMSHistory()
                setOpenDetail({ state: false })
            })
            .catch((error) => {
                setSendLoading(false)
                toast("An error occured, try again", {
                    position: "top-right",
                    theme: "colored",
                    type: "error",
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
                                                                    textTransform: "capitalize"
                                                                }}
                                                            >
                                                                {el?.type || "-"}
                                                            </span>
                                                        </TableCell>

                                                        <TableCell title={el?.message}>
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
                                                                <span style={{ width: "350px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{el?.message || "-"}</span>
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
                                                                {el?.isSent ? formatMessage({ id: "advance.sent" }) : formatMessage({ id: "advance.notsent" })}
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
                                                                <Tooltip title={formatMessage({ id: "edoc.details" })}>
                                                                    <Box
                                                                        id="details"
                                                                        sx={{
                                                                            backgroundColor: "var(--color-cyan)",
                                                                            padding: "5px 10px",
                                                                            borderRadius: "15px",
                                                                            display: 'flex',
                                                                            alignItems: "center",
                                                                            cursor: "pointer",
                                                                        }}>
                                                                        <img src="/icons/slidingmenu.svg" width={20} />
                                                                    </Box>
                                                                </Tooltip>
                                                                <Button
                                                                    variant="outlined"
                                                                    startIcon={<Send />}
                                                                    sx={{
                                                                        border: "1px solid var(--color-dark-blue) !important",
                                                                        color: "var(--color-dark-blue) !important",
                                                                        textTransform: "capitalize",
                                                                        borderRadius: "15px"
                                                                    }}
                                                                    onClick={(e) => { ResendSMS(el); e.stopPropagation() }}
                                                                >
                                                                    {formatMessage({ id: "sms.resend" })}
                                                                </Button>
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

            {/* Pagination */}
            {count > 1 &&
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
                        count={count}
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
                <SmsDetails
                    openDetail={openDetail}
                    ResendSMS={ResendSMS}
                    sendLoading={sendLoading}
                />
            </Dialog>
        </TabContainer>
    )
}

export default SMSHistory