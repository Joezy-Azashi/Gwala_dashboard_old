import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Hidden } from "@mui/material";
import { WhatsApp, EmailOutlined } from '@mui/icons-material'
import call from "../../assets/call.svg"
import { useLocale } from "../../locales";

const Support = () => {
  const { formatMessage } = useLocale();

  return (
    <Box sx={{ padding: "2rem 35px" }}>
      <Box>
        <Typography variant="h4" color={"var(--color-dark-blue)"} textAlign={'center'} fontWeight={600} padding={'0 0 2rem 0'}>{formatMessage({ id: "support.title" })}</Typography>

        <Grid container spacing={5}>
          <Hidden lgDown>
            <Grid item lg={1.5} />
          </Hidden>
          <Grid item xs={12} md={4} lg={3}>
            <Box sx={{ backgroundColor: "var(--color-dark-blue)", textAlign: "center", padding: ".7rem 1.5rem" }}>
              <WhatsApp sx={{ color: 'white', fontSize: "7rem" }} />
              <Typography variant="h5" color={"#fff"} my={1.5} textAlign={'center'} fontWeight={600}>{formatMessage({ id: "support.via" })} {formatMessage({ id: "support.whatsapp" })}</Typography>
              <Typography variant="h6" color={"#fff"} mb={2.3} textAlign={'center'} height={"5rem"}>{formatMessage({ id: "support.contact" })} {formatMessage({ id: "support.whatsapp" })}</Typography>
              <a href="https://wa.me/212773273474" target="_blank" rel="noreferrer">
                <Typography variant="h6" color={"#fff"} textAlign={'center'} fontWeight={600} sx={{ textDecoration: "underline", cursor: "pointer" }}>{formatMessage({ id: "support.textus" })}</Typography>
              </a>
            </Box>
          </Grid>

          <Grid item xs={12} md={4} lg={3}>
            <Box sx={{ backgroundColor: "var(--color-dark-blue)", textAlign: "center", padding: ".7rem 1.5rem" }}>
              <EmailOutlined sx={{ color: 'white', fontSize: "7rem" }} />
              <Typography variant="h5" color={"#fff"} my={1.5} textAlign={'center'} fontWeight={600}>{formatMessage({ id: "support.via" })} {formatMessage({ id: "support.email" })}</Typography>
              <Typography variant="h6" color={"#fff"} mb={2.3} textAlign={'center'} height={"5rem"}>{formatMessage({ id: "support.contact" })} {formatMessage({ id: "support.email" })}</Typography>
              <a href={'mailto:support@gwala.co'} target="_blank" rel="noreferrer" style={{ color: "blue" }}>
                <Typography variant="h6" color={"#fff"} textAlign={'center'} fontWeight={600} sx={{ textDecoration: "underline", cursor: "pointer" }}>{formatMessage({ id: "support.emailus" })}</Typography>
              </a>
            </Box>
          </Grid>

          <Grid item xs={12} md={4} lg={3}>
            <Box sx={{ backgroundColor: "var(--color-dark-blue)", textAlign: "center", padding: ".7rem 1.5rem" }}>
              <img src={call} width={116} alt="icon" />
              <Typography variant="h5" color={"#fff"} mb={1.5} mt={1} textAlign={'center'} fontWeight={600}>{formatMessage({ id: "support.via" })} {formatMessage({ id: "support.live" })}</Typography>
              <Typography variant="h6" color={"#fff"} mb={2.3} textAlign={'center'} height={"5rem"}>{formatMessage({ id: "support.contact" })} {formatMessage({ id: "support.live" })}</Typography>
              <Typography id="custom_link" variant="h6" color={"#fff"} textAlign={'center'} fontWeight={600} sx={{ textDecoration: "underline", cursor: "pointer" }}>{formatMessage({ id: "support.chatwithus" })}</Typography>
            </Box>
          </Grid>
          <Hidden lgDown>
            <Grid item lg={1.5} />
          </Hidden>
        </Grid>
      </Box>
    </Box>
  );
};

export default Support;
