import React from 'react'
import { Box, Button, CircularProgress, DialogContent, Grid, IconButton, Typography } from '@mui/material'
import { useLocale } from '../../locales';
import resicon from '../../assets/resicon.png'
import { Close } from '@mui/icons-material';
import { IOSSwitch } from '../UI';

function HRVoucherRequestDetail({ openDetail, setOpenDetail, changeStatus, checkLoading }) {
    const { formatMessage } = useLocale();

    return (
        <DialogContent sx={{ padding: "1.3rem 2rem" }}>
            <IconButton sx={{ position: "absolute", right: "1rem", top: "0.5rem" }} onClick={() => setOpenDetail({ state: false })}>
                <Close />
            </IconButton>
            <Typography textAlign={"center"} variant='h6' color={"#002B69"} fontWeight={"600"} mb={2}>
                {formatMessage({ id: "evoucher.requestvoucher" })}
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Typography variant='body2' fontWeight={600} mb={1.5}>
                        {formatMessage({ id: "advance.companyname" })}
                    </Typography>
                    <Typography fontWeight={"600"} color={"var(--color-dark-blue)"} textTransform={"capitalize"} mt={2.7} noWrap>
                        {openDetail?.data?.company?.name}
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant='body2' fontWeight={600} mb={1.5}>
                        {formatMessage({ id: "evoucher.vouchertype" })}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "#002B69",
                            cursor: "pointer",
                        }}
                    >
                        <Box sx={{ backgroundColor: "#DFEAFC", textAlign: "center", padding: ".2rem .5rem", borderRadius: "8px" }}>
                            <img src={resicon} width={30} alt="sent" />
                        </Box>
                        <Typography fontWeight={"600"} noWrap>
                            {openDetail?.data?.voucherType} {formatMessage({ id: "evoucher.voucher" })}
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} mt={2}>
                    <Typography variant='body2' fontWeight={600} mb={2.5}>
                        {formatMessage({ id: "evoucher.voucheramount" })}
                    </Typography>

                    <Grid container spacing={2}>
                        {openDetail?.data?.vouchers?.map((el, index) => {
                            return (
                                <Grid key={index} item xs={12} sm={6}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            color: "#002B69",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <Box sx={{ backgroundColor: "#DFEAFC", textAlign: "center", padding: ".2rem .5rem", borderRadius: "8px" }}>
                                            <Typography fontSize={"15px"} fontWeight={"600"} marginBottom={"-4px"}>{el?.amount}</Typography>
                                            <Typography fontSize={"11px"}>MAD</Typography>
                                        </Box>
                                        <Typography fontWeight={"600"} noWrap>
                                            {el?.quantity} {formatMessage({ id: "evoucher.vouchers" })} of {el?.amount} MAD
                                        </Typography>
                                    </Box>
                                </Grid>
                            )
                        })}
                    </Grid>
                </Grid>
                </Grid>

                {openDetail?.data?.status !== "REJECTED" &&
                    <Grid container spacing={2} mt={3}>
                        {openDetail?.data?.status === "HANDLING" || openDetail?.data?.status === "PROCESSED" ?
                            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <Typography fontWeight={openDetail?.data?.status === "HANDLING" && 600} color={openDetail?.data?.status === "HANDLING" ? "var(--color-dark-blue)" : "gray"}>{formatMessage({ id: "evoucher.handling" })}</Typography>
                                    <IOSSwitch
                                        id="processed"
                                        checked={openDetail?.data?.status === "PROCESSED"}
                                        onClick={(e) => changeStatus(e, "PROCESSED", openDetail?.data?._id)}
                                    />
                                    <Typography fontWeight={openDetail?.data?.status === "PROCESSED" && 600} color={openDetail?.data?.status === "PROCESSED" ? "var(--color-dark-blue)" : "gray"}>{formatMessage({ id: "evoucher.processed" })}</Typography>
                                </Box>
                            </Grid> : ""
                        }

                        <Grid item xs={12} sm={openDetail?.data?.status === "HANDLING" ? 3.5 : 1} />
                        {openDetail?.data?.status === "PROCESSED" ? "" :
                            <>
                                <Grid item xs={12} sm={5}>
                                    <Button
                                        id="rejected"
                                        onClick={(e) => changeStatus(e, "REJECTED", openDetail?.data?._id)}
                                        variant="outlined"
                                        fullWidth
                                        sx={{
                                            color: "#fff ",
                                            backgroundColor: "#FA3E3E !important",
                                            borderRadius: "20px",
                                            textTransform: "capitalize",
                                            fontWeight: "600",
                                            borderColor: "var(--color-cyan) !important"
                                        }}
                                    >
                                        {formatMessage({ id: "advance.confirm.rejeter" })}
                                    </Button>
                                </Grid>
                                {openDetail?.data?.status !== "HANDLING" &&
                                    <Grid item xs={12} sm={5}>
                                        <Button
                                            id="handling"
                                            onClick={(e) => changeStatus(e, "HANDLING", openDetail?.data?._id)}
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

export default HRVoucherRequestDetail