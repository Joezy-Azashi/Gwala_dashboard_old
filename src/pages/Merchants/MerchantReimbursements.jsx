import React, { useEffect, useState } from 'react'
import SideContainer from '../../containers/SideContainer'
import { Box, Button, Container, Dialog, MenuItem, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import { useLocale } from '../../locales';
import { ContFilter, Field } from '../../components/employee/style';
import { useLocation, useParams } from 'react-router';
import styled from 'styled-components';
import { IOSSwitch } from '../../components/UI';
import PageSpinner from '../../components/pagespinner/PageSpinner';
import moment from 'moment';
import ReimbursementDetails from '../../components/Merchants/ReimbursementDetails';
import axiosMerchant from '../../api/merchantRequest';
import GenerateInvoice from '../../components/Merchants/GenerateInvoice';

const TabContainer = styled.div`
  tbody > tr {
    :hover * {
    //   background-color: #d9edff;
    //   cursor: pointer;
    }
  }
`;

const LeftSide = ({ location, loading, data, setData, page, setPage, count }) => {
  const { formatMessage } = useLocale();
  const [checkLoading, setCheckLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [processedLoading, setProcessedLoading] = useState(false)
  const [openDetail, setOpenDetail] = useState({ data: "", state: false })

  const columns = [
    { id: "amount", label: formatMessage({ id: "merchants.amount" }), width: "30%" },
    { id: "start", label: formatMessage({ id: "timetracker.startdate" }), width: "30%" },
    { id: "end", label: formatMessage({ id: "timetracker.enddate" }), width: "30%" },
    { id: "status", label: formatMessage({ id: "merchants.status" }), width: "30%" },
    { id: "actions", label: "Actions", width: "10%" },
  ];

  const changeStatus = (e, status, id) => {
    e.stopPropagation()

    setCheckLoading(status === "handling" && true)
    setCancelLoading(status === "cancelled" && true)
    setProcessedLoading(status === "processed" && true)

    axiosMerchant.patch(`/reimbursements/${id}`, { status: status })
      .then((res) => {
        setCheckLoading(false)
        setCancelLoading(false)
        setProcessedLoading(false)
        const nextData = data?.map(el => {
          if (el.id === id) {
            return { ...el, status: status }
          } else {
            return el
          }
        });
        setData(nextData);
        if (openDetail.state === true) {
          setOpenDetail({ data: nextData.filter((ft) => ft.id === id)[0], state: false })
        }
      })
      .catch((error) => {
        toast(error?.response?.data?.message, {
          position: "top-right",
          type: "error",
          theme: "colored",
        });
        setCheckLoading(false)
        setCancelLoading(false)
        setProcessedLoading(false)
      })
  }

  return (
    <Container maxWidth={"md"}>
      <Typography my={3.5} textAlign={"center"} variant='h5' color={"var(--color-dark-blue)"}>
        {formatMessage({ id: "merchants.reimbursements" })}: <span style={{ fontWeight: 600 }}>{location?.state?.name}</span>
      </Typography>

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
                              onClick={() => setOpenDetail({ data: el, state: true })}
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
                                  {el?.amount.toFixed(2).replace(/\.?0+$/, '')} MAD
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
                                  {el?.startDate ? moment(el?.startDate).format("DD/MM/YYYY") : ""}
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
                                  {el?.endDate ? moment(el?.endDate).format("DD/MM/YYYY") : ""}
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
                                    color: el?.status === "processed" ? "green" : el?.status === "cancelled" ? "#FA3E3E" : el?.status === "handling" ? "var(--color-dark-blue)" : ""
                                  }}
                                >
                                  {el?.status}
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

                                  <Button id="detail_btn" disableElevation variant='contained' sx={{ backgroundColor: "var(--color-cyan) !important", color: "var(--color-dark-blue)", textTransform: "capitalize", borderRadius: "18px" }}>
                                    {formatMessage({ id: "edoc.details" })}
                                  </Button>
                                  <Tooltip title={formatMessage({ id: "evoucher.handling" })}>
                                    <Box
                                      id="handling"
                                      onClick={(e) => { el?.status !== "pending" ? e.stopPropagation() : changeStatus(e, "handling", el?.id) }}
                                      sx={{
                                        backgroundColor: "var(--color-cyan)",
                                        padding: "5px 10px",
                                        borderRadius: "15px",
                                        display: 'flex',
                                        alignItems: "center",
                                        cursor: el?.status === "pending" ? "pointer" : "default",
                                        '&:hover': { backgroundColor: el?.status !== "pending" ? "" : "green" },
                                        opacity: el?.status !== "pending" ? 0.5 : ""
                                      }}>
                                      <img src="/icons/transaction/confirm.svg" width={15} />
                                    </Box>
                                  </Tooltip>
                                  <Tooltip title={formatMessage({ id: "evoucher.rejected" })}>
                                    <Box
                                      id="rejected"
                                      onClick={(e) => { el?.status === "cancelled" || el?.status === "processed" ? e.stopPropagation() : changeStatus(e, "cancelled", el?.id) }}
                                      sx={{
                                        border: "1px solid black !important",
                                        padding: "5px 10px",
                                        borderRadius: "15px",
                                        display: 'flex',
                                        alignItems: "center",
                                        cursor: el?.status === "cancelled" || el?.status === "processed" ? "default" : "pointer",
                                        '&:hover': { backgroundColor: el?.status === "cancelled" || el?.status === "processed" ? "" : "red" },
                                        opacity: el?.status === "cancelled" || el?.status === "processed" ? 0.5 : ""
                                      }}>
                                      <img src="/icons/transaction/cancel.svg" width={15} />
                                    </Box>
                                  </Tooltip>
                                </div>
                              </TableCell>

                              {el.status === "processed" || el.status === "handling" ?
                                <Tooltip title={formatMessage({ id: "evoucher.processed" })}>
                                  <TableCell>
                                    <IOSSwitch
                                      id="processed"
                                      sx={{ opacity: el.status === "processed" && 0.5 }}
                                      checked={el.status === "processed"}
                                      onClick={(e) => { el.status === "processed" || el.status === "cancelled" ? "" : changeStatus(e, "processed", el?.id) }}
                                    />

                                  </TableCell>
                                </Tooltip> : ""
                              }
                            </TableRow>
                          )
                        })
                    }
                  </TableBody>
                </>
              }
            </Table>
          </TableContainer>

          <Dialog
            open={openDetail.state}
            onClose={() => setOpenDetail({ state: false })}
            fullWidth
            maxWidth="md"
            sx={{ '& .MuiPaper-root': { borderRadius: "20px" } }}
          >
            <ReimbursementDetails
              openDetail={openDetail}
              setOpenDetail={setOpenDetail}
              changeStatus={changeStatus}
              checkLoading={checkLoading}
              cancelLoading={cancelLoading}
              processedLoading={processedLoading}
            />
          </Dialog>
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
const RightSide = ({ status, setStatus, setPage, sort, setSort }) => {
  const { formatMessage } = useLocale();
  const [openInvoice, setOpenInvoice] = useState(false)

  const clearFilter = () => {
    setStatus("")
    setPage(1)
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
          select
          id="request_status"
          sx={{
            "& .MuiOutlinedInput-root": {
              background: "#fff",
              borderRadius: "50px",
              backgroundColor: "var(--color-blue)",
              fontWeight: "600",
              color: "var(--color-dark-blue) !important",
              fontSize: "15px",
            },
            "& fieldset": { border: "none" },
            "& .MuiFormLabel-root": {
              color: "var(--color-dark-blue) !important",
              fontWeight: "600",
              fontSize: "15px",
              textTransform: "capitalize",
            },
          }}
          size="small"
          label={status?.length > 0 ? "" : formatMessage({ id: "advance.status" })}
          InputLabelProps={{ shrink: false }}
          fullWidth
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1) }}
        >
          <MenuItem value={"pending"}>{formatMessage({ id: "evoucher.pending" })}</MenuItem>
          <MenuItem value={"handling"}>{formatMessage({ id: "evoucher.handling" })}</MenuItem>
          <MenuItem value={"processed"}>{formatMessage({ id: "evoucher.processed" })}</MenuItem>
          <MenuItem value={"cancelled"}>{formatMessage({ id: "evoucher.cancelled" })}</MenuItem>
        </TextField>

        <Field onClick={() => { setSort(sort === 'ASC' ? 'DESC' : 'ASC'); setPage(1) }}>
          <span>Date</span>
          <img src="/icons/Employee/filter.svg" />
        </Field>

        <Button
          onClick={() => setOpenInvoice(true)}
          id="request-voucher"
          variant="contained"
          size="large"
          fullWidth
          disableElevation
          sx={{
            color: "var(--color-dark-blue)",
            backgroundColor: "transparent !important",
            borderRadius: "20px",
            textTransform: "capitalize",
            fontWeight: "600",
            border: "1px solid var(--color-dark-blue) !important"
          }}
        >
          {formatMessage({ id: "merchants.generateinvoice" })}
        </Button>
      </ContFilter>

      <Dialog
        open={openInvoice}
        onClose={() => setOpenInvoice(false)}
        fullWidth
        sx={{ "& .MuiDialog-paper": { borderRadius: "35px" } }}
        maxWidth={"md"}
      >
        <GenerateInvoice setOpenInvoice={setOpenInvoice} />
      </Dialog>
    </>
  )
}

function MerchantReimbursements() {
  const { id } = useParams()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(1)
  const [status, setStatus] = useState("")
  const [sort, setSort] = useState("DESC")
  const [sortType, setSortType] = useState("createdAt")

  const getHistory = () => {
    setLoading(true)

    const whereReimbursement = {
      ...((id && { merchantId: id }) || {}),
      ...((status && { status }) || {}),
    };
    const filterReimbursement = {
      ...((whereReimbursement && { where: whereReimbursement }) || {}),
      ...((sortType && { order: `${sortType} ${sort} ` }) || {}),
      ...{ limit: 10 },
      ...{ skip: (page - 1) * 10 },
    };

    axiosMerchant.get(`/reimbursements`, {
      params: {
        filter: {
          ...filterReimbursement
        }
      }
    })
      .then((res) => {
        setLoading(false)
        setData(res?.data?.docs)
        setCount(res?.data?.totalItems)
      })
      .catch((error) => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getHistory()
  }, [page, status, sort])

  return (
    <SideContainer
      LeftSideComponent={
        <LeftSide
          location={location}
          loading={loading}
          data={data}
          setData={setData}
          page={page}
          setPage={setPage}
          count={count}
        />
      }
      RightSideComponent={
        <RightSide
          status={status}
          setStatus={setStatus}
          setPage={setPage}
          sort={sort}
          setSort={setSort}
        />
      }
    />
  )
}

export default MerchantReimbursements