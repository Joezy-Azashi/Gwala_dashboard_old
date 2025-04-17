import React from 'react'
import { Autocomplete, Box, Button, Chip, CircularProgress, DialogContent, Grid, Typography } from '@mui/material'
import { TextField } from '../../UI'
import TextInput from "../../../components/UI/TextField";
import { useLocale } from '../../../locales';
import { Send } from '@mui/icons-material';

const SmsDetails = ({ openDetail, ResendSMS, sendLoading }) => {
    const { formatMessage } = useLocale();

    return (
        <DialogContent sx={{ padding: "1.3rem 2rem" }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label={formatMessage({ id: "settings.phone" })}
                        value={openDetail?.data?.phonenumber}
                        size="small"
                        margin="dense"
                        inputProps={{ readOnly: true }}
                    />
                </Grid>

                <Grid item xs={12} sm={6} mt={1}>
                    <Autocomplete
                        multiple
                        open={false}
                        readOnly
                        disableClearable
                        includeInputInList
                        id="tags-filled"
                        size='small'
                        filterSelectedOptions
                        options={[openDetail?.data?.type || "----"]}
                        getOptionLabel={(option) => option}
                        fullWidth
                        value={[openDetail?.data?.type || "----"]}
                        sx={{
                            "& .MuiChip-root": {
                                backgroundColor: "var(--color-dark-blue)",
                                color: "#fff",
                                borderRadius: "8px",
                            },
                            "& .MuiSvgIcon-root": {
                                display: "none"
                            },
                        }}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Box key={index}>
                                    <Chip
                                        size='small'
                                        variant="outlined"
                                        label={option}
                                        {...getTagProps({ index })}
                                    />
                                </Box>
                            ))
                        }
                        renderInput={(params) => (
                            <TextInput
                                InputLabelProps={{ shrink: true }}
                                {...params}
                                label={formatMessage({ id: "sms.smstype" })}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} >
                    <TextField
                        fullWidth
                        label={formatMessage({ id: "sms.sentstatus" })}
                        value={openDetail?.data?.isSent ? "Sent" : "Not Sent"}
                        size="small"
                        margin="dense"
                        inputProps={{ readOnly: true }}
                    />
                </Grid>

                <Grid item xs={12} >
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label={formatMessage({ id: "sms.msgbody" })}
                        value={openDetail?.data?.message}
                        size="small"
                        margin="dense"
                        inputProps={{ readOnly: true }}
                    />
                </Grid>

                <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                        variant="outlined"
                        startIcon={<Send />}
                        sx={{
                            border: "1px solid var(--color-dark-blue) !important",
                            color: "var(--color-dark-blue) !important",
                            textTransform: "capitalize",
                            borderRadius: "15px"
                        }}
                        onClick={() => ResendSMS(openDetail?.data)}
                    >
                        {sendLoading ?
                            <CircularProgress
                                size={25}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: "var(--color-dark-blue)"
                                }}
                            /> :
                            formatMessage({ id: "sms.resend" })}
                    </Button>
                </Grid>
            </Grid>
        </DialogContent>
    )
}

export default SmsDetails