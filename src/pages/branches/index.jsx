import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocale } from "../../locales";
import { ContFilter, Field } from "../../components/employee/style";
import { useNavigate } from "react-router";
import SideContainer from "../../containers/SideContainer";
import { TextField, MenuItem } from "@mui/material";
import { useSelector } from "react-redux";
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

const LeftSide = ({ data, loading, fetchData }) => {
  const navigate = useNavigate();
  const { formatMessage } = useLocale();

  const columns = [
    { id: "icon", label: "", width: 10 },
    { id: "name", label: formatMessage({ id: "company.name" }), width: 100 },
    { id: "phone", label: formatMessage({ id: "company.phonenumber" }), width: 70 },
    { id: "address", label: formatMessage({ id: "company.address" }), width: 120 },
    { id: "features", label: formatMessage({ id: "company.products" }), width: 50 }
  ];

  return (
    <Container>
      <Box sx={{ width: "100%", overflow: "hidden", display: "flex" }}>
        <TableContainer
          sx={{
            // maxHeight: "72vh",
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
                      "& .MuiTableRow-root": { display: "none" },
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ maxWidth: column.width }}
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
                  ) : data?.length < 1 ? (
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
                        {formatMessage({ id: "company.norecords" })}
                      </div>
                    </TableCell>
                  ) : (
                    data?.map((el, key) => {
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

                          <TableCell
                            style={{
                              maxWidth: "100px",
                            }}
                          >
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
                                overflow: "hidden"
                              }}
                            >
                              {el?.phone}
                            </span>
                          </TableCell>

                          <TableCell
                            style={{
                              maxWidth: "100px",
                            }}
                          >
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
                                overflow: "hidden"
                              }}
                            >
                              {el?.address}
                            </span>
                          </TableCell>

                          <TableCell
                            style={{
                              minWidth: "140px",
                            }}
                          >
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
                              {el?.features?.length < 1 ? "-" : el?.features?.map((item, index) => {
                                return (
                                  <span key={index}>
                                    {item === "DEFAULT" ? <><img src={"/icons/Navbar/advance.svg"} width="15" style={{ marginBottom: "-3px" }} /> {formatMessage({ id: "company.advances" })}</> :
                                      item === "EVOUCHERS" ? <><img src={"/icons/Navbar/percent.svg"} width="18" style={{ marginBottom: "-3px" }} /> {formatMessage({ id: "nav.evoucher" })}</> :
                                        item === "TIME_TRACKER" ? "" :
                                          item === "ALL" ? <><img src={"/icons/Navbar/advance.svg"} width="15" /> {formatMessage({ id: "company.advances" })}, <img src={"/icons/Navbar/percent.svg"} width="18" style={{ marginBottom: "-3px" }} /> {formatMessage({ id: "nav.evoucher" })}</> :
                                            item}
                                  </span>
                                )
                              })}
                            </span>
                          </TableCell>

                          {/* <TableCell sx={{ textAlign: "center" }}>
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
                                {el.monetizationMethod === "SUBSCRIPTION"
                                  ? formatMessage({
                                    id: "company.subscription",
                                  })
                                  : el.monetizationMethod === "FEES_PER_ADVANCE"
                                    ? formatMessage({
                                      id: "company.fees_per_advance",
                                    })
                                    : el.monetizationMethod === "PAYED_BY_COMPANY"
                                      ? formatMessage({
                                        id: "company.payed_by_company",
                                      })
                                      : ""}
                              </span>
                            </TableCell> */}
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
    </Container>
  );
};
const RightSide = ({ companies, setCompanies, type, setType, feature, setFeature }) => {
  const { formatMessage } = useLocale();
  const [sortOrder, setOrder] = useState(1);

  const triAlpha = () => {
    const newArray = sortArrayAlphabetically({
      arr: companies,
      key: "name",
      order: sortOrder,
    });
    setCompanies([...newArray]);
    setOrder(-sortOrder);
  };

  const clearFilter = () => {
    setType("")
    setFeature("")
  }

  return (
    <Box>
      <ContFilter>
        <Typography variant="body2" sx={{ textDecoration: "underline", cursor: "pointer", fontWeight: "bold", textAlign: "center" }} onClick={clearFilter}>{formatMessage({ id: "employee.clearfilter" })}</Typography>
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
            type === "" ? formatMessage({ id: "company.adstatus" }) : type ? formatMessage({ id: "company.activated" }) : formatMessage({ id: "company.notactivated" })
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
          <MenuItem onClick={() => { setFeature("ALL"); setType("") }}>
            {formatMessage({ id: "filter.evoucher.all" })}
          </MenuItem>
          <MenuItem onClick={() => { setFeature("DEFAULT"); setType("") }}>
            {formatMessage({ id: "company.advances" })}
          </MenuItem>
          <MenuItem onClick={() => { setFeature("EVOUCHERS"); setType("") }}>
            {formatMessage({ id: "nav.evoucher" })}
          </MenuItem>
        </TextField>

      </ContFilter>
    </Box>
  );
};
const Branches = () => {
  const [companies, setCompanies] = useState([]);
  const [type, setType] = useState("");
  const [isLoading, setIsLoading] = useState(true)
  const [feature, setFeature] = useState("");
  const selectedUserState = useSelector((state) => state.userInfos)
  useEffect(() => {
    if (selectedUserState?.manages) {
      setCompanies(
        type === "" ?
          (feature === "" ? selectedUserState.manages : selectedUserState.manages?.filter((x) => x.features.includes(feature))) :
          selectedUserState.manages?.filter((x) => x.isAdvanceEnabled === type)
      )

      setIsLoading(false)
    }
  }, [selectedUserState, type, feature]);

  return (
    <SideContainer
      LeftSideComponent={
        <LeftSide data={companies} loading={isLoading} />
      }
      RightSideComponent={
        <RightSide
          type={type}
          setType={setType}
          companies={companies}
          setCompanies={setCompanies}
          feature={feature}
          setFeature={setFeature}
        />
      }
    />
  );
};
export default Branches;
