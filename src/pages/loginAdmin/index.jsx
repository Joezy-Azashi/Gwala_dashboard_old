import Input from "../../components/Login/Input";
import PasswordInput from "../../components/Login/PasswordInput";
import { LogoNav } from "../../components/Login/Logos";
import { Login } from "../login/style";
import { useState } from "react";
import { adminLogin } from "../../api";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/reducer/userReducer";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import ButtonSpinner from "../../components/buttonspinner/ButtonSpinner";
import { Button } from "@mui/material";
import isEmail from "validator/lib/isEmail";

const LoginAdmin = () => {
  const loginMutation = adminLogin();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async (e) => {
    e.preventDefault()
    if (email === "" || pass === "") {
      toast("Email and Password fields are required", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type: "error",
      });
    } else if (!isEmail(`${email}`)) {
      toast("Email is invalid", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type: "error",
      });
    } else {
      setLoading(true);

      // Dashboard login
      const result = await loginMutation.mutateAsync({
        email: email,
        password: pass,
      });
      if (result?.status === "success") {
        setLoading(false);
        localStorage.setItem("token", result.token);
        localStorage.setItem("lang","fr");
        localStorage.setItem("superAdminManage", result?.admin?.role);
        dispatch(setUser({ ...result?.admin, role: "Admin" }));
        localStorage.setItem("role", "Admin");
        if (result?.admin?.role === "EVOUCHER") {
          navigate("/merchants");
        } else {
          navigate("/home");
        }
      }
      setLoading(false);
    }
  };
  return (
    <Login>
      <div className="rectangle">
        <div className="leftSection">
          <div className="firstSec">
            <img src="/logo/logoLogin.svg" alt="Logo" width={"30%"} />
            <LogoNav color={"#002b69"} />
          </div>
          <div className="lastSec">
            <span>Enabling financial wellness</span>
            <div className="line"></div>
            <div>
              <a
                href="//linkedin.com/company/gwalaco/"
                target="_blank"
                rel="noreferrer"
              >
                <img src="/icons/Login/linkdin.svg" />
              </a>
              <a href="//gwala.co/" target="_blank" rel="noreferrer">
                <img src="/icons/Login/link.svg" />
              </a>
              <a
                href="https://wa.me/212773273474"
                target="_blank"
                rel="noreferrer"
              >
                <img src="/icons/Login/whatsapp.svg" />
              </a>
              <a
                href="//facebook.com/people/Gwala/100093081814172"
                target="_blank"
                rel="noreferrer"
              >
                <img src="/icons/Login/facebook.svg" />
              </a>
              <a
                href="//instagram.com/gwala_co/"
                target="_blank"
                rel="noreferrer"
              >
                <img src="/icons/Login/instagram.svg" />
              </a>
            </div>
          </div>
        </div>
        <div className="rightSection">
          <div>
            <span>Login</span>
            <p style={{ marginTop: "1rem" }}>Login to manage activities on Gwala</p>
            <div className="line"></div>
          </div>
          <form onSubmit={signIn}>
            <div className="inpts">
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email or phone number"
              />
              <div>
                <PasswordInput
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Password"
                />
                {/* <label>Forgot password ?</label> */}
              </div>
            </div>
            <div className="btn">
              <Button
                type="submit"
                sx={{
                  maxWidth: "207px", width: "100%",
                  fontWeight: 500,
                  fontSize: "16px",
                  lineHeight: "19px",
                  color: "#fff",
                  backgroundColor: "#43b0ff !important",
                  borderRadius: "10px",
                  textTransform: "none",
                  marginTop: "30px",
                  padding: "12px",
                  cursor: "pointer"
                }}
                disableRipple
              >
                {loading && <ButtonSpinner /> || "Get in"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Login>
  );
};

export default LoginAdmin;
