import { fr_home } from "./home";
import { fr_login } from "./login";
import { fr_navbar } from "./navbar";
import { fr_profile } from "./profile";
import { fr_employee, fr_employee_edit } from "./employee";
import { fr_filter } from "./filter";
import { fr_advance } from "./advance";
import { fr_support } from "./support";
import {
  fr_timetracker,
  fr_timetracker_session,
  fr_vacation,
  fr_timetracker_stepper,
} from "./timetracker";
import { fr_tracker } from "./tracker";
import { fr_sms } from "./sms";
import { fr_company, fr_company_edit } from "./company";
import { fr_employer, fr_employer_edit } from "./employer";
import { fr_evoucher, } from "./evoucher";
import { fr_merchants, } from "./merchants";
import { fr_response } from "./response";
import { fr_common } from "./common";
import { fr_phoneRequest } from "./request";
import { fr_companysettings } from "./companysettings";
import { fr_edocuments } from "./edocuments";
import { fr_reimbursements } from "./reimbursements";
const fr = {
  ...fr_login,
  ...fr_home,
  ...fr_navbar,
  ...fr_profile,
  ...fr_employee,
  ...fr_filter,
  ...fr_advance,
  ...fr_employee_edit,
  ...fr_employer,
  ...fr_evoucher,
  ...fr_merchants,
  ...fr_employer_edit,
  ...fr_timetracker,
  ...fr_tracker,
  ...fr_sms,
  ...fr_response,
  ...fr_company,
  ...fr_companysettings,
  ...fr_edocuments,
  ...fr_company_edit,
  ...fr_support,
  ...fr_phoneRequest,
  ...fr_common,
  ...fr_reimbursements,
  ...fr_timetracker_session,
  ...fr_vacation,
  ...fr_timetracker_stepper,
};

export default fr;
