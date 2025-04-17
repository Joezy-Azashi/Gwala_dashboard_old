import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { useLocale } from "../../locales";

const Second = styled.div`
  background-color: #87cefa;
  display: block;
  justify-content: space-around;
  padding: 15px 35px;
  row-gap: 10px;
  .container {
    display: flex;
    justify-content: start;
    gap: 30px;
    margin: 0 !important;
    padding: 0 !important;
    width: 100%;
    overflow: auto
  }
  .icons {
    font-style: normal;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    font-size: 1rem;
    justify-content: center;
  }
  ,
  span,
  img {
    padding-bottom: 10px;
  }
`;
const SecondNav = () => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const selectedUserState = useSelector((state) => state.userInfos);
  const role = localStorage.getItem("role");
  const path = window.location.pathname;

  return (
    <Second className="Second horScroll">
      <div className="container">
        {localStorage.getItem("superAdminManage") !== "EVOUCHER" &&
          <div
            className="icons"
            onClick={() => navigate("/home")}
            style={{ borderBottom: path === "/home" ? "3px solid #000000" : "", userSelect: "none" }}
          >
            <img src={"/icons/Navbar/home.svg"} />
            <span>{formatMessage({ id: "nav.home" })}</span>
          </div>
        }

        {role === "Admin" && localStorage.getItem("superAdminManage") !== "EVOUCHER" && (
          <div
            className="icons"
            onClick={() => navigate("/companies")}
            style={{
              borderBottom: path === "/companies" ? "3px solid #000000" : "", userSelect: "none"
            }}
          >
            <img src={"/icons/Navbar/company.svg"} />
            <span>{formatMessage({ id: "nav.company" })}</span>
          </div>
        )}
        {role === "Employer" && selectedUserState?.manages?.length > 0 && (
          <div
            className="icons"
            onClick={() => navigate("/branches")}
            style={{
              borderBottom: path === "/branches" ? "3px solid #000000" : "", userSelect: "none"
            }}
          >
            <img src={"/icons/Navbar/company.svg"} />
            <span>{formatMessage({ id: "nav.branch" })}</span>
          </div>
        )}

        {localStorage.getItem("superAdminManage") !== "EVOUCHER" &&
          <div
            className="icons"
            onClick={() => navigate("/employee")}
            style={{
              borderBottom: path === "/employee" ? "3px solid #000000" : "", userSelect: "none"
            }}
          >
            <img src={"/icons/Navbar/employee.svg"} />
            <span>{formatMessage({ id: "nav.employee" })}</span>
          </div>
        }

        {role === "Admin" &&
          (localStorage.getItem("superAdminManage") === "ADVANCEADMIN" ||
            localStorage.getItem("superAdminManage") === "SUPERADMIN") ||
          selectedUserState?.manages?.filter((ft) => ft?.features?.includes("DEFAULT"))?.length > 0 ||
          selectedUserState?.manages?.filter((ft) => ft?.features?.includes("ALL"))?.length > 0 ||
          selectedUserState?.company?.features?.filter((ft) => ft?.includes("ALL"))?.length > 0 ||
          selectedUserState?.company?.features?.filter((ft) => ft?.includes("DEFAULT"))?.length > 0 ?
          <div
            className="icons"
            onClick={() => navigate("/transaction")}
            style={{
              borderBottom: path === "/transaction" ? "3px solid #000000" : "", userSelect: "none"
            }}
          >
            <img src={"/icons/Navbar/advance.svg"} />
            <span>{formatMessage({ id: "nav.advance" })}</span>
          </div>
          : ""}

        {role !== "Admin" && (
          <div
            className="icons"
            onClick={() => navigate("/reimbursements")}
            style={{
              borderBottom:
                path === "/reimbursements" ? "3px solid #000000" : "",
            }}
          >
            <img src={"/icons/Navbar/reimbursements.svg"} />
            <span>{formatMessage({ id: "nav.reimbursements" })}</span>
          </div>
        )}

        {role !== "Admin" && (
          <div
            className="icons"
            onClick={() => navigate("/e-documents")}
            style={{
              borderBottom: path === "/e-documents" ? "3px solid #000000" : "",
            }}
          >
            <img src={"/icons/Navbar/document.svg"} width={24} />
            <span style={{ whiteSpace: "nowrap" }}>{formatMessage({ id: "nav.edocuments" })}</span>
          </div>
        )}

        {role !== "Admin" && selectedUserState?.manages?.filter((ft) => ft?.features?.includes("EVOUCHERS"))?.length > 0 ||
          selectedUserState?.manages?.filter((ft) => ft?.features?.includes("ALL"))?.length > 0 ||
          selectedUserState?.company?.features?.filter((ft) => ft?.includes("EVOUCHERS"))?.length > 0 ||
          selectedUserState?.company?.features?.filter((ft) => ft?.includes("ALL"))?.length > 0 ?
          <div
            className="icons"
            onClick={() => navigate("/e-vouchers")}
            style={{
              borderBottom: path === "/e-vouchers" ? "3px solid #000000" : "",
            }}
          >
            <img width={22} src={"/icons/Navbar/navpercent.svg"} />
            <span style={{ whiteSpace: "nowrap" }}>{formatMessage({ id: "nav.evoucher" })}</span>
          </div>
          : ""}

        {role === "Admin" &&
          (localStorage.getItem("superAdminManage") === "EVOUCHER" ||
            localStorage.getItem("superAdminManage") === "SUPERADMIN")
          ? (
            <div
              className="icons"
              onClick={() => navigate("/e-vouchers-hr")}
              style={{
                borderBottom: path === "/e-vouchers-hr" ? "3px solid #000000" : "", userSelect: "none"
              }}
            >
              <img width={22} src={"/icons/Navbar/navpercent.svg"} />
              <span style={{ whiteSpace: "nowrap" }}>{formatMessage({ id: "nav.evoucherhr" })}</span>
            </div>
          ) : ""}

        {role === "Admin" &&
          (localStorage.getItem("superAdminManage") === "EVOUCHER" ||
            localStorage.getItem("superAdminManage") === "SUPERADMIN")
          && (
            <div
              className="icons"
              onClick={() => navigate("/merchants")}
              style={{
                borderBottom: path === "/merchants" ? "3px solid #000000" : "", userSelect: "none"
              }}
            >
              <img width={22} src={"/icons/Navbar/merchant.svg"} />
              <span>{formatMessage({ id: "nav.merchant" })}</span>
            </div>
          )}

        {role === "Admin" &&
          (localStorage.getItem("superAdminManage") === "EVOUCHER" ||
            localStorage.getItem("superAdminManage") === "SUPERADMIN"
          )
          && (
            <div
              className="icons"
              onClick={() => navigate("/tracker")}
              style={{
                borderBottom: path === "/tracker" ? "3px solid #000000" : "", userSelect: "none"
              }}
            >
              <img width={22} src={"/icons/Navbar/boldarrow.png"} />
              <span>{formatMessage({ id: "nav.tracker" })}</span>
            </div>
          )}

        {role === "Admin" && (
            <div
              className="icons"
              onClick={() => navigate("/gwala-sends")}
              style={{
                borderBottom: path === "/gwala-sends" ? "3px solid #000000" : "", userSelect: "none"
              }}
            >
              <img width={22} src={"/icons/Navbar/sms.svg"} />
              <span style={{ whiteSpace: "nowrap" }}>{formatMessage({ id: "nav.gwalasms" })}</span>
            </div>
          )}
      </div>
    </Second>
  );
};

export default SecondNav;
