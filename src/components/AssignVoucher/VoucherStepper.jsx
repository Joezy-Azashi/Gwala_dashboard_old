import React from 'react'
import { Step, StepLabel, Stepper } from '@mui/material'
import { useLocale } from '../../locales';

const VoucherStepper = ({ active, method, injection, setActiveTab, selectedUserState }) => {
    const { formatMessage } = useLocale();

    return (
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
                        {formatMessage({ id: "evoucher.assignbranch" })}
                    </StepLabel>
                </Step>
            )}

            <Step
                sx={{ cursor: "pointer" }}
                onClick={() => setActiveTab(selectedUserState?.manages?.length < 1 ? 0 : 1)}
            >
                <StepLabel>{formatMessage({ id: "evoucher.injectionmethod" })}</StepLabel>
            </Step>

            {injection === "individual" &&
                <Step
                    sx={{ cursor: "pointer" }}
                    onClick={() => setActiveTab(selectedUserState?.manages?.length < 1 ? 1 : 2)}
                >
                    <StepLabel>{formatMessage({ id: "evoucher.vouchertype" })}</StepLabel>
                </Step>
            }

            {injection === "individual" &&
                <Step
                    sx={{ cursor: "pointer" }}
                    onClick={() => setActiveTab(selectedUserState?.manages?.length < 1 ? 2 : 3)}
                >
                    <StepLabel>
                        {formatMessage({ id: "evoucher.voucheramount" })}
                    </StepLabel>
                </Step>
            }

            {injection === "individual" &&
                <Step
                    sx={{ cursor: "pointer" }}
                    onClick={() => setActiveTab(selectedUserState?.manages?.length < 1 ? 3 : 4)}
                >
                    <StepLabel>
                        {formatMessage({ id: "evoucher.assignmentmethod" })}
                    </StepLabel>
                </Step>
            }

            {method !== "" || injection === "mass" ?
                <Step
                    sx={{ cursor: "pointer" }}
                    onClick={() => setActiveTab(selectedUserState?.manages?.length > 0 ? 5 : 4)}
                >
                    <StepLabel>
                        {method === "physical" ? formatMessage({ id: "evoucher.quantitytoassign" }) :
                            method === "sms" || injection === "mass" ? formatMessage({ id: "evoucher.uploadfile" }) :
                                formatMessage({ id: "evoucher.assignto" })
                        }
                    </StepLabel>
                </Step> : null
            }

            {injection !== "mass" &&
                <Step
                    sx={{ cursor: "pointer" }}
                    onClick={() => setActiveTab(selectedUserState?.manages?.length > 0 ? 6 : 5)}
                >
                    <StepLabel>{formatMessage({ id: "evoucher.confirm" })}</StepLabel>
                </Step>
            }
        </Stepper>
    )
}

export default VoucherStepper