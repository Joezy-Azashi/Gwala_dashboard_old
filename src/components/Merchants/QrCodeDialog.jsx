import React from 'react'
import { Box, DialogContent, IconButton, Typography } from '@mui/material'
import { Close, DownloadOutlined } from '@mui/icons-material'

function QrCodeDialog({ openqr, setOpenqr }) {
    return (
        <DialogContent>
            <IconButton sx={{ position: "absolute", right: ".1rem", top: "0.1rem" }} onClick={() => setOpenqr({ state: false })}>
                <Close fontSize='small' />
            </IconButton>


            <Box sx={{ display: "flex", justifyContent: "center", padding: "0.3rem 1.3rem" }}>
                <Box>
                    <Typography textAlign={"center"} fontWeight={600} textTransform={"capitalize"} mt={1}>{openqr?.data?.name}</Typography>
                    <img src={openqr?.data?.qrCode} width={170} height={170} />
                </Box>
            </Box>

            <a href={openqr?.data?.qrCode} download={openqr?.data?.name + "-qrcode"}>
                <IconButton sx={{ position: "absolute", right: ".1rem", bottom: "0.1rem" }}>
                    <DownloadOutlined fontSize='small' />
                </IconButton>
            </a>
        </DialogContent>
    )
}

export default QrCodeDialog