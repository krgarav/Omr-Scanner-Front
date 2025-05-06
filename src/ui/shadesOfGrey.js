import React from 'react';

const ShadesOfGrey = () => {
    // Generate shades of grey
    const shades = Array.from({ length: 16 }, (_, i) => {
        let a = i + 1;
        const greyValue = Math.floor(255 - (a * (255 / 18)));
        return `rgb(${greyValue}, ${greyValue}, ${greyValue})`;
    });

    return (
        <div style={{ display: "flex", width: "100%" }}>
            {shades.map((shade, index) => (
                <div
                    key={index}
                    style={{
                        backgroundColor: shade,
                        width: "20px",
                        height: "20px",
                        marginLeft: "0",
                        padding: "0"
                    }}
                ></div>
            ))}
        </div>
    );
};

export default ShadesOfGrey;
