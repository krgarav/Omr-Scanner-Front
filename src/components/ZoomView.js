import { useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const ZoomViewer = ({ currentImage, baseUrl, focusBox }) => {
  const imgRef = useRef(null);
  const [scaledBox, setScaledBox] = useState(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete) {
      calculateScaledBox();
    }

    // In case image loads after mount
    const handleLoad = () => calculateScaledBox();
    img.addEventListener("load", handleLoad);

    return () => img.removeEventListener("load", handleLoad);
  }, [focusBox, currentImage]);

  const calculateScaledBox = () => {
    const img = imgRef.current;

    if (!img) return;

    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    const displayedWidth = img.clientWidth;
    const displayedHeight = img.clientHeight;

    const scaleX = displayedWidth / naturalWidth;
    const scaleY = displayedHeight / naturalHeight;

    setScaledBox({
      top: focusBox.y,
      left: focusBox.x,
      width: focusBox.width,
      height: focusBox.height,
    });
  };

  //   useEffect(() => {
  //     if (transformRef.current) {
  //       const { setTransform } = transformRef.current;

  //       const containerWidth = window.innerWidth;
  //       const containerHeight = window.innerHeight;

  //       const scale = containerWidth / focusBox.width;

  //       const offsetX =
  //         -focusBox.x * scale +
  //         (containerWidth / 2 - (focusBox.width * scale) / 2);
  //       const offsetY =
  //         -focusBox.y * scale +
  //         (containerHeight / 2 - (focusBox.height * scale) / 2);

  //       setTransform(scale, offsetX, offsetY);
  //     }
  //   }, [focusBox]);
  return (
    <TransformWrapper
      //   ref={transformRef}
      minScale={0.5}
      limitToBounds={false}
      centerOnInit={false}
    >
      <TransformComponent>
        {/* <img
          src={`http://${baseUrl}/${currentImage}`}
          alt="Selected"
          style={{
            width: "100%",
            maxHeight: "70vh",
            display: "block",
          }}
        /> */}

        <div
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

          {/* {selectedFields} */}
        </div>
        {/* <div style={{ position: "relative", width: "100%", maxHeight: "70vh" }}>
          <img
            ref={imgRef}
            src={`http://${baseUrl}/${currentImage}`}
            alt="Selected"
            style={{
              width: "100%",
              maxHeight: "70vh",
              display: "block",
            }}
          />

          {scaledBox && (
            <div
              style={{
                position: "absolute",
                top: `${scaledBox.top}px`,
                left: `${scaledBox.left}px`,
                width: `${scaledBox.width}px`,
                height: `${scaledBox.height}px`,
                border: "2px solid red",
                boxSizing: "border-box",
                pointerEvents: "none",
              }}
            ></div>
          )}
        </div> */}
      </TransformComponent>
    </TransformWrapper>
  );
};
export default ZoomViewer;
