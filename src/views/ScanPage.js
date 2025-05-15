import NormalHeader from "components/Headers/NormalHeader";
import { fetchAllTemplate } from "helper/TemplateHelper";
import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ScanPage = () => {
  const [showPrint, setShowPrint] = useState(true);
  const [showPrintForm, setShowPrintForm] = useState(false);
  const [template, setTemplate] = useState([]);
  const [printDataEmpty, setPrintDataEmpty] = useState(false);
  const [printData, setPrintData] = useState({});
  const [folderName, setFolderName] = useState(null);
  const [templateId, setTemplateId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const templates = await fetchAllTemplate();
        if (templates) {
          setTemplate(templates?.body);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const allTemplate = template.map((item, index) => {
    return (
      <option key={index} value={item.id}>
        {item.fileName}
      </option>
    );
  });
  const handleSuccess = () => {
    if (!folderName) {
      alert("No Folder Selected");
      return;
    }
    if (!templateId) {
      alert("No Template Selected");
      return;
    }
    localStorage.setItem("folderName", folderName);
    localStorage.setItem("templateId", templateId);
    navigate("/admin/job-queue/adminscanjob");
    setShowPrint(false);
  };
  return (
    <>
      <NormalHeader />
      <div
        className=" top-50 start-50 translate-middle bg-white p-4 shadow rounded"
        style={{
          position: "absolute",
          top: "150px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px",
          zIndex: 999,
          width: "400px", // Optional, for consistent width
        }}
      >
        <h5 className="mb-3">Please Select the template and upload folder:</h5>

        <div className="mb-3">
          <label htmlFor="nameInput" className="form-label">
            Folder
          </label>
          <input
            type="text"
            className="form-control"
            id="nameInput"
            placeholder="Select Folder"
            onChange={(e) => setFolderName(e.target.value)}
            value={folderName}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="optionSelect" className="form-label">
            Select Option
          </label>
          <select
            className="form-control"
            id="optionSelect"
            onChange={(e) => setTemplateId(e.target.value)}
            value={templateId}
          >
            <option value="">-- Select an option --</option>
            {allTemplate}
          </select>
        </div>

        <div className="d-flex justify-content-center">
          <button className="btn btn-success" onClick={handleSuccess}>
            Confirm
          </button>
        </div>

        <button
          type="button"
          className="btn-close position-absolute top-0 end-0 m-3"
          aria-label="Close"
          onClick={() => setShowPrint(false)}
        ></button>
      </div>
    </>
  );
};

export default ScanPage;
