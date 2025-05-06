import React from "react";
import classes from "./Jobcard.module.css";
import DuplexJob from "./DuplexJob";
const Jobcard = (props) => {
  const handleClick = () => {
    props.handleJob(props.text);
  };
  return (
    <div className={classes.card} onClick={handleClick}>
      <div className={classes.inner}>{props.text}</div>
      <small>{props.secondary}</small>
      {/* {props.text === "DUPLEX" && <DuplexJob />} */}
    </div>
  );
};

export default Jobcard;
