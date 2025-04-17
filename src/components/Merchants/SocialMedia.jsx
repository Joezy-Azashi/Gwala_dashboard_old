import React, { useState } from 'react'
import { Box, Button, DialogContent, Grid, MenuItem, TextField, Tooltip, Typography } from '@mui/material'
import { Add, InsertLink, Remove } from '@mui/icons-material'
import { useLocale } from '../../locales';
import { toast } from 'react-toastify';

const webAddressRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:\/?#@!$&'()*+,;=]*)?$/;

const SocialMedia = ({ setOpenSocialMedia, availableOptions, setAvailableOptions, selectedPlatforms, setSelectedPlatforms }) => {
    const { formatMessage } = useLocale();
    const [newPlatform, setNewPlatform] = useState('');
    const [newLink, setNewLink] = useState('');

    const validatePlatformLink = (platform, link) => {
        if (!webAddressRegex.test(`${link}`)) {
            toast(formatMessage({ id: "merchants.socialvalidlink" }), {
                theme: "colored",
                type: "error",
            });
            return false;
        } else if (!(platform === "Website" || platform === "Catalogue") && !link.toLocaleLowerCase()?.includes(`${platform?.toLocaleLowerCase()}.com`)) {
            toast(formatMessage({ id: "merchants.socialappropriatelink" }), {
                theme: "colored",
                type: "error",
            });
            return false;
        }
        return true;
    };

    const handleAddPlatform = () => {
        if (!newPlatform || !newLink) {
            toast(formatMessage({ id: "merchants.socialrequired" }), {
                theme: "colored",
                type: "warning",
            });
            return;
        }

        if (validatePlatformLink(newPlatform, newLink)) {
            const selected = availableOptions.find(option => option.provider === newPlatform);
            setSelectedPlatforms([...selectedPlatforms, { ...selected, url: newLink, image: selected.image }]);
            setAvailableOptions(availableOptions.filter(option => option.provider !== newPlatform));
            setNewPlatform('');
            setNewLink('');
        }
    };

    const handleRemovePlatform = (provider) => {
        const removedPlatform = selectedPlatforms.find(platform => platform.provider === provider);
        setAvailableOptions([...availableOptions, removedPlatform]);
        setSelectedPlatforms(selectedPlatforms.filter(platform => platform.provider !== provider));
    };

    // const handleEditLink = (provider, newLink) => {
    //     setSelectedPlatforms(selectedPlatforms.map(platform =>
    //         platform.provider === provider ? { ...platform, url: newLink } : platform
    //     ));
    // };

    return (
        <DialogContent>
            <Box sx={{ minHeight: "23rem" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: .5 }} mb={2}>
                    <InsertLink fontSize='large' sx={{ color: "var(--color-dark-blue)" }} />
                    <Typography textAlign={"center"} variant='h5' color={"var(--color-dark-blue)"} fontWeight={600}>
                        {formatMessage({ id: "merchants.socialmedia" })}
                    </Typography>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Typography fontSize={"1.2rem"}>{formatMessage({ id: "merchants.socialplatform" })}</Typography>
                    </Grid>
                    <Grid item xs={7}>
                        <Typography fontSize={"1.2rem"}>{formatMessage({ id: "merchants.socialprofileurl" })}</Typography>
                    </Grid>
                </Grid>

                <Box sx={{ backgroundColor: '#F8F8FA', padding: "5px" }}>
                    {availableOptions?.length > 0 &&
                        <Grid container spacing={1} sx={{ alignItems: "center" }}>
                            <Grid item xs={4}>
                                <TextField
                                    select
                                    size='small'
                                    fullWidth
                                    value={newPlatform}
                                    onChange={(e) => setNewPlatform(e.target.value)}
                                    sx={{
                                        '& .MuiSelect-select': {
                                            padding: "8.5px 9px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: .5
                                        }
                                    }}
                                    SelectProps={{
                                        displayEmpty: true
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        {formatMessage({ id: "merchants.socialselect" })}
                                    </MenuItem>
                                    {availableOptions.map(option => (
                                        <MenuItem key={option.provider} value={option.provider} sx={{ gap: 1 }}>
                                            <img src={option?.image} alt={option?.provider} />
                                            {option.provider}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField
                                    type="text"
                                    size='small'
                                    fullWidth
                                    placeholder={formatMessage({ id: "merchants.socialenterlink" })}
                                    value={newLink}
                                    onChange={(e) => setNewLink(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={1}>
                                <Tooltip title={formatMessage({ id: "edoc.add" })}>
                                    <Add onClick={handleAddPlatform} />
                                </Tooltip>
                            </Grid>
                        </Grid>
                    }

                    {selectedPlatforms.map(platform => (
                        <Grid key={platform.provider} container spacing={1} sx={{ alignItems: "center" }} mt={1}>
                            <Grid item xs={4}>
                                <Typography fontSize={"18px"} marginLeft={"7px"}>{platform.provider}</Typography>
                            </Grid>

                            <Grid item xs={7}>
                                <Typography noWrap fontSize={"18px"} marginLeft={"7px"} title={platform.url}>{platform.url}</Typography>
                            </Grid>

                            <Grid item xs={1}>
                                <Tooltip title={formatMessage({ id: "merchants.socialremove" })}>
                                    <Remove onClick={() => handleRemovePlatform(platform.provider)} />
                                </Tooltip>
                            </Grid>
                        </Grid>
                    ))}
                </Box>
            </Box>
            <Grid container spacing={2} mt={2}>
                <Grid item xs={0} sm={3.5} />
                <Grid item xs={12} sm={5}>
                    <Button
                        onClick={() => setOpenSocialMedia(false)}
                        id="request-voucher"
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
                <Grid item xs={0} sm={3.5} />
            </Grid>
        </DialogContent >
    );
};

export default SocialMedia;