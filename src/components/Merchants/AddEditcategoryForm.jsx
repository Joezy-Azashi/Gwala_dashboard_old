import React from 'react'
import { Box, Button, CircularProgress, Grid, IconButton, Typography } from '@mui/material'
import TextInput from "../../components/UI/TextField";
import { useLocale } from '../../locales';
import { EditOutlined } from '@mui/icons-material';
import cover from '../../assets/cover.png'

const AddEditcategoryForm = ({ newCatName, setNewCatName, coverImage, setOpenPicUpload, isAdd, AddNewCat, addLoading }) => {
    const { formatMessage } = useLocale();

    return (
        <Grid container spacing={10}>
            <Grid item xs={0} sm={1} lg={3} />
            <Grid item xs={12} sm={10} lg={6} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <TextInput
                    label={formatMessage({ id: "merchants.category.catname" })}
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    inputlabelprops={{ shrink: true }}
                    fullWidth
                    margin="dense"
                    inputProps={{ maxLength: 200 }}
                />

                {isAdd && <Typography mt={2} marginRight={"auto"}>{formatMessage({ id: "merchants.category.uploadcover" })}</Typography>}

                <Box sx={{
                    backgroundImage: `url(${coverImage?.length < 1 ? cover : coverImage})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    width: {xs: '100%', md: '80%'},
                    height: { xs: '10rem' },
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "end",
                    borderRadius: "20px"
                }}
                    my={2}
                >
                    <IconButton
                        onClick={() => setOpenPicUpload({ type: "coverImage", state: true })}
                        sx={{
                            width: "2rem",
                            height: "2rem",
                            bgcolor: '#fff',
                            marginRight: "15px",
                            marginBottom: "15px",
                            ':hover': { bgcolor: 'var(--color-cyan)' }
                        }}><EditOutlined sx={{ fontSize: '1.5rem', color: '#000' }} />
                    </IconButton>
                </Box>

                {isAdd &&
                    <Button
                        onClick={() => AddNewCat()}
                        id="request-voucher"
                        variant="outlined"
                        size="large"
                        fullWidth
                        sx={{
                            color: "#fff !important",
                            backgroundColor: "var(--color-dark-blue) !important",
                            borderRadius: "20px",
                            textTransform: "capitalize",
                            fontWeight: "600",
                            borderColor: "var(--color-dark-blue) !important",
                            width: '70%',
                            opacity: newCatName === "" && 0.5
                        }}
                        disabled={newCatName === ""}
                    >
                        {addLoading ? <CircularProgress
                            size={25}
                            sx={{
                                color: "#fff !important",
                            }}
                        /> : formatMessage({ id: "merchants.category.add" })}
                    </Button>}
            </Grid>
            <Grid item xs={0} sm={1} lg={3} />
        </Grid>
    )
}

export default AddEditcategoryForm