import { Box, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { useLocale } from '../../locales';
import PageSpinner from '../../components/pagespinner/PageSpinner';
import axios from '../../api/request';
import moment from 'moment';

const TabContainer = styled.div`
  tbody > tr {
    :hover * {
    //   background-color: #d9edff;
    //   cursor: pointer;
    }
  }
`;

const BalanceSharing = ({ page, setPage, phoneNumber, startDate, endDate, searchQuery, type, minAmountVal, maxAmountVal, loading, setLoading }) => {
    const { formatMessage } = useLocale();

    const [data, setData] = useState([])
    const [count, setCount] = useState(0)

    const columns = [
        { id: "ref", label: formatMessage({ id: "tracker.opref" }), width: "15%" },
        { id: "date", label: formatMessage({ id: "tracker.opdate" }), width: "15%" },
        { id: "sender", label: formatMessage({ id: "tracker.sender" }), width: "30%" },
        { id: "recipient", label: formatMessage({ id: "tracker.recipient" }), width: "10%" },
        { id: "type", label: formatMessage({ id: "tracker.optype" }), width: "15%" },
        { id: "amount", label: formatMessage({ id: "tracker.amount" }), width: "15%" },
    ];

    const getBalanceSharing = () => {
        searchQuery = searchQuery || ""
        setLoading(true)
        axios.get(`/v2/shared/balance?page=${page}&limit=10&startDate=${startDate}&endDate=${endDate}&startAmount=${minAmountVal}&endAmount=${maxAmountVal}&searchQuery=${searchQuery}&operationType=${type}`)
            .then((res) => {
                setLoading(false)
                setData(res?.balances?.docs)
                setCount(res?.balances?.totalPages)
            })
            .catch((error) => {
                setLoading(false)
            })
    }

    useEffect(() => {
        getBalanceSharing()
    }, [phoneNumber, startDate, endDate, searchQuery, type, minAmountVal, maxAmountVal, page])
    
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
                                                                {el?.operationReference || "-"}
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
                                                                {moment(el?.createdAt).format("DD/MM/YYYY HH:mm")}
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
                                                                {el?.from?.firstName ? `${el?.from?.firstName} ${el?.from?.lastName}` : "-"}
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
                                                                {el?.to?.firstName ? `${el?.to?.firstName} ${el?.to?.lastName}` : el?.nonGwalaUserPhoneNumber ? el?.nonGwalaUserPhoneNumber : "-"}
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
                                                                {!el?.to?.firstName ? formatMessage({ id: "tracker.nottogwalauser" }) : formatMessage({ id: "tracker.togwalauser" })}
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
                                                                {el?.amount} MAD
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
            {count > 1 &&
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
                        count={count}
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

export default BalanceSharing