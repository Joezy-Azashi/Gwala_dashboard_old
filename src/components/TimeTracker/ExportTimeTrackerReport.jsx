import React, { useState } from 'react'
import { Box, Typography, Grid } from '@mui/material'
import download from "../../assets/download1.svg"
import { useLocale } from '../../locales';
import { toast } from "react-toastify";
import axios from '../../api/request';
import ButtonSpinner from '../buttonspinner/ButtonSpinner';

function ExportTimeTrackerReport({ id, startDate, endDate }) {
    const { formatMessage } = useLocale();
    const [loading, setLoading] = useState(false);

    const genReport = async () => {
        setLoading(true)
        axios.get(`/v2/time-tracking/report?startDate=${startDate}&endDate=${endDate}&userId=${id}`)
            .then((res) => {
                setLoading(false)
                toast(res?.data, {
                    position: "top-right",
                    type: "success",
                    theme: "colored",
                });
            })
            .catch((error) => { setLoading(false) })
    }

    return (
        <Grid container spacing={1}>
            <Grid item sm={3} />
            <Grid item sm={6}>
                <Box onClick={() => genReport()} sx={{padding: ".5rem 2rem", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#79D9FF", cursor: "pointer", height: "2.7rem"}} mt={5}>
                    {loading ?
                        <ButtonSpinner /> :
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                            <Typography fontWeight={600}>{formatMessage({ id: "timetracker.export" })}</Typography>
                            <img src={download} width={30} alt="icon" />
                        </Box>
                    }
                </Box>
            </Grid>
            <Grid item sm={3} />
        </Grid>
    )
}

export default ExportTimeTrackerReport