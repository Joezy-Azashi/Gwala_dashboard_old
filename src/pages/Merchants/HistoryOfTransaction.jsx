import React, { useEffect, useState } from 'react'
import SideContainer from '../../containers/SideContainer'
import { Box, Container, Grid, InputAdornment, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { useLocale } from '../../locales';
import { ContFilter, Field } from '../../components/employee/style';
import { useLocation, useParams } from 'react-router';
import { Search } from '@mui/icons-material';
import styled from 'styled-components';
import axios from 'axios';
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

const LeftSide = ({ data, loading, location, page, setPage, count }) => {
  const { formatMessage } = useLocale();

  const columns = [
    { id: "service", label: formatMessage({ id: "merchants.transref" }), width: "10%" },
    { id: "sales", label: "Date", width: "10%" },
    { id: "status", label: formatMessage({ id: "merchants.beneficiary" }), width: "5%" },
    { id: "action", label: formatMessage({ id: "merchants.amount" }), width: "16%" },
  ];

  return (
    <Container maxWidth={"lg"}>
      <Typography my={3.5} textAlign={"center"} variant='h5' color={"var(--color-dark-blue)"}>{formatMessage({ id: "merchants.transactionhistory" })}: <span style={{ fontWeight: 600 }}>{location?.state?.name}</span></Typography>

      <TabContainer>
        <Box sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer
            sx={{
              overflowX: "hidden",
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
                        <TableCell colSpan={8}>
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
                          <TableCell colSpan={8}>
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
                                  {el?.amount.toFixed(2).replace(/\.?0+$/, '')} MAD
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
    </Container>
  )
}
const RightSide = ({ setPage, getHistory, setLoading, refId, setRefId, min, setMin, max, setMax, sort, setSort, setSortBy }) => {
  const { formatMessage } = useLocale();
  const [timeoutMulti, setTimeoutMulti] = useState(null)

  const clearFilter = () => {
    setPage(1)
    setRefId("")
    setMin("")
    setMax("")
    setSort(-1)
    setSortBy("createdAt")
    getHistory("", "", "")
  }

  const handleSearchChange = (e) => {
    try {
      clearTimeout(timeoutMulti)
    }
    catch {

    }
    setRefId(e.target.value)
    setMin("")
    setMax("")
    setLoading(true)
    setTimeoutMulti(setTimeout(() => {
      setPage(1)
      getHistory(e.target.value)
    }, 1500))
  }

  const handleAmountChange = (e, type) => {
    if (type === 'min') {
      setMin(e.target.value)
    } else {
      setMax(e.target.value)
    }

    try {
      clearTimeout(timeoutMulti)
    }
    catch {

    }
    setRefId("")
    setLoading(true)
    setTimeoutMulti(setTimeout(() => {
      getHistory("", type === 'min' ? e.target.value : min, type !== 'min' ? e.target.value : max)
      setPage(1)
    }, 1500))
  }

  return (
    <>
      <ContFilter>
        <Typography
          variant="body2"
          sx={{
            textDecoration: "underline",
            cursor: "pointer",
            fontWeight: "bold",
            textAlign: "center",
          }}
          onClick={() => clearFilter()}
        >
          {formatMessage({ id: "employee.clearfilter" })}
        </Typography>

        <TextField
          size="small"
          variant="outlined"
          value={refId}
          onChange={(e) => handleSearchChange(e)}
          sx={{
            "& .MuiOutlinedInput-root": {
              background: "#fff",
              borderRadius: "50px",
              backgroundColor: "var(--color-blue)",
            },
            "& fieldset": { border: "none" },
            "& .MuiFormLabel-root": {
              color: "var(--color-dark-blue) !important",
              fontWeight: "600",
              fontSize: "15px",
              textTransform: "capitalize",
            },
          }}
          placeholder={formatMessage({ id: "merchants.transref" })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <div
          style={{
            background: "var(--color-blue)",
            height: "100px",
            borderRadius: 20,
            padding: "13px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{formatMessage({ id: "merchants.amount" })} (MAD)</span>
              <img src="/icons/Employee/filter.svg" />
            </div>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  size="small"
                  onKeyDown={(e) => {
                    if (e.keyCode === 38 || e.keyCode === 40) {
                      e.preventDefault();
                    }
                  }}
                  onWheel={(e) => e.target.blur()}
                  label={formatMessage({ id: "advance.min" })}
                  value={min}
                  onChange={(e) => handleAmountChange(e, "min")}
                  fullWidth
                  margin="dense"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  size="small"
                  onKeyDown={(e) => {
                    if (e.keyCode === 38 || e.keyCode === 40) {
                      e.preventDefault();
                    }
                  }}
                  onWheel={(e) => e.target.blur()}
                  value={max}
                  onChange={(e) => handleAmountChange(e, "max")}
                  label={formatMessage({ id: "advance.max" })}
                  fullWidth
                  margin="dense"
                />
              </Grid>
            </Grid>
          </div>
        </div>

        <Field onClick={() => { setSort(-sort); setSortBy('amount'); setPage(1) }}>
          <span>{formatMessage({ id: "merchants.amountsort" })}</span>
          <img src="/icons/Employee/filter.svg" />
        </Field>

        <Field onClick={() => { setSort(-sort); setSortBy('createdAt'); setPage(1) }}>
          <span>Date</span>
          <img src="/icons/Employee/filter.svg" />
        </Field>
      </ContFilter>
    </>
  )
}

function HistoryOfTransaction() {
  const { id } = useParams()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(1)
  const [refId, setRefId] = useState("")
  const [min, setMin] = useState("")
  const [max, setMax] = useState("")
  const [sort, setSort] = useState(-1)
  const [sortBy, setSortBy] = useState("createdAt")

  const getHistory = (refId, min, max) => {
    setLoading(true)
    const url = `${import.meta.env.VITE_BASE_URL}/`
    const token = localStorage.getItem("token");

    axios.get(`${url}v2/vouchers/transactions?merchantId=${id}&referenceId=${!refId ? "" : refId}&page=${page}&amountMin=${!min ? "" : min}&amountMax=${!max ? "" : max}&sort=${sort}&sortBy=${sortBy}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((res) => {
        setLoading(false)
        setData(res?.data?.data?.docs)
        setCount(res?.data?.data?.totalDocs)
      })
      .catch((error) => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getHistory(refId, min, max)
  }, [page, sort, sortBy])

  return (
    <SideContainer
      LeftSideComponent={
        <LeftSide
          data={data}
          loading={loading}
          location={location}
          page={page}
          setPage={setPage}
          count={count}
        />
      }
      RightSideComponent={
        <RightSide
          setPage={setPage}
          getHistory={getHistory}
          setLoading={setLoading}
          refId={refId}
          setRefId={setRefId}
          min={min}
          setMin={setMin}
          max={max}
          setMax={setMax}
          sort={sort}
          setSort={setSort}
          setSortBy={setSortBy}
        />
      }
    />
  )
}

export default HistoryOfTransaction