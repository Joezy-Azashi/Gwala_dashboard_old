import React, { useState } from "react";
import { DialogContent, DialogActions, Typography, IconButton, CircularProgress, Box, Grid, Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AvatarEditor from 'react-avatar-editor'
import FileUploadService from "../../config/FileUpload";
import { toast } from "react-toastify";
import { useLocale } from "../../locales";

function UploadProfileImage({ openPicUpload, setOpenPicUpload, setLogo, setCoverImage, setProfileImage, setLogoToSend, type }) {
    const { formatMessage } = useLocale();

    const [imagePreview, setFilePreview] = useState("");
    const [loading, setloading] = useState(false);

    var editor = "";
    const [scale, setScale] = useState()

    const getimage = (event) => {
        if (event?.target?.files?.length < 1) {
            return
        }

        setFilePreview(URL.createObjectURL(event?.target?.files[0]));
    };

    const setEditorRef = (ed) => {
        editor = ed;
    };

    const cancelImage = () => {
        setFilePreview(null);
        setOpenPicUpload({ type: "", state: false });
    };

    const closeImage = () => {
        setFilePreview(null);
    };

    function dataURLtoFile(dataurl) {

        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        const fileName = new Date().getTime() + '.jpeg';

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], fileName, { type: mime });
    }

    const uploadImage = () => {
        var img = dataURLtoFile(editor.getImageScaledToCanvas().toDataURL());

        let url = `${import.meta.env.VITE_MERCHANT_BASE_URL}/api/`;
        if (!img) {
            toast("Upload a valid image", {
                position: "top-right",
                theme: "colored",
                type: "error",
            });
            return;
        } else {
            setloading(true);
            FileUploadService.upload(img, url)
                .then((response) => {
                    setloading(false)
                    setOpenPicUpload({ state: false })
                    if (openPicUpload.type === "logo") {
                        setLogo(response.data.path)
                        setProfileImage(response.data.path)
                    } else {
                        setCoverImage(response.data.path)
                    }
                })
                .catch((error) => {
                    setloading(false)
                });
        }
    };

    const getImageFileCrop = () => {
        var img = dataURLtoFile(editor.getImageScaledToCanvas().toDataURL());
        setLogo(URL.createObjectURL(img))
        setLogoToSend(img)
        setOpenPicUpload({ state: false })
    };

    return (
        <>
            <DialogContent>
                <Typography variant='h6'>Upload {openPicUpload.type === "logo" ? "Profile" : "Cover"} Image</Typography>

                {imagePreview && (
                    <div className="d-flex justify-content-center mt-3 mb-4">
                        <IconButton onClick={closeImage} sx={{ position: "absolute", right: "1rem", top: "0.5rem" }}><CloseIcon /></IconButton>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <AvatarEditor
                                    ref={setEditorRef}
                                    image={imagePreview}
                                    width={openPicUpload.type === "logo" ? 250 : 750}
                                    height={250}
                                    border={50}
                                    color={[3, 37, 76, 0.7]} // RGBA
                                    scale={scale}
                                    backgroundColor={"#fff"}
                                    rotate={0}
                                    style={{ margin: "auto" }}
                                />

                                <Box sx={{ display: "flex", justifyContent: "space-between" }} my={2}>
                                    <Typography>Zoom: </Typography>
                                    <input
                                        style={{ width: "70%" }}
                                        name="scale"
                                        type="range"
                                        min={0.1}
                                        max={2}
                                        step="0.01"
                                        onChange={(e) => setScale(Number(e.target.value))}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </div>
                )}

                {imagePreview ? (
                    ""
                ) : (
                    <Box my={3}>
                        <p style={{ border: "2px dashed gray", textAlign: "center", padding: "40px 0" }}>
                            <label
                                htmlFor="image"
                                style={{ cursor: "pointer", padding: "40px 70px" }}
                            >
                                {formatMessage({ id: "merchants.clickhere" })}
                            </label>
                        </p>
                        <input
                            type="file"
                            id="image"
                            style={{ visibility: "hidden" }}
                            accept="image/x-png,image/jpeg, image/jpg"
                            onChange={getimage}
                        />
                    </Box>
                )}
                <DialogActions>
                    <Button
                        onClick={cancelImage}
                        id="cancel"
                        disableElevation
                        disableRipple
                        variant="outlined"
                        size="large"
                        fullWidth
                        sx={{
                            color: "var(--color-dark-blue)",
                            backgroundColor: "var(--color-cyan) !important",
                            borderRadius: "20px",
                            textTransform: "capitalize",
                            fontWeight: "600",
                            border: "0 !important"
                        }}
                    >
                        {formatMessage({ id: "edoc.cancel" })}
                    </Button>
                    <Button
                        onClick={() => {
                            if (type === "Gwala") {
                                getImageFileCrop()
                            } else {
                                uploadImage()
                            }
                        }}
                        id="upload"
                        variant="outlined"
                        size="large"
                        fullWidth
                        sx={{
                            color: "#fff",
                            backgroundColor: "var(--color-dark-blue) !important",
                            borderRadius: "20px",
                            textTransform: "capitalize",
                            fontWeight: "600",
                            border: "0 !important"
                        }}
                    >{loading ?
                        <CircularProgress
                            size={25}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: "#fff"
                            }}
                        /> : formatMessage({ id: "edoc.upload" })
                        }
                    </Button>
                </DialogActions>
            </DialogContent>
        </>
    );
}

export default UploadProfileImage;
