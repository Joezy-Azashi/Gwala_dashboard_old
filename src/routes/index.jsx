import { lazy } from "react";
import LoginPage from "../pages/login";
import LayoutPage from "../pages/layout";
import Home from "../pages/home";
import WrapperRouteComponent from "./config";
import { Navigate, Route, useRoutes } from "react-router-dom";
import Transaction from "../pages/transaction";
import Company from "../pages/company";
import Branches from "../pages/branches";
import CompanyEditById from "../pages/CompanyEditById";
import Support from "../pages/support";
import Employee from "../pages/employee";
import EmployeeDetails from "../pages/EmployeeDetails";
import AddEmployee from "../pages/AddEmployee";
import AddEmployer from "../pages/AddEmployer";
import Employer from "../pages/employer";
import LoginAdmin from "../pages/loginAdmin";
import Profile from "../pages/profile";
import EmployeeEdit from "../pages/editEmployee";
import EditEmployer from "../pages/EmployerEditById";
import TimeTracker from "../pages/timeTracker";
import AddCompany from "../pages/AddCompany";
import Requests from "../pages/requests";
import ResetPage from "../pages/reset";
import CompanyPage from "../pages/companypage";
import UpdateBalance from "../pages/Updatebalance";
import Reimbursements from "../pages/reimbursements";
import ExpenseDetail from "../pages/expenseDetail";
import TimeTrackeDetails from "../pages/TimeTrackerDetails";
import Edocuments from "../pages/e-documents";
import ViewAll from "../pages/e-documents/ViewAll";
import ManageTags from "../pages/e-documents/ManageTags";
import AdvanceManualy from "../pages/advanceManually";
import PhoneRequest from "../pages/PhoneRequests";
import Evouchers from "../pages/Evouchers/Evouchers";
import UsedVoucherHistory from "../pages/Evouchers/UsedVoucherHistory";
import RequestedVoucherHistory from "../pages/Evouchers/RequestedVoucherHistory";
import ViewallUsedVoucherHistory from "../pages/Evouchers/ViewallUsedVoucherHistory";
import AssignVouchers from "../pages/Evouchers/AssignVouchers";
import EvoucherHR from "../pages/Evouchers/EvoucherHR";
import Merchants from "../pages/Merchants/Merchants";
import MerchantAdd from "../pages/Merchants/MerchantAdd";
import MerchantEdit from "../pages/Merchants/MerchantEdit";
import HistoryOfTransaction from "../pages/Merchants/HistoryOfTransaction";
import MerchantReimbursements from "../pages/Merchants/MerchantReimbursements";
import ManageCategories from "../pages/Merchants/ManageCategories";
import { useSelector } from "react-redux";
import AddOwner from "../pages/Merchants/AddOwner";
import ManageOwners from "../pages/Merchants/ManageOwners";
import { ApmRoutes } from "@elastic/apm-rum-react";
import HistoryNondigitalVouchers from "../pages/Evouchers/HistoryNondigitalVouchers";
import Tracker from "../pages/Tracker/Tracker";
import VoucherConverter from "../pages/VoucherConvertor/VoucherConverter";
import GwalaSends from "../pages/GwalaSends/GwalaSends";
import GwalaSMS from "../pages/GwalaSends/gwalasms/GwalaSMS";
import PushNotificationPage from "../pages/GwalaSends/PushNotification/PushNotificationPage";
import MerchantRanking from "../pages/MerchantRanking/MerchantRanking";
import PartnerProfile from "../pages/Merchants/PartnerProfile";
import ManagePartnerMap from "../pages/Merchants/ManagePartnerMap";

const NotFound = lazy(() => import("../pages/404"));

const RenderRouter = () => {
  const role = localStorage.getItem("role");
  const selectedUserState = useSelector((state) => state.userInfos);
  return (
    <ApmRoutes>
      <Route
        path="/"
        element={
          <WrapperRouteComponent auth={true}>
            <LayoutPage />
          </WrapperRouteComponent>
        }
      >
        <Route path="" element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="transaction" element={
          (role === "Admin" &&
            localStorage.getItem("superAdminManage") === "ADVANCEADMIN") ||
            localStorage.getItem("superAdminManage") === "SUPERADMIN" ||
            selectedUserState?.manages?.filter((ft) => ft?.features?.includes("DEFAULT"))?.length > 0 ||
            selectedUserState?.manages?.filter((ft) => ft?.features?.includes("ALL"))?.length > 0 ||
            selectedUserState?.company?.features?.filter((ft) => ft?.includes("ALL"))?.length > 0 ||
            selectedUserState?.company?.features?.filter((ft) => ft?.includes("DEFAULT"))?.length > 0 ?
            <Transaction /> : <></>}
        />
        <Route path="expense/detail/:id" element={<ExpenseDetail />} />
        <Route
          path="requests"
          element={role === "Admin" ? <PhoneRequest /> : <Requests />}
        />
        <Route
          path="companies"
          element={role == "Admin" ? <Company /> : <NotFound />}
        />
        <Route
          path="branches"
          element={selectedUserState?.manages?.length > 0 ? <Branches /> : <></>}
        />
        <Route path="company-page" element={<CompanyPage />} />
        <Route path="profile" element={<Profile />} />
        <Route
          path="update-employee-balance"
          element={<UpdateBalance />}
        />
        <Route
          path="company/add"
          element={role == "Admin" ? <AddCompany /> : <></>}
        />
        <Route path="company/edit/:id" element={<CompanyEditById />} />
        <Route path="support" element={<Support />} />
        <Route path="employee" element={<Employee />} />
        <Route path="employee/:id" element={<EmployeeDetails />} />
        <Route path="employee-edit/:id" element={<EmployeeEdit />} />
        <Route path="employee/add" element={<AddEmployee />} />
        <Route path="employer" element={role == "Admin" || selectedUserState?.manages?.length > 0 ? <Employer /> : <></>} />
        <Route path="employer/add" element={role == "Admin" || selectedUserState?.manages?.length > 0 ? <AddEmployer /> : <></>} />
        <Route path="employer/edit/:id" element={<EditEmployer />} />
        {/* <Route path="timetracker" element=<TimeTracker /> />
                <Route path="timetracker/:id" element=<TimeTrackeDetails /> /> */}

        <Route path="reimbursements" element={role !== "Admin" ? <Reimbursements /> : <NotFound />} />
        <Route path="e-documents" element={role !== "Admin" ? <Edocuments /> : <NotFound />} />
        <Route path="e-documents/:id" element={role !== "Admin" ? <ViewAll /> : <NotFound />} />
        <Route
          path="e-documents/manage-tags"
          element={<ManageTags />}
        />
        <Route
          path="e-vouchers"
          element={
            (role !== "Admin" &&
              selectedUserState?.manages?.filter((ft) =>
                ft?.features?.includes("EVOUCHERS")
              )?.length > 0) ||
              selectedUserState?.manages?.filter((ft) =>
                ft?.features?.includes("ALL")
              )?.length > 0 ||
              selectedUserState?.company?.features?.filter((ft) =>
                ft?.includes("EVOUCHERS")
              )?.length > 0 ||
              selectedUserState?.company?.features?.filter((ft) =>
                ft?.includes("ALL")
              )?.length > 0 ? (
              <Evouchers />
            ) : <></>}
        />
        <Route
          path="used-voucher-history"
          element={role === "Admin" || !selectedUserState?.isAllowedToSeeHistory ? <NotFound /> : <UsedVoucherHistory />}
        />
        <Route
          path="non-digital-voucher-history"
          element={role !== "Admin" && <HistoryNondigitalVouchers />}
        />
        <Route
          path="used-voucher-history/:type"
          element={<ViewallUsedVoucherHistory />}
        />
        <Route
          path="viewall-used-voucher-history"
          element={role === "Admin" || !selectedUserState?.isAllowedToSeeHistory ? <NotFound /> : <ViewallUsedVoucherHistory />}
        />
        <Route
          path="requested-voucher-history"
          element={role !== "Admin" && <RequestedVoucherHistory />}
        />
        <Route path="assign-voucher" element={role !== "Admin" ? <AssignVouchers /> : <NotFound />} />
        <Route path="voucher-converter" element={role !== "Admin" ? <VoucherConverter /> : <NotFound />} />
        <Route
          path="e-vouchers-hr" element={role == "Admin" &&
            (localStorage.getItem("superAdminManage") === "EVOUCHER" ||
              localStorage.getItem("superAdminManage") === "SUPERADMIN") ?
            <EvoucherHR /> : <NotFound />}
        />
        <Route
          path="tracker" element={role == "Admin" &&
            (localStorage.getItem("superAdminManage") === "EVOUCHER" ||
              localStorage.getItem("superAdminManage") === "SUPERADMIN"
            ) ?
            <Tracker /> : <NotFound />
          }
        />
        <Route
          path="gwala-sends" element={role == "Admin" ?
            <GwalaSends /> : <NotFound />
          }
        />
        <Route
          path="gwala-sms" element={role == "Admin" ?
            <GwalaSMS /> : <NotFound />
          }
        />
        <Route
          path="push-notification" element={role == "Admin" ?
            <PushNotificationPage /> : <NotFound />
          }
        />
        <Route
          path="merchants" element={role == "Admin" &&
            (localStorage.getItem("superAdminManage") === "EVOUCHER" ||
              localStorage.getItem("superAdminManage") === "SUPERADMIN") ?
            <Merchants /> : <NotFound />
          }
        />
        <Route
          path="partner-profile/:id" element={role == "Admin" &&
            (localStorage.getItem("superAdminManage") === "EVOUCHER" ||
              localStorage.getItem("superAdminManage") === "SUPERADMIN") ?
            <PartnerProfile /> : <NotFound />
          }
        />
        <Route
          path="partner-profile" element={role == "Admin" &&
            (localStorage.getItem("superAdminManage") === "EVOUCHER" ||
              localStorage.getItem("superAdminManage") === "SUPERADMIN") ?
            <PartnerProfile /> : <NotFound />
          }
        />
        <Route
          path="manage-map" element={role == "Admin" &&
            (localStorage.getItem("superAdminManage") === "EVOUCHER" ||
              localStorage.getItem("superAdminManage") === "SUPERADMIN") ?
            <ManagePartnerMap /> : <NotFound />
          }
        />
        <Route
          path="manage-map/:id" element={role == "Admin" &&
            (localStorage.getItem("superAdminManage") === "EVOUCHER" ||
              localStorage.getItem("superAdminManage") === "SUPERADMIN") ?
            <ManagePartnerMap /> : <NotFound />
          }
        />
        <Route path="merchant-edit/:id" element={<MerchantEdit />} />
        <Route path="merchant-add" element={role == "Admin" &&
          (localStorage.getItem("superAdminManage") === "EVOUCHER" ||
            localStorage.getItem("superAdminManage") === "SUPERADMIN") ?
          <MerchantAdd /> : <NotFound />} />
        <Route path="history-of-transaction/:id" element={role == "Admin" &&
          (localStorage.getItem("superAdminManage") === "EVOUCHER" ||
            localStorage.getItem("superAdminManage") === "SUPERADMIN") ?
          <HistoryOfTransaction /> : <NotFound />}
        />
        <Route path="merchant-reimbursements/:id" element={role == "Admin" &&
          (localStorage.getItem("superAdminManage") === "EVOUCHER" ||
            localStorage.getItem("superAdminManage") === "SUPERADMIN") ?
          <MerchantReimbursements /> : <NotFound />}
        />
        <Route
          path="manage-categories"
          element={role == "Admin" &&
            (localStorage.getItem("superAdminManage") === "EVOUCHER" ||
              localStorage.getItem("superAdminManage") === "SUPERADMIN") ?
            <ManageCategories /> : <NotFound />}
        />
        <Route
          path="merchant-ranking/:id"
          element={role == "Admin" &&
            (localStorage.getItem("superAdminManage") === "EVOUCHER" ||
              localStorage.getItem("superAdminManage") === "SUPERADMIN") ?
            <MerchantRanking /> : <NotFound />}
        />
        <Route path="manage-owners" element={role == "Admin" &&
          (localStorage.getItem("superAdminManage") === "EVOUCHER" ||
            localStorage.getItem("superAdminManage") === "SUPERADMIN") ?
          <ManageOwners /> : <NotFound />}
        />
        <Route path="add-owner" element={role == "Admin" &&
          (localStorage.getItem("superAdminManage") === "EVOUCHER" ||
            localStorage.getItem("superAdminManage") === "SUPERADMIN") ?
          <AddOwner /> : <NotFound />}
        />
        <Route path="advance/manualy" element={<AdvanceManualy />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="login" element={<LoginPage />} />
      <Route path="reset/:id" element={<ResetPage />} />
      <Route path="login-admin" element={<LoginAdmin />} />
    </ApmRoutes>
  );
};

export default RenderRouter;
