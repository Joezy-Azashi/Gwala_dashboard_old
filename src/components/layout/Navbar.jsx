import React, { useState } from 'react'
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { setOpen, setLogout } from "../../store/reducer/userReducer";
import { LogoNav } from "../Login/Logos";
import { useNavigate } from "react-router";
import { Button, LangSwitch } from "../UI";
import SearchBar from "./SearchBar";
import { Dialog, DialogContent, DialogActions, DialogTitle, Tooltip, Slide } from "@mui/material";
import { useLocale } from '../../locales';
import SideNav from './SideNav';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Nav = styled.div`
  background-color: #002b69;
  padding: 13px 35px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  svg {
    width: 100px;
  }
  .details {
    display: flex;
    align-items: center;
    grid: 20px;
    gap: 20px;
    color: #87cefa;
    > img {
      cursor: pointer;
    }
    > span img {
      cursor: pointer;
    }
    span:nth-child(3) {
      font-weight: 800;
    }
  }
  .detailsMenu {
    display: none;
    cursor: pointer;
  }
  @media (max-width: 790px) {
    .details {
      display: none;
    }
    .detailsMenu {
      display: block;
    }
  }
`;
const Navbar = ({ userInfos }) => {
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

  const handleOpenMenu = () => {
    setMobileMenu(true);
  };

  const handleCloseMenu = () => {
    setMobileMenu(false);
  };

  const dispatch = useDispatch();
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const appID = `${import.meta.env.VITE_INTERCOM_APP_ID}`;
  const logout = () => {
    localStorage.clear();
    dispatch(setLogout());
    navigate("/login");
  };
  const lang = localStorage.getItem("lang");

  const role = localStorage.getItem("role");

  window.Intercom('boot', {
    api_base: "https://api-iam.intercom.io",
    app_id: appID,
    name: userInfos?.firstName + " " + userInfos?.lastName,
    email: userInfos?.email,
    user_id: userInfos?._id,
    user_hash: userInfos?.hash,
    company: {
      created_at: userInfos?.company?.createdAt,
      name: userInfos?.company?.name,
      company_id: userInfos?.company?._id,
    }
  });

  window.intercomSettings = {
    app_id: appID,
    alignment: 'right',
    custom_launcher_selector: '#custom_link'
  };

  return (
    <Nav>
      <span style={{ cursor: localStorage.getItem("superAdminManage") === "EVOUCHER" ? "default" : "pointer" }} onClick={() => { localStorage.getItem("superAdminManage") === "EVOUCHER" ? "" : navigate("/home") }}>
        <LogoNav color="#87CEFA" />
      </span>

      <div className="details">
        <SearchBar />
        <span style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <span onClick={() => navigate("/company-page")}>
            {userInfos.company?.name && <span style={{ whiteSpace: "nowrap", cursor: "pointer" }}>{userInfos.company?.name} | </span>}
          </span>
          {role === "Admin" && <span style={{ userSelect: "none" }}>{role}</span>}

          <Tooltip title={formatMessage({ id: "nav.request" })}>
            <img width={28} src={"/icons/editnote.svg"} onClick={() => navigate("/requests")} />
          </Tooltip>

          {role !== "Admin" &&
            <Tooltip title={formatMessage({ id: "advance.profil" })}>
              <img width={28} src={"/icons/user.svg"} onClick={() => { role === "Admin" ? "" : navigate("/profile") }} />
            </Tooltip>
          }
          <Tooltip title={formatMessage({ id: "nav.support" })}>
            <img width={28} src={"/icons/support.svg"} onClick={() => navigate("/support")} />
          </Tooltip>
        </span>
        <LangSwitch lang={lang} />
        <Tooltip title={formatMessage({ id: "nav.logout" })}>
          <img src="/icons/Navbar/logout.svg" alt="logout" width={"18px"} onClick={() => setOpenLogoutDialog(true)} />
        </Tooltip>
      </div>

      <div className="detailsMenu" onClick={()=> handleOpenMenu()}>
        <img src="/icons/Navbar/menu.svg" alt="menu" width={"27px"} />
      </div>

      {/* Logout  */}
      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        fullWidth
        maxWidth="xs"
        sx={{ '& .MuiPaper-root': { padding: ".5rem" } }}
      >
        <DialogTitle variant='h5' fontWeight={"bolder"} id="alert-dialog-title">
          {formatMessage({ id: "nav.logout" })}
        </DialogTitle>
        <DialogContent>
          {formatMessage({ id: "nav.question" })}
        </DialogContent>
        <DialogActions>
          <Button
            text={formatMessage({ id: "nav.cancel" })}
            color={"#fff"}
            bgColor={"var(--color-danger)"}
            onClick={() => setOpenLogoutDialog(false)}
          />
          <Button
            text={formatMessage({ id: "nav.logout" })}
            color={"var(--color-dark-blue)"}
            bgColor={"var(--color-blue)"}
            onClick={() => logout()}
            autoFocus
          />
        </DialogActions>
      </Dialog>

      {/* Side Nav */}
      <Dialog
        open={mobileMenu}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseMenu}
      >
        <SideNav userInfos={userInfos} handleCloseMenu={handleCloseMenu} />
      </Dialog>
    </Nav>
  );
};

export default Navbar;
