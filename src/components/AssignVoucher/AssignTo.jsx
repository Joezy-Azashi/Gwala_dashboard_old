import React from 'react'
import { KeyboardArrowDown, KeyboardArrowUp, Search } from '@mui/icons-material';
import { Box, Checkbox, Container, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useLocale } from '../../locales';
import EvoucherUpload from "../../components/E-voucher/EvoucherUpload";
import PageSpinner from '../pagespinner/PageSpinner';
import PhysicalChequesComponent from '../Evoucher/PhysicalChequesComponent';

const AssignTo = ({load, method, injection, selectedBranch, selectedAmount, setSelectedAmount, superSearch, setSuperSearch, screenWidth, handleSelectAllEmployees, employees, file, setFile, num, setNum}) => {
    const { formatMessage } = useLocale();

    const columns = [
        { id: "check", label: "", width: "10%" },
        { id: "name", label: formatMessage({ id: "evoucher.fullname" }), width: "70%" },
        { id: "qty", label: "Qty", width: "20%" },
      ];

    return (
        method === "digital" ?
            // Digital method
            <Box>
                <Typography textAlign={"center"} fontWeight={600} fontSize={"1rem"}>
                    {formatMessage({ id: "evoucher.beneficiaryemployees" })} {selectedBranch?.name && "|" + " " + formatMessage({ id: "employer.branch" }) + " " + ":" + " " + selectedBranch?.name}
                </Typography>
                <Typography textAlign={"center"} variant="body2">
                    {formatMessage({ id: "evoucher.beneficiarynote" })}
                </Typography>
                <Typography textAlign={"center"} variant="body2">
                    {formatMessage({ id: "evoucher.remainingof" })} {selectedAmount.amount} MAD:{" "}
                    {selectedAmount.quantity}
                </Typography>

                <Container maxWidth={"sm"}>
                    <Box
                        sx={{
                            backgroundColor: "#F4F8FB",
                            borderRadius: "10px",
                            padding: "10px",
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <TextField
                                id="searchemployees"
                                fullWidth
                                value={superSearch}
                                onChange={(e) => setSuperSearch(e.target.value)}
                                sx={{
                                    backgroundColor: "#002B69",
                                    borderRadius: "20px",
                                    color: "#fff",
                                    width: "80%",
                                    "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                                    "& .MuiOutlinedInput-input": { color: "#fff" },
                                }}
                                size="small"
                                margin="dense"
                                placeholder={formatMessage({ id: "nav.search" })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search sx={{ color: "#fff" }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <TableContainer
                            sx={{
                                height: screenWidth < 1367 ? "11rem" : screenWidth < 1518 && screenWidth > 1367 ? "12rem" : screenWidth < 1708 && screenWidth > 1518 ? "20rem" : "24rem",
                                overflowX: "scroll",
                                "&::-webkit-scrollbar": {
                                    width: "8px",
                                    height: "3px"
                                }, "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: "#9E9E9E"
                                }
                            }}
                        >
                            <Table stickyHeader aria-label="sticky table" size="small">
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
                                                    {column.id === "check" ? (
                                                        <Checkbox
                                                            id="checkall"
                                                            onClick={(e) => handleSelectAllEmployees(e)}
                                                            size="small"
                                                            sx={{ padding: "0" }}
                                                        />
                                                    ) : (
                                                        column.label
                                                    )}
                                                </span>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {load ?
                                        <TableRow>
                                            <TableCell colSpan={3}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        height: "15vh",
                                                    }}
                                                >
                                                    <PageSpinner />
                                                </Box>
                                            </TableCell>
                                        </TableRow> :
                                        employees.length < 1 ?
                                            <TableRow>
                                                <TableCell colSpan={3}>
                                                    <Typography textAlign={"center"} my={5}>
                                                        {formatMessage({ id: "evoucher.noemployees" })}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow> :
                                            employees
                                                ?.filter((el) =>
                                                    el.fullName
                                                        .toLocaleLowerCase()
                                                        .includes(superSearch.toLocaleLowerCase())
                                                )
                                                .map((el, index) => {
                                                    return (
                                                        <TableRow
                                                            hover
                                                            role="checkbox"
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
                                                                        padding: ".55rem",
                                                                        backgroundColor: "#F7F0F0",
                                                                        whiteSpace: "nowrap",
                                                                        textTransform: "capitalize",
                                                                    }}
                                                                >
                                                                    <Checkbox
                                                                        id="check_one"
                                                                        size="small"
                                                                        checked={el?.quantity > 0}
                                                                        sx={{ padding: "0" }}
                                                                        disabled={selectedAmount?.quantity === 0}
                                                                        onClick={(e) => {
                                                                            if (e.target.checked) {
                                                                                setSelectedAmount({
                                                                                    amount: selectedAmount.amount,
                                                                                    quantity:
                                                                                        Number(selectedAmount.quantity) -
                                                                                        1,
                                                                                });
                                                                                employees[employees.findIndex((vUser) => vUser.user === el.user)].quantity += 1;
                                                                                employees[employees.findIndex((vUser) => vUser.user === el.user)].selected = true;
                                                                            } else {
                                                                                setSelectedAmount({
                                                                                    amount: selectedAmount.amount,
                                                                                    quantity:
                                                                                        Number(selectedAmount.quantity) + el?.quantity,
                                                                                });
                                                                                employees[employees.findIndex((vUser) => vUser.user === el.user)].quantity = 0;
                                                                                employees[employees.findIndex((vUser) => vUser.user === el.user)].selected = false;
                                                                            }
                                                                        }}

                                                                    />
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        padding: ".55rem",
                                                                        backgroundColor: "#F7F0F0",
                                                                        whiteSpace: "nowrap",
                                                                    }}
                                                                >
                                                                    {el.fullName}
                                                                </span>
                                                            </TableCell>

                                                            <TableCell>
                                                                <span
                                                                    id="quantity"
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: "end",
                                                                        alignItems: "center",
                                                                        padding: "0rem",
                                                                        backgroundColor: "#F7F0F0",
                                                                        textTransform: "capitalize",
                                                                        textAlign: "center",
                                                                    }}
                                                                >
                                                                    {
                                                                        el?.quantity
                                                                    }
                                                                    <Box
                                                                        sx={{
                                                                            display: "flex",
                                                                            flexDirection: "column",
                                                                            paddingLeft: "1.5rem",
                                                                        }}
                                                                    >
                                                                        <KeyboardArrowUp
                                                                            sx={{
                                                                                fontSize: "20px",
                                                                                cursor: "pointer",
                                                                            }}
                                                                            onClick={() => {
                                                                                if (
                                                                                    Number(selectedAmount.quantity) === 0
                                                                                ) {
                                                                                    return;
                                                                                } else {
                                                                                    setSelectedAmount({
                                                                                        amount: selectedAmount.amount,
                                                                                        quantity:
                                                                                            Number(selectedAmount.quantity) -
                                                                                            1,
                                                                                    });
                                                                                    employees[employees.findIndex((vUser) => vUser.user === el.user)].quantity += 1;
                                                                                    employees[employees.findIndex((vUser) => vUser.user === el.user)].selected = true;
                                                                                    fetchData()
                                                                                }
                                                                            }}
                                                                        />
                                                                        <KeyboardArrowDown
                                                                            sx={{
                                                                                fontSize: "20px",
                                                                                cursor: "pointer",
                                                                            }}
                                                                            onClick={() => {
                                                                                if (el.quantity === 0) {
                                                                                    employees[employees.findIndex((vUser) => vUser.user === el.user)].selected = false;
                                                                                    return;
                                                                                } else {
                                                                                    setSelectedAmount({
                                                                                        amount: selectedAmount.amount,
                                                                                        quantity:
                                                                                            Number(selectedAmount.quantity) +
                                                                                            1,
                                                                                    });
                                                                                    employees[employees.findIndex((vUser) => vUser.user === el.user)].quantity -= 1;
                                                                                    if (el.quantity === 0) {
                                                                                        employees[employees.findIndex((vUser) => vUser.user === el.user)].selected = false;
                                                                                        return;
                                                                                    }
                                                                                    fetchData()
                                                                                }
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                </span>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Container>
            </Box> :
            method === "sms" || injection === "mass" ?
                // sms method
                <Container maxWidth={"md"}>
                    {injection !== "mass" &&
                        <>
                            <Typography textAlign={"center"} fontWeight={600} fontSize={"1rem"}>
                                {formatMessage({ id: "evoucher.beneficiarysms" })} {selectedBranch?.name && "|" + " " + formatMessage({ id: "employer.branch" }) + " " + ":" + " " + selectedBranch?.name}
                            </Typography>
                            <Typography textAlign={"center"} variant="body2">
                                {formatMessage({ id: "evoucher.remainingof" })} {selectedAmount.amount} MAD:{" "}
                                {selectedAmount.quantity}
                            </Typography>
                        </>
                    }

                    <Typography textAlign={"center"} fontWeight={600} fontSize={".9rem"} mt={2}>
                        {formatMessage({ id: "evoucher.importxls" })}
                    </Typography>
                    <Typography textAlign={"center"} variant="body2">
                        {formatMessage({ id: "evoucher.importxlsnote" })}
                    </Typography>

                    <EvoucherUpload
                        setFile={setFile}
                        file={file}
                        accept={{
                            "application/msexcel": [".xls"],
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                                [".xlsx"]
                        }}
                    />

                    <Typography fontWeight={600} variant="body2">{formatMessage({ id: "evoucher.importantnotes" })}</Typography>
                    <ul>
                        <li><Typography variant="body2" sx={{ textDecoration: "underline" }}>{formatMessage({ id: "evoucher.note1" })} <a href={injection === "mass" ? "exampleMassExcelInjection.xlsx" : "/SheetSMSVoucherAssignementwithouterros.xlsx"} download style={{ fontWeight: 600, color: "var(--color-dark-blue)" }}>{formatMessage({ id: "evoucher.note11" })}.</a></Typography></li>
                        <li><Typography variant="body2" sx={{ textDecoration: "underline" }}>{formatMessage({ id: "evoucher.note2" })}</Typography></li>
                    </ul>
                </Container> :
                // Cheque method
                <Container maxWidth={"md"}>
                    <Typography textAlign={"center"} fontWeight={600} fontSize={"1rem"}>
                        {formatMessage({ id: "evoucher.physicalrequest" })} {selectedBranch?.name && "|" + " " + formatMessage({ id: "employer.branch" }) + " " + ":" + " " + selectedBranch?.name}
                    </Typography>
                    <Typography textAlign={"center"} variant="body2">
                        {formatMessage({ id: "evoucher.remainingof" })} {selectedAmount.amount} MAD:{" "}
                        {selectedAmount.quantity}
                    </Typography>

                    <PhysicalChequesComponent
                        selectedBranch={selectedBranch}
                        selectedAmount={selectedAmount}
                        setSelectedAmount={setSelectedAmount}
                        num={num}
                        setNum={setNum}
                    />
                </Container>

    )
}

export default AssignTo