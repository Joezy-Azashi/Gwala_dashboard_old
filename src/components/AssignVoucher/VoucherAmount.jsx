import React from 'react'
import { Badge, Box, Container, Typography } from '@mui/material';
import { useLocale } from '../../locales';

const VoucherAmount = ({type, gVouchers, rVouchers, setNum, setFile, selectedAmount, setSelectedAmount, setEmployees, vUsers}) => {
    const { formatMessage } = useLocale();

    return (
        <Box>
            <Typography textAlign={"center"} fontWeight={600} fontSize={"1rem"}>
                {formatMessage({ id: "evoucher.amounttitle" })}
            </Typography>
            <Typography textAlign={"center"} variant="body2">
                {formatMessage({ id: "evoucher.chooseamountnote" })}
            </Typography>

            <Container maxWidth={"xs"}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        flexWrap: "wrap",
                        gap: 8,
                        userSelect: "none"
                    }}
                    mt={3}
                >
                    {type === "GENERAL"
                        ? gVouchers?.sort((a, b) => a.amount - b.amount)?.map((el) => {
                            return (
                                <Badge
                                    max={10000}
                                    key={el?.amount}
                                    badgeContent={el?.quantity}
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
                                        onClick={() => {
                                            setNum(0);
                                            setFile([]);
                                            localStorage.setItem("selectedAmount", JSON.stringify(el))
                                            setSelectedAmount(el); setEmployees([
                                                ...vUsers?.docs?.map((el) => {
                                                    return {
                                                        user: el._id,
                                                        quantity: 0,
                                                        fullName: `${el.firstName} ${el.lastName}`,
                                                        selected: false,
                                                    };
                                                })
                                            ]);
                                        }}
                                        sx={{
                                            backgroundColor:
                                                selectedAmount.amount === el?.amount
                                                    ? "var(--color-dark-blue)"
                                                    : "",
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
                                            color={
                                                selectedAmount.amount === el?.amount
                                                    ? "#fff"
                                                    : "var(--color-dark-blue)"
                                            }
                                        >
                                            {el?.amount}
                                        </Typography>
                                        <Typography
                                            fontSize={"20px"}
                                            color={
                                                selectedAmount.amount === el?.amount
                                                    ? "#fff"
                                                    : "var(--color-dark-blue)"
                                            }
                                        >
                                            MAD
                                        </Typography>
                                    </Box>
                                </Badge>
                            );
                        })
                        : rVouchers?.sort((a, b) => a.amount - b.amount)?.map((el) => {
                            return (
                                <Badge
                                    max={10000}
                                    key={el?.amount}
                                    badgeContent={el?.quantity}
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
                                        onClick={() => {
                                            setNum(0);
                                            setFile([]);
                                            localStorage.setItem("selectedAmount", JSON.stringify(el))
                                            setSelectedAmount(el); setEmployees([
                                                ...vUsers?.docs?.map((el) => {
                                                    return {
                                                        user: el._id,
                                                        quantity: 0,
                                                        fullName: `${el.firstName} ${el.lastName}`,
                                                        selected: false,
                                                    };
                                                })
                                            ]);
                                        }}
                                        sx={{
                                            backgroundColor:
                                                selectedAmount.amount === el?.amount
                                                    ? "var(--color-dark-blue)"
                                                    : "",
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
                                            color={
                                                selectedAmount.amount === el?.amount
                                                    ? "#fff"
                                                    : "var(--color-dark-blue)"
                                            }
                                        >
                                            {el?.amount}
                                        </Typography>
                                        <Typography
                                            fontSize={"20px"}
                                            color={
                                                selectedAmount.amount === el?.amount
                                                    ? "#fff"
                                                    : "var(--color-dark-blue)"
                                            }
                                        >
                                            MAD
                                        </Typography>
                                    </Box>
                                </Badge>
                            );
                        })}
                </Box>
            </Container>
        </Box>
    )
}

export default VoucherAmount