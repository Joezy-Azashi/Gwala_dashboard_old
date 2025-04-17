import React, { useState } from 'react'
import { Box, Button, Container, Grid, Typography } from '@mui/material'
import smsselected from "../../assets/gsmsselected.png"
import smsunselected from "../../assets/gsmsunselected.png"
import notificationselected from "../../assets/gnotificationselected.png"
import notificationunselected from "../../assets/gnotificationunselected.png"
import { useLocale } from '../../locales'
import { useNavigate } from 'react-router'

const GwalaSends = () => {
    const { formatMessage } = useLocale();
    const navigate = useNavigate()
    const [screenWidth, setscreenWidth] = useState(window.innerWidth)

    window.addEventListener("resize", function () {
        setscreenWidth(window.innerWidth)
    });

    const [sendType, setSendType] = useState("")

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <Container
                maxWidth={"md"}
                sx={{
                    marginTop: "1.5rem",
                    minHeight: screenWidth < 1367 ? "16rem" : screenWidth < 1518 && screenWidth > 1367 ? "24rem" : screenWidth < 1708 && screenWidth > 1518 ? "29rem" : "31rem",
                }}
            >
                <Box>
                    <Typography textAlign={"center"} fontWeight={600} fontSize={"1.2rem"} mb={1.5}>
                        {formatMessage({ id: "sms.notification.title" })}
                    </Typography>
                    <Typography textAlign={"center"} variant="body2">
                        {formatMessage({ id: "sms.notification.note" })}
                    </Typography>

                    <Grid container spacing={2} mt={2}>
                        <Grid item xs={1} />
                        <Grid item xs={12} md={5}>
                            <Box
                                onClick={() => { setSendType("sms") }}
                                sx={{
                                    backgroundImage: `url(${sendType === "sms" ? smsselected : smsunselected})`,
                                    backgroundSize: "contain",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    width: "100%",
                                    height: "12rem",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    userSelect: "none"
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "100%",
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant={"h5"}
                                            textAlign={"center"}
                                            fontWeight={"600"}
                                            color={sendType === "sms" ? "#fff" : "var(--color-dark-blue)"}
                                        >
                                            SMS
                                        </Typography>
                                        <Typography
                                            variant={"body2"}
                                            color={sendType === "sms" ? "#fff" : "var(--color-dark-blue)"}
                                            textAlign={"center"}
                                        >
                                            {formatMessage({ id: "sms.notification.tosend" })}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Box
                                onClick={() => setSendType("push")}
                                sx={{
                                    backgroundImage: `url(${sendType === "push" ? notificationselected : notificationunselected})`,
                                    backgroundSize: "contain",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    width: "100%",
                                    height: "12rem",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    userSelect: "none"
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "100%",
                                        textAlign: "center"
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant={"h5"}
                                            textAlign={"center"}
                                            fontWeight={"600"}
                                            color={sendType === "push" ? "#fff" : "var(--color-dark-blue)"}
                                        >
                                            Notification
                                        </Typography>
                                        <Typography
                                            variant={"body2"}
                                            color={sendType === "push" ? "#fff" : "var(--color-dark-blue)"}
                                            textAlign={"center"}
                                        >
                                            {formatMessage({ id: "sms.notification.topush" })}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={1} />
                    </Grid>

                    <Container maxWidth={"sm"} sx={{ marginTop: "3rem", marginBottom: "1.5rem" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Button
                                    id="cancelbtn"
                                    onClick={() => navigate(-1)}
                                    variant="outlined"
                                    fullWidth
                                    sx={{
                                        color: "var(--color-dark-blue) ",
                                        backgroundColor: "var(--color-cyan) !important",
                                        borderRadius: "20px",
                                        textTransform: "capitalize",
                                        fontWeight: "600",
                                        borderColor: "var(--color-cyan) !important",
                                    }}
                                >
                                    {formatMessage({ id: "evoucher.cancel" })}
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Button
                                    onClick={() => navigate(sendType === "sms" ? '/gwala-sms' : '/push-notification')}
                                    variant="outlined"
                                    fullWidth
                                    sx={{
                                        color: "#fff !important",
                                        backgroundColor: "var(--color-dark-blue) !important",
                                        borderRadius: "20px",
                                        textTransform: "capitalize",
                                        fontWeight: "600",
                                        borderColor: "var(--color-dark-blue) !important",
                                        opacity: sendType === "" && 0.5,
                                    }}
                                >
                                    {formatMessage({ id: "sms.notification.next" })}
                                </Button>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Container>
        </Box>
    )
}

export default GwalaSends