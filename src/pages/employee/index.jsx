import React, { useEffect, useState } from "react";
import { getEmployees, getCompanies } from "../../api";
import { ContFilter, Field } from "../../components/employee/style";
import styled from "styled-components";
import Container from "../../containers/SideContainer";
import { useLocation, useNavigate } from "react-router";
import { useLocale } from "../../locales";
import { sortArrayAlphabetically } from "../../utils";
import { useSelector } from "react-redux";
import { FieldB } from "../employee/style";
import AddEmployeesViaExcel from "../../components/AddEmployeesViaExcel";
import {
  TableContainer,
  Box,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import PageSpinner from "../../components/pagespinner/PageSpinner";
import Pagination from "@mui/material/Pagination";

const TabContainer = styled.div`
  tbody > tr {
    :hover * {
      background-color: #d9edff;
      cursor: pointer;
    }
  }
`;

const LeftSide = ({ employees, fetchData, loading, page, role, selectedUserState }) => {
  const navigate = useNavigate();
  const { formatMessage } = useLocale();

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
                    <TableCell>
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
                    <TableCell style={{ display: selectedUserState?.manages?.length < 1 ? "none" : "" }}>
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
                        {role === "Admin" ? formatMessage({ id: "employee.company" }) : formatMessage({ id: "employer.branch" })}
                      </span>
                    </TableCell>
                    <TableCell>
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
                        {formatMessage({ id: "settings.phone" })}
                      </span>
                    </TableCell>
                    <TableCell>
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
                    {role === "Admin" ?
                      <TableCell>
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
                          {formatMessage({ id: "company.products" })}
                        </span>
                      </TableCell>
                      : ""}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5}>
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
                  ) : employees?.docs?.length < 1 ? (
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
                    </TableRow>
                  ) : (
                    employees?.docs?.map((el, key) => {
                      if (!el.company) return;
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
                          // onClick={() =>
                          //   navigate(`/timetracker/${el._id}`, {
                          //     state: { name: el.firstName },
                          //   })
                          // }
                          onClick={() => {
                            role === "Admin" ? navigate(`/employee-edit/${el._id}`) : navigate(`/employee/${el._id}`, {
                              state: { name: el.firstName },
                            })
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
                              {el.firstName} {el.lastName}
                            </span>
                          </TableCell>

                          <TableCell sx={{ display: selectedUserState?.manages?.length < 1 ? "none" : "" }}>
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
                              {el?.company?.name}
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
                              {el?.phone?.number}
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
                                textTransform: "lowercase",
                                width: "100%",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                              }}
                            >
                              {el.email || "-"}
                            </span>
                          </TableCell>

                          {role === "Admin" ?
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
                                {el?.company?.features?.length < 1 ? "-" : el?.company?.features?.map((item, index) => {
                                  return (
                                    <span key={index}>
                                      {item === "DEFAULT" ? <><img src={"/icons/Navbar/advance.svg"} width="15" style={{ marginBottom: "-3px" }} /> {formatMessage({ id: "company.advances" })}</> :
                                        item === "EVOUCHERS" ? <><img src={"/icons/Navbar/percent.svg"} width="18" style={{ marginBottom: "-3px" }} /> {formatMessage({ id: "nav.evoucher" })}</> :
                                          el?.company?.features?.length === 1 && item === "TIME_TRACKER" ? "-" :
                                          item === "TIME_TRACKER" ? "" :
                                            item === "ALL" ? <><img src={"/icons/Navbar/advance.svg"} width="15" /> {formatMessage({ id: "company.advances" })}, <img src={"/icons/Navbar/percent.svg"} width="18" style={{ marginBottom: "-3px" }} /> {formatMessage({ id: "nav.evoucher" })}, </> :
                                              item}
                                    </span>
                                  )
                                })}
                              </span>
                            </TableCell> : ""}
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
      {employees?.totalPages > 1 && (
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
            count={employees?.totalPages || 1}
            variant="outlined"
            shape="rounded"
            onChange={(e, value) => fetchData(value)}
            page={page}
          />
        </div>
      )}
    </TabContainer>
  );
};

const RightSide = ({
  employees,
  setEmployee,
  filter,
  setFilter,
  companies,
  branches,
  companyName,
  setCompanyName,
  role,
  feature,
  setFeature,
  order,
  setOrder
}) => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate()
  const selectedUserState = useSelector((state) => state.userInfos);
  /* user state doesnt have role = manager or role = normal property so this is a workaround */
  const isNormalEmployer =
    Array.isArray(selectedUserState?.manages) &&
    selectedUserState.manages.length === 0;

  const clearFilter = () => {
    setOrder(-1);
    setFilter({ statu: "", company: "" });
    setCompanyName("");
    setFeature("")
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
      {companies != undefined && role === "Admin" && (
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
          {companies?.map((company, key) => (
            <MenuItem
              onClick={() => {
                setFilter({ ...filter, company: company._id });
                setCompanyName(company?.name);
              }}
              key={key}
            >
              <span style={{ textTransform: "capitalize" }}>
                {company?.name}
              </span>
            </MenuItem>
          ))}
        </TextField>
      )}

      {branches != [] && !isNormalEmployer && role !== "Admin" && (
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
                setCompanyName(branch?.name);
              }}
              key={key}
            >
              <span style={{ textTransform: "capitalize" }}>{branch?.name}</span>
            </MenuItem>
          ))}
        </TextField>
      )}

      <Field onClick={() => setOrder(-order)}>
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
            ? formatMessage({ id: "filter.status.account" })
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

      {/* {role === "Admin" ?
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
          <MenuItem onClick={() => setFeature(["ALL"])}>
            {formatMessage({ id: "filter.evoucher.all" })}
          </MenuItem>
          <MenuItem onClick={() => setFeature(["DEFAULT"])}>
            {formatMessage({ id: "company.advances" })}
          </MenuItem>
          <MenuItem onClick={() => setFeature(["EVOUCHERS"])}>
            {formatMessage({ id: "nav.evoucher" })}
          </MenuItem>
        </TextField> : ""} */}

      <hr
        style={{
          border: "1px solid",
          width: "100%",
        }}
      />
      <span
        style={{ textDecoration: "none", color: "var(--color-dark-blue)" }}
        onClick={() => navigate(`/employee/add?company_id=${filter.company}`, { state: { id: filter?.company } })}
      >
        <FieldB>{formatMessage({ id: "filter.addemployee" })}</FieldB>
      </span>
      <AddEmployeesViaExcel />
      {role === "Admin" &&
        <a
          style={{ textDecoration: "none", color: "var(--color-dark-blue)" }}
          href={'update-employee-balance'}
        >
          <FieldB>{formatMessage({ id: "employee.updatebtn" })}</FieldB>
        </a>
      }
    </ContFilter>
  );
};
const Employee = () => {
  const [employees, setEmployee] = useState([]);
  const [filterPage, setPage] = useState(1);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feature, setFeature] = useState("");
  const [order, setOrder] = useState(1);
  const location = useLocation();
  const [companyName, setCompanyName] = useState(
    location?.state?.formData ? location?.state?.formData?.name : ""
  );
  const [filter, setFilter] = useState({
    statu: "",
    company: location?.state?.formData ? location?.state?.formData?._id : "",
  });
  // const role = useSelector((state) => state.userInfos.role);
  const role = localStorage.getItem("role");
  const selectedUserState = useSelector((state) => state.userInfos);

  const companies = getCompanies(1, 10, role === "Admin");

  useEffect(() => {
    if (selectedUserState?.manages) {
      setBranches(selectedUserState.manages);
    }
  }, [selectedUserState]);

  const fetchData = async () => {
    setLoading(true);
    const { statu, company } = filter;
    const filterUrl =
      statu === true
        ? "isEnabled=true&"
        : statu === false
          ? "isEnabled=false&"
          : "";
    let query = `${filterUrl}`;
    if (company) query += `companyId=${company}`;
    const data = await getEmployees(filterPage, 10, query, feature, order);
    setEmployee(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [filterPage, filter, order]);

  return (
    <Container
      RightSideComponent={
        <RightSide
          employees={employees}
          setEmployee={setEmployee}
          setFilter={setFilter}
          filter={filter}
          companies={companies?.data}
          branches={branches}
          companyName={companyName}
          setCompanyName={setCompanyName}
          role={role}
          feature={feature}
          setFeature={setFeature}
          order={order}
          setOrder={setOrder}
        />
      }
      LeftSideComponent={
        <LeftSide
          employees={employees}
          loading={loading}
          fetchData={setPage}
          page={filterPage}
          role={role}
          selectedUserState={selectedUserState}
        />
      }
    />
  );
};

export default Employee;
