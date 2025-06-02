import { useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Rnd } from "react-rnd";
import classes from "./ZoomView.module.css";
const ZoomViewer = ({ currentImage, baseUrl, focusBox, templateData }) => {
  const [scaledBox, setScaledBox] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  useEffect(() => {
    setBoxes(templateData);
  }, [templateData]);

  // Auto-scroll to focusBox
  useEffect(() => {
    if (focusBox && containerRef.current) {
      containerRef.current.scrollTo({
        left: focusBox.x - 20, // optional padding
        top: focusBox.y - 20,
        behavior: "smooth",
      });
    }
  }, [focusBox]);
  const selectedFields = boxes.map((box, index) => {
    const style = classes.notActive;

    return (
      <Rnd
        key={index}
        size={{ width: box.width, height: box.height }}
        position={{ x: box.x, y: box.y }}
        bounds="parent"
        disableDragging="true"
      >
        <div className={style}></div>
      </Rnd>
    );
  });

  return (
    <>
      <div
        ref={containerRef}
        style={{
          position: "relative",
          display: "inline-block",
          border: "1px solid #ccc",
          // scale: zoomScale,
          overflow: "hidden",
          transformOrigin: "top left", // Zoom from top-left
        }}
      >
        <img
          ref={imgRef}
          src={`http://${baseUrl}/${currentImage}`}
          alt="to crop"
          style={{
            display: "block",
            maxWidth: "100%",
            height: "80vh",
          }}
        />

        {selectedFields}
      </div>
    </>
  );
};
export default ZoomViewer;
