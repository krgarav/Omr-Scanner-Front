import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  Button,
  Nav,
  Form,
  Tab,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import {
  IdOptionData,
  rejectData,
  sizeData,
  bubbleData,
  barcodeOptionData,
  windowNgData,
  faceData,
  directionData,
  barcodeTypeData,
  colorTypeData,
  encodingOptionData,
  rotationOptionData,
  resolutionOptionData,
  scanningSideData,
  imageStatusData,
  barcodeCategoryData,
  code39OrItfCheckDigitData,
  nw7CheckDigitData,
  upcaOptionData,
  upceOptionData,
  barcodeRejectData,
  printOptionData,
  printModeOption,
  printCustomOption,
  printOrientationOption,
} from "data/helperData";
import DataContext from "store/DataContext";
import Select, { components } from "react-select";
import { useNavigate } from "react-router-dom";
import ShadesOfGrey from "./shadesOfGrey";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import ImageSelection from "./imageSelection";
import { getScannedImage } from "helper/TemplateHelper";
import { toast } from "react-toastify";
import Jobcard from "./Jobcard";
import DuplexJob from "./DuplexJob";
import Papa from "papaparse";
import { getSampleData } from "helper/TemplateHelper";
import { v4 as uuidv4 } from "uuid";
import base64ToFile from "services/Base64toFile";

const LayoutDetailModal = (props) => {
  const [modalShow, setModalShow] = useState(false);
  const [name, setName] = useState("");
  const [size, setSize] = useState({ id: 1, name: "A4" });
  const [numberOfLines, setNumberOfLines] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [backImageSrc, setBackImageSrc] = useState("");
  const [sensitivity, setSensitivity] = useState(1);
  const [difference, setDifference] = useState("");
  const [barCount, setBarCount] = useState(0);
  const [selectedBubble, setSelectedBubble] = useState({});
  const [reject, setReject] = useState({ id: 1, name: "0", showName: "False" });
  const [numberOfFrontSideColumn, setNumberOfFrontSideColumn] = useState("");
  const [windowNgOption, setWindowNgOption] = useState({
    id: "0x00000001",
    name: "SKDV_ACTION_SELECT(0x00000001)",
    showName: "Paper ejection to select stacker",
  });
  const [face, setFace] = useState({ id: 0, name: "Front Side" });
  const [direction, setDirection] = useState();
  const [toggle, settoggle] = useState({});
  const [activeKey, setActiveKey] = useState("general");
  const [spanDisplay, setSpanDisplay] = useState("none");
  const dataCtx = useContext(DataContext);
  const [colorType, setColorType] = useState();
  const [encoding, setEncoding] = useState();
  const [rotation, setRotation] = useState();
  const [resolution, setResolution] = useState();
  const [scannningSide, setScanningSide] = useState();
  const [imageStatus, setImageStatus] = useState(imageStatusData[0]);
  const [barcodeType, setBarcodeType] = useState({});
  const [barcodeCategory, setBarcodeCategory] = useState({});
  const [barcodeRejectStatus, setBarcodeRejectStatus] = useState(
    barcodeRejectData[1]
  );
  const [checkDigit, setCheckDigit] = useState(null);
  const [barcodeRightPos, setBarcodeRightPos] = useState();
  const [barcodeLeftPos, setBarcodeLeftPos] = useState();
  const [barcodeTopPos, setBarcodeTopPos] = useState();
  const [barcodeBottomPos, setBarcodeBottomPos] = useState();
  const [option, setOption] = useState(null);
  const [imageFile, setImageFile] = useState();
  const [imageModal, setImageModal] = useState();
  const [image, setImage] = useState();
  const [imageTempFile, setTempImageFile] = useState();
  const [imageBack, setImageBack] = useState();
  const [selectedUI, setSelectedUI] = useState("SIMPLEX");
  const [activeTab, setActiveTab] = useState("simplex");
  const [barcodeEnable, setBarcodeEnable] = useState({
    id: "disable",
    name: "Disable",
  });
  const [idPresent, setIdPresent] = useState();
  const [fileModal, setFileModal] = useState(false);
  const [excelJsonFile, setExcelJsonFile] = useState();
  const [printEnable, setPrintEnable] = useState({
    id: "0",
    name: "Not Enable",
  });
  const [printOrientation, setPrintOrientation] = useState();
  const [printMode, setPrintMode] = useState();
  const [printCustom, setPrintCustom] = useState({ id: "date", name: "Date" });
  const [startPosition, setStartPosition] = useState(null);
  const [fontSpace, setFontSpace] = useState(null);
  const [printDigit, setPrintDigit] = useState(null);
  const [printStartNumber, setPrintStartNumber] = useState(null);
  const [printCustomValue, setPrintCustomValue] = useState(null);
  const [scannerLoading, setScannerLoading] = useState(false);
  const jobHandler = (e) => {
    setSelectedUI(e);
  };
  const handleSelect = (selectedKey) => {
    console.log(selectedKey);
    setActiveTab(selectedKey);
  };
  const imageModalHandler = () => {
    setImageModal(true);
  };

  const resetModalHandler = () => {
    settoggle({});
    // setModalShow(false);
    setName("");
    // setSize({ id: 1, name: "A4" });
    // setNumberOfLines("");
    // setImageSrc("/img.jpg");
    // setSensitivity(1);
    setDifference("");
    setBarCount(0);
    setSelectedBubble({});
    setReject(undefined);
    setNumberOfFrontSideColumn("");
    setWindowNgOption("");
    setFace("");
    setDirection(undefined);
    // setActiveKey("general");
    // setSpanDisplay("none");
    // setColorType(undefined);
    // setEncoding(undefined);
    // setRotation(undefined);
    // setResolution(undefined);
    // setScanningSide(undefined);
    // setImageStatus(imageStatusData[0]);
    // setBarcodeReadingArea(undefined);
    // setBarcodeType({});
    // setBarcodeCategory({});
    // setBarcodeRejectStatus(barcodeRejectData[1]);
    // setCheckDigit(null);
    // setBarcodeRightPos(undefined);
    // setBarcodeLeftPos(undefined);
    // setBarcodeTopPos(undefined);
    // setBarcodeBottomPos(undefined);
    // setOption(null);
    // setSelected([]);
    // setSelectedColumn(null);
    // setValues(Array(48).fill(0));
    // setOptions([]);
    // setColIdPattern(undefined);
    // setIdNumber("");
    // setImageFile(undefined);
    // setImageModal(undefined);
    // setImage(undefined);
    // setTempImageFile(undefined);
    // setSelectedUI("");
    setActiveTab("simplex");
    setBarcodeEnable({ id: "disable", name: "Disable" });
    // setImageUrl("");
    // setIdPresent("");
    // createTemplateHandler();
  };
  //   useEffect(() => {
  //     const storedFile = localStorage.getItem("Template");
  //     if (storedFile) {
  //       setExcelJsonFile(JSON.parse(storedFile));
  //     }
  //     const templateFrontImage = sessionStorage.getItem("templateImagePath");
  //     setImageSrc(JSON.parse(templateFrontImage).image);
  //     const templateBackImage = sessionStorage.getItem("templateBackImagePath");

  //     setBackImageSrc(JSON.parse(templateBackImage).image);
  //   }, []);
  useEffect(() => {
    if (props.show) {
      setModalShow(true);
    } else {
      setModalShow(false);
    }
  }, [props.show]);
  // *****************************************************************************************
  const comparewithId = (optiondata, optionvalue) => {
    const filter = optiondata.find((item) => item.id === optionvalue);
    return filter;
  };
  const comparewithName = (optiondata, optionvalue) => {
    const filter = optiondata.find((item) => item.name === optionvalue);
    return filter;
  };

  useEffect(() => {
    const runandupdate = async () => {
      console.log(props.layoutData);
      const layoutData = props.layoutData;
      if (layoutData) {
        const layout = layoutData?.layoutParameters;
        const printData = layoutData?.printingData;
        const barcodeData = layoutData?.barcodeData;
        const imageData = layoutData?.imageData;
      
        if (layout) {
          setName(layout.layoutName);
          setNumberOfLines(layout.timingMarks);
          setNumberOfFrontSideColumn(layout.totalColumns);

          if (layout.idStatus=== "not present") {
            const filter = IdOptionData[1];
            setIdPresent(filter);
          } else {
            const filter = IdOptionData[0];
            setIdPresent(filter);
            setFace(comparewithId(faceData, layout.iFace))
            setWindowNgOption(comparewithId(windowNgData, layout.ngAction));
          }
          if (layout.barcodeCount !== 0) {
            setBarcodeEnable(barcodeOptionData[0])
            setBarCount(layout.barcodeCount);
            setBarcodeCategory(comparewithId(barcodeCategoryData, barcodeData.readFrom));
            // setBarcodeRejectStatus(comparewithId(barcodeRejectData,barcodeData.))
            setBarcodeType(comparewithId(barcodeTypeData, barcodeData.barcodeType));
            setBarcodeBottomPos(barcodeData.barcodeBottomPos)
            setBarcodeTopPos(barcodeData.barcodeTopPos);
            setBarcodeLeftPos(barcodeData.barcodeLeftPos);
            setBarcodeRightPos(barcodeData.barcodeRightPos);
            if(barcodeData.barcodeType === "0x1U") {
              setCheckDigit(comparewithId(code39OrItfCheckDigitData, barcodeData.barcodeCheckDigit));
            } else {
              setCheckDigit(comparewithId(nw7CheckDigitData, barcodeData.barcodeCheckDigit));
            }
          }
          setSelectedBubble(comparewithName(bubbleData, layout.bubbleType));
          setSensitivity(layout.iSensitivity);
          setDifference(layout.iDifference);
          setImage(layout.templateImagePath);
          setDirection(comparewithId(directionData, layout.dataReadDirection));
          setBackImageSrc(layout.templateBackImagePath);
          setImageSrc(layout.templateImagePath);
          setImage(layout.templateImagePath);
          
          setExcelJsonFile(layout.excelJsonFile);
          if(printData.printEnable){
            setPrintEnable(printOptionData[0])
            setStartPosition(printData.printStartPos);
            setFontSpace(printData.printFontSpace);
            setPrintDigit(printData.printDigit);
            setPrintStartNumber(printData.printStartNumber);
            setPrintOrientation(comparewithId(printOrientationOption,printData.printOrientation));
            setPrintMode(comparewithId(printModeOption,printData.printMode));
            setPrintCustom(comparewithId(printCustomOption,printData.customType))
            setPrintCustomValue(printData.customValue);
            setImageStatus(comparewithId(imageStatusData,imageData.imageEnable))
          }
          
          if(imageData.imageEnable){
            setColorType(comparewithId(colorTypeData,imageData.imageColor));
            setEncoding(comparewithId(encodingOptionData,imageData.imageType));
            setRotation(comparewithId(rotationOptionData,imageData.imageRotation));
            setResolution(comparewithId(resolutionOptionData,imageData.imageResolution))
            // setScanningSide(comparewithId(scanningSideData,imageData))
          }
        }
      }
      // dataCtx.addFieldToTemplate(res, data.templateIndex);
    };
    runandupdate();
  }, [props.onHide]);

  const Option = (props) => {
    return (
      <components.Option {...props}>
        {props.data.icon && (
          <span style={{ marginRight: 8 }}>{props.data.icon}</span>
        )}
        {props.data.name}
      </components.Option>
    );
  };
  const SingleValue = (prop) => {
    return (
      <components.SingleValue {...prop}>
        {prop.data.icon && (
          <span style={{ marginRight: 8 }}>{prop.data.icon}</span>
        )}
        {prop.data.name}
      </components.SingleValue>
    );
  };
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const json = results.data;
          const Row = json.length;
          const Column = Object.keys(json[1]).length;
          console.log(Object.values(json[1]));
          setNumberOfLines(Row);
          setNumberOfFrontSideColumn(Column);
          setExcelJsonFile(json);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log(reader.result);
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
    if (file) {
      setImage(URL.createObjectURL(file));
      setTempImageFile(file);
    }
  };

  const handleImage2Upload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
    if (file) {
      setImageBack(URL.createObjectURL(file));
      // setTempImageFile(file);
    }
  };
  const validatePrintField = () => {
    const errors = {
      startPosition: "Printing start position cannot be empty",
      fontSpace: "Font space cannot be empty",
      printDigit: "Printing digit cannot be empty",

      printStartNumber: "Printing start number cannot be empty",
      printOrientation: "Please select print orientation",
      printMode: "Please select printing mode",
    };

    for (let [field, errorMsg] of Object.entries(errors)) {
      if (!eval(field)) {
        toast.error(errorMsg);
        return false;
      }
    }
    return true;
  };

  const createTemplateHandler = async () => {
    if (printEnable.id !== "0") {
      if (!validatePrintField()) {
        return;
      }
    }

    settoggle((prevData) => ({
      ...prevData,
      name: !name ? true : prevData.name,
      row: !numberOfLines ? true : prevData.row,
      col: !numberOfFrontSideColumn ? true : prevData.col,
      barcode: !barCount ? true : prevData.barcode,
      ID: !idPresent ? true : prevData.idPresent,
      numberOfLines: !numberOfLines ? true : prevData.numberOfLines,
      barcodeEnable: !barcodeEnable ? true : prevData.barcodeEnable,
      bubbleVariant: Object.values(selectedBubble).length == 0 ? true : false,
      Rejected: !reject ? true : prevData.Rejected,
      difference: difference.length == 0 ? true : prevData.difference,
      face: face.length == 0 ? true : prevData.face,
      direction: !direction ? true : prevData.direction,
      windowNgOption:
        Object.values(windowNgOption).length == 0
          ? true
          : prevData.windowNgOption,
    }));
    if (!name) {
      toast.error("Name Field can not be empty");
      return;
    }
    if (!numberOfLines) {
      toast.error("Row can not be empty");
      return;
    }
    if (!numberOfFrontSideColumn) {
      toast.error("Columns can not be empty");
      return;
    }

    if (!idPresent) {
      toast.error("Please Select ID Field ");
      return;
    }
    if (idPresent.id === "present") {
      if (!face) {
        toast.error("Please Select Id Mark");
        return;
      }
    }

    if (Object.values(selectedBubble).length == 0) {
      toast.error("Please Select Bubble Variant");
      return;
    }
    if (idPresent.id === "present") {
      if (Object.values(windowNgOption).length == 0) {
        toast.error("Please Select WindowNg");
        return;
      }
    }
    if (idPresent.id === "present") {
      if (!reject) {
        toast.error("Please Select a Value in Rejected Field");
        return;
      }
    }
    if (barCount.length === 0) {
      toast.error("Barcode Field can not be empty");
      return;
    }
    if (difference.length === 0) {
      toast.error("Difference can not be empty");
      return;
    }
    if (!direction) {
      toast.error("Please Select Page Position");
      return;
    }

    try {
      const templateData = [
        {
          layoutParameters: {
            layoutName: name,
            timingMarks: +numberOfLines,
            barcodeCount: +barCount,
            iFace: +face.id ?? 0,
            totalColumns: +numberOfFrontSideColumn,
            bubbleType: selectedBubble?.name,
            templateImagePath: imageSrc,
            templateBackImagePath: backImageSrc,
            iSensitivity: +sensitivity,
            iDifference: +difference,
            ngAction: windowNgOption?.id,
            dataReadDirection: direction?.id,
            iReject: 1,
            excelJsonFile: excelJsonFile,
          },
          barcodeData: {
            barcodeSide: 0,
            barcodeColor: 0,
            barcodeType: barcodeType?.id ? barcodeType?.id : "",
            barcodeCheckDigit: checkDigit !== null ? +checkDigit?.id : 0,
            barcodeOption: option !== null ? +option?.id : 0,
            barcodeRightPos: barcodeRightPos ? +barcodeRightPos : 0,
            barcodeLeftPos: barcodeLeftPos ? +barcodeLeftPos : 0,
            barcodeTopPos: barcodeTopPos ? +barcodeTopPos : 0,
            barcodeBottomPos: barcodeBottomPos ? +barcodeBottomPos : 0,
            readFrom : barcodeCategory?.id===undefined?"":barcodeCategory?.id
          },
          imageData: {
            imageEnable: imageStatus ? +imageStatus?.id : 0,
            imageColor: colorType ? +colorType?.id : 0,
            imageType: encoding ? +encoding?.id : 0,
            imageParam: 0,
            imageRotation: rotation ? +rotation?.id : 0,
            imageResoMode: 1,
            imageResolution: resolution ? +resolution?.id : 1,
          },
          printingData: {
            printEnable: +printEnable?.id ?? 0,
            printStartPos: +startPosition ?? 0,
            printDigit: +printDigit ?? 0,
            printStartNumber: +printStartNumber ?? 0,
            printOrientation:
              printOrientation?.id === undefined ? 0 : +printOrientation?.id,
            printFontSize: 0,
            printFontSpace: +fontSpace ?? 0,
            printMode: printMode?.id === undefined ? 0 : +printMode?.id,
            customType: printCustom?.id === undefined ? "" : printCustom?.id,
            customValue: printCustomValue ? printCustomValue : "",
          },
        },
      ];
      const layoutDataKey = props.layoutData.layoutParameters.key;
      const templateIndex = dataCtx.allTemplates.findIndex(
        (item) => item[0].layoutParameters?.key === layoutDataKey
      );
    
   
      dataCtx.updateLayoutParameter(templateIndex, templateData[0]);
      localStorage.setItem("Template", JSON.stringify(templateData));
      props.onHide();
    } catch (error) {
      console.error("Error uploading file: ", error);
    }
  };
  const scannerHandler = async () => {
    setScannerLoading(true);
    try {
      const response = await getSampleData();
      const jsonData = response?.data;
      const base64ImageUrl = response?.frontImage;
      const base64ImageUrl2 = response?.backImage;
      const Row = jsonData.length;
      const Column = Object.keys(jsonData[1]).length;
      setNumberOfLines(Row);
      setNumberOfFrontSideColumn(Column);
      setExcelJsonFile(jsonData);
      const csv = Papa.unparse(jsonData);
      // Create a Blob from the CSV string
      const blob = new Blob([csv], { type: "text/csv" });
      // Create a File object from the Blob
      const csvfile = new File([blob], "data.csv", { type: "text/csv" });
      // Set the File object to state
      const file = base64ToFile(base64ImageUrl, "image.png");
      // Convert the File object to an image URL
      const imageUrl = URL.createObjectURL(file);
      setTempImageFile(file);
      // Set the image URL to be used in the component
      setImage(imageUrl);
      setImageSrc(base64ImageUrl);
      setBackImageSrc(base64ImageUrl2);
      setScannerLoading(false);
    } catch (error) {
      console.log(error);
      setScannerLoading(false);
      // toast.error(error.message);
    }
  };
  const systemHandler = () => {
    setFileModal(true);
  };
  const saveHandler = () => {
    if (imageTempFile) {
      setImageFile(imageTempFile);
      setImageModal(false);
    } else {
      alert("Please select image");
    }
  };
  const saveFileHandler = () => {
    if (!image) {
      alert("Please select image");
      return;
    }
    if (!excelJsonFile) {
      alert("Please select excel file");
      return;
    }
    setFileModal(false);
  };

  return (
    <>
      <Modal
        show={modalShow}
        onHide={props.onHide}
        size="lg"
        aria-labelledby="modal-custom-navbar"
        centered
        dialogClassName="modal-90w"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="d-flex flex-column w-100">
          <Modal.Title id="modal-custom-navbar" className="mb-2 ">
            Template Details
          </Modal.Title>
          {selectedUI === "DUPLEX" && (
            <Nav
              fill
              variant="tabs"
              activeKey={activeTab}
              onSelect={handleSelect}
              className="w-100"
            >
              <Nav.Item>
                <Nav.Link eventKey="simplex">Front Side</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="duplex">Back Side</Nav.Link>
              </Nav.Item>
            </Nav>
          )}
        </Modal.Header>
        <Modal.Body style={{ height: "65dvh", overflow: "auto" }}>
          {selectedUI === "" && (
            <div className="d-flex" style={{ justifyContent: "space-evenly" }}>
              <Jobcard text="SIMPLEX" handleJob={jobHandler} />
              <Jobcard text={"DUPLEX"} handleJob={jobHandler} />
              {/* <DuplexJob/> */}
            </div>
          )}

          {(selectedUI === "SIMPLEX" ||
            (activeTab === "simplex" && selectedUI !== "")) && (
            <Tab.Container
              activeKey={activeKey}
              onSelect={(k) => setActiveKey(k)}
            >
              <Row>
                <Col sm={12}>
                  {/* Adjusted column span to full width if needed */}
                  <Nav
                    variant="pills"
                    className="flex-row justify-content-center"
                  >
                    <Nav.Item>
                      <Nav.Link eventKey="general">General</Nav.Link>
                    </Nav.Item>
                    {barcodeEnable.id === "enable" && (
                      <Nav.Item>
                        <Nav.Link eventKey="barcode">Barcode</Nav.Link>
                      </Nav.Item>
                    )}
                    {imageStatus.id !== "0" && (
                      <Nav.Item>
                        <Nav.Link eventKey="image">Image</Nav.Link>
                      </Nav.Item>
                    )}
                    {printEnable.id !== "0" && (
                      <Nav.Item>
                        <Nav.Link eventKey="print">Printing</Nav.Link>
                      </Nav.Item>
                    )}
                  </Nav>
                </Col>
                <Col sm={12} className="mt-3">
                  <Tab.Content>
                    <Tab.Pane eventKey="general">
                      <Row className="mb-3">
                        <label
                          htmlFor="example-text-input"
                          className="col-md-2 "
                          style={{ fontSize: ".9rem" }}
                        >
                          Name
                        </label>
                        <div className="col-md-10">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Template Name"
                            value={name}
                            onChange={(e) => {
                              const value = e.target.value;
                              const regex = /^[a-zA-Z0-9-]*$/;

                              if (regex.test(value)) {
                                settoggle((item) => ({ ...item, name: false }));
                                setName(value);
                              } else {
                                alert(
                                  "Please enter only numbers and alphabets"
                                );
                              }
                            }}
                            style={{
                              border: toggle.name ? "1px solid red" : "",
                            }}
                          />
                          {/* <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Template Name"
                                                    value={name}
                                                    onChange={(e) => {
                                                        settoggle((item) => ({ ...item, name: false }));
                                                        setName(e.target.value)
                                                    }}
                                                    style={{ border: toggle.name ? "1px solid red" : "" }}
                                                /> */}
                          {!name && (
                            <span
                              style={{ color: "red", display: spanDisplay }}
                            >
                              This feild is required
                            </span>
                          )}
                        </div>
                      </Row>
                      {/* <Row className="mb-3">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 "
                                                style={{ fontSize: ".9rem" }}
                                            >
                                                Size:
                                            </label>
                                            <div className="col-md-10">
                                                <Select
                                                    value={size}
                                                    onChange={(selectedValue) => setSize(selectedValue)}
                                                    options={sizeData}
                                                    getOptionLabel={(option) => option?.name || ""}
                                                    getOptionValue={(option) =>
                                                        option?.id?.toString() || ""
                                                    }
                                                />
                                                {!size && (
                                                    <span style={{ color: "red", display: "block" }}>
                                                        This feild is required
                                                    </span>
                                                )}
                                            </div>
                                        </Row> */}
                      {/* <Row className="mb-3">
                        <Col md={6}>
                          <Row>
                            <label
                              htmlFor="example-text-input"
                              className="col-md-4 col-form-label"
                              style={{ fontSize: ".9rem" }}
                            >
                              No. of Rows
                            </label>
                            <div className="col-md-6">
                              <input
                                type="number"
                                className="form-control"
                                value={numberOfLines}
                                placeholder="Enter rows"
                                onChange={(e) => {
                                  settoggle((item) => ({
                                    ...item,
                                    row: false,
                                  }));
                                  setNumberOfLines(e.target.value);
                                }}
                                style={{
                                  border: toggle.row ? "1px solid red" : "",
                                }}
                              />
                              {!numberOfLines && (
                                <span
                                  style={{ color: "red", display: spanDisplay }}
                                >
                                  This feild is required
                                </span>
                              )}
                            </div>
                          </Row>
                        </Col>
                        <Col md={6}>
                          <Row>
                            <label
                              htmlFor="example-text-input"
                              className="col-md-6 col-form-label "
                              style={{ fontSize: ".9rem" }}
                            >
                              Number of columns
                            </label>
                            <div className="col-md-6">
                              <input
                                placeholder="Enter columns"
                                type="number"
                                className="form-control"
                                value={numberOfFrontSideColumn}
                                onChange={(e) => {
                                  settoggle((item) => ({
                                    ...item,
                                    col: false,
                                  }));
                                  setNumberOfFrontSideColumn(e.target.value);
                                }}
                                style={{
                                  border: toggle.col ? "1px solid red" : "",
                                }}
                              />
                              {!numberOfFrontSideColumn && (
                                <span
                                  style={{ color: "red", display: spanDisplay }}
                                >
                                  This feild is required
                                </span>
                              )}
                            </div>
                          </Row>
                        </Col>
                      </Row> */}
                      <Row className="mb-3">
                        <label
                          htmlFor="example-text-input"
                          className="col-md-2 col-form-label "
                          style={{ fontSize: ".85rem" }}
                        >
                          ID
                        </label>
                        <div
                          className={
                            idPresent?.id === "not present"
                              ? "col-md-10"
                              : "col-md-4"
                          }
                        >
                          <Select
                            styles={{
                              control: (provided, state) => ({
                                ...provided,
                                border: toggle.ID
                                  ? "1px solid red !important"
                                  : provided.border,
                              }),
                            }}
                            value={idPresent}
                            onChange={(selectedValue) => {
                              settoggle((item) => ({ ...item, ID: false }));
                              setIdPresent(selectedValue);

                              if (selectedValue.id === "not present") {
                                setWindowNgOption({
                                  id: "0x00000001",
                                  name: "SKDV_ACTION_SELECT(0x00000001)",
                                  showName: "Paper ejection to select stacker",
                                });
                                setReject({
                                  id: 1,
                                  name: "0",
                                  showName: "False",
                                });
                                setFace({ id: 0, name: "Front Side" });
                              } else {
                                setWindowNgOption({});
                                setReject({});
                                setFace({});
                              }
                            }}
                            options={IdOptionData}
                            getOptionLabel={(option) => option?.name || ""}
                            getOptionValue={(option) =>
                              option?.id?.toString() || ""
                            }
                          />
                        </div>

                        {idPresent?.id !== "not present" && (
                          <>
                            <label
                              htmlFor="example-text-input"
                              className="col-md-2 col-form-label "
                              style={{ fontSize: ".85rem" }}
                            >
                              Id Mark
                            </label>
                            <div className="col-md-4">
                              <Select
                                styles={{
                                  control: (provided, state) => ({
                                    ...provided,
                                    border: toggle.numberOfLines
                                      ? "1px solid red !important"
                                      : provided.border,
                                  }),
                                }}
                                value={face}
                                onChange={(selectedValue) => {
                                  setFace(selectedValue);
                                  settoggle((item) => ({
                                    ...item,
                                    numberOfLines: false,
                                  }));
                                }}
                                options={faceData}
                                getOptionLabel={(option) => option?.name || ""}
                                getOptionValue={(option) =>
                                  option?.id?.toString() || ""
                                }
                              />

                              {!numberOfLines && (
                                <span
                                  style={{ color: "red", display: spanDisplay }}
                                >
                                  This feild is required
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </Row>

                      <Row className="mb-3">
                        <label
                          htmlFor="example-text-input"
                          className="col-md-2 col-form-label "
                          style={{ fontSize: ".85rem" }}
                        >
                          Barcode
                        </label>
                        <div className="col-md-4">
                          <Select
                            value={barcodeEnable}
                            onChange={(selectedValue) => {
                              const barcodeInput =
                                document.getElementById("barcodeCount");
                              setBarcodeEnable(selectedValue);
                              if (selectedValue.id === "disable") {
                                // barcodeInput.style=
                                setBarCount(0);
                              } else {
                                setBarCount("");
                              }
                            }}
                            options={barcodeOptionData}
                            getOptionLabel={(option) => option?.name || ""}
                            getOptionValue={(option) =>
                              option?.id?.toString() || ""
                            }
                          />
                        </div>

                        <label
                          htmlFor="example-text-input"
                          className="col-md-2 col-form-label "
                          style={{ fontSize: ".85rem" }}
                        >
                          Barcode Count
                        </label>
                        <div className="col-md-4">
                          <input
                            disabled={barCount === 0 ? true : false}
                            value={barCount}
                            placeholder="Enter barcode count"
                            type="number"
                            id="barcodeCount"
                            className="form-control"
                            onChange={(e) => {
                              // settoggle((item) => ({ ...item, barcode: false }));
                              setBarCount(e.target.value);
                            }}
                            style={{
                              border:
                                barCount == 0 && barcodeEnable.id == "enable"
                                  ? "1px solid red"
                                  : "",
                            }}
                          />
                          {!selectedBubble && (
                            <span
                              style={{ color: "red", display: spanDisplay }}
                            >
                              This feild is required
                            </span>
                          )}
                        </div>
                      </Row>
                      <Row className="mb-3">
                        <label
                          htmlFor="example-text-input"
                          className="col-md-2 col-form-label  "
                          style={{ fontSize: ".95rem" }}
                        >
                          Image Status
                        </label>
                        <div className="col-md-10">
                          <Select
                            value={imageStatus}
                            onChange={(selectedValue) =>
                              setImageStatus(selectedValue)
                            }
                            options={imageStatusData}
                            getOptionLabel={(option) => option?.name || ""}
                            getOptionValue={(option) =>
                              option?.id?.toString() || ""
                            }
                            defaultInputValue=""
                          />
                        </div>
                      </Row>
                      <Row className="mb-3">
                        <label
                          htmlFor="example-text-input"
                          className="col-md-2 col-form-label "
                          style={{ fontSize: ".85rem" }}
                        >
                          Printing
                        </label>
                        <div className="col-md-10">
                          <Select
                            value={printEnable}
                            onChange={(selectedValue) => {
                              setPrintEnable(selectedValue);
                            }}
                            options={printOptionData}
                            getOptionLabel={(option) => option?.name || ""}
                            getOptionValue={(option) =>
                              option?.id?.toString() || ""
                            }
                          />
                        </div>
                      </Row>
                      <Row className="mb-3">
                        <label
                          htmlFor="bubble-variant-input"
                          className="col-md-2  col-form-label"
                          style={{ fontSize: ".87rem" }}
                        >
                          Bubble Variant
                        </label>
                        <div className="col-md-10">
                          <Select
                            value={selectedBubble}
                            onChange={(selectedValue) => {
                              setSelectedBubble(selectedValue);
                              settoggle((item) => ({
                                ...item,
                                bubbleVariant: false,
                              }));
                            }}
                            styles={{
                              control: (provided, state) => ({
                                ...provided,
                                border: toggle.bubbleVariant
                                  ? "1px solid red !important"
                                  : provided.border,
                              }),
                            }}
                            options={bubbleData}
                            getOptionLabel={(option) => option?.name || ""}
                            getOptionValue={(option) =>
                              option?.id?.toString() || ""
                            }
                            placeholder="Select type of bubble"
                            components={{ Option, SingleValue }}
                          />
                          {!selectedBubble && (
                            <span
                              style={{ color: "red", display: spanDisplay }}
                            >
                              This feild is required
                            </span>
                          )}
                        </div>
                      </Row>
                      {idPresent?.id !== "not present" && (
                        <Row className="mb-2">
                          <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                            style={{ fontSize: ".9rem" }}
                          >
                            Window NG
                          </label>
                          <div className="col-md-10">
                            <Select
                              value={windowNgOption}
                              onChange={(selectedValue) => {
                                setWindowNgOption(selectedValue);
                                settoggle((item) => ({
                                  ...item,
                                  windowNgOption: false,
                                }));
                              }}
                              styles={{
                                control: (provided, state) => ({
                                  ...provided,
                                  border: toggle.windowNgOption
                                    ? "1px solid red !important"
                                    : provided.border,
                                }),
                              }}
                              options={windowNgData}
                              getOptionLabel={(option) =>
                                option?.showName || ""
                              }
                              getOptionValue={(option) =>
                                option?.id?.toString() || ""
                              }
                            />
                            {!size && (
                              <span
                                style={{ color: "red", display: spanDisplay }}
                              >
                                This feild is required
                              </span>
                            )}
                          </div>
                          {/* <label
                            htmlFor="bubble-variant-input"
                            className="col-md-2 col-form-label  "
                            style={{ fontSize: ".9rem", textAlign: "right" }}
                          >
                            Rejected
                          </label>
                          <div className="col-md-3">
                            <Select
                              value={reject}
                              onChange={(selectedValue) => {
                                setReject(selectedValue);
                                settoggle((item) => ({
                                  ...item,
                                  Rejected: false,
                                }));
                              }}
                              styles={{
                                control: (provided, state) => ({
                                  ...provided,
                                  border: toggle.Rejected
                                    ? "1px solid red !important"
                                    : provided.border,
                                }),
                              }}
                              options={rejectData}
                              getOptionLabel={(option) =>
                                option?.showName || ""
                              }
                              getOptionValue={(option) =>
                                option?.id?.toString() || ""
                              }
                            />
                            {!selectedBubble && (
                              <span
                                style={{ color: "red", display: spanDisplay }}
                              >
                                This feild is required
                              </span>
                            )}
                          </div> */}
                        </Row>
                      )}

                      {/* <Row className="mb-3">
                                        <label
                                            htmlFor="example-text-input"
                                            className="col-md-2 col-form-label "
                                            style={{ fontSize: ".85rem" }}
                                        >
                                            Barcode Count:
                                        </label>
                                        <div className="col-md-10">
                                            <input placeholder="Enter barcode count" type="number" className="form-control" onChange={(e) => {
                                                settoggle((item) => ({ ...item, barcode: false }));
                                                setBarCount(e.target.value)
                                            }}
                                                style={{ border: toggle.barcode ? "1px solid red" : "" }}
                                            />
                                            {!selectedBubble && (
                                                <span style={{ color: "red", display: spanDisplay }}>
                                                    This feild is required
                                                </span>
                                            )}
                                        </div>
                                    </Row> */}

                      <Row className="mb-3">
                        <label
                          htmlFor="example-text-input"
                          className="col-md-2 col-form-label  "
                          style={{ fontSize: ".9rem" }}
                        >
                          Sensitivity
                        </label>
                        <div
                          className="col-md-5"
                          style={{
                            display: "flex",
                            gap: "5px",
                            width: "100%",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              width: "100%",
                            }}
                          >
                            <div
                              style={{
                                borderRadius: "6px",
                                overflow: "hidden",
                              }}
                            >
                              <ShadesOfGrey />
                            </div>

                            <input
                              type="range"
                              id="sensitivityRange"
                              min="1"
                              max="16"
                              value={sensitivity}
                              onChange={(e) => setSensitivity(e.target.value)}
                              title={sensitivity}
                              style={{ cursor: "pointer" }}
                            />
                          </div>

                          <input
                            value={sensitivity}
                            onChange={(e) => setSensitivity(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "2px",
                              textAlign: "center",
                            }}
                            className="form-control"
                            type="number"
                            min={1}
                            max={16}
                          />

                          {!sensitivity && (
                            <span
                              style={{ color: "red", display: spanDisplay }}
                            >
                              This feild is required
                            </span>
                          )}
                        </div>
                        <label
                          htmlFor="example-text-input"
                          className="col-md-2 col-form-label "
                          style={{ fontSize: ".9rem", textAlign: "right" }}
                        >
                          Difference
                        </label>
                        <div className="col-md-3">
                          <input
                            style={{
                              border: toggle.difference ? "1px solid red" : "",
                            }}
                            placeholder="Enter difference"
                            type="number"
                            className="form-control"
                            value={difference}
                            onBlur={(e) => {
                              const inputValue = e.target.value;

                              // Check if the input value is not empty and less than sensitivity
                              if (
                                inputValue !== "" &&
                                +inputValue < +sensitivity
                              ) {
                                alert(
                                  "Entered value cannot be less than sensitivity"
                                );
                                setDifference("");
                                return;
                              }
                            }}
                            onChange={(e) => {
                              setDifference(e.target.value);
                              settoggle((item) => ({
                                ...item,
                                difference: false,
                              }));
                            }}
                          />

                          {!difference && (
                            <span
                              style={{ color: "red", display: spanDisplay }}
                            >
                              This feild is required
                            </span>
                          )}
                        </div>
                      </Row>

                      <Row className="mb-3">
                        <label
                          htmlFor="example-text-input"
                          className="col-md-2 col-form-label  "
                          style={{ fontSize: ".9rem" }}
                        >
                          Page Position
                        </label>
                        <div className="col-md-10">
                          <Select
                            value={direction}
                            onChange={(selectedValue) => {
                              settoggle((item) => ({
                                ...item,
                                direction: false,
                              }));
                              setDirection(selectedValue);
                            }}
                            options={directionData}
                            getOptionLabel={(option) => option?.name || ""}
                            getOptionValue={(option) =>
                              option?.id?.toString() || ""
                            }
                            styles={{
                              control: (provided, state) => ({
                                ...provided,
                                border: toggle.direction
                                  ? "1px solid red !important"
                                  : provided.border,
                              }),
                            }}
                          />
                        </div>
                      </Row>

                      {/* <div>
                                        <DropDownListComponent
                                            dataSource={columns}
                                            placeholder="Select a column"
                                            change={handleColumnChange}
                                        />

                                    </div> */}

                      {/* <Row className="mb-3">
                      <Col sm={6}>
                        <Row>
                          <label
                            htmlFor="example-text-input"
                            className="col-md-6 "
                            style={{ fontSize: ".9rem" }}
                          >
                            Number of front side of column:
                          </label>
                          <div className="col-md-6">
                            <input
                              type="number"
                              className="form-control"
                              value={numberOfFrontSideColumn}
                              onChange={(e) =>
                                setNumberOfFrontSideColumn(e.target.value)
                              }
                            />
                            {!numberOfFrontSideColumn && (
                              <span
                                style={{ color: "red", display: spanDisplay }}
                              >
                                This feild is required
                              </span>
                            )}
                          </div>
                        </Row>
                      </Col>
                      <Col sm={6}>
                        <Row>
                          <label
                            htmlFor="example-text-input"
                            className="col-md-6 "
                            style={{ fontSize: ".9rem" }}
                          >
                            Number of back side column:
                          </label>
                          <div className="col-md-6">
                            <input
                              type="number"
                              className="form-control"
                              value={numberOfBackSideColumn}
                              onChange={(e) =>
                                setNumberOfBackSideColumn(e.target.value)
                              }
                            />
                            {!numberOfBackSideColumn && (
                              <span
                                style={{ color: "red", display: spanDisplay }}
                              >
                                This feild is required
                              </span>
                            )}
                          </div>
                        </Row>
                      </Col>
                    </Row> */}

                      {/* <Row className="mb-3">
                      <label
                        htmlFor="example-text-input"
                        className="col-md-3 "
                        style={{ fontSize: ".9rem" }}
                      >
                        Type of column display:
                      </label>
                      <div className="col-md-9">
                        <Select
                          value={typeOfColumnDisplay}
                          onChange={(selectedValue) =>
                            setTypeOfColumnDisplay(selectedValue)
                          }
                          options={typeOfColumnDisplayData}
                          getOptionLabel={(option) => option?.name || ""}
                          getOptionValue={(option) =>
                            option?.id?.toString() || ""
                          }
                        />
                        {!typeOfColumnDisplay && (
                          <span style={{ color: "red", display: spanDisplay }}>
                            This feild is required
                          </span>
                        )}
                      </div>
                    </Row> */}
                    </Tab.Pane>

                    <Tab.Pane eventKey="print">
                      <Row className="mb-3">
                        <label
                          htmlFor="example-text-input"
                          className="col-md-2 col-form-label"
                          style={{ fontSize: ".9rem" }}
                        >
                          Start Position:
                        </label>
                        <div className="col-md-10">
                          <input
                            value={startPosition}
                            type="number"
                            className="form-control"
                            placeholder="Enter value between 0.00mm and 355.0mm"
                            onChange={(e) => {
                              setStartPosition(e.target.value);
                            }}
                          />
                        </div>
                      </Row>
                      <Row className="mb-3">
                        <label
                          htmlFor="example-text-input"
                          className="col-md-2 col-form-label "
                          style={{ fontSize: ".9rem" }}
                        >
                          Font Space:
                        </label>
                        <div className="col-md-10">
                          <input
                            type="number"
                            value={fontSpace}
                            className="form-control"
                            placeholder="Enter value between 0.8mm and 92.0mm"
                            onChange={(e) => {
                              setFontSpace(e.target.value);
                            }}
                          />
                        </div>
                      </Row>
                      <Row className="mb-3">
                        <label
                          htmlFor="example-text-input"
                          className="col-md-2 col-form-label "
                          style={{ fontSize: ".9rem" }}
                        >
                          Digit :
                        </label>
                        <div className="col-md-10">
                          <input
                            type="number"
                            value={printDigit}
                            className="form-control"
                            placeholder="Enter the digits of sequence number (MAX 8digits)"
                            onChange={(e) => {
                              setPrintDigit(e.target.value);
                            }}
                          />
                        </div>
                      </Row>
                      <Row className="mb-3">
                        <label
                          htmlFor="example-text-input"
                          className="col-md-2 col-form-label "
                          style={{ fontSize: ".85rem" }}
                        >
                          Start Number :
                        </label>
                        <div className="col-md-10">
                          <input
                            type="number"
                            value={printStartNumber}
                            className="form-control"
                            placeholder="Enter the start number for print sequence number"
                            onChange={(e) => {
                              setPrintStartNumber(e.target.value);
                            }}
                          />
                        </div>
                      </Row>
                      <Row className="mb-3">
                        <label
                          htmlFor="example-text-input"
                          className="col-md-2 "
                          style={{ fontSize: ".9rem" }}
                        >
                          Printing Orientation :
                        </label>
                        <div className="col-md-10">
                          <Select
                            value={printOrientation}
                            onChange={(selectedValue) =>
                              setPrintOrientation(selectedValue)
                            }
                            options={printOrientationOption}
                            getOptionLabel={(option) => option?.name || ""}
                            getOptionValue={(option) =>
                              option?.id?.toString() || ""
                            }
                            placeholder="Select printing orientation"
                          />
                        </div>
                      </Row>
                      <Row className="mb-3">
                        <label
                          htmlFor="example-text-input"
                          className="col-md-2 col-form-label"
                          style={{ fontSize: ".85rem" }}
                        >
                          Printing Mode :
                        </label>
                        <div className="col-md-10">
                          <Select
                            value={printMode}
                            onChange={(selectedValue) =>
                              setPrintMode(selectedValue)
                            }
                            placeholder="Select printing mode"
                            options={printModeOption}
                            getOptionLabel={(option) => option?.name || ""}
                            getOptionValue={(option) =>
                              option?.id?.toString() || ""
                            }
                          />
                        </div>
                      </Row>

                      <Row className="mb-2">
                        <label
                          htmlFor="example-text-input"
                          className="col-md-2 col-form-label"
                          style={{ fontSize: ".9rem" }}
                        >
                          Custom :
                        </label>
                        <div className="col-md-10">
                          <Select
                            value={printCustom}
                            onChange={(selectedValue) =>
                              setPrintCustom(selectedValue)
                            }
                            options={printCustomOption}
                            getOptionLabel={(option) => option?.name || ""}
                            getOptionValue={(option) =>
                              option?.id?.toString() || ""
                            }
                          />
                        </div>
                      </Row>
                      {printCustom.id === "custom" && (
                        <Row className="mb-2">
                          <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                            style={{ fontSize: ".8rem" }}
                          >
                            Custom Value :
                          </label>
                          <div className="col-md-10">
                            <input
                              type="text"
                              value={printCustomValue}
                              className="form-control"
                              placeholder="Enter the custom value to be printed"
                              onChange={(e) => {
                                setPrintCustomValue(e.target.value);
                              }}
                            />
                          </div>
                        </Row>
                      )}
                    </Tab.Pane>

                    <Tab.Pane eventKey="barcode">
                      <Row className="mb-3">
                        <label
                          htmlFor="example-text-input"
                          className="col-md-2 "
                          style={{ fontSize: ".9rem" }}
                        >
                          Barcode Category:
                        </label>
                        <div className="col-md-10">
                          <Select
                            value={barcodeCategory}
                            onChange={(selectedValue) =>
                              setBarcodeCategory(selectedValue)
                            }
                            options={barcodeCategoryData}
                            getOptionLabel={(option) => option?.name || ""}
                            getOptionValue={(option) =>
                              option?.id?.toString() || ""
                            }
                          />
                          {!size && (
                            <span style={{ color: "red", display: "block" }}>
                              This feild is required
                            </span>
                          )}
                        </div>
                      </Row>
                      {barcodeCategory.id === "hardware" && (
                        <Row className="mb-3">
                          <label
                            htmlFor="example-text-input"
                            className="col-md-2 "
                            style={{ fontSize: ".9rem" }}
                          >
                            Barcode Rejection :
                          </label>
                          <div className="col-md-10">
                            <Select
                              value={barcodeRejectStatus}
                              onChange={(selectedValue) =>
                                setBarcodeRejectStatus(selectedValue)
                              }
                              options={barcodeRejectData}
                              getOptionLabel={(option) => option?.name || ""}
                              getOptionValue={(option) =>
                                option?.id?.toString() || ""
                              }
                            />
                            {!size && (
                              <span style={{ color: "red", display: "block" }}>
                                This feild is required
                              </span>
                            )}
                          </div>
                        </Row>
                      )}

                      <>
                        <Row className="mb-3">
                          <label
                            htmlFor="example-text-input"
                            className="col-md-2 "
                            style={{ fontSize: ".9rem" }}
                          >
                            Barcode Type :
                          </label>
                          <div className="col-md-10">
                            <Select
                              value={barcodeType}
                              onChange={(selectedValue) =>
                                setBarcodeType(selectedValue)
                              }
                              options={barcodeTypeData}
                              getOptionLabel={(option) => option?.name || ""}
                              getOptionValue={(option) =>
                                option?.id?.toString() || ""
                              }
                            />
                            {!size && (
                              <span style={{ color: "red", display: "block" }}>
                                This feild is required
                              </span>
                            )}
                          </div>
                        </Row>

                        {(barcodeType.id === "0x1U" ||
                          barcodeType.id === "0x2U") && (
                          <Row className="mb-3">
                            <label
                              htmlFor="example-text-input"
                              className="col-md-2 "
                              style={{ fontSize: ".9rem" }}
                            >
                              Set check digit:
                            </label>

                            <div className="col-md-10">
                              <Select
                                value={checkDigit}
                                onChange={(selectedValue) =>
                                  setCheckDigit(selectedValue)
                                }
                                options={
                                  barcodeType.id === "0x1U"
                                    ? code39OrItfCheckDigitData
                                    : nw7CheckDigitData
                                }
                                getOptionLabel={(option) => option?.name || ""}
                                getOptionValue={(option) =>
                                  option?.id?.toString() || ""
                                }
                                placeholder="Select check digit"
                              />
                              {/* {(!(barcodeType.id === "0x1U" || barcodeType.id === "0x2U") || Object.keys(barcodeType).length === 0) && (
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={(barcodeType.id === "0x400U" || barcodeType.id === "0x800U") ? 0 : numberOfFrontSideColumn}
                                                        onChange={(e) => setNumberOfFrontSideColumn(e.target.value)}
                                                    />
                                                )} */}
                            </div>
                          </Row>
                        )}
                        {(barcodeType.id === "0x400U" ||
                          barcodeType.id === "0x800U") && (
                          <Row className="mb-3">
                            <label
                              htmlFor="example-text-input"
                              className="col-md-2 "
                              style={{ fontSize: ".9rem" }}
                            >
                              Set option:
                            </label>
                            <div className="col-md-10">
                              <Select
                                value={option}
                                onChange={(selectedValue) =>
                                  setOption(selectedValue)
                                }
                                options={
                                  barcodeType.id === "0x400U"
                                    ? upcaOptionData
                                    : upceOptionData
                                }
                                getOptionLabel={(option) => option?.name || ""}
                                getOptionValue={(option) =>
                                  option?.id?.toString() || ""
                                }
                              />
                              {/* {(!(barcodeType.id === "0x400U" || barcodeType.id === "0x800U") || Object.keys(barcodeType).length === 0) && (
                                                    <input
                                                        type="number"
                                                        className="form-control"

                                                        // value={}
                                                        onChange={(e) => setNumberOfFrontSideColumn(e.target.value)}
                                                    />
                                                )} */}
                            </div>
                          </Row>
                        )}
                          {barcodeCategory.id !== "software" && (
                          <Row className="mb-3">
                            <label
                              htmlFor="example-text-input"
                              className="col-md-6 "
                              style={{ fontSize: ".9rem" }}
                            >
                              Set Barcode reading area :-
                            </label>
                          </Row>
                        )}
                        {/* <Row className="mb-3">

                                        <label
                                            htmlFor="example-text-input"
                                            className="col-md-2 "
                                            style={{ fontSize: ".9rem" }}
                                        >
                                            Top :
                                        </label>
                                        <div className="col-md-2">
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={numberOfFrontSideColumn}
                                                onChange={(e) =>
                                                    setNumberOfFrontSideColumn(e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <p>in mm</p>
                                        </div>
                                        <label
                                            htmlFor="example-text-input"
                                            className="col-md-2 "
                                            style={{ fontSize: ".9rem" }}
                                        >
                                            Bottom :
                                        </label>
                                        <div className="col-md-2">
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={numberOfFrontSideColumn}
                                                onChange={(e) =>
                                                    setNumberOfFrontSideColumn(e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <p>in mm</p>
                                        </div>

                                    </Row> */}
                        {barcodeCategory.id !== "software" && (
                          <Row className="mb-3 align-items-center">
                            <label
                              htmlFor="top-input"
                              className="col-md-2 col-form-label"
                              style={{ fontSize: ".9rem" }}
                            >
                              Top:
                            </label>
                            <div className="col-md-2">
                              <input
                                type="number"
                                className="form-control"
                                id="top-input"
                                value={barcodeTopPos}
                                onChange={(e) =>
                                  setBarcodeTopPos(e.target.value)
                                }
                              />
                            </div>
                            <div className="col-md-2">
                              <p className="m-0" style={{ fontSize: ".9rem" }}>
                                in mm
                              </p>
                            </div>
                            <label
                              htmlFor="bottom-input"
                              className="col-md-2 col-form-label"
                              style={{ fontSize: ".9rem" }}
                            >
                              Bottom:
                            </label>
                            <div className="col-md-2">
                              <input
                                type="number"
                                className="form-control"
                                id="bottom-input"
                                value={barcodeBottomPos}
                                onChange={(e) =>
                                  setBarcodeBottomPos(e.target.value)
                                }
                              />
                            </div>
                            <div className="col-md-2">
                              <p className="m-0" style={{ fontSize: ".9rem" }}>
                                in mm
                              </p>
                            </div>
                          </Row>
                        )}

                        {barcodeCategory.id !== "software" && (
                          <Row className="mb-3 align-items-center">
                            <label
                              htmlFor="top-input"
                              className="col-md-2 col-form-label"
                              style={{ fontSize: ".9rem" }}
                            >
                              Left:
                            </label>
                            <div className="col-md-2">
                              <input
                                type="number"
                                className="form-control"
                                id="top-input"
                                value={barcodeLeftPos}
                                onChange={(e) =>
                                  setBarcodeLeftPos(e.target.value)
                                }
                              />
                            </div>
                            <div className="col-md-2">
                              <p className="m-0" style={{ fontSize: ".9rem" }}>
                                in mm
                              </p>
                            </div>
                            <label
                              htmlFor="bottom-input"
                              className="col-md-2 col-form-label"
                              style={{ fontSize: ".9rem" }}
                            >
                              Right:
                            </label>
                            <div className="col-md-2">
                              <input
                                type="number"
                                className="form-control"
                                id="bottom-input"
                                value={barcodeRightPos}
                                onChange={(e) =>
                                  setBarcodeRightPos(e.target.value)
                                }
                              />
                            </div>
                            <div className="col-md-2">
                              <p className="m-0" style={{ fontSize: ".9rem" }}>
                                in mm
                              </p>
                            </div>
                          </Row>
                        )}
                      </>
                    </Tab.Pane>
                    <Tab.Pane eventKey="image">
                      <Form>
                        <Row className="mb-3">
                          <label
                            htmlFor="example-text-input"
                            className="col-md-3 "
                            style={{ fontSize: ".9rem" }}
                          >
                            Color Types :
                          </label>
                          <div className="col-md-9">
                            <Select
                              value={colorType}
                              onChange={(selectedValue) =>
                                setColorType(selectedValue)
                              }
                              options={colorTypeData}
                              getOptionLabel={(option) => option?.name || ""}
                              getOptionValue={(option) =>
                                option?.id?.toString() || ""
                              }
                              placeholder="Select color type..."
                            />
                          </div>
                        </Row>
                        <Row className="mb-3">
                          <label
                            htmlFor="example-text-input"
                            className="col-md-3 "
                            style={{ fontSize: ".9rem" }}
                          >
                            Encoding Option :
                          </label>
                          <div className="col-md-9">
                            <Select
                              value={encoding}
                              onChange={(selectedValue) =>
                                setEncoding(selectedValue)
                              }
                              options={encodingOptionData}
                              getOptionLabel={(option) => option?.name || ""}
                              getOptionValue={(option) =>
                                option?.id?.toString() || ""
                              }
                              placeholder="Select an encoding option..."
                            />
                          </div>
                        </Row>
                        <Row className="mb-3">
                          <label
                            htmlFor="example-text-input"
                            className="col-md-3 "
                            style={{ fontSize: ".9rem" }}
                          >
                            Rotation :
                          </label>
                          <div className="col-md-9">
                            <Select
                              value={rotation}
                              onChange={(selectedValue) =>
                                setRotation(selectedValue)
                              }
                              options={rotationOptionData}
                              getOptionLabel={(option) => option?.name || ""}
                              getOptionValue={(option) =>
                                option?.id?.toString() || ""
                              }
                              placeholder="Select rotation option..."
                            />
                          </div>
                        </Row>
                        <Row className="mb-3">
                          <label
                            htmlFor="example-text-input"
                            className="col-md-3 "
                            style={{ fontSize: ".9rem" }}
                          >
                            Resolution :
                          </label>
                          <div className="col-md-9">
                            <Select
                              value={resolution}
                              onChange={(selectedValue) =>
                                setResolution(selectedValue)
                              }
                              options={resolutionOptionData}
                              getOptionLabel={(option) => option?.name || ""}
                              getOptionValue={(option) =>
                                option?.id?.toString() || ""
                              }
                              placeholder="Select rotation option..."
                            />
                            {resolution?.id === "0" && (
                              <span
                                style={{ color: "orangered", display: "block" }}
                              >
                                *Scanning will be slow on 600DPI*
                              </span>
                            )}
                          </div>
                        </Row>
                        <Row className="mb-3">
                          <label
                            htmlFor="example-text-input"
                            className="col-md-3 "
                            style={{ fontSize: ".9rem" }}
                          >
                            Scanning Side :
                          </label>
                          <div className="col-md-9">
                            <Select
                              value={scannningSide}
                              onChange={(selectedValue) =>
                                setScanningSide(selectedValue)
                              }
                              options={scanningSideData}
                              getOptionLabel={(option) => option?.name || ""}
                              getOptionValue={(option) =>
                                option?.id?.toString() || ""
                              }
                              placeholder="Select rotation option..."
                            />
                          </div>
                        </Row>
                      </Form>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          )}

          {selectedUI === "DUPLEX" &&
            activeTab === "duplex" &&
            selectedUI !== "" && (
              <Tab.Container
                activeKey={activeKey}
                onSelect={(k) => setActiveKey(k)}
              >
                <Row>
                  <Col sm={12}>
                    {/* Adjusted column span to full width if needed */}
                    <Nav
                      variant="pills"
                      className="flex-row justify-content-center"
                    >
                      <Nav.Item>
                        <Nav.Link eventKey="general">General</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="barcode">Barcode</Nav.Link>
                      </Nav.Item>
                      {imageStatus.id !== "0" && (
                        <Nav.Item>
                          <Nav.Link eventKey="image">Image</Nav.Link>
                        </Nav.Item>
                      )}
                    </Nav>
                  </Col>
                  <Col sm={12} className="mt-3">
                    <Tab.Content>
                      <Tab.Pane eventKey="general">
                        <Row className="mb-3">
                          <Col md={6}>
                            <Row>
                              <label
                                htmlFor="example-text-input"
                                className="col-md-4 col-form-label"
                                style={{ fontSize: ".9rem" }}
                              >
                                No. of Rows :
                              </label>
                              <div className="col-md-6">
                                <input
                                  type="number"
                                  className="form-control"
                                  value={numberOfLines}
                                  placeholder="Enter rows"
                                  onChange={(e) => {
                                    settoggle((item) => ({
                                      ...item,
                                      row: false,
                                    }));
                                    setNumberOfLines(e.target.value);
                                  }}
                                  style={{
                                    border: toggle.row ? "1px solid red" : "",
                                  }}
                                />
                                {!numberOfLines && (
                                  <span
                                    style={{
                                      color: "red",
                                      display: spanDisplay,
                                    }}
                                  >
                                    This feild is required
                                  </span>
                                )}
                              </div>
                            </Row>
                          </Col>
                          <Col md={6}>
                            <Row>
                              <label
                                htmlFor="example-text-input"
                                className="col-md-6 col-form-label "
                                style={{ fontSize: ".9rem" }}
                              >
                                Number of columns:
                              </label>
                              <div className="col-md-6">
                                <input
                                  placeholder="Enter columns"
                                  type="number"
                                  className="form-control"
                                  value={numberOfFrontSideColumn}
                                  onChange={(e) => {
                                    settoggle((item) => ({
                                      ...item,
                                      col: false,
                                    }));
                                    setNumberOfFrontSideColumn(e.target.value);
                                  }}
                                  style={{
                                    border: toggle.col ? "1px solid red" : "",
                                  }}
                                />
                                {!numberOfFrontSideColumn && (
                                  <span
                                    style={{
                                      color: "red",
                                      display: spanDisplay,
                                    }}
                                  >
                                    This feild is required
                                  </span>
                                )}
                              </div>
                            </Row>
                          </Col>
                        </Row>
                      </Tab.Pane>
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            )}
        </Modal.Body>
        <Modal.Footer>
          <div style={{ width: "50%" }}>
            {/* <div class="mb-4" >
                        <label for="formFile" class="form-label">Upload OMR Image</label>
                        <input class="form-control" type="file" id="formFile" onChange={handleImageUpload} accept="image/*" />
                    </div> */}
            <div>
              {/* {imageFile?.name}  */}
              {/* {!imageFile && <Button onClick={imageModalHandler}>Select Image</Button>}

                            {imageFile &&
                                <div >
                                    <Button variant='info' onClick={imageModalHandler}>Choose another</Button>
                                    <img src={image} alt="Fetched Thumbnail" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                </div>
                            } */}

              <div>
                {selectedUI &&
                  (!image ? (
                    <Button onClick={imageModalHandler}>Select Image</Button>
                  ) : (
                    <div>
                      <Button
                        // disabled
                        variant="info"
                        onClick={imageModalHandler}
                      >
                        Choose another
                      </Button>
                      <img
                        src={image}
                        alt="Fetched Thumbnail"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div
            className="w-20 flex-shrink-0"
            style={{
              content: "",
              width: "12%",
            }}
          ></div>{" "}
          {/* Spacer div */}
          <Button
            variant="secondary"
            onClick={() => {
              props.onHide();
              resetModalHandler();
            }}
          >
            Close
          </Button>
          <Button variant="success" onClick={createTemplateHandler}>
            Update Template
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={imageModal}
        // onHide={props.onHide}
        size="lg"
        aria-labelledby="modal-custom-navbar"
        centered
        dialogClassName="modal-50w"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title id="modal-custom-navbar">Select Image</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "65dvh" }}>
          {scannerLoading && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.2)", // Slightly opaque background
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 999,
                pointerEvents: "auto", // Make the overlay not clickable
              }}
            >
              <Spinner />
            </div>
          )}
          {/* <Row>
                        <div class="mb-4" >
                            <label for="formFile" class="form-label">Upload OMR Image</label>
                            <input class="form-control" type="file" id="formFile" onChange={handleImageUpload} accept="image/*" />
                        </div>
                    </Row>
                    <Row>

                        <ImageSelection />
                    </Row> */}

          <div className="container mt-4">
            <style jsx>{`
              .upload-box {
                cursor: pointer;
                background-color: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 10px;
                padding: 20px;
                text-align: center;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
              }
              .upload-box:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
              }
              .upload-box h1 {
                font-size: 1.5rem;
                color: #333;
              }
            `}</style>
            <Row>
              <Col lg={6} md={6} className="mb-4">
                <div
                  onClick={systemHandler}
                  className="upload-box p-4 text-center border rounded"
                >
                  <h1 className="fs-3 text-dark">Upload From System</h1>
                  {/* <label htmlFor="formFile" className="form-label sr-only">
                    Upload OMR Image
                  </label>
                  <input
                    className="form-control sr-only"
                    type="file"
                    id="formFile"
                    onChange={handleImageUpload}
                    accept="image/*"
                  /> */}
                </div>
              </Col>
              <Col lg={6} md={6} className="mb-4">
                <div
                  onClick={scannerHandler}
                  className="upload-box p-4 text-center border rounded"
                >
                  <h1>Upload From Scanner</h1>
                </div>
              </Col>
            </Row>
          </div>
          <Row className="d-flex justify-content-center mt-4">
            {image && (
              <img src={image} alt="Scanned" width={200} height={200} />
            )}
            {!image && <p>Please select the image</p>}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="warning"
            onClick={() => {
              setImageModal(false);
            }}
          >
            Close
          </Button>
          <Button variant="success" onClick={saveHandler}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={fileModal}
        // onHide={props.onHide}
        size="sm"
        aria-labelledby="modal-custom-navbar"
        centered
        dialogClassName="modal-50w"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title id="modal-custom-navbar">Select Image</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "65dvh" }}>
          <Row className="d-flex justify-content-center mt-4">
            <label>Choose Image</label>
            <input
              className="form-control"
              type="file"
              id="formFile"
              onChange={handleImageUpload}
              accept="image/*"
            />
            {image && (
              <img src={image} alt="Scanned" width={100} height={100} />
            )}
          </Row>
          <Row className="d-flex justify-content-center mt-4">
            <label>Choose Back Image</label>
            <input
              className="form-control"
              type="file"
              id="formFile"
              onChange={handleImage2Upload}
              accept="image/*"
            />
            {imageBack && (
              <img src={imageBack} alt="Scanned" width={100} height={100} />
            )}
          </Row>
          <Row className="d-flex justify-content-center mt-4">
            <label>Choose Excel File</label>
            <input
              className="form-control"
              type="file"
              id="formFile"
              onChange={handleExcelUpload}
              accept=".xls,.xlsx,.csv"
            />
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="warning"
            onClick={() => {
              setFileModal(false);
            }}
          >
            Close
          </Button>
          <Button variant="success" onClick={saveFileHandler}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LayoutDetailModal;
