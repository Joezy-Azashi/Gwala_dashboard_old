import React, { useState } from 'react'
import { DialogContent, DialogActions, Typography, TextField, Grid } from "@mui/material";
import Button from "../../components/UI/Button"
import { useLocale } from '../../locales';

function RejectApproval({ setOpenReject, approveRequest, rejectId, rejectReason, setRejectReason, saveLoading }) {
    const { formatMessage } = useLocale();
    const [summary, setSummary] = useState("")

    return (
        <>
            <DialogContent sx={{ paddingBottom: "4px" }}>
                <Typography variant='h6' fontWeight={600} textAlign={"center"} color={"var(--color-dark-blue)"} mb={2}>{formatMessage({ id: "phone.request.dialog.rejectreason" })}</Typography>

                <TextField
                    size='small'
                    value={rejectReason}
                    onChange={(e) => { setRejectReason(e.target.value); setSummary(e.target.value); }}
                    sx={{ backgroundColor: "var(--color-white)" }}
                    variant='outlined'
                    label={formatMessage({ id: "phone.request.dialog.reason" })}
                    inputProps={{ maxLength: 200 }}
                    fullWidth
                    multiline
                    rows={7}
                    helperText={
                        summary?.length > 0 ? (
                            <p style={{ color: "#2E405B" }}>
                                {summary.length}{" "}
                                <span>
                                    {formatMessage({ id: "phone.request.dialog.chars" })}
                                </span>
                            </p>
                        ) : (
                            <div className="">
                                <p className="error-text">
                                    {formatMessage({ id: "phone.request.dialog.max" })}
                                </p>
                            </div>
                        )
                    }
                />
                
                <DialogActions >
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Button
                                onClick={() => { setOpenReject(false); setRejectReason("") }}
                                text={formatMessage({ id: "employee.cancel" })}
                                bgColor={`var(--color-danger)`}
                                color={"#fff"}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                onClick={() => approveRequest("rejected", rejectId)}
                                loading={saveLoading}
                                text={formatMessage({ id: "timetracker.save" })}
                            />
                        </Grid>
                    </Grid>
                </DialogActions>
            </DialogContent>
        </>
    )
}

export default RejectApproval