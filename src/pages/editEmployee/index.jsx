import React, { useEffect, useState } from "react";
import { LeftCnt, RightCnt } from "./style";
import {
  // Avatar,
  Button,
  Cellul,
  DisplayDocuments,
  IOSSwitch,
  UploadDocuments,
} from "../../components/UI";
import SideContainer from "../../containers/SideContainer";
import { useLocation, useNavigate, useParams } from "react-router";
import { getEmployeeById, getTransactionByUserId } from "../../api";
import axios from "../../api/request";
import { convertDate } from "../../utils";
import { useLocale } from "../../locales";
import {
  IconButton,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import TextField from "../../components/UI/TextField";
import { MenuItem, Avatar } from "@mui/material";
import { BasicSelect } from "../../components/UI";
import Slider from "../../components/UI/Slider";
import { toast } from "react-toastify";

const RightSide = ({ data, transactions }) => {
  const { formatMessage } = useLocale();
  const { company } = data?.data ?? {};
  return (
    <RightCnt>
      <div style={{ paddingTop: "2rem" }}>
        <Avatar
          sx={{
            width: 140,
            height: 140,
            textTransform: "capitalize",
            fontSize: "5rem",
          }}
        >
          {data?.data?.firstName[0]}
          {data?.data?.lastName[0]}
        </Avatar>
      </div>
      <div className="transactions">
        <span>{formatMessage({ id: "employee.lastTrans" })}</span>
        <div className="lastTransations">
          {transactions?.docs?.map((el, key) => (
            <div key={key}>
              <span>{convertDate(el.requestedDate)} </span>
              <span>{el.requestedAmount} DH</span>
            </div>
          ))}
        </div>
      </div>
      {/* <div className="company">
        <img src="/icons/Navbar/company.svg" />
        <div>
          <span style={{ fontWeight: "bold", textTransform: "capitalize", marginBottom: "5px" }}>{company?.name}</span>
          <span style={{ fontSize: "13px", marginBottom: "5px"  }}>{company?.email}</span>
          <span style={{ fontSize: "13px" }}>{company?.phone}</span>
        </div>
      </div> */}
      {data?.data?.createdAt && (
        <div className="infos">
          <span
            style={{
              fontWeight: "bold",
              textTransform: "capitalize",
              marginBottom: "5px",
            }}
          >
            {company?.name}
          </span>
          <span>
            {formatMessage({ id: "employee.addDate" })}
            {convertDate(data?.data?.createdAt)}
          </span>
          <span>
            {formatMessage({ id: "employee.updateDate" })}{" "}
            {convertDate(data?.data?.updatedAt)}
          </span>
        </div>
      )}
    </RightCnt>
  );
};

const LeftSide = ({ data, refetch, setRefetch }) => {
  const navigate = useNavigate();
  // const { role } = useSelector((state) => state.userInfos);
  const role = localStorage.getItem("role");
  const [showPassword, setShowPassword] = useState(false);
  const [companyData, setCompanyData] = useState("")
  const [open, setOpen] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [enableLoading, setEnableLoading] = useState(false);
  const [change, setChange] = useState(false);
  const [enableEmployee, setEnable] = useState(false);
  const [dataType, setType] = useState({
    type: "ID_CARD",
    front: "",
    back: "",
  });

  const [newData, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    cni: "",
    salaryPerDay: 0,
    balance: Number(0),
    subscription: 0,
    feesPercentage: 0,
    requestedBalance: 0,
    hasAppliedReferralCode: true,
    giftBalance: Number(0),
    maxReferrals: 0,
    givenSalaryPercentage: 0,
    salary: 0,
    isVerified: "NOT",
    isDefaultPasswordChanged: true,
    canRequestAdvance: "REQUIRE_APPROVAL",
    monetizationMethod: "SUBSCRIPTION",
    rib: "",
    advanceType: "BY_PROMPT",
    password: "",
    isTestAccount: false
  });
  useEffect(() => {
    setData({
      ...newData,
      firstName: data?.data?.firstName,
      lastName: data?.data?.lastName,
      email: data?.data?.email,
      phone: data?.data?.phone?.number,
      address: data?.data?.address,
      cni: data?.data?.cni,
      salaryPerDay: data?.data?.salaryPerDay,
      balance: data?.data.balance,
      isTestAccount: data?.data?.isTestAccount,
      subscription: data?.data.subscription,
      feesPercentage: data?.data.feesPercentage,
      requestedBalance: data?.data.requestedBalance,
      hasAppliedReferralCode: data?.data.hasAppliedReferralCode,
      giftBalance: data?.data.giftBalance,
      maxReferrals: data?.data.maxReferrals,
      givenSalaryPercentage: Number(data?.data.givenSalaryPercentage) * 100,
      salary: data?.data.salary,
      isVerified: data?.data.isVerified,
      isDefaultPasswordChanged: data?.data.isDefaultPasswordChanged,
      canRequestAdvance: data?.data.canRequestAdvance,
      monetizationMethod: data?.data.monetizationMethod,
      rib: data?.data.withdrawalAccount.rib,
      advanceType: data?.data.advanceType,
    });
    setEnable(data?.data.isEnabled);
    setCompanyData(data?.data?.company)
  }, [data, refetch]);
  const [visible, setVisible] = useState(false);
  const { formatMessage } = useLocale();
  const [visibleUpload, setVisibleUpload] = useState(false);

  const verifyUser = async () => {
    if (role === "Admin") {
      const verify = await axios.post(
        `/account/kyc/verify?userId=${data?.data?._id}&status=${newData?.isVerified}`
      );
    }
  };

  const updateEmployee = async () => {
    setSaveLoading(true);

    setData({ ...newData, isVerified: newData?.isVerified });

    let tmpData = {};
    for (let key in newData) {
      if (newData[key] !== data.data[key]) {
        tmpData = { ...tmpData, [key]: newData[key] };
      }
    }

    // if (newData.rib === data.data.withdrawalAccount.rib) delete tmpData.rib;
    if (newData.phone === data.data.phone.number) delete tmpData.phone;
    if (newData.password === "") delete tmpData.password;
    tmpData.givenSalaryPercentage = newData.givenSalaryPercentage / 100;

    if ((data?.data?.company?.features?.includes("ALL") || data?.data?.company?.features?.includes("DEFAULT")) && !tmpData?.rib) {
      toast(formatMessage({ id: "employee.ribrequired" }), {
        position: "top-right",
        theme: "colored",
        type: "error",
      });
      setSaveLoading(false);
      return
    }

    // if (Object.keys(newData).length !== 0)
    const result = await axios.put(`/account/${data?.data?._id}`, tmpData);
    verifyUser();

    if (result?.status == "success") {
      toast(formatMessage({ id: "response.employee.edit" }), {
        position: "top-right",
        theme: "colored",
        type: "success",
      });
      // navigate("/employee");
    } else {
      // toast(result?.response?.data?.message, {
      //   position: "top-right",
      //   theme: "colored",
      //   type: "error",
      // });
    }
    setSaveLoading(false);
  };

  const approuveKyc = async (userId, isVerified) => {
    const result = await axios.post(
      `/account/kyc/verify?userId=${userId}&status=${isVerified}`
    );
    let message =
      isVerified === "VERIFIED"
        ? "response.employee.verified"
        : "response.employee.notverified";
    if (result?.status == "success") {
      setRefetch(refetch + 1)
      toast(formatMessage({ id: message }), {
        position: "top-right",
        theme: "colored",
        type: "success",
      });
      setData({ ...newData, isVerified: isVerified });
      setVisible(false);
    }
  };
  const deleteAccount = async () => {
    setDeleteLoading(true);
    const result = await axios.patch(`/account/delete/${data?.data._id}`);
    if (result?.status == "success") {
      setDeleteLoading(false);
      toast(formatMessage({ id: "response.employee.deleted" }), {
        position: "top-right",
        theme: "colored",
        type: "success",
      });
      navigate("/employee");
    }
  };
  const disbleAccount = async () => {
    setEnableLoading(true);
    const result = await axios.patch(
      enableEmployee
        ? `/account/disable?userId=${data?.data?._id}`
        : `/account/enable?userId=${data?.data?._id}`
    );
    if (result?.status == "success") {
      setEnableLoading(false);
      setEnable(!enableEmployee);
      toast(formatMessage({ id: "response.employee.edit" }), {
        position: "top-right",
        theme: "colored",
        type: "success",
      });
    }
  };
  const UploadFiles = async (documents) => {
    setDocLoading(true)
    let result;
    if (documents.front !== "") {
      let file = new FormData();
      file.append("documentType", documents.type);
      file.append("document", documents.front);
      file.append("sideType", "FRONT");
      result = await axios.post(
        `/account/kyc/upload?userId=${data?.data?._id}`,
        file
      );
    }
    if (documents.back !== "") {
      let file = new FormData();
      file.append("documentType", documents.type);
      file.append("document", documents.back);
      file.append("sideType", "BACK");
      result = await axios.post(
        `/account/kyc/upload?userId=${data?.data?._id}`,
        file
      );
    }
    if (result?.status == "success") {
      setDocLoading(false)
      setRefetch(refetch + 1)
      toast(formatMessage({ id: "response.kyc.add" }), {
        position: "top-right",
        theme: "colored",
        type: "success",
      });
      setVisibleUpload(false);

      setType({
        type: "ID_CARD",
        front: "",
        back: "",
      })
    } else {
      setDocLoading(false)
    }
  };

  return (
    <LeftCnt>
      <DisplayDocuments
        files={data?.data?.kycDocuments}
        visible={visible}
        setVisible={setVisible}
        userId={data?.data?._id}
        hideButton={role !== "Admin"}
        approuveKyc={approuveKyc}
      />
      <UploadDocuments
        visible={visibleUpload}
        setVisible={setVisibleUpload}
        onSubmit={UploadFiles}
        dataType={dataType}
        setType={setType}
        docLoading={docLoading}
      />
      <div className="row" onClick={() => visible && setVisible(false)}>
        <div className="col-md-4">
          <TextField
            value={newData?.firstName}
            label={formatMessage({ id: "employee.firstname" })}
            onChange={(e) => {
              setData({ ...newData, firstName: e.target.value });
              setChange(true);
            }}
            fullWidth
            margin="dense"
          />
          <TextField
            label={formatMessage({ id: "employee.lastname" })}
            value={newData?.lastName}
            onChange={(e) => {
              setData({ ...newData, lastName: e.target.value });
              setChange(true);
            }}
            fullWidth
            margin="dense"
          />
          <TextField
            label={formatMessage({ id: "employee.phone" })}
            value={newData.phone}
            onChange={(e) => {
              setData({
                ...newData,
                phone: e.target.value,
              });
              setChange(true);
            }}
            fullWidth
            margin="dense"
          />
          <TextField
            label={"Email"}
            value={newData.email}
            onChange={(e) => {
              setData({ ...newData, email: e.target.value });
              setChange(true);
            }}
            fullWidth
            margin="dense"
          />

          {role === "Admin" && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                type={showPassword ? "text" : "password"}
                label={formatMessage({ id: "employee.password" })}
                value={newData.password}
                onChange={(e) => {
                  setData({ ...newData, password: e.target.value });
                  setChange(true);
                }}
                fullWidth
                margin="dense"
              />
              <Box
                sx={{
                  backgroundColor: "#f7f0f0",
                  borderRadius: "0",
                  width: "3.5rem",
                  display: "flex",
                  height: "3.5rem",
                  marginTop: "4px",
                }}
              >
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{ margin: "auto" }}
                >
                  {showPassword ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </IconButton>
              </Box>
            </div>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }} mt={2}>
            <Typography variant="body3">{formatMessage({ id: "employee.testaccount" })}</Typography>
            <IOSSwitch
              id="active"
              checked={newData?.isTestAccount}
              onClick={() => { setData({ ...newData, isTestAccount: !newData?.isTestAccount }); setChange(true); }}
            />
          </Box>
        </div>
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-8">
              <TextField
                label={formatMessage({ id: "employee.address" })}
                value={newData.address}
                onChange={(e) => {
                  setData({ ...newData, address: e.target.value });
                  setChange(true);
                }}
                fullWidth
                margin="dense"
              />
            </div>
            <div className="col-md-4">
              <TextField
                label={formatMessage({ id: "employee.cin" })}
                value={newData.cni}
                onChange={(e) => {
                  setData({ ...newData, cni: e.target.value });
                  setChange(true);
                }}
                fullWidth
                margin="dense"
              />
            </div>
          </div>

          {companyData?.features?.includes("ALL") ||
            companyData?.features?.includes("DEFAULT") ?
            <TextField
              label={"RIB"}
              value={newData.rib}
              onChange={(e) => {
                setData({
                  ...newData,
                  rib: e.target.value,
                });
                setChange(true);
              }}
              fullWidth
              margin="dense"
            /> : ""}

          <div className="row">
            {companyData?.features?.includes("ALL") ||
              companyData?.features?.includes("DEFAULT") ?
              <div className="col-md-3">
                <TextField
                  label={formatMessage({ id: "employee.salaire" })}
                  value={newData.salary}
                  onChange={(e) => {
                    setData({
                      ...newData,
                      salary: e.target.value,
                    });
                    setChange(true);
                  }}
                  disabled={role !== "Admin"}
                  fullWidth
                  margin="dense"
                />
              </div> : ''}

            {companyData?.features?.includes("ALL") ||
              companyData?.features?.includes("DEFAULT") ?
              <div className="col-md-4">
                <Slider
                  size="medium"
                  aria-label="Small"
                  label={formatMessage({ id: "employee.percentage" })}
                  valueLabelDisplay="auto"
                  value={newData.givenSalaryPercentage}
                  onChange={(e, newValue) => {
                    {
                      setData({
                        ...newData,
                        givenSalaryPercentage: newValue,
                      });
                      setChange(true);
                    }
                  }}
                />
              </div> : ""}

            {companyData?.features?.includes("ALL") ||
              companyData?.features?.includes("DEFAULT") ?
              <div className="col-md-2">
                <TextField
                  label={formatMessage({ id: "employee.solde" })}
                  value={newData.balance}
                  onChange={(e) => {
                    setData({
                      ...newData,
                      balance: Number(e.target.value),
                    });
                    setChange(true);
                  }}
                  disabled={role !== "Admin"}
                  fullWidth
                  margin="dense"
                />
              </div> : ""}


            {companyData?.features?.includes("ALL") ||
              companyData?.features?.includes("DEFAULT") ? <div className="col-md-3">
              <TextField
                label={formatMessage({ id: "employee.soldeGift" })}
                value={newData.giftBalance}
                onChange={(e) => {
                  setData({
                    ...newData,
                    giftBalance: Number(e.target.value),
                  });
                  setChange(true);
                }}
                disabled={role !== "Admin"}
                fullWidth
                margin="dense"
              />
            </div> : ""}
          </div>
          <div className="row">
            {companyData?.features?.includes("ALL") ||
              companyData?.features?.includes("DEFAULT") ?
              <div className="col-md-6">
                <BasicSelect
                  margin="dense"
                  formControlProps={{ fullWidth: true, margin: "dense" }}
                  label={formatMessage({ id: "employee.typeAdvance" })}
                  value={newData.advanceType}
                  // disabled={role !== "Admin"}
                  onChange={(e) => {
                    setData({ ...newData, advanceType: e.target.value });
                    setChange(true);
                  }}
                >
                  <MenuItem value={"BY_PROMPT"}>
                    {formatMessage({ id: "employee.manual" })}
                  </MenuItem>
                  {/* <MenuItem value={"BY_WTSP"}>Approbation par WhatsApp</MenuItem> */}
                  <MenuItem value={"AUTOMATIC"}>
                    {formatMessage({ id: "employee.automatic" })}
                  </MenuItem>
                </BasicSelect>
              </div> : ""}
            <div className="col-md-6">
              <TextField
                label={formatMessage({ id: "employee.defaultPassword" })}
                value={
                  !newData.isDefaultPasswordChanged
                    ? formatMessage({ id: "employee.notChanged" })
                    : formatMessage({ id: "employee.changed" })
                }
                disabled={role !== "Admin"}
                fullWidth
                margin="dense"
              />
            </div>
          </div>
          <div className="row">
            {companyData?.features?.includes("ALL") ||
              companyData?.features?.includes("DEFAULT") ?
              <div className="col-md-6">
                <BasicSelect
                  margin="dense"
                  formControlProps={{ fullWidth: true, margin: "dense" }}
                  label={formatMessage({ id: "employee.identity" })}
                  value={newData.isVerified}
                  disabled={role !== "Admin"}
                  onChange={(e) => {
                    setData({ ...newData, isVerified: e.target.value });
                    setChange(true);
                  }}
                >
                  <MenuItem value={"NOT"}>
                    {formatMessage({ id: "employee.notVerified" })}
                  </MenuItem>
                  <MenuItem value={"VERIFIED"}>
                    {formatMessage({ id: "employee.verified" })}
                  </MenuItem>
                </BasicSelect>
              </div> : ""}
            {role === "Admin" && data?.data?.kycDocuments?.length > 0 && (
              <div
                className="col flex-grow-1 cellul"
                onClick={() => setVisible(true)}
                style={{ cursor: "pointer" }}
              >
                <Cellul color={`var(--color-cyan-light)`}>
                  {formatMessage({ id: "employee.seeDocs" })}
                </Cellul>
              </div>
            )}
            {role === "Admin" && companyData?.features?.includes("ALL") ||
              companyData?.features?.includes("DEFAULT") && (
                <div
                  className="col-md-auto cellul"
                  onClick={() => setVisibleUpload(true)}
                >
                  <Cellul color={`var(--color-cyan-light)`}>
                    <img src="/icons/download.svg" />
                  </Cellul>
                </div>
              )}

            {companyData?.features?.includes("ALL") ||
              companyData?.features?.includes("DEFAULT") ?
              <div className={role !== "Admin" ? "col-md-6" : "col-md-12"}>
                <BasicSelect
                  margin="dense"
                  formControlProps={{ fullWidth: true, margin: "dense" }}
                  label={formatMessage({ id: "employee.monetization" })}
                  value={newData?.monetizationMethod}
                  disabled={
                    data?.data?.company?.monetizationMethod === "PAYED_BY_COMPANY"
                  }
                  onChange={(e) => {
                    setData({
                      ...newData,
                      monetizationMethod: e.target.value,
                    });
                    setChange(true);
                  }}
                >
                  <MenuItem value={"FEES_PER_ADVANCE"}>
                    {formatMessage({ id: "employee.fees" })}
                  </MenuItem>
                  <MenuItem value={"PAYED_BY_COMPANY"}>
                    {formatMessage({ id: "employee.sponsor" })}
                  </MenuItem>
                </BasicSelect>
              </div> : ""}
          </div>
          <div className="row">
            {/* <div className="col flex-grow-1">
              <TextField
                label={formatMessage({ id: "employee.montant" })}
                value={newData.salaryPerDay}
                onChange={(e) =>
                  setData({
                    ...newData,
                    salaryPerDay: e.target.value,
                  })
                }
                disabled={role !== "Admin"}
                fullWidth
                margin="dense"
              />
            </div> */}
            {/* <div
              className="col-md-auto cellul"
              onClick={() => verifiedAccount(data.data._id, newData.isVerified)}
            >
              <Cellul color={`var(--color-cyan-light)`}>
                <img src="/icons/save.svg" />
              </Cellul>
            </div> */}
          </div>
        </div>
      </div>
      <Box className="row" style={{ width: "100%", margin: "30px 0" }}>
        <Box mt={{ xs: 2 }} className="col-md-4" onClick={() => setOpen(true)}>
          <Button
            text={formatMessage({ id: "employee.delete" })}
            bgColor={`var(--color-danger)`}
            color={"#fff"}
          />
        </Box>
        <Box
          mt={{ xs: 2 }}
          className="col-md-4"
          onClick={() => disbleAccount(newData?._id)}
        >
          <Button
            loading={enableLoading}
            text={
              enableEmployee
                ? formatMessage({ id: "employee.disable" })
                : formatMessage({ id: "employee.enable" })
            }
          />
        </Box>

        <Box mt={{ xs: 2 }} className="col-md-4">
          <Button
            bgColor={!change ? "#BDBDBD" : ""}
            onClick={() => {
              !change ? "" : updateEmployee();
            }}
            loading={saveLoading}
            text={formatMessage({ id: "employee.save" })}
          />
        </Box>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          "& .MuiDialog-paper": { padding: ".5rem" },
          backdropFilter: "blur(5px) sepia(5%)",
        }}
        PaperProps={{ sx: { borderRadius: "22px" } }}
      >
        <DialogTitle id="alert-dialog-title">
          {formatMessage({ id: "employee.deletequestion" })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {formatMessage({ id: "company.deletenote" })}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            text={formatMessage({ id: "company.delete" })}
            loading={deleteLoading}
            color={"var(--color-white)"}
            bgColor={"var(--color-danger)"}
            onClick={deleteAccount}
            autoFocus
          />
          <Button
            text={formatMessage({ id: "employee.close" })}
            onClick={() => setOpen(false)}
          />
        </DialogActions>
      </Dialog>
    </LeftCnt>
  );
};

const EmployeeEdit = () => {
  const { id } = useParams();
  const [refetch, setRefetch] = useState(1)
  let { data } = getEmployeeById(id, refetch);
  const { transactions } = getTransactionByUserId(id, 1, 5);

  return (
    <SideContainer
      RightSideComponent={
        <RightSide data={data} transactions={transactions?.data} />
      }
      LeftSideComponent={<LeftSide data={data} refetch={refetch} setRefetch={setRefetch} />}
    />
  );
};

export default EmployeeEdit;
