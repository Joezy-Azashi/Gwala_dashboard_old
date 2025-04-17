import React, { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Grid, InputAdornment, MenuItem, TextField, Tooltip, Typography } from '@mui/material'
import ShortUniqueId from 'short-unique-id'
import CountryList from "country-list-with-dial-code-and-flag";
import { useLocale } from '../../locales';
import { NotificationsNoneOutlined, SettingsSuggestOutlined } from '@mui/icons-material';
import BasicSelectBlue from '../../components/UI/BasicSelectBlue';
import { useLocation, useNavigate } from 'react-router';
import isEmail from "validator/lib/isEmail";
import { toast } from 'react-toastify';
import axiosMerchant from '../../api/merchantRequest';

const phoneNumberRegex = /^(0|\+212|00212|001|00216|00233|\+1|\+216|\+233)\d{9}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%^*?&]{8,}$/;
const specialChar = ["$", "!", "%", "*", "?", "&"]
const uppercase = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
const lowercase = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

function AddOwner() {
    const { formatMessage } = useLocale();
    const navigate = useNavigate()
    const location = useLocation()
    const uid = new ShortUniqueId({ length: 4 });
    const supportedCountries = ["MA", "US", "TN", "GH"].map((code) =>
        CountryList.findOneByCountryCode(code)
    );

    const [loading, setLoading] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [ownerPhone, setOwnerPhone] = useState("")
    const [ownerEmail, setOwnerEmail] = useState("")
    const [ownerCountryCode, setOwnerCountryCode] = useState(supportedCountries[0].dial_code)
    const [password, setPassword] = useState(
        uid.rnd() +
        specialChar[Math.floor(Math.random() * specialChar.length)] +
        numbers[Math.floor(Math.random() * numbers.length)] +
        uppercase[Math.floor(Math.random() * uppercase.length)] +
        lowercase[Math.floor(Math.random() * lowercase.length)]
    )
    const [ownerRole, setOwnerRole] = useState("")
    const [merchantId, setMerchantId] = useState("")
    const [error, setError] = useState(false)

    const onCreateOwner = () => {
        const dataToSend = {
            ownerRole: ownerRole,
            user: {
                firstName: firstName,
                lastName: lastName,
                email: ownerEmail,
                phoneNumber: ownerPhone,
                countryCode: ownerCountryCode,
                password: password,
                confirmPassword: password
            }
        }

        if(location?.state?.id){
            dataToSend.merchantId = location?.state?.id
        }

        if (firstName === "" ||
            lastName === "" ||
            ownerEmail === "" ||
            !isEmail(`${ownerEmail}`) ||
            ownerPhone === "" ||
            ownerPhone[0] === "0" ||
            !phoneNumberRegex.test(`${ownerCountryCode}${ownerPhone}`) ||
            ownerRole === ""
        ) {
            setError(true)
            toast(formatMessage({ id: "merchants.create.error" }), {
                theme: "colored",
                type: "error",
            });
        } else if (!passwordRegex.test(`${password}`)) {
            setError(true)
            toast(formatMessage({ id: "merchants.passcheck" }), {
                theme: "colored",
                type: "error",
            });
        } else {
            setLoading(true)

            axiosMerchant.post(`/owners`, dataToSend)
                .then((res) => {
                    if (res?.response?.data?.error?.statusCode === 409) {
                        toast(formatMessage({ id: "merchants.ownerexists" }), {
                            theme: "colored",
                            type: "error",
                        });
                    } else if (res?.response?.data?.error) {
                        toast("An error occured", {
                            theme: "colored",
                            type: "error",
                        });
                    } else {
                        toast(formatMessage({ id: "merchants.owner.createsuccess" }), {
                            theme: "colored",
                            type: "success",
                        });
                        navigate(location?.state?.id ? `/merchant-edit/${location?.state?.id}` : "/manage-owners")
                    }
                    setLoading(false)
                })
                .catch((error) => {
                    setLoading(false)
                    toast(error?.response?.data?.message, {
                        position: "top-right",
                        type: "error",
                        theme: "colored",
                    });
                })
        }
    }

    // Get merchants
    const searchMerchants = async () => {
        const data = await axiosMerchant.get(`/merchants`, {
            params: {
                filter: {
                    limit: 10,
                    where: {
                        id: location?.state?.id
                    },
                    fields: {
                        name: true,
                        id: true
                    }
                }
            }
        })
        setMerchantId(data?.data?.docs[0]?.name)
    }

    useEffect(() => {
        if (location?.state?.id) {
            searchMerchants()
        }
    }, [location?.state?.id])

    return (
        <Box mt={"32px"} sx={{ padding: "0 35px" }}>
            <Typography variant="h4" color={"var(--color-dark-blue)"} textAlign={'center'} fontWeight={600} padding={{sm: '0 0 2rem 0'}}>
                {formatMessage({ id: "merchants.owner.addnewowner" })}
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={0} md={2} />

                <Grid item xs={12} md={8}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="firstname"
                                size="small"
                                label={<span>{formatMessage({ id: "merchants.create.ownerfirstname" })}<span style={{ color: "red" }}>*</span></span>}
                                fullWidth
                                sx={{ '&.MuiFormControl-root': { marginTop: ".47rem" }, backgroundColor: "#D9DFE9" }}
                                value={firstName}
                                onChange={(e) => { setFirstName(e.target.value); setError(false) }}
                                error={firstName?.length > 0 ? false : error}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="lastname"
                                size="small"
                                label={<span>{formatMessage({ id: "merchants.create.ownerlastname" })}<span style={{ color: "red" }}>*</span></span>}
                                fullWidth
                                sx={{ '&.MuiFormControl-root': { marginTop: ".47rem" }, backgroundColor: "#D9DFE9" }}
                                value={lastName}
                                onChange={(e) => { setLastName(e.target.value); setError(false) }}
                                error={lastName?.length > 0 ? false : error}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="useremail"
                                size="small"
                                label={<span>{formatMessage({ id: "merchants.create.owneremail" })}<span style={{ color: "red" }}>*</span></span>}
                                fullWidth
                                sx={{ '&.MuiFormControl-root': { marginTop: ".47rem" }, backgroundColor: "#D9DFE9" }}
                                value={ownerEmail}
                                onChange={(e) => setOwnerEmail(e.target.value)}
                                error={(ownerEmail?.length > 0 && !isEmail(`${ownerEmail}`) ? true : ownerEmail?.length < 1 ? error : false)}
                                helperText={
                                    ownerEmail?.length > 0 && !isEmail(`${ownerEmail}`) &&
                                    formatMessage({ id: "common.invalid_email" })
                                }
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <TextField
                                    id="password"
                                    size="small"
                                    label={<span>{formatMessage({ id: "employee.password" })}<span style={{ color: "red" }}>*</span></span>}
                                    fullWidth
                                    sx={{ '&.MuiFormControl-root': { marginTop: ".47rem" }, backgroundColor: "#D9DFE9" }}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(false) }}
                                    error={password?.length > 0 && passwordRegex.test(`${password}`) ? false : error}
                                    InputProps={{
                                        endAdornment: <InputAdornment position='end'>
                                            <Tooltip title={formatMessage({ id: "merchants.create.generatepass" })} arrow>
                                                <SettingsSuggestOutlined onClick={() => setPassword(
                                                    uid.rnd() +
                                                    specialChar[Math.floor(Math.random() * specialChar.length)] +
                                                    numbers[Math.floor(Math.random() * numbers.length)] +
                                                    uppercase[Math.floor(Math.random() * uppercase.length)] +
                                                    lowercase[Math.floor(Math.random() * lowercase.length)]
                                                )}
                                                    sx={{ cursor: "pointer" }} />
                                            </Tooltip>
                                        </InputAdornment>
                                    }}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={2} mb={3}>
                            <BasicSelectBlue
                                size="small"
                                margin="dense"
                                formControlProps={{ fullWidth: true, margin: "dense" }}
                                label={<span>{formatMessage({ id: "employee.country" })}<span style={{ color: "red" }}>*</span></span>}
                                value={ownerCountryCode}
                                onChange={(e) => setOwnerCountryCode(e.target.value)}
                            >
                                {supportedCountries.map((country, i) => (
                                    <MenuItem key={i} value={country.dial_code}>
                                        {" "}
                                        {country.flag}
                                        {` ${country.code}`}
                                        {` (${country.dial_code})`}
                                    </MenuItem>
                                ))}
                            </BasicSelectBlue>
                        </Grid>

                        <Grid item xs={12} sm={4} mb={3}>
                            <TextField
                                id="merchant_phone"
                                fullWidth
                                label={<span>{formatMessage({ id: "merchants.create.ownerphone" })}<span style={{ color: "red" }}>*</span></span>}
                                size="small"
                                margin="dense"
                                sx={{ backgroundColor: "#D9DFE9" }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="start">
                                            <NotificationsNoneOutlined />
                                        </InputAdornment>
                                    ),
                                }}
                                value={ownerPhone}
                                onChange={(e) => {
                                    setOwnerPhone(!Number.isNaN(Number(e.target.value)) ? e.target.value : value);
                                    setError(false)

                                }}
                                error={(ownerPhone?.length > 0 && !phoneNumberRegex.test(`${ownerCountryCode}${ownerPhone}`)) ? true : ownerPhone?.length < 1 ? error : ownerPhone[0] === "0" ? true : false}
                                helperText={
                                    ownerPhone[0] === "0" ? formatMessage({ id: "merchants.owner.startzero" }) :
                                        ownerPhone?.length > 0 && !phoneNumberRegex.test(`${ownerCountryCode}${ownerPhone}`) ?
                                            formatMessage({ id: "common.invalid_phone" }) : ""
                                }
                            />
                        </Grid>

                        <Grid item xs={12} sm={location?.state?.id ? 2.5 : 6} mb={3}>
                            <TextField
                                select
                                id="typeofowner"
                                size="small"
                                label={<span>{formatMessage({ id: "merchants.owner.ownerrole" })}<span style={{ color: "red" }}>*</span></span>}
                                fullWidth
                                sx={{ '&.MuiFormControl-root': { marginTop: ".47rem" }, backgroundColor: "#D9DFE9" }}
                                value={ownerRole}
                                onChange={(e) => { setOwnerRole(e.target.value); setError(false) }}
                                error={ownerRole?.length > 0 ? false : error}
                            >
                                <MenuItem value={"merchant_owner"}>{formatMessage({ id: "merchants.create.owner" })}</MenuItem>
                                <MenuItem value={"merchant_viewer"}>{formatMessage({ id: "merchants.owner.viewer" })}</MenuItem>
                            </TextField>
                        </Grid>

                        {location?.state?.id &&
                            <Grid item xs={12} sm={3.5} mb={3}>
                                <TextField
                                    id="useremail"
                                    size="small"
                                    label={formatMessage({ id: "merchants.merchantname" })}
                                    fullWidth
                                    sx={{ '&.MuiFormControl-root': { marginTop: ".47rem" }, backgroundColor: "#D9DFE9" }}
                                    value={merchantId}
                                    inputProps={{ readOnly: true }}
                                />
                            </Grid>
                        }

                        <Grid item xs={12} sm={2} />
                        <Grid item xs={12} sm={4}>
                            <Button
                                onClick={() => navigate("/manage-owners")}
                                id="add-owner-btn"
                                variant="outlined"
                                size="large"
                                fullWidth
                                sx={{
                                    color: "var(--color-dark-blue)",
                                    backgroundColor: "var(--color-cyan) !important",
                                    borderRadius: "20px",
                                    textTransform: "capitalize",
                                    fontWeight: "600",
                                    border: "0 !important"
                                }}
                            >
                                {formatMessage({ id: "edoc.cancel" })}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                onClick={() => onCreateOwner()}
                                id="request-voucher"
                                variant="outlined"
                                size="large"
                                fullWidth
                                disabled={loading}
                                sx={{
                                    color: "#fff",
                                    backgroundColor: "var(--color-dark-blue) !important",
                                    borderRadius: "20px",
                                    textTransform: "capitalize",
                                    fontWeight: "600",
                                    border: "0 !important"
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
                                    /> : formatMessage({ id: "merchants.owner.addowner" })
                                }
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={2} />
                    </Grid>
                </Grid>
                <Grid item xs={0} md={2} />
            </Grid>
        </Box>
    )
}

export default AddOwner