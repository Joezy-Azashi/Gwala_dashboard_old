import React, { useState } from 'react';
import { Autocomplete, Box, Button, CircularProgress, DialogContent, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { useLocale } from '../../locales';
import { TextField } from '../UI';
import axiosMerchant from '../../api/merchantRequest';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { BorderColorOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import axios from '../../api/request';
import moment from 'moment';

const invoiceNoCheck = /\/\d{2}$/

const GenerateInvoice = ({ setOpenInvoice }) => {
    const { formatMessage } = useLocale();
    const navigate = useNavigate()

    const [invoiceNo, setInvoiceNo] = useState("")
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [allMerchants, setAllMerchants] = useState([]);
    const [selectedMerchant, setSelectedMerchant] = useState([]);
    const [eNameLoading, setENameLoading] = useState(false);
    const [openDropDown, setOpenDropDown] = useState(false);
    const [loading, setloading] = useState(false)

    const searchMerchants = async (text) => {
        const replacements = [['’', "'"], ['`', "'"], ['‘', "'"]];
        const replacedMerchantName = replacements.reduce((acc, [pattern, replacement]) => acc.replace(new RegExp(pattern, 'g'), replacement), text);

        setENameLoading(true)
        if (text[0] === "+") {
            setENameLoading(false)
            setOpenDropDown(true)
            setAllMerchants([])
        } else if (text?.length >= 2) {
            setOpenDropDown(true);
            const data = await axiosMerchant.get(`/merchants`, {
                params: {
                    filter: {
                        limit: 1000,
                        where: {
                            name: {
                                regexp: `/${replacedMerchantName}/i`
                            }
                        },
                        fields: {
                            name: true,
                            id: true,
                            ICE: true,
                            RC: true,
                            address: true
                        }
                    }
                }
            })
            if (data) {
                setENameLoading(false)
            }
            setAllMerchants(data?.data?.docs)
        } else {
            setOpenDropDown(false);
            const filteredUsers = allMerchants?.filter((user) => {
                const userName = `${user?.name}`;
                return userName.toLowerCase().includes(replacedMerchantName.toLowerCase());
            });
            setAllMerchants([...filteredUsers]);
        }
    };

    const generateInvoice = async () => {
        if (startDate && endDate) {
            // start date
            const UTCStartDate = new Date(
                new Date(startDate).getTime() -
                new Date(startDate).getTimezoneOffset() * 60000
            );
            // end date
            const endOfDay = new Date(
                moment(endDate).endOf("day").toISOString()
            );

            const UTCEndDate = new Date(
                endOfDay.getTime() - endOfDay.getTimezoneOffset() * 60000
            );

            const dataToSend = {
                invoiceNumber: `${parseInt(invoiceNo.split("/")[0])}/${invoiceNo.split("/")[1]}`,
                startDate: UTCStartDate,
                endDate: UTCEndDate,
                merchantId: selectedMerchant?.id
            }

            if (!invoiceNoCheck.test(invoiceNo)) {
                toast(formatMessage({ id: "merchants.invoicenumbercheck" }), {
                    theme: "colored",
                    type: "error",
                });
            } else {
                setloading(true)
                try {
                    const response = await axiosMerchant.post('/invoices', dataToSend)
                    setloading(false)
                    if (response?.response?.data?.error) {
                        toast(response?.response?.data?.error?.message, {
                            theme: "colored",
                            type: "error",
                        });
                    } else if (response?.response?.status === 404) {
                        toast(formatMessage({ id: "merchants.noinvoice" }), {
                            theme: "colored",
                            type: "error",
                        });
                    } else {
                        const a = document.createElement('a');
                        a.href = response?.data?.url;
                        a.target = "_blank"
                        a.download = `${dataToSend.invoiceNumber}_invoice.pdf`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                        setOpenInvoice(false)
                    }
                } catch (error) {
                    setloading(false)
                    setOpenInvoice(false)
                }
            }
        }
    }

    return (
        <DialogContent>
            {selectedMerchant?.id &&
                <Box sx={{ position: "absolute", right: "20px" }}>
                    <Tooltip title={formatMessage({ id: "merchants.edit" })}>
                        <IconButton onClick={() => selectedMerchant?.id ? navigate(`/merchant-edit/${selectedMerchant?.id}`) : ""}>
                            <BorderColorOutlined />
                        </IconButton>
                    </Tooltip>
                </Box>
            }

            <Typography mb={2} textAlign={"center"} variant='h5' color={"var(--color-dark-blue)"} fontWeight={600}>
                {formatMessage({ id: "merchants.invoicegenerator" })}
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                    <TextField
                        id="invoiceNo"
                        fullWidth
                        label={<span>{"Invoice Number"}<span style={{ color: "red" }}>*</span></span>}
                        size="small"
                        margin="dense"
                        value={invoiceNo}
                        onChange={(e) => setInvoiceNo(e.target.value)}
                    />
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Autocomplete
                        open={openDropDown}
                        loading={eNameLoading}
                        id="merchant_name"
                        sx={{
                            marginTop: "8px",
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "#F7F0F0",
                            },
                            "& fieldset": { border: "none" },
                            "& .MuiAutocomplete-input": { backgroundColor: selectedMerchant?.id ? "var(--color-dark-blue)" : "", color: selectedMerchant?.id ? "#fff" : "", borderRadius: "8px" },
                            "& .MuiSvgIcon-root": { display: "none" },
                            "& .MuiFormLabel-root": {
                                color: "var(--color-dark-blue) !important",
                                fontSize: "15px",
                                textTransform: "capitalize",
                            },
                        }}
                        size="small"
                        InputLabelProps={{ shrink: false }}
                        fullWidth
                        options={allMerchants}
                        getOptionLabel={(option) => `${option?.name}`}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={<span>{formatMessage({ id: "merchants.merchantname" })}<span style={{ color: "red" }}>*</span></span>}
                            />
                        )}
                        onChange={(_, value, reason) => {
                            if (reason === "clear") {
                                setAllMerchants([])
                                return;
                            } else {
                                setOpenDropDown(false)
                                setSelectedMerchant(value)
                            }
                        }}
                        onInputChange={(_, value, reason) => {
                            if (reason === "clear") {
                                setAllMerchants([])
                                return;
                            } else {
                                searchMerchants(value);
                            }
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <div style={{ display: "flex", gap: 5, marginTop: "8px", backgroundColor: "#F7F0F0" }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                maxDate={endDate}
                                label={<span>{formatMessage({ id: "timetracker.startdate" })}<span style={{ color: "red" }}>*</span></span>}
                                onChange={(value) => { setStartDate(value) }}
                                value={startDate}
                                slotProps={{
                                    textField: { size: "small", error: false, fullWidth: true },
                                }}
                                disableFuture={true}
                                views={["year", "month", "day"]}
                                format="DD/MM/YYYY"
                            />
                        </LocalizationProvider>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                minDate={startDate}
                                label={<span>{formatMessage({ id: "timetracker.enddate" })}<span style={{ color: "red" }}>*</span></span>}
                                onChange={(value) => { setEndDate(value) }}
                                value={endDate}
                                slotProps={{
                                    textField: { size: "small", error: false, fullWidth: true },
                                }}
                                disableFuture={true}
                                views={["year", "month", "day"]}
                                format="DD/MM/YYYY"
                            />
                        </LocalizationProvider>
                    </div>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <TextField
                        id="reimbursement-day"
                        fullWidth
                        label={formatMessage({ id: "merchants.reimbursementday" })}
                        size="small"
                        margin="dense"
                        value={endDate ? new Date(new Date(endDate).getTime() + 86400000).toISOString().slice(0, 10).split('-').reverse().join('/') : ""}
                        disabled
                    />
                </Grid>

                <Grid item xs={12} sm={4}>
                    <TextField
                        id="ice"
                        fullWidth
                        label={"ICE"}
                        size="small"
                        margin="dense"
                        value={selectedMerchant?.ICE || ""}
                        disabled
                    />
                </Grid>

                <Grid item xs={12} sm={4}>
                    <TextField
                        id="rc"
                        fullWidth
                        label={"RC"}
                        size="small"
                        margin="dense"
                        value={selectedMerchant?.RC || ""}
                        disabled
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        id="address"
                        fullWidth
                        label={formatMessage({ id: "settings.address" })}
                        size="small"
                        margin="dense"
                        value={selectedMerchant?.address || ""}
                        disabled
                    />
                </Grid>

                <Grid item xs={0} sm={4} />
                <Grid item xs={0} sm={4}>
                    <Button
                        onClick={() => generateInvoice()}
                        id="request-voucher"
                        variant="contained"
                        size="large"
                        fullWidth
                        disableElevation
                        disabled={!selectedMerchant?.ICE || startDate === "" || endDate === "" || invoiceNo === ""}
                        sx={{
                            color: "#fff !important",
                            backgroundColor: "var(--color-dark-blue) !important",
                            borderRadius: "20px",
                            textTransform: "capitalize",
                            fontWeight: "600",
                            border: "1px solid var(--color-dark-blue) !important",
                            opacity: !selectedMerchant.ICE || startDate === "" || endDate === "" || invoiceNo === "" ? 0.5 : 1
                        }}
                    >
                        {loading ?
                            <CircularProgress
                                size={25}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: "#fff"
                                }}
                            /> : formatMessage({ id: "merchants.generateinvoice" })}
                    </Button>
                </Grid>
                <Grid item xs={0} sm={4} />
            </Grid>
        </DialogContent >
    )
}

export default GenerateInvoice