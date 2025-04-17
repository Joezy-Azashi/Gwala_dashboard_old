import React, { useState } from 'react'
import { Autocomplete, Badge, Box, Chip, DialogContent, Grid, Typography } from '@mui/material'
import { TextField } from '../UI'
import { useLocale } from '../../locales';
import TextInput from "../../components/UI/TextField";
import { useSelector } from 'react-redux';
import moment from 'moment';
import PhysicalChequesComponent from './PhysicalChequesComponent';

function NondigitalVoucherDetail({ detailInfo }) {
    const { formatMessage } = useLocale();
    const selectedUserState = useSelector((state) => state.userInfos);
    const [phoneNumbers, setPhoneNumbers] = useState([])

    const arrayOfObjects = detailInfo?.userMetaData.map(str => JSON.parse(str))

    useState(() => {
        if (arrayOfObjects) {
            const deduplicatedData = Array?.from(new Set(arrayOfObjects.map(item => item?.Telephone))).map(Telephone => ({
                phone: Telephone,
                quantity: 1
            }));

            const result = deduplicatedData?.map(item => {
                const { phone, quantity } = item;
                const count = arrayOfObjects?.filter(d => d?.Telephone === phone)?.length;
                return { phone, quantity: quantity + count - 1 };
            });

            setPhoneNumbers(result);
        }
    }, [arrayOfObjects])

    return (
        <DialogContent sx={{ padding: "1.3rem 2rem" }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={selectedUserState?.manages?.length > 0 ? 4 : 6}>
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

                <Grid item xs={12} sm={selectedUserState?.manages?.length > 0 ? 4 : 6}>
                    <Typography variant='body2' fontWeight={600}>
                        {formatMessage({ id: "merchants.category" })}
                    </Typography>
                    <TextField
                        fullWidth
                        value={detailInfo?.category === "SMS"
                            ? formatMessage({ id: "evoucher.sms" })
                            : formatMessage({ id: "evoucher.physical" })}
                        size="small"
                        margin="dense"
                        inputProps={{ readOnly: true }}
                    />
                </Grid>

                {selectedUserState?.manages?.length > 0 &&
                    <Grid item xs={12} sm={selectedUserState?.manages?.length > 0 ? 4 : 6}>
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

                <Grid item xs={12} sm={6}>
                    <Typography variant='body2' fontWeight={600}>
                        {formatMessage({ id: "evoucher.operationdate" })}
                    </Typography>
                    <TextField
                        fullWidth
                        value={moment(detailInfo?.date).format("DD/MM/YYYY")}
                        size="small"
                        margin="dense"
                        inputProps={{ readOnly: true }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant='body2' fontWeight={600}>
                        {formatMessage({ id: "evoucher.doneby" })}
                    </Typography>
                    <TextField
                        fullWidth
                        value={`${detailInfo?.employer?.firstName} ${detailInfo?.employer?.lastName}`}
                        size="small"
                        margin="dense"
                        inputProps={{ readOnly: true }}
                    />
                </Grid>

                <Grid item xs={12} mt={2} className='pageScroll'>
                    <Typography variant='body2' fontWeight={600}>
                        {formatMessage({ id: "evoucher.assignvouchers" })}
                    </Typography>
                    {detailInfo?.category === "SMS" ?
                        <Autocomplete
                            multiple
                            open={false}
                            readOnly
                            disableClearable
                            includeInputInList
                            id="tags-filled"
                            filterSelectedOptions
                            options={phoneNumbers}
                            getOptionLabel={(option) => option?.phone}
                            fullWidth
                            value={phoneNumbers}
                            sx={{
                                "& .MuiChip-root": {
                                    backgroundColor: "var(--color-dark-blue)",
                                    color: "#fff",
                                    borderRadius: "8px",
                                    marginRight: "0",
                                    minWidth: "120px !important",
                                },
                                "& .MuiSvgIcon-root": {
                                    display: "none",
                                },
                                maxHeight: "15rem",
                                overflow: "auto",
                                paddingTop: "2rem"
                            }}
                            renderTags={(value, getTagProps) =>
                                <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5 }}>
                                    {
                                        value?.map((option, index) => (
                                            <Box key={index} sx={{ display: "flex", alignItems: "center" }} title={option?.phone}>
                                                <Chip
                                                    variant="outlined"
                                                    label={option?.phone}
                                                    {...getTagProps({ index })}
                                                />
                                                {option?.quantity !== "" && option?.quantity !== 1 && option?.phone !== undefined && (
                                                    <Typography
                                                        fontSize={"13px"}
                                                        sx={{
                                                            backgroundColor: "#87CEFA",
                                                            padding: "5.6px 0",
                                                            textAlign: "center",
                                                            borderRadius: "0 8px 8px 0",
                                                            width: "2rem",
                                                            marginLeft: "-.4rem",
                                                            marginTop: ".9px"
                                                        }}
                                                    >
                                                        {option?.quantity}
                                                    </Typography>
                                                )}
                                            </Box>
                                        ))}</Box>
                            }
                            renderInput={(params) => (
                                <TextInput
                                    InputLabelProps={{ shrink: true }}
                                    {...params}
                                    label={`Assign ${detailInfo?.amount} MAD vouchers to`}
                                />
                            )}
                        /> :
                        <Box sx={{ backgroundColor: "#DFEAFC", height: "9rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <PhysicalChequesComponent
                                branchName={detailInfo?.company?.name}
                                amount={detailInfo?.amount}
                                num={detailInfo?.count}
                                dontShowControls={true}
                            />
                        </Box>
                    }
                </Grid>
            </Grid>

        </DialogContent>
    )
}

export default NondigitalVoucherDetail