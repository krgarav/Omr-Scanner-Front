import Header from "components/Headers/Header.js";
import NormalHeader from "components/Headers/NormalHeader";
import { Modal } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { fetchProcessData } from "helper/Booklet32Page_helper";
import { toast } from "react-toastify";
import { Button, Card, CardHeader, Container, Row, Table } from "reactstrap";
import { refreshScanner } from "helper/Booklet32Page_helper";
import { scanFiles } from "helper/Booklet32Page_helper";
// import { GridComponent, ColumnsDirective, ColumnDirective, Sort, Inject, Toolbar, Page, Filter, Edit } from '@syncfusion/ej2-react-grids';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Sort,
  Inject,
  Toolbar,
  ExcelExport,
  Filter,
} from "@syncfusion/ej2-react-grids";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";
import { cancelScan } from "helper/TemplateHelper";
import { finishJob } from "helper/job_helper";
import axios from "axios";
import { getUrls } from "helper/url_helper";
import PrintModal from "ui/PrintModal";
import jsonData from "data/jsonDataTest";
import { headerData } from "data/jsonDataTest";
import { VirtualScroll } from "@syncfusion/ej2-grids";
import { getTotalExcellRow } from "helper/Booklet32Page_helper";
import { getDataByRowRange } from "helper/Booklet32Page_helper";
function emptyMessageTemplate() {
  return (
    <div className="text-center">
      <img
        src={
          "https://ej2.syncfusion.com/react/demos/src/grid/images/emptyRecordTemplate_light.svg"
        }
        className="d-block mx-auto my-2"
        alt="No record"
      />
      <span>There is no data available to display at the moment.</span>
    </div>
  );
}
let num = JSON.parse(localStorage.getItem("lastSerialNo"), 10) || 1;
const AdminScanJob = () => {
  const [count, setCount] = useState(true);
  const [processedData, setProcessedData] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [headData, setHeadData] = useState(["Student Data"]);
  // const [headData, setHeadData] = useState(Object.keys(jsonData[0]));
  const filterSettings = { type: "Excel" };
  // const toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'ExcelExport', 'CsvExport'];
  const editSettings = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
  };
  const [items, setItems] = useState([]);
  const [selectedValue, setSelectedValue] = useState();
  const [toolbar, setToolbar] = useState(["ExcelExport", "CsvExport"]);
  const [services, setServices] = useState([Sort, Toolbar, Filter]);
  const [gridHeight, setGridHeight] = useState("850px");
  const [starting, setStarting] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 576);
  const [proccessUrl, setProcessURL] = useState("");
  const [showPrintModal, setShowPrintModal] = useState(true);
  const [templateName, setTemplateName] = useState("");
  const [scrollState, setScrollState] = useState(false);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSerialNo, setLastSerialNo] = useState(0);
  const template = emptyMessageTemplate;

  const gridRef = useRef();

  const location = useLocation();
  const navigate = useNavigate();
  const serialRef = useRef();
  // useEffect(() => {
  //   let num = JSON.parse(localStorage.getItem("lastSerialNo"), 10) || 1;
  //   setLastSerialNo(num);
  // }, []);
  // useEffect(() => {
  //   // let num = JSON.parse(localStorage.getItem("lastSerialNo"), 10) || 1;
  //   const lastSlNo = processedData[processedData.length - 1];

  //   console.log(lastSlNo);
  //   if (lastSlNo) {
  //     const lastSerialNo = lastSlNo["Serial No"];
  //     localStorage.setItem("lastSerialNo", JSON.stringify(lastSerialNo));
  //   }
  //   // setLastSerialNo(num)
  // }, [processedData]);
  useEffect(() => {
    const gridContainer = gridRef.current?.element?.querySelector(".e-content");

    console.log("Grid container:", gridContainer); // Check if this logs a valid DOM element
    // setIsRunning(prev=>!prev )
    if (gridContainer) {
      console.log("Attaching scroll listener");
      gridContainer.addEventListener("scroll", handleScroll);
      console.log(gridContainer);
      // return () => {
      // console.log("Removing scroll listener");
      // gridContainer.removeEventListener("scroll", handleScroll);
      // };
    }
  }, [gridRef]);
  useEffect(() => {
    // serialRef.current.value = num;
  }, [serialRef]);
  useEffect(() => {
    // Function to calculate 80% of the viewport height
    const calculateGridHeight = () => {
      const height = window.innerHeight * 0.65; // 80% of viewport height
      setGridHeight(`${height}px`);
    };

    // Call the function to set initial height
    calculateGridHeight();

    // Update height when the window is resized
    window.addEventListener("resize", calculateGridHeight);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", calculateGridHeight);
    };
  }, []); // Empty dependency array to run only once and on resize
  useEffect(() => {
    const fetchData = async () => {
      const response = await getUrls();
      const GetDataURL = response.GET_PROCESS_32_PAGE_DATA;
      setProcessURL(GetDataURL);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // useEffect(() => {
  //   // Calculate 60% of the viewport height
  //   const handleResize = () => {
  //     const height = `${window.innerHeight * 0.5}px`;
  //     setGridHeight(height);
  //   };

  //   // Set the initial height
  //   handleResize();

  //   // Add event listener to update height on window resize
  //   window.addEventListener("resize", handleResize);

  //   // Cleanup the event listener on component unmount
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);
  useEffect(() => {
    // if (!location.state) {
    //   navigate("/admin/job-queue", { replace: true });
    //   return;
    // }
    // const { templateId } = location?.state;
    const localTemplateId = localStorage.getItem("scantemplateId");
    const templateName = localStorage.getItem("templateName");
    // if (templateId) {
    //   setSelectedValue(templateId);
    // }
    if (localTemplateId) {
      setSelectedValue(localTemplateId);
      setTemplateName(templateName);
    }
  }, [location]);
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

  //
  //     const decoded = jwtDecode(token);
  //     if (decoded.Role === "Operator") {
  //       setToolbar([
  //         "Add",
  //         "Edit",
  //         "Delete",
  //         "Update",
  //         "Cancel",
  //         "ExcelExport",
  //         "CsvExport",
  //       ]);
  //       setServices([Sort, Toolbar, ExcelExport, Filter, Edit]);
  //     } else {
  //       setToolbar(["ExcelExport", "CsvExport"]);
  //       setServices([Sort, Toolbar, ExcelExport, Filter]);
  //     }
  //   }, []);
  // const getScanData = async () => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     const userInfo = jwtDecode(token);
  //     console.log(userInfo);

  //     const userId = userInfo.UserId;
  //     // Fetch data based on selected value ID
  //     // const response = await getUrls();
  //     // console.log(response)
  //     // const GetDataURL =  response.GET_PROCESS_32_PAG_DATA;
  //     // console.log(GetDataURL)
  //     const res = await axios.get(
  //       proccessUrl + `?Id=${selectedValue}&UserId=${userId}`
  //     );

  //     const data = res.data;
  //     // fetchProcessData(selectedValue, userId);
  //     console.log(data);

  //     // Check if the data fetch was successful
  //     if (data?.result?.success) {
  //       // Extract keys from the first item in the data array
  //       const newDataKeys = Object.keys(data.result.data[0]).map((key) => {
  //         return key.endsWith(".") ? key.slice(0, -1) : key;
  //       });

  //       // Add a serial number to each entry
  //       let num = 1;
  //       const updatedData = data.result.data.map((item) => {
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
  //       });

  //       // Set headData with the new keys, ensuring "Serial No" is included as a heading
  //       setHeadData(["Serial No", ...newDataKeys]);

  //       // Update the data state with the fetched data
  //       setProcessedData(updatedData);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     // toast.error("Something went wrong");

  //     // Set scanning to false in case of error
  //     // setScanning(false);
  //   }
  // };
  const handleScroll = async (e) => {
    const scrollTop = e.target.scrollTop;
    console.log("Scroll event triggered. ScrollTop:", scrollTop);
    if (scrollTop === 0) {
      console.log("Scrolled to top!");
      const token = localStorage.getItem("token");
      const userInfo = jwtDecode(token);
      const userId = userInfo.UserId;
      const templateId = localStorage.getItem("scantemplateId");
      const res = await getTotalExcellRow(templateId, userId);
      const totalRow = res?.totalRows;
      console.log(totalRow);
      // Add logic for fetching older data
    }
  };

  const getScanData = async () => {
    // Start numbering from the last serial number
    try {
      const token = localStorage.getItem("token");
      const userInfo = jwtDecode(token);
      const userId = userInfo.UserId;

      const res = await axios.get(
        proccessUrl + `?Id=${selectedValue}&UserId=${userId}`
      );
      const data = res.data;

      if (data?.result?.success) {
        const newDataKeys = Object.keys(data.result.data[0]).map((key) => {
          return key.endsWith(".") ? key.slice(0, -1) : key;
        });
        setHeadData(["Serial No", ...newDataKeys]);

        let updatedData = data.result.data.map((item) => {
          const newItem = {};
          for (const key in item) {
            const newKey = key.endsWith(".") ? key.slice(0, -1) : key;
            newItem[newKey] = item[key];
          }
          newItem["Serial No"] = num++;
          return newItem;
        });

        setProcessedData((prevData) => {
          const combinedData = [...prevData, ...updatedData];
          const lastSlNo = combinedData[combinedData.length - 1]["Serial No"];
          localStorage.setItem("lastSerialNo", JSON.stringify(lastSlNo));
          if (combinedData.length > 100) {
            return combinedData.slice(-100);
          }
          return combinedData;
        });

        // setLastSerialNo(num - 1); // Update the last serial number
        gridRef.current.refresh();
        return res;
      }

      return {
        success: false,
        data: res?.data?.result,
        message: "The API response did not indicate success.",
      };
    } catch (error) {
      console.error(error);
      setTimeout(() => {
        handleStop();
      }, 1000);
      toast.error("Unable to fetch data!!!");
      return error;
    }
  };
  // const getScanData = async () => {
  //   let num = 1;
  //   try {
  //     const token = localStorage.getItem("token");
  //     const userInfo = jwtDecode(token);
  //     const userId = userInfo.UserId;

  //     const res = await axios.get(
  //       proccessUrl + ?Id=${selectedValue}&UserId=${userId}
  //     );
  //     const data = res.data;

  //     if (data?.result?.success) {
  //       const newDataKeys = Object.keys(data.result.data[0]).map((key) => {
  //         return key.endsWith(".") ? key.slice(0, -1) : key;
  //       });
  //       setHeadData(["Serial No", ...newDataKeys]);
  //       let updatedData = [];

  //       updatedData = data.result.data.map((item) => {
  //         const newItem = {};
  //         for (const key in item) {
  //           const newKey = key.endsWith(".") ? key.slice(0, -1) : key;
  //           newItem[newKey] = item[key];
  //         }
  //         newItem["Serial No"] = num++;
  //         return newItem;
  //       });

  //       // setProcessedData(updatedData);
  //       setProcessedData((prevData) => {
  //         const combinedData = [...prevData, ...updatedData]; // Add new data to the rear
  //         if (combinedData.length > 100) {
  //           return combinedData.slice(-100); // Keep only the last 100 items
  //         }
  //         return combinedData;
  //       });

  //       gridRef.current.refresh();
  //       return res;
  //     }
  //     return {
  //       success: false,
  //       data: res?.data?.result,
  //       message: "The API response did not indicate success.",
  //     };
  //   } catch (error) {
  //     console.error(error);
  //     await handleStop();
  //     toast.error("Unable to fetch data");
  //     return error;
  //   }
  // };
  useEffect(() => {
    if (!scanning) return;

    const intervalId = setInterval(() => {
      if (scanning) {
        getScanData();
      } else {
        clearInterval(intervalId);
      }
    }, 3000);

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
    // setShowPrintModal(true);
    // return
    let startingIntervalId;
    let scanningTimeoutId;
    try {
      setStarting(true);
      const token = localStorage.getItem("token");

      if (token) {
        const userInfo = jwtDecode(token);
        const userId = userInfo.UserId;
        startingIntervalId = setTimeout(() => {
          setStarting(false);
        }, 6000);

        scanningTimeoutId = setTimeout(() => {
          setScanning(true);
        }, 6000);
        const response = await scanFiles(selectedValue, userId);
        // Clear the timeouts after the response is received
        clearTimeout(startingIntervalId);
        clearTimeout(scanningTimeoutId);
        if (!response?.result?.success) {
          await handleStop();
          toast.error(response?.result?.message);
        } else {
          toast.success(response?.result?.message);
        }
        if (response) {
          if (!response?.success) {
            toast.error(response?.message);
          } else {
            toast.success(response?.message);
          }
          setScanning(false);
        }
        if (response === undefined) {
          toast.error("Request Timeout");
          setScanning(false);
        }
      }
    } catch (error) {
      await handleStop();
      setStarting(false);
      // Clear the timeouts after the response is received
      clearTimeout(startingIntervalId);
      clearTimeout(scanningTimeoutId);
      console.log(error);
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

  const dataBound = () => {
    // if(!isAutoScrollEnabled){
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
    // gridRef.current.refresh();
    // }
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
  const handleStop = async () => {
    try {
      setScanning(false);
      setStarting(false);
      const cancel = await cancelScan();
    } catch (error) {
      console.log(error);
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
  // const completeJobHandler = async () => {
  //   try{
  //   const result = window.confirm("Are you sure to finish the job ?");
  //   if (!result) {
  //     return;
  //   }
  //   const id = localStorage.getItem("jobId");
  //   const templateId = localStorage.getItem("scantemplateId");

  //   const obj = {
  //     id: id,
  //     templateId: templateId,
  //   };
  //   const res = await finishJob(obj);
  //   if (res?.success) {
  //     const token = localStorage.getItem("token");

  //     if (token) {
  //       const userInfo = jwtDecode(token);
  //       const userId = userInfo.UserId;
  //       const response2 = await getUrls();
  //       const GetDataURL = response2?.GENERATE_EXCEL;
  //       const excelgenerate =  axios.get(
  //         GetDataURL + `?Id=${selectedValue}&UserId=${userId}`
  //       );
  //     }
  //     toast.success("Completed the job!!");
  //     navigate("/admin/job-queue", { replace: true });
  //   }
  // }catch(err){
  //   console.log("Error Occured",err);
  //   toast.error("Error Occured during saving the job!");
  // }
  // };

  const completeJobHandler = async () => {
    try {
      const result = window.confirm("Are you sure to finish the job?");
      if (!result) {
        return;
      }

      const id = localStorage.getItem("jobId");
      const templateId = localStorage.getItem("scantemplateId");

      if (!id || !templateId) {
        toast.error("Required data is missing!");
        return;
      }

      const obj = { id, templateId };
      const res = await finishJob(obj);

      if (res?.success) {
        const token = localStorage.getItem("token");

        // if (token) {
        //   // const userInfo = jwtDecode(token);
        //   // const userId = userInfo.UserId;

        //   // const response2 = await getUrls();
        //   // const GetDataURL = response2?.GENERATE_EXCEL;

        //   try {
        //     // Fire and forget
        //     // axios.get(`${GetDataURL}?Id=${selectedValue}&UserId=${userId}`);
        //   } catch (error) {
        //     console.error("Excel generation failed", error);
        //   }
        // }

        toast.success("Completed the job!");
        setTimeout(() => navigate("/admin/job-queue", { replace: true }), 500); // Delay for toast visibility
      }
    } catch (err) {
      console.error("Error occurred", err);
      toast.error("Error occurred during saving the job!");
    }
  };

  const rowDataBound = (args) => {
    const cells = args.data; // Access the data for the current row
    Object.keys(cells).forEach((key) => {
      if (cells[key] === null || cells[key] === "") {
        // Apply yellow background color to the cell
        const cellIndex = args.row.cells.findIndex(
          (cell) => cell.column.field === key
        );
        if (cellIndex !== -1) {
          args.row.cells[cellIndex].style.backgroundColor = "yellow";
        }
      }
    });
  };
  const handleRefreshData = async () => {
    try {
      setIsRefreshing(true);
      const token = localStorage.getItem("token");

      if (token) {
        const userInfo = jwtDecode(token);
        const userId = userInfo.UserId;
        const templateId = localStorage.getItem("scantemplateId");
        const res = await getTotalExcellRow(templateId, userId);
        const totalRow = res?.totalRows;
        if (totalRow) {
          const startRow = +totalRow - 100;
          const endRow = +totalRow + 1;
          const response = await getDataByRowRange(
            startRow,
            endRow,
            templateId,
            userId
          );
          if (response) {
            const filterData = response.map((item) => {
              return item.data;
            });
            const newDataKeys = Object.keys(filterData[0]).map((key) => {
              return key.endsWith(".") ? key.slice(0, -1) : key;
            });
            setHeadData([...newDataKeys]);
            setProcessedData(filterData);
          }
        }
      }
    } catch (error) {
      toast.error("Could not get data");
      console.log(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle the toggle switch
  const handleToggle = (event) => {
    setIsAutoScrollEnabled(event.target.checked);

    if (event.target.checked) {
      console.log("Auto Scroll Enabled");
      gridRef.current.refresh();
      // Add functionality to enable auto-scroll here
    } else {
      console.log("Auto Scroll Disabled");
      // Add functionality to disable auto-scroll here
    }
  };
  const handleOldRefreshData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userInfo = jwtDecode(token);
      const userId = userInfo.UserId;

      const res = await axios.get(
        proccessUrl + `?Id=${selectedValue}&UserId=${userId}`
      );
      const data = res.data;

      if (data?.result?.success) {
        const newDataKeys = Object.keys(data.result.data[0]).map((key) => {
          return key.endsWith(".") ? key.slice(0, -1) : key;
        });
        setHeadData(["Serial No", ...newDataKeys]);

        let updatedData = data.result.data.map((item) => {
          const newItem = {};
          for (const key in item) {
            const newKey = key.endsWith(".") ? key.slice(0, -1) : key;
            newItem[newKey] = item[key];
          }
          newItem["Serial No"] = num++;
          return newItem;
        });

        setProcessedData((prevData) => {
          const combinedData = [...prevData, ...updatedData];
          const lastSlNo = combinedData[combinedData.length - 1]["Serial No"];
          localStorage.setItem("lastSerialNo", JSON.stringify(lastSlNo));
          if (combinedData.length > 100) {
            return combinedData.slice(-100);
          }
          return combinedData;
        });
      }
      gridRef.current.refresh();
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(location.state)
  return (
    <>
      <NormalHeader />
      <div
        style={{
          position: "absolute",
          top: "20px",
          padding: "10px",
          zIndex: "999",
        }}
      >
        <nav
          style={{ "--bs-breadcrumb-divider": "'>'" }}
          aria-label="breadcrumb"
        >
          <ol className="breadcrumb" style={{ fontSize: "0.8rem" }}>
            <li className="breadcrumb-item">
              <Link to="/admin/job-queue">Job queue</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {templateName}
            </li>
          </ol>
        </nav>
      </div>
      <div
        style={{
          position: "absolute",
          left: isSmallScreen ? "30%" : "40%",
          top: isSmallScreen ? "10px" : "20px",
          zIndex: "999",
        }}
      >
        <Button variant="primary" onClick={completeJobHandler}>
          Complete Job
        </Button>
      </div>
      <Container className={isSmallScreen ? "mt--6" : "mt--8"} fluid>
        <br />

        {/* <div className="control-pane"> */}
        <div
          className="w-100  m-1"
          style={{ overflowY: "auto", backgroundColor: "green", zIndex: "999" }}
        >
          {/* <div
            className="w-100 d-flex"
            style={{ zIndex: "999", width: "8%", height: "80%" }}
          >
          \
            <input
              type="number"
            
              ref={serialRef}
              style={{ zIndex: "999", width: "8%" }}
            />
          </div> */}

          {/* <div className="d-flex justify-content-end  custom-control custom-switch">
            <input
              type="checkbox"
              className="custom-control-input"
              id="customSwitch1"
              checked={isAutoScrollEnabled}
              onChange={handleToggle}
            />
            <label className="custom-control-label" htmlFor="customSwitch1">
              Auto Scroll
            </label>
          </div> */}
        </div>
        <div className="control-section">
          <GridComponent
            ref={gridRef}
            dataBound={dataBound}
            actionComplete={handleSave}
            dataSource={processedData}
            height={gridHeight}
            allowSorting={false}
            editSettings={editSettings}
            allowFiltering={false}
            filterSettings={filterSettings}
            // toolbar={toolbar}
            enableVirtualization={isAutoScrollEnabled}
            toolbarClick={handleToolbarClick}
            allowExcelExport={true}
            allowPdfExport={false}
            allowEditing={false}
            emptyRecordTemplate={template.bind(this)}
            // rowDataBound={rowDataBound}
          >
            <ColumnsDirective>{columnsDirective}</ColumnsDirective>
            <Inject services={[VirtualScroll]} />
          </GridComponent>
          <div>
            <Button
              className="mt-2"
              color={"info"}
              disabled={isRefreshing}
              onClick={handleRefreshData}
            >
              {isRefreshing ? " Refreshing Old Data" : "Refresh Old Data"}
            </Button>
            <Button
              className="mt-2"
              color={"warning"}
              onClick={handleOldRefreshData}
            >
              Refresh Latest Data
            </Button>

            <div className="m-2" style={{ float: "right" }}>
              <Button
                className=""
                color={"success"}
                type="button"
                onClick={handleStart}
                disabled={scanning || starting ? true : false}
              >
                {starting && !scanning && "Starting"}
                {!starting && !scanning && "Start"}
                {scanning && "Scanning"}
              </Button>
              {scanning && (
                <Button color="danger" type="button" onClick={handleStop}>
                  Cancel Scanning
                </Button>
              )}
            </div>
          </div>
          {/* </div> */}
        </div>
      </Container>
      {showPrintModal && <PrintModal show={showPrintModal} />}
    </>
  );
};

export default AdminScanJob;
