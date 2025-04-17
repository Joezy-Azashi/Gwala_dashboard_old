import React from 'react'
import { Box, Button, CircularProgress, DialogContent, Grid, Typography } from '@mui/material'
import warning2 from "../../assets/warning 2.png"
import { useLocale } from '../../locales';

function DeleteMerchant({deleteLoading, setOpenDelete, onDeleteMerchant}) {
    const { formatMessage } = useLocale();

    return (
        <DialogContent>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <img src={warning2} alt="warning" />
            </Box>

            <Typography variant='h6' color={"#FA3E3E"} textAlign={"center"} fontWeight={600}>{formatMessage({ id: "merchants.create.warning" })}</Typography>
            <Typography variant='body2' color={"#FA3E3E"} textAlign={"center"}>{formatMessage({ id: "merchants.create.warningnote" })}</Typography>

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
                            onClick={() => onDeleteMerchant()}
                            fullWidth
                        >
                            {deleteLoading ?
                                <CircularProgress
                                    size={22}
                                    sx={{
                                        color: "#fff !important",
                                    }}
                                />
                                : formatMessage({ id: "edoc.deleteanyway" })}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </DialogContent>
    )
}

export default DeleteMerchant