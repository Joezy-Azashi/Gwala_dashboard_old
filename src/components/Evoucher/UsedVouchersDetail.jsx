import React from 'react'
import { Autocomplete, Box, Chip, DialogContent, Grid, Typography } from '@mui/material'
import { TextField } from '../UI'
import TextInput from "../../components/UI/TextField";
import { useLocale } from '../../locales';

function UsedVouchersDetail({ detailInfo }) {
    const { formatMessage } = useLocale();

    return (
        <DialogContent sx={{ padding: "1.3rem 2rem" }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Typography variant='body2' fontWeight={600} mb={1.5}>
                        {formatMessage({ id: "evoucher.voucheramount" })}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "#002B69",
                            cursor: "pointer",
                        }}
                    >
                        <Box sx={{ backgroundColor: "#DFEAFC", textAlign: "center", padding: ".2rem .5rem", borderRadius: "8px" }}>
                            <Typography fontSize={"15px"} fontWeight={"600"} marginBottom={"-4px"}>{detailInfo?.amount}</Typography>
                            <Typography fontSize={"11px"}>MAD</Typography>
                        </Box>
                        <Typography fontWeight={"600"} noWrap>
                            {`Voucher of ${detailInfo?.amount} MAD`}
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
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

                <Grid item xs={12} mt={2}>
                    <Typography variant='body2' fontWeight={600} mb={2.5}>
                        {formatMessage({ id: "evoucher.assignedto" })}
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
                        getOptionLabel={(option) => option?.users ? `${option?.users?.firstName} ${option?.users?.lastName}` : "-"}
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
                        }}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                                    <Chip
                                        variant="outlined"
                                        label={option?.users ? `${option?.users?.firstName} ${option?.users?.lastName}` : "-"}
                                        {...getTagProps({ index })}
                                    />
                                    {
                                        option?.quantity !== "" &&
                                        <Typography fontSize={"13px"} sx={{ backgroundColor: "#87CEFA", padding: "5.6px 8px", borderRadius: "0 8px 8px 0" }}>
                                            {option?.quantity}
                                        </Typography>
                                    }
                                </Box>
                            ))
                        }
                        renderInput={(params) => (
                            <TextInput
                                InputLabelProps={{ shrink: true }}
                                {...params}
                                label={detailInfo?.vouchers?.length > 1 ? `${detailInfo?.vouchers?.length} employees` : `${detailInfo?.vouchers?.length} employee`}
                            />
                        )}
                    />
                </Grid>
            </Grid>

        </DialogContent>
    )
}

export default UsedVouchersDetail