import React from 'react'
import { DialogContent, DialogActions, Typography, TextField, Box, IconButton } from "@mui/material";
import Button from "../../components/UI/Button"
import { useLocale } from '../../locales';
import { differenceTwoDate } from '../../utils';
import { Close } from '@mui/icons-material';

function RejectInfoDialog({ rejectInfo, setReason }) {
    const { formatMessage } = useLocale();

    return (
        <DialogContent sx={{ color: "var(--color-dark-blue)" }}>
            <IconButton onClick={() => setReason(false)} sx={{ position: "absolute", right: "0", top: "0" }}><Close /></IconButton>
            <Typography variant='h6' fontWeight={600} textAlign={"center"} mb={1.5}>
                {
                    rejectInfo.type === "ABSENCE" ?
                        formatMessage({ id: "phone.request.dialog.absencetitle" }) :
                        formatMessage({ id: "phone.request.dialog.vacationtitle" })
                }
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }} mb={1}>
                <Typography fontSize={"15px"} fontWeight={600}>{formatMessage({ id: "phone.request.dialog.fullname" })}: </Typography>
                <Typography fontSize={"15px"}>{rejectInfo?.user?.firstName + " " + rejectInfo?.user?.lastName}</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }} mb={1}>
                <Typography fontSize={"15px"} fontWeight={600}>{formatMessage({ id: "phone.request.dialog.days" })}: </Typography>
                <Typography fontSize={"15px"}>{`${differenceTwoDate(
                    rejectInfo?.startDate,
                    rejectInfo?.endDate
                )} days`}
                </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }} mb={1}>
                <Typography fontSize={"15px"} fontWeight={600}>{formatMessage({ id: "phone.request.dialog.status" })}: </Typography>
                <Typography fontSize={"15px"} color="red" textTransform={"capitalize"}>{rejectInfo?.status}</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography fontSize={"15px"} fontWeight={600}>{formatMessage({ id: "phone.request.dialog.reason" })}: </Typography>
                <Typography fontSize={"15px"} textTransform={"capitalize"}>{rejectInfo?.rejectReason}</Typography>
            </Box>

        </DialogContent>
    )
}

export default RejectInfoDialog