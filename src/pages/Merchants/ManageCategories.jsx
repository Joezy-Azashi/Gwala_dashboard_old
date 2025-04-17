import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Grid,
    Typography,
    Button,
    IconButton,
    CircularProgress,
    Dialog,
    Tooltip,
    TextField,
    InputAdornment
} from "@mui/material";
import { Close, KeyboardBackspace, Search } from "@mui/icons-material";
import cover from '../../assets/cover.png'
import { toast } from "react-toastify";
import PageSpinner from "../../components/pagespinner/PageSpinner";
import { useLocale } from "../../locales";
import QrCodeDialog from "../../components/Merchants/QrCodeDialog";
import UploadProfileImage from "../../components/Merchants/UploadProfileImage";
import DeleteCategory from "../../components/Merchants/DeleteCategory";
import axiosMerchant from "../../api/merchantRequest";
import AddEditcategoryForm from "../../components/Merchants/AddEditcategoryForm";
import SelectedCatSection from "../../components/Merchants/SelectedCatSection";

function ManageCategories() {
    const { formatMessage } = useLocale();
    const [loading, setLoading] = useState(false);
    const [merchantLoading, setMerchantLoading] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("")
    const [saveLoading, setSaveLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [openqr, setOpenqr] = useState({ data: "", state: false })
    const [isAdd, setIsAdd] = useState(false);
    const [newCatName, setNewCatName] = useState("");
    const [selectedCat, setSelectedCat] = useState("")
    const [openDelete, setOpenDelete] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false)
    const [openPicUpload, setOpenPicUpload] = useState({ type: "", state: false });
    const [coverImage, setCoverImage] = useState("")
    const [data, setData] = useState([]);
    const [merchantData, setMerchantData] = useState([]);
    const [screenWidth, setscreenWidth] = useState(window.innerWidth)

    window.addEventListener("resize", function () {
        setscreenWidth(window.innerWidth)
    });

    // Add category
    const AddNewCat = () => {
        setAddLoading(true)

        const dataToSend = {
            name: newCatName,
            imageUrl: coverImage
        }

        axiosMerchant.post(`/categories`, dataToSend)
            .then((res) => {
                toast(formatMessage({ id: "merchants.category.createsuccess" }), {
                    position: "top-right",
                    type: "success",
                    theme: "colored",
                });
                setAddLoading(false)
                getCategories()
                setCoverImage("")
                setNewCatName("")
                setSelectedCat("")
                setIsAdd(false)
            })
            .catch((error) => {
                setAddLoading(false)
            })
    }

    // Edit category
    const EditCategory = () => {
        setSaveLoading(true)

        const dataToSend = {
            name: newCatName === "" ? selectedCat?.name : newCatName,
            imageUrl: coverImage === "" ? selectedCat?.imageUrl : coverImage
        }

        axiosMerchant.patch(`/categories/${selectedCat?.id}`, dataToSend)
            .then((res) => {
                setSaveLoading(false)
                getCategories()
                setCoverImage("")
                setNewCatName("")
                setSelectedCat("")
                setIsAdd(false)
            })
            .catch((error) => {
                setSaveLoading(false)
            })
    }

    // Get merchants
    const getMerchantData = () => {
        if (!selectedCat?.merchants || selectedCat?.merchants?.length < 1) {
            setMerchantData([])
            return
        }
        setMerchantLoading(true)

        const whereMerchant = {
            ...((selectedCat?.merchants?.length > 0 && { id: { inq: selectedCat?.merchants?.map(el => el?.id) } }) || {}),
        };
        const filterMerchant = {
            ...((whereMerchant && { where: whereMerchant }) || {}),
            ...{ skip: 0 },
        };

        axiosMerchant.get(`/categories/${selectedCat?.id}/merchants`, {
            params: {
                filter: {
                    ...filterMerchant,
                    include: [
                        {
                            relation: "categories",
                        },
                        {
                            relation: "users",
                            scope: {
                                where: {
                                    role: "owner"
                                }
                            }
                        }
                    ]
                }
            }
        })
            .then((res) => {
                setMerchantLoading(false)
                setMerchantData(res?.data)
            })
            .catch((error) => {
                setMerchantLoading(false)
            })
    }

    useEffect(() => {
        if (selectedCat !== "") {
            getMerchantData()
        }
    }, [selectedCat])

    // Get Categories
    const getCategories = () => {
        setLoading(true)

        const filterCategories = {
            ...(({ order: `${"createdAt"} ${"DESC"} ` }) || {}),
            include: [
                {
                    relation: "merchants",
                    scope: {
                        fields: {
                            name: true,
                            id: true
                        }
                    }
                }

            ]
        };

        axiosMerchant.get(`/categories`, {
            params: {
                filter: {
                    ...filterCategories,
                }
            }
        })
            .then((res) => {
                setLoading(false)
                const newArray = res?.data?.map(el => {
                    return { ...el, count: el?.merchants?.length }
                })
                setData(newArray)
            })
            .catch((error) => {

            })
    }

    useEffect(() => {
        getCategories()
    }, [])

    //Delete Category
    const onDeleteCategory = () => {
        setDeleteLoading(true)

        axiosMerchant.delete(`/categories/${selectedCat?.id}`)
            .then((res) => {
                setDeleteLoading(false)
                getCategories()
                setCoverImage("")
                setNewCatName("")
                setIsDeleted(true)
                setIsAdd(false)
            })
            .catch((error) => {
                setDeleteLoading(false)
            })
    }

    return (
        <Box sx={{ padding: "1rem 35px 2rem 35px" }}>
            <Box sx={{ display: { md: "flex" }, justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center" }} mb={2}>
                    {isAdd &&
                        <IconButton
                            sx={{
                                color: "#000",
                                backgroundColor: "#fff !important",
                                cursor: "pointer"
                            }}
                            onClick={() => setIsAdd(false)}
                        >
                            <KeyboardBackspace sx={{ fontSize: "2.5rem" }} />
                        </IconButton>
                    }
                    <Typography variant="h5" fontWeight={600} lineHeight={"1"}>
                        {formatMessage({ id: "merchants.category.title" })}
                    </Typography>
                </Box>
                {!isAdd ?
                    <Box sx={{ display: { xs: "block", md: "flex" }, gap: 2 }} >
                        <TextField
                            size="small"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCoverImage("");
                                setNewCatName("");
                                setSelectedCat("")
                            }}
                            sx={{
                                width: { xs: "100%", md: '310px' },
                                marginBottom: "16px",
                                "& .MuiOutlinedInput-root": {
                                    background: "#fff",
                                    border: "1px solid var(--color-dark-blue)",
                                },
                                "& fieldset": { border: "none" },
                                "& .MuiFormLabel-root": {
                                    color: "var(--color-dark-blue) !important",
                                    fontWeight: "600",
                                    fontSize: "15px",
                                    textTransform: "capitalize",
                                },
                            }}
                            placeholder={formatMessage({ id: "merchants.category.searchcat" })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                                endAdornment: <InputAdornment position='end'>
                                    {searchTerm?.length > 0 &&
                                        <Tooltip title={formatMessage({ id: "merchants.clearsearch" })} arrow>
                                            <Close onClick={() => setSearchTerm("")}
                                                sx={{ cursor: "pointer" }} />
                                        </Tooltip>
                                    }
                                </InputAdornment>
                            }}
                        />

                        <Button
                            onClick={() => { setIsAdd(true); setSelectedCat(""); setCoverImage(""); setNewCatName("") }}
                            id="request-voucher"
                            variant="outlined"
                            size="large"
                            fullWidth

                            sx={{
                                marginBottom: "16px",
                                color: "#fff !important",
                                backgroundColor: "var(--color-dark-blue) !important",
                                borderRadius: "4px",
                                textTransform: "capitalize",
                                fontWeight: "600",
                                borderColor: "var(--color-dark-blue) !important",
                                width: { xs: "100%", md: '230px' }
                            }}
                        >
                            {addLoading ? <CircularProgress
                                size={25}
                                sx={{
                                    color: "#fff !important",
                                }}
                            /> : formatMessage({ id: "merchants.category.add" })}
                        </Button>
                    </Box> : ""
                }
            </Box>
            <Container maxWidth={"xl"}>
                {isAdd ?
                    <>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: "20px",
                            }}
                            mb={5}
                        >
                            {
                                data?.length < 1 ? (
                                    <Typography textAlign={"center"}>
                                        {formatMessage({ id: "merchants.category.nocat" })}
                                    </Typography>
                                ) : (
                                    data.map((el, index) => {
                                        return (
                                            <Box
                                                key={index}
                                                sx={{ display: "flex", alignItems: "center" }}
                                                title={el?.name}
                                            >
                                                <Typography
                                                    noWrap
                                                    variant='body2'
                                                    sx={{
                                                        backgroundColor: "#fff",
                                                        border: "1px solid #002B69",
                                                        padding: "4px 10px",
                                                        borderRadius: "20px",
                                                        color: "#002B69",
                                                        whiteSpace: "nowrap",
                                                        maxWidth: "270px",
                                                        zIndex: 1
                                                    }}>
                                                    {el?.name}
                                                </Typography>
                                                <Typography
                                                    variant='body2'
                                                    sx={{
                                                        backgroundColor: "#CCD5E1",
                                                        border: "1px solid #002B69",
                                                        padding: "3.5px",
                                                        borderRadius: "0 20px 20px 0",
                                                        borderLeft: "0",
                                                        marginLeft: "-.7rem",
                                                        width: "3.5rem",
                                                    }}>
                                                    <span style={{
                                                        backgroundColor: "#F5F5F5",
                                                        width: "1.8rem",
                                                        height: "1.3rem",
                                                        display: "flex",
                                                        justifyContent: 'center',
                                                        alignItems: "center",
                                                        borderRadius: "50%",
                                                        marginLeft: ".9rem"
                                                    }}>
                                                        {el?.merchants?.length || "0"}
                                                    </span>
                                                </Typography>
                                            </Box>
                                        );
                                    })
                                )
                            }
                        </Box>

                        <AddEditcategoryForm
                            newCatName={newCatName}
                            setNewCatName={setNewCatName}
                            coverImage={coverImage}
                            setOpenPicUpload={setOpenPicUpload}
                            isAdd={isAdd}
                            AddNewCat={AddNewCat}
                            addLoading={addLoading}
                        />
                    </> :
                    (
                        <Grid container spacing={3} className="horScroll" mt={1}>
                            <Grid item xs={12} sm={selectedCat ? 3 : 12} sx={{ height: selectedCat !== "" && "37rem !important", overflow: "auto" }} >
                                <Box>
                                    {loading ?
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                height: "20vh",
                                            }}
                                        >
                                            <PageSpinner />
                                        </div> :
                                        data?.length < 1 ? (
                                            <Typography textAlign={"center"}>
                                                {formatMessage({ id: "merchants.category.nocat" })}
                                            </Typography>
                                        ) :
                                            <Grid container spacing={3}>
                                                {data?.filter((el) =>
                                                    el.name
                                                        .toLocaleLowerCase()
                                                        .includes(searchTerm.toLocaleLowerCase())
                                                )
                                                    ?.length < 1 ?
                                                    <Grid item xs={12}>
                                                        <Typography textAlign={"center"} sx={{ marginTop: "2rem", fontSize: "1.2rem" }}>
                                                            {formatMessage({ id: "employee.norecords" })}
                                                        </Typography>
                                                    </Grid> :
                                                    data?.filter((el) =>
                                                        el.name
                                                            .toLocaleLowerCase()
                                                            .includes(searchTerm.toLocaleLowerCase())
                                                    )
                                                        ?.map((el) => {
                                                            return (
                                                                <Grid item xs={12} sm={selectedCat ? 12 : 6} md={selectedCat ? 12 : 3} key={el?.id}>
                                                                    <a href={screenWidth < 600 ? "#catdetails" : "#"} style={{ textDecoration: "none" }}>
                                                                        <Box
                                                                            onClick={() => { setSelectedCat(el); setNewCatName(el?.name); setCoverImage(el?.imageUrl) }}
                                                                            sx={{
                                                                                backgroundImage: `url(${el?.imageUrl ? el?.imageUrl : cover})`,
                                                                                backgroundSize: 'cover',
                                                                                backgroundRepeat: 'no-repeat',
                                                                                backgroundPosition: 'center',
                                                                                height: { xs: '8rem' },
                                                                                display: "flex",
                                                                                justifyContent: "end",
                                                                                alignItems: "start",
                                                                                borderRadius: "20px",
                                                                                position: "relative",
                                                                                color: "#fff",
                                                                                width: selectedCat ? "95%" : "100%",
                                                                                boxShadow: el?.id === selectedCat?.id && "rgba(0, 0, 0, 0.45) 0px 25px 20px -20px"
                                                                            }}
                                                                        >
                                                                            <Box
                                                                                sx={{
                                                                                    width: "1.4rem",
                                                                                    height: "1.4rem",
                                                                                    borderRadius: "50%",
                                                                                    bgcolor: 'var(--color-dark-blue)',
                                                                                    marginRight: "10px",
                                                                                    marginTop: "10px",
                                                                                    display: "flex",
                                                                                    justifyContent: "center",
                                                                                    alignItems: "center",
                                                                                    fontSize: "11px"
                                                                                }}>{el?.count || 0}
                                                                            </Box>
                                                                            <Typography
                                                                                noWrap
                                                                                title={el?.name}
                                                                                sx={{
                                                                                    position: "absolute",
                                                                                    bottom: "0",
                                                                                    background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(135, 206, 250, 1))",
                                                                                    width: "100%",
                                                                                    padding: "8px 5px",
                                                                                    textAlign: "center",
                                                                                    borderRadius: "0 0 20px 20px"
                                                                                }}
                                                                                variant="body2"
                                                                            >
                                                                                {el?.name}
                                                                            </Typography>
                                                                        </Box>
                                                                    </a>
                                                                </Grid>
                                                            )
                                                        })
                                                }
                                            </Grid>
                                    }
                                </Box>
                            </Grid>

                            {selectedCat &&
                                <Grid item xs={12} sm={9} id={"catdetails"}>
                                    {selectedCat !== "" || isAdd ?
                                        <>
                                            <AddEditcategoryForm
                                                newCatName={newCatName}
                                                setNewCatName={setNewCatName}
                                                coverImage={coverImage}
                                                setOpenPicUpload={setOpenPicUpload}
                                                isAdd={isAdd}
                                                AddNewCat={AddNewCat}
                                            />

                                            {!isAdd &&
                                                <>
                                                    <SelectedCatSection
                                                        setOpenqr={setOpenqr}
                                                        merchantLoading={merchantLoading}
                                                        merchantData={merchantData}
                                                        isAdd={isAdd}
                                                        selectedCat={selectedCat}
                                                        setOpenDelete={setOpenDelete}
                                                        newCatName={newCatName}
                                                        saveLoading={saveLoading}
                                                        EditCategory={EditCategory}
                                                    />
                                                </>
                                            }
                                        </>
                                        : ""}
                                </Grid>
                            }
                        </Grid>
                    )
                }
            </Container>

            {/* QR Code */}
            <Dialog
                open={openqr.state}
                onClose={() => setOpenqr({ state: false })}
                fullWidth
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            borderRadius: "20px",
                            maxWidth: "220px",
                        },
                    },
                }}
            >
                <QrCodeDialog openqr={openqr} setOpenqr={setOpenqr} />
            </Dialog>

            {/* Profile Image upload dialog */}
            <Dialog
                open={openPicUpload.state}
                onClose={() => setOpenPicUpload({ type: "", state: false })}
                fullWidth
                maxWidth={openPicUpload.type === "logo" ? "xs" : "md"}
            >
                <UploadProfileImage
                    openPicUpload={openPicUpload}
                    setOpenPicUpload={setOpenPicUpload}
                    setCoverImage={setCoverImage}
                />
            </Dialog>

            {/* Delete Tag */}
            <Dialog
                open={openDelete}
                onClose={() => { setOpenDelete(false); setSelectedCat("") }}
                fullWidth
                maxWidth={"xs"}
                sx={{ "& .MuiDialog-paper": { borderRadius: "35px" } }}
            >
                <DeleteCategory
                    setOpenDelete={setOpenDelete}
                    selectedCat={selectedCat}
                    setSelectedCat={setSelectedCat}
                    onDeleteCategory={onDeleteCategory}
                    deleteLoading={deleteLoading}
                    isDeleted={isDeleted}
                    setIsDeleted={setIsDeleted}
                />
            </Dialog>
        </Box>
    );
}

export default ManageCategories;