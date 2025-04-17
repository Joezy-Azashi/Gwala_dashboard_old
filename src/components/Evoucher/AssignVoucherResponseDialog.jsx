import React from 'react'
import { Box, Button, DialogContent, Typography } from '@mui/material';
import sent from '../../assets/assignSent.png'
import notsent from '../../assets/assignNotSent.png'
import { useNavigate } from 'react-router';
import { useLocale } from '../../locales';

const AssignVoucherResponseDialog = ({ method, respenseSendData, phoneNumbers, num, selectedAmount, setOpenRequestVouchers, setSendDialog, setActive }) => {
    const navigate = useNavigate()
    const { formatMessage } = useLocale();

    const checkSuccessResponseAllMethonds = () => {
        if ((method === "digital" || method === "physical") && respenseSendData !== "failure" || (method === "sms" && respenseSendData?.response?.data?.status !== "failure")) {
            return true
        } else {
            return false
        }
    }

    return (
        <DialogContent sx={{ padding: "1rem 1.7rem" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <img src={checkSuccessResponseAllMethonds() ? sent : notsent} width={65} alt="sent" />
            </Box>
            {checkSuccessResponseAllMethonds() ? (
                <>
                    <Typography textAlign={"center"} variant='h6' color={"#002B69"} fontWeight={"600"} my={1}>
                        {formatMessage({ id: "evoucher.assignvouchersend" })}
                    </Typography>
                    {method === "digital" ?
                        <Typography textAlign={"center"} variant='body2' color={"#002B69"}>{`${respenseSendData?.vouchers?.reduce((acc, el) => acc + el.quantity, 0)} ${formatMessage({ id: "evoucher.vouchersof" })} ${selectedAmount?.amount} MAD ${formatMessage({ id: "evoucher.hasbeensent" })} ${respenseSendData?.vouchers?.length} ${formatMessage({ id: "evoucher.employees" })}`}</Typography> :
                        method === "sms" ?
                            <Typography textAlign={"center"} variant='body2' color={"#002B69"}>{`${phoneNumbers?.reduce((acc, el) => acc + el.quantity, 0)} ${formatMessage({ id: "evoucher.vouchersof" })} ${selectedAmount?.amount} MAD ${formatMessage({ id: "evoucher.hasbeensent" })} ${phoneNumbers?.length} ${formatMessage({ id: "evoucher.employees" })}`}</Typography> :
                            <Typography textAlign={"center"} variant='body2' color={"#002B69"}>{`${formatMessage({ id: "evoucher.requestphysicalvsent" })} ${num} ${formatMessage({ id: "evoucher.vouchersof" })} ${selectedAmount?.amount} MAD ${formatMessage({ id: "evoucher.hasbeensent" })} ${formatMessage({ id: "evoucher.adminapproval" })}`}</Typography>
                    }
                </>
            ) :
                (method === "sms" && respenseSendData?.response?.data?.status === "failure" && respenseSendData?.response?.data?.errorKey !== "voucher.not.enough") ?
                    <>
                        <Typography textAlign={"center"} variant='h6' color={"red"} fontWeight={"600"} my={1}>
                            {formatMessage({ id: "evoucher.assignvouchersendfailuresms" })}
                        </Typography>
                        {respenseSendData?.response?.data?.errors?.map((el) => {
                            return (
                                <Typography textAlign={"center"} variant='body2' color={"#FA3E3E"} whiteSpace={"nowrap"}>
                                    {`Line: ${el?.line}: ${el?.type}`}
                                </Typography>
                            )
                        })
                        }
                    </> :
                    <>
                        <Typography textAlign={"center"} variant='h6' color={"#FA3E3E"} fontWeight={"600"} my={1}>
                            {formatMessage({ id: "evoucher.assignvouchersendfailure" })}
                        </Typography>
                        <Typography textAlign={"center"} variant='body2' color={"#FA3E3E"}>
                            {formatMessage({ id: "evoucher.assignvouchermessagenotenough" })}
                        </Typography>
                    </>
            }

            <Box sx={{ display: "flex", justifyContent: "center", columnGap: "10px" }} mt={2}>
                {(respenseSendData === "failure" && method === "digital") || (method === "sms" && respenseSendData?.response?.data?.errorKey === "voucher.not.enough") ?
                    <Button
                        onClick={() => { setOpenRequestVouchers(true); setSendDialog(false); setActive(0) }}
                        variant="outlined"
                        fullWidth
                        sx={{
                            color: "var(--color-dark-blue) ",
                            backgroundColor: "var(--color-cyan) !important",
                            borderRadius: "20px",
                            textTransform: "capitalize",
                            fontWeight: "600",
                            borderColor: "var(--color-cyan) !important",
                            width: "20rem"
                        }}
                    >
                        {formatMessage({ id: "evoucher.requestvoucher" })}
                    </Button> : null}

                <Button
                    onClick={() => {
                        if (checkSuccessResponseAllMethonds()) {
                            navigate(-1)
                        } else if (method === "sms" && respenseSendData?.response?.data?.status === "failure" && respenseSendData?.response?.data?.errorKey !== "voucher.not.enough") {
                            setSendDialog(false)
                            setActive(4)
                        } else {
                            setSendDialog(false)
                        }
                    }}
                    variant="outlined"
                    fullWidth
                    sx={{
                        color: checkSuccessResponseAllMethonds() ? "var(--color-dark-blue) " : "#FFFFFF",
                        backgroundColor: checkSuccessResponseAllMethonds() ? "var(--color-cyan) !important" : "#FA3E3E !important",
                        borderRadius: "20px",
                        textTransform: "capitalize",
                        fontWeight: "600",
                        borderColor: checkSuccessResponseAllMethonds() ? "var(--color-cyan) !important" : "#FA3E3E !important",
                        width: "20rem"
                    }}
                >
                    {checkSuccessResponseAllMethonds() ? formatMessage({ id: "evoucher.close" }) : "Cancel"}
                </Button>
            </Box>
        </DialogContent>
    )
}

export default AssignVoucherResponseDialog