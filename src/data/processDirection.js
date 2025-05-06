

const processDirection = (direction, startRow, endRow, startCol, endCol, data, type, stepInRow, stepInCol) => {

    if (type === "numeric") {
        let counter = 0;
        switch (direction) {
            case "rightToLeft":
                for (let i = startRow; i <= endRow;  i++) {
                    for (let j = endCol; j >= startCol; j--) { // Iterate from endCol to startCol
                        if (i < data.length && j >= 0 && j < Object.keys(data[i]).length) {
                            data[i][j] = "";
                        }
                    }
                }
                // Top to bottom, left to right
                for (let i = startRow; i <= endRow;  i += stepInRow) {
                    for (let j = endCol; j >= startCol; j -= stepInCol) { // Iterate from endCol to startCol
                        if (i < data.length && j >= 0 && j < Object.keys(data[i]).length) {
                            data[i][j] = counter++;
                        }
                    }
                    counter = 0;
                }
                break;

            case "bottomToTop":
                for (let i = endRow; i >= startRow;  i--) {
                    for (let j = startCol; j <= endCol; j++) {
                        if (i < data.length && j < Object.keys(data[i]).length) {
                            data[i][j] = "";
                        }
                    }

                }
                // Bottom to top, left to right
                counter = -1;
                for (let i = endRow; i >= startRow;  i -= stepInRow) {
                    counter = counter + 1;
                    for (let j = startCol; j <= endCol; j += stepInCol) {
                        if (i < data.length && j < Object.keys(data[i]).length) {
                            data[i][j] = counter;
                        }
                    }

                }
                break;

            case "leftToRight":
                for (let i = startRow; i <= endRow;  i++) {
                    for (let j = startCol; j <= endCol; j++) {
                        if (i < data.length && j < Object.keys(data[i]).length) {
                            data[i][j] = ""
                        }
                    }
                }
                // Left to right, top to bottom
                for (let i = startRow; i <= endRow;  i += stepInRow) {
                    let counter = 0; // Initialize counter at the start of each row
                    for (let j = startCol; j <= endCol; j += stepInCol) {
                        if (i < data.length && j < Object.keys(data[i]).length) {
                            data[i][j] = counter++;
                        }
                    }
                }
                break;

            case "topToBottom":
                for (let i = endCol; i >= startCol;  i--) {
                    for (let j = startRow; j <= endRow; j++) {
                        if (j < data.length && i < Object.keys(data[j]).length) {
                            data[j][i] = "";
                        }
                    }
                }
                // Right to left, top to bottom
                for (let i = endCol; i >= startCol;  i -= stepInCol) {
                                     for (let j = startRow; j <= endRow; j +=stepInRow ) {
                        if (j < data.length && i < Object.keys(data[j]).length) {
                            data[j][i] = counter++;
                        }
                    }
                    counter = 0; // Reset counter for next row
                }
                break;

            default:
                console.warn(`Unknown direction: ${direction}`);
        }
        
        sessionStorage.setItem("numberedExcelJsonFile",JSON.stringify(data));
        return data
    } else {
        let counter = 'A'; // Start from 'A'

        function nextChar(char) {
            return String.fromCharCode(char.charCodeAt(0) + 1);
        }

        function resetCounter(start) {
            return start;
        }

        switch (direction) {
            case "leftToRight":
                // Left to right, top to bottom
                for (let i = startRow; i <= endRow;  i++) {
                    for (let j = startCol; j <= endCol; j++) {
                        if (i < data.length && j < Object.keys(data[i]).length) {
                            data[i][j] = ""
                        }
                    }
                }
                for (let i = startRow; i <= endRow; i += stepInRow) {
                    counter = 'A'; // Initialize counter at the start of each row
                    for (let j = startCol; j <= endCol; j += stepInCol) {
                        if (i < data.length && j < Object.keys(data[i]).length) {
                            data[i][j] = counter;
                            counter = nextChar(counter); // Move to the next letter
                            if (counter > 'Z') counter = 'A'; // Wrap around after 'Z'
                        }
                    }
                }
                break;
            case "rightToLeft":
                for (let i = startRow; i <= endRow;  i++) {
                    for (let j = endCol; j >= startCol; j--) { // Iterate from endCol to startCol
                        if (i < data.length && j >= 0 && j < Object.keys(data[i]).length) {
                            data[i][j] = "";
                        }
                    }
                }
                // Top to bottom, right to left
                for (let i = startRow; i <= endRow; i += stepInRow) {
                    for (let j = endCol; j >= startCol; j -= stepInCol) {
                        if (i < data.length && j >= 0 && j < Object.keys(data[i]).length) {
                            data[i][j] = counter;
                            counter = nextChar(counter); // Move to the next letter
                            if (counter > 'Z') counter = 'A'; // Wrap around after 'Z'
                        }
                    }
                    counter = resetCounter('A'); // Reset to 'A' for next row
                }
                break;

            case "bottomToTop":
                // Bottom to top, left to right
                // console.log("Runned")
                // counter = 'A'; // Reset counter
                // for (let i = endRow; i >= startRow; i -= stepInRow) {
                   
                //     for (let j = startCol; j <= endCol; j += stepInCol) {
                //         if (i < data.length && j < Object.keys(data[i]).length) {
                //             data[i][j] = counter;
                //              // Move to the next letter
                //              counter = nextChar(counter);
                //             if (counter > 'Z') counter = 'A'; // Wrap around after 'Z'
                //         }
                //     }
                //     counter = resetCounter('A'); // Reset to 'A' for next column
                // }
                for (let i = endRow; i >= startRow;  i--) {
                    for (let j = startCol; j <= endCol; j++) {
                        if (i < data.length && j < Object.keys(data[i]).length) {
                            data[i][j] = "";
                        }
                    }

                }
                for (let i = endCol; i >= startCol; i -= stepInCol) {
                    counter = 'A'; // Reset counter for each column
                    for (let j = endRow; j >= startRow; j -= stepInRow) { // Go bottom to top
                        if (j < data.length && i < Object.keys(data[j]).length) {
                            data[j][i] = counter;
                            counter = nextChar(counter); // Move to the next letter
                            if (counter > 'Z') counter = 'A'; // Wrap around after 'Z'
                        }
                    }
                }
                
              
                sessionStorage.setItem("numberedExcelJsonFile",JSON.stringify(data));
                break;



            case "topToBottom":
                for (let i = endCol; i >= startCol;  i--) {
                    for (let j = startRow; j <= endRow; j++) {
                        if (j < data.length && i < Object.keys(data[j]).length) {
                            data[j][i] = "";
                        }
                    }
                }
                // Top to bottom, right to left
                for (let i = endCol; i >= startCol;  i -= stepInCol) {
                    counter = 'A'; // Reset counter for each column
                    for (let j = startRow; j <= endRow; j += stepInRow) {
                        if (j < data.length && i < Object.keys(data[j]).length) {
                            data[j][i] = counter;
                            counter = nextChar(counter); // Move to the next letter
                            if (counter > 'Z') counter = 'A'; // Wrap around after 'Z'
                        }
                    }
                }
               
                break;

            default:
                console.warn(`Unknown direction: ${direction}`);
               
        }
        sessionStorage.setItem("numberedExcelJsonFile",JSON.stringify(data));
        return JSON.stringify(data)
    }

};

export default processDirection;