import React from "react";
import classes from "./TextLoader.module.css";
const TextLoader = (props) => {
  return (
    <div className={classes["cssloader"]}>
      <div className={classes["triangle1"]}></div>
      <div className={classes["triangle2"]}></div>
      <p className={classes["text"]}>{props.message}</p>
    </div>
  );
};

export default TextLoader;
