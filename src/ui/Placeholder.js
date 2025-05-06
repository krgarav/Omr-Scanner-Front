import React from 'react';
import styles from './Placeholder.module.css'; // Import the CSS module

const Placeholder = ({ width = '100%', height = '1em' }) => {
  return (
    <div
      className={styles.placeholder}
      style={{ width, height }}
    ></div>
  );
};

export default Placeholder;
