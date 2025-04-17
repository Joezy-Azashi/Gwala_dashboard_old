import React from 'react'
import { Box, Grid, Typography, Button, CircularProgress, DialogContent } from '@mui/material'
import warning2 from "../../assets/warning 2.png"
import trash from "../../assets/trash.png"
import { useLocale } from '../../locales';

function DeleteCategory({ setOpenDelete, selectedCat, onDeleteCategory, deleteLoading, isDeleted, setSelectedCat, setIsDeleted }) {
    const { formatMessage } = useLocale();

    return (
        <DialogContent>
            {!isDeleted ?
                <>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <img src={warning2} alt="warning" />
                    </Box>
                    <Typography variant='h6' textAlign={"center"} color={"#FA3E3E"} fontWeight={600} mb={2}>{formatMessage({ id: "edoc.warning" })}</Typography>
                    <Typography variant='body2' textAlign={"center"} color={"#FA3E3E"}>{formatMessage({ id: "merchants.category.ifyou" }) + "'"+ selectedCat?.name +"'" + formatMessage({ id: "merchants.category.deletewarningnote" })}</Typography>

                    <Box sx={{ marginTop: '1.5rem' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Button
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: "var(--color-blue)",
                                        color: "var(--color-dark-blue)",
                                        padding: ".4rem 1rem",
                                        borderRadius: "40px",
                                        fontWeight: "600",
                                        textTransform: "capitalize"
                                    }}
                                    onClick={() => setOpenDelete(false)}
                                    fullWidth
                                >
                                    {formatMessage({ id: "edoc.cancel" })}
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: "#FA3E3E",
                                        color: "#fff",
                                        padding: ".4rem 1rem",
                                        borderRadius: "40px",
                                        cursor: "pointer !important",
                                        fontWeight: "600",
                                        textTransform: "capitalize",
                                        whiteSpace: "nowrap"
                                    }}
                                    onClick={() => onDeleteCategory()}
                                    fullWidth
                                >
                                    {deleteLoading ?
                                        <CircularProgress
                                            size={20}
                                            sx={{
                                                color: "#fff !important",
                                            }}
                                        />
                                        : formatMessage({ id: "edoc.deleteanyway" })}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </> :
                <>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <img src={trash} alt="warning" />
                    </Box>
                    <Typography variant='h6' textAlign={"center"} color={"var(--color-dark-blue)"} fontWeight={600} mb={2}>{"'"+ selectedCat?.name +"'" + formatMessage({ id: "merchants.category.deletesuccess" })}</Typography>
                    <Typography variant='body2' textAlign={"center"} color={"var(--color-dark-blue)"}>{formatMessage({ id: "merchants.category.deletenote" })}</Typography>

                    <Box sx={{ marginTop: '1.5rem' }}>
                        <Grid container spacing={2} justifyContent={"center"}>
                            <Grid item xs={9}>
                                <Button
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: "var(--color-blue)",
                                        color: "var(--color-dark-blue)",
                                        padding: ".4rem 1rem",
                                        borderRadius: "40px",
                                        fontWeight: "600",
                                        textTransform: "capitalize"
                                    }}
                                    onClick={() => {setOpenDelete(false); setSelectedCat(""); setIsDeleted(false)}}
                                    fullWidth
                                >
                                    {formatMessage({ id: "company.close" })}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </>
            }
        </DialogContent>
    )
}

export default DeleteCategory