import { ar_home } from "./home";
import { ar_navabr } from "./navbar";
import { ar_login } from "./login";

const ar = {
  ...ar_login,
  ...ar_home,
  ...ar_navabr,
};

export default ar;
