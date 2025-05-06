import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Modal, Button, Col, Badge, Container } from "react-bootstrap";
import { Row } from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "./DesignTemplate.module.css";
import DataContext from "store/DataContext";
import { MultiSelect } from "react-multi-select-component";
import { createTemplate } from "helper/TemplateHelper";
import { getLayoutDataById } from "helper/TemplateHelper";
import SmallHeader from "components/Headers/SmallHeader";
import { toast } from "react-toastify";
import isEqual from "lodash/isEqual";
import { sendFile } from "helper/TemplateHelper";
import EditTemplateModal from "ui/EditTemplateModal";
import base64ToFile from "services/Base64toFile";
import Papa from "papaparse";
import axios from "axios";
import EditImageCropper from "modals/EditImageCropper";
import TextLoader from "loaders/TextLoader";
import { getUrls } from "../../helper/url_helper";
import processDirection from "data/processDirection";
import resetJson from "data/resetJson";
import { useWindowSize } from "react-use";
import { Button as Muibtn, Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CopyModal from "modals/CopyModal/CopyModal";
// Function to get values from sessionStorage or provide default
const getSessionStorageOrDefault = (key, defaultValue) => {
  const stored = sessionStorage.getItem(key);
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
    console.warn(`Error parsing sessionStorage item with key "${key}":`, e);
    return defaultValue;
  }
};

const EditDesignTemplate = () => {
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [dragStart2, setDragStart2] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ left: 0, top: 0 });
  const [copiedCoordinates, setCopiedCoordinates] = useState([]);
  const [selected, setSelected] = useState({});
  const [selection, setSelection] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [selectedClass, setSelectedClass] = useState("circle");
  const imageRef = useRef(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState([]);
  const [name, setName] = useState();
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
  const dataCtx = useContext(DataContext);
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
  const [detailPage, setDetailPage] = useState(false);
  const [imageModalShow, setImageModalShow] = useState(false);
  const [imagesSelectedCount, setImagesSelectedCount] = useState(0);
  const location = useLocation();
  const state = location.state || {};
  const navigate = useNavigate();
  const [sizes, setSizes] = useState({});
  const [detailLoader, setDetailLoader] = useState(false);
  const [selectedField, setSelectedField] = useState();
  const [showCopy, setShowCopy] = useState(false);
  const [sensitivity, setSensitivity] = useState(5);
  const emptyExcelJsonFile = getSessionStorageOrDefault(
    "excelJsonFile",
    state.excelJsonFile
  ).map((row) => {
    return Object.keys(row).reduce((acc, key) => {
      acc[key] = ""; // Set each value to an empty string
      return acc;
    }, {});
  });
  const [data, setData] = useState(() => ({
    totalColumns: getSessionStorageOrDefault(
      "totalColumns",
      state.totalColumns
    ),
    timingMarks: getSessionStorageOrDefault("timingMarks", state.timingMarks),
    templateImagePath: getSessionStorageOrDefault(
      "templateImagePath",
      state.templateImagePath
    ),
    templateBackImagePath: getSessionStorageOrDefault(
      "templateBackImagePath",
      state.templateBackImagePath
    ),
    bubbleType: getSessionStorageOrDefault("bubbleType", state.bubbleType),
    templateIndex: getSessionStorageOrDefault(
      "templateIndex",
      state.templateIndex
    ),
    templateId: getSessionStorageOrDefault("templateId", state.templateId),
    excelJsonFile: getSessionStorageOrDefault(
      "excelJsonFile",
      state.excelJsonFile
    ),
    numberedExcelJsonFile: getSessionStorageOrDefault(
      "numberedExcelJsonFile",
      emptyExcelJsonFile
    ),
  }));
  const divRefs = useRef([]);
  const numRows = data.timingMarks;
  const numCols = data.totalColumns;
  const { width } = useWindowSize();
  const isWideScreen = width >= 994;

  // Function to fetch data from localStorage
  const fetchDataFromLocalStorage = () => {
    setData((item) => {
      return {
        ...item,
        totalColumns: JSON.parse(sessionStorage.getItem("totalColumns")),
        timingMarks: JSON.parse(sessionStorage.getItem("timingMarks")),
        templateImagePath: JSON.parse(
          sessionStorage.getItem("templateImagePath")
        ),
        templateBackImagePath: JSON.parse(
          sessionStorage.getItem("templateBackImagePath")
        ),
        bubbleType: JSON.parse(sessionStorage.getItem("bubbleType")),
        excelJsonFile: JSON.parse(sessionStorage.getItem("excelJsonFile")),
        numberedExcelJsonFile: JSON.parse(
          sessionStorage.getItem("numberedExcelJsonFile")
        ),
      };
    });
  };
  console.log(selectedCoordinates);
  // **************************PREVENT FROM RELOADING*********************
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

  // *****************************************************************
  useEffect(() => {
    if (!detailPage) {
      setTimeout(() => {
        fetchDataFromLocalStorage();
      }, [2000]);
    }
  }, [detailPage]);

  useEffect(() => {
    const idFieldCount = selectedCoordinates.filter(
      (item) => item.fieldType === "idField"
    ).length;
    if (idFieldCount > 0) {
      setIdSelectionCount(1);
    }
  }, [selectedCoordinates]);

  useEffect(() => {
    if (location.state) {
      sessionStorage.setItem("totalColumns", state.totalColumns);
      sessionStorage.setItem("timingMarks", JSON.stringify(state.timingMarks));
      sessionStorage.setItem(
        "templateImagePath",
        JSON.stringify(state.templateImagePath)
      );
      sessionStorage.setItem(
        "templateBackImagePath",
        JSON.stringify(state.templateBackImagePath)
      );
      sessionStorage.setItem("bubbleType", JSON.stringify(state.bubbleType));
      sessionStorage.setItem("templateIndex", state.templateIndex);
      sessionStorage.setItem("templateId", JSON.stringify(state.templateId));
      sessionStorage.setItem(
        "excelJsonFile",
        JSON.stringify(state.excelJsonFile)
      );
      const emptyExcelJsonFile = state.excelJsonFile.map((row) => {
        return Object.keys(row).reduce((acc, key) => {
          acc[key] = ""; // Set each value to an empty string
          return acc;
        }, {});
      });
      sessionStorage.setItem(
        "numberedExcelJsonFile",
        JSON.stringify(emptyExcelJsonFile)
      );
    }
  }, [location.state]);

  useEffect(() => {
    setStartRowInput(selection?.startRow + 1);
    setEndRowInput(selection?.endRow + 1);
    setStartColInput(selection?.startCol);
    setEndColInput(selection?.endCol);
  }, [selection]);
  const shades = Array.from({ length: 16 }, (_, i) => {
    let a = i + 1;
    const greyValue = Math.floor(255 - a * (255 / 18));
    return `rgb(${greyValue}, ${greyValue}, ${greyValue})`;
  });
  useEffect(() => {
    selectedCoordinates.forEach((item) => {
      const isQuestionField = item?.fieldType === "questionField";
      const isFormField = item?.fieldType === "formField";
      const template = dataCtx.allTemplates[data.templateIndex];
      const layoutDetails = template[0].layoutParameters;
      setSensitivity(layoutDetails.iSensitivity);
      if (isQuestionField || isFormField) {
        const template = dataCtx.allTemplates[data.templateIndex];
        const parameters = isQuestionField
          ? template[0].questionsWindowParameters
          : template[0].formFieldWindowParameters;
        const layoutDetails = template[0].layoutParameters;
        // Format the selected file for comparison
        const formattedSelectedFile = {
          "End Col": item.endCol,
          "End Row": item.endRow + 1,
          "Start Col": item.startCol,
          "Start Row": item.startRow + 1,
          fieldType: item.fieldType,
          name: item.name,
        };

        // Find the index of the matched object
        const index = parameters.findIndex((param) =>
          isEqual(param.Coordinate, formattedSelectedFile)
        );

        // Get the matched object
        const data2 = index !== -1 ? parameters[index] : null;

        if (data2) {
          // Determine the reading direction
          let readingDirection = "rightToLeft";
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
          readingDirection =
            directionMapping[data2.iDirection] || "rightToLeft";
          // if (layoutDetails.dataReadDirection === "Top To Bottom") {
          //   if (isQuestionField) {
          //     readingDirection = "leftToRight";
          //   } else {
          //     readingDirection = "topToBottom";
          //   }
          // } else {
          //   if (isQuestionField) {
          //     readingDirection = "rightToLeft";
          //   } else {
          //     readingDirection = "bottomToTop";
          //   }
          // }
          const type = data2.numericOrAlphabets;
          // Process the data with the determined direction

          const stepInRow = data2.rowStep;
          const stepInCol = data2.columnStep;
          processDirection(
            readingDirection,
            item.startRow,
            item.endRow,
            item.startCol,
            item.endCol,
            data.numberedExcelJsonFile,
            type,
            stepInRow,
            stepInCol
          );
        }
      }
    });
  }, [
    data.numberedExcelJsonFile,
    selectedCoordinates,
    dataCtx.allTemplates,
    data.templateIndex,
    modalUpdate,
  ]);
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

  // *************************For Fetching the details and setting the coordinate******************
  // useEffect(() => {

  //     const fetchData = async () => {
  //         const templates = await fetchAllTemplate();
  //         if (templates === undefined) {
  //             toast.error('Error fetching templates');

  //         }
  //         const mpObj = templates?.map((item) => {
  //             return [{ layoutParameters: item }]
  //         });
  //         console.log(mpObj)
  //         dataCtx.addToAllTemplate(mpObj);

  //     }
  //     fetchData()

  // }, []);
  // useEffect(() => {
  //     console.log("called rdf")
  //     const fetchDetails = async () => {
  //         try {
  //             // Fetch layout data by template ID
  //             const response = await getLayoutDataById(data.templateId);
  //             console.log(response);
  //             if (response) {
  //                 // const layoutParameter = response.layoutParameter;
  //                 // set
  //             }
  //             setLayoutFieldData(response);
  //             if (response) {
  //                 // Extract data from the response
  //                 const formFieldData = response?.formFieldWindowParameters ?? [];
  //                 const questionField = response?.questionsWindowParameters ?? [];
  //                 const skewField = response?.skewMarksWindowParameters ?? [];
  //                 const idField = response?.layoutParameters ?? {};

  //                 // Map and restructure data for coordinates
  //                 const coordinateOfFormData = formFieldData.map((item) => ({
  //                     ...item.formFieldCoordinates,
  //                     name: item.windowName,
  //                 }));

  //                 const coordinateOfQuestionField = questionField.map((item) => ({
  //                     ...item.questionWindowCoordinates,
  //                     name: item.windowName,
  //                 }));

  //                 const coordinateOfSkewField = skewField.map((item) => ({
  //                     ...item.layoutWindowCoordinates,
  //                     name: item.windowName,
  //                 }));

  //                 const coordinateOfIdField = idField.layoutCoordinates ?? [];

  //                 // Check if the start value of the ID field's coordinates is not 0
  //                 const shouldIncludeIdField = coordinateOfIdField.start !== 0;

  //                 // Combine all coordinates into a single array, conditionally including the ID field's coordinates
  //                 const allCoordinates = [
  //                     ...coordinateOfFormData,
  //                     ...coordinateOfQuestionField,
  //                     ...coordinateOfSkewField,
  //                     ...(shouldIncludeIdField ? [coordinateOfIdField] : []), // Conditionally include the ID field's coordinates
  //                 ];

  //                 // Format the coordinates for the state update
  //                 const newSelectedFields = allCoordinates.map((item) => {
  //                     const {
  //                         start: startRow,
  //                         left: startCol,
  //                         end: endRow,
  //                         right: endCol,
  //                         name,
  //                         fieldType
  //                     } = item;
  //                     return { startRow, startCol, endRow, endCol, name, fieldType };
  //                 });
  //                 console.log(newSelectedFields)
  //                 // Update state with the formatted coordinates and image data
  //                 setSelectedCoordinates(newSelectedFields);
  //                 setPosition(idField?.imageCoordinates);
  //             }

  //             // const templates = await fetchAllTemplate();
  //             // if (templates === undefined) {
  //             //     toast.error('Error fetching templates');

  //             // }
  //             // const mpObj = templates?.map((item) => {
  //             //     return [{ layoutParameters: item }]
  //             // });
  //             // console.log(mpObj)
  //             // dataCtx.addToAllTemplate(mpObj);
  //         } catch (error) {
  //             console.error("Error fetching layout data:", error);
  //         }
  //     };

  //     // Call the fetch details function
  //     fetchDetails();
  // }, []);
  const fetchDetails = async () => {
    try {
      // Fetch layout data by template ID
      const response = await getLayoutDataById(data.templateId);
      setLayoutFieldData(response);
      if (response) {
        // Extract data from the response
        const formFieldData = response?.formFieldWindowParameters ?? [];
        const questionField = response?.questionsWindowParameters ?? [];
        const skewField = response?.skewMarksWindowParameters ?? [];
        const idField = response?.layoutParameters ?? {};

        // Map and restructure data for coordinates
        const coordinateOfFormData = formFieldData.map((item) => ({
          ...item.formFieldCoordinates,
          name: item.windowName,
        }));

        const coordinateOfQuestionField = questionField.map((item) => ({
          ...item.questionWindowCoordinates,
          name: item.windowName,
        }));

        const coordinateOfSkewField = skewField.map((item) => ({
          ...item.layoutWindowCoordinates,
          name: item.windowName,
        }));

        const coordinateOfIdField = idField.layoutCoordinates ?? [];

        // Check if the start value of the ID field's coordinates is not 0
        const shouldIncludeIdField = coordinateOfIdField.start !== 0;

        // Combine all coordinates into a single array, conditionally including the ID field's coordinates
        const allCoordinates = [
          ...coordinateOfFormData,
          ...coordinateOfQuestionField,
          ...coordinateOfSkewField,
          ...(shouldIncludeIdField ? [coordinateOfIdField] : []), // Conditionally include the ID field's coordinates
        ];

        // Format the coordinates for the state update
        const newSelectedFields = allCoordinates.map((item) => {
          const {
            start: startRow,
            left: startCol,
            end: endRow,
            right: endCol,
            name,
            fieldType,
          } = item;
          return {
            startRow: startRow - 1,
            startCol: startCol,
            endRow: endRow - 1,
            endCol: endCol,
            name: name,
            fieldType: fieldType,
          };
        });
        // Update state with the formatted coordinates and image data
        setSelectedCoordinates(newSelectedFields);
        setPosition(idField?.imageCoordinates);
        return response;
      }

      // const templates = await fetchAllTemplate();
      // if (templates === undefined) {
      //     toast.error('Error fetching templates');

      // }
      // const mpObj = templates?.map((item) => {
      //     return [{ layoutParameters: item }]
      // });
      // console.log(mpObj)
      // dataCtx.addToAllTemplate(mpObj);
    } catch (error) {
      console.error("Error fetching layout data:", error);
    }
  };
  // *****************************************************************************************
  useEffect(() => {
    const runandupdate = async () => {
      setDetailLoader(true);
      const res = await fetchDetails();
      if (res) {
        dataCtx.addFieldToTemplate(res, data.templateIndex);
      }
      setDetailLoader(false);
    };
    runandupdate();
    // if (layoutFieldData) {
    //     if (dataCtx.allTemplates.length > 0) {
    //         dataCtx.addFieldToTemplate(layoutFieldData, data.templateIndex);
    //     }
    // }
  }, []);

  useEffect(() => {
    const classMap = {
      "rounded rectangle": "rounded-rectangle",
      rectangle: "rectangle",
      circle: "circle",
      oval: "oval",
    };

    // Set the class, defaulting to "circle" if bubbleType is not found
    setSelectedClass(classMap[data.bubbleType] || "circle");
  }, [data.bubbleType]);

  useEffect(() => {
    // Create an array to hold the options
    const options = Array.from({ length: +data.totalColumns }, (v, i) => ({
      label: `${idType} ${i + 1}`, // Set the label as 'Col X' where X is the column number
      value: i, // Set the value as the index
    }));

    // Update the state with the new options array
    setOptions(options);
  }, [data.totalColumns, idType]);

  useEffect(() => {
    if (selectedCol.length > 0) {
      const value = selectedCol.map((item) => item.value);
      const arr = Array(+data.totalColumns).fill(0);
      for (let j = 0; j < value.length; j++) {
        arr[value[j]] = 1;
      }
      setIdNumber(arr.join("").toString());
    }
  }, [options, selectedCol]);

  // useEffect(() => {
  //     const handleKeyPress = (event) => {
  //         if (modalShow) return; // Ignore keyboard events when modal is shown
  //         if (event.altKey && event.shiftKey) {
  //             // Toggle z-index when Alt + Enter is pressed
  //             const imgDiv = document.getElementById("imagecontainer");
  //             imgDiv.style.zIndex = imgDiv.style.zIndex === "999" ? "-1" : "999";
  //         }
  //     };

  //     window.addEventListener("keydown", handleKeyPress);

  //     // Cleanup event listener on component unmount
  //     return () => {
  //         window.removeEventListener("keydown", handleKeyPress);
  //     };
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
    if (dragStart && selection) {
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
    let selectedWindowName = "";
    const layoutData = layoutFieldData.layoutParameters;
    if (selectedFieldType === "idField") {
      selectedWindowName = "Id Field";
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
      selectedWindowName = name;
      newData = {
        iFace: +layoutData.iFace ?? 0,
        columnStart: +selection?.startCol,
        columnNumber: +noInCol,
        columnStep: +noOfStepInCol,
        rowStart: +selection?.startRow + 1,
        rowNumber: +noInRow,
        rowStep: +noOfStepInRow,
        iSensitivity: +layoutData.iSensitivity,
        iDifference: +layoutData.iDifference,
        // iOption: +option,
        iReject: +layoutData.iReject,
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
      };
    } else {
      selectedWindowName = name;
      newData = {
        iFace: +layoutData.iFace ?? 0,
        windowName: name,
        columnStart: +selection?.startCol,
        columnNumber: +noInCol,
        columnStep: +noOfStepInCol,
        rowStart: +selection?.startRow + 1,
        rowNumber: +noInRow,
        rowStep: +noOfStepInRow,
        iDirection: +readingDirectionOption,
        iSensitivity: +layoutData.iSensitivity ?? 3,
        iDifference: +layoutData.iDifference ?? 5,
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

    // else {
    //     if (selectedFieldType === "idField") {
    //         selectedWindowName = "Id Field"
    //         newData = {
    //             Coordinate: {
    //                 "Start Row": selection?.startRow,
    //                 "Start Col": selection?.startCol,
    //                 "End Row": selection?.endRow,
    //                 "End Col": selection?.endCol,
    //                 name: "Id Field",
    //                 fieldType: selectedFieldType,
    //             },
    //             imageStructureData: position,
    //             columnStart: +selection?.startCol,
    //             columnNumber: +noInCol,
    //             columnStep: +noOfStepInCol,
    //             rowStart: +selection?.startRow + 1,
    //             rowNumber: +noInRow,
    //             rowStep: +noOfStepInRow,
    //             iDirection: +readingDirectionOption,
    //             idMarksPattern: idNumber.toString(),
    //         };
    //     } else if (selectedFieldType === "skewMarkField") {
    //         selectedWindowName = name
    //         newData = {
    //             iFace: +data.iFace,
    //             columnStart: +selection?.startCol,
    //             columnNumber: +noInCol,
    //             columnStep: +noOfStepInCol,
    //             rowStart: +selection?.startRow + 1,
    //             rowNumber: +noInRow,
    //             rowStep: +noOfStepInRow,
    //             iSensitivity: +data.iSensitivity,
    //             iDifference: +data.iDifference,
    //             iOption: +option,
    //             iReject: +data.iReject,
    //             iDirection: +readingDirectionOption,
    //             windowName: name,
    //             Coordinate: {
    //                 "Start Row": selection?.startRow,
    //                 "Start Col": selection?.startCol,
    //                 "End Row": selection?.endRow,
    //                 "End Col": selection?.endCol,
    //                 name: name,
    //                 fieldType: selectedFieldType,
    //             },
    //             ngAction: windowNgOption,
    //             iMinimumMarks: +minimumMark,
    //             iMaximumMarks: +maximumMark,
    //             skewMark: +skewoption,
    //             iType: type,
    //             // imageStructureData: position,
    //         };
    //     } else {
    //         console.log("update form")
    //         selectedWindowName = name
    //         newData = {
    //             iFace: +data.iFace,
    //             windowName: name,
    //             columnStart: +selection?.startCol,
    //             columnNumber: +noInCol,
    //             columnStep: +noOfStepInCol,
    //             rowStart: +selection?.startRow + 1,
    //             rowNumber: +noInRow,
    //             rowStep: +noOfStepInRow,
    //             iDirection: +readingDirectionOption,
    //             iSensitivity: +data.iSensitivity,
    //             iDifference: +data.iDifference,
    //             iOption: +option,
    //             iMinimumMarks: +minimumMark,
    //             iMaximumMarks: +maximumMark,
    //             iType: type,
    //             ngAction: windowNgOption,
    //             Coordinate: {
    //                 "Start Row": selection?.startRow+1,
    //                 "Start Col": selection?.startCol,
    //                 "End Row": selection?.endRow+1,
    //                 "End Col": selection?.endCol,
    //                 name: name,
    //                 fieldType: selectedFieldType,
    //             },
    //             totalNumberOfFields: numberOfField,
    //             numericOrAlphabets: fieldType,
    //             multipleAllow: multiple,
    //             multipleValue: multipleValue ? multipleValue : "",
    //             blankAllow: blank,
    //             blankValue: blankValue ? blankValue : "",
    //             customFieldValue: customValue ? customValue : ""
    //         };
    //     }
    // }

    // setSelectedCoordinates((prev) => [...prev, newSelected]);//chamnge here
    // setSelection(null);
    setModalShow(false);
    if (!modalUpdate) {
      dataCtx.modifyAllTemplate(data.templateIndex, newData, selectedFieldType);
      const newSelected = {
        ...selection,
        name: selectedFieldType !== "idField" ? name : "Id Field",
        fieldType: selectedFieldType,
      };
      setSelectedCoordinates((prev) => [...prev, newSelected]);
      setSelection(null);
    } else {
      // const updatedValue = {
      //     startRow: selection?.startRow - 1,
      //     startCol: selection?.startCol,
      //     endRow: selection?.endRow - 1,
      //     endCol: selection?.endCol,
      //     name: name,
      //     fieldType: selectedFieldType,
      //   };
      setSelectedCoordinates((item) => {
        // Ensure item is defined and coordinateIndex is valid
        if (!item || coordinateIndex < 0 || coordinateIndex >= item.length) {
          console.error("Invalid coordinate index or item array");
          return item; // Return the unchanged state if validation fails
        }

        const copiedSelectedField = [...item];
        copiedSelectedField[coordinateIndex] = {
          ...copiedSelectedField[coordinateIndex],
          name: selectedWindowName,
          fieldType: selectedFieldType,
        };

        return copiedSelectedField;
      });
      dataCtx.modifyWithRegion(
        data.templateIndex,
        newData,
        selectedFieldType,
        coordinateIndex
      );
      setSelection(null);
    }
  };
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
    setSelectedField(selectedField);
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
    // console.log(data.templateIndex);
    const template = dataCtx.allTemplates[data.templateIndex];
    // console.log(template);
    if (selectedField?.fieldType === "idField") {
      const data = template[0].layoutParameters;
      setSelectedFieldType("idField");
      setWindowNgOption(data?.ngAction);
      setMinimumMark(data?.minimumMark);
      setMaximumMark(data?.maximumMark);
      setNoInRow(data?.rowNumber);
      setNoInCol(data?.columnNumber);
      setNoOfStepInRow(data?.rowStep);
      setNoOfStepInCol(data?.columnStep);
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
      // Find the index of the matched object
      const index = parameters.findIndex((item) =>
        isEqual(item.Coordinate, formattedSelectedFile)
      );
      console.log(index);
      // Get the matched object
      const data = index !== -1 ? parameters[index] : null;
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
      setNoOfStepInRow(data?.rowStep);
      setNoOfStepInCol(data?.columnStep);
      setCustomValue(data?.customFieldValue);
    } else if (selectedField?.fieldType === "formField") {
      const parameters = template[0].formFieldWindowParameters;

      const index = parameters.findIndex((item) =>
        isEqual(item?.Coordinate, formattedSelectedFile)
      );
      const data = index !== -1 ? parameters[index] : null;
      // Get the matched object
      setCoordinateIndex(index);
      setModalUpdate(true);
      setModalShow(true);
      setSelectedFieldType("formField");
      setName(data?.windowName);
      setWindowNgOption(data?.ngAction);
      setMinimumMark(data?.iMaximumMarks);
      setNoOfStepInRow(data?.rowStep);
      setNoOfStepInCol(data?.columnStep);
      setMaximumMark(data?.iMinimumMarks);
      setNoInRow(data?.rowNumber);
      setNoInCol(data?.columnNumber);
      setStartRowInput(formattedSelectedFile["Start Row"] - 2);
      setEndRowInput(formattedSelectedFile["End Row"] - 2);
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
      setCustomValue(data?.customFieldValue);
    } else if (selectedField?.fieldType === "skewMarkField") {
      const parameters = template[0].skewMarksWindowParameters;
      const index = parameters.findIndex((item) =>
        isEqual(item?.Coordinate, formattedSelectedFile)
      );
      // Get the matched object
      const data = index !== -1 ? parameters[index] : null;
      console.log(data);
      setName(data?.windowName);
      setMinimumMark(data?.iMaximumMarks);
      setNoOfStepInRow(data?.rowStep);
      setNoOfStepInCol(data?.columnStep);
      setMaximumMark(data?.iMinimumMarks);
      setNoInRow(data?.rowNumber);
      setNoInCol(data?.columnNumber);
      setReadingDirectionOption(data?.iDirection);
      setType(data?.iType);
      // setOption(data?.iOption);
      setCoordinateIndex(index);
      setModalUpdate(true);
      setModalShow(true);
      setSelectedFieldType("skewMarkField");
      setStartRowInput(formattedSelectedFile["Start Row"]);
      setEndRowInput(formattedSelectedFile["End Row"]);
      setStartColInput(formattedSelectedFile["Start Col"]);
      setEndColInput(formattedSelectedFile["End Col"]);
      setNoOfStepInRow(data?.rowStep);
      setNoOfStepInCol(data?.columnStep);
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
    dataCtx.deleteFieldTemplate(data.templateIndex, formattedSelectedFile);
    resetJson(
      data.numberedExcelJsonFile,
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
    setLoading(true);
    // Retrieve the selected template
    const template = dataCtx.allTemplates[data.templateIndex];

    // Extract layout parameters and its coordinates
    const layoutParameters = template[0].layoutParameters;
    layoutParameters.id = data.templateId;
    const Coordinate = layoutParameters.Coordinate;
    let layoutCoordinates = {};
    // Transform layout coordinates into the required format
    if (Coordinate) {
      layoutCoordinates = {
        right: Coordinate["End Col"],
        end: Coordinate["End Row"],
        left: Coordinate["Start Col"],
        start: Coordinate["Start Row"],
        fieldType: Coordinate["fieldType"],
        name: Coordinate["name"],
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
            fieldType: Coordinate["fieldType"],
            name: Coordinate["name"],
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
            fieldType: Coordinate["fieldType"],
            name: Coordinate["name"],
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
            fieldType: Coordinate["fieldType"],
            name: Coordinate["name"],
          }
          : {};
        return { ...rest, formFieldCoordinates };
      });

    // Assemble the full request data
    const fullRequestData = {
      layoutParameters: updatedLayout,
      barcodeData,
      imageData,
      printingData,
      questionsWindowParameters,
      skewMarksWindowParameters,
      formFieldWindowParameters,
    };
    console.log(fullRequestData);
    // Send the request and handle the response
    const imageFile = base64ToFile(data.templateImagePath.image, "front.jpg");
    const backImageFile = base64ToFile(
      data.templateBackImagePath.image,
      "back.jpg"
    );
    const csv = Papa.unparse(data.excelJsonFile);
    // Create a Blob from the CSV string
    const blob = new Blob([csv], { type: "text/csv" });

    // Create a File object from the Blob
    const csvfile = new File([blob], "data.csv", { type: "text/csv" });
    try {
      const response2 = await getUrls();
      const GetDataURL = response2.DELETE_TEMPLATE;
      const deleteTemplat = await axios.delete(
        `${GetDataURL}?Id=${data.templateId}`
      );
    } catch (error) {
      console.log(error);
    }

    try {

      const res = await createTemplate(fullRequestData);
      if (res.success === true) {
        const layoutId = res?.layoutId;
        const formdata = new FormData();
        formdata.append("LayoutId", layoutId);
        formdata.append("FrontImageFile", imageFile);
        formdata.append("BackImageFile", backImageFile);
        formdata.append("ExcelFile", csvfile);
        const res2 = await sendFile(formdata);
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
    }
  };
  const handleImage = (images) => {
    setImagesSelectedCount(images.length);
  };
  const handleMouseDown2 = useCallback((index, e) => {
    const rect = divRefs.current[index].getBoundingClientRect();
    setDraggingIndex(index);
    setDragStart2({ x: e.clientX, y: e.clientY });
    setDragOffset({ left: e.clientX - rect.left, top: e.clientY - rect.top });
  }, []);
  console.log();
  const sensitivityHandler = (num) => {
    console.log(num);
  };
  const saveRegion = (pitchValue, value) => {
    try {
      if (!value) {
        alert("Please select Position.");
      }
      if (!pitchValue) {
        alert("Pitch value cannot be blank.");
      }
      let object = { ...selectedField };

      const stCol = object.startCol;
      const stRow = object.startRow;
      const edCol = object.endCol;
      const edRow = object.endRow;

      // Define the boundaries
      const MIN_COL = 0;
      const MAX_COL = numCols; // Replace with your maximum column value
      const MIN_ROW = 0;
      const MAX_ROW = numRows; // Replace with your maximum row value
      const template = dataCtx.allTemplates[data.templateIndex];
      const formattedSelectedFile = {
        "End Col": selectedField.endCol,
        "End Row": selectedField.endRow + 1,
        "Start Col": selectedField.startCol,
        "Start Row": selectedField.startRow + 1,
        fieldType: selectedField.fieldType,
        name: selectedField.name,
      };
      switch (value) {
        case "end":
          if (edCol + +pitchValue > MAX_COL) {
            alert("Out of bound Error: Column exceeds maximum limit.");
            return;
          }
          switch (object.fieldType) {
            case "questionField":
              const parameters = template[0].questionsWindowParameters;
              // Find the index of the matched object
              const index = parameters.findIndex((item) =>
                isEqual(item.Coordinate, formattedSelectedFile)
              );
              console.log(index);
              // Get the matched object
              const data = index !== -1 ? parameters[index] : null;
              console.log(data);
          }
          object.startCol += +pitchValue;
          object.endCol += +pitchValue;
          break;

        case "top":
          if (stRow - pitchValue < MIN_ROW) {
            alert("Out of bound Error: Row exceeds minimum limit.");
            return;
          }
          object.startRow -= +pitchValue;
          object.endRow -= +pitchValue;
          break;

        case "bottom":
          if (edRow + +pitchValue > MAX_ROW) {
            alert("Out of bound Error: Row exceeds maximum limit.");
            return;
          }
          object.startRow += +pitchValue;
          object.endRow += +pitchValue;
          break;

        case "start":
          if (stCol - pitchValue < MIN_COL) {
            alert("Out of bound Error: Column exceeds minimum limit.");
            return;
          }
          object.startCol -= +pitchValue;
          object.endCol -= +pitchValue;
          break;

        default:
          alert("Invalid direction.");
          break;
      }

      console.log(pitchValue, value);
      console.log(selectedField);
      console.log(object);

      const layoutData = layoutFieldData.layoutParameters;
      let newData = {};
      let selectedWindowName = "";
      if (selectedField.fieldType === "idField") {
        selectedWindowName = "Id Field";
        newData = {
          Coordinate: {
            "Start Row": object?.startRow + 1,
            "Start Col": object?.startCol,
            "End Row": object?.endRow + 1,
            "End Col": object?.endCol,
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
      } else if (selectedField.fieldType === "skewMarkField") {
        selectedWindowName = name;
        newData = {
          iFace: +layoutData.iFace ?? 0,
          columnStart: +selection?.startCol,
          columnNumber: +noInCol,
          columnStep: +noOfStepInCol,
          rowStart: +selection?.startRow + 1,
          rowNumber: +noInRow,
          rowStep: +noOfStepInRow,
          iSensitivity: +layoutData.iSensitivity,
          iDifference: +layoutData.iDifference,
          // iOption: +option,
          iReject: +layoutData.iReject,
          iDirection: +readingDirectionOption,
          windowName: name,
          Coordinate: {
            "Start Row": object?.startRow + 1,
            "Start Col": object?.startCol,
            "End Row": object?.endRow + 1,
            "End Col": object?.endCol,
            name: name,
            fieldType: selectedFieldType,
          },
          ngAction: windowNgOption,
          iMinimumMarks: +minimumMark,
          iMaximumMarks: +maximumMark,
          skewMark: +skewoption,
          iType: type,
        };
      } else {
        selectedWindowName = name;
        newData = {
          iFace: +layoutData.iFace ?? 0,
          windowName: name,
          columnStart: +selection?.startCol,
          columnNumber: +noInCol,
          columnStep: +noOfStepInCol,
          rowStart: +selection?.startRow + 1,
          rowNumber: +noInRow,
          rowStep: +noOfStepInRow,
          iDirection: +readingDirectionOption,
          iSensitivity: +layoutData.iSensitivity ?? 3,
          iDifference: +layoutData.iDifference ?? 5,
          // iOption: +option,
          iMinimumMarks: +minimumMark,
          iMaximumMarks: +maximumMark,
          iType: type,
          ngAction: windowNgOption,
          Coordinate: {
            "Start Row": object?.startRow + 1,
            "Start Col": object?.startCol,
            "End Row": object?.endRow + 1,
            "End Col": object?.endCol,
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
      dataCtx.modifyAllTemplate(data.templateIndex, newData, selectedField.fieldType);
      setSelectedCoordinates((prev) => {
        return [...prev, object];
      });
      console.log(newData);
      setSelection(null);
      // console.log(selectedCoordinates)
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 99 }}>
        <SmallHeader />
      </div>

      {detailLoader && (
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
            <TextLoader message={"Loading Data, Please wait..."} />
          </div>
        </div>
      )}
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.9)", // Slightly opaque background
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            pointerEvents: "auto", // Make the overlay not clickable
          }}
        >
          <div style={{ height: "50%" }}>
            <TextLoader message={"Updating, Please wait..."} />
          </div>
        </div>
      )}
      {/* <div
        style={{
          position: "absolute",
          top: "30px", // Adjust the top value as needed
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: "999",
        }}
      >
        <Button
          variant="primary"
          onClick={() => {
            setImageModalShow(true);
          }}
          // style={{ position: "relative" }}
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
            {imagesSelectedCount} 
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
      </div> */}
      <div
        style={{
          position: isWideScreen ? "fixed" : "absolute",
          top: "30px",
          left: isWideScreen ? "50%" : "10%",
          transform: isWideScreen ? "translateX(-50%)" : "none",
          zIndex: "999",
        }}
      >
        <Container fluid>
          <Row className="justify-content-center">
            <Col xs="auto">
              <Button
                variant="primary"
                onClick={() => {
                  setImageModalShow(true);
                }}
                className="position-relative"
              >
                Image Area
                <Badge
                  pill
                  variant="light"
                  className="position-absolute"
                  style={{
                    top: "-5px",
                    right: "-5px",
                    transform: "translate(50%, -50%)",
                  }}
                >
                  {imagesSelectedCount}
                </Badge>
              </Button>
            </Col>
            <Col xs="auto">
              <Button
                variant="secondary"
                onClick={() => {
                  setDetailPage(true);
                }}
              >
                Layout details
              </Button>
            </Col>
          </Row>
        </Container>
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

      <div style={{ overflow: "auto" }}>
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
          {!loading ? "Update" : "Updating"}
        </Button>
        <div className="main-container">
          <div className="containers">
            <div className="d-flex" style={{ overflow: "auto" }}>
              <div style={{ marginRight: "1rem", position: "sticky" }}>
                <div className="top"></div>
                {Array.from({ length: numRows }).map((_, rowIndex) => (
                  <div key={rowIndex} className="row">
                    <div
                      className={
                        data.bubbleType === "circle"
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
                <div
                  className="top-row"
                  style={{
                    position: "",
                    top: 120,
                    zIndex: 10,
                    backgroundColor: "white",
                  }}
                >
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
                    width: "max-content",
                  }}
                >
                  <div
                    className="grid"
                    ref={imageRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                  // onTouchStart={handleMouseDown}
                  // onTouchEnd={handleMouseUp}
                  // onTouchMove={handleMouseMove}
                  >
                    {Array.from({ length: numRows }).map((_, rowIndex) => {
                      const result = [...data.excelJsonFile.map(Object.values)];
                      const numberedJson = [
                        ...data.numberedExcelJsonFile.map(Object.values),
                      ];
                      return (
                        <div
                          key={rowIndex}
                          className="row"
                          style={{ overflowX: "auto", position: "relative" }}
                        >
                          <div
                            className={
                              data.bubbleType === "circle"
                                ? "left-num-circle"
                                : "left-num"
                            }
                            style={{
                              position: "sticky",
                              position: "-webkit-sticky",
                            }}
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

                              const value = result[rowIndex][colIndex];

                              // Initialize bgColor
                              let bgColor = "";

                              // Calculate bgColor based on shades
                              if (
                                value !== undefined &&
                                value >= sensitivity &&
                                value !== 0
                              ) {
                                const maxValue = Math.max(...result.flat()); // Calculate maxValue dynamically
                                const shadeIndex = Math.min(
                                  Math.floor((value / maxValue) * 15),
                                  15
                                ); // Map value to shades
                                bgColor = shades[shadeIndex];
                              } else if (num || num === 0) {
                                bgColor = "lightgreen"; // Override to lightgreen if num exists
                              }

                              // Font color logic
                              let fontColor =
                                rowIndex < result.length &&
                                  colIndex < result[rowIndex].length &&
                                  value != 0 &&
                                  value !== undefined
                                  ? "lightgray"
                                  : "black";
                              if (num === 0) {
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
                                      data.bubbleType === "circle"
                                        ? "12px"
                                        : "8px",
                                    color: fontColor,
                                    userSelect: "none",
                                  }}
                                  className={`${data.bubbleType} ${selected[`${rowIndex},${colIndex}`]
                                    ? "selected"
                                    : ""
                                    }`}
                                >
                                  {(numberedJson[rowIndex] &&
                                    numberedJson[rowIndex][colIndex]) !==
                                    undefined
                                    ? numberedJson[rowIndex][colIndex]
                                    : null}
                                </div>
                              );
                            }
                          )}
                          {/* {Array.from({ length: numCols }).map(
                            (_, colIndex) => {
                              const num =
                                (numberedJson[rowIndex] &&
                                  numberedJson[rowIndex][colIndex]) !==
                                  undefined
                                  ? numberedJson[rowIndex][colIndex]
                                  : null;
                              let bgColor =
                                result[rowIndex][colIndex] != 0 &&  result[rowIndex][colIndex] >= sensitivity &&
                                  result[rowIndex][colIndex] !== undefined
                                  ? "black"
                                  : "";
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
                                      data.bubbleType === "circle"
                                        ? "12px"
                                        : "8px",
                                    color: fontColor,
                                    userSelect: "none",
                                  }}
                                  className={`${data.bubbleType} ${selected[`${rowIndex},${colIndex}`]
                                    ? "selected"
                                    : ""
                                    }`}
                                >
                                  {(numberedJson[rowIndex] &&
                                    numberedJson[rowIndex][colIndex]) !==
                                    undefined
                                    ? numberedJson[rowIndex][colIndex]
                                    : null}
                                </div>
                              );
                            }
                          )} */}
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
                          left: `${data.startCol *
                            (imageRef.current.getBoundingClientRect().width /
                              numCols) -
                            4
                            }px`,
                          top: `${data.startRow *
                            (imageRef.current.getBoundingClientRect().height /
                              numRows) -
                            3
                            }px`,
                          width: `${(data.endCol - data.startCol + 1) *
                            (imageRef.current.getBoundingClientRect().width /
                              numCols)
                            }px`,
                          height: `${(data.endRow - data.startRow + 1) *
                            (imageRef.current.getBoundingClientRect().height /
                              numRows +
                              0.1)
                            }px`,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      // onMouseDown={(e) => handleMouseDown2(index, e)}
                      >
                        <div
                          className="d-flex justify-content-between align-items-center bg-dark text-white p-1"
                          style={{
                            opacity: 0.6,
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
                              <span
                                className="user-select-none"
                                style={{ color: "white", fontWeight: "700" }}
                              >
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
                          left: `${selection.startCol *
                            (imageRef.current.getBoundingClientRect().width /
                              numCols) -
                            4
                            }px`,
                          top: `${selection.startRow *
                            (imageRef.current.getBoundingClientRect().height /
                              numRows) -
                            3
                            }px`,
                          width: `${(selection.endCol - selection.startCol + 1) *
                            (imageRef.current.getBoundingClientRect().width /
                              numCols)
                            }px`,
                          height: `${(selection.endRow - selection.startRow + 1) *
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
            {!modalUpdate && (
              <Row className="mb-2">
                <label
                  htmlFor="example-text-input"
                  className="col-md-2 col-form-label"
                ></label>
                <Col md={2} className="d-flex align-items-center">
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
                    className=" field-label"
                  />
                </Col>
                <Col md={2} className="d-flex align-items-center">
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
                    className=" field-label"
                  />
                </Col>
                <Col md={3} className="d-flex align-items-center">
                  <label
                    htmlFor="skewMarkField"
                    className="mr-2 mb-0 field-label"
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
                    className=" field-label"
                  />
                </Col>
                <Col md={2} className="d-flex align-items-center">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div>
                      <label
                        htmlFor="idField"
                        className="mr-2 mb-0 field-label"
                      >
                        ID Mark :
                      </label>
                      <input
                        id="idField"
                        type="radio"
                        name="fieldType"
                        value="idField"
                        checked={selectedFieldType === "idField"}
                        onChange={handleRadioChange}
                        className="field-label"
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
          {selectedFieldType !== "idField" && (
            <Row className="mb-2">
              <label
                htmlFor="example-text-input"
                className="col-md-2 col-form-label "
                style={{ fontSize: "1rem" }}
              >
                Name
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
                <div className={multiple !== "allow" ? "col-md-4" : "col-md-10"}>
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
                    <label htmlFor="example-text-input" className="col-md-2 col-form-label">
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
                  type="number"
                  className="form-control"
                  placeholder="Enter the minimum mark"
                  value={minimumMark}
                  onChange={(e) => setMinimumMark(e.target.value)}
                  onWheel={(e) => e.preventDefault()}
                  min={0}
                  required
                />
              </div>
              <label htmlFor="example-select-input" className="col-md-2 ">
                Maximum Mark
              </label>
              <div className="col-md-4">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter the maximum mark"
                  value={maximumMark}
                  onChange={(e) => setMaximumMark(e.target.value)}
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
            <label htmlFor="example-select-input" className="col-2 ">
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
                type="number"
                className="form-control"
                value={noInCol}
                onChange={(e) => setNoInCol(e.target.value)}
                required
              />
            </div>
            <label htmlFor="example-select-input" className="col-2 ">
              Total Step In A Column
            </label>
            <div className="col-4">
              <input
                type="number"
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
            <div className="col-4">
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
                <option value="1">From the upper right to the bottom </option>
                <option value="2">From the lower left to a top</option>
                <option value="3">From the lower right to a top</option>
                <option value="4">From the upper left to right</option>
                <option value="5">From the upper right to the left</option>
                <option value="6">From the lower left to right</option>
                <option value="7">From the lower right to the left </option>
              </select>
            </div>

            {selectedFieldType !== "idField" && (
              < >
                <label
                  htmlFor="example-text-input"
                  className="col-md-2 col-form-label"
                >
                  Type :
                </label>
                <div className="col-md-4">
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
                    <option value="4">Range checking (ascending order)</option>
                    <option value="5">Range checking (descending order)</option>
                    <option value="6">Range checking (not order) </option>
                    <option value="7">Mask setting(common to partition)</option>
                  </select>
                </div>

              </>
            )}
          </Row>

          {(selectedFieldType === "questionField" ||
            selectedFieldType === "formField") && (
              <Row className="mb-2">
                <label
                  htmlFor="example-text-input"
                  className="col-md-2 col-form-label "
                >
                  Total Options :
                </label>
                <div className="col-4 ">
                  <input
                    type="number"
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
                    <option value="binary">Litho code</option>
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
        </Modal.Body>
        <Modal.Footer
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button
            onClick={() => {
              setModalShow(false);
            }}
            variant="warning"
          >
            Hide Modal
          </Button>

          {modalUpdate && (
            <>
              <Tooltip title="Delete" placement="top">
                <IconButton
                  aria-label="delete"
                  onClick={() => {
                    handleCrossClick(selectedField, coordinateIndex);
                    setModalShow(false);
                    setSelection(null);
                  }}
                  color="secondary"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>

              <Tooltip
                title="Copy Field"
                placement="top"
                onClick={() => {
                  setShowCopy(true);
                }}
              >
                <IconButton aria-label="copy" color="primary">
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
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
          <EditImageCropper
            handleImage={handleImage}
            imageSrc={data.templateImagePath?.image}
            backImageSrc={data.templateBackImagePath?.image}
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
            // onClick={saveHandler}
            onClick={() => setImageModalShow(false)}
            className="waves-effect waves-light"
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      {detailPage && (
        <EditTemplateModal
          show={detailPage}
          templateId={data.templateId}
          layoutData={dataCtx.allTemplates[data.templateIndex][0]}
          onHide={() => setDetailPage(false)}
          sensitivityHandler={sensitivityHandler}
        />
      )}

      {showCopy && (
        <CopyModal
          show={showCopy}
          onHide={() => {
            setShowCopy(false);
          }}
          saveRegion={saveRegion}
        />
      )}
    </>
  );
};

export default EditDesignTemplate;
