import { TextField as MUITextField } from "@mui/material";
import { styled } from "@mui/material/styles";

const CssTextField = styled(MUITextField)({
  backgroundColor: "var(--color-white)",
  fontFamily: "Rubik",
  "& .MuiInputLabel-root": {
    color: "var(--color-dark-blue)",
    width: "100%",
  },
  "& .Mui-error": {
    borderRadius: 0,
  },
  "& .MuiInputBase-input": {
    color: "var(--color-dark-blue)",
  },
  "& label.Mui-focused": {
    color: "var(--color-dark-blue)",
    fontStyle: "italic",
  },
  "& .MuiInput-underline:after": {
    color: "var(--color-dark-blue)",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderRadius: 0,
    },
    "&.Mui-focused fieldset": {
      borderColor: "var(--color-dark-blue)",
      borderRadius: 0,
    },
  },
});

const TextField = (props) => {
  return <CssTextField {...props} />;
};
export default TextField;
