import React, { useState } from 'react'
import { Box, Grid, Typography, Button, CircularProgress, DialogContent } from '@mui/material'
import warning2 from "../../assets/warning 2.png"
import trash from "../../assets/trash.png"
import axios from 'axios';
import { useLocale } from '../../locales';
import { useSelector } from 'react-redux';

function DeleteTag({ setOpenDelete, renameTag, setRenameTag, setRenameTagValue, setExistingTags, getData, setGetData, companyIds }) {
    const { formatMessage } = useLocale();
    const selectedUserState = useSelector((state) => state.userInfos)
    const token = localStorage.getItem("token");
    const url = `${import.meta.env.VITE_BASE_URL}`;
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)

    const deleteTag = async () => {
        setDeleteLoading(true)
        try {
            const deleteResult = await axios.delete(
                `${url}/v2/edocuments/tags/${renameTag.id}/${companyIds || selectedUserState?.company?._id}`
                , {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (deleteResult?.data?.status === "success") {
                setDeleteLoading(false)
                setRenameTag({ name: "", id: '' })
                setRenameTagValue("")
                setExistingTags([])
                setGetData(getData + 1)
                setIsDeleted(true)
            }

        } catch (error) {
            setDeleteLoading(false)
        }
    }
    return (
        <DialogContent>
            {!isDeleted ?
                <>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <img src={warning2} alt="warning" />
                    </Box>
                    <Typography variant='h6' textAlign={"center"} color={"#FA3E3E"} fontWeight={600} mb={2}>{formatMessage({ id: "edoc.warning" })}</Typography>
                    <Typography variant='body2' textAlign={"center"} color={"#FA3E3E"}>{formatMessage({ id: "edoc.warningnote1" }) + "'"+ renameTag?.name +"'" + formatMessage({ id: "edoc.warningnote2" })}</Typography>

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
                                    onClick={() => deleteTag()}
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
                    <Typography variant='h6' textAlign={"center"} color={"var(--color-dark-blue)"} fontWeight={600} mb={2}>{formatMessage({ id: "edoc.deleted" })}</Typography>
                    <Typography variant='body2' textAlign={"center"} color={"var(--color-dark-blue)"}>{formatMessage({ id: "edoc.deletednote" })}</Typography>

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
                                    onClick={() => setOpenDelete(false)}
                                    fullWidth
                                >
                                    {formatMessage({ id: "edoc.back" })}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </>
            }
        </DialogContent>
    )
}

export default DeleteTag