import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Col, Spinner } from "react-bootstrap";
import PrintFieldModal from "./PrintFieldModal";
import { checkPrintData } from "helper/Booklet32Page_helper";
const PrintModal = ({ show }) => {
  const [showPrint, setShowPrint] = useState(true);
  const [showPrintForm, setShowPrintForm] = useState(false);
  const [printDataEmpty, setPrintDataEmpty] = useState(false);
  const [printData, setPrintData] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const tempId = JSON.parse(localStorage.getItem("scantemplateId"));
        const res = await checkPrintData(tempId);
        console.log(res);

        if (res === undefined) {
          setPrintDataEmpty(true);
        } else {
          setPrintData(res);
          setPrintDataEmpty(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
            {printDataEmpty
              ? " Would you like to add printing option to the sheets?"
              : "Would you like to change printing option of the sheets?"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Footer style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="success"
            onClick={() => {
              setShowPrintForm(true);
              // setShowPrint(false)
            }}
          >
            Yes
          </Button>
          <Button
            variant="warning"
            onClick={() => {
              setShowPrint(false);
            }}
          >
            No
          </Button>
        </Modal.Footer>
      </Modal>
      {showPrintForm && (
        <PrintFieldModal
          show={showPrintForm}
          onHide={() => {
            setShowPrint(false)
            setShowPrintForm(false);


          }}
          data={printData}
        />
      )}
    </>
  );
};

export default PrintModal;
