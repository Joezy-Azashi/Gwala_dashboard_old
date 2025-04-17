import React, { useState } from "react";
import Steper from "../../components/TimeTracker/Stepper";
import RequestHistory from "./RequestHistory";
import AccontInfos from "./AccountInfos";
import Report from "./Report";
import { useLocation, useParams } from "react-router";
import { useLocale } from "../../locales";
import SideContainer from "../../containers/SideContainer";
import TimeTrackerSide from "./RightSide";
import {
  TimeTrackerProvider,
  useTimeTrackerContext,
} from "../../store/context/TimeTrackerContext";

const TimeTrackerTabs = ({ reportTabChange, selectDay, setSelectDay }) => {
  const { setStep } = useTimeTrackerContext();

  const { id } = useParams();
  const location = useLocation();
  const { formatMessage } = useLocale();
  const timeTrackingData = location?.state?.el;
  const steps = [
    formatMessage({ id: "timetracker.steper.infos" }),
    formatMessage({ id: "timetracker.steper.reports" }),
    formatMessage({ id: "timetracker.steper.history" }),
  ];
  return (
    <div>
      <Steper
        steps={steps}
        onChangeTab={(value) => {
          setStep(value);
          setHideSideNav(value);
        }}
      >
        <AccontInfos timeTrackingData={timeTrackingData} />
        <Report
          name={location?.state?.name}
          reportTabChange={reportTabChange}
          selectDay={selectDay}
          setSelectDay={setSelectDay}
        />
        <RequestHistory />
      </Steper>
    </div>
  );
};

const TimeTrackeDetails = () => {
  const [reportTabChange, setReportTabChange] = useState(0);
  const [selectDay, setSelectDay] = useState();
  return (
    <TimeTrackerProvider>
      <SideContainer
        RightSideComponent={
          <TimeTrackerSide
            setReportTabChange={setReportTabChange}
            setSelectDay={setSelectDay}
          />
        }
        LeftSideComponent={
          <TimeTrackerTabs
            reportTabChange={reportTabChange}
            selectDay={selectDay}
            setSelectDay={setSelectDay}
          />
        }
      />
    </TimeTrackerProvider>
  );
};

export default TimeTrackeDetails;
