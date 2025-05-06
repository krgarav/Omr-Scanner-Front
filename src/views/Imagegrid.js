import React, { useRef, useState, useEffect } from 'react';
import NormalHeader from "components/Headers/NormalHeader";
import "../App.css";
import { Button } from 'reactstrap';
const ImageGrid = () => {
    const canvasRef = useRef(null);
    const [cols, setCols] = useState(5);
    const [rows, setRows] = useState(4);
    const [imageSrc, setImageSrc] = useState('/img.jpg');
    const [selection, setSelection] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [mainCols, setMainCols] = useState(0)
    const [pitch, setPitch] = useState(4.233)
    let maincolumns = 0;
    const offsetLeft = 20.798740157;
    const offsetRight = 36.415748031;
    const drawGrid = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const img = new Image();

        img.onload = () => {
            canvas.width = img.width - 20.798740157;
            canvas.height = img.height - 36.415748031;
            const cp = document.getElementById("canvaspage");
            console.log(cp.width, cp.height);
            console.log(img.width, img.height)
            // ctx.drawImage(img, 0, 0);
            ctx.drawImage(img, -offsetLeft, 0, img.width, img.height);
            const cnvinmm = +canvas.width * 0.26458333333719;
            const columns = Math.floor(cnvinmm / 4.233)
            const colWidth = 3.7795275591 * 4.233;
            
            const rowHeight = img.height / rows;
            setMainCols(columns)
            ctx.strokeStyle = 'green';

            // Draw vertical lines
            for (let i = 1; i < columns; i++) {
                ctx.beginPath();
                ctx.moveTo(i * colWidth, 0);
                ctx.lineTo(i * colWidth, img.height);
                ctx.stroke();
            }

            // Draw horizontal lines
            for (let i = 1; i < rows; i++) {
                ctx.beginPath();
                ctx.moveTo(0, i * rowHeight);
                ctx.lineTo(img.width, i * rowHeight);
                ctx.stroke();
            }

            // Draw selection
            if (selection) {
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                ctx.strokeRect(selection.x, selection.y, selection.width, selection.height);
            }
        };

        img.src = imageSrc;
    };

    const handleMouseDown = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setSelection({ x, y, width: 0, height: 0 });
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setSelection((prev) => ({
            ...prev,
            width: x - prev.x,
            height: y - prev.y,
        }));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        calculateSelection();
    };

    const calculateSelection = () => {
        if (!selection) return;
        console.log(selection)
        const colWidth = canvasRef.current.width / mainCols;
        console.log(canvasRef.current.width)
        console.log(colWidth)
        const rowHeight = canvasRef.current.height / rows;
        const startCol = Math.floor(selection.x / colWidth) + 1;
        const startRow = Math.floor(selection.y / rowHeight) + 1;
        const endCol = Math.floor((selection.x + selection.width) / colWidth) ;
        const endRow = Math.floor((selection.y + selection.height) / rowHeight) + 1;
        console.log(`Starting Row : ${startRow}, starting Col : ${startCol} End Row :${endRow}, End Col : ${endCol}`);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageSrc(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        drawGrid();
    }, [cols, rows, imageSrc, selection]);
    console.log(mainCols)

    return (
        <>
            <br /><br /><br />
            <div className='imagegrid-container'>
                <div>
                    <label>
                        Columns:
                        <input type="number" value={mainCols} onChange={(e) => setCols(parseInt(e.target.value, 10))} />
                    </label>
                    <label>
                        Rows:
                        <input type="number" value={rows} onChange={(e) => setRows(parseInt(e.target.value, 10))} />
                    </label>
                    <label>
                        Pitch:
                        <input type="number" value={pitch} onChange={(e) => setRows(parseInt(e.target.value, 10))} />
                    </label>
                    <label>
                        Upload Image:
                        <input type="file" onChange={handleImageUpload} accept="image/*" />
                    </label>
                </div>
                <br />
                <canvas
                    id="canvaspage"
                    ref={canvasRef}
                    style={{ border: '2px solid black' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                />
            </div>
        </>
    );
};

export default ImageGrid;
