import React, { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Container, Grid, IconButton, Step, StepLabel, Stepper, Typography } from '@mui/material'
import { KeyboardBackspace } from '@mui/icons-material'
import { useLocale } from '../../locales';
import { useSelector } from 'react-redux';
import SelectBranch from '../../components/AssignVoucher/SelectBranch';
import { convertVoucher, getVouchers } from '../../api';
import SelectVoucherType from '../../components/AssignVoucher/SelectVoucherType';
import VoucherAmountConvert from '../../components/AssignVoucher/VoucherAmountConvert';
import ConfirmConvert from '../../components/AssignVoucher/ConfirmConvert';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const INITIAL_FILTER = {
  statu: "",
  companyId: "",
  type: "",
};

const VoucherConverter = () => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate()
  const selectedUserState = useSelector((state) => state.userInfos);

  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [type, setType] = useState("");
  const [num, setNum] = useState(0)
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [gVouchers, setGVouchers] = useState([]);
  const [rVouchers, setRVouchers] = useState([]);
  const [filter, setFilter] = useState(INITIAL_FILTER);
  const [screenWidth, setscreenWidth] = useState(window.innerWidth)

  window.addEventListener("resize", function () {
    setscreenWidth(window.innerWidth)
  });

  const setActiveTab = (index) => {
    if (index === 0) setActive(index);
    if (index === 1 && selectedBranch?.name && selectedUserState?.manages?.length > 0) setActive(index);
    if (index === 1 && type !== "" && selectedUserState?.manages?.length < 1) setActive(index);
    if (index === 2 && type !== "" && selectedUserState?.manages?.length > 0) setActive(index);
    if (index === 2 && num !== 0 && selectedUserState?.manages?.length < 1) setActive(index);
    if (index === 3 && num !== 0 && selectedUserState?.manages?.length > 0) setActive(index);
  };

  const handleSelectBranch = (el) => {
    setSelectedBranch({ name: el?.name, id: el?._id });
  };

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

  const buttonDisable = () => {
    if (active === 0 && selectedUserState?.manages?.length > 0 && selectedBranch.length < 1) { return true; }
    if (active === 0 && selectedUserState?.manages?.length < 1 && type === "") { return true; }
    if (active === 1 && selectedUserState?.manages?.length > 0 && type === "") { return true; }
    if (active === 1 && selectedUserState?.manages?.length < 1 && num === 0) { return true; }
    if (active === 2 && selectedUserState?.manages?.length > 0 && num === 0) { return true; }
  }

  const onConvertVoucher = async () => {
    setSendLoading(true)

    const dataToSend = {
      voucherType: type,
      amount: selectedAmount.amount,
      vouchers: [
        {
          quantity: num
        }
      ]
    }
    if (selectedUserState?.manages?.length > 0) dataToSend.companyId = selectedBranch.id;

    const data = await convertVoucher(dataToSend)
    if (data) {
      setSendLoading(false)

      toast(formatMessage({ id: "evoucher.convertsuccess" }), {
        position: "top-right",
        type: "success",
        theme: "colored",
      });

      navigate('/e-vouchers')
    }
  }

  return (
    <Box>
      {active !== 0 && (
        <IconButton
          sx={{
            gap: 1,
            color: "#000",
            position: {xs: "static", sm: "absolute"},
            top: {sm: "85px", md: "150px"},
            backgroundColor: "#fff !important",
            marginLeft: "1.5rem"
          }}
          onClick={() => setActive(active - 1)}
        >
          <KeyboardBackspace />
          <Typography fontWeight={600}>{formatMessage({ id: "evoucher.previous" })}</Typography>
        </IconButton>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, userSelect: "none" }} mt={2}>
        <img src="/newfav.png" width={50} alt="favicon" />
        <hr style={{ height: "2.3rem", width: ".13rem", backgroundColor: "#347AF0", border: "none" }} />
        <Typography variant='h6' fontWeight={600} color={"#347AF0"}>{formatMessage({ id: "evoucher.voucherconverter" })}</Typography>
      </Box>

      {/* Steppers */}
      <Box sx={{ display: "flex", justifyContent: "center" }} mt={2}>
        <Box sx={{ width: "60%" }}>
          <Stepper
            activeStep={active}
            alternativeLabel
            sx={{
              "& .Mui-completed": {
                color: "var(--color-dark-blue) !important",
              },
              "& .Mui-active": {
                color: "var(--color-dark-blue) !important",
                fontWeight: "600 !important",
              },
              userSelect: "none"
            }}
          >

            {selectedUserState?.manages?.length > 0 && (
              <Step
                sx={{ cursor: "pointer" }}
                onClick={() => setActiveTab(0)}
              >
                <StepLabel>
                  {formatMessage({ id: "evoucher.selectbranch" })}
                </StepLabel>
              </Step>
            )}

            <Step
              sx={{ cursor: "pointer" }}
              onClick={() => setActiveTab(selectedUserState?.manages?.length < 1 ? 0 : 1)}
            >
              <StepLabel>{formatMessage({ id: "evoucher.vouchertype" })}</StepLabel>
            </Step>

            <Step
              sx={{ cursor: "pointer" }}
              onClick={() => setActiveTab(selectedUserState?.manages?.length < 1 ? 1 : 2)}
            >
              <StepLabel>
                {formatMessage({ id: "evoucher.amounttoconvert" })}
              </StepLabel>
            </Step>

            <Step
              sx={{ cursor: "pointer" }}
              onClick={() => setActiveTab(selectedUserState?.manages?.length < 1 ? 2 : 3)}
            >
              <StepLabel>
                {formatMessage({ id: "evoucher.confirm" })}
              </StepLabel>
            </Step>
          </Stepper>
        </Box>
      </Box>

      {/* Pages */}
      <Container
        maxWidth={"md"}
        sx={{ marginTop: "1.5rem", minHeight: screenWidth < 1367 ? "16rem" : screenWidth < 1518 && screenWidth > 1367 ? "24rem" : screenWidth < 1708 && screenWidth > 1518 ? "29rem" : "31rem" }}
      >
        {/* Select Branch */}
        {active === 0 && selectedUserState?.manages?.length > 0 && (
          <SelectBranch
            selectedBranch={selectedBranch}
            filter={filter}
            setFilter={setFilter}
            setEmployees={[]}
            handleSelectBranch={handleSelectBranch}
            selectedUserState={selectedUserState}
            convert={true}
          />
        )}


        {/* Vocuher Type */}
        {(active === 1 && selectedUserState?.manages?.length > 0) || (active === 0 && selectedUserState?.manages?.length < 1) ? (
          <SelectVoucherType
            loading={loading}
            type={type}
            setType={setType}
            vUsers={[]}
            setEmployees={[]}
            vouchers={vouchers}
            selectedAmount={selectedAmount}
            setSelectedAmount={setSelectedAmount}
            num={num}
            setNum={setNum}
            convert={true}
          />
        ) : ""}

        {/* Voucher Amount */}
        {(active === 2 && selectedUserState?.manages?.length > 0) || (active === 1 && selectedUserState?.manages?.length < 1) ? (
          <VoucherAmountConvert
            type={type}
            gVouchers={gVouchers}
            rVouchers={rVouchers}
            num={num}
            setNum={setNum}
            selectedAmount={selectedAmount}
            setSelectedAmount={setSelectedAmount}
          />
        ) : ""}

        {/* Confirm */}
        {(active === 3 && selectedUserState?.manages?.length > 0) || (active === 2 && selectedUserState?.manages?.length < 1) ? (
          <ConfirmConvert
            selectedUserState={selectedUserState}
            type={type}
            selectedAmount={selectedAmount}
            num={num}
            gVouchers={gVouchers}
            rVouchers={rVouchers}
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
            {
              (active < 3 && selectedUserState?.manages?.length > 0) || (active < 2 && selectedUserState?.manages?.length < 1) ?
                <Button
                  id="nextbtn"
                  onClick={() => setActive(active + 1)}
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
                :
                <Button
                  onClick={() => {
                    onConvertVoucher()
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
                  {sendLoading ? <CircularProgress
                    size={25}
                    sx={{
                      color: "#fff !important",
                    }}
                  /> : formatMessage({ id: "evoucher.confirm" })}
                </Button>
            }
          </Grid>
        </Grid>
      </Container>
    </Box >
  )
}

export default VoucherConverter