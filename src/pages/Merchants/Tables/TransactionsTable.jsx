import React, { useEffect, useState } from 'react'
import { Box, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import styled from 'styled-components';
import { useLocale } from '../../../locales';
import axios from 'axios';
import PageSpinner from '../../../components/pagespinner/PageSpinner';
import moment from 'moment';

const TabContainer = styled.div`
  tbody > tr {
    :hover * {
    //   background-color: #d9edff;
    //   cursor: pointer;
    }
  }
`;

function TransactionsTable({ page, setPage, merchantId, transSortType, transSort, minVal, maxVal, transLoading, setTransLoading, startDate, endDate }) {
    const { formatMessage } = useLocale();
    const [data, setData] = useState([])
    const [count, setCount] = useState(1)

    const columns = [
        { id: "merhchant", label: formatMessage({ id: "merchants.merchant" }), width: "20%" },
        { id: "ref", label: formatMessage({ id: "merchants.transref" }), width: "20%" },
        { id: "date", label: "Date", width: "20%" },
        { id: "beneficiary", label: formatMessage({ id: "merchants.beneficiary" }), width: "20%" },
        { id: "amount", label: formatMessage({ id: "merchants.amount" }), width: "20%" }
    ];

    const getTransactions = (min, max) => {
        setTransLoading(true)
        const url = `${import.meta.env.VITE_BASE_URL}/`
        const token = localStorage.getItem("token");

        const filterTransaction = {
            ...((merchantId && { merchantId }) || {}),
            ...((min && { amountMin: min }) || {}),
            ...((max && { amountMax: max }) || {}),
            ...((startDate && { startDate }) || {}),
            ...((endDate && { endDate }) || {}),
            ...((transSort && { sort: transSort }) || {}),
            ...((transSortType && { sortBy: transSortType }) || {}),
            ...((page && { page }) || {}),
            ...{ limit: 10 },
        };

        axios.get(`${url}v2/vouchers/transactions`, {
            params: {
                ...filterTransaction
            },
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((res) => {
                setTransLoading(false)
                setData(res?.data?.data?.docs?.filter(item => {
                    const metadata = JSON.parse(item.metadata);
                    return metadata.type !== "SEND_BALANCE";
                }))
                setCount(res?.data?.data?.totalDocs)
            })
            .catch((error) => {
                setTransLoading(false)
            })
    }

    useEffect(() => {
        getTransactions(minVal, maxVal)
    }, [page, merchantId, transSort, transSortType, minVal, maxVal, startDate, endDate])

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
                                    {transLoading ?
                                        <TableRow>
                                            <TableCell colSpan={5}>
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
                                        data?.length < 1 ?
                                            <TableRow>
                                                <TableCell colSpan={5}>
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
                                            data?.map((el, index) => {
                                                let metadata = {}
                                                if (el?.metadata !== undefined) {
                                                    try {
                                                        metadata = JSON?.parse(el?.metadata?.replace(/'/g, "'"))
                                                    }
                                                    catch (error) {
                                                        metadata = {}
                                                    }
                                                }
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
                                                                {metadata?.name ? metadata?.name : "-"}
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
                                                                {el?.referenceId || "-"}
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
                                                                {moment(el?.createdAt).format("DD/MM/YYYY")}
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
                                                                {el?.user ? `${el?.user?.firstName} ${el?.user?.lastName}` : "-"}
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
                                                                {el?.amount?.toFixed(2).replace(/\.?0+$/, '')} MAD
                                                            </span>
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
            {count > 10 &&
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
        </TabContainer>
    )
}

export default TransactionsTable