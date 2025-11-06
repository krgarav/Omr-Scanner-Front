import React, { useState, useRef, useEffect, useMemo } from "react";
import { Rnd } from "react-rnd";
import FormData from "components/FormData";
import classes from "./Template.module.css";
import { RxDragHandleDots2 } from "react-icons/rx";
import { Modal, Button } from "react-bootstrap";
import SmallHeader from "components/Headers/SmallHeader";
import { useNavigate, useParams } from "react-router-dom";
import { getLayoutDataById, updateTemplate } from "helper/TemplateHelper";
import getBaseUrl from "services/BackendApi";
import { toast } from "react-toastify";
import axios from "axios";
import ReferenceFieldModal from "modals/ReferenceFieldModal";

const referenceOptions = [
  { id: "topLeft", label: "Top Left" },
  { id: "bottomLeft", label: "Bottom Left" },
  { id: "topRight", label: "Top Right" },
  { id: "bottomRight", label: "Bottom Right" },
];

const TemplateEditor = () => {
  // Core states
  const [boxes, setBoxes] = useState([]);
  const [activeBox, setActiveBox] = useState(null);
  const [currentBoxData, setCurrentBoxData] = useState(null);
  const imageRef = useRef(null);
  const [trigger, setTrigger] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [paths, setPaths] = useState(null);
  const [baseUrl, setBaseUrl] = useState(null);
  const [showReferenceBox, setShowReferenceBox] = useState(false);
  const [referenceBoxes, setReferenceBoxes] = useState([]);
  const [currentReferenceBox, setCurrentReferenceBox] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [options, setOptions] = useState(referenceOptions);
  const buttonRef = useRef(null);
  const [Radius, setRadius] = useState(0.38);

  const { Id } = useParams();
  const navigate = useNavigate();

  // Image natural size and base display size
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [baseDisplaySize, setBaseDisplaySize] = useState({
    width: 0,
    height: 0,
  });

  // Fetch baseUrl and template paths
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
      if (res) setPaths(res.data);
    };
    if (Id) fetchTemplateData();
  }, [Id]);

  // Fetch JSON fields
  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${baseUrl}${paths.jsonPath}`, {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res) {
          const field = res?.data?.fields || [];
          const fieldDetails = res?.data?.referenceCoordinate;
          if (fieldDetails && Object.keys(fieldDetails).length > 0) {
            setReferenceBoxes(fieldDetails);
            setShowReferenceBox(true);
          } else {
            setShowReferenceBox(false);
          }
          setBoxes(field || []);
        }
      } catch (error) {
        console.error("Error fetching JSON data:", error);
      }
    };
    if (paths && baseUrl) fetchJsonData();
  }, [paths, baseUrl]);

  // Delete key handling
  useEffect(() => {
    const handleDeleteKey = (e) => {
      // Delete Field Box
      if (e.key === "Delete" && activeBox !== null) {
        const res = window.confirm("Are you sure you want to delete this box?");
        if (res) {
          setBoxes((prev) => prev.filter((_, i) => i !== activeBox));
          setActiveBox(null);
        }
      }

      // Delete Reference Box
      if (e.key === "Delete" && currentReferenceBox !== null) {
        const res = window.confirm(
          "Are you sure you want to delete this reference box?"
        );
        if (res) {
          // Remove the selected reference box
          const updatedBoxes = referenceBoxes.filter(
            (_, i) => i !== currentReferenceBox
          );
          setReferenceBoxes(updatedBoxes);
          setCurrentReferenceBox(null);

          // ✅ Recalculate available options (avoid duplicates)
          const usedPositions = updatedBoxes.map((b) => b.position);
          const availableOptions = referenceOptions.filter(
            (opt) => !usedPositions.includes(opt.id)
          );
          setOptions(availableOptions);
        }
      }
    };

    window.addEventListener("keydown", handleDeleteKey);
    return () => window.removeEventListener("keydown", handleDeleteKey);
  }, [activeBox, currentReferenceBox, referenceBoxes]);

  // Update baseDisplaySize on image load or window resize
  useEffect(() => {
    const updateBase = () => {
      const img = imageRef.current;
      if (!img || !img.naturalWidth) return;
      const clientW = img.clientWidth;
      const clientH = img.clientHeight;
      const baseW = clientW / (zoomScale || 1);
      const baseH = clientH / (zoomScale || 1);
      console.log(
        `Updating baseDisplaySize: client=${clientW}x${clientH}, base=${baseW}x${baseH}, zoomScale=${zoomScale}`
      );
      setBaseDisplaySize({ width: baseW, height: baseH });
    };

    updateBase();
    window.addEventListener("resize", updateBase);
    return () => window.removeEventListener("resize", updateBase);
  }, [zoomScale, paths, baseUrl]);

  // Handle image load to set natural and base display sizes
  const handleImageLoad = (e) => {
    const img = e.target;
    const naturalW = img.naturalWidth || 0;
    const naturalH = img.naturalHeight || 0;
    const clientW = img.clientWidth;
    const clientH = img.clientHeight;
    const baseW = clientW / (zoomScale || 1);
    const baseH = clientH / (zoomScale || 1);
    console.log(
      `Image loaded: natural=${naturalW}x${naturalH}, client=${clientW}x${clientH}, base=${baseW}x${baseH}, zoomScale=${zoomScale}`
    );
    setNaturalSize({ width: naturalW, height: naturalH });
    setBaseDisplaySize({ width: baseW, height: baseH });
  };

  // Calculate effective scale
  const effectiveScale = useMemo(() => {
    if (!naturalSize.width || !baseDisplaySize.width) return zoomScale;
    const scale = (baseDisplaySize.width / naturalSize.width) * zoomScale;
    console.log(
      `effectiveScale: ${scale}, naturalSize: ${naturalSize.width}x${naturalSize.height}, baseDisplaySize: ${baseDisplaySize.width}x${baseDisplaySize.height}, zoomScale: ${zoomScale}`
    );
    return scale;
  }, [naturalSize, baseDisplaySize, zoomScale]);

  // Update box in natural pixels
  const updateBox = (index, newProps) => {
    setBoxes((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...newProps };
      console.log(`Updated box ${index}:`, copy[index]);
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

  // Get corner coordinates in natural pixels
  const getCornerCoordinates = (box) => {
    const { x, y, width, height } = box;
    return {
      topLeft: { x: x, y: y, width: 60, height: 60 },
      topRight: { x: x + width, y: y, width: 60, height: 60 },
      bottomLeft: { x: x, y: y + height, width: 60, height: 60 },
      bottomRight: { x: x + width, y: y + height, width: 60, height: 60 },
    };
  };

  // Sanitize reference box coordinates
  const getRefCoordinates = (boxes) => {
    if (!boxes || boxes.length === 0) return [];
    return boxes.map((box) => ({
      position: box.position,
      x: Math.round(box.x),
      y: Math.round(box.y),
      width: Math.round(box.width),
      height: Math.round(box.height),
    }));
  };

  // Calculate bubble coordinates using center + radius → bounding box
  const getBubbleCoordinates = (box) => {
    console.log(box)
    if (!box) return [];
    const { x, y, width, height, totalRow, totalCol } = box;
    if (!totalRow || !totalCol || totalRow <= 0 || totalCol <= 0) return [];

    const cellWidth = width / totalCol;
    const cellHeight = height / totalRow;
    const rScale = box?.radius || 0.4;
    const radius = Math.min(cellWidth, cellHeight) * (rScale );

    const bubbles = [];
    for (let row = 0; row < totalRow; row++) {
      for (let col = 0; col < totalCol; col++) {
        // Bubble center (cx, cy)
        const cx = x + col * cellWidth + cellWidth / 2;
        const cy = y + row * cellHeight + cellHeight / 2;

        // Bounding box from center and radius
        const bubble = {
          x: Math.round(cx - radius+1.7), // top-left x
          y: Math.round(cy - radius+1.7), // top-left y
          width: Math.round(radius * 2),
          height: Math.round(radius * 2),
          row,
          col,
        };

        bubbles.push(bubble);

        // console.log(
        //   `Bubble (${row}, ${col}): center=(${bubble.cx}, ${bubble.cy}), r=${bubble.r}, box=(${bubble.x}, ${bubble.y}, ${bubble.width}x${bubble.height})`
        // );
      }
    }

    // console.log(
    //   `Box at (${x}, ${y}), size: ${width}x${height}, grid: ${totalCol}x${totalRow}, cell: ${cellWidth}x${cellHeight}, radius: ${radius}`
    // );

    return bubbles;
  };

  console.log(currentBoxData?.fieldType)

  function transformPositions(arr) {
    const result = {};
    arr.forEach((item) => {
      const key = item.position;
      result[key] = {
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
      };
    });
    return result;
  }

  const allBubbles = boxes.map((box) => getBubbleCoordinates(box));

  const zoomOut = () => {
    setZoomScale((prev) => Math.max(0.1, +(prev - 0.1).toFixed(2)));
  };
  const zoomIn = () => {
    setZoomScale((prev) => +(prev + 0.1).toFixed(2));
  };

  // Save template
  const saveTemplate = async () => {
    let referenceField = [];
    if (showReferenceBox) {
      const coordinates = getRefCoordinates(referenceBoxes);
      if (coordinates.length <= 3) {
        toast.error("Please select all the reference boxes before saving.");
        return;
      }
      const refBoxed = transformPositions(coordinates);
      referenceField = refBoxed;
    }

    const mappedData = boxes.map((box, idx) => {
      const bubbles = getBubbleCoordinates(box);
      console.log(`Saving box ${idx}:`, { ...box, bubbles });
      return { ...box, bubbles };
    });

    const obj = {
      name: paths.fileName,
      fields: mappedData,
      referncefield: showReferenceBox ? [referenceField] : [],
      referenceCoordinate: showReferenceBox ? referenceBoxes : {},
    };

    const jsonString = JSON.stringify(obj);
    const jsonFileName = paths.fileName.endsWith(".json")
      ? paths.fileName
      : `${paths.fileName}.json`;

    const jsonFile = new File([jsonString], jsonFileName, {
      type: "application/json",
    });

    const res = await updateTemplate(paths.fileName, jsonFile);
    if (res?.state) {
      toast.success("Template Saved Successfully");
      navigate("/admin/template", { replace: true });
    }
  };

  // Compute container dimensions
  const containerDisplayWidth = baseDisplaySize.width
    ? Math.round(baseDisplaySize.width * zoomScale)
    : undefined;
  const containerDisplayHeight = baseDisplaySize.height
    ? Math.round(baseDisplaySize.height * zoomScale)
    : undefined;

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
            overflow: "hidden",
            width: containerDisplayWidth
              ? `${containerDisplayWidth}px`
              : "auto",
            height: containerDisplayHeight
              ? `${containerDisplayHeight}px`
              : "auto",
            background: "#fff",
            marginBottom: "100px",
          }}
        >
          {/* Reference Boxes */}
          {referenceBoxes.map((box, index) => {
            const displayX = Math.round(box.x * effectiveScale);
            const displayY = Math.round(box.y * effectiveScale);
            const displayW = Math.round(box.width * effectiveScale);
            const displayH = Math.round(box.height * effectiveScale);

            return (
              <Rnd
                key={index}
                size={{ width: displayW, height: displayH }}
                position={{ x: displayX, y: displayY }}
                tabIndex={0}
                onClick={() => setCurrentReferenceBox(index)}
                onKeyDown={(e) => {
                  e.preventDefault();
                  const stepNatural = 5;
                  setReferenceBoxes((prev) => {
                    const updated = [...prev];
                    const current = updated[index];
                    switch (e.key) {
                      case "ArrowUp":
                        updated[index] = {
                          ...current,
                          y: current.y - stepNatural,
                        };
                        break;
                      case "ArrowDown":
                        updated[index] = {
                          ...current,
                          y: current.y + stepNatural,
                        };
                        break;
                      case "ArrowLeft":
                        updated[index] = {
                          ...current,
                          x: current.x - stepNatural,
                        };
                        break;
                      case "ArrowRight":
                        updated[index] = {
                          ...current,
                          x: current.x + stepNatural,
                        };
                        break;
                      default:
                        return prev;
                    }
                    console.log(
                      `Reference box ${index} moved to:`,
                      updated[index]
                    );
                    return updated;
                  });
                }}
                onDragStop={(e, d) => {
                  const naturalX = Math.round(d.x / effectiveScale);
                  const naturalY = Math.round(d.y / effectiveScale);
                  console.log(
                    `Reference box ${index} dragged to display: (${d.x}, ${d.y}), natural: (${naturalX}, ${naturalY}), effectiveScale: ${effectiveScale}`
                  );
                  setReferenceBoxes((prev) => {
                    const updated = [...prev];
                    updated[index] = {
                      ...updated[index],
                      x: naturalX,
                      y: naturalY,
                    };
                    return updated;
                  });
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  const naturalW = Math.round(
                    parseInt(ref.style.width, 10) / effectiveScale
                  );
                  const naturalH = Math.round(
                    parseInt(ref.style.height, 10) / effectiveScale
                  );
                  const naturalX = Math.round(position.x / effectiveScale);
                  const naturalY = Math.round(position.y / effectiveScale);
                  console.log(
                    `Reference box ${index} resized to natural: (${naturalX}, ${naturalY}, ${naturalW}, ${naturalH}), effectiveScale: ${effectiveScale}`
                  );
                  setReferenceBoxes((prev) => {
                    const updated = [...prev];
                    updated[index] = {
                      ...updated[index],
                      width: naturalW,
                      height: naturalH,
                      x: naturalX,
                      y: naturalY,
                    };
                    return updated;
                  });
                }}
                bounds="parent"
                style={{
                  border:
                    currentReferenceBox !== index
                      ? "2px solid #007bff"
                      : "2px solid red",
                  backgroundColor: "transparent",
                }}
              />
            );
          })}

          {/* Image */}
          <img
            ref={imageRef}
            src={`${baseUrl}${paths?.imgPath}`}
            alt="to crop"
            onLoad={handleImageLoad}
            style={{
              display: "block",
              width: containerDisplayWidth
                ? `${containerDisplayWidth}px`
                : "100%",
              height: containerDisplayHeight
                ? `${containerDisplayHeight}px`
                : "auto",
              userSelect: "none",
              pointerEvents: "auto",
            }}
          />

          {/* Field Boxes */}
          {boxes.map((box, index) => {
            const displayX = Math.round(box.x * effectiveScale);
            const displayY = Math.round(box.y * effectiveScale);
            const displayW = Math.round(box.width * effectiveScale);
            const displayH = Math.round(box.height * effectiveScale);
            const cellDisplayWidth = displayW / box.totalCol;
            const cellDisplayHeight = displayH / box.totalRow;
            const bubbleDisplaySize =
              Math.min(cellDisplayWidth, cellDisplayHeight) * box.radius * 2 ??
              0.38;
            return (
              <Rnd
                key={index}
                size={{ width: displayW, height: displayH }}
                position={{ x: displayX, y: displayY }}
                onDragStop={(e, d) => {
                  const naturalX = Math.round(d.x / effectiveScale);
                  const naturalY = Math.round(d.y / effectiveScale);
                  console.log(
                    `Box ${index} dragged to display: (${d.x}, ${d.y}), natural: (${naturalX}, ${naturalY}), effectiveScale: ${effectiveScale}`
                  );
                  updateBox(index, {
                    x: naturalX,
                    y: naturalY,
                  });
                }}
                onResize={(e, direction, ref, delta, position) => {
                  const naturalW = Math.round(
                    parseInt(ref.style.width, 10) / effectiveScale
                  );
                  const naturalH = Math.round(
                    parseInt(ref.style.height, 10) / effectiveScale
                  );
                  const naturalX = Math.round(position.x / effectiveScale);
                  const naturalY = Math.round(position.y / effectiveScale);
                  console.log(
                    `Box ${index} resizing to natural: (${naturalX}, ${naturalY}, ${naturalW}, ${naturalH}), effectiveScale: ${effectiveScale}`
                  );
                  updateBox(index, {
                    width: naturalW,
                    height: naturalH,
                    x: naturalX,
                    y: naturalY,
                  });
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  const naturalW = Math.round(
                    parseInt(ref.style.width, 10) / effectiveScale
                  );
                  const naturalH = Math.round(
                    parseInt(ref.style.height, 10) / effectiveScale
                  );
                  const naturalX = Math.round(position.x / effectiveScale);
                  const naturalY = Math.round(position.y / effectiveScale);
                  console.log(
                    `Box ${index} resized to natural: (${naturalX}, ${naturalY}, ${naturalW}, ${naturalH}), effectiveScale: ${effectiveScale}`
                  );
                  updateBox(index, {
                    width: naturalW,
                    height: naturalH,
                    x: naturalX,
                    y: naturalY,
                  });
                }}
                bounds="parent"
                onClick={() => {
                  setActiveBox(index);
                  setCurrentBoxData(box);
                }}
              >
                <div
                  className={
                    index === activeBox
                      ? classes.activeField
                      : classes.notActive
                  }
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${box.totalCol}, ${cellDisplayWidth}px)`,
                      gridTemplateRows: `repeat(${box.totalRow}, ${cellDisplayHeight}px)`,
                      width: `${displayW}px`,
                      height: `${displayH}px`,
                      border: "1px solid black",
                    }}
                  >
                    {Array.from({ length: box.totalRow * box.totalCol }).map(
                      (_, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            // border: "1px solid black",
                            minWidth: 0,
                            minHeight: 0,
                          }}
                        >
                          <div
                            style={{
                              width: `${bubbleDisplaySize}px`,
                              height: `${bubbleDisplaySize}px`,
                              // borderRadius: "50%",
                              border: "1px solid black",
                              backgroundColor: "transparent",
                            }}
                          />
                        </div>
                      )
                    )}
                  </div>

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
                    title="Remove box"
                  >
                    ×
                  </button>
                </div>
              </Rnd>
            );
          })}
        </div>

        {/* Form Editor */}
        <div>
          {activeBox !== null && (
            <Rnd
              default={{ x: -40, y: 0, width: 400, height: "auto" }}
              bounds="window"
              enableResizing={false}
              dragHandleClassName="drag-handle"
              className="z-[99] fixed"
            >
              <div className="bg-white rounded-lg shadow-lg w-full">
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
                      e.stopPropagation();
                      setActiveBox(null);
                    }}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>

                <div className="p-4">
                  <FormData
                    setCurrentBoxData={setCurrentBoxData}
                    currentBoxData={currentBoxData}
                    setBoxes={setBoxes}
                    activeBox={activeBox}
                    allBubbles={allBubbles}
                    isNewBox={false}
                    setActiveBox={setActiveBox}
                    setRadius={setRadius}
                    Radius={Radius}
                  />
                </div>
              </div>
            </Rnd>
          )}
        </div>
      </section>

      {/* Controls */}
      <div className="d-flex w-100 position-fixed bottom-0 bg-white z-9999">
        <div className="d-flex justify-content-around p-2 bg-white w-75 bottom-0">
          <div className="custom-control custom-switch">
            <input
              type="checkbox"
              className="custom-control-input"
              id="exampleCheck"
              onChange={(e) => setShowReferenceBox(e.target.checked)}
              checked={showReferenceBox}
            />
            <label
              className="custom-control-label text-dark"
              htmlFor="exampleCheck"
            >
              {!showReferenceBox ? "Add Skew Marks" : "Remove Skew Marks"}
            </label>
          </div>

          {showReferenceBox && referenceBoxes.length <= 4 && (
            <button
              type="button"
              className="btn me-2 btn-primary"
              onClick={() => {
                if (referenceBoxes.length >= 4) {
                  toast.error("You can only add 4 reference boxes.");
                  return;
                }
                setModalOpen(true);
              }}
            >
              Add
            </button>
          )}

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

          <div style={{ marginLeft: 12 }}>
            <button className="btn btn-sm btn-light me-1" onClick={zoomOut}>
              −
            </button>
            <span style={{ margin: "0 8px" }}>
              Zoom: {Math.round(zoomScale * 100)}%
            </span>
            <button className="btn btn-sm btn-light ms-1" onClick={zoomIn}>
              +
            </button>
          </div>
        </div>
      </div>

      {/* Add Box Modal */}
      {isOpen && (
        <Rnd
          default={{ x: 100, y: 100, width: 400, height: "auto" }}
          bounds="window"
          enableResizing={false}
          dragHandleClassName="drag-handle"
          className="z-[99] fixed bg-white shadow-lg rounded-lg border"
        >
          <div className="flex flex-col w-full" style={{ cursor: "move" }}>
            <div className="drag-handle cursor-move bg-gray-100 px-4 py-2 rounded-t-lg flex justify-between items-center">
              <h2 className="font-semibold">Create Template</h2>
            </div>

            <div className="p-4">
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
            </div>

            <div className="flex justify-end gap-2 p-3 border-t">
              <Button
                type="button"
                variant="warning"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  if (buttonRef.current) buttonRef.current.click();
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </Rnd>
      )}

      <ReferenceFieldModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        options={options}
        onSave={(selectedValue) => {
          setOptions((prev) =>
            prev.filter((option) => option.id !== selectedValue)
          );
          setReferenceBoxes((prev) => [
            ...prev,
            { position: selectedValue, width: 100, height: 100, x: 20, y: 30 },
          ]);
          setModalOpen(false);
        }}
      />
    </div>
  );
};

export default TemplateEditor;
