import { Autocomplete, Box, Chip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import TextInput from "../../components/UI/TextField";
import { useLocale } from '../../locales';

const AssignVoucherUserDetails = ({ employees, phoneNumbers, method, selectedAmount, sliceItem }) => {
    const { formatMessage } = useLocale();

    const [employeeArray, setEmployeeArray] = useState([])
    const [phoneArray, setPhoneArray] = useState([])

    useEffect(() => {
        if (sliceItem) {
            setEmployeeArray(employees?.slice(0, 10))
            setPhoneArray(phoneNumbers?.slice(0, 10))
        } else {
            setEmployeeArray(employees)
            setPhoneArray(phoneNumbers)
        }
    }, [sliceItem])

    return (
        <Box>
            {method === "digital" ?
                <Autocomplete
                    multiple
                    open={false}
                    readOnly
                    disableClearable
                    includeInputInList
                    id="tags-filled"
                    filterSelectedOptions
                    options={employeeArray.filter((el) => el.selected)}
                    getOptionLabel={(option) => option?.fullName}
                    fullWidth
                    value={employeeArray.filter((el) => el.selected)}
                    sx={{
                        "& .MuiChip-root": {
                            backgroundColor: "var(--color-dark-blue)",
                            color: "#fff",
                            borderRadius: "8px",
                            marginRight: "0",
                            minWidth: "130px !important"
                        },
                        "& .MuiSvgIcon-root": {
                            display: "none",
                        },
                    }}
                    renderTags={(value, getTagProps) =>
                        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2.6 }}>
                            {
                                value
                                    .filter((ft) => ft.quantity > 0)
                                    .map((option, index) => (
                                        <Box
                                            key={option.user}
                                            sx={{ display: "flex", alignItems: "center" }}
                                            title={option?.fullName}
                                        >
                                            <Chip
                                                variant="outlined"
                                                label={option?.fullName}
                                                {...getTagProps({ index })}
                                            />
                                            {option?.quantity !== "" && option?.quantity !== 1 && (
                                                <Typography
                                                    fontSize={"13px"}
                                                    sx={{
                                                        backgroundColor: "#87CEFA",
                                                        padding: "5.6px 0",
                                                        textAlign: "center",
                                                        borderRadius: "0 8px 8px 0",
                                                        width: "2rem",
                                                        marginLeft: "-.3rem",
                                                        marginBottom: ".6px"
                                                    }}
                                                >
                                                    {option?.quantity}
                                                </Typography>
                                            )}
                                        </Box>
                                    ))
                            }</Box>
                    }
                    renderInput={(params) => (
                        <TextInput
                            InputLabelProps={{ shrink: true }}
                            {...params}
                            label={`${employees.filter((el) => el.selected).length
                                } employees`}
                        />
                    )}
                /> :
                <>
                    <Autocomplete
                        multiple
                        open={false}
                        readOnly
                        disableClearable
                        includeInputInList
                        id="tags-filled"
                        filterSelectedOptions
                        options={phoneArray}
                        getOptionLabel={(option) => option?.phone}
                        fullWidth
                        value={phoneArray}
                        sx={{
                            "& .MuiChip-root": {
                                backgroundColor: "var(--color-dark-blue)",
                                color: "#fff",
                                borderRadius: "8px",
                                marginRight: "0",
                                minWidth: "130px !important"
                            },
                            "& .MuiSvgIcon-root": {
                                display: "none",
                            },
                        }}
                        renderTags={(value, getTagProps) =>
                            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2.6 }}>
                                {
                                    value?.filter((ft)=> ft?.phone)?.map((option, index) => (
                                        <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                                            <Chip
                                                variant="outlined"
                                                label={option?.phone}
                                                {...getTagProps({ index })}
                                            />
                                            {option?.quantity !== "" && option?.quantity !== 1 && (
                                                <Typography
                                                    fontSize={"13px"}
                                                    sx={{
                                                        backgroundColor: "#87CEFA",
                                                        padding: "5.6px 0",
                                                        textAlign: "center",
                                                        borderRadius: "0 8px 8px 0",
                                                        width: "2rem",
                                                        marginLeft: "-.4rem",
                                                        marginBottom: ".6px"
                                                    }}
                                                >
                                                    {option?.quantity}
                                                </Typography>
                                            )}
                                        </Box>
                                    ))}</Box>
                        }
                        renderInput={(params) => (
                            <TextInput
                                InputLabelProps={{ shrink: true }}
                                {...params}
                                label={`Assign ${selectedAmount?.amount} MAD vouchers to`}
                            />
                        )}
                    />
                </>
            }
        </Box>
    )
}

export default AssignVoucherUserDetails