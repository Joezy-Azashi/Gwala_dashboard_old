import React, { useState, useEffect } from 'react'
import { Autocomplete, Box, Button, CircularProgress, Dialog, DialogContent, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import sent from '../../assets/voucherRequest.png'
import axios from 'axios'
import { toast } from "react-toastify";
import { useLocale } from '../../locales';
import { useSelector } from 'react-redux';

function RequestVouchers({ handleCloseRequest }) {
    const [gVouchers, setGVouchers] = useState([
        { amount: "5", quantity: 0 },
        { amount: "30", quantity: 0 },
        { amount: "50", quantity: 0 },
        { amount: "100", quantity: 0 },
        { amount: "500", quantity: 0 },
        { amount: "2500", quantity: 0 }
    ])

    const [rVouchers, setRVouchers] = useState([
        { amount: "5", quantity: 0 },
        { amount: "20", quantity: 0 },
        { amount: "30", quantity: 0 },
        { amount: "50", quantity: 0 },
        { amount: "100", quantity: 0 },
        { amount: "840", quantity: 0 }
    ])

    const { formatMessage } = useLocale();
    const selectedUserState = useSelector((state) => state?.userInfos)
    const [type, setType] = useState("")
    const [selectedAmount, setSelectedAmount] = useState([])
    const [num, setNum] = useState(0)
    const [sendDialog, setSendDialog] = useState(false)
    const [loading, setLoading] = useState(false)
    const [companies, setCompanies] = useState([]);
    const [companyId, setCompanyId] = useState("");

    useEffect(() => {
        setCompanies(selectedUserState?.manages?.filter(ft => ft?.features?.includes("EVOUCHERS") || ft?.features?.includes("ALL")))
    }, [selectedUserState])

    const radioOnChange = (e) => {
        setType(e.target.value);
        setSelectedAmount([]);
        setNum(0)
        setCompanyId("")
        setGVouchers([
            { amount: "5", quantity: 0 },
            { amount: "30", quantity: 0 },
            { amount: "50", quantity: 0 },
            { amount: "100", quantity: 0 },
            { amount: "500", quantity: 0 },
            { amount: "2500", quantity: 0 }
        ]);
        setRVouchers([
            { amount: "20", quantity: 0 },
            { amount: "30", quantity: 0 },
            { amount: "50", quantity: 0 },
            { amount: "100", quantity: 0 },
            { amount: "840", quantity: 0 }
        ])
        document.getElementsByClassName("MuiAutocomplete-clearIndicator")[0]?.click()
    }

    const addNum = () => {
        if (type === "GENERAL") {
            gVouchers[gVouchers.findIndex(obj => obj.amount === selectedAmount.amount)].quantity += 1
            setNum(num + 1)
        } else {
            rVouchers[rVouchers.findIndex(obj => obj.amount === selectedAmount.amount)].quantity += 1;
            setNum(num + 1)
        }
    }

    const subNum = () => {
        if (type === "GENERAL") {
            gVouchers[gVouchers.findIndex(obj => obj.amount === selectedAmount.amount)].quantity -= 1;
            setNum(num - 1)
        } else {
            rVouchers[rVouchers.findIndex(obj => obj.amount === selectedAmount.amount)].quantity -= 1;
            setNum(num - 1)
        }
    }

    const onRequest = () => {
        setLoading(true)
        const data = {
            voucherType: type,
            companyId: selectedUserState?.manages?.length > 0 ? companyId : "",
            vouchers: type === "GENERAL" ? gVouchers.filter((ft) => ft.quantity > 0) : rVouchers.filter((ft) => ft.quantity > 0)
        }
        const url = `${import.meta.env.VITE_BASE_URL}/`
        const token = localStorage.getItem("token");
        axios.post(`${url}v2/request/voucher`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((res) => {
                setSendDialog(true)
                setLoading(false)
            })
            .catch((error) => {
                toast(error?.response?.data?.message, {
                    position: "top-right",
                    type: "error",
                    theme: "colored",
                });
                setLoading(false)
            })
    }

    const closeSendDialog = () => {
        setSendDialog(false)
        handleCloseRequest()
    }

    const buttonDisable = () => {
        if (type === "") { return true }
        if (selectedUserState?.manages?.length > 0 && companyId === "") { return true }
        if (type === "GENERAL" && gVouchers.filter((ft) => ft.quantity > 0).length < 1) { return true }
        if (type === "RESTAURANT" && rVouchers.filter((ft) => ft.quantity > 0).length < 1) { return true }
    }

    return (
        <DialogContent sx={{ padding: "1.3rem 2rem" }}>
            <Box sx={{ minHeight: "20rem" }}>
                <Typography textAlign={"center"} variant='h6' color={"#002B69"} fontWeight={"600"} mb={2}>
                    {formatMessage({ id: "evoucher.requestvoucher" })}
                </Typography>

                <Typography fontWeight={"600"}>{formatMessage({ id: "evoucher.typeof" })}</Typography>
                <Typography fontSize={"12px"}>{formatMessage({ id: "evoucher.note" })}</Typography>

                <FormControl sx={{ margin: "10px 0 15px 30px" }}>
                    <RadioGroup value={type} onChange={(e) => radioOnChange(e)} name="radio-voucher">
                        <FormControlLabel
                            value="GENERAL"
                            control={
                                <Radio
                                    size="small"
                                />
                            }
                            label={formatMessage({ id: "evoucher.generaltype" })}
                        />
                        <FormControlLabel
                            value="RESTAURANT"
                            control={
                                <Radio
                                    size="small"
                                />
                            }
                            label={formatMessage({ id: "evoucher.restauranttype" })}
                        />
                    </RadioGroup>
                </FormControl>

                {selectedUserState?.manages?.length > 0 &&
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        background: "#fff",
                                        borderRadius: "50px",
                                        backgroundColor: "var(--color-blue)"
                                    },
                                    "& fieldset": { border: "none" },
                                    "& .MuiFormLabel-root": {
                                        color: "var(--color-dark-blue) !important",
                                        fontWeight: "600",
                                        fontSize: "15px",
                                        textTransform: "capitalize",
                                    },
                                }}
                                size="small"
                                InputLabelProps={{ shrink: false }}
                                fullWidth
                                options={companies}
                                getOptionLabel={(option) => `${option?.name}`}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={formatMessage({ id: "advance.branch" })}
                                    />
                                )}
                                onChange={(_, value, reason) => {
                                    if (reason === "clear") {
                                        setCompanyId("")
                                        return;
                                    } else {
                                        setCompanyId(value?._id)
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                }

                {type === "" || (selectedUserState?.manages?.length > 0 && companyId === "") ? "" :
                    <>
                        <Typography fontWeight={"600"} mt={2}>{formatMessage({ id: "evoucher.amounttitle" })}</Typography>
                        <Typography fontSize={"12px"}>{formatMessage({ id: "evoucher.amountnote" })}</Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.8 }} mt={2}>
                            {type === "GENERAL" ? gVouchers?.map((el, index) => {
                                return (
                                    <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                                        <Typography
                                            onClick={() => { setSelectedAmount(el); setNum(el?.quantity) }}
                                            variant='body2'
                                            sx={{
                                                backgroundColor: selectedAmount.amount === el?.amount || el.quantity > 0 ? "#002B69" : "",
                                                border: "1px solid #002B69",
                                                padding: "4px 10px",
                                                borderRadius: "20px",
                                                cursor: "pointer",
                                                color: selectedAmount.amount === el?.amount || el.quantity > 0 ? "#fff" : "",
                                                whiteSpace: "nowrap",
                                                zIndex: 1
                                            }}>
                                            {el?.amount} MAD
                                        </Typography>
                                        {el.quantity > 0 &&
                                            <Typography
                                                key={index}
                                                onClick={() => { setSelectedAmount(el); setNum(el?.quantity) }}
                                                variant='body2'
                                                sx={{
                                                    backgroundColor: "#CCD5E1",
                                                    border: "1px solid #002B69",
                                                    padding: "3.5px",
                                                    borderRadius: "0 20px 20px 0",
                                                    borderLeft: "0",
                                                    marginLeft: "-.7rem",
                                                    width: "3rem",
                                                }}>
                                                <span style={{
                                                    backgroundColor: "#F5F5F5",
                                                    width: "1.8rem",
                                                    height: "1.3rem",
                                                    display: "flex",
                                                    justifyContent: 'center',
                                                    alignItems: "center",
                                                    borderRadius: "50%",
                                                    marginLeft: ".7rem",
                                                    overflow: "hidden"
                                                }}>
                                                    {el.quantity}
                                                </span>
                                            </Typography>
                                        }
                                    </Box>
                                )
                            }) :
                                rVouchers?.map((el, index) => {
                                    return (
                                        <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                                            <Typography
                                                onClick={() => { setSelectedAmount(el); setNum(el?.quantity) }}
                                                variant='body2'
                                                sx={{
                                                    backgroundColor: selectedAmount.amount === el?.amount || el.quantity > 0 ? "#002B69" : "",
                                                    border: "1px solid #002B69",
                                                    padding: "4px 10px",
                                                    borderRadius: "20px",
                                                    cursor: "pointer",
                                                    color: selectedAmount.amount === el?.amount || el.quantity > 0 ? "#fff" : "",
                                                    whiteSpace: "nowrap",
                                                    zIndex: 1
                                                }}>
                                                {el?.amount} MAD
                                            </Typography>
                                            {el.quantity > 0 &&
                                                <Typography
                                                    key={index}
                                                    onClick={() => { setSelectedAmount(el); setNum(el?.quantity) }}
                                                    variant='body2'
                                                    sx={{
                                                        backgroundColor: "#CCD5E1",
                                                        border: "1px solid #002B69",
                                                        padding: "3.5px",
                                                        borderRadius: "0 20px 20px 0",
                                                        borderLeft: "0",
                                                        marginLeft: "-.7rem",
                                                        width: "3rem",
                                                    }}>
                                                    <span style={{
                                                        backgroundColor: "#F5F5F5",
                                                        width: "1.8rem",
                                                        height: "1.3rem",
                                                        display: "flex",
                                                        justifyContent: 'center',
                                                        alignItems: "center",
                                                        borderRadius: "50%",
                                                        marginLeft: ".7rem",
                                                        overflow: "hidden"
                                                    }}>
                                                        {el.quantity}
                                                    </span>
                                                </Typography>
                                            }
                                        </Box>
                                    )
                                }
                                )}
                        </Box>

                        {selectedAmount?.amount &&
                            <Box sx={{ display: "flex", justifyContent: "center" }} mt={3}>
                                <Box sx={{
                                    backgroundColor: "#87CEFA",
                                    borderRadius: "13px",
                                    width: '8rem',
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: '5px 10px'
                                }}>
                                    <Box
                                        onClick={() => { num < 1 ? "" : subNum() }}
                                        sx={{
                                            backgroundColor: "#F5F5F5",
                                            width: "1.5rem", height: "1.5rem",
                                            display: "flex",
                                            justifyContent: 'center',
                                            alignItems: "center",
                                            borderRadius: "50%",
                                            cursor: "pointer",
                                            userSelect: "none"
                                        }}>-</Box>
                                    <TextField
                                        autoFocus
                                        type='number'
                                        onKeyPress={(e) => {
                                            const charCode = e.which ? e.which : e.keyCode;
                                            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        value={num}
                                        onChange={(e) => {
                                            setNum(Number(e.target.value));
                                            type === "GENERAL" ? gVouchers[gVouchers.findIndex(obj => obj.amount === selectedAmount.amount)].quantity = Number(e.target.value) :
                                                rVouchers[rVouchers.findIndex(obj => obj.amount === selectedAmount.amount)].quantity = Number(e.target.value)
                                        }}
                                        inputProps={{ style: { textAlign: 'center' } }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                height: "1rem",
                                                width: "3.7rem",
                                            },
                                            "& fieldset": { border: "none" }
                                        }}
                                    />
                                    <Box
                                        onClick={() => addNum()}
                                        sx={{
                                            backgroundColor: "#F5F5F5",
                                            width: "1.5rem",
                                            height: "1.5rem",
                                            display: "flex",
                                            justifyContent: 'center',
                                            alignItems: "center",
                                            borderRadius: "50%",
                                            cursor: "pointer",
                                            userSelect: "none"
                                        }}>+</Box>
                                </Box>
                            </Box>}
                    </>
                }
            </Box>

            <Grid container spacing={2} mt={.5}>
                <Grid item xs={12} sm={6}>
                    <Button
                        onClick={() => handleCloseRequest()}
                        variant="outlined"
                        fullWidth
                        sx={{
                            color: "var(--color-dark-blue) ",
                            backgroundColor: "var(--color-cyan) !important",
                            borderRadius: "20px",
                            textTransform: "capitalize",
                            fontWeight: "600",
                            borderColor: "var(--color-cyan) !important"
                        }}
                    >
                        {formatMessage({ id: "evoucher.cancel" })}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button
                        onClick={() => onRequest()}
                        variant="outlined"
                        fullWidth
                        disabled={buttonDisable()}
                        sx={{
                            color: "#fff !important",
                            backgroundColor: "var(--color-dark-blue) !important",
                            borderRadius: "20px",
                            textTransform: "capitalize",
                            fontWeight: "600",
                            borderColor: "var(--color-dark-blue) !important",
                            opacity: buttonDisable() && 0.5
                        }}
                    >
                        {loading ? <CircularProgress
                            size={25}
                            sx={{
                                color: "#fff !important",
                            }}
                        /> : formatMessage({ id: "evoucher.requestvoucher" })}
                    </Button>
                </Grid>
            </Grid>

            <Dialog
                open={sendDialog}
                onClose={closeSendDialog}
                fullWidth
                maxWidth="xs"
                sx={{ '& .MuiPaper-root': { borderRadius: "20px" } }}
            >
                <DialogContent sx={{ padding: "1rem 1.7rem" }}>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <img src={sent} width={65} alt="sent" />
                    </Box>
                    <Typography textAlign={"center"} variant='h6' color={"#002B69"} fontWeight={"600"} my={1}>
                        {formatMessage({ id: "evoucher.requestvoucher" })}
                    </Typography>
                    <Typography textAlign={"center"} variant='body2' color={"#002B69"} mb={1}>{formatMessage({ id: "evoucher.reviewnote" })}</Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={5}>
                            <Typography textAlign={"center"} variant='body2' color={"#002B69"}>{formatMessage({ id: "evoucher.requestvoucher" })}:</Typography>
                        </Grid>
                        <Grid item xs={7}>
                            {gVouchers?.filter((ft) => ft?.quantity > 0).length > 0 &&
                                <>
                                    <Typography variant='body2' color={"#002B69"} fontWeight={600} textTransform={"uppercase"}>{formatMessage({ id: "evoucher.general" })}</Typography>
                                    {gVouchers?.filter((ft) => ft?.quantity > 0).map((el, index) => {
                                        return (
                                            <Typography key={index} variant='body2' color={"#002B69"}>{el.quantity} of {el.amount} MAD {formatMessage({ id: "evoucher.vouchers" })}</Typography>
                                        )
                                    })}
                                </>
                            }

                            {rVouchers?.filter((ft) => ft.quantity > 0).length > 0 &&
                                <>
                                    <Typography variant='body2' color={"#002B69"} fontWeight={600} mt={1}>{formatMessage({ id: "evoucher.restaurant" })}</Typography>
                                    {rVouchers?.filter((ft) => ft.quantity > 0).map((el, index) => {
                                        return (
                                            <Typography key={index} variant='body2' color={"#002B69"}>{el.quantity} of {el.amount} MAD {formatMessage({ id: "evoucher.vouchers" })}</Typography>
                                        )
                                    })}
                                </>
                            }
                        </Grid>
                    </Grid>

                    <Box sx={{ display: "flex", justifyContent: "center" }} mt={2}>
                        <Button
                            onClick={() => closeSendDialog()}
                            variant="outlined"
                            fullWidth
                            sx={{
                                color: "var(--color-dark-blue) ",
                                backgroundColor: "var(--color-cyan) !important",
                                borderRadius: "20px",
                                textTransform: "capitalize",
                                fontWeight: "600",
                                borderColor: "var(--color-cyan) !important",
                                width: "20rem"
                            }}
                        >
                            {formatMessage({ id: "evoucher.close" })}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </DialogContent>
    )
}

export default RequestVouchers