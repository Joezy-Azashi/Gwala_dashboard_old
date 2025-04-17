import styled from "styled-components";
import { Button } from "../../components/UI";
import { useNavigate } from "react-router";
import { useLocale } from "../../locales";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  TableContainer,
  Box,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Tooltip,
} from "@mui/material";
import PageSpinner from "../../components/pagespinner/PageSpinner";
import Pagination from "@mui/material/Pagination";
import Input from "../../components/Advance/SelectName";
import InputAmount from "../../components/Advance/InputAmount";
import { useState } from "react";
import { useEffect } from "react";
import axios from "../../api/request";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  removeItemElement,
  updateAdvanceByIndex,
} from "../../store/reducer/userReducer";
import Warning from "../../components/Advance/Warning";
const TabContainer = styled.div`
  tbody > tr {
    :hover * {
      /* background-color: #d9edff; */
      cursor: pointer;
    }
  }
`;

const LeftSide = ({ loading, filter }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formatMessage } = useLocale();
  const [advances, setAdvances] = useState([]);
  const advancesRequest = useSelector((state) => state.userInfos.advances);
  const [enable, setEnable] = useState(false);
  const [warning, setWarning] = useState({ visible: false, warnings: 0 });
  const [page, setPage] = useState(1);
  const columns = [
    { id: "trash", label: "", width: 30 },
    { id: "name", label: formatMessage({ id: "employee.name" }), width: 100 },
    {
      id: "company",
      label: formatMessage({ id: "advance.branch" }),
      width: 70,
    },
    {
      id: "solde",
      label: `${formatMessage({ id: "employee.solde" })} (MAD)`,
      width: 70,
    },
    {
      id: "montant",
      label: `${formatMessage({ id: "advance.montant" })} (MAD)`,
      width: 70,
    },
    {
      id: "error",
      label: "",
      width: 30,
    },
  ];

  const updateItemAtIndex = (index, newValue) => {
    const newArray = [...advances];
    newArray[index] = {
      firstName: newValue.firstName,
      lastName: newValue.lastName,
      amount: advances[index]?.amount,
      employee: {
        _id: newValue._id,
        company: newValue.company,
        balance: newValue.balance,
      },
      notFound: false,
      notEnoughBalance: advances[index]?.notEnoughBalance,
    };
    if (
      !advancesRequest.find(
        (item) => item?.employee?._id === newArray[index]?.employee?._id
      )
    ) {
      setAdvances(newArray);
      dispatch(updateAdvanceByIndex({ index, newValue: newArray[index] }));
    } else
      return toast("This employee already exists", {
        type: "error",
        theme: "colored",
      });
  };
  const updateAmountAtIndex = (index, newValue) => {
    const newArray = [
      ...advances.map((item, i) => (i === index ? { ...item } : item)),
    ];
    newArray[index].amount = newValue;
    newArray[index].notEnoughBalance =
      newValue < newArray[index]?.employee?.balance ? false : true;
    dispatch(updateAdvanceByIndex({ index, newValue: newArray[index] }));
    setAdvances(newArray);
  };

  const createAdvance = async () => {
    try {
      const result = await axios.post(
        "/advances/batch/request",
        advancesRequest
      );
      if (result?.status) {
        toast("Advances sent successfully", {
          position: "top-right",
          type: "success",
          theme: "colored",
        });
        navigate("/transaction");
      }
    } catch (e) {
      
    } finally {
      setWarning({ visible: false, warnings: 0 });
    }
  };
  const loadMoreByPagination = () => {
    const currentPage = page - 1;
    let filteredData = advancesRequest;
    if (filter.employee !== "" || filter.branch !== "") {
      if (filter.employee !== "")
        filteredData = filteredData?.filter(
          (item) => filter.employee?._id === item?.employee?._id
        );
      if (filter.branch !== "")
        filteredData = filteredData?.filter(
          (item) => item?.employee?.company?.name === filter.branch
        );
    }
    const newVisibleData = filteredData.slice(
      currentPage * 100,
      currentPage * 100 + 100
    );
    setAdvances([...newVisibleData]);
  };
  const deleteAdvance = (el) => {
    setAdvances(
      advances.filter(
        (element) =>
          el.firstName !== element.firstName && el.lastName !== element.lastName
      )
    );
    dispatch(removeItemElement(el));
  };
  useEffect(() => {
    if (advancesRequest.length === 0) return navigate("/transaction");
    loadMoreByPagination();
  }, [advancesRequest, page, filter]);

  useEffect(() => {
    let index = advancesRequest?.find((el) => el.notFound === true);
    if (!index) setEnable(true);
    index = advancesRequest?.filter((el) => el.notEnoughBalance === true);
    setWarning({ ...warning, warnings: index?.length || 0 });
  }, [advancesRequest]);
  return (
    <TabContainer>
      <Warning
        open={warning.visible}
        text={formatMessage(
          {
            id: "advance.warning.amount",
          },
          { count: warning.warnings, total: advancesRequest.length }
        )}
        onCancel={() => setWarning({ ...warning, visible: false })}
        onSubmit={createAdvance}
      />
      <Box sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer
          sx={{
            height: "68vh",
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
                        align={column.align}
                        style={{ width: column.width }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bolder",
                            padding: ".5rem",
                            whiteSpace: "nowrap",
                            backgroundColor: column.label && "#D9EDFF",
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
                  ) : advances?.length < 1 ? (
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
                  ) : (
                    advances?.map((el, key) => {
                      return (
                        <TableRow
                          // hover
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
                        >
                          <TableCell>
                            <img
                              onClick={() => deleteAdvance(el)}
                              src="/icons/trash.svg"
                              style={{ width: "23px" }}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              name={{
                                firstName: el.firstName,
                                lastName: el.lastName,
                              }}
                              onClick={updateItemAtIndex}
                              index={key}
                              error={el?.notFound}
                            />
                          </TableCell>

                          <TableCell>
                            <span
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "1rem",
                                backgroundColor: "#F7F0F0",
                                whiteSpace: "nowrap",
                                textTransform: "capitalize",
                              }}
                            >
                              {el?.employee?.company?.name || "N/A"}
                            </span>
                          </TableCell>

                          <TableCell>
                            <span
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "1rem",
                                backgroundColor: "#F7F0F0",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {el?.employee?.balance || "N/A"}
                            </span>
                          </TableCell>

                          <TableCell>
                            <InputAmount
                              amount={el?.amount}
                              index={key}
                              onChange={updateAmountAtIndex}
                              error={el?.notEnoughBalance}
                            />
                          </TableCell>
                          <TableCell>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {el.notEnoughBalance && (
                                <Tooltip
                                  title={formatMessage({
                                    id: "advance.ulpoad.manual.amount.greater",
                                  })}
                                  style={{
                                    background: "yellow",
                                    color: "#fff",
                                  }}
                                >
                                  <img
                                    src="/icons/warning.svg"
                                    style={{ width: "23px" }}
                                  />
                                </Tooltip>
                              )}
                              {el.notFound && (
                                <Tooltip
                                  title={formatMessage({
                                    id: "advance.ulpoad.manual.name.incorrect",
                                  })}
                                  style={{
                                    background: "yellow",
                                    color: "#fff",
                                  }}
                                >
                                  <img
                                    src="/icons/error.svg"
                                    style={{ width: "23px" }}
                                  />
                                </Tooltip>
                              )}
                            </div>
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <Pagination
            hidePrevButton
            hideNextButton
            count={Math.ceil(advancesRequest?.length / 100)}
            variant="outlined"
            shape="rounded"
            onChange={(e, value) => setPage(value)}
            page={page}
          />
        </div>
      </Box>
      <div
        style={{
          width: "360px",
          margin: "20px auto",
        }}
      >
        <Button
          text={"Send Requests"}
          bgColor={"var(--color-dark-blue)"}
          color={"#fff"}
          disable={!enable}
          onClick={
            warning.warnings > 0
              ? () => setWarning({ ...warning, visible: true })
              : createAdvance
          }
          loading={loading}
        />
      </div>
    </TabContainer>
  );
};

export default LeftSide;
