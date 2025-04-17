import React, { useState } from 'react'
import { Box, Grid, Typography, Button, Dialog, Autocomplete, TextField, Divider } from '@mui/material'
import SideContainer from '../../containers/SideContainer'
import general from '../../assets/general.png'
import restaurant from '../../assets/restaurant.png'
import coupon from '../../assets/coupon.png'
import { useLocale } from '../../locales'
import { useNavigate } from 'react-router'
import RequestVouchers from '../../components/Evoucher/RequestVouchers'
import axios from 'axios'
import { useEffect } from 'react'
import PageSpinner from '../../components/pagespinner/PageSpinner'
import { useSelector } from 'react-redux'
import { getNondigitalAssignedVouchers, getRequestedVouchers, getUsedVouchers } from '../../api'

const LeftSide = ({ companyId, setVoucherData }) => {
  const { formatMessage } = useLocale();
  const [data, setdata] = useState([])
  const [loading, setLoading] = useState(true)
  const [screenWidth, setscreenWidth] = useState(window.innerWidth)

  window.addEventListener("resize", function () {
    setscreenWidth(window.innerWidth)
  });

  const getVouchers = () => {
    setLoading(true)

    const url = `${import.meta.env.VITE_BASE_URL}/`
    const token = localStorage.getItem("token");
    axios.get(
      companyId ?
        `${url}v2/vouchers?companyId=${companyId}` :
        `${url}v2/vouchers`
      , {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then((res) => {
        setLoading(false)
        setdata(res?.data?.data)
        setVoucherData(res?.data?.data)
      })
      .catch((error) => {
        setLoading(false)
      })
  }

  const totalGeneral = data?.filter((ft) => ft?.type === "GENERAL")[0]?.data.reduce((index, el) => {
    return index + (el.amount * el.quantity);
  }, 0);

  const totalRestaurant = data?.filter((ft) => ft?.type === "RESTAURANT")[0]?.data.reduce((index, el) => {
    return index + (el.amount * el.quantity);
  }, 0);

  useEffect(() => {
    getVouchers()
  }, [companyId])

  return (
    <Box sx={{ padding: { md: "2rem 35px 2rem 0px", xs: "1rem 20px" }, height: "100%" }}>
      {loading ?
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <PageSpinner />
        </Box> :
        data?.length < 1 ||
          data?.filter((ft) => ft?.type === "GENERAL")[0]?.data?.filter((amt) => amt?.quantity > 0)?.length < 1 &&
          data?.filter((ft) => ft?.type === "RESTAURANT")[0]?.data?.filter((amt) => amt?.quantity > 0)?.length < 1 ?
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} mt={15}>
            <Box>
              <Typography variant='h6' color={"var(--color-dark-blue)"}>{formatMessage({ id: "evoucher.novoucher" })}</Typography>
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} mt={2}>
                <img src={coupon} alt="no vouchers" />
              </Box>
            </Box>
          </Box> :
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Box sx={{ width: "100%" }}>
              {data?.filter((ft) => ft?.type === "GENERAL").length > 0 && totalGeneral !== 0 ?
                <>
                  {/* General */}
                  < Grid container spacing={3} sx={{ display: "flex", alignItems: "center" }}>
                    <Grid item xs={12} sm={5} md={4}>
                      <Box sx={{ backgroundImage: `url(${general})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', width: '100%', height: { xs: '12rem', xl: '16rem' }, borderRadius: "12px" }}>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                          <Box>
                            <Typography variant='h5' textAlign={"center"} fontWeight={"600"} color={"#fff"}>{formatMessage({ id: "evoucher.general" })}</Typography>
                            <Typography variant={"body2"} color={"#fff"} textAlign={"center"}>{formatMessage({ id: "evoucher.voucher" })}</Typography>
                          </Box>
                        </Box>
                        <Typography sx={{ marginTop: "-1.8rem", marginRight: "1rem" }} fontSize={"12px"} color={"#fff"} textAlign={"right"}>{totalGeneral.toLocaleString()} MAD {formatMessage({ id: "evoucher.remaining" })}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Grid container spacing={3}>
                        {data?.filter((ft) => ft?.type === "GENERAL")[0]?.data?.sort((a, b) => a.amount - b.amount)?.filter((am) => am.quantity > 0)?.map((el, index) => {
                          return (
                            <Grid item xs={6} md={4} key={index}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box sx={{ backgroundColor: "#DFEAFC", textAlign: "center", padding: ".2rem .5rem", borderRadius: "8px" }}>
                                  <Typography fontSize={"15px"} fontWeight={"600"} marginBottom={"-4px"}>{el?.amount}</Typography>
                                  <Typography fontSize={"11px"}>MAD</Typography>
                                </Box>
                                <Typography noWrap>{el?.quantity.toString().length < 2 && "0"}{el?.quantity?.toLocaleString()} {formatMessage({ id: "evoucher.vouchers" })}</Typography>
                              </Box>
                            </Grid>
                          )
                        })}
                      </Grid>
                    </Grid>
                  </Grid>
                </> : ""
              }
              {data?.filter((ft) => ft?.type === "RESTAURANT").length < 1 ||
                data?.filter((ft) => ft?.type === "GENERAL").length < 1 ||
                totalGeneral === 0 ||
                totalRestaurant === 0 ? ""
                :
                <Divider sx={{ margin: screenWidth > 1710 ? "60px 0" : "16px 0" }} />
              }

              {data?.filter((ft) => ft?.type === "RESTAURANT").length > 0 && totalRestaurant !== 0 ?
                <>
                  {/* Restaurant */}
                  <Grid container spacing={3} sx={{ display: "flex", alignItems: "center" }}>
                    <Grid item xs={12} sm={5} md={4}>
                      <Box sx={{ backgroundImage: `url(${restaurant})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', width: '100%', height: { xs: '12rem', xl: '16rem' }, borderRadius: "12px" }}>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                          <Box>
                            <Typography variant='h5' textAlign={"center"} fontWeight={"600"} color={"#fff"}>{formatMessage({ id: "evoucher.restaurant" })}</Typography>
                            <Typography variant={"body2"} color={"#fff"} textAlign={"center"}>{formatMessage({ id: "evoucher.voucher" })}</Typography>
                          </Box>
                        </Box>
                        <Typography sx={{ marginTop: "-1.8rem", marginRight: "1rem" }} fontSize={"12px"} color={"#fff"} textAlign={"right"}>{totalRestaurant.toLocaleString()} MAD {formatMessage({ id: "evoucher.remaining" })}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Grid container spacing={3}>
                        {data?.filter((ft) => ft?.type === "RESTAURANT")[0]?.data?.sort((a, b) => a.amount - b.amount)?.filter((am) => am.quantity > 0)?.map((el, index) => {
                          return (
                            <Grid item xs={6} md={4} key={index}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box sx={{ backgroundColor: "#DFEAFC", textAlign: "center", padding: ".2rem .5rem", borderRadius: "8px" }}>
                                  <Typography fontSize={"15px"} fontWeight={"600"} marginBottom={"-4px"}>{el?.amount}</Typography>
                                  <Typography fontSize={"11px"}>MAD</Typography>
                                </Box>
                                <Typography noWrap>{el?.quantity.toString().length < 2 && "0"}{el?.quantity?.toLocaleString()} {formatMessage({ id: "evoucher.vouchers" })}</Typography>
                              </Box>
                            </Grid>
                          )
                        })}
                      </Grid>
                    </Grid>
                  </Grid>
                </> : ""
              }
            </Box>
          </Box>
      }
    </Box >
  )
}

const RightSide = ({ setCompanyId, voucherData }) => {
  const navigate = useNavigate()
  const { formatMessage } = useLocale();
  const selectedUserState = useSelector((state) => state?.userInfos)
  const [openRequestVouchers, setOpenRequestVouchers] = useState(false)
  const [companies, setCompanies] = useState([]);
  const [usedVouchersGeneral, setUsedVouchersGeneral] = useState([]);
  const [requestedVouchers, setRequestedVouchers] = useState([]);
  const [nondigitalVouchers, setNondigitalVouchers] = useState([]);

  const handleCloseRequest = (event, reason) => {
    if (reason && reason == "backdropClick") {
      return;
    } else {
      setOpenRequestVouchers(false)
    }
  }

  useEffect(() => {
    setCompanies(selectedUserState?.manages?.filter(ft => ft?.features?.includes("EVOUCHERS") || ft?.features?.includes("ALL")))
  }, [selectedUserState])

  const getHistoryData = async () => {
    if (selectedUserState?.isAllowedToSeeHistory) {
      const usedData = await getUsedVouchers(1, 1)
      setUsedVouchersGeneral(usedData)
    }

    const requestedData = await getRequestedVouchers(1, 1);
    setRequestedVouchers(requestedData)

    const nondigital = await getNondigitalAssignedVouchers(1, 1);
    setNondigitalVouchers(nondigital)
  }

  useEffect(() => {
    getHistoryData()
  }, [])

  return (
    <Box sx={{ display: "flex", alignItems: "center", height: "100%", padding: "2rem 0" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
        {selectedUserState?.manages?.length > 0 &&
          <Autocomplete
            id="search_branch"
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "#fff",
                borderRadius: "50px",
                backgroundColor: "var(--color-blue)",
              },
              "& fieldset": { border: "none" },
              "& .MuiFormLabel-root": {
                color: "var(--color-dark-blue) !important",
                fontWeight: "600",
                fontSize: "15px",
                textTransform: "capitalize",
              },
            }}
            size="small"
            InputLabelProps={{ shrink: false }}
            fullWidth
            options={companies}
            getOptionLabel={(option) => `${option?.name}`}
            renderInput={(params) => (
              <TextField
                {...params}
                label={formatMessage({ id: "advance.branch" })}
              />
            )}
            onChange={(_, value, reason) => {
              if (reason === "clear") {
                setCompanyId("")
                return;
              } else {
                setCompanyId(value?._id)
              }
            }}
          />}

        <Button
          id="request-voucher"
          onClick={() => setOpenRequestVouchers(true)}
          variant="outlined"
          size="large"
          fullWidth
          sx={{
            color: "#fff",
            backgroundColor: "var(--color-dark-blue) !important",
            borderRadius: "20px",
            textTransform: "capitalize",
            fontWeight: "600",
            borderColor: "var(--color-dark-blue) !important"
          }}
        >
          {formatMessage({ id: "evoucher.requestvoucher" })}
        </Button>

        {voucherData?.length > 0 &&
          <Button
            id="assign-voucher"
            onClick={() => navigate('/assign-voucher')}
            variant="outlined"
            fullWidth
            size="large"
            sx={{
              color: "var(--color-dark-blue)",
              borderRadius: "20px",
              textTransform: "capitalize",
              fontWeight: "600",
              borderColor: "var(--color-dark-blue) !important"
            }}
          >
            {formatMessage({ id: "evoucher.assignvoucher" })}
          </Button>
        }
        {usedVouchersGeneral?.docs?.length > 0 || selectedUserState?.isAllowedToSeeHistory ?
          <Typography
            onClick={() => navigate('/used-voucher-history')}
            variant='body2' color={"var(--color-dark-blue)"}
            textAlign={"center"}
            sx={{
              textDecoration: "underline",
              cursor: "pointer"
            }}
          >
            {formatMessage({ id: "evoucher.usedhistory" })}
          </Typography> : ""
        }

        {nondigitalVouchers?.docs?.length < 1 ? "" :
          <Typography onClick={() => navigate('/non-digital-voucher-history')} variant='body2' color={"var(--color-dark-blue)"} textAlign={"center"} sx={{ textDecoration: "underline", cursor: "pointer" }}>{formatMessage({ id: "evoucher.historynondigital" })}</Typography>
        }

        {requestedVouchers?.docs?.length < 1 ? "" :
          <Typography
            onClick={() => navigate('/requested-voucher-history')}
            variant='body2' color={"var(--color-dark-blue)"}
            textAlign={"center"}
            sx={{
              textDecoration: "underline",
              cursor: "pointer"
            }}
          >
            {formatMessage({ id: "evoucher.requestedhistory" })}
          </Typography>
        }

        <Box sx={{ position: { md: "absolute" }, bottom: "1rem", width: { xs: "100%", md: "92%" } }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              id="request-voucher"
              onClick={() => navigate('/voucher-converter')}
              variant="outlined"
              size="large"
              fullWidth
              sx={{
                color: "#fff",
                backgroundColor: "#347AF0 !important",
                borderRadius: "20px",
                textTransform: "capitalize",
                fontWeight: "600",
                borderColor: "none !important"
              }}
            >
              {formatMessage({ id: "evoucher.voucherconverter" })}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Request vouchers */}
      <Dialog
        open={openRequestVouchers}
        onClose={handleCloseRequest}
        fullWidth
        maxWidth="sm"
        sx={{ '& .MuiPaper-root': { borderRadius: "20px" } }}
      >
        <RequestVouchers handleCloseRequest={handleCloseRequest} />
      </Dialog>
    </Box>
  )
}

function Evouchers() {
  const [companyId, setCompanyId] = useState("");
  const [voucherData, setVoucherData] = useState("");

  return (
    <SideContainer
      LeftSideComponent={
        <LeftSide
          companyId={companyId}
          setVoucherData={setVoucherData}
        />
      }
      RightSideComponent={
        <RightSide
          setCompanyId={setCompanyId}
          voucherData={voucherData}
        />}
    />
  )
}

export default Evouchers