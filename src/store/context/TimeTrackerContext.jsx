import { createContext } from "react";
import { useState, useContext } from "react";
import dayjs from 'dayjs';

const MyContext = createContext({});

export function useTimeTrackerContext() {
  return useContext(MyContext);
}

export function TimeTrackerProvider({ children }) {
  const [filter, setFilter] = useState({
    status: "",
    endDate: "",
    startDate: "",
  });
  const [sort, setSort] = useState(-1);
  const [step, setStep] = useState(0);
  const [employee, setEmployee] = useState({});
  const [repport, setRepport] = useState();
  const [tabIndex, setTabIndex] = useState("1");

  return (
    <MyContext.Provider
      value={{
        filter,
        sort,
        setSort,
        setFilter,
        step,
        setStep,
        employee,
        setEmployee,
        repport,
        setRepport,
        tabIndex,
        setTabIndex,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}
