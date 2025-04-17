import React, { useState } from 'react'
import { useLocale } from '../../locales';
import { read, utils } from "xlsx";
import { Box, Dialog, DialogContent, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import BalanceDoc from './BalanceDoc';
import { Button } from '../../components/UI';
import axios from '../../api/request';
import { toast } from 'react-toastify';
import { Close } from '@mui/icons-material';

function UploadEmployeeBalances({ open, onClose }) {

    const { formatMessage } = useLocale();

    const columns = [
        { id: "no", label: "No.", width: 40 },
        { id: "cni", label: "CNI", width: 100 },
        { id: "reason", label: formatMessage({ id: "timetracker.vacation.reason" }), width: 100 }
    ];

    const [file, setFile] = useState([]);
    const [notValid, setNotValid] = useState([]);
    const [openNotValid, setOpenNotValid] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [error, setError] = useState(false);

    const readExcelFile = async (file) => {
        try {
            const data = await readFileAsBinaryString(file);
            const workbook = read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0]; // Assuming you want the first sheet
            const sheet = utils.sheet_to_json(workbook.Sheets[sheetName]);

            const set = new Set();

            if (sheet.some((object) => set.size === (set.add(object.cni), set.size))) {
                toast(formatMessage({ id: "employee.upload.duplicate" }), {
                    position: "top-right",
                    autoClose: 5000,
                    type: "error",
                    theme: "colored",
                });
            } else {
                UploadSheet(sheet)
            }
        } catch (error) {

        } finally {

        }
    };

    const UploadSheet = async (sheet) => {
        setSaveLoading(true)
        setError(false)
        try {
            const result = await axios.patch(`/v2/account/balance/bulk`, sheet);
            if (result?.status === "success") {
                if (result?.notValidCNI?.length > 0) {
                    setNotValid(result?.notValidCNI)
                    setOpenNotValid(true)
                }
                toast(result?.message, {
                    position: "top-right",
                    autoClose: 5000,
                    type: "success",
                    theme: "colored",
                });
                onClose()
            } else {
                setError(true);
            }
            setSaveLoading(false)
            setFile([])
        } catch (e) {
            setSaveLoading(false)
        }
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

    const handleSubmit = () => {
        if (file.length > 0) readExcelFile(file[0]);
    };

    const handleClose = (event, reason) => {
        if (reason && reason == "backdropClick") {
            return;
        } else {
            setOpenNotValid(false)
        }
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                sx={{
                    "& .MuiDialog-paper": { width: "50%" },
                }}
                PaperProps={{ sx: { borderRadius: "35px" } }}
                maxWidth="md"
            >
                <DialogContent
                    sx={{
                        padding: "15px",
                        display: "flex",
                        gap: "19px",
                        flexDirection: "column",
                    }}
                >
                    <BalanceDoc
                        setFile={setFile}
                        file={file}
                        title={formatMessage({ id: "advance.ulpoad.manual.title" })}
                        description={formatMessage({
                            id: "employee.upload.note",
                        })}
                        accept={{
                            "application/vnd.ms-excel": [".xls", ".xlsx"],
                            "text/csv": [".csv"],
                        }}
                    >
                        {error && (
                            <p style={{ fontSize: "14px", color: "red", lineHeight: "24px" }}>
                                {formatMessage({ id: "employee.upload.error" })}
                            </p>
                        )}
                        <Button
                            text={formatMessage({ id: "advance.sent" })}
                            loading={saveLoading}
                            onClick={handleSubmit}
                        />
                    </BalanceDoc>
                </DialogContent>
            </Dialog>

            {/* Popup for not valid CNIs */}
            <Dialog
                open={openNotValid}
                onClose={handleClose}
                sx={{
                    "& .MuiDialog-paper": { width: "50%" },
                }}
                PaperProps={{ sx: { borderRadius: "35px" } }}
                maxWidth="md"
            >
                <DialogContent sx={{ padding: "30px" }}>
                    <Box sx={{ display: "flex", justifyContent: "end" }}>
                        <IconButton onClick={() => handleClose()} sx={{ float: "right" }}><Close color="paper" /></IconButton>
                    </Box>
                    <Typography sx={{ marginBottom: "10px" }}>{formatMessage({ id: "employee.upload.notupdated" })}</Typography>

                    <TableContainer
                        sx={{
                            height: "68vh",
                            overflowX: "hidden",
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
                                        {
                                            notValid?.map((el, index) => {
                                                return (
                                                    <TableRow
                                                        hover
                                                        role="checkbox"
                                                        tabIndex={-1}
                                                        key={index}
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
                                                                    padding: "1rem",
                                                                    backgroundColor: "#F7F0F0",
                                                                    whiteSpace: "nowrap",
                                                                    textTransform: "capitalize",
                                                                }}
                                                            >
                                                                {index + 1}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span
                                                                style={{
                                                                    display: "flex",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                    padding: "1rem",
                                                                    backgroundColor: "#F7F0F0",
                                                                    whiteSpace: "nowrap",
                                                                    textTransform: "capitalize",
                                                                }}
                                                            >
                                                                {el.cni}
                                                            </span>
                                                        </TableCell>

                                                        <TableCell>
                                                            <span
                                                                style={{
                                                                    display: "flex",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                    padding: "1rem",
                                                                    backgroundColor: "#F7F0F0",
                                                                    whiteSpace: "nowrap",
                                                                    textTransform: "capitalize",
                                                                }}
                                                            >
                                                                {el?.message}
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
                        {/* </InfiniteScroll> */}
                    </TableContainer>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default UploadEmployeeBalances