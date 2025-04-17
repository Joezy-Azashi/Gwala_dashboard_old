import React from "react";
import SideContainer from "../../containers/SideContainer";
import LeftSide from "./LeftSide";
import RightSide from "./RightSide";
import { useState } from "react";

const AdvanceManualy = () => {
  const [filter, setFilter] = useState({
    employee: "",
    branch: "",
    sort: 1,
  });

  return (
    <SideContainer
      LeftSideComponent={<LeftSide filter={filter} />}
      RightSideComponent={<RightSide filter={filter} setFilter={setFilter} />}
    />
  );
};

export default AdvanceManualy;
