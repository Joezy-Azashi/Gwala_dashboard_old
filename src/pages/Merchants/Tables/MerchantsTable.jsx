import React, { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Dialog, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import styled from 'styled-components';
import { useLocale } from '../../../locales';
import PageSpinner from '../../../components/pagespinner/PageSpinner';
import { useNavigate } from 'react-router';
import { QrCode2 } from '@mui/icons-material';
import QrCodeDialog from '../../../components/Merchants/QrCodeDialog';
import axiosMerchant from '../../../api/merchantRequest';
import { toast } from 'react-toastify';
import axios from '../../../api/request';

const TabContainer = styled.div`
  tbody > tr {
    :hover * {
    //   background-color: #d9edff;
      cursor: pointer;
    }
  }
`;

function MerchantsTable({ page, selectedOwner, selectedCategory, clearFilter, setPage, merchantId, services, category, sort, sortType, minSalesVal, maxSalesVal, maxSales, minSales, loading, setLoading, city, merchantLogo }) {
    const { formatMessage } = useLocale();
    const navigate = useNavigate()
    const [openqr, setOpenqr] = useState({ data: "", state: false })
    const [data, setData] = useState([])
    const [count, setCount] = useState(1)
    const [loadingExport, setLoadingExport] = useState(false)

    const columns = [
        { id: "qr", label: "", width: "5%" },
        { id: "merhchant", label: formatMessage({ id: "merchants.merchant" }), width: "17%" },
        { id: "owner", label: formatMessage({ id: "merchants.create.owner" }), width: "14%" },
        { id: "category", label: formatMessage({ id: "merchants.category" }), width: "14%" },
        { id: "city", label: formatMessage({ id: "merchants.city" }), width: "14%" },
        { id: "service", label: formatMessage({ id: "merchants.service" }), width: "9%" },
        { id: "sales", label: formatMessage({ id: "merchants.totalsales" }), width: "5%" },
        { id: "status", label: formatMessage({ id: "merchants.status" }), width: "5%" },
        { id: "cashbackstatus", label: "Cashback Status", width: "5%" },
        { id: "action", label: formatMessage({ id: "merchants.action" }), width: "12%" },
    ];

    useEffect(() => {
        setLoading(true)

        const OwnerCategorySearch = [
            ...((selectedCategory && selectedCategory?.merchants?.map(el => el?.id)) || []),
            ...((selectedOwner && selectedOwner?.merchants?.map(el => el?.id)) || []),

        ];
        var counts = {};

        const merchantIds = merchantId !== "" ? [merchantId] : OwnerCategorySearch?.filter(item => {
            counts[item] = (counts[item] || 0) + 1;
            const varCheck = selectedCategory?.merchants?.length > 0 && selectedOwner?.merchants?.length > 0 ? 2 : 1
            return counts[item] === varCheck;
        })

        const TotalSalesRange = [
            ((maxSales && { totalSales: { lte: maxSales } }) || {}),
            ((minSales && { totalSales: { gte: minSales } }) || {}),
        ];

        const whereMerchant = {
            ...((merchantIds?.length > 0 && { id: { inq: merchantIds } }) || {}),
            ...((services && { serviceType: services }) || {}),
            ...((city && { city }) || {}),
            ...((merchantLogo && { logo: (merchantLogo === "false" ? "" : { neq: "" }) }) || {}),
            ...((TotalSalesRange?.length > 0 && { and: TotalSalesRange }) || {}),
        };

        const filterMerchant = {
            ...((whereMerchant && { where: whereMerchant }) || {}),
            ...((sortType && { order: `${sortType} ${sort} ` }) || {}),
            ...{ limit: 10 },
            ...{ skip: (page - 1) * 10 },
        };

        if (selectedCategory?.merchants?.length > 0 && selectedOwner?.merchants?.length > 0 && merchantIds.length < 1) {
            toast(formatMessage({ id: "merchants.catownersearch" }), {
                theme: "colored",
                type: "warning",
            });
            clearFilter()
        }

        axiosMerchant.get(`/merchants`, {
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
                setLoading(false)
                setData(res?.data)
                setCount(res?.data?.totalItems)
            })
            .catch((error) => {
                setLoading(false)
            })
    }, [page, merchantId, selectedOwner, services, category, sort, sortType, minSalesVal, maxSalesVal, city, merchantLogo])

    const onExportMerchants = async () => {
        setLoadingExport(true)

        const OwnerCategorySearch = [
            ...((selectedCategory && selectedCategory?.merchants?.map(el => el?.id)) || []),
            ...((selectedOwner && selectedOwner?.merchants?.map(el => el?.id)) || []),

        ];
        var counts = {};

        const merchantIds = merchantId !== "" ? [merchantId] : OwnerCategorySearch?.filter(item => {
            counts[item] = (counts[item] || 0) + 1;
            const varCheck = selectedCategory?.merchants?.length > 0 && selectedOwner?.merchants?.length > 0 ? 2 : 1
            return counts[item] === varCheck;
        })

        const TotalSalesRange = [
            ((maxSales && { totalSales: { lte: maxSales } }) || {}),
            ((minSales && { totalSales: { gte: minSales } }) || {}),
        ];

        const whereMerchant = {
            ...((merchantIds?.length > 0 && { id: { inq: merchantIds } }) || {}),
            ...((services && { serviceType: services }) || {}),
            ...((city && { city }) || {}),
            ...((TotalSalesRange?.length > 0 && { and: TotalSalesRange }) || {}),
        };

        const filterMerchant = {
            ...((whereMerchant && { where: whereMerchant }) || {}),
            ...((sortType && { order: `${sortType} ${sort} ` }) || {})
        };

        try {
            const response = await axios.get(`/v2/export/merchants`,
                {
                    params: {
                        filter: {
                            ...filterMerchant,
                            include: [
                                {
                                    relation: "users",
                                    scope: {
                                        where: {
                                            role: "owner"
                                        }
                                    }
                                },
                                {
                                    relation: "categories",
                                }
                            ],
                            order: ["createdAt DESC"]
                        }
                    },
                    responseType: "blob"
                }
            )

            const blob = new Blob([response], { type: response.type });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "merchants";
            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            setLoadingExport(false)
            return null;
        }
        catch {
            setLoadingExport(false)
        }

    }
    useEffect(() => {
        localStorage.setItem("merchantPageNumber", page)
    }, [page])

    return (
        <>
            <Box sx={{ display: { xs: "block", sm: "flex" }, justifyContent: "space-between", gap: 2, marginBottom: "24px" }}>
                <Button
                    onClick={() => navigate(`/merchant-add`)}
                    id="request-voucher"
                    variant="outlined"
                    size="large"
                    fullWidth
                    sx={{
                        color: "var(--color-dark-blue)",
                        backgroundColor: "#fff",
                        borderRadius: "20px",
                        textTransform: "capitalize",
                        fontWeight: "600",
                        borderColor: "var(--color-dark-blue) !important",
                        '&:hover': { color: "#fff", backgroundColor: "var(--color-dark-blue)" },
                        marginBottom: { xs: "1rem", sm: "0" }
                    }}
                >
                    {formatMessage({ id: "merchants.addmerchant" })}
                </Button>

                <Button
                    id="manage-owners"
                    onClick={() => navigate('/manage-owners')}
                    variant="outlined"
                    fullWidth
                    size="large"
                    sx={{
                        color: "var(--color-dark-blue)",
                        backgroundColor: "#fff",
                        borderRadius: "20px",
                        textTransform: "capitalize",
                        fontWeight: "600",
                        borderColor: "var(--color-dark-blue) !important",
                        '&:hover': { color: "#fff", backgroundColor: "var(--color-dark-blue)" },
                        marginBottom: { xs: "1rem", sm: "0" }
                    }}
                >
                    {formatMessage({ id: "merchants.owner.title" })}
                </Button>

                <Button
                    id="manage-cat"
                    onClick={() => navigate('/manage-categories')}
                    variant="outlined"
                    fullWidth
                    size="large"
                    sx={{
                        color: "var(--color-dark-blue)",
                        backgroundColor: "#fff",
                        borderRadius: "20px",
                        textTransform: "capitalize",
                        fontWeight: "600",
                        borderColor: "var(--color-dark-blue) !important",
                        '&:hover': { color: "#fff", backgroundColor: "var(--color-dark-blue)" },
                        marginBottom: { xs: "1rem", sm: "0" }
                    }}
                >
                    {formatMessage({ id: "merchants.managecategories" })}
                </Button>

                <Button
                    onClick={() => onExportMerchants()}
                    id="request-voucher"
                    variant="outlined"
                    size="large"
                    disabled={loadingExport}
                    fullWidth
                    sx={{
                        color: "var(--color-dark-blue)",
                        backgroundColor: "#fff",
                        borderRadius: "20px",
                        textTransform: "capitalize",
                        fontWeight: "600",
                        borderColor: "var(--color-dark-blue) !important",
                        '&:hover': { color: "#fff", backgroundColor: "var(--color-dark-blue)" },
                        marginBottom: { xs: "1rem", sm: "0" }
                    }}
                >
                    {loadingExport ?
                        <CircularProgress
                            size={25}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: "var(--color-dark-blue)"
                            }}
                        /> :
                        formatMessage({ id: "merchants.exportmerchants" })}
                </Button>
            </Box>

            <TabContainer>
                <Box sx={{ width: "100%", overflow: "hidden" }}>
                    <TableContainer
                        sx={{
                            overflowX: "auto",
                            "&::-webkit-scrollbar": {
                                width: 0,
                            },
                        }}
                    >
                        <Table stickyHeader aria-label="sticky table" size="small">
                            {
                                <>
                                    <TableHead>
                                        <TableRow
                                            sx={{
                                                "& .MuiTableCell-root": {
                                                    border: "0px",
                                                    textAlign: "center",
                                                    padding: "3px",
                                                },
                                            }}
                                        >
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    style={{ width: column.width }}
                                                >
                                                    <span
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontWeight: "bolder",
                                                            padding: column.id === "icon" ? "" : ".5rem",
                                                            whiteSpace: "nowrap",
                                                            backgroundColor: column.id === "qr" ? "" : "#D9EDFF",
                                                        }}
                                                    >
                                                        {column.label}
                                                    </span>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {loading ?
                                            <TableRow>
                                                <TableCell colSpan={10}>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            height: "45vh",
                                                        }}
                                                    >
                                                        <PageSpinner />
                                                    </div>
                                                </TableCell>
                                            </TableRow> :
                                            data?.docs?.length < 1 ?
                                                <TableRow>
                                                    <TableCell colSpan={10}>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                height: "50vh",
                                                                fontSize: "1.2rem",
                                                            }}
                                                        >
                                                            {formatMessage({ id: "employee.norecords" })}
                                                        </div>
                                                    </TableCell>
                                                </TableRow> :
                                                data?.docs?.map((el, index) => {
                                                    return (
                                                        <TableRow
                                                            hover
                                                            key={index}
                                                            role="checkbox"
                                                            tabIndex={-1}
                                                            sx={{
                                                                "& .MuiTableCell-root": {
                                                                    border: "0px",
                                                                    textAlign: "center",
                                                                    padding: "3px",
                                                                },
                                                            }}
                                                            onClick={() => { navigate(`/merchant-edit/${el?.id}`) }}
                                                        >
                                                            <TableCell>
                                                                <Tooltip title={formatMessage({ id: "merchants.qrcode" })}>
                                                                    {el?.qrCode &&
                                                                        <Box sx={{ display: "flex", alignItems: "center" }} onClick={(e) => { setOpenqr({ data: el, state: true }); e.stopPropagation() }}>
                                                                            <QrCode2 />
                                                                        </Box>
                                                                    }
                                                                </Tooltip>
                                                            </TableCell>

                                                            <TableCell title={el?.name}>
                                                                <span
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        padding: ".45rem",
                                                                        backgroundColor: "#F7F0F0",
                                                                        whiteSpace: "nowrap",
                                                                        textTransform: "capitalize",
                                                                    }}
                                                                >
                                                                    <span style={{ width: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{el?.name}</span>
                                                                </span>
                                                            </TableCell>

                                                            <TableCell title={el?.users?.length > 0 ? el?.users[0]?.firstName + " " + el?.users[0]?.lastName : ""}>
                                                                <span
                                                                    style={{
                                                                        display: "flex",
                                                                        gap: 5,
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        padding: ".45rem",
                                                                        backgroundColor: "#F7F0F0",
                                                                        whiteSpace: "nowrap",
                                                                        textTransform: "capitalize",
                                                                    }}
                                                                >
                                                                    <span style={{ width: "120px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                        {el?.users?.length > 0 ? el?.users[0]?.firstName + " " + el?.users[0]?.lastName : "-"}
                                                                    </span>
                                                                    {el?.users?.length > 1 ? (
                                                                        <Tooltip
                                                                            title={<Box sx={{ display: "flex", gap: .5, flexWrap: "wrap" }}>{el?.users?.map((item, index) => {
                                                                                return <div key={index}>{item?.firstName + " " + item?.lastName},</div>
                                                                            })}</Box>}
                                                                        >
                                                                            <span
                                                                                style={{
                                                                                    padding: "3px",
                                                                                    backgroundColor:
                                                                                        "var(--color-cyan-light)",
                                                                                    color: "var(--color-dark-blue)",
                                                                                    borderRadius: "50%",
                                                                                    fontSize: "12px",
                                                                                    fontWeight: "600",
                                                                                    cursor: "pointer",
                                                                                }}
                                                                            >
                                                                                +{el?.users?.length - 1}
                                                                            </span>
                                                                        </Tooltip>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                </span>
                                                            </TableCell>

                                                            <TableCell title={category && category?.length > 0 ? category : el?.categories?.length > 0 ? el?.categories[0]?.name : ""}>
                                                                <span
                                                                    style={{
                                                                        display: "flex",
                                                                        gap: 5,
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        padding: ".45rem",
                                                                        backgroundColor: "#F7F0F0",
                                                                        whiteSpace: "nowrap",
                                                                        textTransform: "capitalize",
                                                                    }}
                                                                >
                                                                    {el?.categories && el?.categories?.length > 0 ?
                                                                        <>
                                                                            <span style={{ width: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{category && category?.length > 0 ? category : el?.categories?.length > 0 ? el?.categories[0]?.name : ""}</span>
                                                                            {el?.categories?.length > 1 ? (
                                                                                <Tooltip
                                                                                    title={<Box sx={{ display: "flex", gap: .5, flexWrap: "wrap" }}>{el?.categories?.map((el, index) => {
                                                                                        return <div key={index}>{el?.name},</div>
                                                                                    })}</Box>}
                                                                                >
                                                                                    <span
                                                                                        style={{
                                                                                            padding: "3px",
                                                                                            backgroundColor:
                                                                                                "var(--color-cyan-light)",
                                                                                            color: "var(--color-dark-blue)",
                                                                                            borderRadius: "50%",
                                                                                            fontSize: "12px",
                                                                                            fontWeight: "600",
                                                                                            cursor: "pointer",
                                                                                        }}
                                                                                    >
                                                                                        +{el?.categories?.length - 1}
                                                                                    </span>
                                                                                </Tooltip>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                        </>
                                                                        :
                                                                        el?.category
                                                                    }
                                                                </span>
                                                            </TableCell>

                                                            <TableCell>
                                                                <span
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        padding: ".45rem",
                                                                        backgroundColor: "#F7F0F0",
                                                                        whiteSpace: "nowrap",
                                                                        textTransform: "capitalize"
                                                                    }}
                                                                >
                                                                    {el?.city}
                                                                </span>
                                                            </TableCell>

                                                            <TableCell>
                                                                <span
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        padding: ".45rem",
                                                                        backgroundColor: "#F7F0F0",
                                                                        whiteSpace: "nowrap",
                                                                        textTransform: "capitalize"
                                                                    }}
                                                                >
                                                                    {el?.serviceType || "-"}
                                                                </span>
                                                            </TableCell>

                                                            <TableCell>
                                                                <span
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        padding: ".45rem",
                                                                        backgroundColor: "#F7F0F0",
                                                                        whiteSpace: "nowrap",
                                                                        textTransform: "capitalize"
                                                                    }}
                                                                >
                                                                    {el?.totalSales.toFixed(2).replace(/\.?0+$/, '')} MAD
                                                                </span>
                                                            </TableCell>

                                                            <TableCell>
                                                                <span
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        padding: ".45rem",
                                                                        backgroundColor: "#F7F0F0",
                                                                        whiteSpace: "nowrap",
                                                                        textTransform: "capitalize"
                                                                    }}
                                                                >
                                                                    {el?.isEnable ? formatMessage({ id: "settings.active" }) : formatMessage({ id: "settings.inactive" })}
                                                                </span>
                                                            </TableCell>

                                                            <TableCell>
                                                                <span
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        padding: ".45rem",
                                                                        backgroundColor: "#F7F0F0",
                                                                        whiteSpace: "nowrap",
                                                                        textTransform: "capitalize"
                                                                    }}
                                                                >
                                                                    {el?.cashbackRate > 0 ? formatMessage({ id: "settings.active" }) : formatMessage({ id: "settings.inactive" })}
                                                                </span>
                                                            </TableCell>

                                                            <TableCell>
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        gap: "10px",
                                                                        alignItems: "center",
                                                                        width: "100%",
                                                                    }}
                                                                >
                                                                    <Tooltip title={formatMessage({ id: "merchants.edit" })}>
                                                                        <Box
                                                                            id="merchant_profile"
                                                                            sx={{
                                                                                backgroundColor: "var(--color-cyan) !important",
                                                                                padding: "5px 10px",
                                                                                borderRadius: "15px",
                                                                                display: 'flex',
                                                                                alignItems: "center",
                                                                                cursor: "pointer"
                                                                            }}>
                                                                            <img src="/icons/house.svg" width={20} />
                                                                        </Box>
                                                                    </Tooltip>
                                                                    <Tooltip title={formatMessage({ id: "merchants.transactionhistory" })}>
                                                                        <Box
                                                                            id="filter_request"
                                                                            onClick={(e) => { e.stopPropagation(); navigate(`/history-of-transaction/${el?.id}`, { state: { name: el?.name } }) }}
                                                                            sx={{
                                                                                border: "1px solid black !important",
                                                                                padding: "5px 10px",
                                                                                borderRadius: "15px",
                                                                                display: 'flex',
                                                                                alignItems: "center",
                                                                                cursor: "pointer"
                                                                            }}>
                                                                            <img src="/icons/boxpercent2.svg" width={18} />
                                                                        </Box>
                                                                    </Tooltip>
                                                                    <Tooltip title={formatMessage({ id: "merchants.reimbursements" })}>
                                                                        <Box
                                                                            onClick={(e) => { e.stopPropagation(); navigate(`/merchant-reimbursements/${el?.id}`, { state: { name: el?.name } }) }}
                                                                            id="filter_request"
                                                                            sx={{
                                                                                border: "1px solid black !important",
                                                                                padding: "5px 10px",
                                                                                borderRadius: "15px",
                                                                                display: 'flex',
                                                                                alignItems: "center",
                                                                                cursor: "pointer"
                                                                            }}>
                                                                            <img src="/icons/Navbar/advance.svg" width={18} />
                                                                        </Box>
                                                                    </Tooltip>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                        }
                                    </TableBody>
                                </>
                            }
                        </Table>
                    </TableContainer>
                </Box>

                {/* Pagination */}
                {
                    count > 10 &&
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            margin: "10px 0",
                        }}
                    >
                        <Pagination
                            hidePrevButton
                            hideNextButton
                            count={Math.ceil(count / 10)}
                            variant="outlined"
                            shape="rounded"
                            onChange={(e, value) => setPage(value)}
                            page={page}
                        />
                    </div>
                }

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
            </TabContainer >
        </>
    )
}

export default MerchantsTable