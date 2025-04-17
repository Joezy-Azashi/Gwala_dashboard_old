import React from "react";

const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img src={"/404.svg"} width={"40%"} />
    </div>
  );
};

export default NotFound;
