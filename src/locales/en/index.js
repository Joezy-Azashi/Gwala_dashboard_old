import { en_home } from "./home";
import { en_login } from "./login";
import { en_navbar } from "./navbar";
import { en_profile } from "./profile";
import { en_employee, en_employee_edit } from "./employee";
import { en_filter } from "./filter";
import { en_advance } from "./advance";
import {
  en_timetracker,
  en_timetracker_session,
  en_vacation,
  en_timetracker_stepper,
} from "./timetracker";
import {en_tracker} from "./tracker";
import {en_sms} from "./sms";
import { en_company, en_company_edit } from "./company";
import { en_support } from "./support";
import { en_employer, en_employer_edit } from "./employer";
import { en_evoucher } from "./evoucher";
import { en_merchants } from "./merchants";
import { en_response } from "./response";
import { en_common } from "./common";
import { en_phoneRequest } from "./request";
import { en_companysettings } from "./companysettings";
import { en_edocuments } from "./edocuments"
import { en_reimbursements } from "./reimbursements";

const en = {
  ...en_login,
  ...en_home,
  ...en_navbar,
  ...en_profile,
  ...en_employee,
  ...en_employer,
  ...en_evoucher,
  ...en_merchants,
  ...en_companysettings,
  ...en_edocuments,
  ...en_employer_edit,
  ...en_filter,
  ...en_advance,
  ...en_employee_edit,
  ...en_timetracker,
  ...en_tracker,
  ...en_sms,
  ...en_company,
  ...en_company_edit,
  ...en_support,
  ...en_response,
  ...en_phoneRequest,
  ...en_common,
  ...en_reimbursements,
  ...en_timetracker_session,
  ...en_vacation,
  ...en_timetracker_stepper,
};

export default en;
