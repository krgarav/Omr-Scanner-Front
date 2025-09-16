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
  // Core states (kept from your original)
  const [boxes, setBoxes] = useState([]);
  const [activeBox, setActiveBox] = useState(null);
  const [currentBoxData, setCurrentBoxData] = useState(null);
  const imageRef = useRef(null);
  const [trigger, setTrigger] = useState(false);
  const [zoomScale, setZoomScale] = useState(1); // user-controlled zoom multiplier
  const [isOpen, setIsOpen] = useState(false);
  const [paths, setPaths] = useState(null);
  const [baseUrl, setBaseUrl] = useState(null);
  const [showReferenceBox, setShowReferenceBox] = useState(false);
  const [referenceBoxes, setReferenceBoxes] = useState([]);
  const [currentReferenceBox, setCurrentReferenceBox] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [options, setOptions] = useState(referenceOptions);
  const buttonRef = useRef(null);

  const { Id } = useParams();
  const navigate = useNavigate();

  // NEW: image natural size and base display size
  // natural = image's real pixel size (image.naturalWidth)
  // baseDisplay = the displayed size when zoomScale === 1
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [baseDisplaySize, setBaseDisplaySize] = useState({
    width: 0,
    height: 0,
  });

  // Fetch baseUrl and template paths (unchanged)
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

  // When we have paths + baseUrl, fetch JSON fields
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
            // fieldDetails should already be in natural px
            setReferenceBoxes(fieldDetails);
            setShowReferenceBox(true);
          } else {
            setShowReferenceBox(false);
          }
          // assume `field` array is in natural px coords
          setBoxes(field || []);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (paths && baseUrl) fetchJsonData();
  }, [paths, baseUrl]);

  // Delete key handling (keeps original logic)
  useEffect(() => {
    const handledeleteKey = (e) => {
      if (e.key === "Delete" && activeBox !== null) {
        const res = window.confirm("Are you sure you want to delete this box?");
        if (res) {
          setBoxes((prev) => prev.filter((_, i) => i !== activeBox));
          setActiveBox(null);
        }
      }
      if (e.key === "Delete" && currentReferenceBox !== null) {
        const res = window.confirm(
          "Are you sure you want to delete this reference box?"
        );
        if (res) {
          const refField = referenceBoxes[currentReferenceBox];
          const selectedOption = refField?.position;
          const removedOption = referenceOptions.find(
            (option) => option.id === selectedOption
          );
          setOptions((prev) => [...prev, removedOption]);
          setReferenceBoxes((prev) =>
            prev.filter((_, i) => i !== currentReferenceBox)
          );
          setCurrentReferenceBox(null);
        }
      }
    };
    window.addEventListener("keydown", handledeleteKey);
    return () => window.removeEventListener("keydown", handledeleteKey);
  }, [activeBox, currentReferenceBox, referenceBoxes]);

  // Update baseDisplaySize when image loads or window resizes.
  // baseDisplaySize represents the image display width/height at zoomScale === 1
  useEffect(() => {
    const updateBase = () => {
      const img = imageRef.current;
      if (!img || !img.naturalWidth) return;
      // current clientWidth is the displayed width at current zoom.
      // baseDisplay = clientWidth / zoomScale
      const clientW = img.clientWidth;
      const clientH = img.clientHeight;
      const baseW = clientW / (zoomScale || 1);
      const baseH = clientH / (zoomScale || 1);
      setBaseDisplaySize({ width: baseW, height: baseH });
    };

    // initial set if already loaded
    updateBase();
    window.addEventListener("resize", updateBase);
    return () => window.removeEventListener("resize", updateBase);
  }, [zoomScale, paths, baseUrl]); // re-run when zoomScale or image source changes

  // onLoad handler to capture natural size + base display size
  const handleImageLoad = (e) => {
    const img = e.target;
    const naturalW = img.naturalWidth || 0;
    const naturalH = img.naturalHeight || 0;
    // what the image currently displays as (may already be scaled by zoomScale)
    const clientW = img.clientWidth;
    const clientH = img.clientHeight;

    // base display (the display size assuming zoomScale === 1)
    const baseW = clientW / (zoomScale || 1);
    const baseH = clientH / (zoomScale || 1);

    setNaturalSize({ width: naturalW, height: naturalH });
    setBaseDisplaySize({ width: baseW, height: baseH });
  };

  // Effective scale from natural -> displayed px:
  // effectiveScale = (baseDisplayWidth / naturalWidth) * zoomScale
  // (baseDisplayWidth/naturalWidth) is the display / natural ratio at zoomScale 1
  const effectiveScale = useMemo(() => {
    if (!naturalSize.width || !baseDisplaySize.width) return zoomScale;
    return (baseDisplaySize.width / naturalSize.width) * zoomScale;
  }, [naturalSize, baseDisplaySize, zoomScale]);

  // Helper: updateBox in natural px (unchanged)
  const updateBox = (index, newProps) => {
    setBoxes((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...newProps };
      return copy;
    });
  };

  const addBox = () => {
    // Add in natural px (choose sizes that make sense for your natural image)
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

  // --- Helpers that now assume `boxes` & `referenceBoxes` are in NATURAL px ---

  // getCornerCoordinates: returns four corner boxes in NATURAL px
  const getCornerCoordinates = (box) => {
    const { x, y, width, height } = box;
    return {
      topLeft: { x: x, y: y, width: 60, height: 60 },
      topRight: { x: x + width, y: y, width: 60, height: 60 },
      bottomLeft: { x: x, y: y + height, width: 60, height: 60 },
      bottomRight: { x: x + width, y: y + height, width: 60, height: 60 },
    };
  };

  // getRefCoordinates: simply sanitize/round referenceBoxes (NATURAL px)
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

  // getBubbleCoordinates: returns bubble positions in NATURAL px
  const getBubbleCoordinates = (box) => {
    if (!box) return [];
    const rows = box.totalRow;
    const cols = box.totalCol;
    if (!rows || !cols || rows <= 0 || cols <= 0) return [];

    const scaledInnerX = box.x; // NATURAL px
    const scaledInnerY = box.y; // NATURAL px
    const cellWidth = box.width / cols; // NATURAL px per grid cell
    const cellHeight = box.height / rows; // NATURAL px per grid cell

    // Bubble diameter should fit inside the smaller of cellWidth/cellHeight
    const diameter = Math.min(cellWidth, cellHeight) * 0.8; // 80% of the cell for padding
    const radius = diameter / 2;

    const bubbles = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // center of each cell
        const centerX = scaledInnerX + col * cellWidth + cellWidth / 2;
        const centerY = scaledInnerY + row * cellHeight + cellHeight / 2;

        // bounding box of the bubble (circle fits inside)
        bubbles.push({
          x: Math.round(centerX - radius),
          y: Math.round(centerY - radius),
          width: Math.round(diameter),
          height: Math.round(diameter),
          row,
          col,
        });
      }
    }
    return bubbles;
  };

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

  // Save template (boxes & referenceBoxes are already NATURAL px)
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
      return { ...box, bubbles: allBubbles[idx] || [] };
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

  // Render logic
  // Compute container dimensions for display: baseDisplay * zoomScale
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
          {/* Reference Boxes (rendered in DISPLAY px) */}
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
                  const stepNatural = 5; // natural px step
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
                    return updated;
                  });
                }}
                onDragStop={(e, d) => {
                  setReferenceBoxes((prev) => {
                    const updated = [...prev];
                    updated[index] = {
                      ...updated[index],
                      x: Math.round(d.x / effectiveScale),
                      y: Math.round(d.y / effectiveScale),
                    };
                    return updated;
                  });
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  setReferenceBoxes((prev) => {
                    const updated = [...prev];
                    updated[index] = {
                      ...updated[index],
                      width: Math.round(
                        parseInt(ref.style.width, 10) / effectiveScale
                      ),
                      height: Math.round(
                        parseInt(ref.style.height, 10) / effectiveScale
                      ),
                      x: Math.round(position.x / effectiveScale),
                      y: Math.round(position.y / effectiveScale),
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

          {/* Image (rendered at baseDisplay * zoomScale) */}
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

          {/* Field boxes (rendered in DISPLAY px using effectiveScale) */}
          {boxes.map((box, index) => {
            const displayX = Math.round(box.x * effectiveScale);
            const displayY = Math.round(box.y * effectiveScale);
            const displayW = Math.round(box.width * effectiveScale);
            const displayH = Math.round(box.height * effectiveScale);

            return (
              <Rnd
                key={index}
                size={{ width: displayW, height: displayH }}
                position={{ x: displayX, y: displayY }}
                onDragStop={(e, d) => {
                  updateBox(index, {
                    x: Math.round(d.x / effectiveScale),
                    y: Math.round(d.y / effectiveScale),
                  });
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  updateBox(index, {
                    width: Math.round(
                      parseInt(ref.style.width, 10) / effectiveScale
                    ),
                    height: Math.round(
                      parseInt(ref.style.height, 10) / effectiveScale
                    ),
                    x: Math.round(position.x / effectiveScale),
                    y: Math.round(position.y / effectiveScale),
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
                            width: `calc((100% - ${
                              (box.totalCol - 1) * box.gap
                            }px) / ${box.totalCol})`,
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
                    title="Remove box"
                  >
                    ×
                  </button>
                </div>
              </Rnd>
            );
          })}
        </div>

        {/* Right-side floating form editor for activeBox */}
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
                  />
                </div>
              </div>
            </Rnd>
          )}
        </div>
      </section>

      {/* Controls */}
      <div className="d-flex w-100 position-fixed bottom-0 bg-white z-9999">
        <div className="d-flex justify-content-around p-2 bg-white  w-75 bottom-0">
          <div className="custom-control custom-switch ">
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

          {showReferenceBox && (
            <button
              type="button"
              className="btn me-2 btn-primary"
              onClick={() => {
                if (referenceBoxes.length > 4) {
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

      {/* Add Box modal (draggable) */}
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
          // Added in NATURAL px coordinates (choose sensible defaults)
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
