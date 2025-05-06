import axios from "axios";
import { assignJob } from "helper/job_helper";
import { fetchAllUsers } from "helper/userManagment_helper";
import React, { useContext, useEffect, useState } from "react";
import { Modal, Button, Row } from "react-bootstrap";
import Select, { components } from "react-select";
import { toast } from "react-toastify";

const AssignModal = (props) => {
  const [modalShow, setModalShow] = useState(false);
  const [allOperators, setAllOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState("");

  useEffect(() => {
    if (props.show) {
      setModalShow(true);
    } else {
      setModalShow(false);
    }
  }, [props.show]);
  useEffect(() => {
    const getUsers = async () => {
      const data = await fetchAllUsers();
      console.log(data.result);
      if (data?.success) {
        const structuredOperators = data.result.map((item) => {
          return { id: item.id, name: item.email };
        });

        setAllOperators(structuredOperators);
      }
      // const structuredTemplate = template.map((item) => ({ id: item.id, name: item.layoutName }))
      // console.log(structuredTemplate)
      // setAllTemplateOptions(structuredTemplate);
    };
    getUsers();
  }, []);

  const assignJobHandler = async () => {
    if (!selectedOperator) {
      alert("Please select the operator");
      return;
    }
    const assignJobData = { ...props.jobData, assignUser: selectedOperator.id };

    const response = await assignJob(assignJobData);
    if (response?.success) {
      toast.success(response?.message);
      props.onHide();
    }
  };
  return (
    <>
      <Modal
        show={modalShow}
        onHide={props.onHide}
        size="md"
        aria-labelledby="modal-custom-navbar"
        centered
        dialogClassName="modal-80w"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title id="modal-custom-navbar">Assign Job</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ height: "50dvh" }}>
          <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-3 "
              style={{ fontSize: ".9rem" }}
            >
              Choose Assignee:
            </label>
            <div className="col-md-9">
              <Select
                value={selectedOperator}
                onChange={(selectedValue) => setSelectedOperator(selectedValue)}
                options={allOperators}
                getOptionLabel={(option) => option?.name || ""}
                getOptionValue={(option) => option?.id?.toString() || ""}
                placeholder="Please Select Assignee.."
              />
            </div>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>
          <Button variant="success" onClick={assignJobHandler}>
            Assign Job
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AssignModal;
