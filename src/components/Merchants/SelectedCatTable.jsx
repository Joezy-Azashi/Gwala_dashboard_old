import React from 'react'
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import PageSpinner from '../pagespinner/PageSpinner';
import { useLocale } from '../../locales';
import { QrCode2 } from '@mui/icons-material';
import { useNavigate } from 'react-router';

const SelectedCatTable = ({ columns, merchantLoading, merchantData, setOpenqr, showall }) => {
    const { formatMessage } = useLocale();
    const navigate = useNavigate()

    const data = showall ? merchantData : merchantData?.slice(0, 3)

    return (
            <TableContainer
                sx={{
                    overflowX: "auto",
                    "&::-webkit-scrollbar": {
                        width: 0,
                    },
                }}
            >
                <Table stickyHeader aria-label="sticky table" size="small">
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
                        {merchantLoading ?
                            <TableRow>
                                <TableCell colSpan={9}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: "15vh",
                                        }}
                                    >
                                        <PageSpinner />
                                    </div>
                                </TableCell>
                            </TableRow> :
                            data?.length < 1 ?
                                <TableRow>
                                    <TableCell colSpan={9}>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                height: "15vh",
                                                fontSize: "1.2rem",
                                            }}
                                        >
                                            {formatMessage({ id: "employee.norecords" })}
                                        </div>
                                    </TableCell>
                                </TableRow> :
                                data?.map((el, index) => {
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
                                            onClick={() => navigate(`/merchant-edit/${el?.id}`)}
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
                                                        textTransform: "capitalize"
                                                    }}
                                                >
                                                    <span style={{ width: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                        {el?.name}
                                                    </span>
                                                </span>
                                            </TableCell>

                                            <TableCell title={el?.users?.length > 0 ? el?.users[0]?.firstName + " " + el?.users[0]?.lastName : ""}>
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
                                                    <span style={{ width: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                        {el?.users?.length > 0 ? el?.users[0]?.firstName + " " + el?.users[0]?.lastName : "-"}
                                                    </span>
                                                </span>
                                            </TableCell>

                                            <TableCell>
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
                                                            {el?.categories[0]?.name}
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
                                                    {el?.totalSales.toFixed(2).replace(/\.?0+$/, '')}
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
                                                    {el?.isEnable ? "Active" : "In-Active"}
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
                                                            onClick={(e) => { navigate(`/history-of-transaction/${el?.id}`, { state: { name: el?.name } }); e.stopPropagation(); }}
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
                </Table>
            </TableContainer>
    )
}

export default SelectedCatTable