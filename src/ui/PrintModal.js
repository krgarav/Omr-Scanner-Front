import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Col, Spinner } from "react-bootstrap";
import PrintFieldModal from "./PrintFieldModal";
import { checkPrintData } from "helper/Booklet32Page_helper";
import { fetchAllTemplate } from "helper/TemplateHelper";
const PrintModal = ({ show }) => {
  const [showPrint, setShowPrint] = useState(true);
  const [showPrintForm, setShowPrintForm] = useState(false);
  const [template, setTemplate] = useState([]);
  const [printDataEmpty, setPrintDataEmpty] = useState(false);
  const [printData, setPrintData] = useState({});
  const [loading, setLoading] = useState(false);
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

  if (loading) {
    return (
      <>
        <Modal
          show={showPrint}
          onHide={() => {
            setShowPrint(false);
          }}
          size="sm"
          aria-labelledby="modal-custom-navbar"
          centered
          dialogClassName="modal-50w"
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
              id="modal-custom-navbar"
            >
              <Spinner />
            </Modal.Title>
          </Modal.Header>

          <Modal.Footer style={{ display: "flex", justifyContent: "center" }}>
            Loading ...
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  return (
    <>
      <Modal
        show={showPrint}
        onHide={() => {
          setShowPrint(false);
        }}
        size="sm"
        aria-labelledby="modal-custom-navbar"
        centered
        dialogClassName="modal-50w"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title id="modal-custom-navbar">
            Please Select the template and upload folder:-
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="nameInput" className="form-label">
              Folder
            </label>
            <input
              type="text"
              className="form-control"
              id="nameInput"
              placeholder="Select Folder"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="optionSelect" className="form-label">
              Select Option
            </label>
            <select className="form-control" id="optionSelect">
              <option value="">-- Select an option --</option>
              {allTemplate}
            </select>
          </div>
        </Modal.Body>

        <Modal.Footer style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="success"
            onClick={() => {
              // setShowPrintForm(true);
              setShowPrint(false);
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      {showPrintForm && (
        <PrintFieldModal
          show={showPrintForm}
          onHide={() => {
            setShowPrint(false);
            setShowPrintForm(false);
          }}
          data={printData}
        />
      )}
    </>
  );
};

export default PrintModal;
