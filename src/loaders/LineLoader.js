import React from "react";
import classes from "./LineLoader.module.css";
const LineLoader = () => {
  return (
    <div className={classes.loader}>
      <div className={classes["jimu-primary-loading"]}></div>
    </div>
  );
};

export default LineLoader;
