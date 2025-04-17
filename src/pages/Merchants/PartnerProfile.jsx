import React, { useEffect, useState } from 'react'
import { Autocomplete, Avatar, Box, Button, CircularProgress, Dialog, Grid, IconButton, Typography } from '@mui/material';
import { useLocale } from '../../locales';
import { ArrowForward, EditOutlined } from '@mui/icons-material';
import UploadProfileImage from '../../components/Merchants/UploadProfileImage';
import { useNavigate, useParams } from 'react-router';
import { TextField } from '../../components/UI';
import axiosMerchant from '../../api/merchantRequest';
import PageSpinner from '../../components/pagespinner/PageSpinner';
import DeletePartner from '../../components/Merchants/DeletePartner';
import { toast } from 'react-toastify';
import { cities } from '../../config/cities';

const PartnerProfile = () => {
    const { formatMessage } = useLocale();
    const navigate = useNavigate()
    const { id } = useParams()

    const [logo, setLogo] = useState("")
    const [openPicUpload, setOpenPicUpload] = useState({ type: "", state: false });
    const [saveLoading, setSaveLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [merchantName, setMerchantName] = useState("");
    const [address, setAddress] = useState("");
    const [color, setColor] = useState("");
    const [city, setCity] = useState("");
    const [lng, setLng] = useState();
    const [lat, setLat] = useState();
    const [error, setError] = useState(false);

    const savePartner = () => {
        const dataToSend = {
            name: merchantName,
            address: address,
            logo: logo,
            color: color,
            city: city,
            isMerchant: false,
            geoPoint: {
                type: "Point",
                coordinates: [
                    { lng, lat }
                ]?.map(coord => [Number(coord.lng), Number(coord.lat)])[0]
            },
        }

        if (merchantName?.length < 1 || lng?.length < 1 || !lng || lat?.length < 1 || !lat) {
            setError(true)
            toast(formatMessage({ id: "merchants.create.error" }), {
                theme: "colored",
                type: "error",
            });
        } else {
            setSaveLoading(true)
            if (id) {
                axiosMerchant.patch(`locations/${id}`, dataToSend)
                    .then((res) => {
                        setSaveLoading(false)
                        if (res?.response?.data?.error) {
                            toast(res?.response?.data?.error?.message, {
                                theme: "colored",
                                type: "error",
                            });
                        } else {
                            toast(formatMessage({ id: "merchants.create.partnersuccess" }), {
                                theme: "colored",
                                type: "success",
                            });
                            navigate("/merchants", { state: { geolocation: true } })
                        }
                    })
                    .catch((error) => {
                        setSaveLoading(false)
                    })
            } else {
                axiosMerchant.post(`locations`, dataToSend)
                    .then((res) => {
                        setSaveLoading(false)
                        if (res?.response?.data?.error) {
                            toast("An error occured", {
                                theme: "colored",
                                type: "error",
                            });
                        } else {
                            toast(formatMessage({ id: "merchants.create.partnersuccess" }), {
                                theme: "colored",
                                type: "success",
                            });
                            // navigate("/merchants", { state: { geolocation: true } })
                        }
                    })
                    .catch((error) => {
                        setSaveLoading(false)
                    })
            }
        }
    }

    const getPartnerDetails = () => {
        setEditLoading(true)
        axiosMerchant.get(`/locations/${id}`)
            .then((res) => {
                setEditLoading(false)
                setLogo(res?.data?.logo)
                setMerchantName(res?.data?.name)
                setAddress(res?.data?.address)
                setColor(res?.data?.color)
                setCity(res?.data?.city)
                setLng(Number(res?.data?.geoPoint?.coordinates[0]))
                setLat(Number(res?.data?.geoPoint?.coordinates[1]))
            })
            .catch((error) => {
                setEditLoading(false)
            })
    }

    useEffect(() => {
        if (id) {
            getPartnerDetails()
        }
    }, [])

    const onDeletePartner = () => {
        setDeleteLoading(true)

        axiosMerchant.delete(`/locations/${id}`)
            .then((res) => {
                setDeleteLoading(false)
                toast(formatMessage({ id: "merchants.create.deletepartnersuccess" }), {
                    theme: "colored",
                    type: "success",
                });
                navigate("/merchants", { state: { geolocation: true } })
            })
            .catch((error) => {
                setDeleteLoading(false)
            })
    }

    const sortCities = (a, b) => {
        if (a?.city?.toLowerCase() < b?.city?.toLowerCase()) return -1;
        if (a?.city?.toLowerCase() > b?.city?.toLowerCase()) return 1;
        return 0;
    };

    return (
        <>
            <Box sx={{ padding: "2rem 35px" }}>
                <Typography variant="h4" fontWeight={"600"} color={"var(--color-dark-blue)"} textAlign={"center"} paddingBottom={{ sm: "1.5rem" }}>
                    {formatMessage({ id: "merchants.create.partnerprofiletitle" })}
                </Typography>

                {id && editLoading ?
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                        <PageSpinner />
                    </Box> :
                    <>
                        <Box sx={{ display: "flex", justifyContent: "center", mb: '1.5rem' }}>
                            <Avatar src={logo?.length < 1 ? "" : logo} sx={{ width: 86, height: 86 }} />
                            <IconButton
                                onClick={() => setOpenPicUpload({ type: "logo", state: true })}
                                sx={{
                                    width: "2rem",
                                    height: "2rem",
                                    bgcolor: '#fff',
                                    border: "1px solid #BDBDBD",
                                    marginLeft: "-1rem",
                                    ':hover': { bgcolor: 'var(--color-cyan)' }
                                }}><EditOutlined sx={{ fontSize: '1.5rem', color: '#000' }} />
                            </IconButton>
                        </Box>

                        <Grid container spacing={3}>
                            <Grid item xs={0} md={1} lg={2.5} />

                            <Grid item xs={12} md={10} lg={7}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            id="name"
                                            fullWidth
                                            label={<span>{formatMessage({ id: "merchants.partnername" })}<span style={{ color: "red" }}>*</span></span>}
                                            size="small"
                                            margin="dense"
                                            value={merchantName}
                                            error={merchantName?.length > 0 ? false : error}
                                            onChange={(e) => { setMerchantName(e.target.value); setError(false) }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            label={formatMessage({ id: "profile.address" })}
                                            type="address"
                                            fullWidth
                                            size="small"
                                            margin="dense"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, marginTop: ".9rem" }}>
                                            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                                            {color}
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            id="lng"
                                            size="small"
                                            label={<span>{"Longitude"}<span style={{ color: "red" }}>*</span></span>}
                                            fullWidth
                                            sx={{ '&.MuiFormControl-root': { marginTop: ".47rem" } }}
                                            value={lng}
                                            error={lng || lng?.length > 0 ? false : error}
                                            onChange={(e) => { setLng(!Number.isNaN(Number(e.target.value)) || e.target.value === "-" ? e.target.value : value); setError(false) }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            id="lat"
                                            size="small"
                                            label={<span>{"Latitude"}<span style={{ color: "red" }}>*</span></span>}
                                            fullWidth
                                            sx={{ '&.MuiFormControl-root': { marginTop: ".47rem" } }}
                                            value={lat}
                                            error={lat || lat?.length > 0 ? false : error}
                                            onChange={(e) => { setLat(!Number.isNaN(Number(e.target.value)) || e.target.value === "-" ? e.target.value : value); setError(false) }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Autocomplete
                                            id="city"
                                            sx={{
                                                "& .MuiFormControl-root": {
                                                    marginTop: ".47rem"
                                                },
                                                "& fieldset": { border: "none" },
                                                // "& .MuiSvgIcon-root": { display: "none" }
                                            }}
                                            value={id && cities?.filter((ft) => ft?.city === city)[0]}
                                            size="small"
                                            InputLabelProps={{ shrink: false }}
                                            fullWidth
                                            options={cities.sort(sortCities)}
                                            getOptionLabel={(option) => `${option?.city}`}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={city !== "" ? "" : formatMessage({ id: "merchants.city" })}
                                                />
                                            )}
                                            onChange={(_, value, reason) => {
                                                if (reason === "clear") {
                                                    setCity("");
                                                    return;
                                                } else {
                                                    setCity(value?.city);
                                                }
                                            }}
                                        />
                                    </Grid>

                                    {id &&
                                        <Grid item xs={12} sm={6}>
                                            <Button
                                                onClick={() => navigate(`/manage-map/${id}`)}
                                                id="check-on-map"
                                                variant="contained"
                                                fullWidth
                                                sx={{
                                                    color: "#fff",
                                                    backgroundColor: "#347AF0",
                                                    textTransform: "none",
                                                    borderColor: "#347AF0",
                                                    marginTop: ".55rem"
                                                }}
                                                endIcon={<ArrowForward />}
                                            >
                                                {formatMessage({ id: "merchants.create.partnercheckonmap" })}
                                            </Button>
                                        </Grid>
                                    }

                                    <Grid item xs={12} />

                                    <Grid item xs={12} sm={id ? 0 : 2} />
                                    <Grid item xs={12} sm={4} my={{ xs: 0, sm: 3 }}>
                                        <Button
                                            onClick={() => navigate("/merchants", { state: { geolocation: true } })}
                                            id="request-voucher"
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
                                    {id &&
                                        <Grid item xs={12} sm={4} my={{ xs: 0, sm: 3 }}>
                                            <Button
                                                onClick={() => setOpenDelete(true)}
                                                id="request-voucher"
                                                variant="outlined"
                                                size="large"
                                                fullWidth
                                                sx={{
                                                    color: "#fff",
                                                    backgroundColor: "#FA3E3E !important",
                                                    borderRadius: "20px",
                                                    textTransform: "capitalize",
                                                    fontWeight: "600",
                                                    border: "0 !important"
                                                }}
                                            >
                                                {formatMessage({ id: "merchants.create.deletepartner" })}
                                            </Button>
                                        </Grid>
                                    }
                                    <Grid item xs={12} sm={4} my={{ xs: 0, sm: 3 }}>
                                        <Button
                                            onClick={() => savePartner()}
                                            id="request-voucher"
                                            variant="outlined"
                                            size="large"
                                            fullWidth
                                            disabled={saveLoading}
                                            sx={{
                                                color: "#fff",
                                                backgroundColor: "var(--color-dark-blue) !important",
                                                borderRadius: "20px",
                                                textTransform: "capitalize",
                                                fontWeight: "600",
                                                border: "0 !important"
                                            }}
                                        >
                                            {saveLoading ?
                                                <CircularProgress
                                                    size={25}
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        color: "#fff"
                                                    }}
                                                /> : id ? formatMessage({ id: "merchants.create.update" }) : formatMessage({ id: "filter.add" })
                                            }
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} sm={id ? 0 : 2} />
                                </Grid>
                            </Grid>

                            <Grid item xs={0} md={1} lg={2.5} />
                        </Grid>
                    </>
                }

                {/* Profile Image upload dialog */}
                <Dialog
                    open={openPicUpload.state}
                    onClose={() => setOpenPicUpload({ type: "", state: false })}
                    fullWidth
                    maxWidth={openPicUpload.type === "logo" ? "xs" : "md"}
                >
                    <UploadProfileImage
                        openPicUpload={openPicUpload}
                        setOpenPicUpload={setOpenPicUpload}
                        setLogo={setLogo}
                    />
                </Dialog>

                {/* Delete merchant profile */}
                <Dialog
                    open={openDelete}
                    onClose={() => setOpenDelete(false)}
                    fullWidth
                    sx={{ "& .MuiDialog-paper": { borderRadius: "35px" } }}
                    maxWidth={"xs"}
                >
                    <DeletePartner
                        deleteLoading={deleteLoading}
                        setOpenDelete={setOpenDelete}
                        onDeletePartner={onDeletePartner}
                    />
                </Dialog>
            </Box>
        </>
    )
}

export default PartnerProfile