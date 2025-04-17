import Button from "../../components/Login/Button";
import Input from "../../components/Login/Input";
import { LogoNav } from "../../components/Login/Logos";
import { Login } from "../login/style";
import { useEffect, useState } from "react";
import PasswordInput from "../../components/Login/PasswordInput";
import { useLogin } from "../../api";
import { Box, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setUser, setRole } from "../../store/reducer/userReducer";
import { useNavigate, useParams } from "react-router";
import axios from "../../api/request";
import { toast } from "react-toastify";
import { TextField } from "../../components/UI";

const ResetPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmPass, setConfirm] = useState("");
  const [password, setPass] = useState("");
  const [showError, setShowError] = useState(false);
  const [error, setErr] = useState({
    errPass: "",
    errConfirm: "",
  });
  const { id } = useParams();

  const changePass = (text) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!strongPasswordRegex.test(password))
      setErr({
        ...error,
        errPass:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    else setErr({ ...error, errPass: "" });
    setPass(text);
  };

  const changeConfirm = (text) => {
    if (password !== text)
      setErr({ ...error, errConfirm: "Passwords do not match." });
    else setErr({ ...error, errConfirm: "" });
    setConfirm(text);
  };

  const handleChangePassword = (e) => {
    changePass(e.target.value);

    if (e.target.value === "") {
      setShowError(false);
      return;
    }
    // eslint-disable-next-line
    if (
      e.target.value?.match(/[a-z]/) &&
      e.target.value?.match(/[A-Z]/) &&
      e.target.value.match(/[0-9]/) &&
      e.target.value?.match(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/) &&
      e.target.value?.length > 7
    ) {
      setShowError(false);
      return;
    }
    if (
      e.target.value?.match(/[a-z]/) &&
      e.target.value?.match(/[A-Z]/) &&
      e.target.value.match(/[0-9]/) &&
      e.target.value.match(/[0-9]/)
    ) {
      setShowError(true);
      return;
    }
    // eslint-disable-next-line
    if (
      e.target.value?.match(/[a-z]/) &&
      e.target.value?.match(/[A-Z]/) &&
      e.target.value?.match(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)
    ) {
      setShowError(true);
      return;
    }
    if (e.target.value?.match(/[a-z]/) && e.target.value?.match(/[A-Z]/)) {
      setShowError(true);
      return;
    }
    if (e.target.value?.match(/[a-z]/) || e.target.value?.match(/[A-Z]/)) {
      setShowError(true);
      return;
    }
  };

  const UpdatePassword = async () => {
    if (!showError && confirmPass != "" && password != "") {
      const result = await axios.post("/employers/forgot/password/validate", {
        token: id,
        password,
      });

      if (result?.status == "success") {
        toast("Password updated", {
          theme: "colored",
          type: "success",
        });
        navigate("/login");
      }
    }
  };
  useEffect(() => {
    if (!id) return navigate("/login");
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
              <a href="">
                <img src="/icons/Login/facebook.svg" />
              </a>
              <a href="https://wa.me/212773273474">
                <img src="/icons/Login/whatsapp.svg" />
              </a>
              <a href="https://gwala.co">
                <img src="/icons/Login/link.svg" />
              </a>
              <a href="https://www.linkedin.com/company/gwalaco/mycompany/">
                <img src="/icons/Login/linkdin.svg" />
              </a>
            </div>
          </div>
        </div>
        <div className="rightSection">
          <div>
            <span>Reset Password</span>
            <p>
              Enter a new password that should contain Uppercase, Lowercase,
              Character and Number.
            </p>
            <div className="line"></div>
          </div>
          <div className="inpts">
            <PasswordInput
              type="password"
              value={password}
              onChange={(e) => handleChangePassword(e)}
              placeholder="New Password"
            />
            {showError ? (
              <ul style={{ fontSize: "0.75rem" }}>
                <li className="list-disc ml-4">
                  {"At least 8 characters long"}
                </li>
                <li className="list-disc ml-4">
                  {"Upper-case and lower-case letters (a-z, A-Z),"}
                </li>
                <li className="list-disc ml-4">
                  {
                    "At least one number and at least one special character (e.g. +, $, !, ?, #)"
                  }
                </li>
              </ul>
            ) : (
              ""
            )}

            <div>
              <PasswordInput
                type="password"
                value={confirmPass}
                onChange={(e) => changeConfirm(e.target.value)}
                placeholder="Confirm Password"
              />
              <p style={{ fontSize: "12px", color: "red" }}>
                {error.errConfirm}
              </p>
            </div>
          </div>
          <div className="btn">
            <Button text="Save" onClick={UpdatePassword} />
          </div>
        </div>
      </div>
    </Login>
  );
};

export default ResetPage;
