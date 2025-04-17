// import Button from "../../components/Login/Button";
import Input from "../../components/Login/Input";
import PasswordInput from "../../components/Login/PasswordInput";
import { LogoNav } from "../../components/Login/Logos";
import { Login } from "./style";
import { useEffect, useState } from "react";
import { useLogin } from "../../api";
import { useDispatch } from "react-redux";
import { setUser, setRole } from "../../store/reducer/userReducer";
import { useNavigate } from "react-router";
import axios from "../../api/request";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import ButtonSpinner from "../../components/buttonspinner/ButtonSpinner";
import isEmail from "validator/lib/isEmail";

const LoginPage = () => {
  const loginMutation = useLogin();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [reset, setResetPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const validateEmail = (email) => {
    var emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (emailRegex.test(email)) {
      setError("");
    } else {
      setError("Email format is invalid!");
    }
    setEmail(email);
  };
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
    } else if (!isEmail(`${email}`)){
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
      const result = await loginMutation.mutateAsync({
        email: email,
        password: pass,
      });
      if (result?.status === "success") {
        localStorage.setItem("role", "Employer");
        localStorage.setItem("lang","fr");
        setLoading(false);
        localStorage.setItem("token", result.token);

        if (result?.employer?.manages?.length > 0) {
          localStorage.setItem("managedCompanies", JSON.stringify(result?.employer?.manages));
        }

        dispatch(
          setUser({
            type_employer: result?.employer?.role,
            ...result?.employer,
            role: "Employer",
          })
        );
        navigate("/home");
      }
      setLoading(false);
    }
  };

  const forgetPass = async () => {
    setForgotLoading(true)
    if (error === "") {
      const result = await axios.post("/employers/forgot/password/init", {
        email,
      });
      if (result?.status === "success") {
        toast("we sent you a link to recover your account.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          type: "success",
        });
      }

      if (result?.response?.data?.errorKey === "employer.email.notfound") {
        toast("Email not found", {
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
      }
      setForgotLoading(false)
    }
  };
  useEffect(() => {
    dispatch(setRole("employer"));
  }, []);
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
          {!reset ? (
            <>
              <div>
                <span>Login</span>
                <p style={{ marginTop: "1rem" }}>Login to manage your company’s activity on Gwala</p>
                <div className="line"></div>
              </div>
              <form onSubmit={signIn}>
                <div className="inpts">
                  <Input
                    type="email"
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
                    <label onClick={() => setResetPage(true)} style={{marginTop: "1rem"}}>
                      Forgot password ?
                    </label>
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
            </>
          ) : (
            // Forget Password Section
            <>
              <div>
                <span>Reset Password</span>
                <p>
                  Enter your email address, and we'll send you a link to recover
                  your account.
                </p>
                <div className="line"></div>
              </div>
              <div className="inpts">
                <div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => validateEmail(e.target.value)}
                    placeholder="Email"
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      lineHeight: "30px",
                      color: "rgb(255 0 73)",
                      fontWeight: "normal",
                    }}
                  >
                    {error}{" "}
                  </span>
                  <label onClick={() => setResetPage(!reset)}>Sign in</label>
                </div>
              </div>
              <div className="btn">
                <Button 
                    text="Submit"
                    sx={{
                      maxWidth: "207px", width: "100%",
                      fontWeight: 500,
                      fontSize: "16px",
                      lineHeight: "19px",
                      color: "#fff",
                      backgroundColor: "#43b0ff !important",
                      borderRadius: "10px",
                      textTransform: "none",
                      padding: "12px",
                      cursor: "pointer"
                    }}
                    loading={forgotLoading}
                    onClick={forgetPass}>
                    {"Submit"}
                  </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Login>
  );
};

export default LoginPage;
