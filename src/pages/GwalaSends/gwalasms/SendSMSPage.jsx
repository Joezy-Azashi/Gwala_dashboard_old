import React, { useEffect, useState } from 'react'
import { Autocomplete, Box, Button, Chip, CircularProgress, Grid, TextField, Typography } from '@mui/material'
import HorizontalScroll from '../../../components/GwalaSend/gwalaSMS/HorizontalScroll'
import { useLocale } from '../../../locales';
import { fetchCompanies } from '../../../api';
import axios from '../../../api/request';
import { toast } from 'react-toastify';

const SendSMSPage = () => {
    const { formatMessage } = useLocale();

    const [phoneNumbers, setPhoneNumbers] = useState([])
    const [active, setActive] = useState(true)
    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [message, setMessage] = useState("")
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(false)
    const [sendLoading, setSendLoading] = useState(false)

    const selectNumber = (data) => {
        if (phoneNumbers?.filter((ft) => ft?.phone === data?.phone)?.length > 0) {
            setPhoneNumbers(phoneNumbers.filter((item) => item?.phone !== data?.phone));
            setValue(null)
        } else {
            setPhoneNumbers((prev) => [...prev, { name: data?.name, phone: data?.phone, id: data?.id }]);
            setValue(null)
        }
    }

    const AddPhoneNumber = (value) => {
        if (!value) {
            setInputValue(""); setActive(false)
        } else {
            selectNumber(!value?.name ? { name: "", phone: value } : value);
            setInputValue("");
            setActive(false)
        }
    }

    const getContact = async () => {
        setLoading(true)
        const data = await fetchCompanies(1, 100000, {}, "");
        setContacts(data?.docs?.map((el) => { return { name: `${el?.name}`, phone: el?.phone, id: el?._id } }))
        setLoading(false)
    }

    useEffect(() => {
        getContact()
    }, [])

    const onSendSMS = () => {
        if (phoneNumbers?.length < 1 || message === "") {
            toast(formatMessage({ id: "sms.requiredfields" }), {
                position: "top-right",
                theme: "colored",
                type: "error",
            });
        } else {
            if (phoneNumbers?.filter((ft) => ft?.name !== "")?.length > 0) {
                const dataToSend = {
                    subject: "Gwala",
                    content: message,
                    filter: {},
                    channels: [
                        "sms"
                    ]
                }

                if (phoneNumbers?.some((sm) => sm?.name !== "All Gwala Users")) {
                    dataToSend.filter.company = phoneNumbers[0]?.id
                }

                setSendLoading(true)
                axios.post('/v2/notification/dynamic', dataToSend)
                    .then((res) => {
                        toast(formatMessage({ id: "sms.sendsuccess" }), {
                            position: "top-right",
                            theme: "colored",
                            type: "success",
                        });
                        setSendLoading(false)
                        setPhoneNumbers([])
                        setMessage("")
                        setValue(null)
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

            if (phoneNumbers?.filter((ft) => ft?.name === "")?.length > 0) {
                const dataToSend = {
                    recipients: phoneNumbers?.filter((ft) => ft?.name === "")?.map((el) => el?.phone),
                    message,
                    type: "other"
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
                        setPhoneNumbers([])
                        setMessage("")
                        setValue(null)
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
        }
    }

    const clearFields = () => {
        setSendLoading(false)
        setPhoneNumbers([])
        setMessage("")
        setValue(null)
    }

    return (
        <Box onClick={() => setActive(false)}>
            <Grid container spacing={2}>
                <Grid item xs={0} sm={1} lg={3} />
                <Grid item xs={12} sm={10} lg={6}>
                    <Typography fontSize={"1.25rem"} fontWeight={600} mb={3}>{formatMessage({ id: "sms.suggestedcontacts" })}</Typography>

                    {loading ?
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <CircularProgress
                                size={20}
                                sx={{
                                    color: "var(--color-dark-blue) !important",
                                }}
                            />
                        </Box> :
                        <HorizontalScroll children={
                            <Box sx={{ display: "flex", gap: 1, }}>
                                <Typography
                                    variant='body2'
                                    backgroundColor={phoneNumbers?.some((sm) => sm?.name === "All Gwala Users") ? "var(--color-dark-blue)" : "#EBF2F9"}
                                    color={phoneNumbers?.some((sm) => sm?.name === "All Gwala Users") ? "#fff" : "var(--color-dark-blue)"}
                                    padding={"2px 12px"}
                                    sx={{
                                        cursor: "pointer",
                                        userSelect: "none",
                                        marginBottom: "5px",
                                        textTransform: "capitalize"
                                    }}
                                    onClick={() => setPhoneNumbers(phoneNumbers?.some((sm) => sm?.name === "All Gwala Users") ? [] : [{ name: "All Gwala Users", phone: "" }])}
                                >
                                    All Gwala Users
                                </Typography>
                                {contacts?.map((el, index) => {
                                    return (
                                        <Typography
                                            key={index}
                                            variant='body2'
                                            backgroundColor={phoneNumbers?.some((sm) => sm?.phone === el?.phone) ? "var(--color-dark-blue)" : "#EBF2F9"}
                                            color={phoneNumbers?.some((sm) => sm?.phone === el?.phone) ? "#fff" : "var(--color-dark-blue)"}
                                            padding={"2px 12px"}
                                            sx={{
                                                cursor: "pointer",
                                                userSelect: "none",
                                                marginBottom: "5px",
                                                textTransform: "capitalize"
                                            }}
                                            onClick={() => { (phoneNumbers?.filter((ft) => ft?.name !== "")?.length === 1 && phoneNumbers?.filter((ft) => ft?.phone !== el?.phone)?.length > 0) || phoneNumbers?.filter((ft) => ft?.name === "")?.length > 0 ? "" : selectNumber(el) }}
                                        >
                                            {el?.name}
                                        </Typography>
                                    )
                                })}
                            </Box>
                        }
                        />
                    }

                    <Typography fontSize={"1.25rem"} fontWeight={600} mt={2}>{formatMessage({ id: "sms.sendsmsto" })}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1, border: "2px solid var(--color-dark-blue)", minHeight: 70, borderRadius: "16px", padding: "10px" }}
                        onClick={(e) => { setActive(phoneNumbers?.some((sm) => sm?.name === "All Gwala Users") || phoneNumbers?.filter((ft) => ft?.name !== "")?.length === 1 ? false : true); e.stopPropagation() }}
                    >
                        {phoneNumbers?.map((value) => {
                            return (
                                <Chip
                                    key={value?.phone}
                                    sx={{
                                        height: "20px",
                                        backgroundColor: "#EBF2F9",
                                        padding: "14px 0px",
                                        color: "var(--color-dark-blue)",
                                        textTransform: "capitalize",
                                        '.MuiSvgIcon-root': { color: "var(--color-dark-blue) !important" },
                                    }}
                                    label={value?.name === "" ? value?.phone : value?.name}
                                    onDelete={() => selectNumber(value)}
                                    onMouseDown={(event) => { event.stopPropagation() }}
                                />
                            )
                        })}
                        {active &&
                            <Autocomplete
                                size="small"
                                value={value}
                                onChange={(event, newValue) => {
                                    if (!newValue?.name && newValue[0] !== "+") {
                                        toast(formatMessage({ id: "merchants.create.addcode" }), {
                                            position: "top-right",
                                            theme: "colored",
                                            type: "error",
                                        });
                                        setInputValue(newValue)
                                        return
                                    } else if (!newValue?.name && newValue?.length < 11 || newValue?.length > 15) {
                                        toast(formatMessage({ id: "sms.numberlength" }), {
                                            position: "top-right",
                                            theme: "colored",
                                            type: "error",
                                        });
                                        setInputValue(newValue)
                                        return
                                    } else if (!newValue?.name && /[a-zA-Z]/.test(newValue)) {
                                        toast(formatMessage({ id: "sms.numberwithalphabets" }), {
                                            position: "top-right",
                                            theme: "colored",
                                            type: "error",
                                        });
                                        setInputValue(newValue)
                                        return
                                    } else {
                                        setValue(newValue);
                                        AddPhoneNumber(newValue)
                                    }
                                }}
                                inputValue={inputValue}
                                onInputChange={(event, newInputValue) => {
                                    setInputValue(newInputValue);
                                }}
                                options={contacts}
                                getOptionLabel={(option) => `${option.name}`}
                                renderInput={(params) => (
                                    <TextField
                                        variant="standard"
                                        autoFocus
                                        size='small'
                                        {...params}
                                        placeholder={formatMessage({ id: "sms.nameorphone" })}
                                        sx={{
                                            minWidth: "13rem !important",
                                            "& input::placeholder": {
                                                fontSize: "14px"
                                            }
                                        }}
                                    />
                                )}
                                freeSolo
                                renderOption={(props, option) => (
                                    <li {...props} style={{ fontSize: "0.875rem" }}>
                                        {option.name} {option.phone}
                                    </li>
                                )}
                            />
                        }
                    </Box>

                    <Typography fontSize={"1.25rem"} fontWeight={600} mt={2}>{formatMessage({ id: "sms.body" })}</Typography>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '25px',
                                "& fieldset": { border: 'none' },
                                border: "2px solid var(--color-dark-blue)"
                            }
                        }}
                        size="small"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 300 }}
                        helperText={
                            message?.length > 0 ? (
                                <span style={{ color: message?.length === 300 ? "#FA3E3E" : "#2E405B" }}>
                                    {message.length}{" "}
                                    <span>
                                        {`(${formatMessage({ id: "sms.maxchar" })})`}
                                    </span>
                                </span>
                            ) : (
                                <span className="error-text">
                                    {formatMessage({ id: "sms.maxchar" })}
                                </span>
                            )
                        }
                        placeholder={formatMessage({ id: "sms.typemessage" })}
                    />

                    {/* <Box sx={{ display: "flex", justifyContent: "center" }} my={1.5}>
                        <Button
                            onClick={() => onSendSMS()}
                            id="cancel"
                            disableElevation
                            disableRipple
                            variant="outlined"
                            size="large"
                            fullWidth
                            sx={{
                                color: "#fff",
                                backgroundColor: "var(--color-dark-blue) !important",
                                borderRadius: "20px",
                                textTransform: "capitalize",
                                fontWeight: "600",
                                border: "0 !important",
                                width: { xs: "100%", md: "15rem" }
                            }}
                        >
                            {sendLoading ? <CircularProgress
                                size={25}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: "#fff"
                                }}
                            /> : formatMessage({ id: "sms.tab1" })}
                        </Button>
                    </Box> */}

                    <Grid container spacing={{ xs: 2, md: 8 }}>
                        <Grid item xs={0} sm={2.5} md={1} />
                        <Grid item xs={12} sm={3.5} md={5}>
                            <Button
                                onClick={() => clearFields()}
                                id="cancel"
                                disableElevation
                                disableRipple
                                variant="outlined"
                                size="large"
                                fullWidth
                                sx={{
                                    color: "var(--color-dark-blue)",
                                    borderRadius: "20px",
                                    textTransform: "capitalize",
                                    fontWeight: "600",
                                    borderColor: "var(--color-dark-blue) !important",
                                    width: { xs: "100%", md: "15rem" }
                                }}
                            >
                                {formatMessage({ id: "sms.notification.reset" })}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={3.5} md={5}>
                            <Button
                                onClick={() => onSendSMS()}
                                id="cancel"
                                disableElevation
                                disableRipple
                                variant="outlined"
                                size="large"
                                fullWidth
                                sx={{
                                    color: "#fff",
                                    backgroundColor: "var(--color-dark-blue) !important",
                                    borderRadius: "20px",
                                    textTransform: "capitalize",
                                    fontWeight: "600",
                                    border: "0 !important",
                                    width: { xs: "100%", md: "15rem" }
                                }}
                            >
                                {sendLoading ? <CircularProgress
                                    size={25}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: "#fff"
                                    }}
                                /> : formatMessage({ id: "sms.tab1" })}
                            </Button>
                        </Grid>
                        <Grid item xs={0} sm={2.5} md={1} />
                    </Grid>

                </Grid>
                <Grid item xs={0} sm={1} lg={3} />
            </Grid>
        </Box >
    )
}

export default SendSMSPage