import React, { useEffect, useState } from "react";
import { LeftCnt } from "../../editEmployee/style";
import {
  Button,
  Cellul,
  DisplayDocuments,
  UploadDocuments,
  BasicSelect,
  TextField,
} from "../../../components/UI";
import Slider from "../../../components/UI/Slider";
import { useNavigate, useParams } from "react-router";
import { getEmployeeById } from "../../../api";
import axios from "../../../api/request";
import { useLocale } from "../../../locales";

import {
  IconButton,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
  Container,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import { useTimeTrackerContext } from "../../../store/context/TimeTrackerContext";
import { useSelector } from "react-redux";

const LeftSide = ({ data }) => {
  const navigate = useNavigate();
  // const { role } = useSelector((state) => state.userInfos);
  const selectedUserState = useSelector((state) => state.userInfos);
  const role = localStorage.getItem("role");
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [enableLoading, setEnableLoading] = useState(false);
  const [change, setChange] = useState(false);
  const [enableEmployee, setEnable] = useState(false);

  const [newData, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    cni: "",
    salaryPerDay: 0,
    balance: 0,
    subscription: 0,
    feesPercentage: 0,
    requestedBalance: 0,
    hasAppliedReferralCode: true,
    giftBalance: 0,
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
  }, [data]);
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

    if (newData.rib === data.data.withdrawalAccount.rib) delete tmpData.rib;
    if (newData.phone === data.data.phone.number) delete tmpData.phone;
    if (newData.password === "") delete tmpData.password;
    tmpData.givenSalaryPercentage = newData.givenSalaryPercentage / 100;

    if (newData.phone.length < 8 || newData.phone.length > 15) {
      toast(formatMessage({ id: "employee.phoneerror" }), {
        position: "top-right",
        theme: "colored",
        type: "error",
      });
      setSaveLoading(false)
    } else {
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
        toast(result?.response?.data?.message, {
          position: "top-right",
          theme: "colored",
          type: "error",
        });
      }
      setSaveLoading(false);
    }
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
    let file = new FormData();
    file.append("documentType", documents?.type);
    let result;
    if (documents.front != "" && documents.front != "") {
      file.append("document", documents.front);
      file.append("sideType", "FRONT");
      result = await axios.post(
        `/account/kyc/upload?userId=${data?.data?._id}`,
        file
      );
    }
    if (documents.back != "" && documents.back != "") {
      file.append("document", documents.back);
      file.append("sideType", "BACK");
      result = await axios.post(
        `/account/kyc/upload?userId=${data?.data?._id}`,
        file
      );
    }
    if (result?.status == "success")
      toast(formatMessage({ id: "response.kyc.add" }), {
        position: "top-right",
        theme: "colored",
        type: "success",
      });
    setVisibleUpload(false);
  };

  return (
    <Container maxWidth="xl">
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
          </div>
          <div className="col-md-8">
            {/* <div className="row">
              <div className="col-md-6">
                <TextField
                  label={"Vacation days used"}
                  value={""}
                  fullWidth
                  margin="dense"
                />
              </div>
              <div className="col-md-6">
              <TextField
                  label={"Worked hours"}
                  value={""}
                  fullWidth
                  margin="dense"
                />
              </div>
            </div> */}

            {/* {selectedUserState?.company?.features?.includes("DEFAULT") || selectedUserState?.company?.features?.includes("ALL") ? ( */}
            <>
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

              {selectedUserState?.manages?.filter((ft) => ft?.features?.includes("DEFAULT"))?.length > 0 ||
                selectedUserState?.manages?.filter((ft) => ft?.features?.includes("ALL"))?.length > 0 ||
                selectedUserState?.company?.features?.includes("ALL") ||
                selectedUserState?.company?.features?.includes("DEFAULT")
                ?
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
                {selectedUserState?.manages?.filter((ft) => ft?.features?.includes("DEFAULT"))?.length > 0 ||
                  selectedUserState?.manages?.filter((ft) => ft?.features?.includes("ALL"))?.length > 0 ||
                  selectedUserState?.company?.features?.includes("ALL") ||
                  selectedUserState?.company?.features?.includes("DEFAULT")
                  ?
                  <div className="col-md-4">
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
                      disabled={role === "Employer" && selectedUserState?.manages?.length < 1}
                      fullWidth
                      margin="dense"
                    />
                  </div> : ""}

                {selectedUserState?.manages?.filter((ft) => ft?.features?.includes("DEFAULT"))?.length > 0 ||
                  selectedUserState?.manages?.filter((ft) => ft?.features?.includes("ALL"))?.length > 0 ||
                  selectedUserState?.company?.features?.includes("ALL") ||
                  selectedUserState?.company?.features?.includes("DEFAULT")
                  ?
                  <div className="col-md-5">
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

                {selectedUserState?.manages?.filter((ft) => ft?.features?.includes("DEFAULT"))?.length > 0 ||
                  selectedUserState?.manages?.filter((ft) => ft?.features?.includes("ALL"))?.length > 0 ||
                  selectedUserState?.company?.features?.includes("ALL") ||
                  selectedUserState?.company?.features?.includes("DEFAULT")
                  ?
                  <div className="col-md-3">
                    <TextField
                      label={formatMessage({ id: "employee.solde" })}
                      value={newData.balance}
                      onChange={(e) => {
                        setData({
                          ...newData,
                          balance: e.target.value,
                        });
                        setChange(true);
                      }}
                      disabled={role !== "Admin"}
                      fullWidth
                      margin="dense"
                    />
                  </div> : ""}

                {/* {selectedUserState?.manages?.filter((ft) => ft?.features?.includes("DEFAULT"))?.length > 0 ||
                  selectedUserState?.manages?.filter((ft) => ft?.features?.includes("ALL"))?.length > 0 ||
                  selectedUserState?.company?.features?.includes("ALL") ||
                  selectedUserState?.company?.features?.includes("DEFAULT")
                  ?
                  <div className="col-md-3">
                    <TextField
                      label={formatMessage({ id: "employee.soldeGift" })}
                      value={newData.giftBalance}
                      onChange={(e) => {
                        setData({
                          ...newData,
                          giftBalance: e.target.value,
                        });
                        setChange(true);
                      }}
                      disabled={role !== "Admin"}
                      fullWidth
                      margin="dense"
                    />
                  </div> : ""} */}
              </div>
            </>

            <div className="row">
              {selectedUserState?.manages?.filter((ft) => ft?.features?.includes("DEFAULT"))?.length > 0 ||
                selectedUserState?.manages?.filter((ft) => ft?.features?.includes("ALL"))?.length > 0 ||
                selectedUserState?.company?.features?.includes("ALL") ||
                selectedUserState?.company?.features?.includes("DEFAULT")
                ?
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

            {/* {selectedUserState?.company?.features?.includes("DEFAULT") || selectedUserState?.company?.features?.includes("ALL") ? */}
            <div className="row">
              {selectedUserState?.manages?.filter((ft) => ft?.features?.includes("DEFAULT"))?.length > 0 ||
                selectedUserState?.manages?.filter((ft) => ft?.features?.includes("ALL"))?.length > 0 ||
                selectedUserState?.company?.features?.includes("ALL") ||
                selectedUserState?.company?.features?.includes("DEFAULT")
                ?
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
              {role === "Admin" && (
                <div
                  className="col-md-auto cellul"
                  onClick={() => setVisibleUpload(true)}
                >
                  <Cellul color={`var(--color-cyan-light)`}>
                    <img src="/icons/download.svg" />
                  </Cellul>
                </div>
              )}

              {selectedUserState?.manages?.filter((ft) => ft?.features?.includes("DEFAULT"))?.length > 0 ||
                selectedUserState?.manages?.filter((ft) => ft?.features?.includes("ALL"))?.length > 0 ||
                selectedUserState?.company?.features?.includes("ALL") ||
                selectedUserState?.company?.features?.includes("DEFAULT")
                ?
                <div className={role !== "Admin" ? "col-md-6" : "col-md-12"}>
                  <BasicSelect
                    margin="dense"
                    formControlProps={{ fullWidth: true, margin: "dense" }}
                    label={formatMessage({ id: "employee.monetization" })}
                    value={newData?.monetizationMethod}
                    disabled={
                      data?.data?.company?.monetizationMethod ===
                      "PAYED_BY_COMPANY"
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
          </div>
        </div>
        <Box className="row" style={{ width: "100%", margin: "5px 0 30px 0" }}>
          <Box
            mt={{ xs: 2 }}
            className="col-md-4"
            onClick={() => setOpen(true)}
          >
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
          fullWidth
          maxWidth="xs"
        >
          <DialogContent>
            <Typography fontSize={"17px"} textAlign={"center"} fontWeight={600} mb={2}>{formatMessage({ id: "employee.deletequestion" })}</Typography>
            <Typography variant='body2' textAlign={"center"} color={"#FA3E3E"}>{formatMessage({ id: "company.deletenote" })}</Typography>
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
    </Container>
  );
};

const EmployeeEdit = () => {
  const { id } = useParams();
  const { setEmployee } = useTimeTrackerContext();
  let { data } = getEmployeeById(id);
  useEffect(() => {
    setEmployee(data);
  }, [data]);
  return <LeftSide data={data} />;
};

export default EmployeeEdit;
