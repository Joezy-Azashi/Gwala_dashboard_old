import React from 'react'
import { Box, Container, Grid, TextField, Typography } from '@mui/material'
import gift from "../../assets/gifticon.png";
import meth from '../../assets/methodicon.png'
import PhysicalChequesComponent from '../Evoucher/PhysicalChequesComponent';
import AssignVoucherUserDetails from '../Evoucher/AssignVoucherUserDetails';
import { useLocale } from '../../locales';

const ConfirmAssignment = ({ num, setNum, method, injection, selectedAmount, setSelectedAmount, selectedBranch, phoneNumbers, selectedUserState, type, employees, setOpenMore }) => {
  const { formatMessage } = useLocale();

  return (
    <Box>
      <Container maxWidth={selectedUserState?.manages?.length > 0 ? "md" : "sm"}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" fontWeight={600} mb={1.5}>
              {formatMessage({ id: "evoucher.vouchertype" })}
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
              <Box
                sx={{
                  backgroundColor: "#DFEAFC",
                  textAlign: "center",
                  padding: ".2rem .5rem",
                  borderRadius: "8px",
                }}
              >
                <img src={gift} alt="" />
              </Box>
              <Typography
                fontWeight={"600"}
                textTransform={"capitalize"}
              >
                {type} {formatMessage({ id: "evoucher.voucher" })}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" fontWeight={600} mb={1.5}>
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
              <Box
                sx={{
                  backgroundColor: "#DFEAFC",
                  textAlign: "center",
                  padding: ".2rem .5rem",
                  borderRadius: "8px",
                }}
              >
                <Typography
                  fontSize={"15px"}
                  fontWeight={"600"}
                  marginBottom={"-4px"}
                >
                  {selectedAmount.amount}
                </Typography>
                <Typography fontSize={"11px"}>MAD</Typography>
              </Box>
              <Typography
                fontWeight={"600"}
                textTransform={"capitalize"}
              >
                {method === "digital" ? employees
                  .filter((el) => el.selected)
                  .reduce((count, el) => count + el.quantity, 0) :
                  method === "sms" ?
                    phoneNumbers?.reduce((acc, el) => acc + el.quantity, 0) :
                    num}{" "}
                {formatMessage({ id: "evoucher.vouchersof" })} {selectedAmount.amount} MAD
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" fontWeight={600} mb={1.5}>
              {formatMessage({ id: "evoucher.assignmentmethod" })}
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
              <Box
                sx={{
                  backgroundColor: "#DFEAFC",
                  textAlign: "center",
                  padding: ".2rem .5rem",
                  borderRadius: "8px",
                }}
              >
                <img src={meth} alt="" />
              </Box>
              <Typography
                fontWeight={"600"}
                textTransform={"capitalize"}
              >
                {method === "digital" ? formatMessage({ id: "evoucher.digital" }) :
                  method === "sms" ? formatMessage({ id: "evoucher.sms" }) :
                    formatMessage({ id: "evoucher.physical" })} {" "}
                {formatMessage({ id: "evoucher.method" })}
              </Typography>
            </Box>
          </Grid>

          {selectedUserState?.manages?.length > 0 &&
            <Grid item xs={12} sm={4}>
              <Typography variant='body2' fontWeight={600}>
                {formatMessage({ id: "advance.branch" })}
              </Typography>
              <TextField
                id="branchname"
                fullWidth
                value={selectedBranch?.name}
                size="small"
                margin="dense"
                inputProps={{ readOnly: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#F7F0F0"
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "0",
                    margin: "0",
                  },
                }}
              />
            </Grid>
          }

          <Grid item xs={12} mt={2}>
            <Typography variant="body2" fontWeight={600} mb={2.5}>
              {formatMessage({ id: "evoucher.assignedto" })}
            </Typography>

            {method === "digital" || method === "sms" || injection === "mass" ?
              <>
                <AssignVoucherUserDetails
                  employees={employees}
                  phoneNumbers={phoneNumbers}
                  method={method}
                  selectedAmount={selectedAmount}
                  sliceItem={true}
                />
                {phoneNumbers?.length > 10 || employees?.length > 10 ?
                  <Box sx={{ display: "flex", justifyContent: "end" }}>
                    <span style={{ fontStyle: "italic", margin: "10px 10px 0 0", cursor: "pointer" }} onClick={() => setOpenMore(true)}>
                      {formatMessage({ id: "evoucher.seemore" })}
                    </span>
                  </Box> : ""}
              </>
              :
              <Box sx={{ backgroundColor: "#DFEAFC", height: "9rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <PhysicalChequesComponent
                  selectedBranch={selectedBranch}
                  selectedAmount={selectedAmount}
                  setSelectedAmount={setSelectedAmount}
                  num={num}
                  setNum={setNum}
                  dontShowControls={true}
                />
              </Box>
            }
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default ConfirmAssignment