import React, { useEffect, useState } from 'react'
import { Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Confirm } from '../UI';
import styled from 'styled-components';
import { useLocale } from '../../locales';
import PageSpinner from '../pagespinner/PageSpinner';
import Button from '../transaction/Button';
import { useNavigate } from 'react-router';
import { getPhoneRequests } from '../../api';
import axios from '../../api/request';
import { toast } from 'react-toastify';
import moment from 'moment';

const TabContainer = styled.div`
  tbody > tr {
    :hover * {
      /* background-color: #d9edff; */
      // cursor: pointer;
    }
  }
`;

const INITIAL_FILTER = {
    status: "",
    company: "",
    requestDate: 1,
    startDate: "",
    endDate: ""
};

const PhoneRequests = ({ visible, setVisible, data, setPage, setPhoneRequests, filter, page, selectedUserState, refetch, setRefetch, setFilter }) => {
    const { formatMessage } = useLocale();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const columns = [
        { id: "name", label: formatMessage({ id: "phone.request.name" }), width: 100 },
        { id: "company", label: formatMessage({ id: "company.companyadmin" }), width: 100 },
        { id: "date", label: formatMessage({ id: "phone.request.date" }), width: 70 },
        { id: "ancien", label: formatMessage({ id: "phone.request.old" }), width: 70 },
        { id: "nouveau", label: formatMessage({ id: "phone.request.new" }), width: 70 },
        { id: "status", label: formatMessage({ id: "phone.request.status" }), width: 70 },
        { id: "actions", label: formatMessage({ id: "phone.request.actions" }), width: 70 },
    ];

    const getPhoneRequestData = async () => {
        setLoading(true);
        const { status, company, requestDate } = filter;
        const filters = {
            ...((status && { status: status }) || {}),
            ...((company && { companyId: company }) || {}),
            ...((requestDate && { sort: requestDate }) || {}),
        };
        const queryParams = new URLSearchParams({ ...filters });
        const data = await getPhoneRequests(page, 10, queryParams);
        setPhoneRequests(data);
        setLoading(false);
    };

    useEffect(() => {
        if (selectedUserState?.manages) {
            setBranches(selectedUserState.manages);
        }
    }, [selectedUserState]);

    useEffect(() => {
        getPhoneRequestData();
    }, [page, filter, refetch]);

    const approveRequest = async (type, requestId) => {
        try {
            const result = await axios.put(
                `/support/phone/lost/${requestId}?status=${type}`
            );

            let message =
                type == "accepted"
                    ? "response.request.phone.approve"
                    : "response.request.phone.reject";
            if (result?.status === "success") {
                setVisible();
                setRefetch(refetch + 1)
                toast(formatMessage({ id: message }), {
                    position: "top-right",
                    theme: "colored",
                    type: "success",
                });
                setFilter(INITIAL_FILTER);
                fetchData(1)
            }
        } catch (e) { }
    };

    return (
        <TabContainer>
            <TableContainer
                sx={{
                    "&::-webkit-scrollbar": {
                        width: 0,
                    },
                }}
            >
                <Table stickyHeader aria-label="sticky table" size="small">
                    <Confirm
                        visible={visible}
                        cancelText={formatMessage({ id: "advance.confirm.cancel" })}
                        confirmText={formatMessage({ id: "advance.confirm.approve" })}
                        setHidden={() => setVisible()}
                        onCancel={() => setVisible()}
                        onSubmit={() => approveRequest("accepted", visible)}
                    >
                        {formatMessage({ id: "advance.confirm.text" })}
                    </Confirm>
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
                                        <TableCell colSpan={7}>
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
                                        <TableCell colSpan={7}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    height: "50vh",
                                                    fontSize: "1.2rem",
                                                }}
                                            >
                                                {formatMessage({ id: "advance.norecords" })}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data?.docs?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.map((el, key) => {
                                        if (Object.keys(el?.user).length == 0) return;

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
                                            // onClick={() => navigate(`/employee/${el._id}`)}
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
                                                        {el?.user?.firstName} {el?.user?.lastName}
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
                                                        {el?.user?.company?.name}
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
                                                        {el?.requestDate && moment(el?.requestDate).format("DD/MM/YYYY")}
                                                    </span>
                                                </TableCell>

                                                <TableCell title={el?.oldPhone}>
                                                    <span
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            padding: ".45rem",
                                                            backgroundColor: "#F7F0F0",
                                                            textTransform: "capitalize",
                                                        }}
                                                    >
                                                        <span style={{ width: "7rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{el?.oldPhone}</span>
                                                    </span>
                                                </TableCell>
                                                <TableCell title={el?.newPhone}>
                                                    <span
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            padding: ".45rem",
                                                            backgroundColor: "#F7F0F0",
                                                            textTransform: "capitalize"
                                                        }}
                                                    >
                                                        <span style={{ width: "7rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{el?.newPhone}</span>
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
                                                        {el?.status === "ACCEPTED"
                                                            ? formatMessage({ id: "filter.accepted" })
                                                            : el?.status === "REJECTED"
                                                                ? formatMessage({ id: "filter.rejected" })
                                                                : formatMessage({ id: "filter.pending" })}
                                                    </span>
                                                </TableCell>

                                                <TableCell sx={{ textAlign: "center" }}>
                                                    <span
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            padding: ".35rem",
                                                            backgroundColor: "#F7F0F0",
                                                            whiteSpace: "nowrap",
                                                            textTransform: "capitalize",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                gap: "10px",
                                                                alignItems: "center",
                                                                width: "100%",
                                                            }}
                                                        >
                                                            <Button
                                                                border={"none"}
                                                                color="#87CEFA"
                                                                onClick={() =>
                                                                    navigate(`/employee-edit/${el.user._id}`)
                                                                }
                                                            >
                                                                {/* {formatMessage({ id: "advance.profil" })} */}
                                                                <img src="/icons/profile.svg" width={20} />
                                                            </Button>

                                                            <span
                                                                style={{
                                                                    opacity:
                                                                        el?.status.toLowerCase() !== "pending"
                                                                            ? "0.5"
                                                                            : "",
                                                                    width: "100%",
                                                                }}
                                                            >
                                                                <Button
                                                                    color="#FFFFFF"
                                                                    onClick={() => {
                                                                        el?.status.toLowerCase() !== "pending"
                                                                            ? ""
                                                                            : setVisible(el._id);
                                                                    }}
                                                                    hover={el?.status.toLowerCase() !== "pending" ? "" : "#6fff2bc7"}
                                                                    style={{ cursor: el?.status === "ACCEPTED" || el?.status === "REJECTED" ? "default" : "" }}
                                                                >
                                                                    <img src="/icons/transaction/confirm.svg" width={15} />
                                                                </Button>
                                                            </span>

                                                            <span
                                                                style={{
                                                                    opacity:
                                                                        el?.status.toLowerCase() !== "pending"
                                                                            ? "0.5"
                                                                            : "",
                                                                    width: "100%",
                                                                }}
                                                            >
                                                                <Button
                                                                    color="#F7F0F0"
                                                                    onClick={() => {
                                                                        el?.status.toLowerCase() !== "pending"
                                                                            ? ""
                                                                            : approveRequest("rejected", el._id);
                                                                    }}
                                                                    hover={el?.status.toLowerCase() !== "pending" ? "" : "var(--color-danger)"}
                                                                    style={{ cursor: el?.status.toLowerCase() !== "pending" ? "default" : "" }}
                                                                >
                                                                    <img src="/icons/transaction/cancel.svg" width={15} />
                                                                </Button>
                                                            </span>
                                                        </div>
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
                        onChange={(e, value) => setPage(value)}
                        page={page}
                    />
                </div>
            )}
        </TabContainer>
    )
}

export default PhoneRequests