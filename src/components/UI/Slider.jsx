import { Slider as MUISlider } from "@mui/material";
import { styled as styledMui } from "@mui/material/styles";
import styled from "styled-components";

const InputStyledContainer = styled.div`
  width: 100%;
  position: relative;
  background-color: ${(props) => (props.bg ? props.bg : "var(--color-white)")};
  margin-top: 11px;
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

const Slider = (props) => {
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
          justifyContent: "start",
          padding: 26,
        }}
      >
        <MUISlider {...props} />
      </div>
    </InputStyledContainer>
  );
};
export default Slider;
