import React from "react";

const Alert = ({ message, type }) => {
  return (
    <div
      className={`alert alert-${type}`}
      style={{ width: "100%", textAlign: "center" }}
      role="alert"
    >
      {message}
    </div>
  );
};

export default Alert;
