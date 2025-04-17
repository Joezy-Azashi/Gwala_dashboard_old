import React from "react";
import Stepper from "../../../components/TimeTracker/Stepper";
import Vacations from "./Vacations";
import Absences from "./Absences";
import { useLocale } from "../../../locales";
import Phones from "./Phones";

const RequestHistory = () => {
  const { formatMessage } = useLocale();
  const steps = [
    formatMessage({ id: "timetracker.steper.phone" }),
    // formatMessage({ id: "timetracker.steper.vacation" }),
    // formatMessage({ id: "timetracker.steper.absence" }),
  ];
  return (
    // <div>
    //   <Stepper steps={steps}>
    //     <Phones />
    //     <Vacations />
    //     <Absences />
    //   </Stepper>
    // </div>
     <div>
     {/* <Stepper steps={steps}> */}
       <Phones />
       {/* <Vacations />
       <Absences />
     </Stepper> */}
   </div>
  );
};

export default RequestHistory;
