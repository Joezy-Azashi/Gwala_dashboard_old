import React from 'react'
import { Badge, Box, Container, TextField, Typography } from '@mui/material';
import { useLocale } from '../../locales';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

const VoucherAmountConvert = ({ type, gVouchers, rVouchers, num, setNum, selectedAmount, setSelectedAmount }) => {
    const { formatMessage } = useLocale();

    const addNum = () => {
        if (selectedAmount?.quantity === 0) {
            return
        } else {
            selectedAmount.quantity--;
            setNum(num + 1)
        }
    }

    const subNum = () => {
        if (num === 0) {
            return
        } else {
            selectedAmount.quantity++;
            setNum(num - 1)
        }
    }

    return (
        <Box>
            <Typography textAlign={"center"} fontWeight={600} fontSize={"1rem"}>
                {formatMessage({ id: "evoucher.amounttitle" })}
            </Typography>
            <Typography textAlign={"center"} variant="body2">
                {formatMessage({ id: "evoucher.chooseamounttoconvert" })}
            </Typography>

            <Container maxWidth={"xs"}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        flexWrap: "wrap",
                        gap: 5,
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
                                    <Box>
                                        <Box
                                            onClick={() => {
                                                if (el?.amount !== 5) {
                                                    selectedAmount.quantity += num
                                                    setNum(0);
                                                    localStorage.setItem("selectedAmount", JSON.stringify(el))
                                                    setSelectedAmount(el);
                                                }
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
                                                cursor: el?.amount === 5 ? "not-allowed" : "pointer",
                                                opacity: el?.amount === 5 && 0.5
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
                                        {selectedAmount?.amount === el?.amount &&
                                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} mt={1}>
                                                <KeyboardArrowLeft onClick={() => subNum()} />

                                                <TextField
                                                    autoFocus
                                                    size="small"
                                                    type='number'
                                                    // disabled={dontShowControls}
                                                    onKeyPress={(e) => {
                                                        const charCode = e.which ? e.which : e.keyCode;
                                                        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    value={num}
                                                    onChange={(e) => {
                                                        if (e.target.value > JSON.parse(localStorage.getItem("selectedAmount"))?.quantity) {
                                                            setNum(JSON.parse(localStorage.getItem("selectedAmount"))?.quantity)
                                                            selectedAmount.quantity = 0
                                                        } else {
                                                            setNum(Number(e.target.value));
                                                            selectedAmount.quantity += num
                                                            selectedAmount.quantity -= Number(e.target.value)
                                                        }
                                                    }}
                                                    inputProps={{ style: { textAlign: 'center' } }}
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            height: "1rem",
                                                            width: "2.2rem"
                                                        },
                                                        "& fieldset": { border: "none" },
                                                        "& .MuiOutlinedInput-input": { WebkitTextFillColor: "#000 !important", padding: "0", fontWeight: 600 },
                                                    }}
                                                />

                                                <KeyboardArrowRight onClick={() => addNum()} />
                                            </Box>
                                        }
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
                                    <Box>
                                        <Box
                                            onClick={() => {
                                                if (el?.amount !== 5) {
                                                    selectedAmount.quantity += num
                                                    setNum(0);
                                                    localStorage.setItem("selectedAmount", JSON.stringify(el))
                                                    setSelectedAmount(el);
                                                }
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
                                        {selectedAmount?.amount === el?.amount &&
                                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} mt={1}>
                                                <KeyboardArrowLeft onClick={() => subNum()} />

                                                <TextField
                                                    autoFocus
                                                    size="small"
                                                    type='number'
                                                    // disabled={dontShowControls}
                                                    onKeyPress={(e) => {
                                                        const charCode = e.which ? e.which : e.keyCode;
                                                        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    value={num}
                                                    onChange={(e) => {
                                                        if (e.target.value > JSON.parse(localStorage.getItem("selectedAmount"))?.quantity) {
                                                            setNum(JSON.parse(localStorage.getItem("selectedAmount"))?.quantity)
                                                            selectedAmount.quantity = 0
                                                        } else {
                                                            setNum(Number(e.target.value));
                                                            selectedAmount.quantity += num
                                                            selectedAmount.quantity -= Number(e.target.value)
                                                        }
                                                    }}
                                                    inputProps={{ style: { textAlign: 'center' } }}
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            height: ".5rem",
                                                            width: "2.2rem"
                                                        },
                                                        "& fieldset": { border: "none" },
                                                        "& .MuiOutlinedInput-input": { WebkitTextFillColor: "#000 !important", padding: "0" },
                                                    }}
                                                />

                                                <KeyboardArrowRight onClick={() => addNum()} />
                                            </Box>
                                        }
                                    </Box>
                                </Badge>
                            );
                        })}
                </Box>
            </Container>
        </Box>
    )
}

export default VoucherAmountConvert