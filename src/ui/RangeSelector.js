import React, { useState } from "react";
import Cropper from "react-easy-crop";
import "./RangeSelector.css";

const Output = ({ croppedArea, startCoordinates, endCoordinates }) => {
    const scale = 100 / croppedArea.width;
    const transform = {
        x: `${-croppedArea.x * scale}%`,
        y: `${-croppedArea.y * scale}%`,
        scale,
        width: "calc(100% + 0.5px)",
        height: "auto"
    };

    const imageStyle = {
        transform: `translate3d(${transform.x}, ${transform.y}, 0) scale3d(${transform.scale},${transform.scale},1)`,
        width: transform.width,
        height: transform.height
    };

    return (
        <div
            className="output"
            style={{ paddingBottom: `${100 / (croppedArea.width / croppedArea.height)}%` }}
        >
            <img src="/assets/dog.jpeg" alt="" style={imageStyle} />
            <div>
                <p>Start (x, y): {startCoordinates.x}, {startCoordinates.y}</p>
                <p>End (x, y): {endCoordinates.x}, {endCoordinates.y}</p>
            </div>
        </div>
    );
};

export default function RangeSelector({ imageSrc }) {
    const [crop, setCrop] = useState({ x: 2, y: 3 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [startCoordinates, setStartCoordinates] = useState({ x: 0, y: 0 });
    const [endCoordinates, setEndCoordinates] = useState({ x: 0, y: 0 });

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
        setStartCoordinates({ x: croppedAreaPixels.x, y: croppedAreaPixels.y });
        setEndCoordinates({ x: croppedAreaPixels.x + croppedAreaPixels.width, y: croppedAreaPixels.y + croppedAreaPixels.height });
    };

    return (
        <div className="App">
            <div className="cropper">
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  
                />
            </div>
            <div className="viewer">
                <div>
                    {croppedAreaPixels && (
                        <Output
                            croppedArea={croppedAreaPixels}
                            startCoordinates={startCoordinates}
                            endCoordinates={endCoordinates}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
