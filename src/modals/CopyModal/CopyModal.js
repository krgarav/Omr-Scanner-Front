import React, { useContext, useEffect, useRef, useState } from "react";
import { Row } from "reactstrap";
import { Modal, Button, Col } from "react-bootstrap";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Grid, Box } from "@mui/material";
const CopyModal = (props) => {
    const [modalShow, setModalShow] = useState(false);
    const [value, setValue] = useState('top'); // Default value
    const [pitchValue, setPitchValue] = useState(null);
    const handleChange = (event) => {
        setValue(event.target.value);
    };
    
    const saveRegion = () => {
        // try {
        //     if (!value) {
        //         alert("Please select Position.")
        //     }
        //     if (pitchValue) {
        //         alert("Pitch value cannot be blank.")
        //     }


        // } catch (err) {
        //     console.log(err)
        // }
    props.saveRegion(pitchValue,value)
    }
    return (
        <Modal
            show={props.show}
            size="md"
        // onHide={() => setModalShow(false)}
        >
            <Modal.Header >
                <Modal.Title
                    style={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    SELECT COPYING  AREA
                </Modal.Title>
            </Modal.Header>
            <Modal.Body
                style={{ width: "100%", height: "65dvh", overflow: "auto" }}
            >
                <Box
                    sx={{
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '16px',
                        maxWidth: '300px',
                        margin: 'auto', // Center the box horizontally
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    }}
                >
                    <FormControl component="fieldset" fullWidth >
                        <FormLabel component="legend" sx={{
                            textAlign: 'center',
                            display: 'block', // Ensure it takes up full width
                            marginBottom: '16px', // Add some space below the label
                        }}>Label placement</FormLabel>
                        <RadioGroup value={value} onChange={handleChange}>
                            <Grid container spacing={2} alignItems="center">
                                {/* Top */}
                                <Grid item xs={12} style={{ textAlign: "center" }}>
                                    <FormControlLabel
                                        value="top"
                                        control={<Radio />}
                                        label="Top"
                                        labelPlacement="top"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Grid container justifyContent="space-between" alignItems="center">
                                        {/* Start (Left) */}
                                        <FormControlLabel
                                            value="start"
                                            control={<Radio />}
                                            label="Start"
                                            labelPlacement="start"
                                        />

                                        {/* Empty space to place the end button on the other side */}
                                        <div style={{ flexGrow: 1 }}></div>

                                        {/* End (Right) */}
                                        <FormControlLabel
                                            value="end"
                                            control={<Radio />}
                                            label="End"
                                            labelPlacement="end"
                                        />
                                    </Grid>
                                </Grid>

                                {/* Bottom */}
                                <Grid item xs={12} style={{ textAlign: "center" }}>
                                    <FormControlLabel
                                        value="bottom"
                                        control={<Radio />}
                                        label="Bottom"
                                        labelPlacement="bottom"
                                    />
                                </Grid>
                            </Grid>
                        </RadioGroup>
                    </FormControl>
                </Box>
                <Box
                    sx={{
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '16px',
                        maxWidth: '300px',
                        margin: 'auto', // Center the box horizontally
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    }}
                >
                    <Row>
                        <label htmlFor="example-text-input" className="col-md-2 col-form-label " >
                            Pitch
                        </label>
                        <div className="col-10 ">
                            <input
                                type="number"
                                className="form-control"
                                value={pitchValue}
                                onChange={(e) => setPitchValue(e.target.value)}
                                placeholder="Enter pitch"
                            />
                            <small id="passwordHelpBlock" class="form-text text-muted">
                                Specify the number after which the area should be copied.
                            </small>
                        </div>
                    </Row>
                </Box>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    type="button"
                    variant="danger"
                    onClick={() => props.onHide()}
                    className="waves-effect waves-light"
                >
                    Close
                </Button>
                <Button
                    type="button"
                    variant="success"
                    // disabled
                    onClick={saveRegion}
                    className="waves-effect waves-light"
                >
                    Copy
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CopyModal