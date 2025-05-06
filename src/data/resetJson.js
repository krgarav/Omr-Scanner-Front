

const resetJson = ( data,startRow, endRow, startCol, endCol) => {
    for (let i = startRow; i <= endRow; i++) {
        for (let j = endCol; j >= startCol; j--) { // Iterate from endCol to startCol
            if (i < data.length && j >= 0 && j < Object.keys(data[i]).length) {
                data[i][j] = "";
            }
        }
    }
    sessionStorage.setItem("numberedExcelJsonFile", JSON.stringify(data))
    // if (type === "numeric") {

    //     switch (direction) {
    //         case "rightToLeft":
    //             for (let i = startRow; i <= endRow; i++) {
    //                 for (let j = endCol; j >= startCol; j--) { // Iterate from endCol to startCol
    //                     if (i < data.length && j >= 0 && j < Object.keys(data[i]).length) {
    //                         data[i][j] = "";
    //                     }
    //                 }
    //             }

    //             break;

    //         case "bottomToTop":
    //             for (let i = endRow; i >= startRow; i--) {
    //                 for (let j = startCol; j <= endCol; j++) {
    //                     if (i < data.length && j < Object.keys(data[i]).length) {
    //                         data[i][j] = "";
    //                     }
    //                 }

    //             }


    //             break;

    //         case "leftToRight":
    //             for (let i = startRow; i <= endRow; i++) {
    //                 for (let j = startCol; j <= endCol; j++) {
    //                     if (i < data.length && j < Object.keys(data[i]).length) {
    //                         data[i][j] = ""
    //                     }
    //                 }
    //             }

    //             break;

    //         case "topToBottom":
    //             for (let i = endCol; i >= startCol; i--) {
    //                 for (let j = startRow; j <= endRow; j++) {
    //                     if (j < data.length && i < Object.keys(data[j]).length) {
    //                         data[j][i] = "";
    //                     }
    //                 }
    //             }

    //             break;

    //         default:
    //             console.warn(`Unknown direction: ${direction}`);
    //     }
    //     sessionStorage.setItem("numberedExcelJsonFile", JSON.stringify(data))
    // } else {
    //     let counter = 'A'; // Start from 'A'

    //     function nextChar(char) {
    //         return String.fromCharCode(char.charCodeAt(0) + 1);
    //     }

    //     function resetCounter(start) {
    //         return start;
    //     }

    //     switch (direction) {
    //         case "leftToRight":
    //             // Left to right, top to bottom

    //             for (let i = startRow; i <= endRow; i += stepInRow) {
    //                 counter = 'A'; // Initialize counter at the start of each row
    //                 for (let j = startCol; j <= endCol; j += stepInCol) {
    //                     if (i < data.length && j < Object.keys(data[i]).length) {
    //                         data[i][j] = counter;
    //                         counter = nextChar(counter); // Move to the next letter
    //                         if (counter > 'Z') counter = 'A'; // Wrap around after 'Z'
    //                     }
    //                 }
    //             }
    //             break;
    //         case "rightToLeft":
    //             // Top to bottom, right to left
    //             for (let i = startRow; i <= endRow; i += stepInRow) {
    //                 for (let j = endCol; j >= startCol; j -= stepInCol) {
    //                     if (i < data.length && j >= 0 && j < Object.keys(data[i]).length) {
    //                         data[i][j] = counter;
    //                         counter = nextChar(counter); // Move to the next letter
    //                         if (counter > 'Z') counter = 'A'; // Wrap around after 'Z'
    //                     }
    //                 }
    //                 counter = resetCounter('A'); // Reset to 'A' for next row
    //             }
    //             break;

    //         case "bottomToTop":
    //             // Bottom to top, left to right
    //             counter = 'A'; // Reset counter
    //             for (let i = endRow; i >= startRow; i -= stepInRow) {
    //                 for (let j = startCol; j <= endCol; j += stepInCol) {
    //                     if (i < data.length && j < Object.keys(data[i]).length) {
    //                         data[i][j] = counter;
    //                         counter = nextChar(counter); // Move to the next letter
    //                         if (counter > 'Z') counter = 'A'; // Wrap around after 'Z'
    //                     }
    //                 }
    //                 counter = resetCounter('A'); // Reset to 'A' for next column
    //             }
    //             break;


    //         case "topToBottom":
    //             // Top to bottom, right to left
    //             for (let i = endCol; i >= startCol; i -= stepInRow) {
    //                 counter = 'A'; // Reset counter for each column
    //                 for (let j = startRow; j <= endRow; j += stepInCol) {
    //                     if (j < data.length && i < Object.keys(data[j]).length) {
    //                         data[j][i] = counter;
    //                         counter = nextChar(counter); // Move to the next letter
    //                         if (counter > 'Z') counter = 'A'; // Wrap around after 'Z'
    //                     }
    //                 }
    //             }
    //             break;

    //         default:
    //             console.warn(`Unknown direction: ${direction}`);

    //     }
    //     sessionStorage.setItem("numberedExcelJsonFile", JSON.stringify(data))
    // }

};

export default resetJson;