import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal, Button, Col, Badge, Spinner } from "react-bootstrap";
import { Row } from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "./DesignTemplate.module.css";
import { Rnd } from "react-rnd";
import DataContext from "store/DataContext";
import { MultiSelect } from "react-multi-select-component";
import { createTemplate } from "helper/TemplateHelper";
import { getLayoutDataById } from "helper/TemplateHelper";
import Papa from "papaparse";
import SmallHeader from "components/Headers/SmallHeader";
import { toast } from "react-toastify";
import isEqual from "lodash/isEqual";
import { sendFile } from "helper/TemplateHelper";
import ImageCropper from "modals/ImageCropper";
import base64ToFile from "services/Base64toFile";
import RegionSelector from "ui/RangeSelector";
import ImageRegionSelector from "ui/RangeSelector";
import Cropper from "ui/RangeSelector";
import EditTemplateModal from "ui/EditTemplateModal";
import LayoutDetailModal from "ui/LayoutDetailModal";
import TextLoader from "loaders/TextLoader";
import processDirection from "data/processDirection";
import deepcopy from "deepcopy";
import resetJson from "data/resetJson";
import { useWindowSize } from "react-use";
// Function to get values from sessionStorage or provide default
const getLocalStorageOrDefault = (key, defaultValue) => {
  const stored = localStorage.getItem(key);

  if (!stored) {
    return defaultValue;
  }
  try {
    const parsed = JSON.parse(stored);
    // Check for 'undefined' string which is not a valid JSON
    if (parsed === undefined) {
      return defaultValue;
    }
    return parsed;
  } catch (e) {
    console.warn(`Error parsing localStorage item with key "${key}":`, e);
    return defaultValue;
  }
};
const DesignTemplate = () => {
  const [selected, setSelected] = useState({});
  const [selection, setSelection] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [selectedClass, setSelectedClass] = useState("circle");
  const imageRef = useRef(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState([]);

  const [name, setName] = useState();

  const [spanDisplay, setSpanDisplay] = useState("none");
  const [skewoption, setSkewOption] = useState("none");
  const [windowNgOption, setWindowNgOption] = useState("");
  const [readingDirectionOption, setReadingDirectionOption] = useState("");
  const [minimumMark, setMinimumMark] = useState();
  const [maximumMark, setMaximumMark] = useState();
  const [noInRow, setNoInRow] = useState();
  const [noOfStepInRow, setNoOfStepInRow] = useState();
  const [noInCol, setNoInCol] = useState();
  const [noOfStepInCol, setNoOfStepInCol] = useState();
  const [option, setOption] = useState("");
  const [type, setType] = useState("");
  const [selectedFieldType, setSelectedFieldType] = useState("formField");
  const [fieldType, setFieldType] = useState();
  const [numberOfField, setNumberOfField] = useState();
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    width: 400,
    height: 400,
  });
  const [loading, setLoading] = useState(false);
  const [detailPage, setDetailPage] = useState(false);
  const dataCtx = useContext(DataContext);
  const [localData, setLocalData] = useState(
    JSON.parse(localStorage.getItem("Template"))
  );
  const [selectedCol, setSelectedCol] = useState([]);
  const [options, setOptions] = useState([]);
  const [idNumber, setIdNumber] = useState("0000000000000000000000000000");
  const [layoutFieldData, setLayoutFieldData] = useState();
  const [multipleValue, setMultipleValue] = useState("");
  const [blankValue, setBlankValue] = useState("");
  const [multiple, setMultiple] = useState("");
  const [blank, setBlank] = useState("");
  const [startRowInput, setStartRowInput] = useState("");
  const [startColInput, setStartColInput] = useState("");
  const [endRowInput, setEndRowInput] = useState("");
  const [endColInput, setEndColInput] = useState("");
  const [idType, setIdType] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [modalUpdate, setModalUpdate] = useState(false);
  const [coordinateIndex, setCoordinateIndex] = useState(-1);
  const [selectionIndex, setSelectionIndex] = useState();
  const [idSelectionCount, setIdSelectionCount] = useState(0);
  const [imageModalShow, setImageModalShow] = useState(false);
  const [imagesSelectedCount, setImagesSelectedCount] = useState(0);
  const [sizes, setSizes] = useState({});
  const location = useLocation();
  const {
    totalColumns,
    timingMarks,
    templateImagePath,
    bubbleType,
    key: templateIndex,
    iSensitivity,
    iDifference,
    iReject,
    iFace,
    arr,
    excelJsonFile,
    templateBackImagePath,
    numberedExcelJsonFile,
  } = localData[0].layoutParameters;

  const rndRef = useRef();
  const navigate = useNavigate();
  const numRows = timingMarks;
  const numCols = totalColumns;
  const divRefs = useRef([]);
  const { width } = useWindowSize();
  const isWideScreen = width >= 994;
  const handleDragStop = (e, d) => {
    setPosition((prev) => ({ ...prev, x: d.x, y: d.y }));
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    setPosition({
      x: position.x,
      y: position.y,
      width: ref.style.width.replace("px", ""),
      height: ref.style.height.replace("px", ""),
    });
  };
  const toggleSelection = (row, col) => {
    const key = `${row},${col}`;
    setSelected((prev) => {
      const newState = { ...prev, [key]: !prev[key] };

      return newState;
    });
  };
  useEffect(() => {
    setTimeout(() => {
      setLocalData(JSON.parse(localStorage.getItem("Template")));
    }, 1000);
  }, [detailPage]);

  useEffect(() => {
    const idFieldCount = selectedCoordinates.filter(
      (item) => item.fieldType === "idField"
    ).length;
    if (idFieldCount > 0) {
      setIdSelectionCount(1);
    } else {
      setIdSelectionCount(0);
    }
  }, [selectedCoordinates, selection]);

  useEffect(() => {
    const templateData = JSON.parse(localStorage.getItem("Template"));
    // Find the current template instead of filtering
    // const currentTemplate = dataCtx.allTemplates.find((item) => {
    //   console.log(item);
    //   return item[0].layoutParameters?.key ?? "" === templateIndex;
    // })?[0];
    // if (!currentTemplate) {
    dataCtx.setAllTemplates(templateData);
    // }
  }, []);
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const confirmationMessage =
        "Are you sure you want to leave this page? All unsaved data will be lost.";
      event.returnValue = confirmationMessage; // Standard for most browsers
      return confirmationMessage; // Required for some browsers
    };

    const handleNavigation = (event) => {
      if (
        event.type === "POP" &&
        !window.confirm(
          "Are you sure you want to leave this page? All unsaved data will be lost."
        )
      ) {
        navigate(location.pathname); // Navigate back to the current page
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handleNavigation);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleNavigation);
    };
  }, [navigate, location.pathname]);
  useEffect(() => {
    setStartRowInput(selection?.startRow + 1);
    setEndRowInput(selection?.endRow + 1);
    setStartColInput(selection?.startCol);
    setEndColInput(selection?.endCol);
  }, [selection]);
  useEffect(() => {
    const gridDiv = document.getElementById("grid-div");
    const imgDiv = document.getElementById("imagecontainer");

    if (gridDiv && imgDiv) {
      const gridHeight = gridDiv.clientHeight;
      const gridWidth = gridDiv.clientWidth;
      imgDiv.style.height = `${gridHeight + 250}px`;
      imgDiv.style.width = `${gridWidth + 130}px`; // Adding 50 pixels to the width
      setPosition({
        x: 0,
        y: 0,
        width: `${gridWidth}px`,
        height: `${gridHeight}px`,
      });
    }
  }, []);
  useEffect(() => {
    const checkSizes = () => {
      const newSizes = {};
      divRefs.current.forEach((ref, index) => {
        if (ref) {
          const { offsetWidth } = ref;
          newSizes[index] = offsetWidth <= 42; // Define your threshold for "small"
        }
      });
      setSizes(newSizes);
    };

    checkSizes(); // Initial check
    window.addEventListener("resize", checkSizes);

    return () => window.removeEventListener("resize", checkSizes);
  }, [selectedCoordinates, selection]);

  useEffect(() => {
    const template = dataCtx.allTemplates.find((item) => {
      return item[0].layoutParameters?.key ?? "" === templateIndex;
    });
    selectedCoordinates.forEach((item) => {
      const isQuestionField = item?.fieldType === "questionField";
      const isFormField = item?.fieldType === "formField";

      if (isQuestionField || isFormField) {
        const template = dataCtx.allTemplates.find((item) => {
          return item[0].layoutParameters?.key ?? "" === templateIndex;
        });
        console.log(template);
        const parameters = isQuestionField
          ? template[0].questionsWindowParameters
          : template[0].formFieldWindowParameters;

        // Format the selected file for comparison
        const formattedSelectedFile = {
          "End Col": item.endCol,
          "End Row": item.endRow + 1,
          "Start Col": item.startCol,
          "Start Row": item.startRow + 1,
          fieldType: item.fieldType,
          name: item.name,
        };
        if (parameters) {
          // Find the index of the matched object
          const index = parameters.findIndex((param) =>
            isEqual(param.Coordinate, formattedSelectedFile)
          );

          // Get the matched object
          const data2 = index !== -1 ? parameters[index] : null;

          if (data2) {
            // Determine the reading direction
            const directionMapping = {
              0: "topToBottom",
              1: "topToBottom",
              2: "bottomToTop",
              3: "bottomToTop",
              4: "leftToRight",
              5: "rightToLeft",
              6: "leftToRight",
              7: "rightToLeft",
            };
            const readingDirection =
              directionMapping[data2.iDirection] || "rightToLeft";
            const type = data2.numericOrAlphabets;
            // Process the data with the determined direction
            const stepInRow = data2.rowStep;
            const stepInCol = data2.columnStep;

            const data = processDirection(
              readingDirection,
              item.startRow,
              item.endRow,
              item.startCol,
              item.endCol,
              template[0].layoutParameters.numberedExcelJsonFile,
              type,
              stepInRow,
              stepInCol
            );
            const copiedObject = deepcopy(localData[0]);
            copiedObject.layoutParameters = {
              ...copiedObject.layoutParameters,
              numberedExcelJsonFile: data,
            };
            // dataCtx.replaceTemplate([copiedObject])
            localStorage.setItem("Template", JSON.stringify([copiedObject]));
          }
        }
      }
    });
  }, [selectedCoordinates, dataCtx]);

  useEffect(() => {
    if (arr) {
      // Extract parameters from the first element of the array (if it exists)
      const formFieldData = arr[0]?.formFieldWindowParameters;
      const questionField = arr[0]?.questionsWindowParameters;
      const skewField = arr[0]?.skewMarksWindowParameters;
      const idField = arr[0]?.layoutParameters;

      // Map each set of parameters to their coordinates or default to an empty array
      const coordinateOfFormData =
        formFieldData?.map((item) => item.Coordinate) ?? [];
      const coordinateOfQuestionField =
        questionField?.map((item) => item.Coordinate) ?? [];
      const coordinateOfSkewField =
        skewField?.map((item) => item.Coordinate) ?? [];
      const coordinateOfIdField = idField?.Coordinate ?? [];

      // Combine all coordinates into a single array
      const allCoordinates = [
        ...coordinateOfFormData,
        ...coordinateOfQuestionField,
        ...coordinateOfSkewField,
        coordinateOfIdField,
      ];

      // Map each coordinate to a new format
      const newSelectedFields = allCoordinates?.map((item) => {
        const {
          "Start Row": startRow,
          "Start Col": startCol,
          "End Row": endRow,
          "End Col": endCol,
          name,
        } = item;
        return { startRow, startCol, endRow, endCol, name };
      });

      // Update the state with the new coordinates and image structure data
      setSelectedCoordinates(newSelectedFields);
      setPosition(idField?.imageStructureData);
    }
  }, []); // Run only once on component mount

  // *************************For Fetching the details and setting the coordinate******************
  // useEffect(() => {
  //   const fetchDetails = async () => {
  //     try {
  //       // Fetch layout data by template ID
  //       const response = await getLayoutDataById(templateId);
  //       console.log(response);
  //       setLayoutFieldData(response);
  //       if (response) {
  //         // Extract data from the response
  //         const formFieldData = response?.formFieldWindowParameters ?? [];
  //         const questionField = response?.questionsWindowParameters ?? [];
  //         const skewField = response?.skewMarksWindowParameters ?? [];
  //         const idField = response?.layoutParameters ?? {};

  //         // Map and restructure data for coordinates
  //         const coordinateOfFormData = formFieldData.map((item) => ({
  //           ...item.formFieldCoordinates,
  //           name: item.windowName,
  //         }));

  //         const coordinateOfQuestionField = questionField.map((item) => ({
  //           ...item.questionWindowCoordinates,
  //           name: item.windowName,
  //         }));

  //         const coordinateOfSkewField = skewField.map((item) => ({
  //           ...item.layoutWindowCoordinates,
  //           name: item.windowName,
  //         }));

  //         const coordinateOfIdField = idField.layoutCoordinates ?? [];

  //         // Combine all coordinates into a single array
  //         const allCoordinates = [
  //           ...coordinateOfFormData,
  //           ...coordinateOfQuestionField,
  //           ...coordinateOfSkewField,
  //           coordinateOfIdField,
  //         ];

  //         // Format the coordinates for the state update
  //         const newSelectedFields = allCoordinates.map((item) => {
  //           const {
  //             start: startRow,
  //             left: startCol,
  //             end: endRow,
  //             right: endCol,
  //             name,
  //           } = item;
  //           return { startRow, startCol, endRow, endCol, name };
  //         });

  //         // Update state with the formatted coordinates and image data
  //         setSelectedCoordinates(newSelectedFields);
  //         setPosition(idField?.imageCoordinates);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching layout data:", error);
  //     }
  //   };

  //   // Call the fetch details function
  //   fetchDetails();
  // }, [templateId]);
  // *****************************************************************************************
  // useEffect(() => {
  //   if (layoutFieldData) {
  //     dataCtx.addFieldToTemplate(layoutFieldData, templateIndex);
  //     console.log("called");
  //   }
  // }, [layoutFieldData]);
  useEffect(() => {
    const template = dataCtx.allTemplates.find((item) => {
      return item[0].layoutParameters?.key ?? "" === templateIndex;
    });
    console.log(template);
    if (template) {
      setLayoutFieldData(template[0]);
    }
  }, [dataCtx.allTemplates]);

  useEffect(() => {
    const classMap = {
      "rounded rectangle": "rounded-rectangle",
      rectangle: "rectangle",
      circle: "circle",
      oval: "oval",
    };

    // Set the class, defaulting to "circle" if bubbleType is not found
    setSelectedClass(classMap[bubbleType] || "circle");
  }, [bubbleType]);

  useEffect(() => {
    // Create an array to hold the options
    const options = Array.from({ length: +totalColumns }, (v, i) => ({
      label: `${idType} ${i + 1}`, // Set the label as 'Col X' where X is the column number
      value: i, // Set the value as the index
    }));

    // Update the state with the new options array
    setOptions(options);
  }, [totalColumns, idType]);

  useEffect(() => {
    if (selectedCol.length > 0) {
      const value = selectedCol.map((item) => item.value);
      const arr = Array(+totalColumns).fill(0);
      for (let j = 0; j < value.length; j++) {
        arr[value[j]] = 1;
      }
      setIdNumber(arr.join("").toString());
    }
  }, [options, selectedCol]);

  // useEffect(() => {
  //   const handleKeyPress = (event) => {
  //     if (modalShow) return; // Ignore keyboard events when modal is shown
  //     if (event.altKey && event.shiftKey) {
  //       // Toggle z-index when Alt + Enter is pressed
  //       const imgDiv = document.getElementById("imagecontainer");
  //       imgDiv.style.zIndex = imgDiv.style.zIndex === "999" ? "-1" : "999";
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyPress);

  //   // Cleanup event listener on component unmount
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyPress);
  //   };
  // }, [modalShow]);

  const handleMouseDown = (e) => {
    const boundingRect = imageRef.current.getBoundingClientRect();
    const col = Math.floor(
      (e.clientX - boundingRect.left) / (boundingRect.width / numCols)
    );
    const row = Math.floor(
      (e.clientY - boundingRect.top) / (boundingRect.height / numRows)
    );

    // Check if the clicked cell is a timing mark or already selected (a circle)
    if (col === 0 || selected[`${row},${col}`]) return;

    setDragStart({ row, col });
  };
  // const handleMouseMove = (e) => {
  //     if (!e.buttons || !dragStart) return;
  //     const boundingRect = imageRef.current.getBoundingClientRect();
  //     const col = Math.floor((e.clientX - boundingRect.left) / (boundingRect.width / numCols));
  //     const row = Math.floor((e.clientY - boundingRect.top) / (boundingRect.height / numRows));
  //     setSelection({
  //         startRow: Math.min(dragStart.row, row),
  //         startCol: Math.min(dragStart.col, col),
  //         endRow: Math.max(dragStart.row, row),
  //         endCol: Math.max(dragStart.col, col),
  //     });

  //     console.log(selection);
  // };

  const handleMouseMove = (e) => {
    if (!e.buttons || !dragStart) return;
    const boundingRect = imageRef.current.getBoundingClientRect();
    const col = Math.floor(
      (e.clientX - boundingRect.left) / (boundingRect.width / numCols)
    );
    const row = Math.floor(
      (e.clientY - boundingRect.top) / (boundingRect.height / numRows)
    );
    setSelection((prevSelection) => {
      const startRow = Math.min(dragStart.row, row);
      const startCol = Math.min(dragStart.col, col);
      const endRow = Math.max(dragStart.row, row);
      const endCol = Math.max(dragStart.col, col);

      const newSelection = {
        startRow: Math.max(0, startRow), // Ensure startRow is not negative
        startCol: Math.max(1, startCol), // Ensure startCol is not negative
        endRow: Math.min(numRows - 1, endRow), // Ensure endRow is within grid bounds
        endCol: Math.min(numCols, endCol), // Ensure endCol is within grid bounds
      };

      return newSelection;
    });
  };

  const handleMouseUp = () => {
    if (dragStart) {
      setDragStart(null);
      setModalShow(true);
    }
  };
  const handleCancel = () => {
    setDragStart(null);
    setSelection(null);
    setModalShow(false);
    setModalUpdate(false);
  };

  const validateFormField = () => {
    const errors = {
      name: "Name Field can not be empty",
      multiple: "Please select multiple",
      blank: "Please select blank",
      windowNgOption: "Please select window Ng",
      minimumMark: "Minimum mark cannot be empty",
      maximumMark: "Maximum mark cannot be empty",
      noInRow: "Total number in row cannot be empty",
      noOfStepInRow: "Total number of step in a row cannot be empty",
      noInCol: "Total number in col cannot be empty",
      noOfStepInCol: "Total number of step in a col cannot be empty",
      readingDirectionOption: "Please select reading direction",
      type: "Please select type",
      // option: "Please select option",
      numberOfField: "Total field cannot be empty",
      fieldType: "Please select field type",
    };

    for (let [field, errorMsg] of Object.entries(errors)) {
      if (!eval(field)) {
        toast.error(errorMsg);
        return false;
      }
    }
    return true;
  };

  const validateSkewField = () => {
    const errors = {
      name: "Name Field can not be empty",
      windowNgOption: "Please select window Ng",
      minimumMark: "Minimum mark cannot be empty",
      maximumMark: "Maximum mark cannot be empty",
      skewoption: "Please select the skew mark position",
      noInRow: "Total number in row cannot be empty",
      noOfStepInRow: "Total number of step in a row cannot be empty",
      noInCol: "Total number in col cannot be empty",
      noOfStepInCol: "Total number of step in a col cannot be empty",
      readingDirectionOption: "Please select reading direction",
      type: "Please select type",
      // option: "Please select option",
    };

    for (let [field, errorMsg] of Object.entries(errors)) {
      if (!eval(field)) {
        toast.error(errorMsg);
        return false;
      }
    }
    return true;
  };
  const validateIdField = () => {
    const errors = {
      noInRow: "Total number in row cannot be empty",
      noOfStepInRow: "Total number of step in a row cannot be empty",
      noInCol: "Total number in col cannot be empty",
      noOfStepInCol: "Total number of step in a col cannot be empty",
      readingDirectionOption: "Please select reading direction",
    };

    for (let [field, errorMsg] of Object.entries(errors)) {
      if (!eval(field)) {
        toast.error(errorMsg);
        return false;
      }
    }
    return true;
  };
  const handleSave = () => {
    if (
      selectedFieldType === "formField" ||
      selectedFieldType === "questionField"
    ) {
      if (multiple !== "allow") {
        if (!multipleValue) {
          toast.error("Multiple value cannot be empty");
          return;
        }
      }
      if (blank !== "allow") {
        if (!blankValue) {
          toast.error("Blank value cannot be empty");
          return;
        }
      }
      if (!validateFormField()) {
        return;
      }
    } else if (selectedFieldType === "skewMarkField") {
      if (!validateSkewField()) {
        return;
      }
    } else if (selectedFieldType === "idField") {
      if (!validateIdField()) {
        return;
      }
    }
    let newData = {};
    // if (!modalUpdate) {
    if (selectedFieldType === "idField") {
      newData = {
        Coordinate: {
          "Start Row": selection?.startRow + 1,
          "Start Col": selection?.startCol,
          "End Row": selection?.endRow + 1,
          "End Col": selection?.endCol,
          name: "Id Field",
          fieldType: selectedFieldType,
        },
        imageStructureData: position,
        columnStart: +selection?.startCol,
        columnNumber: +noInCol,
        columnStep: +noOfStepInCol,
        rowStart: +selection?.startRow + 1,
        rowNumber: +noInRow,
        rowStep: +noOfStepInRow,
        iDirection: +readingDirectionOption,
        idMarksPattern: idNumber.toString(),
      };
    } else if (selectedFieldType === "skewMarkField") {
      newData = {
        iFace: +iFace,
        columnStart: +selection?.startCol,
        columnNumber: +noInCol,
        columnStep: +noOfStepInCol,
        rowStart: +selection?.startRow + 1,
        rowNumber: +noInRow,
        rowStep: +noOfStepInRow,
        iSensitivity: +iSensitivity,
        iDifference: +iDifference,
        // iOption: +option,
        iReject: +iReject,
        iDirection: +readingDirectionOption,
        windowName: name,
        Coordinate: {
          "Start Row": selection?.startRow + 1,
          "Start Col": selection?.startCol,
          "End Row": selection?.endRow + 1,
          "End Col": selection?.endCol,
          name: name,
          fieldType: selectedFieldType,
        },
        ngAction: windowNgOption,
        iMinimumMarks: +minimumMark,
        iMaximumMarks: +maximumMark,
        skewMark: +skewoption,
        iType: type,
        // imageStructureData: position,
      };
    } else {
      newData = {
        iFace: +iFace,
        windowName: name,
        columnStart: +selection?.startCol,
        columnNumber: +noInCol,
        columnStep: +noOfStepInCol,
        rowStart: +selection?.startRow + 1,
        rowNumber: +noInRow,
        rowStep: +noOfStepInRow,
        iDirection: +readingDirectionOption,
        iSensitivity: +iSensitivity,
        iDifference: +iDifference,
        // iOption: +option,
        iMinimumMarks: +minimumMark,
        iMaximumMarks: +maximumMark,
        iType: type,
        ngAction: windowNgOption,
        Coordinate: {
          "Start Row": selection?.startRow + 1,
          "Start Col": selection?.startCol,
          "End Row": selection?.endRow + 1,
          "End Col": selection?.endCol,
          name: name,
          fieldType: selectedFieldType,
        },
        totalNumberOfFields: numberOfField,
        numericOrAlphabets: fieldType,
        multipleAllow: multiple,
        multipleValue: multipleValue ? multipleValue : "",
        blankAllow: blank,
        blankValue: blankValue ? blankValue : "",
        customFieldValue: customValue ? customValue : "",
      };
    }
    // }

    // else {
    //   if (selectedFieldType === "idField") {
    //     newData = {
    //       Coordinate: {
    //         "Start Row": selection?.startRow,
    //         "Start Col": selection?.startCol,
    //         "End Row": selection?.endRow,
    //         "End Col": selection?.endCol,
    //         name: "Id Field",
    //         fieldType: selectedFieldType,
    //       },
    //       imageStructureData: position,
    //       columnStart: +selection?.startCol,
    //       columnNumber: +noInCol,
    //       columnStep: +noOfStepInCol,
    //       rowStart: +selection?.startRow,
    //       rowNumber: +noInRow,
    //       rowStep: +noOfStepInRow,
    //       iDirection: +readingDirectionOption,
    //       idMarksPattern: idNumber.toString(),
    //     };
    //   } else if (selectedFieldType === "skewMarkField") {
    //     newData = {
    //       iFace: +iFace,
    //       columnStart: +selection?.startCol,
    //       columnNumber: +noInCol,
    //       columnStep: +noOfStepInCol,
    //       rowStart: +selection?.startRow,
    //       rowNumber: +noInRow,
    //       rowStep: +noOfStepInRow,
    //       iSensitivity: +iSensitivity,
    //       iDifference: +iDifference,
    //       iOption: +option,
    //       iReject: +iReject,
    //       iDirection: +readingDirectionOption,
    //       windowName: name,
    //       Coordinate: {
    //         "Start Row": selection?.startRow,
    //         "Start Col": selection?.startCol,
    //         "End Row": selection?.endRow,
    //         "End Col": selection?.endCol,
    //         name: name,
    //         fieldType: selectedFieldType,
    //       },
    //       ngAction: windowNgOption,
    //       iMinimumMarks: +minimumMark,
    //       iMaximumMarks: +maximumMark,
    //       skewMark: +skewoption,
    //       iType: type,
    //       // imageStructureData: position,
    //     };
    //   } else {
    //     newData = {
    //       iFace: +iFace,
    //       windowName: name,
    //       columnStart: +selection?.startCol,
    //       columnNumber: +noInCol,
    //       columnStep: +noOfStepInCol,
    //       rowStart: +selection?.startRow,
    //       rowNumber: +noInRow,
    //       rowStep: +noOfStepInRow,
    //       iDirection: +readingDirectionOption,
    //       iSensitivity: +iSensitivity,
    //       iDifference: +iDifference,
    //       iOption: +option,
    //       iMinimumMarks: +minimumMark,
    //       iMaximumMarks: +maximumMark,
    //       iType: type,
    //       ngAction: windowNgOption,
    //       Coordinate: {
    //         "Start Row": selection?.startRow,
    //         "Start Col": selection?.startCol,
    //         "End Row": selection?.endRow,
    //         "End Col": selection?.endCol,
    //         name: name,
    //         fieldType: selectedFieldType,
    //       },
    //       totalNumberOfFields: numberOfField,
    //       numericOrAlphabets: fieldType,
    //       multipleAllow: multiple,
    //       multipleValue: multipleValue ? multipleValue : "",
    //       blankAllow: blank,
    //       blankValue: blankValue ? blankValue : "",
    //       customFieldValue: customValue ? customValue : "",
    //       // imageStructureData: position,
    //     };
    //   }
    // }
    // setSelectedCoordinates((prev) => [...prev, newSelected]);//chamnge here
    // setSelection(null);
    setModalShow(false);
    if (!modalUpdate) {
      dataCtx.modifyTemplateWithUUID(templateIndex, newData, selectedFieldType);
      const newSelected = {
        ...selection,
        name: selectedFieldType !== "idField" ? name : "Id Field",
        fieldType: selectedFieldType,
      };
      setSelectedCoordinates((prev) => [...prev, newSelected]);
      setSelection(null);
    } else {
      setSelectedCoordinates((item) => {
        // Ensure item is defined and coordinateIndex is valid
        if (!item || coordinateIndex < 0 || coordinateIndex >= item.length) {
          console.error("Invalid coordinate index or item array");
          return item; // Return the unchanged state if validation fails
        }
        const arr = dataCtx.allTemplates.find((item) => {
          console.log(item);
          return item[0].layoutParameters?.key ?? "" === templateIndex;
        });
        const formFieldData = arr[0]?.formFieldWindowParameters;
        const questionField = arr[0]?.questionsWindowParameters;
        const skewField = arr[0]?.skewMarksWindowParameters;
        const idField = arr[0]?.layoutParameters;

        // Map each set of parameters to their coordinates or default to an empty array
        const coordinateOfFormData =
          formFieldData?.map((item) => item.Coordinate) ?? [];
        const coordinateOfQuestionField =
          questionField?.map((item) => item.Coordinate) ?? [];
        const coordinateOfSkewField =
          skewField?.map((item) => item.Coordinate) ?? [];
        const coordinateOfIdField = idField?.Coordinate ?? {};

        // Combine all coordinates into a single array
        const allCoordinates = [
          ...coordinateOfFormData,
          ...coordinateOfQuestionField,
          ...coordinateOfSkewField,
          ...[coordinateOfIdField],
        ];
        const filteredCoordinates = allCoordinates.filter(
          (item) => Object.keys(item).length > 0
        );
        console.log(filteredCoordinates);
        // Map each coordinate to a new format
        const newSelectedFields = filteredCoordinates?.map((item) => {
          const {
            "Start Row": startRow,
            "Start Col": startCol,
            "End Row": endRow,
            "End Col": endCol,
            name,
            fieldType,
          } = item;

          return {
            startRow: startRow - 1,
            startCol,
            endRow: endRow - 1,
            endCol,
            name,
            fieldType,
          };
        });

        return newSelectedFields;
      });
      //   console.log(templateIndex,selectedFieldType,coordinateIndex);
      //   if(templateIndex,selectedFieldType,coordinateIndex)
      dataCtx.modifyRegionWithUUID(
        templateIndex,
        newData,
        selectedFieldType,
        coordinateIndex
      );
      setSelection(null);
    }
  };
  console.log(dataCtx.allTemplates);
  const handleSkewMarkOptionChange = (event) => {
    setSkewOption(event.target.value);
  };
  const handleWindowNgOptionChange = (event) => {
    setWindowNgOption(event.target.value);
  };
  const handleRadioChange = (e) => {
    setSelectedFieldType(e.target.value);
  };

  const handleEyeClick = (selectedField, index) => {
    console.log(selectedField);
    setSelection(() => ({
      startRow: selectedField.startRow,
      startCol: selectedField.startCol,
      endRow: selectedField.endRow,
      endCol: selectedField.endCol,
    }));
    const formattedSelectedFile = {
      "End Col": selectedField.endCol,
      "End Row": selectedField.endRow + 1,
      "Start Col": selectedField.startCol,
      "Start Row": selectedField.startRow + 1,
      fieldType: selectedField.fieldType,
      name: selectedField.name,
    };
    setSelectionIndex(index);
    const template = dataCtx.allTemplates.find((item) => {
      console.log(item);
      return item[0].layoutParameters?.key ?? "" === templateIndex;
    });
    // console.log(template);
    if (selectedField?.fieldType === "idField") {
      const data = template[0].layoutParameters;
      setSelectedFieldType("idField");
      setWindowNgOption(data?.ngAction);
      setMinimumMark(data?.minimumMark);
      setMaximumMark(data?.maximumMark);
      // setNoInRow(data?.totalNoInRow);
      // setNoInCol(data?.totalNoInColumn);
      setReadingDirectionOption(data?.iDirection);
      setNoInRow(data?.rowNumber);
      setNoInCol(data?.columnNumber);
      setStartRowInput(formattedSelectedFile["Start Row"]);
      setEndRowInput(formattedSelectedFile["End Row"]);
      setStartColInput(formattedSelectedFile["Start Col"]);
      setEndColInput(formattedSelectedFile["End Col"]);
      setCoordinateIndex(index);
      setModalUpdate(true);
      setModalShow(true);
    } else if (selectedField?.fieldType === "questionField") {
      // const data = template[0].questionsWindowParameters.filter((item) => {
      //     return isEqual(item.Coordinate, formattedSelectedFile);
      // })[0];
      const parameters = template[0].questionsWindowParameters;
      console.log(parameters);
      console.log(formattedSelectedFile);
      // Find the index of the matched object
      const index = parameters.findIndex((item) =>
        isEqual(item.Coordinate, formattedSelectedFile)
      );
      console.log(index);
      // Get the matched object
      const data = index !== -1 ? parameters[index] : null;
      console.log(data);
      setCoordinateIndex(index);
      setModalUpdate(true);
      setModalShow(true);
      setName(data?.windowName);
      setSelectedFieldType("questionField");
      setWindowNgOption(data?.ngAction);
      setMinimumMark(data?.iMaximumMarks);
      setMaximumMark(data?.iMinimumMarks);
      setNoInRow(data?.rowNumber);
      setNoInCol(data?.columnNumber);
      setStartRowInput(formattedSelectedFile["Start Row"]);
      setEndRowInput(formattedSelectedFile["End Row"]);
      setStartColInput(formattedSelectedFile["Start Col"]);
      setEndColInput(formattedSelectedFile["End Col"]);
      setReadingDirectionOption(data?.iDirection);
      setType(data?.iType);
      // setOption(data?.iOption);
      setNumberOfField(data?.totalNumberOfFields);
      setFieldType(data?.numericOrAlphabets);
      setMultiple(data?.multipleAllow);
      setMultipleValue(data?.multipleValue);
      setBlank(data?.blankAllow);
      setBlankValue(data?.blankValue);
    } else if (selectedField?.fieldType === "formField") {
      // const data = template[0].formFieldWindowParameters.filter((item) => {

      //     return isEqual(item.Coordinate, formattedSelectedFile);
      // })[0];
      const parameters = template[0].formFieldWindowParameters;
      const index = parameters.findIndex((item) =>
        isEqual(item.Coordinate, formattedSelectedFile)
      );
      // Get the matched object
      const data = index !== -1 ? parameters[index] : null;
      setCoordinateIndex(index);

      setModalUpdate(true);
      setModalShow(true);
      setSelectedFieldType("formField");
      setName(data?.windowName);
      setWindowNgOption(data?.ngAction);
      setMinimumMark(data?.iMaximumMarks);

      setMaximumMark(data?.iMinimumMarks);
      setNoInRow(data?.rowNumber);
      setNoInCol(data?.columnNumber);
      setStartRowInput(formattedSelectedFile["Start Row"] - 1);
      setEndRowInput(formattedSelectedFile["End Row"] - 1);
      setStartColInput(formattedSelectedFile["Start Col"]);
      setEndColInput(formattedSelectedFile["End Col"]);
      setReadingDirectionOption(data?.iDirection);
      setType(data?.iType);
      // setOption(data?.iOption);
      setNumberOfField(data?.totalNumberOfFields);
      setFieldType(data?.numericOrAlphabets);
      setMultiple(data?.multipleAllow);
      setMultipleValue(data?.multipleValue);
      setBlank(data?.blankAllow);
      setBlankValue(data?.blankValue);
    } else if (selectedField?.fieldType === "skewMarkField") {
      const parameters = template[0].skewMarksWindowParameters;
      const index = parameters.findIndex((item) =>
        isEqual(item.Coordinate, formattedSelectedFile)
      );

      // Get the matched object
      const data = index !== -1 ? parameters[index] : null;

      setCoordinateIndex(index);
      setModalUpdate(true);
      setModalShow(true);
      setSelectedFieldType("skewMarkField");
      setStartRowInput(formattedSelectedFile["Start Row"]);
      setEndRowInput(formattedSelectedFile["End Row"]);
      setStartColInput(formattedSelectedFile["Start Col"]);
      setEndColInput(formattedSelectedFile["End Col"]);
    }
  };
  const handleCrossClick = (selectedField, index) => {
    const response = window.confirm(
      "Are you sure you want to delete the selected field ?"
    );
    if (!response) {
      return;
    }
    const formattedSelectedFile = {
      "End Col": selectedField.endCol,
      "End Row": selectedField.endRow + 1,
      "Start Col": selectedField.startCol,
      "Start Row": selectedField.startRow + 1,
      fieldType: selectedField.fieldType,
      name: selectedField.name,
    };
    setSelectedCoordinates((prevState) => {
      const copiedState = [...prevState];
      copiedState.splice(index, 1); // Remove the item at the specified index
      return copiedState;
    });
    const template = dataCtx.allTemplates.find((item) => {
      return item[0].layoutParameters?.key ?? "" === templateIndex;
    });
    dataCtx.deleteFieldTemplateWithUUID(templateIndex, formattedSelectedFile);
    resetJson(
      template[0].layoutParameters.numberedExcelJsonFile,
      formattedSelectedFile["Start Row"] - 1,
      formattedSelectedFile["End Row"] - 1,
      formattedSelectedFile["Start Col"],
      formattedSelectedFile["End Col"]
    );
  };
  const handleIconMouseUp = (event) => {
    event.stopPropagation();
  };

  const sendHandler = async () => {
    // Retrieve the selected template
    const template = dataCtx.allTemplates.find((item) => {
      return item[0].layoutParameters?.key ?? "" === templateIndex;
    });
    // const template = dataCtx.allTemplates[templateIndex];

    // Extract layout parameters and its coordinates
    const layoutParameters = template[0].layoutParameters;
    const idpatttern = "000000000000000000000000";
    if (layoutParameters.idMarksPattern === idpatttern) {
      layoutParameters.columnNumber = 1;
      layoutParameters.columnStart = 1;
      layoutParameters.columnStep = 1;
      layoutParameters.rowNumber = 1;
      layoutParameters.rowStart = 1;
      layoutParameters.rowStep = 1;
    }

    const Coordinate = layoutParameters.Coordinate;
    let layoutCoordinates = {};
    // Transform layout coordinates into the required format
    if (Coordinate) {
      layoutCoordinates = {
        right: Coordinate["End Col"],
        end: Coordinate["End Row"],
        left: Coordinate["Start Col"],
        start: Coordinate["Start Row"],
        name: Coordinate["name"],
        fieldType: Coordinate["fieldType"],
      };
    }

    // Extract and format image structure data
    const imageStructureData = layoutParameters.imageStructureData;
    let imageCoordinates = {};
    if (imageStructureData) {
      imageCoordinates = {
        height: imageStructureData.height,
        x: imageStructureData.x,
        y: imageStructureData.y,
        width: imageStructureData.width,
      };
    }

    // Update layout parameters, removing original Coordinate and imageStructureData
    const updatedLayout = {
      ...layoutParameters,
      layoutCoordinates,
      imageCoordinates,
    };
    delete updatedLayout.Coordinate;
    delete updatedLayout.imageStructureData;

    // Extract and format barcode, image, and printing data
    const barcodeData = template[0].barcodeData;
    const imageData = template[0].imageData;
    const printingData = template[0].printingData;

    // Transform question window parameters into the required format
    const questionsWindowParameters =
      template[0].questionsWindowParameters?.map((item) => {
        const { Coordinate, ...rest } = item;
        const questionWindowCoordinates = Coordinate
          ? {
              right: Coordinate["End Col"],
              end: Coordinate["End Row"],
              left: Coordinate["Start Col"],
              start: Coordinate["Start Row"],
              name: Coordinate["name"],
              fieldType: Coordinate["fieldType"],
            }
          : {};
        return { ...rest, questionWindowCoordinates };
      });

    // Transform skew marks window parameters into the required format
    const skewMarksWindowParameters =
      template[0].skewMarksWindowParameters?.map((item) => {
        const { Coordinate, ...rest } = item;
        const layoutWindowCoordinates = Coordinate
          ? {
              right: Coordinate["End Col"],
              end: Coordinate["End Row"],
              left: Coordinate["Start Col"],
              start: Coordinate["Start Row"],
              name: Coordinate["name"],
              fieldType: Coordinate["fieldType"],
            }
          : {};
        return { ...rest, layoutWindowCoordinates };
      });

    // Transform form field window parameters into the required format
    const formFieldWindowParameters =
      template[0].formFieldWindowParameters?.map((item) => {
        const { Coordinate, ...rest } = item;
        const formFieldCoordinates = Coordinate
          ? {
              right: Coordinate["End Col"],
              end: Coordinate["End Row"],
              left: Coordinate["Start Col"],
              start: Coordinate["Start Row"],
              name: Coordinate["name"],
              fieldType: Coordinate["fieldType"],
            }
          : {};
        return { ...rest, formFieldCoordinates };
      });
    const { imageCroppingDTO } = template[0];
    // Assemble the full request data
    const fullRequestData = {
      layoutParameters: updatedLayout,
      barcodeData,
      imageData,
      printingData,
      questionsWindowParameters,
      skewMarksWindowParameters,
      formFieldWindowParameters,
      imageCroppingDTO,
    };
    console.log(fullRequestData);
    // return;
    const csv = Papa.unparse(excelJsonFile);
    // Create a Blob from the CSV string
    const blob = new Blob([csv], { type: "text/csv" });

    // Create a File object from the Blob
    const csvfile = new File([blob], "data.csv", { type: "text/csv" });
    const imageFile = base64ToFile(templateImagePath, "front.png");
    const backImageFile = base64ToFile(templateBackImagePath, "back.png");
    // Send the request and handle the response

    try {
      setLoading(true);
      const res = await createTemplate(fullRequestData);
      console.log(res);
      if (res === undefined) {
        toast.error("Something went wrong ");
      }
      if (res?.success === true) {
        const layoutId = res?.layoutId;
        const formdata = new FormData();
        formdata.append("LayoutId", layoutId);
        formdata.append("FrontImageFile", imageFile);
        formdata.append("BackImageFile", backImageFile);
        formdata.append("ExcelFile", csvfile);
        // Iterate over the FormData entries and log them
        for (let [key, value] of formdata.entries()) {
          console.log(`${key}: ${value}`);
        }
        const res2 = await sendFile(formdata);
        console.log(res2);
        setLoading(false);

        alert(`Response : ${JSON.stringify(res2?.message)}`);

        if (res2?.success) {
          // sessionStorage.clear();
          toast.success("Layout Saved");
          navigate("/admin/template", { replace: true });
        }
      }
    } catch (error) {
      alert(`Error creating template`);
      console.error("Error sending POST request:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const handleImage = (images) => {
    setImagesSelectedCount(images.length);
    // if (images.length > 0) {
    //   dataCtx.addImageCoordinate(templateIndex, images)
    // }
  };
  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 99 }}>
        <SmallHeader />
      </div>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)", // Slightly opaque background
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            pointerEvents: "auto", // Make the overlay not clickable
          }}
        >
          <div style={{ height: "50%" }}>
            <TextLoader message={"Saving, Please wait..."} />
          </div>
        </div>
      )}

      <div
        style={{
          position: isWideScreen ? "fixed" : "absolute",
          top: "30px",
          left: isWideScreen ? "50%" : "10%",
          transform: isWideScreen ? "translateX(-50%)" : "none",
          zIndex: "999",
        }}
      >
        <Button
          variant="primary"
          onClick={() => {
            setImageModalShow(true);
          }}
          style={{ position: "relative" }}
        >
          Image Area
          <Badge
            pill
            variant="light"
            style={{
              position: "absolute",
              top: "-5px", // Adjust this value to position the badge correctly
              right: "-5px", // Adjust this value to position the badge correctly
              transform: "translate(50%, -50%)",
              zIndex: "1000",
            }}
          >
            {imagesSelectedCount} {/* Replace this with your dynamic number */}
          </Badge>
        </Button>

        <Button
          variant="secondary"
          onClick={() => {
            setDetailPage(true);
          }}
        >
          Layout details
        </Button>
      </div>
      {!modalShow && selection && (
        <Button
          onClick={() => {
            setModalShow(true);
          }}
          variant="default"
          style={{
            position: "fixed",
            bottom: "50px", // Adjust the top value as needed
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: "999",
          }}
        >
          Show Modal
        </Button>
      )}

      <div style={{ overflow: "auto", width: "100%" }}>
        <Button
          onClick={sendHandler}
          disabled={loading}
          style={{
            position: "fixed",
            bottom: "50px", // Distance from the bottom of the screen
            right: "50px", // Distance from the right of the screen
            borderRadius: "50%",
            width: "50px", // Width of the button
            height: "50px", // Height of the button
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "50px", // Remove padding to center the text
            zIndex: "999",
            color: "white", // Optional: Set the text color
            border: "none", // Optional: Remove border if desired
            cursor: "pointer", // Optional: Change cursor to pointer on hover
          }}
        >
          {!loading ? "Save" : "Saving"}
        </Button>

        <div className="main-container">
          <div className="containers">
            <div className="d-flex">
              <div style={{ marginRight: "1rem" }}>
                <div className="top"></div>
                {Array.from({ length: numRows }).map((_, rowIndex) => (
                  <div key={rowIndex} className="row">
                    <div
                      className={
                        bubbleType === "circle"
                          ? "left-nums-circle"
                          : "left-nums"
                      }
                    >
                      {rowIndex + 1}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div className="top-row">
                  <div className="corner"></div>
                  {Array.from({ length: numCols }).map((_, index) => (
                    <div key={index} className="top-num">
                      {index + 1}
                    </div>
                  ))}
                </div>
                <div
                  id="grid-div"
                  style={{
                    border: "2px solid black",
                    paddingTop: "1rem",
                    paddingRight: "1.2rem",
                    paddingLeft: "1rem",
                    overflowY: "auto",
                    // marginRight: "1rem"
                    width: "max-content",
                  }}
                >
                  <div
                    className="grid"
                    ref={imageRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                  >
                    {Array.from({ length: numRows }).map((_, rowIndex) => {
                      const result = [...excelJsonFile.map(Object.values)];

                      const template = dataCtx.allTemplates.find((item) => {
                        return (
                          item[0].layoutParameters?.key ?? "" === templateIndex
                        );
                      });
                      const numberedJson = template
                        ? [
                            ...template[0]?.layoutParameters?.numberedExcelJsonFile.map(
                              Object.values
                            ),
                          ]
                        : [];

                      return (
                        <div key={rowIndex} className="row">
                          <div
                            className={
                              bubbleType === "circle"
                                ? "left-num-circle"
                                : "left-num"
                            }
                          >
                            <div className="timing-mark "></div>
                          </div>
                          {Array.from({ length: numCols }).map(
                            (_, colIndex) => {
                              const num =
                                (numberedJson[rowIndex] &&
                                  numberedJson[rowIndex][colIndex]) !==
                                undefined
                                  ? numberedJson[rowIndex][colIndex]
                                  : null;
                              let bgColor =
                                result[rowIndex][colIndex] != 0 &&
                                result[rowIndex][colIndex] !== undefined
                                  ? "black"
                                  : "";
                              console.log(num);
                              if (num || num === 0) {
                                bgColor = "lightgreen";
                              }
                              let fontColor =
                                rowIndex < result.length &&
                                colIndex < result[rowIndex].length &&
                                result[rowIndex][colIndex] != 0 &&
                                result[rowIndex][colIndex] !== undefined
                                  ? "lightgray"
                                  : "black";
                              if (num || num === 0) {
                                fontColor = "black";
                              }
                              return (
                                <div
                                  key={colIndex}
                                  style={{
                                    backgroundColor: bgColor,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize:
                                      bubbleType === "circle" ? "12px" : "8px",
                                    color: fontColor,
                                    userSelect: "none",
                                  }}
                                  // style={{
                                  //     backgroundColor:
                                  //         result[rowIndex][colIndex] != 0 ? "black" : "",
                                  // }}
                                  className={`${bubbleType} ${
                                    selected[`${rowIndex},${colIndex}`]
                                      ? "selected"
                                      : ""
                                  }`}
                                >
                                  {numberedJson.length > 0 &&
                                    numberedJson[rowIndex][colIndex]}
                                </div>
                              );
                            }
                          )}
                        </div>
                      );
                    })}

                    {selectedCoordinates.map((data, index) => (
                      <div
                        key={index}
                        ref={(el) => (divRefs.current[index] = el)}
                        className="border-blue-900"
                        style={{
                          border: "3px solid #007bff",
                          position: "absolute",
                          overflow: "hidden",
                          left: `${
                            data.startCol *
                              (imageRef.current.getBoundingClientRect().width /
                                numCols) -
                            4
                          }px`,
                          top: `${
                            data.startRow *
                              (imageRef.current.getBoundingClientRect().height /
                                numRows) -
                            3
                          }px`,
                          width: `${
                            (data.endCol - data.startCol + 1) *
                            (imageRef.current.getBoundingClientRect().width /
                              numCols)
                          }px`,
                          height: `${
                            (data.endRow - data.startRow + 1) *
                            (imageRef.current.getBoundingClientRect().height /
                              numRows)
                          }px`,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className="d-flex justify-content-between align-items-center bg-dark text-white p-1"
                          style={{
                            opacity: 0.8,
                            fontSize: "12px",
                            position: "relative",
                            overflow: "hidden",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {sizes[index] ? (
                            <span>
                              <i
                                className={`fas fa-eye me-2 mr-1 ${classes.eye}`}
                                onMouseUp={handleIconMouseUp}
                                onClick={(e) => handleEyeClick(data, index)}
                                style={{ cursor: "pointer" }}
                              ></i>
                              <i
                                className="fas fa-times text-danger cross-icon ml-1"
                                onMouseUp={handleIconMouseUp}
                                onClick={() => handleCrossClick(data, index)}
                                style={{ cursor: "pointer" }}
                              ></i>
                            </span>
                          ) : (
                            <>
                              <span className="user-select-none">
                                {data.name}
                              </span>
                              <span className="d-flex align-items-center user-select-none gap-10">
                                <i
                                  className={`fas fa-eye me-2 mr-1 ${classes.eye}`}
                                  onMouseUp={handleIconMouseUp}
                                  onClick={(e) => handleEyeClick(data, index)}
                                  style={{ cursor: "pointer" }}
                                ></i>
                                <i
                                  className="fas fa-times text-danger cross-icon ml-1"
                                  onMouseUp={handleIconMouseUp}
                                  onClick={() => handleCrossClick(data, index)}
                                  style={{ cursor: "pointer" }}
                                ></i>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                    {selection && (
                      <div
                        className="border-green-700"
                        style={{
                          border: "2px solid green",
                          position: "absolute",
                          left: `${
                            selection.startCol *
                              (imageRef.current.getBoundingClientRect().width /
                                numCols) -
                            4
                          }px`,
                          top: `${
                            selection.startRow *
                              (imageRef.current.getBoundingClientRect().height /
                                numRows) -
                            3
                          }px`,
                          width: `${
                            (selection.endCol - selection.startCol + 1) *
                            (imageRef.current.getBoundingClientRect().width /
                              numCols)
                          }px`,
                          height: `${
                            (selection.endRow - selection.startRow + 1) *
                            (imageRef.current.getBoundingClientRect().height /
                              numRows)
                          }px`,
                          content: "question field",
                        }}
                      ></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={modalShow}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title
            id="contained-modal-title-vcenter"
            style={{ width: "100vw" }}
          >
            <h2 className="text-center">
              {!modalUpdate ? "Choose field type" : selectedFieldType}
            </h2>
            <br />
            {/* <Row className="mb-2">
              <Col sm={2} md={2} className="d-flex align-items-center">
                <label htmlFor="formField" className="mr-2 mb-0 field-label">
                  Form :{" "}
                </label>  
                <input
                  id="formField"
                  type="radio"
                  name="fieldType"
                  value="formField"
                  checked={selectedFieldType === "formField"}
                  onChange={handleRadioChange}
                  className=" field-label mt-1"
                />
              </Col>
              <Col sm={2} md={2} className="d-flex align-items-center">
                <label htmlFor="fieldType" className="mr-2 mb-0 field-label">
                  Question :{" "}
                </label>
                <input
                  id="fieldType"
                  type="radio"
                  name="fieldType"
                  value="questionField"
                  checked={selectedFieldType === "questionField"}
                  onChange={handleRadioChange}
                  className=" field-label mt-1"
                />
              </Col>
              <Col md={3} className="d-flex align-items-center">
                <label
                  htmlFor="skewMarkField"
                  className="mr-2 mb-0 col-form-label"
                  style={{ marginRight: "8px" }} // Inline style to add a bit more space if needed
                >
                  Skew Mark :
                </label>
                <input
                  id="skewMarkField"
                  type="radio"
                  name="fieldType"
                  value="skewMarkField"
                  checked={selectedFieldType === "skewMarkField"}
                  onChange={handleRadioChange}
                  className=" field-label mt-1" // Add margin-left to input for better spacing if necessary
                />
              </Col>
              <Col md={2} className="d-flex align-items-center">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div>
                    <label htmlFor="idField" className="mr-2 mb-0 field-label">
                      ID Mark :
                    </label>
                    <input
                      id="idField"
                      type="radio"
                      name="fieldType"
                      value="idField"
                      checked={selectedFieldType === "idField"}
                      onChange={handleRadioChange}
                      className="field-label mt-1"
                      disabled={idSelectionCount > 0}
                    />
                  </div>
                  {idSelectionCount > 0 && (
                    <div>
                      <small style={{ color: "orangered" }}>
                        already selected
                      </small>
                    </div>
                  )}
                </div>
              </Col>
              <Col md={3} className="d-flex align-items-center">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div>
                    <label
                      htmlFor="imageArea"
                      className="mr-2 mb-0 field-label"
                    >
                      Image Area :
                    </label>
                    <input
                      id="imageArea"
                      type="radio"
                      name="fieldType"
                      value="imageArea"
                      checked={selectedFieldType === "imageArea"}
                      onChange={handleRadioChange}
                      className="field-label mt-1"
                    />
                  </div>
                </div>
              </Col>
            </Row> */}
            {!modalUpdate && (
              <Row className="mb-2 d-flex align-items-center">
                <Col
                  xs={12}
                  sm={4}
                  md={3}
                  // className="d-flex align-items-center"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <label htmlFor="formField" className="mr-2 mb-0 field-label">
                    Form:
                  </label>
                  <input
                    id="formField"
                    type="radio"
                    name="fieldType"
                    value="formField"
                    checked={selectedFieldType === "formField"}
                    onChange={handleRadioChange}
                    className="field-label mt-1"
                  />
                </Col>
                <Col
                  xs={12}
                  sm={4}
                  md={3}
                  className="d-flex align-items-center"
                >
                  <label htmlFor="fieldType" className="mr-2 mb-0 field-label">
                    Question:
                  </label>
                  <input
                    id="fieldType"
                    type="radio"
                    name="fieldType"
                    value="questionField"
                    checked={selectedFieldType === "questionField"}
                    onChange={handleRadioChange}
                    className="field-label mt-1"
                  />
                </Col>
                <Col
                  xs={12}
                  sm={4}
                  md={3}
                  className="d-flex align-items-center"
                >
                  <label
                    htmlFor="skewMarkField"
                    className="mr-2 mb-0 col-form-label"
                  >
                    Skew Mark:
                  </label>
                  <input
                    id="skewMarkField"
                    type="radio"
                    name="fieldType"
                    value="skewMarkField"
                    checked={selectedFieldType === "skewMarkField"}
                    onChange={handleRadioChange}
                    className="field-label mt-1"
                  />
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={3}
                  className="d-flex align-items-center"
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div>
                      <label
                        htmlFor="idField"
                        className="mr-2 mb-0 field-label"
                      >
                        ID Mark:
                      </label>
                      <input
                        id="idField"
                        type="radio"
                        name="fieldType"
                        value="idField"
                        checked={selectedFieldType === "idField"}
                        onChange={handleRadioChange}
                        className="field-label mt-1"
                        disabled={idSelectionCount > 0}
                      />
                    </div>
                    {idSelectionCount > 0 && (
                      <div>
                        <small style={{ color: "orangered" }}>
                          already selected
                        </small>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "55vh", overflowX: "auto" }}>
          {selectedFieldType === "imageArea" && (
            <>
              <ImageCropper imageSrc={templateImagePath} />
            </>
          )}
          {selectedFieldType !== "imageArea" && (
            <>
              {selectedFieldType !== "idField" && (
                <Row className="mb-2">
                  <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label "
                    style={{ fontSize: "0.8rem" }}
                  >
                    Window Name
                  </label>
                  <div className="col-md-10">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Window Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      style={{ color: "black" }}
                    />
                  </div>
                </Row>
              )}
              {(selectedFieldType === "questionField" ||
                selectedFieldType === "formField") && (
                <Row className="mb-2">
                  <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                  >
                    Grid
                  </label>
                  <div
                    className={multiple !== "allow" ? "col-md-4" : "col-md-10"}
                  >
                    <select
                      className="form-control"
                      value={multiple}
                      onChange={(e) => {
                        setMultiple(e.target.value);
                      }}
                      defaultValue={""}
                    >
                      <option value="">Select an option</option>
                      <option value="allow">Allow All</option>
                      <option value="not allow">Allow None</option>
                    </select>
                  </div>
                  {multiple !== "allow" && (
                    <>
                      <label htmlFor="example-text-input" className="col-md-2 ">
                        Grid Value
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Character of Multiple"
                          value={multipleValue}
                          onChange={(e) => setMultipleValue(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}
                </Row>
              )}
              {(selectedFieldType === "questionField" ||
                selectedFieldType === "formField") && (
                <Row className="mb-2">
                  <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                  >
                    Blanks
                  </label>
                  <div className={blank !== "allow" ? "col-md-4" : "col-md-10"}>
                    <select
                      className="form-control"
                      value={blank}
                      onChange={(e) => {
                        setBlank(e.target.value);
                      }}
                      defaultValue={""}
                    >
                      <option value="">Select an option</option>
                      <option value="allow">Allow All</option>
                      <option value="not allow">Allow None</option>
                    </select>
                  </div>
                  {blank !== "allow" && (
                    <>
                      <label
                        htmlFor="example-text-input"
                        className="col-md-2 col-form-label"
                      >
                        Blank Value
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Character of Blank"
                          value={blankValue}
                          onChange={(e) => setBlankValue(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}
                </Row>
              )}
              {(selectedFieldType !== "idField" ||
                selectedFieldType !== "skewMarkField") && (
                <Row className="mb-2">
                  <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                  >
                    Window NG
                  </label>
                  <div className="col-md-10">
                    <select
                      className="form-control"
                      value={windowNgOption}
                      onChange={handleWindowNgOptionChange}
                      defaultValue={""}
                    >
                      <option value="">Select an option</option>
                      <option value="0x00000001">
                        Paper ejection to select stacker
                      </option>
                      <option value="0x00000002">Stop reading</option>
                      <option value="0">No Action</option>
                    </select>
                  </div>
                </Row>
              )}
              {selectedFieldType !== "idField" && (
                <Row>
                  <label htmlFor="example-select-input" className="col-md-2">
                    Minimum Mark
                  </label>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter the minimum mark"
                      value={minimumMark}
                      onChange={(e) => {
                        // Allow only numeric input (including empty input)
                        const numericValue = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        setMinimumMark(numericValue);
                      }}
                      required
                    />
                  </div>
                  <label htmlFor="example-select-input" className="col-md-2 ">
                    Maximum Mark
                  </label>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter the maximum mark"
                      value={maximumMark}
                      onChange={(e) => {
                        // Allow only numeric input (including empty input)
                        const numericValue = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        setMaximumMark(numericValue);
                      }}
                      required
                    />
                  </div>
                </Row>
              )}
              {selectedFieldType === "idField" && (
                <Row className="mb-2">
                  <label className="col-md-2 " style={{}}>
                    Set Id Pattern
                  </label>

                  <div className="col-md-2">
                    <select
                      value={idType}
                      onChange={(e) => {
                        setIdType(e.target.value);
                      }}
                      className=" form-control"
                    >
                      <option value="Row">Row</option>
                      <option value="Col">Col</option>
                    </select>
                  </div>
                  <label htmlFor="example-select-input" className="col-md-2 ">
                    Id selection
                  </label>
                  <div className="col-md-6">
                    <MultiSelect
                      options={options}
                      value={selectedCol}
                      onChange={setSelectedCol}
                      labelledBy="Select"
                    />
                  </div>
                </Row>
              )}
              {selectedFieldType === "skewMarkField" && (
                <Row className="mb-2">
                  <label
                    htmlFor="example-select-input"
                    className="col-md-2 col-form-label"
                  >
                    Skew Mark
                  </label>
                  <div className="col-md-10">
                    <select
                      className="form-control"
                      value={skewoption}
                      onChange={handleSkewMarkOptionChange}
                      defaultValue={"none"}
                    >
                      <option value="">Select an option</option>
                      <option value="rear">Top Skew Mark</option>
                      <option value="front">Bottom Skew Mark</option>
                    </select>
                  </div>
                </Row>
              )}

              <Row className="mb-2">
                <label
                  htmlFor="example-select-input"
                  className="col-2 col-form-label"
                >
                  Start Row
                </label>
                <div className="col-2 ">
                  <input
                    id="startRow"
                    type="number"
                    disabled={modalUpdate}
                    value={startRowInput}
                    onBlur={(e) => {
                      const newValue = e.target.valueAsNumber;
                      if (newValue > 0) {
                        setSelection((item) => ({
                          ...item,
                          startRow: newValue - 1,
                        }));
                      } else {
                        setStartRowInput(selection.startRow + 1); // Reset to previous valid value
                      }
                    }}
                    onChange={(e) => {
                      setStartRowInput(
                        e.target.valueAsNumber >= 0 ? e.target.value : ""
                      );
                    }}
                    className="form-control"
                  />
                </div>
                <label
                  htmlFor="example-select-input"
                  className="col-2 col-form-label"
                >
                  End Row
                </label>
                <div className="col-2">
                  <input
                    type="number"
                    value={endRowInput}
                    disabled={modalUpdate}
                    onBlur={(e) => {
                      const newValue = e.target.valueAsNumber;
                      if (newValue > 0) {
                        setSelection((item) => ({
                          ...item,
                          endRow: newValue - 1,
                        }));
                      } else {
                        setEndRowInput(selection?.endRow + 1); // Reset to previous valid value
                      }
                    }}
                    onChange={(e) => {
                      setEndRowInput(
                        e.target.valueAsNumber >= 0 ? e.target.value : ""
                      );
                    }}
                    className="form-control"
                  />
                </div>
                <label
                  htmlFor="example-select-input"
                  className="col-2 col-form-label"
                >
                  Total Row
                </label>
                <div className="col-2">
                  <input value={numRows} readOnly className="form-control" />
                </div>
              </Row>
              <Row className="">
                <label htmlFor="example-select-input" className="col-2 ">
                  Total No In Row
                </label>
                <div className="col-4">
                  <input
                    type="number"
                    className="form-control"
                    value={noInRow}
                    onChange={(e) => setNoInRow(e.target.value)}
                    required
                  />
                </div>
                <label htmlFor="example-select-input" className="col-2 ">
                  Total Step In A Row
                </label>
                <div className="col-4">
                  <input
                    type="number"
                    className="form-control"
                    value={noOfStepInRow}
                    onChange={(e) => setNoOfStepInRow(e.target.value)}
                    required
                  />
                </div>
              </Row>
              <Row className="mb-2">
                <label
                  htmlFor="example-select-input"
                  className="col-2  col-form-label"
                >
                  Start Col
                </label>
                <div className="col-2">
                  <input
                    type="number"
                    value={startColInput}
                    disabled={modalUpdate}
                    onBlur={(e) => {
                      const newValue = e.target.valueAsNumber;
                      if (newValue > 0) {
                        setSelection((item) => ({
                          ...item,
                          startCol: newValue,
                        }));
                      } else {
                        setStartColInput(selection?.startCol); // Reset to previous valid value
                      }
                    }}
                    onChange={(e) => {
                      setStartColInput(
                        e.target.valueAsNumber >= 0 ? e.target.value : ""
                      );
                    }}
                    className="form-control"
                  />
                  {/* <input
                value={selection?.startCol}
                readOnly
                className="form-control"
              /> */}
                </div>

                <label
                  htmlFor="example-select-input"
                  className="col-2 col-form-label"
                >
                  End Col
                </label>
                <div className="col-2">
                  <input
                    type="number"
                    value={endColInput}
                    disabled={modalUpdate}
                    onBlur={(e) => {
                      const newValue = e.target.valueAsNumber;
                      if (newValue > 0) {
                        setSelection((item) => ({
                          ...item,
                          endCol: newValue,
                        }));
                      } else {
                        setEndColInput(selection?.endCol); // Reset to previous valid value
                      }
                    }}
                    onChange={(e) => {
                      setEndColInput(
                        e.target.valueAsNumber >= 0 ? e.target.value : ""
                      );
                    }}
                    className="form-control"
                  />
                  {/* <input
                value={selection?.endCol}
                readOnly
                className="form-control"
              /> */}
                </div>
                <label
                  htmlFor="example-select-input"
                  className="col-2 col-form-label"
                >
                  Total Column
                </label>
                <div className="col-2">
                  <input value={numCols} readOnly className="form-control" />
                </div>
              </Row>
              <Row className="mb-2">
                <label htmlFor="example-select-input" className="col-2 ">
                  Total No In Column
                </label>
                <div className="col-4">
                  <input
                    type="text"
                    className="form-control"
                    value={noInCol}
                    onChange={(e) => {
                      // Allow only numeric input (including empty input)
                      const numericValue = e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                      setNoInCol(numericValue);
                    }}
                    required
                  />
                </div>
                <label htmlFor="example-select-input" className="col-2 ">
                  Total Step In A Column
                </label>
                <div className="col-4">
                  <input
                    type="text"
                    className="form-control"
                    value={noOfStepInCol}
                    onChange={(e) => setNoOfStepInCol(e.target.value)}
                    required
                  />
                </div>
              </Row>

              <Row className="mb-2">
                <label htmlFor="example-text-input" className="col-md-2 ">
                  Reading Direction :
                </label>
                <div className="col-md-10">
                  <select
                    className="form-control"
                    value={readingDirectionOption}
                    onChange={(e) => {
                      setReadingDirectionOption(e.target.value);
                    }}
                    defaultValue={""}
                  >
                    <option value="">Select reading direction... </option>
                    <option value="0">From the upper left to the bottom</option>
                    <option value="1">
                      From the upper right to the bottom{" "}
                    </option>
                    <option value="2">From the lower left to a top</option>
                    <option value="3">From the lower right to a top</option>
                    <option value="4">From the upper left to right</option>
                    <option value="5">From the upper right to the left</option>
                    <option value="6">From the lower left to right</option>
                    <option value="7">From the lower right to the left </option>
                  </select>
                </div>
              </Row>

              {selectedFieldType !== "idField" && (
                <Row className="mb-2">
                  <label
                    htmlFor="example-text-input"
                    className="col-md-2  col-form-label"
                  >
                    Type :
                  </label>
                  <div className="col-md-5">
                    <select
                      className="form-control"
                      value={type}
                      onChange={(e) => {
                        setType(e.target.value);
                      }}
                      defaultValue={""}
                    >
                      <option value="">Select reading direction... </option>
                      <option value="1">
                        Mask (at the time set window) about a mark{" "}
                      </option>
                      <option value="2">Fixed mark </option>
                      <option value="3">Checkdigits </option>
                      <option value="4">
                        Range checking (ascending order)
                      </option>
                      <option value="5">
                        Range checking (descending order)
                      </option>
                      <option value="6">Range checking (not order) </option>
                      <option value="7">
                        Mask setting(common to partition)
                      </option>
                    </select>
                  </div>
                  {/* <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label "
                  >
                    Option :
                  </label>
                  <div className="col-3 ">
                    <input
                      type="number"
                      className="form-control"
                      value={option}
                      onChange={(e) => setOption(e.target.value)}
                      required
                    />
                  </div> */}
                </Row>
              )}
              {(selectedFieldType === "questionField" ||
                selectedFieldType === "formField") && (
                <Row className="mb-2">
                  <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label "
                  >
                    Total Fields :
                  </label>
                  <div className="col-4 ">
                    <input
                      type="text"
                      className="form-control"
                      value={numberOfField}
                      onChange={(e) => setNumberOfField(e.target.value)}
                      required
                    />
                  </div>
                  <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label "
                  >
                    Field Type :
                  </label>
                  <div className="col-4 ">
                    <select
                      className="form-control"
                      value={fieldType}
                      onChange={(e) => {
                        setFieldType(e.target.value);
                      }}
                      defaultValue={""}
                    >
                      <option value="">Select field type... </option>
                      <option value="numeric">Numeric </option>
                      <option value="alphabet">Alphabet </option>
                      <option value="binary">Litho Code</option>
                      <option value="custom">Custom </option>
                    </select>
                  </div>
                </Row>
              )}
              {(selectedFieldType === "questionField" ||
                selectedFieldType === "formField") &&
                fieldType === "custom" && (
                  <Row>
                    <label htmlFor="example-text-input" className="col-md-2 ">
                      Custom Value :
                    </label>
                    <div className="col-10 ">
                      <input
                        type="text"
                        className="form-control"
                        value={customValue}
                        onChange={(e) => setCustomValue(e.target.value)}
                        placeholder="Enter value separated by value, For Eg (2,3,4,Feild1, Feild2)"
                      />
                      <small style={{ color: "red" }}>
                        *Custom value should be in the reading direction
                      </small>
                    </div>
                  </Row>
                )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button
            onClick={() => {
              setModalShow(false);
            }}
            variant="warning"
            style={{ marginRight: "auto" }}
          >
            Hide Modal
          </Button>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              type="button"
              variant="danger"
              onClick={handleCancel}
              className="waves-effect waves-light"
            >
              Cancel
            </Button>
            <Button
              type="button"
              color="success"
              onClick={handleSave}
              className="waves-effect waves-light"
            >
              {!modalUpdate ? "Save" : "Update"}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        show={imageModalShow}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Image Detail
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "60vh" }}>
          <ImageCropper
            handleImage={handleImage}
            imageSrc={templateImagePath}
            backImageSrc={templateBackImagePath}
            selectedCoordinateData={selectedCoordinates}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            variant="danger"
            onClick={() => setImageModalShow(false)}
            className="waves-effect waves-light"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="success"
            onClick={() => setImageModalShow(false)}
            className="waves-effect waves-light"
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {detailPage && (
        <LayoutDetailModal
          show={detailPage}
          layoutData={layoutFieldData}
          onHide={() => setDetailPage(false)}
        />
      )}
    </>
  );
};

export default DesignTemplate;
