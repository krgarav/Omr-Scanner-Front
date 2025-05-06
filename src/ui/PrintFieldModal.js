import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Tab } from "react-bootstrap";
import {
  printOptionData,
  printModeOption,
  printCustomOption,
  printOrientationOption,
} from "data/helperData";
import Select, { components } from "react-select";
import { toast } from "react-toastify";
import { printData } from "helper/Booklet32Page_helper";
const comparewithId = (optiondata, optionvalue) => {
  const filter = optiondata.find((item) => item.id == optionvalue);
  return filter;
};
const PrintFieldModal = (props) => {
  const [printEnable, setPrintEnable] = useState(props.show);
  const [printOrientation, setPrintOrientation] = useState(null);
  const [printMode, setPrintMode] = useState();
  const [printCustom, setPrintCustom] = useState(printCustomOption[0]);
  const [startPosition, setStartPosition] = useState(null);
  const [fontSpace, setFontSpace] = useState(null);
  const [printDigit, setPrintDigit] = useState(null);
  const [printStartNumber, setPrintStartNumber] = useState(null);
  const [printCustomValue, setPrintCustomValue] = useState(null);
  useEffect(() => {
    if (Object.values(props.data).length !== 0) {
      const pd = props.data;
      setStartPosition(pd.printStartPos);
      setFontSpace(pd.printFontSpace);
      setPrintDigit(pd.printDigit);
      setPrintStartNumber(pd.printStartNumber);
      setPrintOrientation(
        comparewithId(printOrientationOption, pd.printOrientation)
      );
      setPrintMode(comparewithId(printModeOption, pd.printMode));
      setPrintCustom(comparewithId(printCustomOption, pd.customType));
      if (pd?.customType === "custom") {
        setPrintCustomValue(pd.customValue);
      }
    }
  }, [props.data]);

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
  const saveHandler = async () => {
    const scantemplateId = localStorage.getItem("scantemplateId");
    if (!validatePrintField()) {
      return;
    }
    const printObj = {
      layoutId: scantemplateId,
      printEnable: 1,
      printStartPos: +startPosition ?? 0,
      printDigit: +printDigit ?? 0,
      printStartNumber: +printStartNumber ?? 0,
      printOrientation:
        printOrientation?.id === undefined ? 0 : +printOrientation?.id,
      printFontSpace: +fontSpace ?? 0,
      printMode: printMode?.id === undefined ? 0 : +printMode?.id,
      customType: printCustom?.id === undefined ? "" : printCustom?.id,
      customValue: printCustomValue ? printCustomValue : "",
    };

    try {
      const res = await printData(printObj);
      toast.success("Saved Printing Data");
      console.log(res);
      props.onHide();
    } catch (error) {
      console.log(error);
      toast.error(error)
    }
    console.log(printObj);
  };
  return (
    <Modal
      show={printEnable}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="modal-custom-navbar"
      centered
      dialogClassName="modal-50w"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title id="modal-custom-navbar">Print Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
              onChange={(selectedValue) => setPrintOrientation(selectedValue)}
              options={printOrientationOption}
              getOptionLabel={(option) => option?.name || ""}
              getOptionValue={(option) => option?.id?.toString() || ""}
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
              onChange={(selectedValue) => setPrintMode(selectedValue)}
              placeholder="Select printing mode"
              options={printModeOption}
              getOptionLabel={(option) => option?.name || ""}
              getOptionValue={(option) => option?.id?.toString() || ""}
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
              onChange={(selectedValue) => setPrintCustom(selectedValue)}
              options={printCustomOption}
              getOptionLabel={(option) => option?.name || ""}
              getOptionValue={(option) => option?.id?.toString() || ""}
            />
          </div>
        </Row>
        {printCustom?.id === "custom" && (
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
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="warning"
          onClick={() => {
            props.onHide();
          }}
        >
          Close
        </Button>
        <Button variant="success" onClick={saveHandler}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PrintFieldModal;
