import React from 'react'
import { CircularProgress } from '@mui/material'

function PageSpinner() {
    return (
        <CircularProgress
            size={40}
            sx={{
                color: "#002b69 !important",
                margin: "auto"
            }}
        />
    )
}

export default PageSpinner