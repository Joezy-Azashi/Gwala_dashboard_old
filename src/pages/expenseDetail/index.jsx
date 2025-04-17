import React, { useState } from "react";
import AltSideContainer from "../../containers/AltSideContainer";
import { Typography, Box, Grid, Hidden } from "@mui/material";
import Button from "../../components/UI/Button";
import { TextField } from "../../components/UI";
import { useLocale } from "../../locales";
import { useNavigate, useParams } from "react-router";
import { getExpenseById } from "../../api";
import axios from "../../api/request";
import ImgKyc from "../../components/UI/ImgKyc";
import PageSpinner from "../../components/pagespinner/PageSpinner";
import { toast } from "react-toastify";

const RightSide = (data) => {
  const { formatMessage } = useLocale();
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const navigate = useNavigate();

  const UpdatePaid = async (id) => {
    setApproveLoading(true);
    const result = await axios.put(`/v2/expenses/${id}`, {status: 'paid'});
    if (result?.status === "success")
      toast(formatMessage({ id: "reimbursements.paid" }), {
        position: "top-right",
        theme: "colored",
        type: "success",
      });
    setApproveLoading(false);
    navigate("/reimbursements");
  };

  const ApproveReject = async (type, id) => {
    if (type === "APPROVED") setApproveLoading(true);
    if (type === "REJECTED") setRejectLoading(true);
    const result = await axios.put(`/v2/expenses`, {
      status: type,
      expenseIds: [id],
    });

    let message =
      type == "REJECTED"
        ? "response.reimbursements.reject"
        : "response.reimbursements.approve";
    if (result?.status) setApproveLoading(false);
    setRejectLoading(false);

    toast(formatMessage({ id: message }), {
      position: "top-right",
      theme: "colored",
      type: result?.status,
    });
    navigate("/reimbursements");
  };

  return (
    <Box sx={{ padding: { md: "0rem 35px" } }}>
      <Grid container spacing={3} mb={2}>
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label={formatMessage({ id: "expense.firstname" })}
                value={data?.data?.expense?.user?.firstName}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label={formatMessage({ id: "expense.lastname" })}
                value={data?.data?.expense?.user?.lastName}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label={formatMessage({ id: "expense.email" })}
                value={data?.data?.expense?.user?.email}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label={formatMessage({ id: "expense.phone" })}
                value={data?.data?.expense?.user?.phone?.number}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label={formatMessage({ id: "expense.type" })}
                value={data?.data?.expense?.type}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label={formatMessage({ id: "expense.amount" })}
                value={data?.data?.expense?.amount}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label={formatMessage({ id: "expense.requestdate" })}
                value={data?.data?.expense?.happenedOn.split("T")[0]}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label={formatMessage({ id: "expense.date" })}
                value={data?.data?.expense?.createdAt.split("T")[0]}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label={formatMessage({ id: "expense.status" })}
                value={data?.data?.expense?.status}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                value={data?.data?.expense?.description}
                onChange={(e) => setRejectReason(e.target.value)}
                sx={{ backgroundColor: "var(--color-white)" }}
                variant='outlined'
                InputLabelProps={{ shrink: true }}
                label={formatMessage({ id: "expense.description" })}
                fullWidth multiline rows={8}
              />
            </Grid>
          </Grid>
        </Grid>

        {data?.data?.expense?.status === "APPROVED" ? (
          <Box
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
            mt={3}
            mb={2}
          >
            <Box sx={{ width: {xs: "70%", md: "30%"} }}>
              <Button
                color={"var(--color-dark-blue)"}
                text={formatMessage({ id: "reimbursements.mark" })}
                loading={approveLoading}
                onClick={() => UpdatePaid(data?.data?.expense?._id)}
              />
            </Box>
          </Box>
        ) : data?.data?.expense?.status === "PENDING" ? (
          <>
            <Hidden mdDown>
              <Grid item xs={0} sm={0} md={3} />
            </Hidden>

            <Grid item xs={12} sm={6} md={3}>
              <Button
                color={"var(--color-dark-blue)"}
                text={formatMessage({ id: "advance.confirm.approve" })}
                loading={approveLoading}
                onClick={() =>
                  ApproveReject("APPROVED", data?.data?.expense?._id)
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Button
                color={"var(--color-white)"}
                bgColor={"var(--color-danger)"}
                text={formatMessage({ id: "advance.confirm.rejeter" })}
                loading={rejectLoading}
                onClick={() =>
                  ApproveReject("REJECTED", data?.data?.expense?._id)
                }
              />
            </Grid>

            <Grid item xs={0} sm={0} md={3} />
          </>
        ) : (
          ""
        )}
      </Grid>
    </Box>
  );
};

const LeftSide = (data) => {
  const { formatMessage } = useLocale();

  return (
    <Box sx={{ padding: "2rem 0px", height: "80vh", overflow: "auto" }}>
      <Typography
        color={"var(--color-dark-blue)"}
        textAlign={"center"}
        fontSize={"1rem"}
        fontWeight={600}
        sx={{ "&:first-letter": { textTransform: "capitalize" } }}
      >
        {data?.data?.expense?.title}
      </Typography>

      {data?.data?.loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70vh",
          }}
        >
          <PageSpinner />
        </Box>
      ) : data?.data?.expense?.attachment?.length > 0 ? (
        <Box>
          {data?.data?.expense?.attachment?.map((el, index) => {
            return <ImgKyc src={`/v2/expenses/view/${el.path}`} key={index} />;
          })}
        </Box>
      ) : (
        <Typography textAlign={"center"} fontWeight={500} my={5}>
          {formatMessage({ id: "expense.nodoc" })}
        </Typography>
      )}
    </Box>
  );
};

function ExpenseDetail() {
  const { id } = useParams();
  const data = getExpenseById(id);

  return (
    <AltSideContainer
      LeftSideComponent={<LeftSide data={data} />}
      RightSideComponent={<RightSide data={data} />}
    />
  );
}

export default ExpenseDetail;
