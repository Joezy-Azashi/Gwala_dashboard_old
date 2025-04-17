import React from 'react'
import { Box, Button, DialogContent, Grid, IconButton, Typography } from '@mui/material'
import { useLocale } from '../../locales';
import { IOSSwitch } from '../UI';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Close } from '@mui/icons-material';

function AvailabilityDialog({ schedule, setOpenAvailability, days, getAvailableDays }) {
    const { formatMessage } = useLocale();

    return (
        <DialogContent>
            <IconButton sx={{ position: "absolute", right: "1rem", top: "0.5rem" }} onClick={() => setOpenAvailability(false)}>
                <Close />
            </IconButton>
            <Typography textAlign={"center"} variant='h6' color={"#002B69"} fontWeight={"600"} mb={1}>
                {formatMessage({ id: "merchants.weekdaysavailability" })}
            </Typography>

            <Typography textAlign={"center"} variant='body2' fontWeight={"600"} mb={2}>
                {formatMessage({ id: "merchants.scheduleconfig" })}
            </Typography>

            <Grid container spacing={2} mb={2} sx={{ alignItems: "center" }}>
                {days?.map((el, index) => {
                    return (
                        <>
                            <Grid key={index} item xs={2}>
                                <Typography sx={{ margin: ".5rem 0" }} fontWeight={600}>{formatMessage({ id: el?.string })}</Typography>
                            </Grid>
                            <Grid item xs={2} sx={{ display: "flex", justifyContent: "center" }}>
                                <IOSSwitch
                                    id="open"
                                    checked={schedule?.filter((ft) => ft?.day === el?.value)[0]?.isOpen === "true"}
                                    onClick={(e) => getAvailableDays(el, "", "")}
                                />
                            </Grid>

                            {schedule?.filter((ft) => ft?.day === el?.value)[0]?.isOpen === "true" ?
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Grid item xs={3.5}>
                                        <input
                                            type="time"
                                            format="hh:mm:ss"
                                            id="time"
                                            step="1"
                                            value={el?.openAt}
                                            onChange={(e) => getAvailableDays(el, e.target.value, el?.closeAt)}
                                            style={{
                                                background: "#fff",
                                                border: "1px solid black",
                                                display: "block",
                                                marginBottom: ".625em",
                                                marginTop: ".3em",
                                                outlineOffset: "3px",
                                                padding: ".45em .45em .45em .65em",
                                                width: "100%"
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={1} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {formatMessage({ id: "merchants.scheduleto" })}
                                    </Grid>
                                    <Grid item xs={3.5}>
                                        <input
                                            type="time"
                                            step="1"
                                            format="hh:mm:ss"
                                            id="time"
                                            value={el?.closeAt}
                                            onChange={(e) => getAvailableDays(el, el?.openAt, e.target.value)}
                                            style={{
                                                background: "#fff",
                                                border: "1px solid black",
                                                display: "block",
                                                marginBottom: ".625em",
                                                marginTop: ".3em",
                                                outlineOffset: "3px",
                                                padding: ".45em .45em .45em .65em",
                                                width: "100%"
                                            }}
                                        />
                                    </Grid>
                                </LocalizationProvider> :
                                <Grid item xs={8} />
                            }
                        </>
                    )
                })}
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "end" }}>
                <Button
                    onClick={() => setOpenAvailability(false)}
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
                        border: "0 !important",
                        width: "10rem"
                    }}
                >
                    {formatMessage({ id: "employer.close" })}
                </Button>
            </Box>
        </DialogContent>
    )
}

export default AvailabilityDialog