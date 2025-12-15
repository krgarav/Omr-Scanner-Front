import React, { useEffect, forwardRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Modal, Button, Row, Col, Spinner, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

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
      // setRadius,
      // Radius,
    },
    ref
  ) => {
    const [customInput, setCustomInput] = useState('');
    console.log(currentBoxData);

    useEffect(() => {
      if (isNewBox) {
        setCurrentBoxData({});
      }
    }, [isNewBox]);

    useEffect(() => {
      if (Array.isArray(currentBoxData?.Custom)) {
        setCustomInput(currentBoxData.Custom.join(', '));
      }
    }, []);

    const QUESTION_NAME_REGEX = /^([qQ])(\d+)-([qQ])(\d+)$/;

    function parseQuestionRange(name) {
      if (!name || typeof name !== 'string') return null;
      const m = name.trim().match(QUESTION_NAME_REGEX);
      if (!m) return null;

      const prefix = m[1];
      const start = Number(m[2]);
      const end = Number(m[4]);

      if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
      if (end <= start) return null; // enforce increasing range

      return {
        prefix,
        start,
        end,
        gap: end - start + 1,
      };
    }

    const onSubmitHandler = (e) => {
      e.preventDefault();

      if (!currentBoxData) {
        alert('Please fill all the fields');
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

      // Basic required fields validation
      if (
        !fieldName ||
        !fieldType ||
        !ReadingDirection ||
        !allowMultiple ||
        !bubbleIntensity
      ) {
        alert('Please complete all required fields.');
        return;
      }

      // Validate positive row/column
      if (Number(totalRow) <= 0 || Number(totalCol) <= 0) {
        alert('Row and Column values must be greater than 0.');
        return;
      }

      // ---------------------------
      // QUESTION FIELD VALIDATION
      // ---------------------------
      if (fieldType === 'questionfield') {
        const parsed = parseQuestionRange(fieldName);

        if (!parsed) {
          toast.error(
            'Invalid question field name. Use format q1-q10 or Q1-Q10.'
          );
          return;
        }
      }

      // ---------------------------
      // CREATE NEW BOX
      // ---------------------------
      if (isNewBox) {
        setBoxes((prevBoxes) => [
          ...prevBoxes,
          {
            id: uuidv4(),
            ...currentBoxData,
            x: 100,
            y: 100,
            width: 150,
            height: 100,
            radius: currentBoxData?.radius,
            isMerged: false,
            merge: false,
          },
        ]);

        setCurrentBoxData({});
        setIsOpen(false);
        return;
      }

      // ---------------------------
      // UPDATE EXISTING BOX
      // ---------------------------
      setBoxes((prevBoxes) =>
        prevBoxes.map((box, idx) =>
          idx === activeBox
            ? {
                ...currentBoxData,
                fieldName: currentBoxData.fieldName?.trim(),
              }
            : box
        )
      );

      setActiveBox(null);
    };

    return (
      <Form
        onSubmit={onSubmitHandler}
        className='p--2 bg-white rounded shadow-sm '
      >
        <h2 className='text-center mb-1'>Box Settings</h2>

        {currentBoxData?.fieldType !== 'barcode' && (
          <Row>
            <Col md={6}>
              <Form.Group controlId='totalCol'>
                <Form.Label>Row:</Form.Label>
                <Form.Control
                  type='number'
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
              <Form.Group controlId='totalRow'>
                <Form.Label>Col:</Form.Label>
                <Form.Control
                  type='number'
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
        )}

        <Row className='mt-2'>
          <Col md={6}>
            <Form.Group controlId='fieldName'>
              <Form.Label>Field Name:</Form.Label>
              <Form.Control
                type='text'
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
            <Form.Group controlId='fieldType'>
              <Form.Label>Field Type:</Form.Label>
              <Form.Control
                as='select'
                value={currentBoxData?.fieldType}
                onChange={(e) =>
                  setCurrentBoxData((prev) => ({
                    ...prev,
                    fieldType: e.target.value,
                  }))
                }
              >
                <option value=''>Select direction</option>
                <option value='formfield'>Form Field</option>
                <option value='questionfield'>Question Field</option>
                <option value='barcode'>Barcode</option>
                <option value='lithocode'>lithocode</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row className='mt-2'>
          <Col md={6}>
            <Form.Group controlId='readingDirection'>
              <Form.Label>Reading Direction:</Form.Label>
              <Form.Control
                as='select'
                value={currentBoxData?.ReadingDirection ?? ''}
                onChange={(e) =>
                  setCurrentBoxData((prev) => ({
                    ...prev,
                    ReadingDirection: e.target.value,
                  }))
                }
              >
                <option value=''>Select direction</option>
                <option value='Horizontal'>Horizontal</option>
                <option value='Vertical'>Vertical</option>
              </Form.Control>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId='allowMultiple'>
              <Form.Label>Allow Multiple:</Form.Label>
              <Form.Control
                as='select'
                value={currentBoxData?.allowMultiple ?? ''}
                onChange={(e) =>
                  setCurrentBoxData((prev) => ({
                    ...prev,
                    allowMultiple: e.target.value,
                  }))
                }
              >
                <option value=''>Select multiple</option>
                <option value='true'>True</option>
                <option value='false'>False</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row className='mt-2'>
          {currentBoxData?.allowMultiple === 'false' && (
            <Col md={6}>
              <Form.Group controlId='allowMultiple'>
                <Form.Label>Multiple Value:</Form.Label>
                <Form.Control
                  as='input'
                  maxLength={1}
                  placeholder='Enter multiple value'
                  value={currentBoxData?.multipleBubbleOutput ?? ''}
                  onChange={(e) =>
                    setCurrentBoxData((prev) => ({
                      ...prev,
                      multipleBubbleOutput: e.target.value,
                    }))
                  }
                ></Form.Control>
              </Form.Group>
            </Col>
          )}
          <Col md={currentBoxData?.allowMultiple === 'false' ? 6 : 12}>
            <Form.Group controlId='allowMultiple'>
              <Form.Label>Blank Value:</Form.Label>
              <Form.Control
                as='input'
                maxLength={1}
                value={currentBoxData?.blankOuputSymbol ?? ''}
                placeholder='Enter blank value'
                onChange={(e) =>
                  setCurrentBoxData((prev) => ({
                    ...prev,
                    blankOuputSymbol: e.target.value,
                  }))
                }
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>

        {currentBoxData?.fieldType !== 'barcode' && (
          <Row className='mt-2'>
            <Col md={12}>
              <Form.Group controlId='readingDirection'>
                <Form.Label>Field Value:</Form.Label>
                <Form.Control
                  as='select'
                  value={currentBoxData?.fieldValue ?? ''}
                  onChange={(e) => {
                    if (e.target.value !== 'Custom') {
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
                  <option value=''>Select field value</option>
                  <option value='Integer'>Integer</option>
                  <option value='Alphabet'>Alphabet</option>
                  <option value='Custom'>Custom</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
        )}
        {currentBoxData?.fieldValue === 'Custom' && (
          <Row className='mt-2'>
            <Col md={12}>
              <Form.Group controlId='readingDirection'>
                <Form.Label>Custom Value:</Form.Label>
                <Form.Control
                  as='input'
                  value={customInput}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setCustomInput(inputValue); // allow free typing

                    const parsedArray = inputValue
                      .split(',')
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

        <Row className='mt-2'>
          {/*  <Col md={6}>
            <Form.Group controlId='margin'>
              <Form.Label>
                Margin: <strong>{currentBoxData?.gap}</strong>
              </Form.Label>
              <Form.Control
                type='range'
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
          </Col> */}

          <Col md={6}>
            <Form.Group controlId='sensitivity'>
              <Form.Label>
                Sensitivity: <strong>{currentBoxData?.bubbleIntensity}</strong>
              </Form.Label>
              <Form.Control
                type='range'
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

          {currentBoxData?.fieldType !== 'barcode' && (
            <Col md={6}>
              <Form.Group controlId='radius'>
                <Form.Label>
                  Radius: <strong>{currentBoxData?.radius}</strong>
                </Form.Label>

                <Form.Control
                  type='range'
                  min={0.01}
                  max={0.7}
                  step={0.001}
                  value={currentBoxData?.radius}
                  onChange={(e) => {
                    // setRadius(Number(e.target.value));
                    const val = Number(e.target.value);
                    setCurrentBoxData((p) => ({ ...p, radius: val }));
                    setBoxes((prev) =>
                      prev.map((b, i) =>
                        i === activeBox ? { ...b, radius: val } : b
                      )
                    );
                  }}
                />
              </Form.Group>
            </Col>
          )}
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId='best_bubble'>
              <Form.Label>
                Best Bubble : <strong>{currentBoxData?.best_bubble}</strong>
              </Form.Label>

              <div
                className={`btn btn-sm  d-flex align-items-center justify-content-between ${
                  currentBoxData?.best_bubble
                    ? 'btn-success'
                    : 'btn-outline-secondary'
                }`}
                onClick={() => {
                  const newValue = !currentBoxData?.best_bubble;
                  setCurrentBoxData((p) => ({ ...p, best_bubble: newValue }));
                  setBoxes((prev) =>
                    prev.map((b, i) =>
                      i === activeBox ? { ...b, best_bubble: newValue } : b
                    )
                  );
                  // console.log(currentBoxData?.best_bubble)
                }}
                style={{
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  borderRadius: '60px',
                  width: '70px',
                  boxShadow: '0px 0px 4px gray',
                  backgroundColor: currentBoxData?.best_bubble
                    ? '##2dce89'
                    : '#e3e3e3',
                }}
              >
                <span
                  className={
                    currentBoxData?.best_bubble ? 'fw-bold' : 'text-muted'
                  }
                >
                  OFF
                </span>

                <div
                  className='bg-white rounded-circle shadow-sm'
                  style={{
                    width: '24px',
                    height: '24px',
                    position: 'absolute',
                    left: currentBoxData?.best_bubble
                      ? 'calc(100% - 24px)'
                      : '2px',
                    transition: 'left 0.3s ease',
                    boxShadow: '2px 2px 4px black',
                  }}
                />

                <span
                  className={
                    currentBoxData?.best_bubble ? 'fw-bold' : 'text-muted'
                  }
                >
                  ON
                </span>
              </div>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId='merge'>
              <Form.Label>
                Link : <strong>{currentBoxData?.merge ? '' : ''}</strong>
              </Form.Label>

              <div
                className={`btn btn-sm d-flex align-items-center justify-content-between ${
                  currentBoxData?.merge
                    ? 'btn-warning'
                    : 'btn-outline-secondary'
                }`}
                onClick={() => {
                  const newValue = !currentBoxData?.merge;

                  setCurrentBoxData((p) => ({ ...p, merge: newValue }));

                  setBoxes((prev) =>
                    prev.map((b, i) =>
                      i === activeBox ? { ...b, merge: newValue } : b
                    )
                  );
                }}
                style={{
                  cursor: 'pointer',
                  borderRadius: '60px',
                  width: '90px',
                  boxShadow: '0px 0px 4px gray',
                }}
              >
                <span
                  className={currentBoxData?.merge ? 'fw-bold' : 'text-muted'}
                >
                  OFF
                </span>

                <div
                  className='bg-white rounded-circle shadow-sm'
                  style={{
                    width: '24px',
                    height: '24px',
                    position: 'absolute',
                    left: currentBoxData?.merge ? 'calc(100% - 24px)' : '2px',
                    transition: 'left 0.3s ease',
                  }}
                />

                <span
                  className={currentBoxData?.merge ? 'fw-bold' : 'text-muted'}
                >
                  ON
                </span>
              </div>
            </Form.Group>
          </Col>
        </Row>

        <div className='text-right mt-1'>
          <Button
            style={{ display: isNewBox ? 'none' : '' }}
            ref={ref}
            type='submit'
            variant='primary'
          >
            Save
          </Button>
        </div>
      </Form>
    );
  }
);

export default FormData;
