import React from 'react'
import { Box, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import styled from 'styled-components';
import { useLocale } from '../../locales'
import PageSpinner from '../../components/pagespinner/PageSpinner';
import { useNavigate } from 'react-router';

const TabContainer = styled.div`
  tbody > tr {
    :hover * {
    //   background-color: #d9edff;
    //   cursor: pointer;
    }
  }
`;

function HREmployerTable({ page, setPage, companyData, setSubTabIndex, setCompanyId, setCompanyName, loading, companyCount }) {
    const { formatMessage } = useLocale();
    const navigate = useNavigate()

    const columns = [
        { id: "salary", label: formatMessage({ id: "employee.company" }), width: "40%" },
        { id: "total", label: formatMessage({ id: "evoucher.totalvoucher" }), width: "25%" },
        { id: "available", label: formatMessage({ id: "evoucher.availablevoucher" }), width: "25%" },
        { id: "action", label: formatMessage({ id: "advance.actions" }), width: "10%" }
    ];

    return (
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
                                                        backgroundColor: "#D9EDFF",
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
                                            <TableCell colSpan={4}>
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
                                        companyData?.data?.docs?.length < 1 ?
                                            <TableRow>
                                                <TableCell colSpan={4}>
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
                                            companyData?.data?.docs?.map((el, index) => {
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
                                                    >
                                                        <TableCell>
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
                                                                {el?.name}
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
                                                                {el?.totalAmount?.toLocaleString()} MAD
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
                                                                    textTransform: "capitalize",
                                                                }}
                                                            >
                                                                {el?.totalRequestedVouchers?.generalRemainingAmount || el?.totalRequestedVouchers?.restaurantRemainingAmount ?
                                                                    (el?.totalRequestedVouchers?.generalRemainingAmount + el?.totalRequestedVouchers?.restaurantRemainingAmount)?.toLocaleString() + " MAD" :
                                                                    "-"
                                                                }
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
                                                                <Tooltip title={formatMessage({ id: "evoucher.companyprofile" })}>
                                                                    <Box
                                                                        id="company_profile"
                                                                        onClick={() => navigate(`/company/edit/${el?._id}`)}
                                                                        sx={{
                                                                            backgroundColor: "var(--color-cyan) !important",
                                                                            padding: "4px 9px",
                                                                            borderRadius: "15px",
                                                                            display: 'flex',
                                                                            alignItems: "center",
                                                                            cursor: "pointer"
                                                                        }}>
                                                                        <img src="/icons/profile2.svg" width={22} />
                                                                    </Box>
                                                                </Tooltip>
                                                                <Tooltip title={formatMessage({ id: "evoucher.voucherrequest" })}>
                                                                    <Box
                                                                        id="filter_request"
                                                                        onClick={() => { setSubTabIndex("2"); setPage(1); setCompanyId(el?._id); setCompanyName(el?.name) }}
                                                                        sx={{
                                                                            border: "1px solid black !important",
                                                                            padding: "5px 10px",
                                                                            borderRadius: "15px",
                                                                            display: 'flex',
                                                                            alignItems: "center"
                                                                        }}>
                                                                        <img src="/icons/boxpercent.svg" width={20} />
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
            {companyCount > 1 &&
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
                        count={companyCount}
                        variant="outlined"
                        shape="rounded"
                        onChange={(e, value) => setPage(value)}
                        page={page}
                    />
                </div>
            }
        </TabContainer>
    )
}

export default HREmployerTable