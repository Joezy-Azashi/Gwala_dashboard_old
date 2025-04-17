import { Slider as MUISlider, TextField } from "@mui/material";
import { styled as styledMui } from "@mui/material/styles";
import styled from "styled-components";

const InputStyledContainer = styled.div`
  width: 100%;
  position: relative;
  height: 40px;
  background-color: ${(props) => (props.bg ? props.bg : "var(--color-white)")};
  margin-top: 8px;
  .label {
    position: absolute;
    font-size: 13px;
    font-style: italic;
    top: -5px;
    left: 10%;
    display: flex;
    align-items: center;
    pointer-events: none;
    color: var(--color-dark-blue);
  }
`;

const MerchantSlider = (props) => {
  const CssSlider = styledMui(MUISlider)({
    color: `${props.slidercolor || "var(--color-blue)"}`,
  });

  return (
    <InputStyledContainer bg={props.bg}>
      <label className="label" htmlFor="fname" id="label-fname">
        <div className="text">{props.label}</div>
      </label>
      <div
        style={{
          height: "3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 15px"
        }}
      >
        <MUISlider {...props} />
        <hr style={{ width: 1, height: "40px", margin: "-9px 8px 0 5px" }} />
        {/* <p style={{width: "25px"}}>{props.value.length < 1 ? 0 : props.value}%</p> */}
        <TextField
          type='number'
          onKeyPress={(e) => {
            const charCode = e.which ? e.which : e.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
              e.preventDefault();
            }
          }}
          value={props?.value}
          onChange={props?.onChange}
          inputProps={{ style: { textAlign: 'center' } }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "1.9rem",
              width: "3.4rem",
            },
            "& fieldset": { border: "none" }
          }}
        />
      </div>
    </InputStyledContainer>
  );
};
export default MerchantSlider;
