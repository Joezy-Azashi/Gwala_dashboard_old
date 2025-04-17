import React from 'react'
import { Avatar, Box, Button, CircularProgress, DialogContent, Grid, IconButton, Typography } from '@mui/material'
import { useLocale } from '../../locales';
import { Close, Sync } from '@mui/icons-material';
import { TextField } from '../UI';
import cover from '../../assets/cover.png'

function EditRequestsDetails({ openDetail, setOpenDetail, acceptLoading, rejectLoading, changeStatus }) {
    const { formatMessage } = useLocale();

    const oldRequest = Object?.entries(openDetail?.data?.oldMerchantData || {})
    const newRequest = Object?.entries(openDetail?.data?.newMerchantData || {})

    return (
        <DialogContent sx={{ padding: "2.7rem 2rem" }}>
            <IconButton sx={{ position: "absolute", right: "1rem", top: "0.5rem" }} onClick={() => setOpenDetail({ state: false })}>
                <Close />
            </IconButton>
            <Box sx={{ backgroundImage: `url(${openDetail?.data?.merchant?.coverImage?.length < 1 || openDetail?.data?.merchant?.coverImage === undefined ? cover : openDetail?.data?.merchant?.coverImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', width: '100%', height: { sm: '7rem' }, borderRadius: "12px" }} />
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Avatar src={openDetail?.data?.merchant?.logo} sx={{ width: 56, height: 56, marginTop: "-1.6rem" }} />
            </Box>
            <Typography textAlign={"center"} variant='h6' color={"#002B69"} fontWeight={"600"} mb={2}>
                {openDetail?.data?.merchant?.name}
            </Typography>

            <Grid container spacing={2}>
                {oldRequest?.map((el, index) => {
                    return (
                        <Grid key={index} item xs={12} sm={12}>
                            {el[0] !== "logo" &&
                                <Typography variant='body2' fontWeight={600} textTransform={"capitalize"}>
                                    {el[0] === "coverImage" ? "Cover Image" : el[0] === "primaryPhone" ? "Phone Number" : el[0]}
                                </Typography>}

                            {el[0] === "logo" ?
                                <Avatar src={el[1]} sx={{ width: 56, height: 56, margin: "auto" }} /> :
                                el[0] === "coverImage" ?
                                    <Box sx={{ backgroundImage: `url(${el[1]?.length < 1 ? cover : el[1]})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', width: '100%', height: { xs: '7rem' } }} />
                                    :
                                    <TextField
                                        fullWidth
                                        value={el[1]}
                                        size="small"
                                        margin="dense"
                                        inputProps={{ readOnly: true }}
                                    />
                            }
                        </Grid>
                    )
                })}

                <Grid item xs={12} sm={12} sx={{ display: "flex", justifyContent: "center" }}>
                    <Sync fontSize='large' sx={{ cursor: "pointer" }} />
                </Grid>

                {newRequest?.map((el, index) => {
                    return (
                        <Grid key={index} item xs={12} sm={12}>
                            {el[0] !== "logo" &&
                                <Typography variant='body2' fontWeight={600} textTransform={"capitalize"}>
                                    {el[0] === "coverImage" ? "Cover Image" : el[0] === "primaryPhone" ? "Phone Number" : el[0]}
                                </Typography>}

                            {el[0] === "logo" ?
                                <Avatar src={el[1]} sx={{ width: 56, height: 56, margin: "auto"  }} /> :
                                el[0] === "coverImage" ?
                                    <Box sx={{ backgroundImage: `url(${el[1]?.length < 1 ? cover : el[1]})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', width: '100%', height: { xs: '7rem' } }} />
                                    :
                                    <TextField
                                        fullWidth
                                        value={el[1]}
                                        size="small"
                                        margin="dense"
                                        inputProps={{ readOnly: true }}
                                    />
                            }
                        </Grid>
                    )
                })}
            </Grid>

            {
                openDetail?.data?.requestStatus === 'pending' &&
                <Grid container spacing={2} mt={3}>
                    <Grid item xs={12} sm={1} />
                    <Grid item xs={12} sm={5}>
                        <Button
                            onClick={() => changeStatus("rejected", openDetail?.data?.id)}
                            id="reject"
                            variant="outlined"
                            fullWidth
                            sx={{
                                color: "#fff ",
                                backgroundColor: "#FA3E3E !important",
                                borderRadius: "20px",
                                textTransform: "capitalize",
                                fontWeight: "600",
                                borderColor: "var(--color-cyan) !important"
                            }}
                        >
                            {rejectLoading ? <CircularProgress
                                size={25}
                                sx={{
                                    color: "#fff !important",
                                }}
                            /> : formatMessage({ id: "advance.confirm.rejeter" })}
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <Button
                            onClick={() => changeStatus("accepted", openDetail?.data?.id)}
                            id="accept"
                            variant="outlined"
                            fullWidth
                            sx={{
                                color: "#fff !important",
                                backgroundColor: "var(--color-dark-blue) !important",
                                borderRadius: "20px",
                                textTransform: "capitalize",
                                fontWeight: "600",
                                borderColor: "var(--color-dark-blue) !important",
                            }}
                        >
                            {acceptLoading ? <CircularProgress
                                size={25}
                                sx={{
                                    color: "#fff !important",
                                }}
                            /> : formatMessage({ id: "evoucher.accept" })}
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={1} />
                </Grid>
            }
        </DialogContent>
    )
}

export default EditRequestsDetails