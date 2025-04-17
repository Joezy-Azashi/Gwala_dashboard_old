import React, { useEffect, useState } from 'react'
import { useLocale } from '../../locales';
import { Box, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import styled from 'styled-components';
import axios from '../../api/request';
import PageSpinner from '../../components/pagespinner/PageSpinner';
import moment from 'moment';

const TabContainer = styled.div`
  tbody > tr {
    :hover * {
    //   background-color: #d9edff;
    //   cursor: pointer;
    }
  }
`;

const CashBackTracker = ({ page, startDate, endDate, minAmountVal, maxAmountVal, mincashBackVal, maxcashBackVal, loading, setLoading, merchantId, benId, setPage }) => {
    const { formatMessage } = useLocale();

    const [data, setData] = useState([])
    const [count, setCount] = useState(0)

    const columns = [
        { id: "name", label: formatMessage({ id: "merchants.merchantname" }), width: "20%" },
        { id: "beneficiary", label: formatMessage({ id: "merchants.beneficiary" }), width: "20%" },
        { id: "rate", label: formatMessage({ id: "merchants.cashbackrate" }), width: "15%" },
        { id: "amount", label: formatMessage({ id: "tracker.amount" }), width: "10%" },
        { id: "cashbackamount", label: formatMessage({ id: "merchants.cashbackamount" }), width: "15%" },
        { id: "date", label: "Date", width: "15%" },
    ];

    const getCashBack = () => {
        setLoading(true)
        axios.get(`/v2/cashback/history?limit=10&page=${page}&startDate=${startDate}&endDate=${endDate}&amountMin=${minAmountVal}&amountMax=${maxAmountVal}&rateMin=${mincashBackVal !== "" ? mincashBackVal / 100 : mincashBackVal}&rateMax=${maxcashBackVal !== "" ? maxcashBackVal / 100 : maxcashBackVal}&merchantId=${merchantId}&userId=${benId}`)
            .then((res) => {
                setLoading(false)
                setData(res?.balances?.docs)
                setCount(res?.balances?.totalDocs)
            })
            .catch((error) => {
                setLoading(false)
            })
    }

    useEffect(() => {
        getCashBack()
    }, [page, startDate, endDate, minAmountVal, maxAmountVal, merchantId, mincashBackVal, maxcashBackVal, benId])
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
                                            <TableCell colSpan={6}>
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
                                                <TableCell colSpan={6}>
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
                                                        metadata = JSON?.parse(el?.metadata?.replace(/'/g, '"'))
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
                                                    // onClick={() => setOpenDetail({ data: el, state: true })}
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
                                                                {metadata?.name ? metadata?.name : metadata?.title ? metadata?.title : "-"}
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
                                                                {`${el?.user?.firstName} ${el?.user?.lastName}`}
                                                            </span>
                                                        </TableCell>

                                                        <TableCell title={el?.message}>
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
                                                                {el?.cashbackrate * 100 || "-"}
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
                                                                {el?.amount + " MAD" || "-"}
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
                                                                }}
                                                            >
                                                                {el?.cashbackAmount.toFixed(3).replace(/\.?0+$/, '') + " MAD" || "-"}
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

export default CashBackTracker