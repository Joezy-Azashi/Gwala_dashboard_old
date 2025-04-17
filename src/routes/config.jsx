import React from "react";
import PrivateRoute from "./privateRoute";

const WrapperRouteComponent = ({ auth, children }) => {
  if (auth) {
    return <PrivateRoute>{children}</PrivateRoute>;
  }
  return children;
};

export default WrapperRouteComponent;
