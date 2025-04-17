import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { fetchCompanies } from "../../api";
import { useLocale } from "../../locales";
import { ContFilter, Field } from "../../components/employee/style";
import { useNavigate } from "react-router";
import SideContainer from "../../containers/SideContainer";
import { TextField, MenuItem, Tooltip, InputAdornment } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { sortArrayAlphabetically } from "../../utils";
import {
  TableContainer,
  Box,
  Typography,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import PageSpinner from "../../components/pagespinner/PageSpinner";
import { Close, Search } from "@mui/icons-material";

const Container = styled.div`
  tbody > tr {
    :hover * {
      background-color: #d9edff;
      cursor: pointer;
    }
  }
`;
const FieldB = styled(Field)`
  justify-content: center;
`;

const LeftSide = ({ data, loading, fetchData, page }) => {
  const navigate = useNavigate();
  const { formatMessage } = useLocale();

  const columns = [
    { id: "icon", label: "", width: "" },
    { id: "name", label: formatMessage({ id: "advance.companyname" }), width: "" },
    // { id: "salary", label: formatMessage({ id: "company.salaryday" }), width: "3%" },
    { id: "phone", label: formatMessage({ id: "company.phonenumber" }), width: "" },
    { id: "address", label: formatMessage({ id: "company.address" }), width: "" },
    { id: "features", label: formatMessage({ id: "company.products" }), width: "" },
  ];

  return (
    <Container>
      <Box sx={{ width: "100%", overflow: "hidden", display: "flex" }}>
        <TableContainer
          sx={{
            // height: "68vh",
            // overflowX: "scroll",
            "&::-webkit-scrollbar": {
              width: 0,
            },
          }}
        >
          {/* <InfiniteScroll
            dataLength={data?.length}
            next={fetchData}
            style={{ width: "100%" }}
            height={"550px"}
          > */}
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
                      "& .MuiTableRow-root": { display: "none" },
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
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
                  {loading ? (
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
                    </TableRow>
                  ) : data?.docs?.length < 1 ? (
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
                          {formatMessage({ id: "company.norecords" })}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.docs?.map((el, key) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={key}
                          sx={{
                            "& .MuiTableCell-root": {
                              border: "0px",
                              textAlign: "center",
                              padding: "3px",
                            },
                          }}
                          onClick={() => navigate(`/company/edit/${el._id}`)}
                        >
                          <TableCell>
                            <span
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: ".45rem",
                                whiteSpace: "nowrap",
                                textTransform: "capitalize",
                              }}
                            >
                              <img src="/icons/Navbar/company.svg" />
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
                              {el.name}
                            </span>
                          </TableCell>

                          {/* <TableCell>
                            <span
                              style={{
                                display: "block",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: ".45rem",
                                backgroundColor: "#F7F0F0",
                                whiteSpace: "nowrap",
                                textTransform: "capitalize",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                              }}
                            >
                              {el.salaryDay}
                            </span>
                          </TableCell> */}

                          <TableCell>
                            <span
                              style={{
                                display: "block",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: ".45rem",
                                backgroundColor: "#F7F0F0",
                                whiteSpace: "nowrap",
                                textTransform: "capitalize",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                              }}
                            >
                              {/* {el?.monetizationMethod === "FEES_PER_ADVANCE"
                                ? formatMessage({
                                  id: "company.fees_per_advance",
                                })
                                : formatMessage({
                                  id: "company.payed_by_company",
                                })} */}
                              {el?.phone || "-"}
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
                              {/* {el.isAdvanceEnabled
                                ? formatMessage({ id: "company.activated" })
                                : formatMessage({
                                  id: "company.notactivated",
                                })} */}
                              {el?.address || "-"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              style={{
                                display: "block",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: ".45rem",
                                backgroundColor: "#F7F0F0",
                                textTransform: "capitalize",
                                whiteSpace: "nowrap"
                              }}
                            >
                              {el?.features?.length < 1 ? "-" : el?.features?.map((item, index) => {
                                return (
                                  <span key={index}>
                                    {item === "DEFAULT" || item === "ADVANCES" ? <> <img src={"/icons/Navbar/advance.svg"} width="15" style={{ marginBottom: "-3px" }} /> {formatMessage({ id: "company.advances" })} </> :
                                      item === "EVOUCHERS" ? <><img src={"/icons/Navbar/percent.svg"} width="18" style={{ marginBottom: "-3px" }} /> {formatMessage({ id: "nav.evoucher" })} </> :
                                        item === "TIME_TRACKER" ? "" :
                                          item === "EDOCUMENTS" ? <><img src={"/icons/Navbar/document.svg"} width={18} style={{ marginBottom: "-3px" }} /> E-Documents </> :
                                          item === "EXPENSES" ? <><img src={"/icons/Navbar/reimbursements.svg"} width={18} style={{ marginBottom: "-3px" }} /> Expenses </> :
                                            item === "ALL" ? <> <img src={"/icons/Navbar/advance.svg"} width="15" /> {formatMessage({ id: "company.advances" })}, <img src={"/icons/Navbar/percent.svg"} width="18" style={{ marginBottom: "-3px" }} /> {formatMessage({ id: "nav.evoucher" })}</> :
                                              item}
                                  </span>
                                )
                              })}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </>
            }
          </Table>
          {/* </InfiniteScroll> */}
        </TableContainer>
      </Box>
      {data?.totalPages > 1 && (
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
            count={data?.totalPages || 1}
            variant="outlined"
            shape="rounded"
            onChange={(e, value) => fetchData(value)}
            page={page}
          />
        </div>
      )}
    </Container>
  );
};
const RightSide = ({ companies, setCompanies, type, setType, feature, setFeature, searchTerm, setSearchTerm, handleSearchChange, fetchData }) => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate()
  const [sortOrder, setOrder] = useState(1);
  const triAlpha = () => {
    const newArray = sortArrayAlphabetically({
      arr: companies?.docs,
      key: "name",
      order: sortOrder,
    });
    setCompanies({ ...companies, docs: [...newArray] });
    setOrder(-sortOrder);
  };

  const clearFilter = () => {
    setType("");
    setFeature(localStorage.getItem("superAdminManage") === "ADVANCEADMIN" ? ["ALL", "DEFAULT"] : "")
    setSearchTerm("")
    fetchData("")
  };

  return (
    <ContFilter>
      <Typography
        variant="body2"
        sx={{
          textDecoration: "underline",
          cursor: "pointer",
          fontWeight: "bold",
          textAlign: "center",
        }}
        onClick={clearFilter}
      >
        {formatMessage({ id: "employee.clearfilter" })}
      </Typography>

      <TextField
        size="small"
        variant="outlined"
        value={searchTerm}
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
        placeholder={formatMessage({ id: "nav.search" })}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: (
            searchTerm?.length > 0 &&
            <InputAdornment position="start" onClick={() => { fetchData(); setSearchTerm("") }} sx={{ cursor: "pointer" }}>
              <Close />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        select
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
        size="small"
        label={
          type === ""
            ? formatMessage({ id: "company.adstatus" })
            : type
              ? formatMessage({ id: "company.activated" })
              : formatMessage({ id: "company.notactivated" })
        }
        InputLabelProps={{ shrink: false }}
        fullWidth
      >
        <MenuItem onClick={() => setType(true)}>
          {formatMessage({ id: "company.activated" })}
        </MenuItem>
        <MenuItem onClick={() => setType(false)}>
          {formatMessage({ id: "company.notactivated" })}
        </MenuItem>
      </TextField>

      <Field onClick={triAlpha}>
        <span>{formatMessage({ id: "filter.sortAlpha" })}</span>
        <img src="/icons/Employee/filter.svg" />
      </Field>
      <TextField
        select
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
        size="small"
        label={
          feature === ""
            ? formatMessage({ id: "company.products" })
            : feature.includes("ALL") ? formatMessage({ id: "filter.evoucher.all" }) :
              feature.includes("DEFAULT") ? formatMessage({ id: "company.advances" }) :
                formatMessage({ id: "nav.evoucher" })
        }
        InputLabelProps={{ shrink: false }}
        fullWidth
      >
        {
          localStorage.getItem("superAdminManage") === "ADVANCEADMIN" ? "" :
            <MenuItem onClick={() => setFeature(["ALL"])}>
              {formatMessage({ id: "filter.evoucher.all" })}
            </MenuItem>
        }
        <MenuItem onClick={() => setFeature(["DEFAULT"])}>
          {formatMessage({ id: "company.advances" })}
        </MenuItem>
        {
          localStorage.getItem("superAdminManage") === "ADVANCEADMIN" ? "" :
            <MenuItem onClick={() => setFeature(["EVOUCHERS"])}>
              {formatMessage({ id: "nav.evoucher" })}
            </MenuItem>
        }
      </TextField>
      <hr
        style={{
          border: "1px solid",
          width: "100%",
        }}
      />
      <span onClick={() => navigate("/company/add")} style={{ textDecoration: "none", color: "var(--color-dark-blue)" }}>
        <FieldB>{formatMessage({ id: "company.add" })}</FieldB>
      </span>
    </ContFilter>
  );
};
const Company = () => {
  const [filterPage, setPage] = useState(1);
  const [companies, setCompanies] = useState([]);
  const [type, setType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [feature, setFeature] = useState(localStorage.getItem("superAdminManage") === "ADVANCEADMIN" ? ["ALL", "DEFAULT"] : "");
  const [loading, setLoading] = useState(false);
  const [timeoutMulti, setTimeoutMulti] = useState(null)

  const fetchData = async (text) => {
    setLoading(true);
    const query = `isAdvanceEnabled=${type}&searchQuery=${text || ""}`;
    if (filterPage > 0) {
      const data = await fetchCompanies(filterPage, 10, query, feature);
      setCompanies(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterPage]);
  useEffect(() => {
    if (filterPage === 1) fetchData();
    else setPage(1);
  }, [type, feature]);

  const handleSearchChange = (e) => {
    try {
      clearTimeout(timeoutMulti)
    }
    catch {

    }
    setSearchTerm(e.target.value)
    setLoading(true)
    setPage(1)
    setTimeoutMulti(setTimeout(() => {
      fetchData(e.target.value)
    }, 1500))
  }

  return (
    <SideContainer
      LeftSideComponent={
        <LeftSide
          data={companies}
          loading={loading}
          fetchData={setPage}
          page={filterPage}
        />
      }
      RightSideComponent={
        <RightSide
          type={type}
          setType={setType}
          companies={companies}
          setCompanies={setCompanies}
          feature={feature}
          setFeature={setFeature}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearchChange={handleSearchChange}
          fetchData={fetchData}
        />
      }
    />
  );
};
export default Company;
