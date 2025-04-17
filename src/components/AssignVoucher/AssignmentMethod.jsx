import React from 'react'
import { Box, Grid, Typography } from '@mui/material';
import { useLocale } from '../../locales';
import digunselected from "../../assets/digunselected.png";
import digselected from "../../assets/digselected.png";
import smsunselected from "../../assets/smsunselected.png";
import smsselected from "../../assets/smsselected.png";
import physicalunselected from "../../assets/physicalunselected.png";
import physicalselected from "../../assets/physicalselected.png";

const AssignmentMethod = ({ selectedAmount, num, setNum, setFile, method, setMethod, total, setEmployees }) => {
  const { formatMessage } = useLocale();

  return (
    <Box>
      <Typography textAlign={"center"} fontWeight={600} fontSize={"1rem"}>
        {formatMessage({ id: "evoucher.assignmentmethod" })}
      </Typography>
      <Typography textAlign={"center"} variant="body2">
        {formatMessage({ id: "evoucher.assignmentmethodnote" })}
      </Typography>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} md={4}>
          <Box
            onClick={() => { setMethod("digital"); selectedAmount.quantity += num; setNum(0); setFile([]) }}
            sx={{
              backgroundImage: `url(${method === "digital" ? digselected : digunselected})`,
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
                  variant="h5"
                  textAlign={"center"}
                  fontWeight={"600"}
                  color={method === "digital" ? "#fff" : "var(--color-dark-blue)"}
                >
                  {formatMessage({ id: "evoucher.digital" })}
                </Typography>
                <Typography
                  variant={"body2"}
                  color={method === "digital" ? "#fff" : "var(--color-dark-blue)"}
                  textAlign={"center"}
                >
                  {formatMessage({ id: "evoucher.method" })}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            onClick={() => { setMethod("sms"); setEmployees([]); if (num > 0) { selectedAmount.quantity += num } else { selectedAmount.quantity += total }; setNum(0), total = 0 }}
            sx={{
              backgroundImage: `url(${method === "sms" ? smsselected : smsunselected})`,
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
                  variant="h5"
                  textAlign={"center"}
                  fontWeight={"600"}
                  color={method === "sms" ? "#fff" : "var(--color-dark-blue)"}
                >
                  {formatMessage({ id: "evoucher.sms" })}
                </Typography>
                <Typography
                  variant={"body2"}
                  color={method === "sms" ? "#fff" : "var(--color-dark-blue)"}
                  textAlign={"center"}
                >
                  {formatMessage({ id: "evoucher.method" })}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            onClick={() => { setMethod("physical"); selectedAmount.quantity += total; setEmployees([]); setFile([]) }}
            sx={{
              backgroundImage: `url(${method === "physical" ? physicalselected : physicalunselected})`,
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
                  variant="h5"
                  textAlign={"center"}
                  fontWeight={"600"}
                  color={method === "physical" ? "#fff" : "var(--color-dark-blue)"}
                >
                  {formatMessage({ id: "evoucher.physical" })}
                </Typography>
                <Typography
                  variant={"body2"}
                  color={method === "physical" ? "#fff" : "var(--color-dark-blue)"}
                  textAlign={"center"}
                >
                  {formatMessage({ id: "evoucher.method" })}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AssignmentMethod