import React, { useEffect, useState } from 'react'
import classes from "./Imageswitch.module.css";

const Imageswitch = (props) => {
    const [checked, setChecked] = useState(false);
    // console.log(checked);
    props.onChange(checked)
   
    return (
        <label className={classes.switch}>
            <input type="checkbox" id='image-enable-input' onChange={() => { setChecked(prev => !prev) }} />
            <span className={classes.slider}></span>
        </label>
    )
}

export default Imageswitch