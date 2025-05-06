import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const IpModal = ({ show, onHide, onSave }) => {
  const [ip, setIp] = useState("");
  const [protocol, setProtocol] = useState('http');
  const handleSave = () => {
    onSave(ip,protocol);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Set Application IP</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
          <Form.Group controlId="formBasicIP">
            <Form.Label>Application IP</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Application IP"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
            />
          </Form.Group>
          {/* <Form.Group controlId="formBasicProtocol">
            <Form.Label>Protocol</Form.Label>
            <Form.Control
              as="select"
              value={protocol}
              onChange={(e) => setProtocol(e.target.value)}
            >
              <option value="http">HTTP</option>
              <option value="https">HTTPS</option>
            </Form.Control>
          </Form.Group> */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default IpModal;
