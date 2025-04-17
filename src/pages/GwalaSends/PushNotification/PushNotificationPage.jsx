import React, { useEffect, useState } from 'react'
import { Autocomplete, Box, Button, Chip, CircularProgress, FormControl, FormControlLabel, Grid, IconButton, MenuItem, Radio, RadioGroup, Tab, TextField, Typography } from '@mui/material'
import { KeyboardBackspace } from '@mui/icons-material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useNavigate } from 'react-router'
import { useLocale } from '../../../locales'
import HorizontalScroll from '../../../components/GwalaSend/gwalaSMS/HorizontalScroll'
import { fetchCompanies } from '../../../api'
import { toast } from 'react-toastify'
import axiosMerchant from '../../../api/merchantRequest'
import axios from '../../../api/request'

const PushNotificationPage = () => {
    const { formatMessage } = useLocale();
    const navigate = useNavigate()
    const [subtabIndex, setSubTabIndex] = useState("1")
    const [active, setActive] = useState(true)
    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [phoneNumbers, setPhoneNumbers] = useState([])
    const [message, setMessage] = useState("")
    const [type, setType] = useState("")
    const [selectedGiftcard, setSelectedGiftcard] = useState("")
    const [cardEntity, setCardEntity] = useState(null)
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(false)
    const [sendLoading, setSendLoading] = useState(false)
    const [catLoading, setCatLoading] = useState(false)
    const [cat, setCat] = useState([])
    const [category, setCategory] = useState([])
    const [allMerchants, setAllMerchants] = useState([]);
    const [entities, setEntities] = useState([]);
    const [merchantId, setMerchantId] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [eNameLoading, setENameLoading] = useState(false);
    const [openDropDown, setOpenDropDown] = useState(false);

    const tabSubHandler = (e, val) => {
        setSubTabIndex(val)
    }

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
                            id: true
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

    const getContact = async () => {
        setLoading(true)
        const data = await fetchCompanies(1, 100000, {}, "");
        setContacts(data?.docs?.map((el) => { return { name: `${el?.name}`, phone: el?.phone, id: el?._id } }))
        setLoading(false)
    }

    useEffect(() => {
        getContact()
    }, [])

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

    const onSendNotification = () => {
        if (phoneNumbers?.length < 1 || message === "" || type === "" || (type === "CATEGORY" && category?.length < 1) || (type === "MERCHANT" && merchantId === "")) {
            toast(formatMessage({ id: "sms.requiredfieldsnotification" }), {
                position: "top-right",
                theme: "colored",
                type: "error",
            });
        } else {
            const dataToSend = {
                content: message,
                subject: "Gwala",
                filter: {},
                notificationType: type,
                entity: type === "MERCHANT" ? { id: merchantId } : type === "CATEGORY" ? selectedCategory : cardEntity
            }

            if (phoneNumbers?.some((sm) => sm?.name !== "All Gwala Users")) {
                dataToSend.filter.company = phoneNumbers[0]?.id
            }

            setSendLoading(true)
            axios.post('/v2/notification/bulk', dataToSend)
                .then((res) => {
                    toast(formatMessage({ id: "sms.sendsuccessnotification" }), {
                        position: "top-right",
                        theme: "colored",
                        type: "success",
                    });
                    setSendLoading(false)
                    setPhoneNumbers([])
                    setMessage("")
                    setValue(null)
                    setType("")
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

    const clearFields = () => {
        setSendLoading(false)
        setPhoneNumbers([])
        setMessage("")
        setValue(null)
        setType("")
    }

    const getCategories = () => {
        setCatLoading(true)
        const filterCategories = {
            ...(({ order: `${"createdAt"} ${"DESC"} ` }) || {}),
        };

        axiosMerchant.get(`/categories`, {
            params: {
                filter: {
                    ...filterCategories,
                    include: [
                        {
                            relation: "merchants",
                            scope: {
                                fields: {
                                    id: true,
                                    name: true,
                                    imageUrl: true,
                                }
                            }
                        }
                    ]
                }
            }
        })
            .then((res) => {
                setCat(res?.data)
                setCatLoading(false)
            })
            .catch((error) => {
                setCatLoading(false)
            })
    }

    useEffect(() => {
        if (type === "CATEGORY") {
            getCategories()
        }
    }, [type])

    const getGiftCards = async () => {
        setCatLoading(true)
        try {
            const response = await axios.get(`/v2/injected/giftcards`)
            setEntities(response?.giftcards)
        }
        catch (error) {

        }
    }

    useEffect(() => {
        if (type === "GIFT_CARD") {
            getGiftCards()
        }
    }, [type])

    const radioOnChange = (e) => {
        setSelectedGiftcard(e.target.value);
    }

    return (
        <Box sx={{ paddingTop: "0.5rem" }}>
            <IconButton
                sx={{
                    color: "#000",
                    position: "absolute",
                    top: { md: "130px" },
                    marginLeft: "1.5rem",
                    zIndex: 1
                }}
                onClick={() => navigate(-1)}
            >
                <KeyboardBackspace sx={{ fontSize: "2rem" }} />
            </IconButton>
            <TabContext value={subtabIndex}>
                <TabList onChange={tabSubHandler} variant='scrollable'
                    sx={{
                        '& .MuiTabs-indicator': { backgroundColor: "var(--color-dark-blue)", height: "2px" },
                        '& .Mui-selected': { color: "var(--color-dark-blue) !important", backgroundColor: "var(--color-cyan)" },
                        '& .MuiTab-root': { color: "#B0B6C3", padding: "0px 15px !important", textTransform: "capitalize", fontWeight: "600", border: "2px solid" },
                        '& .MuiTabs-flexContainer': { justifyContent: "center" }
                    }}
                >
                    <Tab
                        label={formatMessage({ id: "sms.tabnotification" })}
                        value={"1"}
                        sx={{ width: "200px" }}
                    />
                </TabList>

                <TabPanel value="1" sx={{ padding: "20px" }}>
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

                                <Typography fontSize={"1.25rem"} fontWeight={600} mt={2}>{formatMessage({ id: "sms.notification.pushto" })}</Typography>
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
                                                if (!newValue?.name) {
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
                                                    placeholder={formatMessage({ id: "advance.companyname" })}
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

                                <Typography fontSize={"1.25rem"} fontWeight={600} mt={2}>{formatMessage({ id: "sms.typeofnotification" })}</Typography>
                                <TextField
                                    select
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '25px',
                                            "& fieldset": { border: 'none' },
                                            border: "2px solid var(--color-dark-blue)"
                                        }
                                    }}
                                    size="small"
                                    value={type}
                                    InputLabelProps={{ shrink: false }}
                                    onChange={(e) => setType(e.target.value)}
                                    fullWidth
                                    label={type === "" ? formatMessage({ id: "sms.selecttypeofnotification" }) : ""}
                                >
                                    <MenuItem value={"CATEGORY"}>Category</MenuItem>
                                    <MenuItem value={"GIFT_CARD"}>Gift Card</MenuItem>
                                    <MenuItem value={"MERCHANT"}>Merchants</MenuItem>
                                </TextField>

                                <Typography fontSize={"1.25rem"} fontWeight={600} mt={2}>{type === "CATEGORY" ? "Select Category" : type === "MERCHANT" ? "Select Merchant" : ""}</Typography>
                                {
                                    type === "CATEGORY" &&
                                    <TextField
                                        select
                                        id="category"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                background: '#fff',
                                                borderRadius: '25px',
                                                "& fieldset": { border: 'none' },
                                                border: "2px solid var(--color-dark-blue)"
                                            }
                                        }}
                                        size="small"
                                        label={category?.length > 0 ? "" : "Select Category"}
                                        InputLabelProps={{ shrink: false }}
                                        fullWidth
                                        value={category}
                                        onChange={(e) => { setCategory(e.target.value) }}
                                    >
                                        {catLoading ?
                                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                                <CircularProgress
                                                    size={20}
                                                    sx={{
                                                        color: "var(--color-dark-blue) !important",
                                                    }}
                                                />
                                            </Box> :
                                            cat?.sort((a, b) => {
                                                const nameA = a.name.toLowerCase();
                                                const nameB = b.name.toLowerCase();
                                                if (nameA < nameB) return -1;
                                                if (nameA > nameB) return 1;
                                                return 0;
                                            })?.map((el, index) => {
                                                return (
                                                    <MenuItem
                                                        key={index}
                                                        value={el?.name}
                                                        title={el?.name}
                                                        onClick={() => setSelectedCategory({ id: el?.id, name: el?.name })}>
                                                        <span style={{ width: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                            {el?.name}
                                                        </span>
                                                    </MenuItem>
                                                )
                                            })}
                                    </TextField>
                                }

                                {
                                    type === "MERCHANT" &&
                                    <Autocomplete
                                        open={openDropDown}
                                        loading={eNameLoading}
                                        id="merchant_name"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                background: '#fff',
                                                borderRadius: '25px',
                                                "& fieldset": { border: 'none' },
                                                border: "2px solid var(--color-dark-blue)",
                                                "& .MuiSvgIcon-root": { display: "none" },
                                            }
                                        }}
                                        size="small"
                                        fullWidth
                                        options={allMerchants}
                                        getOptionLabel={(option) => `${option?.name}`}
                                        renderInput={(params) => (
                                            <TextField
                                                InputLabelProps={{ shrink: false }}
                                                {...params}
                                                placeholder={formatMessage({ id: "merchants.merchantname" })}
                                            />
                                        )}
                                        onChange={(_, value, reason) => {
                                            if (reason === "clear") {
                                                setMerchantId("")
                                                setAllMerchants([])
                                                return;
                                            } else {
                                                setMerchantId(value?.id)
                                                setOpenDropDown(false)
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
                                }

                                {
                                    type === "GIFT_CARD" &&
                                    <>
                                        <Typography fontSize={"1.25rem"} fontWeight={600} mt={2}>Select Gift Card</Typography>
                                        <FormControl sx={{ margin: "10px 0 15px 30px" }}>
                                            <RadioGroup row value={selectedGiftcard} onChange={(e) => radioOnChange(e)} name="radio-voucher">
                                                {entities?.map((el) => {
                                                    return (
                                                        <FormControlLabel
                                                            key={el?.name}
                                                            value={el?.name}
                                                            control={
                                                                <Radio
                                                                    size="small"
                                                                />
                                                            }
                                                            onClick={() => setCardEntity(el)}
                                                            label={el?.name}
                                                        />
                                                    )
                                                })
                                                }
                                            </RadioGroup>
                                        </FormControl>
                                    </>
                                }

                                <Typography fontSize={"1.25rem"} fontWeight={600} mt={2}>{formatMessage({ id: "sms.notification.notbody" })}</Typography>
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
                                            onClick={() => onSendNotification()}
                                            id="cancel"
                                            disableElevation
                                            disableRipple
                                            variant="contained"
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
                                            /> : formatMessage({ id: "sms.tabnotification" })}
                                        </Button>
                                    </Grid>
                                    <Grid item xs={0} sm={2.5} md={1} />
                                </Grid>
                            </Grid>
                            <Grid item xs={0} sm={1} lg={3} />
                        </Grid>
                    </Box>
                </TabPanel>
            </TabContext>
        </Box>
    )
}

export default PushNotificationPage