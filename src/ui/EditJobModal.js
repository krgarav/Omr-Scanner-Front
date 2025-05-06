import React, { useContext, useEffect, useState } from "react";
import { Modal, Button, Nav, Form, Tab, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-react-dropdowns/styles/material.css";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import ImageSelection from "./imageSelection";
import { getScannedImage } from "helper/TemplateHelper";
import { toast } from "react-toastify";
import { fetchAllTemplate } from "helper/TemplateHelper";
import Select, { components } from "react-select";
import Imageswitch from "./Imageswitch";
import { change } from "@syncfusion/ej2-react-grids";
import { fetchAllUsers } from "helper/userManagment_helper";
import {
  fileType,
  imageTypeData,
  imageColorTypeData,
  imageDPIData,
} from "data/helperData";
import { jwtDecode } from "jwt-decode";
import DirectoryPicker from "views/DirectoryPicker";
import { getJobDetail } from "helper/job_helper";
import { updateJob } from "helper/job_helper";
import TextLoader from "loaders/TextLoader";

const comparewithId = (optiondata, optionvalue) => {
  const filter = optiondata.find((item) => item.id === optionvalue);
  return filter;
};
const EditJobModal = (props) => {
  const [modalShow, setModalShow] = useState(false);
  const [allTemplateOptions, setAllTemplateOptions] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState();
  const [imageEnable, setImageEnable] = useState(false);
  const [allOperators, setAllOperators] = useState([]);
  const [dataPath, setDataPath] = useState("");
  const [dataType, setDataType] = useState("");
  const [imageType, setImageType] = useState("");
  const [imageDpi, setImageDpi] = useState("");
  const [imageColor, setImageColor] = useState("");
  const [selectedDataDirectory, setSelectedDataDirectory] = useState("");
  const [selectedImageDirectory, setSelectedImageDirectory] = useState("");
  const [directoryPickerModal, setDirectoryPickerModal] = useState(false);
  const [jobName, setJobName] = useState("");
  const [dataName, setDataName] = useState("");
  const [imageName, setImageName] = useState("");
  const [currentDirState, setCurrentDirState] = useState("data");
  const [loading, setLoading] = useState(false);

  const changeHandler = (val) => {
    // if (!selectedDataDirectory && val === true) {
    //   toast.error("Please select data directory first");
    //   setImageEnable(false);
    //   return;
    // }
    setImageEnable(val);
  };
  useEffect(() => {
    if (props.show) {
      setModalShow(true);
    } else {
      setModalShow(false);
    }
  }, [props.show]);

  // useEffect(() => {
  //   const getTemplates = async () => {
  //     const template = await fetchAllTemplate();
  //     const structuredTemplate = template?.map((item) => ({
  //       id: item.id,
  //       name: item.layoutName,
  //     }));

  //     setAllTemplateOptions(structuredTemplate);
  //   };
  //   getTemplates();
  // }, []);

  useEffect(() => {
    const getUsers = async () => {
      const data = await fetchAllUsers();

      if (data?.success) {
        const structuredOperators = data.result
          .map((item) => {
            return { id: item.email, name: item.email };
          })
          .filter((item) => item !== null);
        setAllOperators(structuredOperators);
      }
    };
    getUsers();
  }, []);
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await getJobDetail(props.jobId);
        const template = await fetchAllTemplate();
        const structuredTemplate = template?.map((item) => ({
          id: item.id,
          name: item.layoutName,
        }));
        console.log(res);
        const jobData = res?.result[0];
        setJobName(jobData.jobName);
        setSelectedTemplate(
          comparewithId(structuredTemplate, jobData.templateId)
        );
        setAllTemplateOptions(structuredTemplate);
        setDataName(jobData.dataFileName);
        setSelectedDataDirectory(jobData.dataPath);
        setDataType(comparewithId(fileType, jobData.dataType));
        const input = document.getElementById("image-enable-input");
        if (input) {
          if (jobData.imageColor || jobData.imagePath || jobData.imageType) {
            input.click();
            setImageName(jobData.imageName);
            setSelectedImageDirectory(jobData.imagePath);
            setImageType(comparewithId(imageTypeData, jobData.imageType));
            setImageDpi(comparewithId(imageDPIData, jobData.imageDpi));
            setImageColor(
              comparewithId(imageColorTypeData, jobData.imageColor)
            );
          }
        }
      } catch (err) {
        toast.warning("Cannot load the data");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);
  const createTemplateHandler = async () => {
    if (!jobName) {
      toast.error("Please enter job name");
      return;
    }
    if (!selectedTemplate) {
      toast.error("Please select template");
      return;
    }
    if (!selectedDataDirectory) {
      toast.error("Please select data directory");
      return;
    }
    if (!dataType) {
      toast.error("Please select data type");
      return;
    }
    if (!dataName) {
      toast.error("Please enter data name");
      return;
    }
    if (imageEnable) {
      if (!selectedImageDirectory) {
        toast.error("Please select image directory");
        return;
      }
      if (!imageType) {
        toast.error("Please select image type");
        return;
      }
      if (!imageDpi) {
        toast.error("Please select dpi");
        return;
      }
      if (!imageColor) {
        toast.error("Please select image color");
        return;
      }
      if (!imageName) {
        toast.error("Please enter image name");
        return;
      }
    }

    const jobObj = {
      id: props.jobId,
      assignUser: "",
      templateId: selectedTemplate?.id,
      dataPath: selectedDataDirectory,
      dataType: dataType?.id,
      imagePath: selectedImageDirectory,
      imageType: imageType?.id,
      imageColor: imageColor?.id,
      jobStatus: "pending",
      jobName: jobName,
      imageName: imageName,
      dataFileName: dataName,
      entryAt: new Date().toISOString(),
    };

    // console.log(jobObj);
    // return;
    const response = await updateJob(jobObj);
    console.log(response);
    if (response?.success) {
      // alert(response.message)
      toast.success(response.message);
      props.onHide();
    }

    console.log(response);
  };
  const handleFileChange2 = (event) => {
    const files = Array.from(event.target.files);
    // setSelectedFiles(files);
    // For demonstration, log file names
    files.forEach((file) => console.log("Selected File:", file.name));
  };

  const directoryChangeHandler = (directory) => {
    directory = directory.substring(1);
    // if (imageEnable) {
    //   setSelectedImageDirectory(directory);
    //   return;
    // }
    if (currentDirState === "image") {
      setSelectedImageDirectory(directory);
    } else {
      setSelectedDataDirectory(directory);
    }
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
        <Modal.Header>
          <Modal.Title id="modal-custom-navbar">Create Job</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ height: "65dvh", overflow: "auto" }}>
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
                <TextLoader message={"Loading Data, Please wait..."} />
              </div>
            </div>
          )}
          <Row className="mb-2">
            <label
              htmlFor="example-text-input"
              className="col-md-2  col-form-label"
              style={{ fontSize: ".9rem" }}
            >
              Job Name:
            </label>
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Enter the Job name"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
              />
            </div>
          </Row>
          <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-2 "
              style={{ fontSize: ".9rem" }}
            >
              Select Template:
            </label>
            <div className="col-md-10">
              <Select
                value={selectedTemplate}
                onChange={(selectedValue) => setSelectedTemplate(selectedValue)}
                options={allTemplateOptions}
                getOptionLabel={(option) => option?.name || ""}
                getOptionValue={(option) => option?.id?.toString() || ""}
                placeholder="Select template..."
              />
            </div>
          </Row>
          <Row className="mb-2">
            <label
              htmlFor="example-text-input"
              className="col-md-2  "
              style={{ fontSize: ".9rem" }}
            >
              Data File Name :
            </label>
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Enter the name of data file"
                value={dataName}
                onChange={(e) => setDataName(e.target.value)}
              />
            </div>
          </Row>
          <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-2  col-form-label"
              style={{ fontSize: ".9rem" }}
            >
              Data Path:
            </label>
            {selectedDataDirectory && (
              <div className="col-md-7">
                <input
                  type="text"
                  disabled
                  value={selectedDataDirectory}
                  className="form-control"
                  placeholder="Enter the data path"
                  onChange={(e) => setDataPath(e.target.value)}
                />
              </div>
            )}
            <div className={selectedDataDirectory ? "col-md-3" : "col-md-4"}>
              <Button
                variant="info"
                onClick={() => {
                  setCurrentDirState("data");
                  setDirectoryPickerModal(true);
                }}
              >
                Select Directory
              </Button>
            </div>
          </Row>
          <Row className="mb-2">
            <label
              htmlFor="example-text-input"
              className="col-md-2  col-form-label"
              style={{ fontSize: ".9rem" }}
            >
              Data Type:
            </label>
            <div className="col-md-10">
              <Select
                value={dataType}
                onChange={(selectedValue) => setDataType(selectedValue)}
                options={fileType}
                getOptionLabel={(option) => option?.name || ""}
                getOptionValue={(option) => option?.id?.toString() || ""}
                placeholder="Select file type..."
              />
            </div>
          </Row>
          <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-3  col-form-label"
              style={{ fontSize: ".9rem" }}
            >
              IMAGE
            </label>
            <div className="col-md-9">
              <Imageswitch
                value={imageEnable}
                onChange={(val) => changeHandler(val)}
              />
            </div>
          </Row>

          {imageEnable && (
            <>
              <Row className="mb-3">
                <label
                  htmlFor="example-text-input"
                  className="col-md-2  col-form-label"
                  style={{ fontSize: ".9rem" }}
                >
                  Image Path:
                </label>
                {selectedImageDirectory && (
                  <div className="col-md-7">
                    <input
                      type="text"
                      disabled
                      value={selectedImageDirectory}
                      className="form-control"
                      placeholder="Enter the data path"
                      onChange={(e) => setDataPath(e.target.value)}
                    />
                  </div>
                )}
                <div
                  className={selectedImageDirectory ? "col-md-3" : "col-md-4"}
                >
                  <Button
                    variant="info"
                    onClick={() => {
                      setCurrentDirState("image");
                      setDirectoryPickerModal(true);
                    }}
                  >
                    Select Directory
                  </Button>
                </div>
              </Row>
              <Row className="mb-2">
                <label
                  htmlFor="example-text-input"
                  className="col-md-2  col-form-label"
                  style={{ fontSize: ".9rem" }}
                >
                  Image Name:
                </label>
                <div className="col-md-10">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter the name of data file"
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
                  />
                </div>
              </Row>
              <Row className="mb-3">
                <label
                  htmlFor="example-text-input"
                  className="col-md-2  col-form-label"
                  style={{ fontSize: ".9rem" }}
                >
                  Image Type:
                </label>
                <div className="col-md-3">
                  <Select
                    value={imageType}
                    onChange={(selectedValue) => setImageType(selectedValue)}
                    options={imageTypeData}
                    getOptionLabel={(option) => option?.name || ""}
                    getOptionValue={(option) => option?.id?.toString() || ""}
                    placeholder="image type.."
                  />
                </div>

                <label
                  htmlFor="example-text-input"
                  className="col-md-1  col-form-label"
                  style={{ fontSize: ".9rem" }}
                >
                  DPI:
                </label>

                <div className="col-md-2">
                  <Select
                    value={imageDpi}
                    onChange={(selectedValue) => setImageDpi(selectedValue)}
                    options={imageDPIData}
                    getOptionLabel={(option) => option?.name || ""}
                    getOptionValue={(option) => option?.id?.toString() || ""}
                    placeholder="Dpi..."
                  />
                </div>
                <label
                  htmlFor="example-text-input"
                  className="col-md-1  col-form-label"
                  style={{ fontSize: ".9rem" }}
                >
                  Color:
                </label>
                <div className="col-md-3">
                  <Select
                    value={imageColor}
                    onChange={(selectedValue) => setImageColor(selectedValue)}
                    options={imageColorTypeData}
                    getOptionLabel={(option) => option?.name || ""}
                    getOptionValue={(option) => option?.id?.toString() || ""}
                    placeholder="Color type..."
                  />
                </div>
              </Row>
            </>
          )}
          {/* {imageEnable && <Row className="mb-3">
                            <label
                                htmlFor="example-text-input"
                                className="col-md-3  col-form-label"
                                style={{ fontSize: ".9rem" }}
                            >
                                Image DPI:
                            </label>

                            <div className="col-md-3">
                                <Select
                                    value={imageDpi}
                                    onChange={(selectedValue) =>
                                        setImageDpi(selectedValue)
                                    }
                                    options={imageDPIData}
                                    getOptionLabel={(option) => option?.name || ""}
                                    getOptionValue={(option) =>
                                        option?.id?.toString() || ""
                                    }
                                    placeholder="Select dpi..."
                                />
                            </div>
                            <label
                                htmlFor="example-text-input"
                                className="col-md-2  col-form-label"
                                style={{ fontSize: ".9rem" }}
                            >
                                Image Color:
                            </label>
                            <div className="col-md-4">
                                <Select
                                    value={selectedOperator}
                                    onChange={(selectedValue) =>
                                        setSelectedOperator(selectedValue)
                                    }
                                    options={imageColorTypeData}
                                    getOptionLabel={(option) => option?.name || ""}
                                    getOptionValue={(option) =>
                                        option?.id?.toString() || ""
                                    }
                                    placeholder="Select file type..."
                                />
                            </div>
                        </Row>} */}
        </Modal.Body>
        <Modal.Footer>
          <div style={{ width: "50%" }}>
            {/* <div class="mb-4" >
                        <label for="formFile" class="form-label">Upload OMR Image</label>
                        <input class="form-control" type="file" id="formFile" onChange={handleImageUpload} accept="image/*" />
                    </div> */}
          </div>
          <div
            className="w-20 flex-shrink-0"
            style={{
              content: "",
              width: "12%",
            }}
          ></div>{" "}
          {/* Spacer div */}
          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>
          <Button variant="success" onClick={createTemplateHandler}>
            Update Job
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ****************************directory picker modal************************** */}
      <Modal
        show={directoryPickerModal}
        // onHide={props.onHide}
        size="lg"
        aria-labelledby="modal-custom-navbar"
        centered
        dialogClassName="modal-90w"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title id="modal-custom-navbar">Select Directory</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ height: "65dvh" }}>
          <DirectoryPicker handleChange={directoryChangeHandler} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setDirectoryPickerModal(false);
            }}
          >
            Close
          </Button>
          {(selectedDataDirectory || selectedImageDirectory) && (
            <Button
              variant="success"
              onClick={() => {
                setDirectoryPickerModal(false);
              }}
            >
              Save Selected Directory
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      {/* ****************************directory picker modal************************** */}
    </>
  );
};

export default EditJobModal;
