import React, { useEffect, useState } from 'react'
import { Box, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import axiosMerchant from '../../../api/merchantRequest';
import { useLocale } from '../../../locales';
import styled from 'styled-components';
import PageSpinner from '../../../components/pagespinner/PageSpinner';
import { useNavigate } from 'react-router';

const TabContainer = styled.div`
  tbody > tr {
    :hover * {
      cursor: pointer;
    }
  }
`;

const GeolocationTable = ({ pageRequest, setPageRequest, merchantId, geoType }) => {
    const { formatMessage } = useLocale();
    const navigate = useNavigate()
    const [data, setData] = useState([{ name: "", age: "" }])
    const [count, setCount] = useState(1)
    const [loading, setLoading] = useState(false)

    const columns = [
        { id: "name", label: formatMessage({ id: "merchants.businessname" }), width: "20%" },
        { id: "address", label: formatMessage({ id: "employee.address" }), width: "16%" },
        { id: "city", label: formatMessage({ id: "merchants.city" }), width: "10%" },
        { id: "lon", label: "Longitude", width: "16%" },
        { id: "lat", label: "Latitude", width: "16%" },
        { id: "type", label: formatMessage({ id: "filter.type" }), width: "16%" },
        { id: "actions", label: "Actions", width: "16%" }
    ];

    useEffect(() => {
        setLoading(true)

        const whereGeolocation = {
            ...((merchantId && { id: merchantId }) || {}),
            ...((geoType && { isMerchant: geoType }) || {}),
        };

        const filterGeolocation = {
            ...((whereGeolocation && { where: whereGeolocation }) || {}),
            ...{ order: "createdAt DESC" },
            ...{ limit: 10 },
            ...{ skip: (pageRequest - 1) * 10 },
        };

        axiosMerchant.get(`/locations`, {
            params: {
                filter: {
                    ...filterGeolocation
                }
            }
        })
            .then((res) => {
                setLoading(false)
                setData(res?.data)
            })
            .catch((error) => {
                setLoading(false)
            })

        axiosMerchant.get(`/locations/count`, {
            params: {
                where: {
                    ...whereGeolocation
                }
            }
        })
            .then((res) => {
                setCount(res?.data?.count)
            })
            .catch((error) => {

            })
    }, [pageRequest, merchantId, geoType])

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
                                                        display: column.id === "toggle" ? "none" : "flex",
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
                                                        height: "50vh",
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
                                                        key={index}
                                                        hover
                                                        role="checkbox"
                                                        tabIndex={-1}
                                                        sx={{
                                                            "& .MuiTableCell-root": {
                                                                border: "0px",
                                                                textAlign: "center",
                                                                padding: "3px",
                                                            },
                                                        }}
                                                        onClick={() => navigate(el?.isMerchant ? `/merchant-edit/${el?.merchantId}` : `/partner-profile/${el?.id}`)}
                                                    >
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

                                                        <TableCell title={el?.address || "-"}>
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
                                                                <span style={{ width: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                    {el?.address || "-"}
                                                                </span>
                                                            </span>
                                                        </TableCell>

                                                        <TableCell title={el?.address || "-"}>
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
                                                                <span style={{ width: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                    {el?.city || "-"}
                                                                </span>
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
                                                                {el?.geoPoint?.coordinates[0] === 0 && el?.geoPoint?.coordinates[1] === 0 ? "-" : el?.geoPoint?.coordinates[0]}
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
                                                                    color: "var(--color-dark-blue)"
                                                                }}
                                                            >
                                                                {el?.geoPoint?.coordinates[0] === 0 && el?.geoPoint?.coordinates[1] === 0 ? "-" : el?.geoPoint?.coordinates[1]}
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
                                                                {el?.isMerchant ? formatMessage({ id: "merchants.merchant" }) : formatMessage({ id: "merchants.partner" })}
                                                            </span>
                                                        </TableCell>

                                                        <TableCell>
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    justifyContent: "space-evenly",
                                                                    gap: "10px",
                                                                    alignItems: "center",
                                                                    width: "100%",
                                                                }}
                                                            >
                                                                <Tooltip title={formatMessage({ id: el?.isMerchant ? "merchants.edit" : "merchants.editpartner" })}>
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
                                                                        <img src="/icons/house2.svg" width={20} />
                                                                    </Box>
                                                                </Tooltip>
                                                                <Tooltip title={formatMessage({ id: "merchants.managemap" })}>
                                                                    <Box
                                                                        onClick={(e) => { el?.geoPoint?.coordinates[0] === 0 && el?.geoPoint?.coordinates[1] === 0 ? "" : navigate(`/manage-map/${el?.id}`); e.stopPropagation() }}
                                                                        id="manage-map"
                                                                        sx={{
                                                                            border: "1px solid black !important",
                                                                            padding: "5px 10px",
                                                                            borderRadius: "15px",
                                                                            display: 'flex',
                                                                            alignItems: "center",
                                                                            cursor: "pointer",
                                                                            opacity: el?.geoPoint?.coordinates[0] === 0 && el?.geoPoint?.coordinates[1] === 0 && 0.5
                                                                        }}>
                                                                        <img src="/icons/map.svg" width={20} />
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
                        onChange={(e, value) => setPageRequest(value)}
                        page={pageRequest}
                    />
                </div>
            }
        </TabContainer>
    )
}

export default GeolocationTable