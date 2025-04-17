import React from 'react'
import { CircularProgress } from '@mui/material'

function ButtonSpinner() {
    return (
        <CircularProgress
            size={20}
            sx={{
                color: "var(--color-dark-blue) !important",
            }}
        />
    )
}

export default ButtonSpinner