import React, { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Container, Dialog, DialogContent, Grid, IconButton, InputAdornment, MenuItem, TextField, Tooltip, Typography } from '@mui/material'
import { useLocale } from '../../locales';
import { Add, Close, DeleteOutlineOutlined, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import axiosMerchant from '../../api/merchantRequest';
import PageSpinner from '../../components/pagespinner/PageSpinner';
import CountryList from 'country-list-with-dial-code-and-flag';
import BasicSelectOwner from '../../components/UI/BasicSelectOwner';
import RedirectWhite from '../../components/UI/RedirectWhite';
import isEmail from "validator/lib/isEmail";
import { toast } from 'react-toastify';
import { IOSSwitch } from '../../components/UI';

const phoneNumberRegex = /^(0|\+212|00212|001|00216|00233|\+1|\+216|\+233)\d{9}$/;

function ManageOwners() {
    const { formatMessage } = useLocale();
    const navigate = useNavigate()
    const supportedCountries = ["MA", "US", "TN", "GH"].map((code) =>
        CountryList.findOneByCountryCode(code)
    );

    const [selectedOwner, setSelectedOwner] = useState("")
    const [ownerData, setOwnerData] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [saveLoading, setSaveLoading] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [resendPassLoading, setResendPassLoading] = useState(false)
    const [statusLoading, setStatusLoading] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [ownerPhone, setOwnerPhone] = useState("")
    const [ownerEmail, setOwnerEmail] = useState("")
    const [ownerCountryCode, setOwnerCountryCode] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [error, setError] = useState(false)
    const [timeoutMulti, setTimeoutMulti] = useState(null)
    const [status, setStatus] = useState()
    const [ownerRole, setOwnerRole] = useState("")

    const getOwners = (text) => {
        setLoading(true)
        const fullNameSearch = [
            ((text !== "" && { firstName: { regexp: `/${text || ""}/i` } }) || []),
            ((text !== "" && { lastName: { regexp: `/${text || ""}/i` } }) || []),
        ]
        axiosMerchant.get(`/owners`, {
            params: {
                filter: {
                    where: {
                        ...((fullNameSearch?.length > 0 && { or: fullNameSearch }) || {}),
                        role: { inq: ["owner", "merchant_viewer"] }
                    },
                    include: [
                        {
                            relation: "merchants",
                            scope: {
                                fields: {
                                    id: true
                                }
                            }
                        }
                    ]
                }
            }
        }
        )
            .then((res) => {
                setLoading(false)
                if (res?.response?.data?.error?.statusCode === 500) {
                    setUsers([])
                } else {
                    setUsers(res?.data?.docs?.filter((ft) => ft?.role === "owner" || ft?.role === "merchant_viewer")?.map((el) => { return { name: `${el?.firstName} ${el?.lastName}`, count: el?.merchants ? el?.merchants?.length : 0, data: el } }))
                }
            })
            .catch((error) => {
                setLoading(false)
            })
    }

    useEffect(() => {
        getOwners()
    }, [])

    const handleSearchOwner = (e,) => {
        setSearchTerm(e.target.value)

        try {
            clearTimeout(timeoutMulti)
        }
        catch {

        }
        setLoading(true)
        setTimeoutMulti(setTimeout(() => {
            getOwners(e.target.value)
        }, 1500))
    }

    const array = users?.sort(function (a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
        }
        return 0;
    })

    function sortAndGroupAlphabetically(arr) {
        const groupedItems = {};
        arr.forEach(item => {
            const firstLetter = item?.name[0].toUpperCase();

            if (!groupedItems[firstLetter]) {
                groupedItems[firstLetter] = [];
            }

            groupedItems[firstLetter].push(item);
        });
        setOwnerData(groupedItems)
    }

    useEffect(() => {
        sortAndGroupAlphabetically(array);
    }, [users])

    const onEditOwner = () => {
        const dataToSend = {
            firstName: firstName.replace(/^\s+/, ''),
            lastName: lastName,
            email: ownerEmail,
            countryCode: ownerCountryCode,
            phoneNumber: ownerPhone,
            role: ownerRole === "owner" ? "merchant_owner" : ownerRole
        }

        if (firstName === "" ||
            lastName === "" ||
            ownerEmail === "" ||
            !isEmail(`${ownerEmail}`) ||
            ownerPhone === "" ||
            ownerPhone[0] === "0" ||
            !phoneNumberRegex.test(`${ownerCountryCode}${ownerPhone}`)
        ) {
            setError(true)
            toast(formatMessage({ id: "merchants.create.error" }), {
                theme: "colored",
                type: "error",
            });
        } else {
            setSaveLoading(true)

            axiosMerchant.patch(`/owners/${selectedOwner?.data?.id}`, dataToSend)
                .then((res) => {
                    setSaveLoading(false)
                    getOwners()
                    setSelectedOwner("")
                    setSearchTerm("")
                    toast(formatMessage({ id: "merchants.owner.updatesuccess" }), {
                        theme: "colored",
                        type: "success",
                    });
                    navigate("/manage-owners")
                })
                .catch((error) => {
                    setSaveLoading(false)
                    toast(error?.response?.data?.message, {
                        position: "top-right",
                        type: "error",
                        theme: "colored",
                    });
                })
        }
    }

    const onDeleteOwner = () => {
        setDeleteLoading(true)

        axiosMerchant.delete(`/owners/${selectedOwner?.data?.id}`)
            .then((res) => {
                setDeleteLoading(false)
                toast(formatMessage({ id: "merchants.owner.deletesuccess" }), {
                    theme: "colored",
                    type: "success",
                });
                getOwners();
                setSearchTerm("");
                setSelectedOwner("");
                setOpenDelete(false)
            })
            .catch((error) => {
                setDeleteLoading(false)
            })
    }

    const onResendPass = () => {
        setResendPassLoading(true)

        axiosMerchant.get(`/owners/${selectedOwner?.data?.id}/reset-password`)
            .then((res) => {
                setResendPassLoading(false)
                toast(formatMessage({ id: "merchants.owner.resendpasssuccess" }), {
                    theme: "colored",
                    type: "success",
                });
            })
            .catch((error) => {
                setResendPassLoading(false)
            })
    }

    const changeOwnerStatus = () => {
        setStatusLoading(true)

        axiosMerchant.get(`/owners/${selectedOwner?.data?.id}/toggle-status`)
            .then((res) => {
                setStatusLoading(false)
                toast(res?.data?.message, {
                    theme: "colored",
                    type: "success",
                });
                setStatus(!status)
            })
            .catch((error) => {
                setStatusLoading(false)
            })
    }

    return (
        <Box sx={{ padding: "1rem 35px 2rem 35px" }}>
            <Box sx={{ display: { xs: "block", sm: "flex" }, justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h5" fontWeight={600} lineHeight={"1"} mb={6}>{formatMessage({ id: "merchants.owner.title" })}</Typography>
                <Box sx={{ display: {xs: "block", sm: "flex"}, gap: 2 }}>
                    <TextField
                        size="small"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => handleSearchOwner(e)}
                        sx={{
                            marginBottom: "48px",
                            "& .MuiOutlinedInput-root": {
                                background: "#fff",
                                border: "1px solid var(--color-dark-blue)",
                            },
                            "& fieldset": { border: "none" },
                            "& .MuiFormLabel-root": {
                                color: "var(--color-dark-blue) !important",
                                fontWeight: "600",
                                fontSize: "15px",
                                textTransform: "capitalize",
                            },
                        }}
                        placeholder={formatMessage({ id: "merchants.owner.search" })}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                            endAdornment: <InputAdornment position='end'>
                                {searchTerm?.length > 0 &&
                                    <Tooltip title={formatMessage({ id: "merchants.clearsearch" })} arrow>
                                        <Close onClick={(e) => { getOwners(""); setSearchTerm(""); setSelectedOwner("") }
                                        } sx={{ cursor: "pointer" }} />
                                    </Tooltip>
                                }
                            </InputAdornment>
                        }}
                    />
                    <Button
                        onClick={() => { resendPassLoading || saveLoading || deleteLoading ? "" : navigate("/add-owner") }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: "var(--color-dark-blue)",
                            color: "#fff",
                            padding: ".4rem 1rem",
                            borderRadius: "10px",
                            cursor: "pointer !important",
                            textTransform: "none",
                            marginBottom: "48px",
                        }}
                    >
                        <Add /> <Typography variant="body2">{formatMessage({ id: "merchants.owner.addanowner" })}</Typography>
                    </Button>
                </Box>
            </Box>

            <Container maxWidth={"lg"}>
                {loading ?
                    <Box sx={{
                        width: '100%',
                        height: { xs: '12rem' },
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "end"
                    }}>
                        <PageSpinner />
                    </Box> :
                    Object.keys(ownerData)?.length < 1 ?
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "50vh",
                                fontSize: "1.2rem",
                            }}
                        >
                            {formatMessage({ id: "employee.norecords" })}
                        </div> :
                        Object?.keys(ownerData)?.map((item) => {
                            return (
                                <Box key={item} mb={6}>
                                    <Typography variant='h5' fontWeight={600} color={"var(--color-dark-blue)"} mb={1.5}>{`|${item}`}</Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                            gap: "20px",
                                        }}
                                    >
                                        {ownerData[item]?.map((el) => {
                                            return (
                                                <Box
                                                    key={el?.data?.id}
                                                    sx={{
                                                        display: "flex", alignItems: "center",
                                                    }}
                                                    onClick={() => {
                                                        setSelectedOwner(el);
                                                        setFirstName(el?.data?.firstName)
                                                        setLastName(el?.data?.lastName)
                                                        setOwnerEmail(el?.data?.email)
                                                        setOwnerCountryCode(el?.data?.countryCode)
                                                        setOwnerPhone(el?.data?.phoneNumber)
                                                        setStatus(el?.data?.isEnable)
                                                        setOwnerRole(el?.data?.role)
                                                    }}
                                                >
                                                    <Typography
                                                        variant='body2'
                                                        sx={{
                                                            backgroundColor: el?.data?.id === selectedOwner?.data?.id ? "#002B69" : "#fff",
                                                            border: "1px solid #002B69",
                                                            padding: "4px 10px",
                                                            borderRadius: "20px",
                                                            cursor: "pointer",
                                                            color: el?.data?.id === selectedOwner?.data?.id ? "#fff" : "#002B69",
                                                            whiteSpace: "nowrap",
                                                            zIndex: 1,
                                                            userSelect: "none"
                                                        }}>
                                                        {el?.name}
                                                    </Typography>
                                                    <Typography
                                                        variant='body2'
                                                        sx={{
                                                            border: "1px solid #002B69",
                                                            padding: "3.5px",
                                                            borderRadius: "0 20px 20px 0",
                                                            borderLeft: "0",
                                                            marginLeft: "-.7rem",
                                                            width: "3.5rem",
                                                        }}>
                                                        <span style={{
                                                            backgroundColor: "#002B69",
                                                            color: "#fff",
                                                            width: "1.8rem",
                                                            height: "1.3rem",
                                                            display: "flex",
                                                            justifyContent: 'center',
                                                            alignItems: "center",
                                                            borderRadius: "50%",
                                                            marginLeft: ".9rem"
                                                        }}>
                                                            {el?.count}
                                                        </span>
                                                    </Typography>
                                                </Box>
                                            )
                                        })}

                                        {selectedOwner?.name && selectedOwner?.name[0].toUpperCase() === item ?
                                            <Box sx={{ color: "#fff" }}>

                                                <Box sx={{ backgroundColor: "var(--color-dark-blue)", padding: '1.5rem' }}>
                                                    <Box sx={{ display: "flex", justifyContent: "space-between" }} mb={1}>
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                            <Tooltip title={selectedOwner?.count < 1 && formatMessage({ id: "merchants.owner.deleteowner" })}>
                                                                <IconButton
                                                                    sx={{
                                                                        backgroundColor: "#fff !important",
                                                                        cursor: selectedOwner?.count > 0 ? "default" : "pointer",
                                                                        opacity: selectedOwner?.count > 0 && 0.5
                                                                    }}
                                                                    onClick={(e) => {
                                                                        selectedOwner?.count > 0 || resendPassLoading || saveLoading || deleteLoading || statusLoading ? "" : setOpenDelete(true);
                                                                        e.stopPropagation()
                                                                    }}
                                                                >
                                                                    <DeleteOutlineOutlined sx={{ color: "var(--color-danger)" }} />
                                                                </IconButton>
                                                            </Tooltip>

                                                            {statusLoading ?
                                                                <CircularProgress
                                                                    size={25}
                                                                    sx={{
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        color: "#fff"
                                                                    }}
                                                                /> :
                                                                <Tooltip title={status ? formatMessage({ id: "merchants.owner.disableowner" }) : formatMessage({ id: "merchants.owner.enableowner" })}>
                                                                    <Box>
                                                                        <IOSSwitch
                                                                            id="active"
                                                                            checked={status}
                                                                            onClick={() => { resendPassLoading || saveLoading || deleteLoading ? "" : changeOwnerStatus() }}
                                                                        />
                                                                    </Box>
                                                                </Tooltip>
                                                            }
                                                        </Box>
                                                        <IconButton sx={{ backgroundColor: "#fff !important" }} onClick={(e) => { e.stopPropagation(); setSelectedOwner("") }}>
                                                            <Close sx={{ color: "var(--color-dark-blue)" }} />
                                                        </IconButton>
                                                    </Box>
                                                    <Grid container spacing={3} sx={{ justifyContent: "center" }}>
                                                        <Grid item xs={12} sm={3} md={2.5}>
                                                            <TextField
                                                                id="firstname"
                                                                size="small"
                                                                label={<span>{formatMessage({ id: "merchants.create.ownerfirstname" })}<span style={{ color: "red" }}>*</span></span>}
                                                                fullWidth
                                                                sx={{
                                                                    '&.MuiFormControl-root': { marginTop: ".47rem" }, backgroundColor: "#828D9F",
                                                                    '& .MuiFormLabel-root': { color: "#fff" },
                                                                    '& .MuiInputBase-root': { color: "#fff" }
                                                                }}
                                                                value={firstName}
                                                                onChange={(e) => { setFirstName(e.target.value); setError(false) }}
                                                                error={firstName?.length > 0 ? false : error}
                                                            />
                                                        </Grid>

                                                        <Grid item xs={12} sm={3} md={2.5}>
                                                            <TextField
                                                                id="lastname"
                                                                size="small"
                                                                label={<span>{formatMessage({ id: "merchants.create.ownerlastname" })}<span style={{ color: "red" }}>*</span></span>}
                                                                fullWidth
                                                                sx={{
                                                                    '&.MuiFormControl-root': { marginTop: ".47rem" }, backgroundColor: "#828D9F",
                                                                    '& .MuiFormLabel-root': { color: "#fff" },
                                                                    '& .MuiInputBase-root': { color: "#fff" }
                                                                }}
                                                                value={lastName}
                                                                onChange={(e) => { setLastName(e.target.value); setError(false) }}
                                                                error={lastName?.length > 0 ? false : error}
                                                            />
                                                        </Grid>

                                                        <Grid item xs={12} sm={3} md={2.5}>
                                                            <TextField
                                                                id="useremail"
                                                                size="small"
                                                                label={<span>{formatMessage({ id: "merchants.create.owneremail" })}<span style={{ color: "red" }}>*</span></span>}
                                                                fullWidth
                                                                sx={{
                                                                    '&.MuiFormControl-root': { marginTop: ".47rem" }, backgroundColor: "#828D9F",
                                                                    '& .MuiFormLabel-root': { color: "#fff" },
                                                                    '& .MuiInputBase-root': { color: "#fff" }
                                                                }}
                                                                value={ownerEmail.toLowerCase()}
                                                                onChange={(e) => setOwnerEmail(e.target.value)}
                                                                error={(ownerEmail?.length > 0 && !isEmail(`${ownerEmail}`) ? true : ownerEmail?.length < 1 ? error : false)}
                                                                helperText={
                                                                    ownerEmail?.length > 0 && !isEmail(`${ownerEmail}`) &&
                                                                    formatMessage({ id: "common.invalid_email" })
                                                                }
                                                            />
                                                        </Grid>

                                                        <Grid item xs={12} sm={3} md={2}>
                                                            <BasicSelectOwner
                                                                size="small"
                                                                margin="dense"
                                                                formControlProps={{ fullWidth: true, margin: "dense" }}
                                                                label={<span>{formatMessage({ id: "employee.country" })}<span style={{ color: "red" }}>*</span></span>}
                                                                value={ownerCountryCode}
                                                                onChange={(e) => setOwnerCountryCode(e.target.value)}
                                                            >
                                                                {supportedCountries.map((country, i) => (
                                                                    <MenuItem key={i} value={country?.data?.dial_code}>
                                                                        {" "}
                                                                        {country?.data?.flag}
                                                                        {` ${country?.data?.code}`}
                                                                        {` (${country?.data?.dial_code})`}
                                                                    </MenuItem>
                                                                ))}
                                                            </BasicSelectOwner>
                                                        </Grid>

                                                        <Grid item xs={12} sm={3} md={2.5}>
                                                            <TextField
                                                                id="merchant_phone"
                                                                fullWidth
                                                                label={<span>{formatMessage({ id: "merchants.create.ownerphone" })}<span style={{ color: "red" }}>*</span></span>}
                                                                size="small"
                                                                margin="dense"
                                                                sx={{
                                                                    backgroundColor: "#828D9F",
                                                                    '& .MuiFormLabel-root': { color: "#fff" },
                                                                    '& .MuiInputBase-root': { color: "#fff" }
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

                                                        <Grid item xs={12} sm={3} md={2.5}>
                                                            <TextField
                                                                select
                                                                label={formatMessage({ id: "merchants.owner.ownerrole" })}
                                                                sx={{
                                                                    backgroundColor: "#828D9F",
                                                                    '& .MuiFormLabel-root': { color: "#fff" },
                                                                    '& .MuiInputBase-root': { color: "#fff" }
                                                                }}
                                                                size="small"
                                                                value={ownerRole}
                                                                onChange={(e) => setOwnerRole(e.target.value)}
                                                                fullWidth
                                                                margin="dense"
                                                            >
                                                                <MenuItem value={"owner"}>{formatMessage({ id: "merchants.create.owner" })}</MenuItem>
                                                                <MenuItem value={"merchant_viewer"}>{formatMessage({ id: "merchants.owner.viewer" })}</MenuItem>
                                                            </TextField>
                                                        </Grid>

                                                        <Grid item xs={12} sm={3} md={2.5}>
                                                            <TextField
                                                                label={formatMessage({ id: "employee.defaultPassword" })}
                                                                sx={{
                                                                    backgroundColor: "#828D9F",
                                                                    '& .MuiFormLabel-root': { color: "#fff" },
                                                                    '& .MuiInputBase-root': { color: "#fff" }
                                                                }}
                                                                size="small"
                                                                InputProps={{ readOnly: true }}
                                                                value={
                                                                    !selectedOwner?.data?.isDefaultPasswordChanged
                                                                        ? formatMessage({ id: "employee.notChanged" })
                                                                        : formatMessage({ id: "employee.changed" })
                                                                }
                                                                fullWidth
                                                                margin="dense"
                                                            />
                                                        </Grid>
                                                    </Grid>

                                                    <Box
                                                        onClick={() => { selectedOwner?.count < 1 || resendPassLoading || saveLoading || deleteLoading || statusLoading ? "" : navigate(`/merchants`, { state: { data: selectedOwner?.data } }) }}
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            gap: 1,
                                                            opacity: selectedOwner?.count < 1 && 0.5,
                                                            cursor: selectedOwner?.count < 1 ? "default" : "pointer"
                                                        }}
                                                        my={2}
                                                    >
                                                        <Typography variant='h6' sx={{ color: "#fff" }}>{formatMessage({ id: "merchants.merchants" })}</Typography>
                                                        <RedirectWhite />
                                                    </Box>

                                                    <Box sx={{ display: {sm: "flex"}, justifyContent: "center", gap: 3 }}>
                                                        <Button
                                                            onClick={() => onResendPass()}
                                                            id="resend-pass"
                                                            variant="outlined"
                                                            size="large"
                                                            fullWidth
                                                            disabled={resendPassLoading || saveLoading || deleteLoading || statusLoading}
                                                            sx={{
                                                                color: "#fff !important",
                                                                borderRadius: "20px",
                                                                textTransform: "capitalize",
                                                                fontWeight: "600",
                                                                border: "2px solid #CCCCCC !important",
                                                                width: "14rem",
                                                                whiteSpace: "nowrap",
                                                                marginBottom: {xs: "1rem", sm: "0"}
                                                            }}
                                                        >
                                                            {resendPassLoading ?
                                                                <CircularProgress
                                                                    size={25}
                                                                    sx={{
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        color: "#fff"
                                                                    }}
                                                                /> : formatMessage({ id: "merchants.owner.resendpassbtn" })
                                                            }
                                                        </Button>
                                                        <Button
                                                            onClick={() => onEditOwner()}
                                                            id="edit-owner-btn"
                                                            variant="outlined"
                                                            size="large"
                                                            fullWidth
                                                            disabled={resendPassLoading || saveLoading || deleteLoading || statusLoading}
                                                            sx={{
                                                                color: "var(--color-dark-blue)",
                                                                backgroundColor: "#CCCCCC !important",
                                                                borderRadius: "20px",
                                                                textTransform: "capitalize",
                                                                fontWeight: "600",
                                                                border: "0 !important",
                                                                width: "14rem"
                                                            }}
                                                        >
                                                            {saveLoading ?
                                                                <CircularProgress
                                                                    size={25}
                                                                    sx={{
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        color: "var(--color-dark-blue)"
                                                                    }}
                                                                /> : formatMessage({ id: "company.save" })
                                                            }
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Box> : ""
                                        }
                                    </Box>
                                </Box>
                            )
                        })
                }
            </Container>

            {/* Delete owner */}
            <Dialog
                open={openDelete}
                onClose={() => setOpenDelete(false)}
                fullWidth
                maxWidth="xs"
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            borderRadius: "20px",
                        },
                    },
                }}
            >
                <DialogContent>
                    <Typography variant='h6' color={"#FA3E3E"} textAlign={"center"} fontWeight={600}>{formatMessage({ id: "merchants.create.warning" })}</Typography>
                    <Typography variant='body2' color={"#FA3E3E"} textAlign={"center"}>{formatMessage({ id: "merchants.owner.deletequestion" })} <span style={{ fontWeight: 600 }}>{selectedOwner?.name}</span></Typography>

                    <Box sx={{ marginTop: '1.5rem' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Button
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: "var(--color-blue)",
                                        color: "var(--color-dark-blue)",
                                        padding: ".4rem 1rem",
                                        borderRadius: "40px",
                                        fontWeight: "600",
                                        textTransform: "capitalize"
                                    }}
                                    onClick={() => setOpenDelete(false)}
                                    fullWidth
                                >
                                    {formatMessage({ id: "edoc.cancel" })}
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: "#FA3E3E",
                                        color: "#fff",
                                        padding: ".4rem 1rem",
                                        borderRadius: "40px",
                                        cursor: "pointer !important",
                                        fontWeight: "600",
                                        textTransform: "capitalize",
                                        whiteSpace: "nowrap"
                                    }}
                                    onClick={() => onDeleteOwner()}
                                    fullWidth
                                >
                                    {deleteLoading ?
                                        <CircularProgress
                                            size={22}
                                            sx={{
                                                color: "#fff !important",
                                            }}
                                        />
                                        : formatMessage({ id: "company.delete" })}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export default ManageOwners