import React from 'react'
import { Box, Button, CircularProgress, DialogContent, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { IOSSwitch } from '../UI'
import { useLocale } from '../../locales';
import { Close } from '@mui/icons-material';
import styled from 'styled-components';
import moment from 'moment';

const TabContainer = styled.div`
  tbody > tr {
    :hover * {
    //   background-color: #d9edff;
    //   cursor: pointer;
    }
  }
`;

function ReimbursementDetails({ setOpenDetail, openDetail, changeStatus, checkLoading, cancelLoading }) {
    const { formatMessage } = useLocale();

    const columns = [
        { id: "red", label: formatMessage({ id: "merchants.transref" }), width: "20%" },
        { id: "start", label: formatMessage({ id: "timetracker.startdate" }), width: "30%" },
        { id: "end", label: formatMessage({ id: "timetracker.enddate" }), width: "30%" },
        { id: "amount", label: formatMessage({ id: "merchants.amount" }), width: "20%" }
    ];

    return (
        <DialogContent sx={{ padding: "1.3rem 2rem" }}>
            <IconButton sx={{ position: "absolute", right: "1rem", top: "0.5rem" }} onClick={() => setOpenDetail({ state: false })}>
                <Close />
            </IconButton>
            <Typography textAlign={"center"} variant='h6' color={"#002B69"} fontWeight={"600"} mb={2}>
                {formatMessage({ id: "merchants.totalsales" })}: {moment(openDetail?.data?.startDate).format("DD/MM/YYYY")}
            </Typography>

            <TabContainer>
                <Box sx={{ width: "100%", overflow: "hidden" }}>
                    <TableContainer
                        sx={{
                            overflowX: "hidden",
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
                                        <TableRow
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
                                                    {openDetail?.data?.transactionId}
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
                                                    {openDetail?.data?.startDate ? moment(openDetail?.data?.startDate).format("DD/MM/YYYY") : ""}
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
                                                    {openDetail?.data?.endDate ? moment(openDetail?.data?.endDate).format("DD/MM/YYYY") : ""}
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
                                                    {openDetail?.data?.amount.toFixed(2).replace(/\.?0+$/, '')} MAD
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </>
                            }
                        </Table>
                    </TableContainer>
                </Box>
            </TabContainer>

            {openDetail?.data?.status !== "cancelled" &&
                <Grid container spacing={2} mt={3}>
                    {openDetail?.data?.status === "handling" || openDetail?.data?.status === "processed" ?
                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Typography fontWeight={openDetail?.data?.status === "handling" && 600} color={openDetail?.data?.status === "handling" ? "var(--color-dark-blue)" : "gray"}>{formatMessage({ id: "evoucher.handling" })}</Typography>
                                <IOSSwitch
                                    id="processed"
                                    checked={openDetail?.data?.status === "processed"}
                                    onClick={(e) => { openDetail?.data?.status === "processed" ? "" : changeStatus(e, "processed", openDetail?.data?.id) }}
                                />
                                <Typography fontWeight={openDetail?.data?.status === "processed" && 600} color={openDetail?.data?.status === "processed" ? "var(--color-dark-blue)" : "gray"}>{formatMessage({ id: "evoucher.processed" })}</Typography>
                            </Box>
                        </Grid> : ""
                    }

                    <Grid item xs={12} sm={openDetail?.data?.status === "handling" ? 3.5 : 1} />
                    {openDetail?.data?.status === "processed" ? "" :
                        <>
                            <Grid item xs={12} sm={5}>
                                <Button
                                    id="rejected"
                                    onClick={(e) => changeStatus(e, "cancelled", openDetail?.data?.id)}
                                    variant="outlined"
                                    fullWidth
                                    sx={{
                                        color: "#fff ",
                                        backgroundColor: "#FA3E3E !important",
                                        borderRadius: "20px",
                                        textTransform: "capitalize",
                                        fontWeight: "600",
                                        borderColor: "var(--color-cyan) !important",
                                    }}
                                >
                                    {cancelLoading ? <CircularProgress
                                        size={25}
                                        sx={{
                                            color: "#fff !important",
                                        }}
                                    /> : formatMessage({ id: "advance.confirm.rejeter" })}
                                </Button>
                            </Grid>
                            {openDetail?.data?.status !== "handling" &&
                                <Grid item xs={12} sm={5}>
                                    <Button
                                        id="handling"
                                        onClick={(e) => changeStatus(e, "handling", openDetail?.data?.id)}
                                        variant="outlined"
                                        fullWidth
                                        sx={{
                                            color: "#fff !important",
                                            backgroundColor: "var(--color-dark-blue) !important",
                                            borderRadius: "20px",
                                            textTransform: "capitalize",
                                            fontWeight: "600",
                                            borderColor: "var(--color-dark-blue) !important",
                                        }}
                                    >
                                        {checkLoading ? <CircularProgress
                                            size={25}
                                            sx={{
                                                color: "#fff !important",
                                            }}
                                        /> : formatMessage({ id: "evoucher.accept" })}
                                    </Button>
                                </Grid>}
                        </>
                    }
                    <Grid item xs={12} sm={1} />
                </Grid>
            }
        </DialogContent>
    )
}

export default ReimbursementDetails