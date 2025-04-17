import React, { useEffect, useState } from 'react'
import { Box, Button, Container, Dialog, Grid, Typography } from '@mui/material'
import carrefourLogo from "../../assets/carrefour.png"
import yassirLogo from "../../assets/yassirlogo.png"
import yassirLogoy from "../../assets/yassirlogoy.png"
import carrefourLogowithoutlabel from "../../assets/carrefourlogowithoutlabel.png"
import carrefourbackground from "../../assets/carrefourcardbackground.png"
import carrefourbackgroundlogo from "../../assets/carrefourbackgroundlogo.png"
import { useLocale } from '../../locales'
import TrackerExcelUpload from '../../components/Tracker/TrackerExcelUpload'
import axios from '../../api/request'
import PageSpinner from '../../components/pagespinner/PageSpinner'
import HorizontalScroll from '../../components/GwalaSend/gwalaSMS/HorizontalScroll'

const GiftCardTracker = () => {
    const { formatMessage } = useLocale();
    const [loading, setLoading] = useState(true)
    const [openUpload, setOpenUpload] = useState(false)
    const [selectBrand, setSelectBrand] = useState("carrefour")
    const [allowedAmount, seAllowedAmount] = useState([])

    const [vouchers, setVouchers] = useState([])

    const getGiftCards = () => {
        setLoading(true)
        axios.get(`/v2/giftCards/stock?type=${selectBrand.toUpperCase()}`)
            .then((res) => {
                setLoading(false)
                setVouchers(res?.giftCards)
            })
            .catch((error) => {
                setLoading(false)
            })

        // get allowed values
        axios.get(`/v2/injected/giftcards`)
            .then((result) => {
                seAllowedAmount(result?.giftcards)
            })
            .catch((err) => {

            })
    }

    useEffect(() => {
        getGiftCards()
    }, [selectBrand])

    return (
        <Box sx={{ padding: "0 35px 1rem 35px" }}>
            <Container maxWidth={"xl"}>
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={0} sm={1} lg={3} />
                    <Grid item xs={12} sm={10} lg={6}>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, }}>
                            <img
                                src={carrefourLogowithoutlabel}
                                style={{
                                    WebkitFilter: selectBrand !== "carrefour" && "grayscale(100%)",
                                    filter: selectBrand !== "carrefour" && "grayscale(100%)",
                                    cursor: "pointer",
                                    borderBottom: selectBrand === "carrefour" && "2px solid var(--color-dark-blue)",
                                    paddingBottom: "10px",
                                    ':hover': { opacity: 0.5 }
                                }}
                                alt="logo"
                                onClick={() => setSelectBrand("carrefour")}
                            />
                            <img
                                src={yassirLogo}
                                width={80}
                                height={36}
                                style={{
                                    WebkitFilter: selectBrand !== "yassir" && "grayscale(100%)",
                                    filter: selectBrand !== "yassir" && "grayscale(100%)",
                                    cursor: "pointer",
                                    borderBottom: selectBrand === "yassir" && "2px solid var(--color-dark-blue)",
                                    paddingBottom: "10px"
                                }}
                                alt="logo"
                                onClick={() => setSelectBrand("yassir")}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={0} sm={1} lg={3} />
                </Grid>

                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                    <img width={selectBrand === "yassir" ? 43 : ""} src={selectBrand === "carrefour" ? carrefourLogo : yassirLogoy} alt="logo" />
                    <hr style={{ height: "2.2rem", width: ".18rem", backgroundColor: "#000" }} />
                    <Typography
                        color={"var(--color-dark-blue)"}
                        fontWeight={600}
                        variant='h5'
                    >
                        {formatMessage({ id: selectBrand === "carrefour" ? "tracker.titlecarrefour" : "tracker.titleyassir" })}
                    </Typography>
                </Box>

                <Grid container spacing={2} mt={2} sx={{ justifyContent: "center" }}>
                    {loading ?
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "50vh",
                                width: "100%"
                            }}
                        >
                            <PageSpinner />
                        </Box> :
                        vouchers?.length < 1 ?
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "30vh",
                                    fontSize: "1.2rem",
                                }}
                            >
                                {formatMessage({ id: "employee.norecords" })}
                            </div> :
                            vouchers?.filter(ft => allowedAmount?.find(fd => fd?.name === selectBrand.toUpperCase())?.values?.includes(Number(ft?._id)))?.sort((a, b) => a?._id - b?._id)?.map((el, index) => {
                                return (
                                    <Grid key={index} item xs={12} sm={6} md={3}>
                                        <Box
                                            sx={{
                                                backgroundImage: `url(${carrefourbackground})`,
                                                backgroundSize: "cover",
                                                backgroundRepeat: "no-repeat",
                                                backgroundPosition: "center",
                                                overflow: "hidden",
                                                width: "100%",
                                                height: "10.2rem",
                                                boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
                                                opacity: el.count === 0 && 0.7
                                            }}
                                        >
                                            <img
                                                src={selectBrand.toUpperCase() === "CARREFOUR" ? carrefourbackgroundlogo : yassirLogo}
                                                width={selectBrand.toUpperCase() === "CARREFOUR" ? 100 : 60}
                                                style={{ position: "absolute", margin: "9px 0 0 9px" }}
                                                alt=""
                                            />
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    height: "100%",
                                                }}
                                                mt={1.6}
                                            >
                                                <Box>
                                                    <Typography
                                                        fontSize={"1.9rem"}
                                                        textAlign={"center"}
                                                        fontWeight={"600"}
                                                        color={"var(--color-dark-blue)"}
                                                    >
                                                        {el?._id} MAD
                                                    </Typography>
                                                    <Typography
                                                        fontSize={"1.2rem"}
                                                        color={el?.quantity < 51 && el?.quantity > 20 ? "#E8A700" : el?.quantity < 21 || !el?.quantity ? "#FA3E3E" : "var(--color-dark-blue)"}
                                                        textAlign={"center"}
                                                        fontWeight={600}
                                                    >
                                                        {`(${el.count || 0})`}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>
                                );
                            })}
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={2} lg={3.75} />
                    <Grid item xs={12} sm={8} lg={4.5}>
                        {!loading &&
                            <Button
                                onClick={() => setOpenUpload(true)}
                                id="request-voucher"
                                variant="outlined"
                                size="large"
                                fullWidth
                                sx={{
                                    color: "#fff",
                                    backgroundColor: "var(--color-dark-blue) !important",
                                    borderRadius: "20px",
                                    textTransform: "capitalize",
                                    fontWeight: "600",
                                    borderColor: "var(--color-dark-blue) !important",
                                    marginTop: "2rem"
                                }}
                            >
                                {formatMessage({ id: selectBrand === "carrefour" ? "tracker.uploadcarrefour" : "tracker.uploadyassir" })}
                            </Button>
                        }
                    </Grid>
                    <Grid item xs={12} sm={2} lg={3.75} />
                </Grid>
            </Container>

            <Dialog
                open={openUpload}
                onClose={() => setOpenUpload(false)}
                fullWidth
                maxWidth="sm"
                sx={{ '& .MuiPaper-root': { borderRadius: "20px" } }}
            >
                <TrackerExcelUpload
                    setOpenUpload={setOpenUpload}
                    getGiftCards={getGiftCards}
                    selectBrand={selectBrand.toUpperCase()}
                />
            </Dialog>
        </Box>
    )
}

export default GiftCardTracker