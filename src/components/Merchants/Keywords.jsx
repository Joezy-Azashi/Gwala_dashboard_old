import React, { useEffect, useState } from 'react';
import { Autocomplete, Badge, Box, Button, Dialog, DialogContent, Grid, InputAdornment, TextField, Tooltip, Typography } from '@mui/material';
import { Close, InsertLink, Search } from '@mui/icons-material';
import { useLocale } from '../../locales';
import { toast } from 'react-toastify';
import axiosMerchant from '../../api/merchantRequest';

const Keywords = ({ setOpenKeywords, keywords, setKeywords, removeKeyword }) => {
    const { formatMessage } = useLocale();

    const [searchTerm, setSearchTerm] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [openDropDown, setOpenDropDown] = useState(false);
    const [openClearWarning, setOpenClearWarning] = useState(false);
    const [allKeywords, setAllKeywords] = useState([]);
    const [selectedKeyword, setSelectedKeyword] = useState("");

    const addKeyword = (input) => {
        setKeywords((prevItems) => {
            if (typeof input === 'object' && input !== null && 'id' in input && 'name' in input) {
                const existingObject = prevItems.find(obj => obj.name === input.name);
                if (existingObject) {
                    toast(formatMessage({ id: "merchants.keywordexists" }), {
                        theme: "colored",
                        type: "warning",
                    });
                    return prevItems; // No changes to state
                } else {
                    return [...prevItems, { id: input.id, name: input.name.toLowerCase(), isVisible: false }];
                }
            } else if (typeof input === 'string' && input?.length > 0) {
                const existingObject = prevItems.find(obj => obj.name === input);
                if (existingObject) {
                    toast(formatMessage({ id: "merchants.keywordexists" }), {
                        theme: "colored",
                        type: "warning",
                    });
                    return prevItems; // No changes to state
                } else {
                    return [...prevItems, { name: input.toLowerCase(), isVisible: false }];
                }
            }
        });

        // Clear the input field
        setInputValue("");
        setOpenDropDown(false)
    };

    const searchKeywords = async (text) => {
        const replacements = [['’', "'"], ['`', "'"], ['‘', "'"]];
        const replacedKeywordName = replacements.reduce((acc, [pattern, replacement]) => acc.replace(new RegExp(pattern, 'g'), replacement), text);

        setLoading(true);
        if (text[0] === "+") {
            setLoading(false);
            setOpenDropDown(true);
            setAllKeywords([]);
        } else if (text?.length >= 2) {
            setOpenDropDown(true);
            const data = await axiosMerchant.get(`/keywords`, {
                params: {
                    filter: {
                        limit: 1000,
                        where: {
                            name: {
                                regexp: `/${replacedKeywordName}/i`
                            }
                        },
                        fields: {
                            name: true,
                            id: true
                        }
                    }
                }
            });
            if (data) {
                setLoading(false);
            }
            setAllKeywords(data?.data);
        } else {
            setOpenDropDown(false);
            const filteredUsers = allKeywords?.filter((word) => {
                const keyName = `${word?.name}`;
                return keyName.toLowerCase().includes(replacedKeywordName.toLowerCase());
            });
            setAllKeywords([...filteredUsers]);
        }
    };

    const changeVisibility = () => {
        setKeywords(prevItem => prevItem.map(item =>
            item.name === selectedKeyword?.name ? { ...item, isVisible: !item?.isVisible } : item
        ))
        setSelectedKeyword({ id: selectedKeyword?.id, name: selectedKeyword?.name, isVisible: !selectedKeyword?.isVisible })
    }

    return (
        <DialogContent>
            <Box sx={{ display: { xs: "block", md: "flex" }, justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: .5 }} mb={2}>
                    <InsertLink fontSize='large' sx={{ color: "var(--color-dark-blue)" }} />
                    <Typography textAlign={"center"} variant='h5' color={"var(--color-dark-blue)"} fontWeight={600}>
                        {formatMessage({ id: "merchants.keywordsmanager" })}
                    </Typography>
                </Box>

                {selectedKeyword !== "" &&
                    <Button
                        onClick={() => changeVisibility()}
                        id="change-visibility"
                        variant="contained"
                        size="medium"
                        disableElevation
                        sx={{
                            width: { xs: "100%", md: '200px' },
                            color: "#fff",
                            backgroundColor: "var(--color-dark-blue) !important",
                            borderRadius: "20px",
                            textTransform: "none",
                            whiteSpace: "nowrap",
                            fontWeight: "600",
                            border: "1px solid var(--color-dark-blue) !important",
                            marginBottom: "16px",
                        }}
                    >
                        {!selectedKeyword?.isVisible ? formatMessage({ id: "merchants.keywordmarkasvisible" }) : formatMessage({ id: "merchants.keywordmarkasinvisible" })}
                    </Button>
                }

                <TextField
                    size="small"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        width: { xs: "100%", md: '220px' },
                        marginBottom: "16px",
                        "& .MuiOutlinedInput-root": {
                            background: "#fff",
                            borderRadius: "40px",
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
                    placeholder={formatMessage({ id: "nav.search" })}
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
            </Box>

            <Box sx={{ minHeight: "20rem", backgroundColor: "var(--color-white)", padding: "12px" }}>
                <Typography sx={{ fontSize: "13px", color: "var(--color-dark-blue)", marginTop: "-22px" }}>
                    {`${keywords?.length} ${formatMessage({ id: "merchants.keywords" })} (${keywords?.filter(ft => ft?.isVisible)?.length} visible)`}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2 }} pt={1}>
                    {keywords?.filter((el) => el?.name?.toLowerCase().includes(searchTerm.toLowerCase()))?.map((el, index) => {
                        return (
                            <Badge variant="standard" badgeContent={""} key={index} sx={{ '& .MuiBadge-badge': { backgroundColor: el?.isVisible ? "green" : "#FA3E3E" } }}>
                                <Box
                                    title={el?.name}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        backgroundColor: selectedKeyword?.name === el?.name ? "var(--color-dark-blue)" : "#fff",
                                        color: selectedKeyword?.name === el?.name ? "#fff" : "var(--color-dark-blue)",
                                        padding: "3px 9px",
                                        borderRadius: "10px",
                                        border: "1px solid var(--color-dark-blue)",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => setSelectedKeyword(el)}
                                >
                                    <Typography
                                        noWrap
                                        sx={{
                                            fontSize: "14px",
                                            maxWidth: "180px"
                                        }}
                                    >
                                        {el?.name}
                                    </Typography>
                                    <Close
                                        onClick={() => removeKeyword(index)}
                                        fontSize='12px'
                                        sx={{ border: "1px solid var(--color-dark-blue)", borderRadius: "50%" }}
                                    />
                                </Box>
                            </Badge>
                        );
                    })}

                    <Autocomplete
                        open={openDropDown}
                        loading={loading}
                        id="keywords"
                        sx={{
                            "& .MuiSvgIcon-root": { display: "none" },
                            width: "200px"
                        }}
                        size="small"
                        inputValue={inputValue}
                        onInputChange={(event, newInputValue, reason) => {
                            if (reason === "clear" || reason === "reset") {
                                setOpenDropDown(false);
                                setAllKeywords([]);
                                setInputValue("");
                            } else {
                                setInputValue(newInputValue);
                                searchKeywords(newInputValue);
                            }
                        }}
                        options={allKeywords}
                        getOptionLabel={(option) => `${option?.name}`}
                        renderInput={(params) => (
                            <TextField
                                variant='standard'
                                {...params}
                                placeholder={formatMessage({ id: "merchants.keywordenter" })}
                                onKeyDown={(event) => {
                                    if (event.keyCode === 13) {
                                        addKeyword(event.target.value);
                                    }
                                }}
                            />
                        )}
                        onChange={(_, value, reason) => {
                            if (reason === "selectOption") {
                                addKeyword(value);
                            }
                        }}
                    />
                </Box>
            </Box>

            <Grid container spacing={2} mt={2}>
                <Grid item xs={0} sm={2} />
                <Grid item xs={0} sm={4}>
                    <Button
                        onClick={() => setOpenClearWarning(true)}
                        id="clear"
                        variant="contained"
                        size="medium"
                        fullWidth
                        disableElevation
                        disabled={keywords?.length < 1}
                        sx={{
                            color: "var(--color-dark-blue) !important",
                            backgroundColor: "transparent !important",
                            borderRadius: "20px",
                            textTransform: "capitalize",
                            fontWeight: "600",
                            border: "1px solid var(--color-dark-blue) !important"
                        }}
                    >
                        {formatMessage({ id: "merchants.keywordclear" })}
                    </Button>
                </Grid>
                <Grid item xs={0} sm={4}>
                    <Button
                        onClick={() => setOpenKeywords(false)}
                        id="close"
                        variant="contained"
                        size="medium"
                        fullWidth
                        disableElevation
                        sx={{
                            color: "#fff !important",
                            backgroundColor: "var(--color-dark-blue) !important",
                            borderRadius: "20px",
                            textTransform: "capitalize",
                            fontWeight: "600",
                            border: "1px solid var(--color-dark-blue) !important"
                        }}
                    >
                        {formatMessage({ id: "employer.close" })}
                    </Button>
                </Grid>
                <Grid item xs={0} sm={2} />
            </Grid>

            <Dialog
                open={openClearWarning}
                onClose={() => setOpenClearWarning(false)}
                fullWidth
                sx={{ "& .MuiDialog-paper": { borderRadius: "15px" } }}
                maxWidth={"xs"}
            >
                <DialogContent>
                    <Typography>{formatMessage({ id: "merchants.keywordsureclear" })}</Typography>
                    <Grid container spacing={2} mt={2}>
                        <Grid item xs={0} sm={2} />
                        <Grid item xs={0} sm={4}>
                            <Button
                                onClick={() => setOpenClearWarning(false)}
                                id="clear"
                                variant="contained"
                                size="medium"
                                fullWidth
                                disableElevation
                                sx={{
                                    color: "#fff !important",
                                    backgroundColor: "var(--color-dark-blue) !important",
                                    borderRadius: "20px",
                                    textTransform: "capitalize",
                                    fontWeight: "600",
                                    border: "1px solid var(--color-dark-blue) !important"
                                }}
                            >
                                {formatMessage({ id: "edoc.no" })}
                            </Button>
                        </Grid>
                        <Grid item xs={0} sm={4}>
                            <Button
                                onClick={() => { setKeywords([]); setOpenClearWarning(false) }}
                                id="close"
                                variant="contained"
                                size="medium"
                                fullWidth
                                disableElevation
                                sx={{
                                    color: "var(--color-dark-blue) !important",
                                    backgroundColor: "transparent !important",
                                    borderRadius: "20px",
                                    textTransform: "capitalize",
                                    fontWeight: "600",
                                    border: "1px solid var(--color-dark-blue) !important"
                                }}
                            >
                                {formatMessage({ id: "edoc.yes" })}
                            </Button>
                        </Grid>
                        <Grid item xs={0} sm={2} />
                    </Grid>
                </DialogContent>
            </Dialog>
        </DialogContent>
    );
}

export default Keywords;
