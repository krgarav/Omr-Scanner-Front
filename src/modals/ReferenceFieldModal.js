import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ReferenceFieldModal = ({ show, onClose, onSave, options }) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [availableOptions, setAvailableOptions] = useState([]);

  const handleSave = () => {
    onSave(selectedValue);
    onClose();
  };
  useEffect(() => {
    if (options && options.length > 0) {
      setAvailableOptions(options);
    }
  }, [options]);

  const allOptions = availableOptions.map((option) => {
    return (
      <option key={option.id} value={option.id}>
        {option.label}
      </option>
    );
  });
  return (
    <Modal show={show} onHide={onClose}>
      <div className="modal-header">
        <h5 className="modal-title">Select Reference Field Value</h5>
        <button type="button" className="close" onClick={onClose}>
          <span>&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <select
          className="form-control"
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
        >
          <option value="">-- Select --</option>
          {allOptions}
          {/* <option value="topLeft">Top Left</option>
          <option value="bottomLeft">Bottom Left</option>
          <option value="topRight">Top Right</option>
          <option value="bottomRight">Bottom Right</option> */}
        </select>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
        <button type="button" className="btn btn-primary" onClick={handleSave}>
          Save
        </button>
      </div>
    </Modal>
  );
};

export default ReferenceFieldModal;
