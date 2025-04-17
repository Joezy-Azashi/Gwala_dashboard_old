import React from 'react'
import { useLocale } from '../../locales';
import { Box, Grid, Typography } from '@mui/material';
import massunselected from "../../assets/massunselected.png";
import individualselected from "../../assets/individualselected.png";
import individualunselected from "../../assets/individualunselected.png";
import massselected from "../../assets/massselected.png";

const InjectionMethod = ({ injection, setInjection }) => {
  const { formatMessage } = useLocale();

  return (
    <Box>
      <Typography textAlign={"center"} fontWeight={600} fontSize={"1rem"}>
        {formatMessage({ id: "evoucher.injectionmethod" })}
      </Typography>
      <Typography textAlign={"center"} variant="body2">
        {formatMessage({ id: "evoucher.injectionnote" })}
      </Typography>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={1} />
        <Grid item xs={12} md={5}>
          <Box
            onClick={() => { setInjection("mass") }}
            sx={{
              backgroundImage: `url(${injection === "mass" ? massselected : massunselected})`,
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
                  color={injection === "mass" ? "#fff" : "var(--color-dark-blue)"}
                >
                  {formatMessage({ id: "evoucher.massexcel" })}
                </Typography>
                <Typography
                  variant={"body2"}
                  color={injection === "mass" ? "#fff" : "var(--color-dark-blue)"}
                  textAlign={"center"}
                >
                  {formatMessage({ id: "evoucher.method" })}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box
            onClick={() => setInjection("individual")}
            sx={{
              backgroundImage: `url(${injection === "individual" ? individualselected : individualunselected})`,
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
                  color={injection === "individual" ? "#fff" : "var(--color-dark-blue)"}
                >
                  {formatMessage({ id: "evoucher.individualinjection" })}
                </Typography>
                <Typography
                  variant={"body2"}
                  color={injection === "individual" ? "#fff" : "var(--color-dark-blue)"}
                  textAlign={"center"}
                >
                  {formatMessage({ id: "evoucher.method" })}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={1} />
      </Grid>
    </Box>
  )
}

export default InjectionMethod