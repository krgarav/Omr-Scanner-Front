import React, { useEffect, forwardRef, useState } from "react";
import { Modal, Button, Row, Col, Spinner, Form } from "react-bootstrap";

const FormData = forwardRef(
  (
    {
      setCurrentBoxData,
      currentBoxData,
      setBoxes,
      activeBox,
      allBubbles,
      isNewBox,
      setIsOpen,
      setActiveBox,
    },
    ref
  ) => {
    const [customInput, setCustomInput] = useState("");

    useEffect(() => {
      if (isNewBox) {
        setCurrentBoxData({});
      }
    }, [isNewBox]);

    useEffect(() => {
      if (Array.isArray(currentBoxData?.Custom)) {
        setCustomInput(currentBoxData.Custom.join(", "));
      }
    }, []);

    const onSubmitHandler = (e) => {
      e.preventDefault();
      if (!currentBoxData) {
        alert("Please fill all the fields");
        return;
      }
      const {
        totalRow,
        totalCol,
        fieldName,
        fieldType,
        ReadingDirection,
        allowMultiple,
        fieldValue,
        bubbleIntensity,
      } = currentBoxData;

      if (
        !totalRow ||
        !totalCol ||
        !fieldName ||
        !fieldType ||
        !ReadingDirection ||
        !allowMultiple ||
        !fieldValue ||
        !bubbleIntensity
      ) {
        alert("Please complete all required fields.");
        return;
      }

      // Ensure totalRow and totalCol are positive numbers
      if (Number(totalRow) <= 0 || Number(totalCol) <= 0) {
        alert("Row and Column values must be greater than 0.");
        return;
      }
      if (isNewBox) {
        setBoxes((prevBoxes) => [
          ...prevBoxes,
          {
            ...currentBoxData,
            x: 100,
            y: 100,
            width: 150,
            height: 100,
          },
        ]);
        setCurrentBoxData({});
        setIsOpen(false);
      } else {
        setBoxes((prevBoxes) =>
          prevBoxes.map((box, idx) =>
            idx === activeBox ? { ...currentBoxData } : box
          )
        );
        setActiveBox(null);
      }
    };

    return (
      <Form
        onSubmit={onSubmitHandler}
        className="p-4 bg-white rounded shadow-sm"
      >
        <h2 className="text-center mb-4">Box Settings</h2>

        <Row>
          <Col md={6}>
            <Form.Group controlId="totalCol">
              <Form.Label>Row:</Form.Label>
              <Form.Control
                type="number"
                value={currentBoxData?.totalRow}
                onChange={(e) =>
                  setCurrentBoxData((prev) => ({
                    ...prev,
                    totalRow: e.target.value,
                  }))
                }
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="totalRow">
              <Form.Label>Col:</Form.Label>
              <Form.Control
                type="number"
                value={currentBoxData?.totalCol}
                onChange={(e) =>
                  setCurrentBoxData((prev) => ({
                    ...prev,
                    totalCol: e.target.value,
                  }))
                }
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="fieldName">
              <Form.Label>Field Name:</Form.Label>
              <Form.Control
                type="text"
                value={currentBoxData?.fieldName}
                onChange={(e) =>
                  setCurrentBoxData((prev) => ({
                    ...prev,
                    fieldName: e.target.value,
                  }))
                }
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="fieldType">
              <Form.Label>Field Type:</Form.Label>
              <Form.Control
                as="select"
                value={currentBoxData?.fieldType}
                onChange={(e) =>
                  setCurrentBoxData((prev) => ({
                    ...prev,
                    fieldType: e.target.value,
                  }))
                }
              >
                <option value="">Select direction</option>
                <option value="formfield">Form Field</option>
                <option value="questionfield">Question Field</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="readingDirection">
              <Form.Label>Reading Direction:</Form.Label>
              <Form.Control
                as="select"
                value={currentBoxData?.ReadingDirection ?? ""}
                onChange={(e) =>
                  setCurrentBoxData((prev) => ({
                    ...prev,
                    ReadingDirection: e.target.value,
                  }))
                }
              >
                <option value="">Select direction</option>
                <option value="Horizontal">Horizontal</option>
                <option value="Vertical">Vertical</option>
              </Form.Control>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="allowMultiple">
              <Form.Label>Allow Multiple:</Form.Label>
              <Form.Control
                as="select"
                value={currentBoxData?.allowMultiple ?? ""}
                onChange={(e) =>
                  setCurrentBoxData((prev) => ({
                    ...prev,
                    allowMultiple: e.target.value,
                  }))
                }
              >
                <option value="">Select multiple</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Group controlId="readingDirection">
              <Form.Label>Field Value:</Form.Label>
              <Form.Control
                as="select"
                value={currentBoxData?.fieldValue ?? ""}
                onChange={(e) => {
                  if (e.target.value !== "Custom") {
                    setCurrentBoxData((prev) => {
                      const copiedData = { ...prev };
                      delete copiedData.Custom; // remove Custom property
                      return copiedData;
                    });
                  }
                  setCurrentBoxData((prev) => ({
                    ...prev,
                    fieldValue: e.target.value,
                  }));
                }}
              >
                <option value="">Select field value</option>
                <option value="Integer">Integer</option>
                <option value="Alphabet">Alphabet</option>
                <option value="Custom">Custom</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        {currentBoxData?.fieldValue === "Custom" && (
          <Row>
            <Col md={12}>
              <Form.Group controlId="readingDirection">
                <Form.Label>Custom Value:</Form.Label>
                <Form.Control
                  as="input"
                  value={customInput}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setCustomInput(inputValue); // allow free typing

                    const parsedArray = inputValue
                      .split(",")
                      .map((item) => item.trim())
                      .filter((item) => item.length > 0);

                    setCurrentBoxData((prev) => ({
                      ...prev,
                      Custom: parsedArray,
                    }));
                  }}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
        )}

        <Row>
          <Col md={6}>
            <Form.Group controlId="margin">
              <Form.Label>
                Margin: <strong>{currentBoxData?.gap}</strong>
              </Form.Label>
              <Form.Control
                type="range"
                min={0}
                max={80}
                step={0.1}
                value={currentBoxData?.gap}
                onChange={(e) => {
                  setCurrentBoxData((prev) => ({
                    ...prev,
                    gap: e.target.value,
                  }));
                  setBoxes((prevBoxes) =>
                    prevBoxes.map((box, idx) =>
                      idx === activeBox ? { ...box, gap: e.target.value } : box
                    )
                  );
                }}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="sensitivity">
              <Form.Label>
                Sensitivity: <strong>{currentBoxData?.bubbleIntensity}</strong>
              </Form.Label>
              <Form.Control
                type="range"
                min={-1}
                max={30}
                step={0.1}
                value={currentBoxData?.bubbleIntensity}
                onChange={(e) =>
                  setCurrentBoxData((prev) => ({
                    ...prev,
                    bubbleIntensity: Number(e.target.value),
                  }))
                }
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="text-right mt-4">
          <Button
            style={{ display: isNewBox ? "none" : "" }}
            ref={ref}
            type="submit"
            variant="primary"
          >
            Save
          </Button>
        </div>
      </Form>
    );
  }
);

export default FormData;
