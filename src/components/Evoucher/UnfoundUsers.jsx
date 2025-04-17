import React from 'react'
import { Box, DialogContent, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import warning2 from "../../assets/warning 2.png"
import { useNavigate } from 'react-router';
import { useLocale } from '../../locales';

const UnfoundUsers = ({ openunfound, setOpenunfound }) => {
    const navigate = useNavigate()
    const { formatMessage } = useLocale();

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "end" }}>
                <IconButton sx={{ margin: "1rem 1rem 0 0" }} onClick={() => { setOpenunfound({ open: false, data: [] }); navigate("/e-vouchers") }}>
                    <Close />
                </IconButton>
            </Box>
            <DialogContent sx={{ padding: "0 1.7rem 1.7rem 1.7rem" }}>

                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <img src={warning2} alt="warning" />
                </Box>
                <Typography variant={"h6"} fontWeight={"600"} color={"#FA3E3E"} textAlign={"center"} my={1}>{formatMessage({ id: "evoucher.unfoundtitle" })}</Typography>

                <Typography>{formatMessage({ id: "evoucher.unfoundnote" })}</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: .8 }} mt={2}>
                    {openunfound?.data?.map((el, index) => {
                        return (
                            <Box key={index} sx={{ backgroundColor: "var(--color-dark-blue)", color: "#fff", padding: "7px", borderRadius: "10px" }}>{el?.phone || "Empty phone No."}</Box>
                        )
                    })}
                </Box>
            </DialogContent>
        </>
    )
}

export default UnfoundUsers