import { useState } from "react";
import { Children } from "react";
import { Div, Step, Steper } from "./style";
import { useTimeTrackerContext } from "../../../store/context/TimeTrackerContext";

const Stepper = ({ children, steps, onChangeTab }) => {
  const [activeStep, setActiveStep] = useState(
    window.location.pathname === '/requests' ? Number(localStorage.getItem("requestTabIndex")) :
      window.location.pathname.split("/")[1] === 'timetracker' ? Number(localStorage.getItem("timetrackertab")) : 0
  );
  const { setRepport } = useTimeTrackerContext();

  const handleChange = (index) => {
    if (window.location.pathname === '/requests') {
      localStorage.setItem("requestTabIndex", index)
    }

    if(window.location.pathname.split("/")[1] === 'timetracker'){
      localStorage.removeItem("timetrackertab")
    }

    try {
      setActiveStep(index);
      onChangeTab(index);
    } catch (e) { }
    document?.getElementsByClassName("MuiAutocomplete-clearIndicator")[0]?.click()
  };

  return (
    <Div>
      <Steper activeStep={activeStep}>
        {steps.map((label, index) => {
          return (
            <Step
              key={label}
              onClick={() => { handleChange(index); setRepport() }}
              enable={activeStep === index}
            >
              {label}
            </Step>
          );
        })}
      </Steper>
      {Children.map(
        children,
        (child, index) =>
          index === activeStep && <div style={{ width: "100%" }}>{child}</div>
      )}
    </Div>
  );
};

export default Stepper;
