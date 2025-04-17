import React, { useState } from 'react'
import { Box, Button, CircularProgress, Dialog, DialogContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useLocale } from '../../locales';
import EvoucherUpload from '../E-voucher/EvoucherUpload';
import axios from '../../api/request';
import FormData from 'form-data';
import correct from "../../assets/correct1.png"
import { toast } from 'react-toastify';
import moment from 'moment';

const TrackerExcelUpload = ({ setOpenUpload, getGiftCards, selectBrand }) => {
    const { formatMessage } = useLocale();
    const [loading, setLoading] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)
    const [file, setFile] = useState([])
    const [hasDuplicate, setHasDuplicate] = useState({ data: [], state: false })

    const columns = [
        { id: "code", label: "Code", width: "" },
        { id: "value", label: formatMessage({ id: "evoucher.vouchervalue" }), width: "" },
        { id: "expiry", label: formatMessage({ id: "evoucher.voucherexpiry" }), width: "" },
    ];

    const uploadExcelFile = () => {
        const dataToSend = new FormData();
        dataToSend.append("file", file[0]);
        dataToSend.append("type", selectBrand);

        setLoading(true)
        axios.post('/v2/inject/giftcards', dataToSend)
            .then((res) => {
                setLoading(false)
                if (res?.response?.data?.status !== "failure") {
                    toast(formatMessage({ id: "tracker.uploadsuccess" }), {
                        position: "top-right",
                        autoClose: 10000,
                        type: "success",
                        theme: "colored",
                    });
                    setOpenUpload(false)
                    getGiftCards()
                } else if (res?.response?.data?.data?.dupVouchers?.length > 0) {
                    setHasDuplicate({ data: res?.response?.data?.data?.dupVouchers, state: true })
                } else {
                    toast("An error occured, try again", {
                        position: "top-right",
                        type: "error",
                        theme: "colored",
                    });
                }
            })
            .catch((error) => {
                setLoading(false)
            })
    }

    return (
        <DialogContent sx={{ padding: "2rem 3.2rem" }}>
            {hasDuplicate?.state ?
                <>
                    <Typography fontWeight={600}> {formatMessage({ id: "evoucher.duplicatevouchercodes" })}</Typography>

                    <Box sx={{ width: "100%", overflow: "hidden", display: "flex" }}>
                        <TableContainer
                            sx={{
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
                                                    "& .MuiTableRow-root": { display: "none" },
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
                                                                padding: column.id === "icon" ? "" : ".5rem",
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
                                            {
                                                hasDuplicate?.data?.map((el, key) => {
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
                                                                    {el["Voucher Code"]}
                                                                </span>
                                                            </TableCell>

                                                            <TableCell>
                                                                <span
                                                                    style={{
                                                                        display: "block",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        padding: ".45rem",
                                                                        backgroundColor: "#F7F0F0",
                                                                        textTransform: "capitalize",
                                                                        whiteSpace: "nowrap"
                                                                    }}
                                                                >
                                                                    {el["Voucher Value"]}
                                                                </span>
                                                            </TableCell>

                                                            <TableCell>
                                                                <span
                                                                    style={{
                                                                        display: "block",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        padding: ".45rem",
                                                                        backgroundColor: "#F7F0F0",
                                                                        textTransform: "capitalize",
                                                                        whiteSpace: "nowrap"
                                                                    }}
                                                                >
                                                                    {moment(el["Expiry Date"]).format("DD/MM/YYYY")}
                                                                </span>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            }
                                        </TableBody>
                                    </>
                                }
                            </Table>
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <Button
                                    onClick={() => { getGiftCards(); setHasDuplicate({ data: [], state: false }); setOpenUpload(false) }}
                                    id="request-voucher"
                                    variant="outlined"
                                    size="large"
                                    fullWidth
                                    disabled={file?.length < 1 || loading}
                                    sx={{
                                        color: "#fff",
                                        backgroundColor: "var(--color-dark-blue) !important",
                                        borderRadius: "20px",
                                        textTransform: "capitalize",
                                        fontWeight: "600",
                                        border: "none !important",
                                        marginTop: "2rem",
                                        width: "200px"
                                    }}
                                >
                                    {formatMessage({ id: "employee.close" })}
                                </Button>
                            </Box>
                        </TableContainer>
                    </Box>
                </> :
                <>
                    <Typography fontWeight={600}>{formatMessage({ id: "evoucher.importxls" })}</Typography>
                    <Typography variant={"body2"}>{formatMessage({ id: "tracker.subtitle" })}</Typography>

                    <EvoucherUpload
                        setFile={setFile}
                        file={file}
                        format={"csv"}
                        accept={{
                            "text/csv": [".csv"]
                        }}
                    />

                    <Typography fontWeight={600} variant="body2">{formatMessage({ id: "evoucher.importantnotes" })}</Typography>
                    <ul>
                        <li>
                            <Typography variant="body2" sx={{ textDecoration: "underline" }}>
                                {formatMessage({ id: "evoucher.note1" })} <a href={selectBrand === "CARREFOUR" ? "/carrefour_voucher_codes.csv" : "/yassir_voucher_codes.csv"} download style={{ fontWeight: 600, color: "var(--color-dark-blue)" }}>
                                    {formatMessage({ id: "evoucher.note11" })}.
                                </a>
                            </Typography>
                        </li>
                    </ul>

                    <Button
                        onClick={() => uploadExcelFile()}
                        id="request-voucher"
                        variant="outlined"
                        size="large"
                        fullWidth
                        disabled={file?.length < 1 || loading}
                        sx={{
                            color: "var(--color-dark-blue)",
                            backgroundColor: "var(--color-cyan) !important",
                            borderRadius: "20px",
                            textTransform: "capitalize",
                            fontWeight: "600",
                            border: "none !important",
                            marginTop: "2rem"
                        }}
                    >
                        {loading ?
                            <CircularProgress
                                size={25}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: "var(--color-dark-blue)"
                                }}
                            />
                            : formatMessage({ id: "edoc.upload" })}
                    </Button>
                </>
            }

            <Dialog
                open={openSuccess}
                onClose={() => { setOpenSuccess(false); setOpenUpload(false); getGiftCards() }}
                fullWidth
                maxWidth="xs"
                sx={{ '& .MuiPaper-root': { borderRadius: "20px" } }}
            >
                <DialogContent sx={{ padding: "2rem 2.5rem" }}>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <img src={correct} width={65} alt="sent" />
                    </Box>

                    <Typography textAlign={"center"} fontWeight={600} mt={1.5}>{formatMessage({ id: "tracker.done" })}</Typography>
                    <Typography textAlign={"center"} variant={"body2"} mt={1}>{formatMessage({ id: "tracker.uploadsuccess" })}</Typography>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Button
                            onClick={() => { setOpenSuccess(false); setOpenUpload(false); getGiftCards() }}
                            id="request-voucher"
                            variant="outlined"
                            size="large"
                            fullWidth
                            sx={{
                                color: "var(--color-dark-blue)",
                                backgroundColor: "var(--color-cyan) !important",
                                borderRadius: "20px",
                                textTransform: "none",
                                fontWeight: "600",
                                border: "none !important",
                                whiteSpace: "nowrap",
                                marginTop: "1rem",
                                width: "60%"
                            }}
                        >
                            {formatMessage({ id: "tracker.checkit" })}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </DialogContent>
    )
}

export default TrackerExcelUpload