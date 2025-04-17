import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, Box, Button, CircularProgress, Container, Grid, IconButton, Typography, Icon, } from "@mui/material";
import { Close, KeyboardBackspace } from "@mui/icons-material";
import RequestVouchers from "../../components/Evoucher/RequestVouchers";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { getVouchers, getVouchersUsers, createAssingVouchers, createAssingVouchersSms, createAssingVouchersPhysical, injectExcel } from "../../api";
import { useLocale } from "../../locales";
import { read, utils } from "xlsx";
import FormData from "form-data";
import AssignVoucherResponseDialog from "../../components/Evoucher/AssignVoucherResponseDialog";
import AssignVoucherUserDetails from "../../components/Evoucher/AssignVoucherUserDetails";
import VoucherStepper from "../../components/AssignVoucher/VoucherStepper";
import SelectBranch from "../../components/AssignVoucher/SelectBranch";
import SelectVoucherType from "../../components/AssignVoucher/SelectVoucherType";
import InjectionMethod from "../../components/AssignVoucher/InjectionMethod";
import VoucherAmount from "../../components/AssignVoucher/VoucherAmount";
import AssignmentMethod from "../../components/AssignVoucher/AssignmentMethod";
import AssignTo from "../../components/AssignVoucher/AssignTo";
import ConfirmAssignment from "../../components/AssignVoucher/ConfirmAssignment";
import MassExcelResponseDialog from "../../components/Evoucher/MassExcelResponseDialog";
import { toast } from "react-toastify";
import UnfoundUsers from "../../components/Evoucher/UnfoundUsers";

function AssignVouchers() {
  const navigate = useNavigate();
  const { formatMessage } = useLocale();
  const selectedUserState = useSelector((state) => state.userInfos);
  const INITIAL_FILTER = {
    statu: "",
    companyId: "",
    type: "",
  };
  const [openRequestVouchers, setOpenRequestVouchers] = useState(false);
  const [filter, setFilter] = useState(INITIAL_FILTER);
  const [vouchers, setVouchers] = useState([]);
  const [gVouchers, setGVouchers] = useState([]);
  const [rVouchers, setRVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [respenseSendData, setRespenseSendData] = useState({});
  const [sendDialog, setSendDialog] = useState(false)
  const [massExcelDialog, setMassExcelDialog] = useState(false)
  const [openunfound, setOpenunfound] = useState({ open: false, data: [] })
  const [openMore, setOpenMore] = useState(false)
  const [increment, setIncrement] = useState(0)
  const [screenWidth, setscreenWidth] = useState(window.innerWidth)

  window.addEventListener("resize", function () {
    setscreenWidth(window.innerWidth)
  });

  const [employees, setEmployees] = useState([]);

  const [active, setActive] = useState(0);
  const [type, setType] = useState("");
  const [method, setMethod] = useState("");
  const [injection, setInjection] = useState("");
  const [file, setFile] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState([])
  const [num, setNum] = useState(0)
  const [selectedAmount, setSelectedAmount] = useState([]);
  const [load, setLoad] = useState(false);
  const [superSearch, setSuperSearch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [vUsers, setVUsers] = useState([]);

  let total = 0;
  employees.filter((ft) => ft.quantity > 0).forEach((el) => (total += el.quantity));

  const setActiveTab = (index) => {
    if (index === 0) setActive(index);
    if (index === 1 && selectedBranch?.id) setActive(index);
    if (index === 1 && type !== "") setActive(index);
    if (index === 4 && injection === "mass" && selectedUserState?.manages?.length < 1) setActive(index);
    if (index === 5 && injection === "mass" && selectedUserState?.manages?.length > 0) setActive(index);
    if (index === 2 && type !== "" && selectedUserState?.manages?.length < 1) setActive(index);
    if (index === 2 && injection !== "" && selectedUserState?.manages?.length > 0) setActive(index);
    if (index === 3 && type !== "" && selectedUserState?.manages?.length > 0) setActive(index);
    if (index === 3 && selectedAmount?.amount && selectedUserState?.manages?.length < 1) setActive(index);
    if (index === 4 && method !== "" && selectedUserState?.manages?.length < 1) setActive(index);
    if (index === 4 && selectedAmount?.amount && selectedUserState?.manages?.length > 0) setActive(index);
    if (index === 5 && selectedUserState?.manages?.length < 1 && total > 0) setActive(index);
    if (index === 5 && selectedUserState?.manages?.length > 0 && method !== "") setActive(index);
    if (index === 6 && total > 0) setActive(index);
    if (index === 6 && method === "sms" && file?.length > 0) setActive(index);
    if (index === 6 && method === "physical" && num > 0) setActive(index);
  };

  const handleSelectBranch = (el) => {
    setSelectedBranch({ name: el?.name, id: el?._id });
  };

  const buttonDisable = () => {
    if (active === 0 && selectedUserState?.manages?.length > 0 && selectedBranch.length < 1) { return true; }
    if (active === 0 && selectedUserState?.manages?.length < 1 && injection === "") { return true; }
    if (active === 1 && injection === '' && selectedUserState?.manages?.length > 0) { return true }
    if (active === 1 && type === "" && selectedUserState?.manages?.length < 1) { return true }
    if (active === 2 && type === "" && selectedUserState?.manages?.length > 0) { return true }
    if (active === 2 && !selectedAmount?.amount && selectedUserState?.manages?.length < 1) { return true }
    if (active === 3 && !selectedAmount?.amount && selectedUserState?.manages?.length > 0) { return true }
    if (active === 3 && selectedUserState?.manages?.length < 1 && method === "") { return true }
    if (active === 4 && selectedUserState?.manages?.length < 1 && method === "digital" && employees.filter((el) => el.selected).length < 1) { return true }
    if (active === 4 && selectedUserState?.manages?.length < 1 && method === "sms" && file.length < 1) { return true }
    if (active === 4 && selectedUserState?.manages?.length < 1 && method === "physical" && num === 0) { return true }
    if (active === 4 && selectedUserState?.manages?.length > 0 && method === "") { return true }
    if (active === 4 && selectedUserState?.manages?.length < 1 && injection === "mass" && file?.length < 1) { return true }
    if (active === 5 && method === "digital" && employees.filter((el) => el.selected).length < 1) {
      return true;
    }
    if (active === 5 && method === "sms" && file?.length < 1) { return true }
    if (active === 5 && method === "physical" && num === 0) { return true }
  };

  const readFileAsBinaryString = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        resolve(e.target.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsBinaryString(file);
    });
  };

  const readExcelFile = async (file) => {

    try {
      const data = await readFileAsBinaryString(file);
      const workbook = read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0]; // Assuming you want the first sheet
      const sheet = utils.sheet_to_json(workbook.Sheets[sheetName]);

      const deduplicatedData = Array?.from(new Set(sheet?.map(item => item?.Telephone)))?.map(Telephone => ({
        phone: Telephone,
        quantity: 1
      }));

      const result = deduplicatedData?.map(item => {
        const { phone, quantity } = item;
        const count = sheet.filter(d => d?.Telephone === phone)?.length;
        return { phone, quantity: quantity + count - 1 };
      });

      setPhoneNumbers(result);
    } catch (error) {

    } finally {

    }
  };

  useEffect(() => {
    if (file?.length > 0) readExcelFile(file[0])
  }, [file])

  const fetchData = async () => {
    setLoading(true);
    const { statu, type, companyId } = filter;
    const filters = {
      ...((statu && { status: statu }) || {}),
      ...((companyId && { companyId }) || {}),
      ...((type && { type: type.toUpperCase() }) || {}),
    };
    const queryParams = new URLSearchParams({ ...filters });
    const datav = await getVouchers(queryParams);
    setLoading(false);
    setVouchers([...datav]);
    setGVouchers([...datav.find((el) => el.type === "GENERAL")?.data.filter(el => el.quantity > 0)]);
    setRVouchers([...datav.find((el) => el.type === "RESTAURANT")?.data.filter(el => el.quantity > 0)]);
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  const getVoucherUsers = async () => {
    setLoad(true)
    const data = await getVouchersUsers(1, 1000, selectedBranch?.id);
    setVUsers(data)
    if (data) {
      setLoad(false)
      setEmployees([
        ...data.docs.map((el) => {
          return {
            user: el._id,
            quantity: 0,
            fullName: `${el.firstName} ${el.lastName}`,
            selected: false,
          };
        }),
      ]);
    }
  };

  const handleSelectAllEmployees = (e) => {
    if (selectedAmount?.quantity === 0 && e.target.checked) {
      const nextData = employees?.map(el => {
        return {
          user: el.user,
          quantity: 0,
          fullName: el?.fullName,
          selected: false,
        }
      });
      selectedAmount.quantity = type === 'GENERAL' ?
        gVouchers.filter((ft) => ft?.amount === selectedAmount?.amount)[0]?.quantity :
        rVouchers.filter((ft) => ft?.amount === selectedAmount?.amount)[0]?.quantity;
      setEmployees(nextData)
      setIncrement(increment + 1)
    } else if (e.target.checked) {
      selectedAmount.quantity = type === 'GENERAL' ?
        gVouchers.filter((ft) => ft?.amount === selectedAmount?.amount)[0]?.quantity :
        rVouchers.filter((ft) => ft?.amount === selectedAmount?.amount)[0]?.quantity;

      for (let i = 0; i < employees.length; i++) {
        employees[i].quantity = 1;
        employees[i].selected = true;
        selectedAmount.quantity--;
        if (selectedAmount?.quantity === 0) {
          break;
        }
      }
    } else {
      selectedAmount.quantity = type === 'GENERAL' ?
        gVouchers.filter((ft) => ft?.amount === selectedAmount?.amount)[0]?.quantity :
        rVouchers.filter((ft) => ft?.amount === selectedAmount?.amount)[0]?.quantity;

      const nextData = employees?.map(el => {
        return {
          user: el.user,
          quantity: 0,
          fullName: el?.fullName,
          selected: false,
        }
      });
      setEmployees(nextData)
      setIncrement(increment + 1)
    }
    fetchData()
  }

  const handleCloseRequest = (event, reason) => {
    if (reason && reason == "backdropClick") {
      return;
    } else {
      setOpenRequestVouchers(false);
    }
  };

  const assignVoucherToUser = async () => {
    if (method === "digital") {
      const dataToSend = {
        voucherType: type,
        amount: selectedAmount.amount,
        vouchers: employees.filter(el => el.selected).map(el => { return { user: el.user, quantity: el.quantity } })
      }
      if (selectedUserState?.manages?.length > 0) dataToSend.companyId = selectedBranch.id;
      setSendLoading(true)
      const data = await createAssingVouchers(dataToSend)
      if (data) {
        setRespenseSendData(data)
        setSendDialog(true)
        setSendLoading(false)
        setType("")
        setSelectedBranch([])
        localStorage.removeItem("selectedAmount")
      }
    } else if (method === "sms") {
      const dataToSend = new FormData();
      dataToSend.append("file", file[0]);
      dataToSend.append("voucherType", type);
      dataToSend.append("amount", selectedAmount.amount);

      if (selectedUserState?.manages?.length > 0) dataToSend.append("companyId", selectedBranch.id);
      setSendLoading(true)
      const data = await createAssingVouchersSms(dataToSend)

      if (data) {
        setRespenseSendData(data)
        setSendDialog(true)
        setSendLoading(false)
        localStorage.removeItem("selectedAmount")
      }
    } else {
      const dataToSend = {
        voucherType: type,
        amount: selectedAmount.amount,
        quantity: num
      }
      if (selectedUserState?.manages?.length > 0) dataToSend.companyId = selectedBranch.id;
      setSendLoading(true)
      const data = await createAssingVouchersPhysical(dataToSend)
      if (data) {
        setRespenseSendData(data)
        setSendDialog(true)
        setSendLoading(false)
        localStorage.removeItem("selectedAmount")
      }
    }
  }

  const InjectMassExcel = async () => {
    const dataToSend = new FormData();
    dataToSend.append("file", file[0]);
    if (selectedUserState?.manages?.length > 0) dataToSend.append("companyId", selectedBranch.id);

    setSendLoading(true)
    const data = await injectExcel(dataToSend)

    if (data?.response?.data?.errorKey === "voucher.not.enough") {
      setMassExcelDialog(true)
    } else if (data?.response?.data?.status === "failure" && data?.response?.data?.unfoundUser?.length > 0) {
      setOpenunfound({ open: true, data: data?.response?.data?.unfoundUser })
    } else if (data?.response?.data?.status === "failure") {
      toast("An error occured, try again", {
        position: "top-right",
        autoClose: 10000,
        type: "error",
        theme: "colored",
      });
    } else {
      toast(data?.unfoundUser?.length > 0 ? formatMessage({ id: "evoucher.massexcelsuccessunfound" }) : formatMessage({ id: "evoucher.massexcelsuccess" }), {
        position: "top-right",
        autoClose: 10000,
        type: data?.unfoundUser?.length > 0 ? "warning" : "success",
        theme: "colored",
      });

      if (data?.unfoundUser?.length > 0) {
        setOpenunfound({ open: true, data: data?.unfoundUser })
      } else {
        navigate("/e-vouchers")
      }
    }
    setSendLoading(false)
  }

  useEffect(() => {
    if (active === 5 && selectedUserState?.manages?.length > 0 && method === "digital" && employees.filter((el) => el.selected).length < 1) getVoucherUsers()
    if (active === 4 && selectedUserState?.manages?.length < 1 && method === "digital" && employees.filter((el) => el.selected).length < 1) getVoucherUsers()
  }, [active, type]);

  return (
    <Box>
      {active !== 0 && (
        <IconButton
          sx={{
            gap: 1,
            color: "#000",
            position: {xs: "", md: "absolute"},
            top: { md: "150px" },
            backgroundColor: "#fff !important",
            marginLeft: "1.5rem"
          }}
          onClick={() => {
            if (active === 4 && injection === "mass" && selectedUserState?.manages?.length < 1) {
              setActive(1)
            } else if (active === 5 && injection === "mass" && selectedUserState?.manages?.length > 0) {
              setActive(2)
            } else setActive(active - 1);
          }}
        >
          <KeyboardBackspace />
          <Typography fontWeight={600}>{formatMessage({ id: "evoucher.previous" })}</Typography>
        </IconButton>
      )}

      {/* Steppers */}
      <Box sx={{ display: "flex", justifyContent: "center" }} mt={4}>
        <Box sx={{ width: { xs: "80%", md: "60%" }, overflow: "auto" }}>
          <VoucherStepper
            active={active}
            method={method}
            injection={injection}
            setActiveTab={setActiveTab}
            selectedUserState={selectedUserState}
          />
        </Box>
      </Box>

      {/* Pages */}
      <Container
        maxWidth={"md"}
        sx={{ marginTop: "1.5rem", minHeight: screenWidth < 1367 ? "16rem" : screenWidth < 1518 && screenWidth > 1367 ? "24rem" : screenWidth < 1708 && screenWidth > 1518 ? "29rem" : "31rem" }}
      >

        {active === 0 && selectedUserState?.manages?.length > 0 && (
          <SelectBranch
            selectedBranch={selectedBranch}
            filter={filter}
            setFilter={setFilter}
            setEmployees={setEmployees}
            handleSelectBranch={handleSelectBranch}
            selectedUserState={selectedUserState}
          />
        )}

        {/* Vocuher Type */}
        {(active === 1 && selectedUserState?.manages?.length > 0) || (active === 0 && selectedUserState?.manages?.length < 1) ? (
          <InjectionMethod
            injection={injection}
            setInjection={setInjection}
          />
        ) : ""}

        {/* Injection Method */}
        {(active === 2 && selectedUserState?.manages?.length > 0) || (active === 1 && selectedUserState?.manages?.length < 1) ? (
          <SelectVoucherType
            loading={loading}
            type={type}
            setType={setType}
            vUsers={vUsers}
            setEmployees={setEmployees}
            vouchers={vouchers}
          />
        ) : null}

        {/* Voucher Amount */}
        {(active === 3 && selectedUserState?.manages?.length > 0) || (active === 2 && selectedUserState?.manages?.length < 1) ? (
          <VoucherAmount
            type={type}
            gVouchers={gVouchers}
            rVouchers={rVouchers}
            setNum={setNum}
            setFile={setFile}
            selectedAmount={selectedAmount}
            setSelectedAmount={setSelectedAmount}
            setEmployees={setEmployees}
            vUsers={vUsers}
          />
        ) : ""}

        {/* Assignment Method */}
        {(active === 3 && selectedUserState?.manages?.length < 1) || (active === 4 && selectedUserState?.manages?.length > 0) ?
          <AssignmentMethod
            selectedAmount={selectedAmount}
            num={num}
            setNum={setNum}
            setFile={setFile}
            method={method}
            setMethod={setMethod}
            total={total}
            setEmployees={setEmployees}
          />
          : ""}


        {/* Assign To */}
        {(active === 4 && selectedUserState?.manages?.length < 1) || (active === 5 && selectedUserState?.manages?.length > 0) ? (
          <AssignTo
            load={load}
            injection={injection}
            method={method}
            selectedBranch={selectedBranch}
            selectedAmount={selectedAmount}
            setSelectedAmount={setSelectedAmount}
            superSearch={superSearch}
            setSuperSearch={setSuperSearch}
            screenWidth={screenWidth}
            handleSelectAllEmployees={handleSelectAllEmployees}
            employees={employees}
            file={file}
            setFile={setFile}
            num={num}
            setNum={setNum}
          />
        ) : ""}

        {/* Confirm */}
        {(active === 6 && selectedUserState?.manages?.length > 0) || (active === 5 && selectedUserState?.manages?.length < 1) ? (
          <ConfirmAssignment
            num={num}
            setNum={setNum}
            method={method}
            injection={injection}
            selectedAmount={selectedAmount}
            setSelectedAmount={setSelectedAmount}
            selectedBranch={selectedBranch}
            phoneNumbers={phoneNumbers}
            selectedUserState={selectedUserState}
            type={type}
            employees={employees}
            setOpenMore={setOpenMore}
          />
        ) : ""}
      </Container>

      {/* Buttons */}
      <Container maxWidth={"sm"} sx={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button
              id="cancelbtn"
              onClick={() => navigate(-1)}
              variant="outlined"
              fullWidth
              disabled={sendLoading}
              sx={{
                color: "var(--color-dark-blue) ",
                backgroundColor: "var(--color-cyan) !important",
                borderRadius: "20px",
                textTransform: "capitalize",
                fontWeight: "600",
                borderColor: "var(--color-cyan) !important",
              }}
            >
              {formatMessage({ id: "evoucher.cancel" })}
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            {injection === "mass" && ((active === 4 && selectedUserState?.manages?.length < 1) || (active === 5 && selectedUserState?.manages?.length > 0)) ?
              <Button
                onClick={() => { InjectMassExcel() }}
                variant="outlined"
                fullWidth
                disabled={injection === "mass" && file?.length < 1}
                sx={{
                  color: "#fff !important",
                  backgroundColor: "var(--color-dark-blue) !important",
                  borderRadius: "20px",
                  textTransform: "capitalize",
                  fontWeight: "600",
                  borderColor: "var(--color-dark-blue) !important",
                  opacity: injection === "mass" && file?.length < 1 && 0.5,
                }}
              >
                {sendLoading ? <CircularProgress
                  size={25}
                  sx={{
                    color: "#fff !important",
                  }}
                /> : formatMessage({ id: "evoucher.confirm" })}
              </Button>
              :
              (active < 6 && selectedUserState?.manages?.length > 0) || (active < 5 && selectedUserState?.manages?.length < 1) ? (
                <Button
                  id="nextbtn"
                  onClick={() => {
                    if (active === 0 && injection === "mass" && selectedUserState?.manages?.length < 1) {
                      setActive(4)
                    } else if (active === 1 && injection === "mass" && selectedUserState?.manages?.length > 0) {
                      setActive(5)
                    } else {
                      setActive(active + 1)
                    }
                  }}
                  variant="outlined"
                  fullWidth
                  disabled={buttonDisable()}
                  sx={{
                    color: "#fff !important",
                    backgroundColor: "var(--color-dark-blue) !important",
                    borderRadius: "20px",
                    textTransform: "capitalize",
                    fontWeight: "600",
                    borderColor: "var(--color-dark-blue) !important",
                    opacity: buttonDisable() && 0.5,
                  }}
                >
                  {formatMessage({ id: "evoucher.next" })}
                </Button>
              ) : (
                <Button
                  onClick={() => { assignVoucherToUser() }}
                  variant="outlined"
                  fullWidth
                  disabled={buttonDisable()}
                  sx={{
                    color: "#fff !important",
                    backgroundColor: "var(--color-dark-blue) !important",
                    borderRadius: "20px",
                    textTransform: "capitalize",
                    fontWeight: "600",
                    borderColor: "var(--color-dark-blue) !important",
                    opacity: buttonDisable() && 0.5,
                  }}
                >
                  {sendLoading ? <CircularProgress
                    size={25}
                    sx={{
                      color: "#fff !important",
                    }}
                  /> : formatMessage({ id: "evoucher.confirm" })}
                </Button>
              )}
          </Grid>
        </Grid>
      </Container>

      {/* Assign voucher request response dialog */}
      <Dialog
        open={sendDialog}
        onClose={() => {
          if (reason && reason == "backdropClick")
            return;
          setSendDialog(false)
        }}
        fullWidth
        maxWidth="xs"
        sx={{ '& .MuiPaper-root': { borderRadius: "20px" } }}
      >
        <AssignVoucherResponseDialog
          method={method}
          respenseSendData={respenseSendData}
          phoneNumbers={phoneNumbers}
          num={num}
          selectedAmount={selectedAmount}
          setOpenRequestVouchers={setOpenRequestVouchers}
          setSendDialog={setSendDialog}
          setActive={setActive}
        />
      </Dialog>

      {/* Request Voucher Dialog */}
      <Dialog
        open={openRequestVouchers}
        onClose={handleCloseRequest}
        fullWidth
        maxWidth="sm"
        sx={{ "& .MuiPaper-root": { borderRadius: "20px" } }}
      >
        <RequestVouchers handleCloseRequest={handleCloseRequest} />
      </Dialog>

      {/* See more dialog */}
      <Dialog
        open={openMore}
        onClose={() => setOpenMore(false)}
        fullWidth
        maxWidth="md"
        className="pageScroll"
      >
        <Box sx={{ display: "flex", justifyContent: "end", margin: "1rem 1rem 0 0" }}>
          <IconButton onClick={() => setOpenMore(false)}>
            <Close size={"large"} />
          </IconButton>
        </Box>
        <DialogContent sx={{ padding: "1rem 2rem 3rem 2rem" }}>
          <AssignVoucherUserDetails
            employees={employees}
            phoneNumbers={phoneNumbers}
            method={method}
            selectedAmount={selectedAmount}
            sliceItem={false}
          />
        </DialogContent>
      </Dialog>

      {/* Mass Excel injection response */}
      <Dialog
        open={massExcelDialog}
        onClose={() => setMassExcelDialog(false)}
        fullWidth
        maxWidth="xs"
        sx={{ '& .MuiPaper-root': { borderRadius: "20px" } }}
      >
        <MassExcelResponseDialog
          type={type}
          selectedAmount={selectedAmount}
          gVouchers={gVouchers}
          rVouchers={rVouchers}
          setMassExcelDialog={setMassExcelDialog}
        />
      </Dialog>

      {/* Unfound user dialog */}
      <Dialog
        open={openunfound?.open}
        onClose={() => setOpenunfound({ open: false, data: [] })}
        fullWidth
        maxWidth="xs"
        sx={{ '& .MuiPaper-root': { borderRadius: "20px" } }}
      >
        <UnfoundUsers
          openunfound={openunfound}
          setOpenunfound={setOpenunfound}
        />
      </Dialog>
    </Box >
  );
}

export default AssignVouchers;
