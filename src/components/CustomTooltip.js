import React from "react";
import Tooltip from "@mui/material/Tooltip";

const CustomTooltip = ({ value, shade, ...props }) => {
  return (
    <Tooltip
      {...props}
      PopperProps={{
        style: {
          backgroundColor: shade,
          color: "white",
          borderRadius: "4px",
          fontSize: "0.75rem",
          padding: "4px 8px",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
        },
      }}
      arrow
    >
      <span>{value}</span>
    </Tooltip>
  );
};

export default CustomTooltip;
