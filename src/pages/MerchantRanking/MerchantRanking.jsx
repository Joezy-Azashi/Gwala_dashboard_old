import React, { useEffect, useState } from 'react'
import { Autocomplete, Box, Button, CircularProgress, Container, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import { useLocation, useNavigate, useParams } from 'react-router'
import { useLocale } from '../../locales'
import cover from '../../assets/cover.png'
import axiosMerchant from '../../api/merchantRequest'
import PageSpinner from '../../components/pagespinner/PageSpinner'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { KeyboardBackspace } from '@mui/icons-material'
import { toast } from 'react-toastify'

const MerchantRanking = () => {
    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const { formatMessage } = useLocale();

    const [allMerchants, setAllMerchants] = useState([]);
    const [eNameLoading, setENameLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [merchantId, setMerchantId] = useState("")
    const [openDropDown, setOpenDropDown] = useState(false);
    const [merchants, setMerchants] = useState([])
    const [rankedMerchants, setRankedMerchants] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingRanked, setLoadingRanked] = useState(true)
    const [loadingRest, setLoadingReset] = useState(false)
    const [inputValues, setInputValues] = useState([]);

    const getMerchants = async () => {
        setLoading(true);

        const whereMerchant = {
            ...((merchantId?.length > 0 && { id: { inq: [merchantId] } }) || {}),
        };

        const filterMerchant = {
            ...((whereMerchant && { where: whereMerchant }) || {}),
        };

        try {
            // Fetch both merchants and ranked merchants concurrently
            const [merchantsRes, rankedMerchantsRes] = await Promise.all([
                axiosMerchant.get(`/categories/${id}/merchants`, {
                    params: {
                        filter: {
                            ...filterMerchant,
                        }
                    }
                }),
                axiosMerchant.get(`/categories/${id}/merchants/ranking`)
            ]);

            setLoading(false);
            setLoadingRanked(false);

            const merchantsData = merchantsRes?.data || [];
            const rankedMerchantsData = rankedMerchantsRes?.data || [];

            // Filter out merchants that are already ranked
            const filteredMerchants = merchantsData.filter(merchant => {
                return !rankedMerchantsData.some(ranked => ranked.id === merchant.id);
            });

            setMerchants(filteredMerchants);
            setRankedMerchants(rankedMerchantsData)
        } catch (error) {
            setLoading(false);
            setLoadingRanked(false);
        }
    };
    useEffect(() => {
        getMerchants()
    }, [merchantId])

    const onDragEnd = (result) => {
        const { source, destination } = result;

        // Do nothing if no destination
        if (!destination) {
            return;
        }

        // Handle item moving within the same list
        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                source.droppableId === 'droppable1' ? merchants : rankedMerchants,
                source.index,
                destination.index
            );

            if (source.droppableId === 'droppable1') {
                setMerchants(items);
            } else {
                setRankedMerchants(items);
            }
        } else {
            // Handle item moving between different lists
            const result = move(
                source.droppableId === 'droppable1' ? merchants : rankedMerchants,
                destination.droppableId === 'droppable1' ? merchants : rankedMerchants,
                source,
                destination
            );

            setMerchants(result.droppable1);
            setRankedMerchants(result.droppable2);
        }
    };

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const move = (source, destination, droppableSource, droppableDestination) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);

        destClone.splice(droppableDestination.index, 0, removed);

        const result = {};
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;

        return result;
    };

    const searchMerchants = async (text) => {

        const replacements = [['’', "'"], ['`', "'"], ['‘', "'"]];
        const replacedMerchantName = replacements.reduce((acc, [pattern, replacement]) => acc.replace(new RegExp(pattern, 'g'), replacement), text);

        setENameLoading(true)
        if (text[0] === "+") {
            setENameLoading(false)
            setOpenDropDown(true)
            setAllMerchants([])
        } else if (text?.length >= 2) {
            setOpenDropDown(true);
            const data = await axiosMerchant.get(`/categories/${id}/merchants`, {
                params: {
                    filter: {
                        limit: 1000,
                        where: {
                            name: {
                                regexp: `/${replacedMerchantName}/i`
                            }
                        },
                        fields: {
                            name: true,
                            id: true
                        }
                    }
                }
            })
            if (data) {
                setENameLoading(false)
            }
            setAllMerchants(data?.data)
        } else {
            setOpenDropDown(false);
            const filteredUsers = allMerchants?.filter((user) => {
                const userName = `${user?.name}`;
                return userName.toLowerCase().includes(replacedMerchantName.toLowerCase());
            });
            setAllMerchants([...filteredUsers]);
        }
    };

    const onSaveRanking = () => {
        setSaveLoading(true)
        axiosMerchant.post(`/categories/${id}/merchants/ranking`, { merchants: rankedMerchants?.map(el => el?.id) })
            .then((res) => {
                toast(res?.data?.message, {
                    position: "top-right",
                    type: "success",
                    theme: "colored",
                });
                setSaveLoading(false)
            })
            .catch((error) => {
                toast(error?.response?.data?.message, {
                    position: "top-right",
                    type: "error",
                    theme: "colored",
                });
                setSaveLoading(false)
            })
    }

    const onResetRanking = () => {
        setLoadingReset(true);
        axiosMerchant.put(`/categories/${id}/ranking`, { merchants: [] })
            .then((res) => {
                toast(formatMessage({ id: "merchants.ranking.merchantsresetsuccess" }), {
                    position: "top-right",
                    type: "success",
                    theme: "colored",
                });
                getMerchants()
                setRankedMerchants([])
                setLoadingReset(false)
            })
            .catch((error) => {
                toast(error?.response?.data?.message, {
                    position: "top-right",
                    type: "error",
                    theme: "colored",
                });
                setLoadingReset(false)
            })
    }

    useEffect(() => {
        setInputValues(rankedMerchants.map((_, index) => index + 1));
    }, [rankedMerchants]);

    const handleInputChange = (e, index) => {
        const value = e.target.value;
        const newInputValues = [...inputValues];
        newInputValues[index] = value;
        setInputValues(newInputValues);
    };

    const handleKeyPress = (e, id, index) => {
        if (e.key === 'Enter') {
            const newPosition = parseInt(inputValues[index]);
            const oldIndex = rankedMerchants.findIndex(item => item.id === id);
            const newIndex = newPosition - 1;

            if (oldIndex !== -1 && newIndex >= 0 && newIndex < rankedMerchants.length) {
                const updatedItems = [...rankedMerchants];
                const temp = updatedItems[newIndex];
                updatedItems[newIndex] = updatedItems[oldIndex];
                updatedItems[oldIndex] = temp;
                setRankedMerchants(updatedItems);

                // Update the input values to match the new order
                const newInputValues = updatedItems.map((_, i) => i + 1);
                setInputValues(newInputValues);
            } else {
                toast(formatMessage({ id: "merchants.ranking.numberoutofrange" }), {
                    position: "top-right",
                    type: "warning",
                    theme: "colored",
                });
            }
        }
    };

    return (
        <Box sx={{ padding: "1rem 35px 1rem 35px" }}>
            <Box sx={{ display: { sm: "flex" }, justifyContent: "space-between", alignItems: "center" }} mb={5}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                        sx={{
                            color: "#000",
                            backgroundColor: "#fff !important",
                            cursor: "pointer"
                        }}
                        onClick={() => navigate(-1)}
                    >
                        <KeyboardBackspace sx={{ fontSize: "2.5rem" }} />
                    </IconButton>
                    <Typography variant="h5" fontWeight={600} lineHeight={"1"}>
                        {formatMessage({ id: "merchants.category.rankingbtn" })}
                    </Typography>
                </Box>
            </Box>

            <Container maxWidth={"md"} sx={{ marginBottom: "1rem" }}>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Grid container spacing={{ xs: 3, sm: 0 }} mt={1.5}>
                        <Grid item xs={12} sm={5.75} sx={{ overflowY: "auto", overflowX: "hidden", backgroundColor: "#F7F7F7" }} className="scrollable-container">
                            <Box sx={{ padding: "15px" }}>
                                <Typography textAlign={"center"} fontSize={"1.1rem"} fontWeight={600} color={"var(--color-dark-blue)"} my={2}>{formatMessage({ id: "merchants.ranking.merchantlist" })}</Typography>

                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <Autocomplete
                                        open={openDropDown}
                                        loading={eNameLoading}
                                        id="merchant_name"
                                        sx={{
                                            width: { xs: "100%", md: "80%" },
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "4px",
                                                marginBottom: "16px",
                                            },
                                            "& fieldset": { border: "1px solid var(--color-dark-blue)" },
                                            "& .MuiSvgIcon-root": { display: "none" },
                                            "& .MuiFormLabel-root": {
                                                color: "var(--color-dark-blue) !important",
                                                fontWeight: "600",
                                                fontSize: "15px",
                                                textTransform: "capitalize",
                                            },
                                        }}
                                        size="small"
                                        inputlabelprops={{ shrink: false }}
                                        fullWidth
                                        options={allMerchants}
                                        getOptionLabel={(option) => `${option?.name}`}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder={formatMessage({ id: "merchants.merchantname" })}
                                            />
                                        )}
                                        onChange={(_, value, reason) => {
                                            if (reason === "clear") {
                                                setMerchantId("")
                                                setAllMerchants([])
                                                return;
                                            } else {
                                                setMerchantId(value?.id)
                                                setOpenDropDown(false)
                                            }
                                        }}
                                        onInputChange={(_, value, reason) => {
                                            if (reason === "clear") {
                                                setAllMerchants([])
                                                return;
                                            } else {
                                                searchMerchants(value);
                                            }
                                        }}
                                    />
                                </Box>

                                <Droppable droppableId="droppable1">
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            style={{ height: '100%', width: '100%' }}
                                        >
                                            <Grid container spacing={1}>
                                                {loading ?
                                                    <Grid item xs={12}>
                                                        <Box
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                height: "45vh",
                                                            }}
                                                        >
                                                            <PageSpinner />
                                                        </Box>
                                                    </Grid> :
                                                    merchants?.length < 1 ?
                                                        <Grid item xs={12}>
                                                            <Typography textAlign={"center"} sx={{ marginTop: "4rem", fontSize: "1.2rem" }}>
                                                                {formatMessage({ id: "employee.norecords" })}
                                                            </Typography>
                                                        </Grid> :
                                                        merchants?.map((item, index) => (
                                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                                                {(provided) => (
                                                                    <Grid item xs={12} key={item?.id}
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        style={{
                                                                            ...provided.draggableProps.style,
                                                                            display: "flex",
                                                                            justifyContent: "center"
                                                                        }}
                                                                    >
                                                                        <Box
                                                                            title={item?.name}
                                                                            sx={{
                                                                                backgroundImage: `url(${item?.coverImage ? item?.coverImage : cover})`,
                                                                                backgroundSize: 'cover',
                                                                                backgroundRepeat: 'no-repeat',
                                                                                backgroundPosition: 'center',
                                                                                height: { xs: '10rem' },
                                                                                display: "flex",
                                                                                justifyContent: "end",
                                                                                alignItems: "start",
                                                                                borderRadius: "20px",
                                                                                position: "relative",
                                                                                color: "#fff",
                                                                                width: "70%"
                                                                            }}
                                                                        >
                                                                            <Typography
                                                                                noWrap
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
                                                                                {item?.name}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Grid>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                            </Grid>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </Box>
                        </Grid>

                        <Grid item xs={0} sm={.5} sx={{ display: "flex", justifyContent: "center" }}>
                            <hr style={{ height: "100%", width: ".18rem", backgroundColor: "var(--color-dark-blue)" }} />
                        </Grid>

                        <Grid item xs={12} sm={5.75} sx={{ overflow: "auto", backgroundColor: "#F7F7F7" }}>
                            <Box sx={{ padding: "15px" }}>
                                <Typography noWrap textAlign={"center"} fontSize={"1.1rem"} fontWeight={600} color={"var(--color-dark-blue)"} my={2}>{formatMessage({ id: "merchants.ranking.merchantsranking" })} <span title={location?.state?.name}>{location?.state?.name}</span></Typography>

                                <Droppable droppableId="droppable2">
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            style={{
                                                padding: 8,
                                                width: "100%",
                                            }}
                                        >
                                            <Grid container spacing={1} mt={5}>
                                                {loadingRanked ?
                                                    <Grid item xs={12}>
                                                        <Box
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                height: "45vh",
                                                            }}
                                                        >
                                                            <PageSpinner />
                                                        </Box>
                                                    </Grid> :
                                                    rankedMerchants?.length < 1 ?
                                                        <Grid item xs={12}>
                                                            <Typography textAlign={"center"} sx={{ marginTop: "4rem", fontSize: "1.2rem" }}>
                                                                {formatMessage({ id: "employee.norecords" })}
                                                            </Typography>
                                                        </Grid> :
                                                        rankedMerchants?.map((item, index) => (
                                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                                                {(provided) => (
                                                                    <Grid item xs={12} key={item?.id}
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        style={{
                                                                            ...provided.draggableProps.style,
                                                                        }}
                                                                    >
                                                                        <Box>
                                                                            <Box
                                                                                // onClick={() => { setSelectedCat(el); getMerchantData(el); setNewCatName(el?.name); setCoverImage(el?.imageUrl) }}
                                                                                title={item?.name}
                                                                                sx={{
                                                                                    backgroundImage: `url(${item?.coverImage ? item?.coverImage : cover})`,
                                                                                    backgroundSize: 'cover',
                                                                                    backgroundRepeat: 'no-repeat',
                                                                                    backgroundPosition: 'center',
                                                                                    height: { xs: '10rem' },
                                                                                    display: "flex",
                                                                                    justifyContent: "end",
                                                                                    alignItems: "start",
                                                                                    borderRadius: "20px",
                                                                                    position: "relative",
                                                                                    color: "#fff",
                                                                                    width: "70%",
                                                                                    margin: "auto"
                                                                                }}
                                                                            >
                                                                                <Typography
                                                                                    noWrap
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
                                                                                    {item?.name}
                                                                                </Typography>
                                                                            </Box>
                                                                            <Box sx={{ display: "flex", justifyContent: "center" }} mt={1}>
                                                                                <TextField
                                                                                    type="number"
                                                                                    size='small'
                                                                                    value={inputValues[index]}
                                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                                    onKeyPress={(e) => handleKeyPress(e, item.id, index)}
                                                                                    sx={{
                                                                                        "& .MuiInputBase-input": {
                                                                                            textAlign: "center",
                                                                                        },
                                                                                        "& .MuiOutlinedInput-root": {
                                                                                            height: "1.5rem",
                                                                                            width: "5rem",
                                                                                        }
                                                                                    }}
                                                                                    min="1"
                                                                                    max={rankedMerchants.length}
                                                                                    InputProps={{
                                                                                        startAdornment: (
                                                                                            <InputAdornment position="start">
                                                                                                #
                                                                                            </InputAdornment>
                                                                                        ),
                                                                                    }}
                                                                                />
                                                                            </Box>
                                                                        </Box>
                                                                    </Grid>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                            </Grid>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </Box>
                        </Grid>
                    </Grid>
                </DragDropContext>
            </Container>

            {loading || loadingRanked ? "" :
                <Grid container spacing={{ xs: 2, md: 3 }} sx={{ position: "sticky", bottom: '0', zIndex: 40, backgroundColor: "#fff", paddingBottom: "1rem" }}>
                    <Grid item xs={0} sm={3} />
                    <Grid item xs={12} sm={3}>
                        <Button
                            onClick={() => onResetRanking()}
                            id="reset"
                            disableElevation
                            disableRipple
                            variant="outlined"
                            size="large"
                            fullWidth
                            disabled={loading || loadingRanked || loadingRest || saveLoading}
                            sx={{
                                color: "var(--color-dark-blue)",
                                borderRadius: "20px",
                                textTransform: "capitalize",
                                fontWeight: "600",
                                borderColor: "var(--color-dark-blue) !important",
                            }}
                        >
                            {loadingRest ? (
                                <CircularProgress
                                    size={25}
                                    sx={{
                                        color: "var(--color-dark-blue) !important",
                                    }}
                                />
                            ) : formatMessage({ id: "merchants.ranking.resetranking" })}
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            onClick={() => onSaveRanking()}
                            variant="outlined"
                            size='large'
                            fullWidth
                            disabled={loading || loadingRanked || loadingRest || saveLoading}
                            sx={{
                                color: "var(--color-dark-blue) !important",
                                backgroundColor: "var(--color-cyan) !important",
                                borderRadius: "20px",
                                textTransform: "capitalize",
                                fontWeight: "600",
                                borderColor: "var(--color-cyan) !important",
                                // width: "260px"
                            }}
                        >
                            {saveLoading ? (
                                <CircularProgress
                                    size={25}
                                    sx={{
                                        color: "var(--color-dark-blue) !important",
                                    }}
                                />
                            ) : formatMessage({ id: "edoc.savechanges" })}
                        </Button>
                    </Grid>
                    <Grid item xs={0} sm={3} />
                </Grid>
            }

        </Box>
    )
}

export default MerchantRanking