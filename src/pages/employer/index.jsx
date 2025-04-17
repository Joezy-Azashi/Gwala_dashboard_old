import React, { useState, useEffect } from "react";
import { getCompanies, getEmployers } from "../../api";
import styled from "styled-components";
import { ContFilter, Field } from "../../components/employee/style";
import { useLocation, useNavigate } from "react-router";
import { useLocale } from "../../locales";
import Container from "../../containers/SideContainer";
import { sortArrayAlphabetically } from "../../utils";
import { useSelector } from "react-redux";
import { FieldB } from "./style";
import Pagination from "@mui/material/Pagination";
import {
  TableContainer,
  Box,
  Typography,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  TextField,
  MenuItem,
  Tooltip,
} from "@mui/material";
import PageSpinner from "../../components/pagespinner/PageSpinner";

const TabContainer = styled.div`
  tbody > tr {
    :hover * {
      background-color: #d9edff;
      cursor: pointer;
    }
  }
`;

const LeftSide = ({ employers, fetchData, loading, page, selectedUserState }) => {
  const navigate = useNavigate();
  const { formatMessage } = useLocale();
  const role = localStorage.getItem("role");

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
                    <TableCell style={{ width: 100 }}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bolder",
                          padding: ".5rem",
                          whiteSpace: "nowrap",
                          backgroundColor: "#D9EDFF",
                        }}
                      >
                        {formatMessage({ id: "employee.name" })}
                      </span>
                    </TableCell>
                    <TableCell sx={{ width: 70, display: selectedUserState?.manages?.length < 1 ? "none" : "" }}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bolder",
                          padding: ".5rem",
                          whiteSpace: "nowrap",
                          backgroundColor: "#D9EDFF",
                        }}
                      >
                        {role === "Admin" ? formatMessage({ id: "employee.company" }) : formatMessage({ id: "filter.branch" })}
                      </span>
                    </TableCell>
                    <TableCell style={{ width: 70 }}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bolder",
                          padding: ".5rem",
                          whiteSpace: "nowrap",
                          backgroundColor: "#D9EDFF",
                        }}
                      >
                        {formatMessage({ id: "employer.role" })}
                      </span>
                    </TableCell>
                    <TableCell style={{ width: 70 }}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bolder",
                          padding: ".5rem",
                          whiteSpace: "nowrap",
                          backgroundColor: "#D9EDFF",
                        }}
                      >
                        {formatMessage({ id: "employee.mail" })}
                      </span>
                    </TableCell>
                    <TableCell style={{ width: 70 }}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bolder",
                          padding: ".5rem",
                          whiteSpace: "nowrap",
                          backgroundColor: "#D9EDFF",
                        }}
                      >
                        {formatMessage({ id: "employee.status" })}
                      </span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableCell colSpan={4}>
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
                  ) : employers.docs?.length < 1 ? (
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
                  ) : (
                    employers.docs?.map((el, key) => {
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
                          onClick={() => {
                            navigate(`/employer/edit/${el._id}`);
                          }}
                        >
                          <TableCell>
                            <span
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: ".5rem",
                                backgroundColor: "#F7F0F0",
                                whiteSpace: "nowrap",
                                textTransform: "capitalize",
                              }}
                            >
                              <span style={{ width: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", background: "transparent" }}>{el.firstName} {el.lastName}</span>
                            </span>
                          </TableCell>

                          <TableCell sx={{ display: selectedUserState?.manages?.length < 1 ? "none" : "" }}>
                            <span
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: ".5rem",
                                backgroundColor: "#F7F0F0",
                                whiteSpace: "nowrap",
                                textTransform: "capitalize",
                              }}
                            >
                              <span style={{ width: "120px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", backgroundColor: "#F7F0F0" }}>
                                {el.company?.name ? el.company?.name : el?.manages[0]?.name ? el?.manages[0]?.name : "-"}
                              </span>
                              {el?.manages?.length > 1 ? (
                                <Tooltip
                                  title={<Box sx={{ display: "flex", gap: .5, flexWrap: "wrap" }}>{el?.manages?.map((item, index) => {
                                    return <div key={index}>{item?.name},</div>
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
                                    +{el?.manages?.length - 1}
                                  </span>
                                </Tooltip>
                              ) : (
                                ""
                              )}
                            </span>
                          </TableCell>

                          <TableCell>
                            <span
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: ".5rem",
                                backgroundColor: "#F7F0F0",
                                whiteSpace: "nowrap",
                                textTransform: "capitalize",
                              }}
                            >
                              {el?.role === "NORMAL" ? formatMessage({ id: "employer.normal" }) : formatMessage({ id: "employer.manager" })}
                            </span>
                          </TableCell>

                          <TableCell>
                            <span
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: ".5rem",
                                backgroundColor: "#F7F0F0",
                                whiteSpace: "nowrap",
                                textTransform: "lowercase",
                              }}
                            >
                              {el.email}
                            </span>
                          </TableCell>

                          <TableCell sx={{ textAlign: "center" }}>
                            <span
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: ".5rem",
                                backgroundColor: "#F7F0F0",
                                whiteSpace: "nowrap",
                                textTransform: "capitalize",
                              }}
                            >
                              {el.isEnabled
                                ? formatMessage({ id: "employee.active" })
                                : formatMessage({ id: "employee.notActive" })}
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
        </TableContainer>
      </Box>
      {
        employers?.totalPages > 1 && (
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
              count={employers?.totalPages || 1}
              variant="outlined"
              shape="rounded"
              onChange={(e, value) => fetchData(value)}
              page={page}
            />
          </div>
        )
      }
    </TabContainer >
  );
};
const RightSide = ({
  employers,
  setEmployer,
  filter,
  setFilter,
  companies,
  role,
  companyName,
  setCompanyName,
  isNormalEmployer,
  branches
}) => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate()
  const [sortOrder, setOrder] = useState(1);
  const triAlpha = () => {
    const newArray = sortArrayAlphabetically({
      arr: employers?.docs,
      order: sortOrder,
    });
    setEmployer({ ...employers, docs: [...newArray] });
    setOrder(-sortOrder);
  };

  const clearFilter = () => {
    setFilter({
      statu: "",
      company: "",
    });
    setCompanyName("");
    setOrder(1);
    window.history.replaceState({}, document.title)
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
      {companies?.data != undefined && role === "Admin" && (
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
            companyName?.length > 0
              ? companyName
              : formatMessage({ id: "filter.company" })
          }
          InputLabelProps={{ shrink: false }}
          fullWidth
        >
          {companies.data?.map((company, key) => (
            <MenuItem
              onClick={() => {
                setFilter({ ...filter, company: company._id });
                setCompanyName(company?.name);
              }}
              key={key}
            >
              <span style={{ textTransform: "capitalize" }}>
                {company.name}
              </span>
            </MenuItem>
          ))}
        </TextField>
      )}

      {(branches != [] && !isNormalEmployer && role !== "Admin") && (
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
            companyName?.length > 0
              ? companyName
              : formatMessage({ id: "filter.branch" })
          }
          InputLabelProps={{ shrink: false }}
          fullWidth
        >
          {branches?.map((branch, key) => (
            <MenuItem
              onClick={() => {
                setFilter({ ...filter, company: branch._id });
                setCompanyName(branch.name);
              }}
              key={key}
            >
              <span style={{ textTransform: "capitalize" }}>
                {branch.name}
              </span>
            </MenuItem>
          ))}
        </TextField>
      )}

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
          filter?.statu === ""
            ? formatMessage({ id: "filter.status" })
            : filter?.statu
              ? formatMessage({ id: "employee.active" })
              : formatMessage({ id: "employee.notActive" })
        }
        InputLabelProps={{ shrink: false }}
        fullWidth
      >
        <MenuItem onClick={() => setFilter({ ...filter, statu: true })}>
          {formatMessage({ id: "employee.active" })}
        </MenuItem>
        <MenuItem onClick={() => setFilter({ ...filter, statu: false })}>
          {formatMessage({ id: "employee.notActive" })}
        </MenuItem>
      </TextField>
      <hr
        style={{
          border: "1px solid",
          width: "100%",
        }}
      />
      {(
        <>
          <span onClick={() => navigate(`/employer/add?company_id=${filter?.company || ""}`)}
            style={{ textDecoration: "none", color: "var(--color-dark-blue)" }}
          >
            <FieldB>{formatMessage({ id: "filter.addemployer" })}</FieldB>
          </span>

          {/* <FieldB>{formatMessage({ id: "filter.addExcel" })}</FieldB> */}
        </>
      )}
    </ContFilter>
  );
};

const Employer = () => {
  const location = useLocation();
  const [companyName, setCompanyName] = useState(
    location?.state?.formData ? location?.state?.formData?.name : ""
  );
  // const role = useSelector((state) => state.userInfos.role);
  const role = localStorage.getItem("role");
  const selectedUserState = useSelector((state) => state.userInfos);
  const [branches, setBranches] = useState([]);
  const isNormalEmployer = Array.isArray(selectedUserState?.manages) && selectedUserState.manages.length === 0
  const [employers, setEmployer] = useState([]);
  const [filterPage, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    statu: "",
    company: location?.state?.formData ? location?.state?.formData?._id : "",
  });
  const companies = getCompanies(1, 10, role === "Admin" || !isNormalEmployer);

  const fetchData = async () => {
    if (filterPage > 0) {
      setLoading(true);
      const { statu, company } = filter;
      let filterUrl = company ? `company=${company}&` : "";
      filterUrl += statu !== "" ? `isEnabled=${String(statu)}` : "";
      const data = await getEmployers(filterPage, 10, filterUrl);
      setEmployer(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUserState?.manages) {
      setBranches(selectedUserState.manages)
    }
  }, [selectedUserState]);

  useEffect(() => {
    fetchData();
  }, [filterPage]);
  useEffect(() => {
    if (filterPage === 1) fetchData();
    else setPage(1);
  }, [filter]);
  return (
    <Container
      RightSideComponent={
        <RightSide
          employers={employers}
          setEmployer={setEmployer}
          filter={filter}
          setFilter={setFilter}
          companies={companies}
          branches={branches}
          role={role}
          location={location}
          companyName={companyName}
          setCompanyName={setCompanyName}
          isNormalEmployer={isNormalEmployer}
        />
      }
      LeftSideComponent={
        <LeftSide
          employers={employers}
          loading={loading}
          fetchData={setPage}
          page={filterPage}
          selectedUserState={selectedUserState}
        />
      }
    />
  );
};
export default Employer;
