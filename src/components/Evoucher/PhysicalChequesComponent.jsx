import React from 'react'
import { Box, Checkbox, Container, FormControlLabel, Grid, IconButton, TextField, Typography } from '@mui/material'
import { useLocale } from '../../locales';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import favicon from "../../assets/faviconblack.png";

const PhysicalChequesComponent = ({ selectedBranch, branchName, selectedAmount, amount, setSelectedAmount, num, setNum, dontShowControls }) => {
    const { formatMessage } = useLocale();

    const addNum = () => {
        if (selectedAmount?.quantity === 0 || num === 500) {
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

    const printAllVouchers = (e) => {
        if (e.target.checked) {
            selectedAmount.quantity += num
            setNum(selectedAmount?.quantity)
            setSelectedAmount({
                amount: selectedAmount.amount,
                quantity: 0,
            })
        } else {
            setSelectedAmount({
                amount: selectedAmount.amount,
                quantity: num,
            })
            setNum(0)
        }
    }

    return (
        <Container maxWidth={"xs"} sx={{ marginTop: "2rem" }}>
            <Grid container spacing={0} mb={3}>
                <Grid item xs={3}>
                    <Box sx={{ backgroundColor: "#fff", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", display: "flex", justifyContent: "center", alignItems: "center", height: "5.9rem", borderRadius: "10px", borderLeft: "5px solid #347AF0", borderRight: "2px dotted var(--color-cyan)" }}>
                        <img src={favicon} alt="favicon" />
                    </Box>
                </Grid>
                <Grid item xs={9}>
                    <Box sx={{ backgroundColor: "#fff", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", padding: "10px 18px", height: "5.9rem", borderRadius: "10px" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography fontSize={"12px"}>{formatMessage({ id: "advance.branch" })}: {selectedBranch?.name || branchName}</Typography>
                            <Typography fontSize={"12px"}>{selectedAmount?.amount || amount} MAD</Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} mt={1}>
                            {dontShowControls ? null : <KeyboardArrowLeft onClick={() => subNum()} />}

                            <TextField
                                autoFocus
                                size="small"
                                type='number'
                                disabled={dontShowControls}
                                onKeyPress={(e) => {
                                    const charCode = e.which ? e.which : e.keyCode;
                                    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                                        e.preventDefault();
                                    }
                                }}
                                value={num}
                                onChange={(e) => {
                                    if (e.target.value > 500) {
                                        setNum(500)
                                        selectedAmount.quantity = JSON.parse(localStorage.getItem("selectedAmount"))?.quantity - 500
                                    } else if (e.target.value > JSON.parse(localStorage.getItem("selectedAmount"))?.quantity) {
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
                                        width: "4rem"
                                    },
                                    "& fieldset": { border: "none" },
                                    "& .MuiOutlinedInput-input": { WebkitTextFillColor: "#000 !important" },
                                }}
                            />

                            {dontShowControls ? null : <KeyboardArrowRight onClick={() => addNum()} />}
                        </Box>
                        <Typography fontSize={"12px"} textAlign={"center"} textTransform={"lowercase"}>{dontShowControls ? formatMessage({ id: "evoucher.physical" }) : formatMessage({ id: "evoucher.toassign" })}</Typography>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}

export default PhysicalChequesComponent