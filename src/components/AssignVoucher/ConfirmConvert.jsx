import React from 'react'
import { Badge, Box, Container, Grid, Typography } from '@mui/material'
import gift from "../../assets/gifticon.png";
import { useLocale } from '../../locales';
import { ArrowRightAlt } from '@mui/icons-material';

const ConfirmConvert = ({ selectedUserState, type, selectedAmount, num, gVouchers, rVouchers }) => {
    const { formatMessage } = useLocale();

    return (
        <Box>
            <Container maxWidth={selectedUserState?.manages?.length > 0 ? "md" : "sm"}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" fontWeight={600} mb={1.5}>
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
                            <Box
                                sx={{
                                    backgroundColor: "#DFEAFC",
                                    textAlign: "center",
                                    padding: ".2rem .5rem",
                                    borderRadius: "8px",
                                }}
                            >
                                <img src={gift} alt="" />
                            </Box>
                            <Typography
                                fontWeight={"600"}
                                textTransform={"capitalize"}
                            >
                                {type} {formatMessage({ id: "evoucher.voucher" })}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" fontWeight={600} mb={1.5}>
                            {formatMessage({ id: "evoucher.voucheramount" })}
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
                            <Box
                                sx={{
                                    backgroundColor: "#DFEAFC",
                                    textAlign: "center",
                                    padding: ".2rem .5rem",
                                    borderRadius: "8px",
                                }}
                            >
                                <Typography
                                    fontSize={"15px"}
                                    fontWeight={"600"}
                                    marginBottom={"-4px"}
                                >
                                    {selectedAmount.amount}
                                </Typography>
                                <Typography fontSize={"11px"}>MAD</Typography>
                            </Box>
                            <Typography
                                fontWeight={"600"}
                                textTransform={"capitalize"}
                            >
                                {num}{" "}
                                {formatMessage({ id: "evoucher.vouchersof" })} {selectedAmount.amount} MAD
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} mt={2}>
                        <Typography variant="body2" fontWeight={600} mb={2.5}>
                            {formatMessage({ id: "evoucher.convertedinto" })}
                        </Typography>

                        <Box sx={{ backgroundColor: "#F7F0F0", height: "9rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Box sx={{ textAlign: "center" }}>
                                <Box
                                    sx={{
                                        backgroundColor: "var(--color-dark-blue)",
                                        textAlign: "center",
                                        padding: ".2rem .7rem",
                                        borderRadius: "8px",
                                        border: "1px solid var(--color-dark-blue)",
                                        cursor: "pointer",
                                    }}
                                >
                                    <Typography
                                        fontSize={"25px"}
                                        fontWeight={"600"}
                                        marginBottom={"-4px"}
                                        color={"#fff"}
                                    >
                                        {selectedAmount?.amount}
                                    </Typography>
                                    <Typography
                                        fontSize={"20px"}
                                        color={"#fff"}
                                    >
                                        MAD
                                    </Typography>
                                </Box>
                                <Typography fontWeight={600} mt={.5}>{num}</Typography>
                            </Box>

                            <ArrowRightAlt sx={{ fontSize: "12rem", color: "var(--color-dark-blue)" }} />

                            <Box sx={{ textAlign: "center" }}>
                                <Badge
                                    max={10000}
                                    badgeContent={(selectedAmount?.amount * num) / 5}
                                    sx={{
                                        "& .MuiBadge-badge": {
                                            backgroundColor: "#B0B6C3",
                                            color: "#000",
                                            marginRight: "5px",
                                        },
                                        "&.MuiBadge-root": { marginBottom: "16px" },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            backgroundColor: "var(--color-dark-blue)",
                                            textAlign: "center",
                                            padding: ".2rem .7rem",
                                            borderRadius: "8px",
                                            border: "1px solid var(--color-dark-blue)",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <Typography
                                            fontSize={"25px"}
                                            fontWeight={"600"}
                                            marginBottom={"-4px"}
                                            color={"#fff"}
                                        >
                                            5
                                        </Typography>
                                        <Typography
                                            fontSize={"20px"}
                                            color={"#fff"}
                                        >
                                            MAD
                                        </Typography>
                                    </Box>
                                </Badge>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default ConfirmConvert