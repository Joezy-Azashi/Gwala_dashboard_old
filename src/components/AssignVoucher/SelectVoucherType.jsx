import React from 'react'
import { useLocale } from '../../locales';
import { Box, Grid, Typography } from '@mui/material';
import PageSpinner from '../pagespinner/PageSpinner';
import genselected from "../../assets/general.png";
import genunselected from "../../assets/general2.png";
import resunselected from "../../assets/restaurant2.png";
import resselected from "../../assets/restaurant.png";
import coupon from '../../assets/coupon.png'

const SelectVoucherType = ({loading, type, setType, vUsers, setEmployees, vouchers, convert, selectedAmount, setSelectedAmount, num, setNum}) => {
    const { formatMessage } = useLocale();

    return (
        <Box>
            <Typography textAlign={"center"} fontWeight={600} fontSize={"1rem"}>
                {formatMessage({ id: "evoucher.typeof" })}
            </Typography>
            <Typography textAlign={"center"} variant="body2">
                {convert ? "" : formatMessage({ id: "evoucher.choosevoucher" })}
            </Typography>

            <Grid container spacing={2} mt={2}>
                <Grid item xs={vouchers?.filter((ft) => ft.data.reduce(
                    (counter, cvalue) =>
                        counter + cvalue.amount * cvalue.quantity,
                    0
                ) !== 0).length === 1 ? 3.5 : 1} />
                {loading ?
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "20vh",
                            width: "100%"
                        }}
                    >
                        <PageSpinner />
                    </Box> :
                    vouchers?.filter((ft) => ft.data.reduce(
                        (counter, cvalue) =>
                            counter + cvalue.amount * cvalue.quantity,
                        0
                    ) !== 0)?.length < 1 ?
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }} mt={5}>
                            <Box>
                                <Typography textAlign={"center"} variant='h6' color={"var(--color-dark-blue)"}>{formatMessage({ id: "evoucher.novoucher" })}</Typography>
                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} mt={2}>
                                    <img src={coupon} alt="no vouchers" />
                                </Box>
                            </Box>
                        </Box> :
                        vouchers?.filter((ft) => ft.data.reduce(
                            (counter, cvalue) =>
                                counter + cvalue.amount * cvalue.quantity,
                            0
                        ) !== 0)?.map((el) => {
                            return (
                                <Grid key={el.type} item xs={12} sm={5}>
                                    <Box
                                        onClick={() => {
                                            if(convert){
                                                selectedAmount.quantity += num;
                                                setNum(0)
                                                setSelectedAmount([])
                                            }
                                            setType(el.type); 
                                            setEmployees([
                                                ...vUsers?.docs?.map((el) => {
                                                    return {
                                                        user: el._id,
                                                        quantity: 0,
                                                        fullName: `${el.firstName} ${el.lastName}`,
                                                        selected: false,
                                                    };
                                                }),
                                            ])
                                        }}
                                        sx={{
                                            backgroundImage:
                                                el.type === "GENERAL"
                                                    ? `url(${type === "GENERAL" ? genselected : genunselected
                                                    })`
                                                    : `url(${type === "RESTAURANT"
                                                        ? resselected
                                                        : resunselected
                                                    })`,
                                            backgroundSize: "contain",
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center",
                                            width: "100%",
                                            height: "12rem",
                                            borderRadius: "12px",
                                            cursor: "pointer",
                                            userSelect: "none",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                height: "100%",
                                            }}
                                        >
                                            <Box>
                                                <Typography
                                                    variant="h5"
                                                    textAlign={"center"}
                                                    fontWeight={"600"}
                                                    color={
                                                        type === el.type
                                                            ? "#fff"
                                                            : "var(--color-dark-blue)"
                                                    }
                                                >
                                                    {el.type}
                                                </Typography>
                                                <Typography
                                                    variant={"body2"}
                                                    color={
                                                        type === el.type
                                                            ? "#fff"
                                                            : "var(--color-dark-blue)"
                                                    }
                                                    textAlign={"center"}
                                                >
                                                    {formatMessage({ id: "evoucher.voucher" })}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography
                                            sx={{ marginTop: "-1.8rem", marginRight: "2.5rem" }}
                                            fontSize={"12px"}
                                            color={
                                                type === el.type ? "#fff" : "var(--color-dark-blue)"
                                            }
                                            textAlign={"right"}
                                        >
                                            {el.data.reduce(
                                                (counter, cvalue) =>
                                                    counter + cvalue.amount * cvalue.quantity,
                                                0
                                            ).toLocaleString()}{" "}
                                            MAD {formatMessage({ id: "evoucher.remaining" })}
                                        </Typography>
                                    </Box>
                                </Grid>
                            );
                        })}
                <Grid item xs={1} />
            </Grid>
        </Box>
    )
}

export default SelectVoucherType