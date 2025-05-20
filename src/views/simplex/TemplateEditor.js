import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import FormData from "components/FormData";
import classes from "./Template.module.css";
import { RxDragHandleDots2, RxCross2 } from "react-icons/rx";
import { Modal, Button, Row, Col, Spinner } from "react-bootstrap";
import NormalHeader from "components/Headers/NormalHeader";
import SmallHeader from "components/Headers/SmallHeader";
import { useNavigate, useParams } from "react-router-dom";
import { getLayoutDataById } from "helper/TemplateHelper";
import getBaseUrl from "services/BackendApi";
import { updateTemplate } from "helper/TemplateHelper";
import { toast } from "react-toastify";
import { replace } from "lodash";
import axios from "axios";
import stripJsonComments from "strip-json-comments";
const TemplateEditor = () => {
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const res = await axios.get(`${baseUrl}${paths.jsonPath}`, {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        });

        if (res) {
          const field = res?.data?.fields;
          setBoxes(field);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (paths && baseUrl) {
      fetchJsonData();
    }
  }, [paths, baseUrl]);

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
          {Array.from({ length: box.totalRow }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              style={{
                display: "flex",
                gap: `${box.gap}px`,
                alignItems: "center",
                width: "100%",
                height: `${100 / box.totalRow}%`,
                justifyContent: "space-between",
              }}
            >
              {Array.from({ length: box.totalCol }).map((_, colIdx) => (
                <div
                  key={colIdx}
                  style={{
                    aspectRatio: "1",
                    width: `calc((100% - ${(box.totalCol - 1) * box.gap}px) / ${
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

  const zoomOut = () => {
    setZoomScale((prev) => prev - 0.1);
  };
  const zoomIn = () => {
    setZoomScale((prev) => prev + 0.1);
  };
  const saveTemplate = async () => {
    // console.log(boxes);
    const mappedData = boxes.map((box, idx) => {
      return { ...box, bubbles: allBubbles[idx] };
    });
    const obj = {
      name: paths.fileName,
      fields: mappedData,
    };
    console.log(obj);
    // return;
    const jsonString = JSON.stringify(obj);

    // Optional: ensure the filename ends with `.json`
    const jsonFileName = paths.fileName.endsWith(".json")
      ? paths.fileName
      : `${paths.fileName}.json`;

    // Create a File from JSON string (more appropriate if filename is needed)
    const jsonFile = new File([jsonString], jsonFileName, {
      type: "application/json",
    });

    const res = await updateTemplate(paths.fileName, jsonFile);
    if (res?.state) {
      toast.success("Template Saved Successfully");
      navigate("/admin/template", { replace: true });
    }

    // console.log(obj);
    // console.log(paths.fileName);
  };

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
                x: -40,
                y: 0,
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
                <div
                  className="bg-primary text-white px-3 py-2 rounded-top d-flex align-items-center justify-content-between drag-handle"
                  style={{ cursor: "move" }}
                >
                  <div className="d-flex align-items-center">
                    <RxDragHandleDots2 className="me-2 fs-5" />
                    <span>Move Form</span>
                  </div>
                  <button
                    type="button"
                    className="close text-white hover:text-red-200"
                    aria-label="Close"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent drag interference
                      setActiveBox(null);
                    }}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>

                {/* Actual form (not draggable) */}
                <div className="p-4">
                  <FormData
                    setCurrentBoxData={setCurrentBoxData}
                    currentBoxData={currentBoxData}
                    setBoxes={setBoxes}
                    activeBox={activeBox}
                    allBubbles={allBubbles}
                    isNewBox={false}
                    setActiveBox={setActiveBox}
                  />
                </div>
              </div>
            </Rnd>
          )}
        </div>
      </section>

      <div className="d-flex justify-content-center mt-2 z-9999">
        <button
          type="button"
          className="btn btn-primary me-2"
          onClick={() => {
            setCurrentBoxData({});
            setIsOpen(true);
          }}
        >
          Add Box
        </button>

        <button
          type="button"
          className="btn btn-success"
          onClick={saveTemplate}
        >
          Save Template
        </button>
      </div>

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
