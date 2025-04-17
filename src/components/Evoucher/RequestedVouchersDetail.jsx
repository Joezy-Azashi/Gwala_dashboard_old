import React from 'react'
import { Autocomplete, Badge, Box, DialogContent, Grid, Typography } from '@mui/material'
import { TextField } from '../UI'
import { useLocale } from '../../locales';
import TextInput from "../../components/UI/TextField";
import { useSelector } from 'react-redux';

function RequestedVouchersDetail({ detailInfo }) {
    const { formatMessage } = useLocale();
    const selectedUserState = useSelector((state) => state.userInfos);

    const employees = [
        { amount: "30", quantity: "20" },
        { amount: "50", quantity: "60" },
        { amount: "100", quantity: "12" },
        { amount: "500", quantity: "01" },
        { amount: "2500", quantity: "01" }
    ]

    return (
        <DialogContent sx={{ padding: "1.3rem 2rem" }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={selectedUserState?.manages?.length > 0 ? 6 : 4}>
                    <Typography variant='body2' fontWeight={600}>
                        {formatMessage({ id: "evoucher.vouchertype" })}
                    </Typography>
                    <TextField
                        fullWidth
                        value={detailInfo?.voucherType === "GENERAL" ? formatMessage({ id: "evoucher.general" }) : formatMessage({ id: "evoucher.restaurant" })}
                        size="small"
                        margin="dense"
                        inputProps={{ readOnly: true }}
                    />
                </Grid>

                <Grid item xs={12} sm={selectedUserState?.manages?.length > 0 ? 6 : 4}>
                    <Typography variant='body2' fontWeight={600}>
                        {formatMessage({ id: "advance.date" })}
                    </Typography>
                    <TextField
                        fullWidth
                        value={new Date(detailInfo.createdAt).toISOString().split("T")[0]}
                        size="small"
                        margin="dense"
                        inputProps={{ readOnly: true }}
                    />
                </Grid>

                {selectedUserState?.manages?.length > 0 &&
                    <Grid item xs={12} sm={selectedUserState?.manages?.length > 0 ? 6 : 4}>
                        <Typography variant='body2' fontWeight={600}>
                            {formatMessage({ id: "advance.branch" })}
                        </Typography>
                        <TextField
                            fullWidth
                            value={detailInfo?.company?.name}
                            size="small"
                            margin="dense"
                            inputProps={{ readOnly: true }}
                        />
                    </Grid>
                }

                <Grid item xs={12} sm={selectedUserState?.manages?.length > 0 ? 6 : 4}>
                    <Typography variant='body2' fontWeight={600}>
                        {formatMessage({ id: "evoucher.requeststatus" })}
                    </Typography>
                    <TextField
                        fullWidth
                        value={
                            detailInfo.status === "PENDING"
                                ? formatMessage({ id: "evoucher.pending" })
                                : detailInfo.status === "HANDLING"
                                    ? formatMessage({ id: "evoucher.handling" })
                                    : detailInfo.status === "PROCESSED"
                                        ? formatMessage({ id: "evoucher.processed" })
                                        : formatMessage({ id: "evoucher.rejected" })
                        }
                        size="small"
                        margin="dense"
                        inputProps={{ readOnly: true }}
                    />
                </Grid>

                <Grid item xs={12} mt={2}>
                    <Typography variant='body2' fontWeight={600} mb={2.5}>
                        {formatMessage({ id: "evoucher.requestedvouchers" })}
                    </Typography>
                    <Autocomplete
                        multiple
                        open={false}
                        readOnly
                        disableClearable
                        includeInputInList
                        id="tags-filled"
                        filterSelectedOptions
                        options={detailInfo?.vouchers}
                        getOptionLabel={(option) => option?.amount}
                        fullWidth
                        value={detailInfo?.vouchers}
                        sx={{
                            "& .MuiChip-root": {
                                backgroundColor: "var(--color-dark-blue)",
                                color: "#fff",
                                borderRadius: "8px 0 0 8px",
                                marginRight: "0"
                            },
                            "& .MuiSvgIcon-root": {
                                display: "none"
                            },
                            "& .MuiOutlinedInput-root": {
                                paddingTop: "25px"
                            },
                            "& .MuiAutocomplete-tag": {
                                marginRight: "1.5rem"
                            }
                        }}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Badge max={10000} key={option?._id} badgeContent={option?.quantity} sx={{ '& .MuiBadge-badge': { backgroundColor: "#B0B6C3", color: "#000", marginRight: "30px" }, "&.MuiBadge-root": { marginBottom: "16px" } }}>
                                    <Box {...getTagProps({ index })} sx={{ backgroundColor: "#DFEAFC", textAlign: "center", padding: ".2rem .5rem", borderRadius: "8px", marginRight: "10rem" }}>
                                        <Typography fontSize={"15px"} fontWeight={"600"} marginBottom={"-4px"}>{option?.amount}</Typography>
                                        <Typography fontSize={"11px"}>MAD</Typography>
                                    </Box>
                                </Badge>
                            ))
                        }
                        renderInput={(params) => (
                            <TextInput
                                InputLabelProps={{ shrink: true }}
                                {...params}
                                label={`${detailInfo?.vouchers.reduce((acc, val) => acc + val.quantity, 0)} ${formatMessage({ id: "evoucher.vouchers" })}`}
                            />
                        )}
                    />
                </Grid>
            </Grid>

        </DialogContent>
    )
}

export default RequestedVouchersDetail