import { FaLeaf, FaRegCircle } from "react-icons/fa";
import { MdOutlineRectangle } from "react-icons/md";
import { LuRectangleHorizontal } from "react-icons/lu";
import { TbOvalVertical } from "react-icons/tb";
export const barcodeOptionData = [
    { id: "enable", name: "Enable" },
    { id: "disable", name: "Disable" },
]
export const rejectData = [
    { id: 1, name: "0", showName: "False" },
    { id: 2, name: "1", showName: "True" },
]
export const sizeData = [
    { id: 1, name: "A4" },
    { id: 2, name: "IBM Card" },
    { id: 3, name: "WIDE Card" },
    { id: 4, name: "B5" },
    { id: 5, name: "POST Card" },
    { id: 6, name: "Setting User" },
    { id: 7, name: "8.5" },
];
export const bubbleData = [
    { id: 1, name: "circle", icon: <FaRegCircle /> },
    { id: 2, name: "rectangle", icon: <MdOutlineRectangle /> },
    { id: 3, name: "rounded rectangle", icon: <LuRectangleHorizontal /> },
    { id: 4, name: "oval", icon: <TbOvalVertical /> },
];
export const timingMethodData = [
    { id: 1, name: "Mark to mark" },
    { id: 2, name: "Direct under" },
    { id: 3, name: "Timing control(Standard : 3 times)" },
    { id: 4, name: "Timing control(Reduction : 2 times)" },
    { id: 5, name: "Timing control(Extension : 4 times)" },
];

export const typeOfColumnDisplayData = [
    { id: 1, name: "Type1" },
    { id: 2, name: "Type2" },
    { id: 3, name: "Type3" },
    { id: 4, name: "Type4" },
];

export const sensivityDensivityDifferenceData = [
    { id: 1, name: "Effictive the sensitivity of software setup" },
    { id: 2, name: "Effictive the sensitivity of OMR setup" },
];
export const errorOfTheNumberOfTimingMarksData = [
    { id: 1, name: "Not check error" },
    { id: 2, name: "Check error, and stop the OMR" },
    { id: 3, name: "Check error, and not stop the OMR" },
];

export const windowNgData = [
    { id: "0x00000001", name: "SKDV_ACTION_SELECT(0x00000001)", showName: "Paper ejection to select stacker" },
    { id: "0x00000002", name: "SKDV_ACTION_STOP(0x00000002)", showName: "Stop reading" },
    { id: "0", name: "SKDV_ACTION_STOP(0x00000002)", showName: "No action" },
];

export const faceData = [
    { id: 0, name: "Front Side" },
    { id: 1, name: "Back Side" },
];
export const IdOptionData = [
    { id: "present", name: "Present" },
    { id: "not present", name: "Not Present" },
];
export const directionData = [
    { id: "Top To Bottom", name: "Top To Bottom" },
    { id: "Bottom To Top", name: "Bottom To Top" },
];
export const barcodeTypeData = [
    { id: "1", name: "CODE-39" },
    { id: "2", name: "Interleaved 2 of 5 (ITF)" },
    { id: "4", name: "NW-7" },
    { id: "8", name: "JAN,EAN,UPC" },
    { id: "16", name: "Code-128" },
    { id: "32", name: "Industrial 2 of 5" },
    { id: "64", name: "COOP 2 of 5" },
    { id: "128", name: "CODE-93" },
    { id: "256", name: "JAN,EAN 8" },
    { id: "512", name: "JAN,EAN 13" },
    { id: "1024", name: " UPC-A" },
    { id: "2048", name: "UPC-E" },
    { id: "16777216", name: "QR Code" },
];

export const colorTypeData = [
    { id: "0", name: "Color (3 colors)" },
    { id: "1", name: "Gray scale (single color)" },
    { id: "2", name: "Red (single color)" },
    { id: "3", name: "Green (single color)" },
    { id: "4", name: "Blue (single color)" },

];
export const encodingOptionData = [
    { id: "0", name: "Bit map " },
    { id: "1", name: "GIF" },
    { id: "2", name: "Jpeg" },
    { id: "3", name: "PNG" },
    { id: "4", name: "Tiff" },
];
export const rotationOptionData = [
    { id: "0", name: "No rotation" },
    { id: "1", name: "Rotated 90 degrees" },
    { id: "2", name: "Rotated 180 degrees" },
    { id: "3", name: "Rotated 270 degrees" },
];

export const resolutionOptionData = [
    { id: "4", name: "100 DPI" },
    { id: "3", name: "150 DPI" },
    { id: "2", name: "200 DPI" },
    { id: "1", name: "300 DPI" },
    { id: "0", name: "600 DPI" },
];

export const scanningSideData = [
    { id: "0", name: "Non-reading image" },
    { id: "1", name: "Double side" },
    { id: "2", name: "Front side only" },
    { id: "3", name: "Back side only" },
];
export const imageStatusData = [
    { id: "0", name: "Not Enabled" },
    { id: "1", name: "Enabled" },

];

export const code39OrItfCheckDigitData = [
    { id: "0", name: "No check" },
    { id: "1", name: "Check" },

];

export const nw7CheckDigitData = [
    { id: "0", name: "No check" },
    { id: "1", name: "Modulus 16" },
    { id: "2", name: "Modulus 11" },
    { id: "3", name: "Modulus 10 / 2" },
    { id: "4", name: "Modulus 10 / 3" },
    { id: "5", name: "7 check DR" },
    { id: "6", name: "Weighted modulus 11" },
    { id: "7", name: "Runes" },

];

export const upcaOptionData = [
    { id: "0", name: "Output in 12 digits" },
    { id: "1", name: "Output in 13 digits" },
];
export const upceOptionData = [
    { id: "0", name: "Not to add system code" },
    { id: "1", name: "Add system code" },
];
export const barcodeCategoryData = [
    { id: "software", name: "Software" },
    { id: "hardware", name: "Hardware" },
];

export const barcodeRejectData = [
    { id: "0", name: "Reject" },
    { id: "1", name: "Not Reject" },
];

export const fileType = [
    { id: "CSV", name: "CSV" },
    { id: "TXT", name: "TXT" },
    { id: "SQL", name: "SQL" },
    { id: "MOB", name: "MOB" },
    { id: "ODBC", name: "ODBC" },
];
export const imageTypeData = [
    { id: "JPG", name: "JPG" },
    { id: "BMP", name: "BMP" },
    { id: "PDF", name: "PDF" },
    { id: "TIFF", name: "TIFF " },
];
export const imageColorTypeData = [
    { id: "color", name: "Color (Full Color)" },
    { id: "grayscale", name: "Grayscale (Monochrome)" },
    { id: "blackandwhite", name: "Black and White (Binary)" },
]
export const imageResoModeData = [
    { id: "0", name: "600" },
    { id: "1", name: "300" }
]
export const imageParamsData = [
    { id: "2", name: "LZW compressed" },
    { id: "6", name: "Non Compressed" }
]
export const imageDPIData = [
    { id: "100", name: "100" },
    { id: "150", name: "150" },
    { id: "200", name: "200" },
    { id: "250", name: "250" },
    { id: "300", name: "300" },
    { id: "350", name: "350" },
    { id: "400", name: "400" },
    { id: "450", name: "450" },
];

export const printOptionData = [
    { id: "1", name: "Enable" },
    { id: "0", name: "Not Enable" },
];

export const printOrientationOption = [
    { id: "1", name: "Normal" },
    { id: "2", name: "180 degree rotation" },
];
export const printModeOption = [
    { id: "1", name: "Print after feed" },
    { id: "2", name: "Feed and print" },
];

export const printCustomOption = [
    { id: "", name: "Print Blank" },
    { id: "date", name: "Date" },
    { id: "time", name: "Time " },
    { id: "datetime", name: "Date and Time " },
    { id: "custom", name: "Custom " },
];