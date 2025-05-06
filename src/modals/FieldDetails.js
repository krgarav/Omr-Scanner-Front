import React, { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import DataContext from "store/DataContext";
import Placeholder from "ui/Placeholder";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Table,
} from "reactstrap";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import IconButton from "@mui/material/IconButton";

const FieldDetails = (props) => {
  const [fields, setFields] = useState([]);
  const [animatingIndex, setAnimatingIndex] = useState(null);
  const [direction, setDirection] = useState(null);
  const dataCtx = useContext(DataContext);

  useEffect(() => {
    if (props.selected) {
      setFields(props.selected);
    }
  }, [props.selected]);

  const moveUp = (index) => {
    if (index > 0) {
      setAnimatingIndex(index);
      setDirection("up");
      setTimeout(() => {
        const newFields = [...fields];
        [newFields[index], newFields[index - 1]] = [
          newFields[index - 1],
          newFields[index],
        ];
        setFields(newFields);
        setAnimatingIndex(null);
        setDirection(null);
        resetAnimation();
      }, 300);
    }
  };

  const moveDown = (index) => {
    if (index < fields.length - 1) {
      setAnimatingIndex(index);
      setDirection("down");
      setTimeout(() => {
        const newFields = [...fields];
        [newFields[index], newFields[index + 1]] = [
          newFields[index + 1],
          newFields[index],
        ];
        setFields(newFields);
        setAnimatingIndex(null);
        setDirection(null);
        resetAnimation();
      }, 300);
    } 
  };
  const resetAnimation = () => {
    setAnimatingIndex(null);
    setDirection(null);
  };
  const LoadedTemplates = fields?.map((item, i) => {
    const isAnimating = animatingIndex === i;
    const slno = isAnimating ? (direction === "up" ? i + 1 : i - 1) : i + 1;
    return (
      <tr
        key={i}
        style={{
          backgroundColor: isAnimating
            ? direction === "up"
              ? "#f0f0f0"
              : "#d9d9d9"
            : "transparent",
          transition:
            "background-color 0.3s ease-in-out, transform 0.3s ease-in-out",
          transform: isAnimating
            ? direction === "up"
              ? "translateY(-50px)"
              : "translateY(50px)"
            : "none",
        }}
      >
        <td>{slno}</td> {/* Serial number */}
        <td>{item.name}</td>
        <td>{item.fieldType}</td>
        <td>
          <IconButton onClick={() => moveUp(i)} aria-label="move up">
            <ArrowCircleUpIcon fontSize="inherit" />
          </IconButton>
          <IconButton onClick={() => moveDown(i)} aria-label="move down">
            <ArrowCircleDownIcon fontSize="inherit" />
          </IconButton>
        </td>
        <td>
          <UncontrolledDropdown>
            <DropdownToggle
              className="btn-icon-only "
              href="#pablo"
              role="button"
              size="sm"
              onClick={(e) => e.preventDefault()}
            >
              <i className="fas fa-ellipsis-v" />
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem 
              onClick={() =>{ 
              
              console.log(item, i)
                props.editHandler(item, i)
                }
              }
                >Edit</DropdownItem>
              <DropdownItem style={{ color: "red" }}>Delete</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </td>
      </tr>
    );
  });

  const placeHolderJobs = new Array(8).fill(null).map((_, index) => (
    <tr key={index}>
      <td>
        <Placeholder width="20%" height="1.5em" />
      </td>
      <td>
        <Placeholder width="60%" height="1.5em" />
      </td>
      <td>
        <Placeholder width="60%" height="1.5em" />
      </td>
      <td>
        <Placeholder width="60%" height="1.5em" />
      </td>
      <td>
        <Placeholder width="60%" height="1.5em" />
      </td>
      <td>
        <Placeholder width="15%" height="1.5em" />
      </td>
    </tr>
  ));

  return (
    <Modal
      show={props.show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">All Fields</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: "60vh", overflow: "auto", paddingTop:"0",marginTop:"10px" }}>
        <Table
          className="align-items-center table-flush mb-5 table-hover"
          // responsive
        >
          <thead className="thead-light"
             style={{ position: 'sticky', top: 0, zIndex: 1,backgroundColor: 'white' }}
          >
            <tr>
              <th scope="col">SL no.</th>
              <th scope="col">Field Name</th>
              <th scope="col">Field Type</th>
              <th scope="col">Change Direction</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {props.fieldsLoading ? placeHolderJobs : LoadedTemplates}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          variant="danger"
          onClick={props.onHide}
          className="waves-effect waves-light"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="success"
          className="waves-effect waves-light"
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FieldDetails;
