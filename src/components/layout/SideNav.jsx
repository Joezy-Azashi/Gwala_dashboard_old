import React, { useState } from 'react'
import SearchBar from "./SearchBar";
import { useDispatch } from "react-redux";
import { setLanguage, setLogout } from "../../store/reducer/userReducer";
import { useNavigate } from "react-router";
import Btn from "../UI/Button";
import { useLocale } from "../../locales";
import { Dialog, DialogContent, DialogActions, IconButton, Box, Typography, Button, Menu, MenuItem } from "@mui/material";
import { Close } from "@mui/icons-material";

const SideNav = ({ userInfos, handleCloseMenu }) => {
  const navigate = useNavigate();
  const path = window.location.pathname;
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const dispatch = useDispatch();

  const role = localStorage.getItem("role");
  const { formatMessage } = useLocale();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const switchLang = (lang) => {
    localStorage.setItem("lang", lang);
    dispatch(setLanguage(lang));
  };

  const logout = () => {
    localStorage.clear();
    dispatch(setLogout());
    navigate("/login");
  };

  return (
    <DialogContent sx={{
      position: "fixed",
      right: "0",
      top: "0px",
      height: "100%",
      width: { xs: "18rem", sm: "23rem" },
      backgroundColor: "#79d9ff",
      padding: "7px 15px",
    }}>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton onClick={() => setOpenLogoutDialog(true)}>
            <img src="/icons/Navbar/logoutSide.svg" alt="logout" width={25} />
          </IconButton>

          <IconButton onClick={handleCloseMenu}>
            <Close sx={{ fontSize: "2.3rem" }} />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} my={1.5}>

          <img width={32} src={"/icons/editnotecolor.svg"} onClick={() => { navigate("/requests"); handleCloseMenu() }} />

          {role !== "Admin" &&
            <img width={35} src={"/icons/usercolor.svg"} onClick={() => { role === "Admin" ? "" : navigate("/profile"); handleCloseMenu() }} />
          }

          <img width={35} src={"/icons/supportcolor.svg"} onClick={() => { navigate("/support"); handleCloseMenu() }} />

          <img width={35} src={"/icons/globecolor.svg"} onClick={handleClick} />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            sx={{ display: "flex", flexDirection: "column", padding: "10rem 3rem " }}
          >
            <Typography sx={{ padding: "5px 15px", fontWeight: localStorage.getItem("lang") === "fr" && 600 }} onClick={() => { switchLang("fr"); handleClose() }}>French</Typography>
            <Typography sx={{ padding: "5px 15px", fontWeight: localStorage.getItem("lang") === "en" && 600 }} onClick={() => { switchLang("en"); handleClose() }}>English</Typography>
          </Menu>
        </Box>

        <Typography textAlign={"center"}>{userInfos?.firstName} {userInfos?.lastName}</Typography>
        {userInfos?.company?.name &&
          <>
            <Typography textAlign={"center"}>-------</Typography>
            <Typography textAlign={"center"} onClick={() => navigate("/company-page")}>{userInfos?.company?.name}</Typography>
          </>
        }

        <Box sx={{ display: "flex", justifyContent: "center" }} mt={1.5}>
          <SearchBar handleCloseMenu={handleCloseMenu} />
        </Box>
      </Box>

      <Box mt={5}>
        {localStorage.getItem("superAdminManage") !== "EVOUCHER" &&
          <Box
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "3rem" }}
            onClick={() => { navigate("/home"); handleCloseMenu() }}>
            <img src={"/icons/Navbar/home.svg"} />
            <span style={{ fontWeight: path === "/home" ? 600 : 500 }}>{formatMessage({ id: "nav.home" })}</span>
          </Box>
        }

        {role === "Admin" && localStorage.getItem("superAdminManage") !== "EVOUCHER" && (
          <Box
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "3rem" }}
            onClick={() => { navigate("/companies"); handleCloseMenu() }}>
            <img src={"/icons/Navbar/company.svg"} />
            <span style={{ fontWeight: path === "/companies" ? 600 : 500 }}>{formatMessage({ id: "nav.company" })}</span>
          </Box>
        )}

        {role === "Employer" && userInfos?.manages?.length > 0 && (
          <Box
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "3rem" }}
            onClick={() => { navigate("/branches"); handleCloseMenu() }}>
            <img src={"/icons/Navbar/company.svg"} />
            <span style={{ fontWeight: path === "/branches" ? 600 : 500 }}>{formatMessage({ id: "nav.branch" })}</span>
          </Box>
        )}

        {localStorage.getItem("superAdminManage") !== "EVOUCHER" &&
          <Box
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "3rem" }}
            onClick={() => { navigate("/employee"); handleCloseMenu() }}>
            <img src={"/icons/Navbar/employee.svg"} />
            <span style={{ fontWeight: path === "/employee" ? 600 : 500 }}>{formatMessage({ id: "nav.employee" })}</span>
          </Box>
        }

        {role === "Admin" &&
          (localStorage.getItem("superAdminManage") === "ADVANCEADMIN" ||
            localStorage.getItem("superAdminManage") === "SUPERADMIN") ||
          userInfos?.manages?.filter((ft) => ft?.features?.includes("DEFAULT"))?.length > 0 ||
          userInfos?.manages?.filter((ft) => ft?.features?.includes("ALL"))?.length > 0 ||
          userInfos?.company?.features?.filter((ft) => ft?.includes("ALL"))?.length > 0 ||
          userInfos?.company?.features?.filter((ft) => ft?.includes("DEFAULT"))?.length > 0 ?
          <Box
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "3rem" }}
            onClick={() => { navigate("/transaction"); handleCloseMenu() }}>
            <img src={"/icons/Navbar/advance.svg"} />
            <span style={{ fontWeight: path === "/transaction" ? 600 : 500 }}>{formatMessage({ id: "nav.advance" })}</span>
          </Box>
          : ""}

        {role !== "Admin" && (
          <Box
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "3rem" }}
            onClick={() => { navigate("/reimbursements"); handleCloseMenu() }}>
            <img src={"/icons/Navbar/reimbursements.svg"} />
            <span style={{ fontWeight: path === "/reimbursements" ? 600 : 500 }}>{formatMessage({ id: "nav.reimbursements" })}</span>
          </Box>
        )}

        {role !== "Admin" && (
          <Box
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "3rem" }}
            onClick={() => { navigate("/e-documents"); handleCloseMenu() }}>
            <img src={"/icons/Navbar/document.svg"} width={24} />
            <span style={{ fontWeight: path === "/e-documents" ? 600 : 500 }}>{formatMessage({ id: "nav.edocuments" })}</span>
          </Box>
        )}

        {role !== "Admin" && userInfos?.manages?.filter((ft) => ft?.features?.includes("EVOUCHERS"))?.length > 0 ||
          userInfos?.manages?.filter((ft) => ft?.features?.includes("ALL"))?.length > 0 ||
          userInfos?.company?.features?.filter((ft) => ft?.includes("EVOUCHERS"))?.length > 0 ||
          userInfos?.company?.features?.filter((ft) => ft?.includes("ALL"))?.length > 0 ?
          <Box
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "3rem" }}
            onClick={() => { navigate("/e-vouchers"); handleCloseMenu() }}>
            <img width={22} src={"/icons/Navbar/navpercent.svg"} />
            <span style={{ fontWeight: path === "/e-vouchers" ? 600 : 500 }}>{formatMessage({ id: "nav.evoucher" })}</span>
          </Box>
          : ""}

        {role === "Admin" &&
          (localStorage.getItem("superAdminManage") === "EVOUCHER" ||
            localStorage.getItem("superAdminManage") === "SUPERADMIN")
          ? (
            <Box
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "3rem" }}
              onClick={() => { navigate("/e-vouchers-hr"); handleCloseMenu() }}>
              <img width={22} src={"/icons/Navbar/navpercent.svg"} />
              <span style={{ fontWeight: path === "/e-vouchers-hr" ? 600 : 500 }}>{formatMessage({ id: "nav.evoucherhr" })}</span>
            </Box>
          ) : ""}

        {role === "Admin" &&
          (localStorage.getItem("superAdminManage") === "EVOUCHER" ||
            localStorage.getItem("superAdminManage") === "SUPERADMIN")
          && (
            <Box
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "3rem" }}
              onClick={() => { navigate("/merchants"); handleCloseMenu() }}>
              <img width={22} src={"/icons/Navbar/merchant.svg"} />
              <span style={{ fontWeight: path === "/merchants" ? 600 : 500 }}>{formatMessage({ id: "nav.merchant" })}</span>
            </Box>
          )}

        {role === "Admin" &&
          (localStorage.getItem("superAdminManage") === "EVOUCHER" ||
            localStorage.getItem("superAdminManage") === "SUPERADMIN"
          )
          && (
            <Box
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "3rem" }}
              onClick={() => { navigate("/tracker"); handleCloseMenu() }}>
              <img width={22} src={"/icons/Navbar/boldarrow.png"} />
              <span style={{ fontWeight: path === "/tracker" ? 600 : 500 }}><span>{formatMessage({ id: "nav.tracker" })}</span></span>
            </Box>
          )}

        {role === "Admin" && (
            <Box
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "3rem" }}
              onClick={() => { navigate("/gwala-sends"); handleCloseMenu() }}>
              <img width={22} src={"/icons/Navbar/sms.svg"} />
              <span style={{ fontWeight: path === "/gwala-sends" ? 600 : 500 }}><span>{formatMessage({ id: "nav.gwalasms" })}</span></span>
            </Box>
          )}
      </Box>

      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        fullWidth
        maxWidth="xs"
        sx={{ "& .MuiPaper-root": { padding: ".5rem" } }}
      >
        <DialogContent>{formatMessage({ id: "nav.question" })}</DialogContent>
        <DialogActions>
          <Btn
            text={formatMessage({ id: "nav.cancel" })}
            color={"#fff"}
            bgColor={"var(--color-danger)"}
            onClick={() => setOpenLogoutDialog(false)}
          />
          <Btn
            text={formatMessage({ id: "nav.logout" })}
            color={"var(--color-dark-blue)"}
            bgColor={"var(--color-blue)"}
            onClick={() => logout()}
            autoFocus
          />
        </DialogActions>
      </Dialog>
    </DialogContent>
  );
};
export default SideNav;
