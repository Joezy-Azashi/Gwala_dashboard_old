import React, { useState } from 'react'
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material'
import alarm from '../../assets/alarm.svg'
import { useNavigate } from 'react-router'
import RequestVouchers from './RequestVouchers'
import { useLocale } from '../../locales'

const MassExcelResponseDialog = ({ type, selectedAmount, gVouchers, rVouchers, setMassExcelDialog }) => {
  const navigate = useNavigate()
  const { formatMessage } = useLocale();

  const [general, setGeneral] = useState(gVouchers?.filter((ft) => ft?.amount === 5)[0])
  const [restaurant, setRestaurant] = useState(rVouchers?.filter((ft) => ft?.amount === 5)[0])
  const [openRequestVouchers, setOpenRequestVouchers] = useState(false)

  const handleCloseRequest = (event, reason) => {
    if (reason && reason == "backdropClick") {
      return;
    } else {
      setOpenRequestVouchers(false)
    }
    setMassExcelDialog(false)
  }

  return (
    <DialogContent sx={{ padding: "1.7rem" }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <img src={alarm} width={65} alt="sent" />
      </Box>
      <Typography variant={"h6"} fontWeight={"600"} color={"#FA3E3E"} textAlign={"center"} my={1}>{formatMessage({ id: "evoucher.insufficientbal" })}</Typography>

      <Typography textAlign={"center"} color={"var(--color-dark-blue)"} my={1}>{formatMessage({ id: "evoucher.onlyhave" })} {type === "GENERAL" ? general?.quantity : restaurant?.quantity} {formatMessage({ id: "evoucher.vof" })}</Typography>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }} mt={2}>
        <Button
          onClick={() => navigate('/voucher-converter')}
          variant="outlined"
          fullWidth
          sx={{
            color: "var(--color-dark-blue) ",
            backgroundColor: "#fff !important",
            borderRadius: "20px",
            textTransform: "capitalize",
            fontWeight: "600",
            borderColor: "var(--color-dark-blue) !important",
            minWidth: "60%"
          }}
        >
          {formatMessage({ id: "evoucher.convertbtn" })}
        </Button>

        <Button
          onClick={() => { setOpenRequestVouchers(true) }}
          variant="outlined"
          fullWidth
          sx={{
            color: "var(--color-dark-blue)",
            backgroundColor: "var(--color-cyan) !important",
            borderRadius: "20px",
            textTransform: "capitalize",
            fontWeight: "600",
            borderColor: "var(--color-cyan) !important",
            minWidth: "60%"
          }}
        >
          {formatMessage({ id: "evoucher.requestvou" })}
        </Button>
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
    </DialogContent>
  )
}

export default MassExcelResponseDialog