import React, { useState } from 'react'
import { Box, Button, CircularProgress, Dialog, DialogContent, Grid } from '@mui/material';
import styled from 'styled-components';
import { useLocale } from '../../locales';
import { useNavigate } from 'react-router';
import SelectedCatTable from './SelectedCatTable';

const TabContainer = styled.div`
  tbody > tr {
    :hover * {
    //   background-color: #d9edff;
      cursor: pointer;
    }
  }
`;

const SelectedCatSection = ({ setOpenqr, merchantLoading, merchantData, isAdd, selectedCat, setOpenDelete, newCatName, saveLoading, EditCategory, count }) => {
    const { formatMessage } = useLocale();
    const navigate = useNavigate()

    const [openViewAll, setOpenViewAll] = useState(false)

    const columns = [
        { id: "qr", label: "", width: "5%" },
        { id: "merhchant", label: formatMessage({ id: "merchants.merchant" }), width: "25%" },
        { id: "owner", label: formatMessage({ id: "merchants.create.owner" }), width: "25%" },
        { id: "category", label: formatMessage({ id: "merchants.category" }), width: "17%" },
        { id: "city", label: formatMessage({ id: "merchants.city" }), width: "17%" },
        { id: "service", label: formatMessage({ id: "merchants.service" }), width: "10%" },
        { id: "sales", label: formatMessage({ id: "merchants.totalsales" }), width: "10%" },
        { id: "status", label: formatMessage({ id: "merchants.status" }), width: "5%" },
        { id: "action", label: formatMessage({ id: "merchants.action" }), width: "16%" },
    ];

    return (
        <TabContainer>
            <Box sx={{ width: "100%", overflow: "hidden" }}>
                    <SelectedCatTable
                        columns={columns}
                        merchantLoading={merchantLoading}
                        merchantData={merchantData}
                        setOpenqr={setOpenqr}
                        count={count}
                    />

                {merchantData?.length > 3 &&
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Button
                            variant="body2"
                            sx={{
                                textDecoration: "underline",
                                cursor: "pointer",
                                fontWeight: "bold",
                                textAlign: "center",
                                textTransform: "capitalize",
                            }}
                            onClick={() =>
                                // navigate(`/merchants`, {
                                //     state: { category: selectedCat },
                                // })
                                setOpenViewAll(true)
                            }
                        >
                            {formatMessage({ id: "merchants.category.viewall" })}
                        </Button>
                    </Box>}

                {!isAdd && selectedCat?.name &&
                    <Box sx={{ marginTop: "2.3rem" }}>
                        <Grid container spacing={{ xs: 1, md: 8 }}>
                            <Grid item xs={12} md={4}>
                                <Button
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: "var(--color-blue)",
                                        color: "var(--color-dark-blue)",
                                        padding: ".4rem 1rem",
                                        borderRadius: "40px",
                                        fontWeight: "600",
                                        textTransform: "capitalize",
                                        opacity: newCatName === "" && 0.5
                                    }}
                                    onClick={() => EditCategory()}
                                    fullWidth
                                    disabled={newCatName === ""}
                                >
                                    {saveLoading ? (
                                        <CircularProgress
                                            size={25}
                                            sx={{
                                                color: "var(--color-dark-blue) !important",
                                            }}
                                        />
                                    ) : (
                                        formatMessage({ id: "edoc.savechanges" })
                                    )}
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: "var(--color-blue)",
                                        color: "var(--color-dark-blue)",
                                        padding: ".4rem 1rem",
                                        borderRadius: "40px",
                                        fontWeight: "600",
                                        textTransform: "capitalize",
                                        whiteSpace: "nowrap"
                                    }}
                                    onClick={() => navigate(`/merchant-ranking/${selectedCat?.id}`, { state: { name: selectedCat?.name } })}
                                    fullWidth
                                >
                                    {formatMessage({ id: "merchants.category.rankingbtn" })}
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={4}>
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
                                        opacity: selectedCat?.count > 0 && 0.5,
                                    }}
                                    onClick={() => { selectedCat?.count > 0 ? "" : setOpenDelete(true) }}
                                    fullWidth
                                >
                                    {formatMessage({ id: "merchants.category.deletebtn" })}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                }
            </Box>

            {/* Delete owner */}
            <Dialog
                open={openViewAll}
                onClose={() => setOpenViewAll(false)}
                fullWidth
                maxWidth="lg"
                className="pageScroll"
            >
                <DialogContent>
                    <SelectedCatTable
                        columns={columns}
                        merchantLoading={merchantLoading}
                        merchantData={merchantData}
                        setOpenqr={setOpenqr}
                        showall={true}
                        count={count}
                    />
                </DialogContent>
            </Dialog>
        </TabContainer>
    )
}

export default SelectedCatSection