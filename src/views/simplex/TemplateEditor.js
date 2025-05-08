import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import FormData from "components/FormData";
import classes from "./Template.module.css";
import { RxDragHandleDots2 } from "react-icons/rx";
import { Modal, Button, Row, Col, Spinner } from "react-bootstrap";
import NormalHeader from "components/Headers/NormalHeader";
import SmallHeader from "components/Headers/SmallHeader";
import { useParams } from "react-router-dom";
import { getLayoutDataById } from "helper/TemplateHelper";
import getBaseUrl from "services/BackendApi";
const TemplateEditor = ({ image, title }) => {
  const [boxes, setBoxes] = useState([]);
  const [activeBox, setActiveBox] = useState(null);
  const [currentBoxData, setCurrentBoxData] = useState(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const [trigger, setTrigger] = useState(false);
  const [containerSize, setContainerSize] = useState({});
  const [zoomScale, setZoomScale] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [paths, setPaths] = useState(null);
  const [baseUrl, setBaseUrl] = useState(null);
  const buttonRef = useRef(null);
  const { Id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = await getBaseUrl();
      setBaseUrl(baseUrl);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchTemplateData = async () => {
      const res = await getLayoutDataById(Id);
      console.log(res.data);

      if (res) {
        setPaths(res.data);
      }
    };
    if (Id) {
      fetchTemplateData();
    }
  }, [Id]);

  useEffect(() => {
    const handledeleteKey = (e) => {
      if (e.key === "Delete" && activeBox !== null) {
        const res = window.confirm("Are you sure you want to delete this box?");
        if (res) {
          setBoxes((prev) => prev.filter((_, i) => i !== activeBox));
          setActiveBox(null);
        }
      }
    };
    window.addEventListener("keydown", handledeleteKey);
    return () => {
      window.removeEventListener("keydown", handledeleteKey);
    };
  }, [activeBox]);
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      // console.log("Container size:", width, height);
      setContainerSize({ width, height });
      // You can also save it to state if needed:
      // setContainerSize({ width, height });
    }
  }, [boxes, trigger]);

  const updateBox = (index, newProps) => {
    setBoxes((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...newProps };
      return copy;
    });
  };

  const addBox = () => {
    setBoxes((prev) => [
      ...prev,
      {
        x: 100,
        y: 100,
        width: 150,
        height: 100,
        totalCol: 8,
        totalRow: 10,
        gap: 1,
      },
    ]);
  };
  console.log(boxes);
  const removeBox = (index) => {
    setBoxes((prev) => prev.filter((_, i) => i !== index));
  };

  const getImageCoordinates = (box) => {
    const { x, y, width, height } = box;

    const img = imageRef.current;
    if (!img) return box;

    const renderedWidth = img.clientWidth;
    const renderedHeight = img.clientHeight;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    const scaleX = naturalWidth / renderedWidth;
    const scaleY = naturalHeight / renderedHeight;

    return {
      x: Math.round(x * scaleX),
      y: Math.round(y * scaleY),
      width: Math.round(width * scaleX),
      height: Math.round(height * scaleY),
    };
  };

  const selectedFields = boxes.map((box, index) => {
    const style = index !== activeBox ? classes.activeField : classes.notActive;

    return (
      <Rnd
        key={index}
        size={{ width: box.width, height: box.height }}
        position={{ x: box.x, y: box.y }}
        onDragStop={(e, d) => {
          updateBox(index, { x: d.x, y: d.y });
        }}
        onResize={(e, direction, ref, delta, position) => {
          updateBox(index, {
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height),
            ...position,
          });
        }}
        bounds="parent"
        onClick={() => {
          setActiveBox(index);
          setCurrentBoxData(box);
        }}
      >
        <div ref={containerRef} className={style}>
          {Array.from({ length: box.totalCol }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              style={{
                display: "flex",
                gap: `${box.gap}px`,
                alignItems: "center",
                width: "100%",
                height: `${100 / box.totalCol}%`,
                justifyContent: "space-between",
              }}
            >
              {Array.from({ length: box.totalRow }).map((_, colIdx) => (
                <div
                  key={colIdx}
                  style={{
                    aspectRatio: "1",
                    width: `calc((100% - ${(box.totalRow - 1) * box.gap}px) / ${
                      box.totalRow
                    })`,
                    height: "80%",
                    borderRadius: "50%",
                    border: "1px solid black",
                    backgroundColor: "transparent",
                    boxSizing: "border-box",
                  }}
                />
              ))}
            </div>
          ))}
          <button
            onClick={() => removeBox(index)}
            style={{
              position: "absolute",
              top: -10,
              right: -10,
              background: "#fff",
              border: "1px solid red",
              borderRadius: "50%",
              width: 20,
              height: 20,
              cursor: "pointer",
              fontSize: "12px",
              lineHeight: "18px",
              padding: 0,
              zIndex: 9990,
              color: "cadetblue",
            }}
          >
            ×
          </button>
        </div>
      </Rnd>
    );
  });

  const getBubbleCoordinates = (box, imageRef) => {
    const image = imageRef.current;
    if (!image) return [];

    // Calculate scaling factors
    const scaleX = image.naturalWidth / image.clientWidth;
    const scaleY = image.naturalHeight / image.clientHeight;

    // Corrected dimension assignments
    const rows = box.totalRow;
    const cols = box.totalCol;
    if (rows <= 0 || cols <= 0) return [];

    // Precompute scaled coordinates and dimensions
    const scaledInnerX = box.x * scaleX;
    const scaledInnerY = box.y * scaleY;
    const scaledBubbleWidth = (box.width / cols) * scaleX;
    const scaledBubbleHeight = (box.height / rows) * scaleY;

    // Precompute integer dimensions once
    const width = Math.floor(scaledBubbleWidth);
    const height = Math.floor(scaledBubbleHeight);

    // Cache grid coordinates
    const xCoords = Array.from({ length: cols }, (_, col) =>
      Math.floor(scaledInnerX + scaledBubbleWidth * col)
    );
    const yCoords = Array.from({ length: rows }, (_, row) =>
      Math.floor(scaledInnerY + scaledBubbleHeight * row)
    );

    // Generate bubbles using precomputed values
    const bubbles = [];
    for (let row = 0; row < rows; row++) {
      const y = yCoords[row];
      for (let col = 0; col < cols; col++) {
        bubbles.push({
          x: xCoords[col],
          y,
          width,
          height,
          row,
          col,
        });
      }
    }

    return bubbles;
  };

  const allBubbles = boxes.map((box) => getBubbleCoordinates(box, imageRef));

  const downloadHandler = () => {
    const dataStr = JSON.stringify(allBubbles, null, 2); // Convert to formatted JSON
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "template.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url); // Clean up
  };
  const zoomOut = () => {
    setZoomScale((prev) => prev - 0.1);
  };
  const zoomIn = () => {
    setZoomScale((prev) => prev + 0.1);
  };
  const saveTemplate = () => {
    // console.log(boxes);
    const mappedData = boxes.map((box, idx) => {
      return { ...box, bubbles: allBubbles[idx] };
    });
    const obj = {
      name: title,
      fields: mappedData,
    };
    console.log(obj);
  };
  console.log(paths);
  if (!paths) return;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <SmallHeader />
      {/* <h1 className="text-4xl font-bold text-gray-800 text-center mb-6 drop-shadow-sm">
        <span>Template Name : </span> {title}
      </h1> */}

      <section style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            display: "inline-block",
            border: "1px solid #ccc",
            // scale: zoomScale,
            overflow: "hidden",
            transform: `scale(${zoomScale})`,
            transformOrigin: "top left", // Zoom from top-left
          }}
        >
          <img
            ref={imageRef}
            src={`${baseUrl}${paths.imgPath}`}
            alt="to crop"
            style={{
              display: "block",
              maxWidth: "100%",
              height: "80vh",
            }}
          />

          {selectedFields}
        </div>
        <div>
          {activeBox !== null && (
            <Rnd
              default={{
                x: 100,
                y: 100,
                width: 400,
                height: "auto",
              }}
              bounds="window"
              enableResizing={false}
              dragHandleClassName="drag-handle"
              className="z-[99] fixed"
            >
              <div className="bg-white rounded-lg shadow-lg w-full">
                {/* Drag handle bar */}
                <div className="bg-blue-600 text-white px-4 py-2 rounded-t-lg drag-handle cursor-move flex items-center gap-2">
                  <RxDragHandleDots2 className="text-xl" />
                  <span>Move Form</span>
                </div>

                {/* Actual form (not draggable) */}
                <div className="p-4">
                  <FormData
                    setCurrentBoxData={setCurrentBoxData}
                    currentBoxData={currentBoxData}
                    setBoxes={setBoxes}
                    activeBox={activeBox}
                    allBubbles={allBubbles}
                  />
                </div>
              </div>
            </Rnd>
          )}
        </div>
      </section>

      <div className="flex justify-center mt-1 z-[9999]">
        <Button
          onClick={() => {
            setCurrentBoxData({});
            setIsOpen(true);
          }}
          // onClick={addBox}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200"
        >
          Add Box
        </Button>
      </div>
      <Button
        onClick={saveTemplate}
        className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-2 rounded-full shadow-lg hover:bg-green-700 transition duration-200 z-50"
      >
        Save Template
      </Button>
      {isOpen && (
        <Modal
          show={isOpen}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Create Template
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormData
              setCurrentBoxData={setCurrentBoxData}
              currentBoxData={currentBoxData}
              setBoxes={setBoxes}
              activeBox={activeBox}
              allBubbles={allBubbles}
              isNewBox={true}
              setIsOpen={setIsOpen}
              ref={buttonRef}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="button"
              onClick={() => {
                setIsOpen(false);
              }}
              variant="warning"
            >
              Close
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                console.log(buttonRef);
                if (buttonRef.current) {
                  console.log(buttonRef);
                  buttonRef.current.click(); // Triggers form submit
                }
              }}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default TemplateEditor;
