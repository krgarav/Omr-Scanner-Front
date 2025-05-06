// core components
import Header from "components/Headers/Header.js";
import NormalHeader from "components/Headers/NormalHeader";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { fetchProcessData } from "helper/Booklet32Page_helper";
import { toast } from "react-toastify";
import { Button, Container } from "reactstrap";
import { refreshScanner } from "helper/Booklet32Page_helper";
import { scanFiles } from "helper/Booklet32Page_helper";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Sort,
  Inject,
  Toolbar,
  ExcelExport,
  Filter,
  Edit,
} from "@syncfusion/ej2-react-grids";

import { fetchAllTemplate } from "helper/TemplateHelper";
import jsonData from "data/jsonDataTest";
import { jwtDecode } from "jwt-decode";
import { cancelScan } from "helper/TemplateHelper";

const Booklet32Page = () => {
  const [count, setCount] = useState(true);
  const [processedData, setProcessedData] = useState([
    { OrderID: 10248, CustomerID: "VINET" },
    { OrderID: 10249, CustomerID: "TOMSP" },
  ]);
  const [scanning, setScanning] = useState(false);
  const [headData, setHeadData] = useState([]);
  const filterSettings = { type: "Excel" };
  // const toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'ExcelExport', 'CsvExport'];
  const editSettings = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
  };
  const [items, setItems] = useState([]);
  const [templateOptions, setTemplateOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [toolbar, setToolbar] = useState(["ExcelExport", "CsvExport"]);
  const [services, setServices] = useState([
    Sort,
    Toolbar,
    ExcelExport,
    Filter,
  ]);
  const [starting, setStarting] = useState(false);
  const gridRef = useRef();
  const jsonDataRef = useRef(jsonData);
  // useEffect(() => {
  //     const interval = setInterval(() => {
  //         setItems(prevItems => {
  //             const nextIndex = prevItems.length;
  //             if (nextIndex < data.length) {
  //                 return [...prevItems, data[nextIndex]];
  //             } else {
  //                 clearInterval(interval);
  //                 return prevItems;
  //             }
  //         });
  //     }, 1000);

  //     return () => clearInterval(interval); // Cleanup on unmount
  // }, [data]);

  //   useEffect(() => {
  //     let num = processedData.length + 1;
  //     const updatedData = [
  //     //   ...processedData,
  //       ...jsonData.map((item) => {
  //         const newItem = {};

  //         // Iterate over the keys of the item
  //         for (const key in item) {
  //           // Check if the key ends with a dot
  //           const newKey = key.endsWith(".") ? key.slice(0, -1) : key;
  //           // Assign the value to the new key in newItem
  //           newItem[newKey] = item[key];
  //         }

  //         // Add the Serial No property
  //         newItem["Serial No"] = num++;
  //         return newItem;
  //       }),
  //     ];
  //     console.log(updatedData)
  //     setProcessedData(updatedData);
  //   }, []);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     let num = processedData.length + 1;
  //     const newJsonData = [...jsonDataRef.current /* new data item here */];

  //     const updatedData = [
  //       ...processedData,
  //       ...newJsonData.map((item) => {
  //         const newItem = {};

  //         // Iterate over the keys of the item
  //         for (const key in item) {
  //           // Check if the key ends with a dot
  //           const newKey = key.endsWith(".") ? key.slice(0, -1) : key;
  //           // Assign the value to the new key in newItem
  //           newItem[newKey] = item[key];
  //         }

  //         // Add the Serial No property
  //         newItem["Serial No"] = num++;
  //         return newItem;
  //       }),
  //     ];

  //     jsonDataRef.current = newJsonData; // Update the ref with new data
  //     setProcessedData(updatedData);
  //   }, 2000); // Adjust the interval time as needed

  //   return () => clearInterval(interval); // Clean up the interval on component unmount
  // }, [processedData]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.Role === "Operator") {
        setToolbar([
          "Add",
          "Edit",
          "Delete",
          "Update",
          "Cancel",
          "ExcelExport",
          "CsvExport",
        ]);
        setServices([Sort, Toolbar, ExcelExport, Filter, Edit]);
      } else {
        setToolbar(["ExcelExport", "CsvExport"]);
        setServices([Sort, Toolbar, ExcelExport, Filter]);
      }
    }
  }, []);
  // const getScanData = async () => {
  //   try {
  //     // Fetch data based on selected value ID
  //     const data = await fetchProcessData(selectedValue.id);
  //     console.log(data);

  //     // Check if the data fetch was successful
  //     if (data?.result?.success) {
  //       // Extract keys from the first item in the data array

  //       const newDataKeys = Object.keys(data.result.data[0]).map((key) => {
  //         return key.endsWith(".") ? key.slice(0, -1) : key;
  //       });

  //       console.log(processedData);
  //       // Add a serial number to each entry
  //       // if (processedData) {
  //         let num = data.result.data.length + 1;
  //         const updatedData =data.result.data.map((item) => {
  //             const newItem = {};

  //             // Iterate over the keys of the item
  //             for (const key in item) {
  //               // Check if the key ends with a dot
  //               const newKey = key.endsWith(".") ? key.slice(0, -1) : key;
  //               // Assign the value to the new key in newItem
  //               newItem[newKey] = item[key];
  //             }

  //             // Add the Serial No property
  //             newItem["Serial No"] = num++;
  //             return newItem;
  //           });

  //         // Set headData with the new keys, ensuring "Serial No" is included as a heading
  //         setHeadData(["Serial No", ...newDataKeys]);

  //         // Update the data state with the fetched data
  //         setProcessedData(updatedData);
  //       // }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Something went wrong");

  //     // Set scanning to false in case of error
  //     setScanning(false);
  //   }
  // };
  const getScanData = async () => {
    try {
      setScanning(true); // Start scanning process

      // Fetch data based on selected value ID
      const data = await fetchProcessData(selectedValue.id);
      console.log(data);

      // Check if the data fetch was successful
      if (data?.result?.success) {
        // Extract keys from the first item in the data array
        const newDataKeys = Object.keys(data.result.data[0]).map((key) => {
          return key.endsWith(".") ? key.slice(0, -1) : key;
        });

        // Add a serial number to each entry
        let num = 1;
        const updatedData = data.result.data.map((item) => {
          const newItem = {};

          // Iterate over the keys of the item
          for (const key in item) {
            // Check if the key ends with a dot
            const newKey = key.endsWith(".") ? key.slice(0, -1) : key;
            // Assign the value to the new key in newItem
            newItem[newKey] = item[key];
          }

          // Add the Serial No property
          newItem["Serial No"] = num++;
          return newItem;
        });

        // Set headData with the new keys, ensuring "Serial No" is included as a heading
        setHeadData(["Serial No", ...newDataKeys]);

        // Update the data state with the fetched data
        setProcessedData(updatedData);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const template = await fetchAllTemplate();
      const optionObject = template?.map((item) => {
        return { id: item.id, value: item.layoutName };
      });
      setTemplateOptions(optionObject);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (scanning) {
        getScanData();
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [scanning]);

  const intervalCreation = (data) => {
    const interval = setInterval(() => {
      setItems((prevItems) => {
        const nextIndex = prevItems.length;
        if (nextIndex < data.length) {
          return [...prevItems, data[nextIndex]];
        } else {
          clearInterval(interval);
          return prevItems;
        }
      });
    }, 1000);
  };

  const handleStart = async () => {
    if (!selectedValue) {
      alert("Choose Template");
      return;
    }
    // if (scanning) {
    //   setScanning(false);
    //   return;
    // }
    setStarting(true);
    setTimeout(async () => {
      setStarting(false);
    }, 6000);
    setProcessedData([]);
    setTimeout(async () => {
      setScanning(true);
    }, 6000);
    const response = await scanFiles(selectedValue);
    console.log(response);
    if (!response?.result?.success) {
      toast.error(response?.result?.message);
    } else {
      toast.success(response?.result?.message);
    }
    if (response) {
      setScanning(false);
    }
    if (response === undefined) {
      toast.error("Request Timeout");
    }
  };

  const handleSave = (args) => {
    if (args.data) {
      const updatedData = [...processedData];
      console.log(updatedData);
      const index = updatedData.findIndex(
        (item) => item["Serial No"] == args.data["Serial No"]
      );
      if (index > -1) {
        updatedData[index] = args.data;
        console.log(updatedData);
        setProcessedData(updatedData);
      }
    }
  };

  const handleRefresh = () => {
    try {
      refreshScanner();
    } catch (error) {
      console.log(error);
      toast.error("Error in Refresh");
    }
  };

  const handleToolbarClick = (args) => {
    if (args.item.id.includes("excelexport")) {
      gridRef.current.refresh(); // Ensure the grid data is refreshed
      gridRef.current.excelExport();
    }
    if (args.item.id.includes("pdfexport")) {
      gridRef.current.refresh(); // Ensure the grid data is refreshed
      gridRef.current.pdfExport();
    }
    if (args.item.id.includes("csvexport")) {
      gridRef.current.refresh(); // Ensure the grid data is refreshed
      gridRef.current.csvExport();
    }
  };
  const columnsDirective = headData.map((item, index) => {
    return (
      <ColumnDirective
        field={item}
        key={index}
        headerText={item}
        width="120"
        textAlign="Center"
      ></ColumnDirective>
    );
  });

  // ****************function without scrolling behaviour will give u data in real time*********

  // const dataBound = () => {
  //   if (gridRef.current) {
  //     const grid = gridRef.current;
  //     const lastIndex = grid.dataSource.length - 1;
  //     const row = grid.getRowByIndex(lastIndex);
  //     if (row) {
  //       row.scrollIntoView();
  //     }
  //   }
  // }
  // *************************************************************************************************

  const dataBound = () => {
    if (gridRef.current) {
      const grid = gridRef.current;
      const lastIndex = grid.dataSource.length - 1;

      // Ensure data source is not empty
      if (lastIndex >= 0) {
        setTimeout(() => {
          const gridContent = grid?.getContent()?.firstElementChild;
          gridContent.scrollTo({
            top: gridContent.scrollHeight,
            behavior: "smooth",
          });
        }, 500); // Delay to ensure the grid is fully rendered before scrolling
      }
    }
  };
  const handleStop = async () => {
    try {
      const cancel = await cancelScan();
      setScanning(false);
      setStarting(false);
      //   setTimeout(() => {
      //     setScanning(false);
      //   }, 5000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <NormalHeader />

      <Container className="mt--7" fluid>
        <div className="d-flex">
          <h2 style={{ color: "white", zIndex: 999 }}>Choose Template : </h2>
          <Select
            value={selectedValue}
            onChange={(selectedValue) => {
              setSelectedValue(selectedValue);
              setProcessedData([]);
            }}
            options={templateOptions}
            getOptionLabel={(option) => option?.value || ""}
            getOptionValue={(option) => option?.id?.toString() || ""}
            placeholder="Select Template"
          />
        </div>

        <br />

        <GridComponent
          ref={gridRef}
          dataBound={dataBound}
          actionComplete={handleSave}
          dataSource={processedData}
          height={450}
          allowSorting={false}
          editSettings={editSettings}
          allowFiltering={false}
          filterSettings={filterSettings}
          toolbar={toolbar}
          toolbarClick={handleToolbarClick}
          allowExcelExport={true}
          allowPdfExport={true}
          allowEditing={false}
        >
          <ColumnsDirective>{columnsDirective}</ColumnsDirective>
          <Inject services={services} />
        </GridComponent>
        <div className="m-2" style={{ float: "right" }}>
          <Button
            className=""
            color={scanning ? "warning" : "success"}
            type="button"
            onClick={handleStart}
            disabled={scanning || starting ? true : false}
          >
            {starting && !scanning && "Starting"}
            {!starting && !scanning && "Start"}
            {scanning && "Scanning"}
          </Button>
          {/* <Button
            className=""
            color="danger"
            type="button"
            onClick={handleRefresh}
          >
            Refresh
          </Button> */}
          {scanning && (
            <Button
              className=""
              color="danger"
              type="button"
              onClick={handleStop}
            >
              Cancel Scanning
            </Button>
          )}
        </div>
      </Container>
    </>
  );
};

export default Booklet32Page;
