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
import getBaseUrl from "services/BackendApi";
import ImageViewer from "react-simple-image-viewer";
import { Rnd } from "react-rnd";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import RecognizationBtn from "ui/RecognizationBtn";
import RecognizationModal from "ui/RecognizationModal";
import { pauseScanning } from "helper/Booklet32Page_helper";
import { resumeScanning } from "helper/Booklet32Page_helper";
import { getLayoutDataById } from "helper/TemplateHelper";
import ZoomViewer from "components/ZoomView";
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
  const [baseUrl, setBaseURL] = useState(null);
  const [lastSerialNo, setLastSerialNo] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [showRecognizationModal, setShowRecognizationModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [templateData, setTemplateData] = useState([]);
  const [obj, setObj] = useState({});
  // const zoomedData =
  const template = emptyMessageTemplate;

  const gridRef = useRef();

  const location = useLocation();
  const navigate = useNavigate();
  const serialRef = useRef();

  useEffect(() => {
    const fetchBaseUrl = async () => {
      try {
        const base = await getBaseUrl(); // your custom function
        if (base) {
          const url = new URL(base);
          setBaseURL(url.host);
        }
      } catch (error) {
        console.error("Failed to fetch base URL:", error);
      }
    };

    fetchBaseUrl();
  }, []);
  // Connect to WebSocket on mount
  useEffect(() => {
    if (!baseUrl) return;
    console.log(baseUrl)
    const token = localStorage.getItem("token");
    const ws = new WebSocket(`ws://${baseUrl}/ws?token=${token}`);
    // const ws = new WebSocket(`ws://192.168.1.10:5500/ws`);

    // console.log(baseUrl)
    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      console.log("Message received:", event.data);
      const jsonData = JSON.parse(event.data);
      console.log(jsonData)
      const data = jsonData?.FieldResults;
      if (data) {
        setHeadData(Object.keys(data));
        setProcessedData((prev) => {
          return [...prev, data];
        });
      }
      // Example: when receiving "success", hide print
      if (event.data === "success") {
        console.log("success");
        // handleSuccess();
      }
    };
    // ws.onmessage = (event) => {
    //   const jsonData = JSON.parse(event.data);
    //   const data = jsonData?.FieldResults;

    //   if (data && gridRef.current?.grid) {
    //     const grid = gridRef.current.grid;

    //     // Append new row to internal data source
    //     grid.currentViewData.push(data); // push to current view
    //     grid.dataSource = [...grid.dataSource, data]; // update underlying data

    //     // Refresh only the row rendering (not full data source reload)
    //     grid.refresh(); // Optional: try grid.refreshRows() if you want to skip headers

    //     // Auto scroll to bottom
    //     setTimeout(() => {
    //       const content = grid.getContent?.();
    //       if (content) {
    //         content.scrollTop = content.scrollHeight;
    //       }
    //     }, 100);
    //   }
    // };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, [baseUrl]);

  useEffect(() => {
    const fetchData = async () => {
      const templateId = localStorage.getItem("templateId");
      const base = await getBaseUrl();
      const res = await getLayoutDataById(templateId);
      if (res) {
        const jsonPath = res?.data?.jsonPath;
        const res2 = await axios.get(`${base}${jsonPath}`, {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        });
        if (res2?.data && res2?.data?.fields) {
          setTemplateData(res2.data.fields);
        }
      }
    };
    if (baseUrl) {
      fetchData();
    }
  }, [baseUrl]);

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
    try {
      setScanning(true);
      const folderName = localStorage.getItem("folderName");
      const templateId = localStorage.getItem("templateId");
      if (!folderName || !templateId) {
        toast.error("Please select a folder and template");
        return;
      }
      const token = localStorage.getItem("token");
      const res = await scanFiles(folderName, templateId);
    } catch (error) {
      console.log(error);
      if (error?.response?.data) {
        toast.error(error?.response?.data);
      }
    } finally {
      setScanning(false);
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
        }, 100); // Delay to ensure the grid is fully rendered before scrolling
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
      if (!isPaused) {
        setIsPaused(true);
        await pauseScanning();
        toast.warning("Scanning paused");
      } else {
        setIsPaused(false);
        await resumeScanning();
        toast.info("Scanning resumed");
      }
    } catch (error) {
      console.error("Error toggling scan state:", error);
      toast.error("Failed to toggle scanning state");
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
      setProcessedData([]);
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
  const onRowSelected = (args) => {
    const rowData = args.data;
    // console.log("Row selected:", args);
    // console.log("Row selected:", rowData);
    setIsViewerOpen(true);
    setCurrentImage(rowData?.FileName);
  };

  const onCellSelected = (args) => {
    const rowData = args.data; // same as args.rowData
    const columnField = args.currentCell.cellIndex;
    const obj = Object.keys(rowData);
    const columnHeader = obj[columnField];

    const filter = templateData.filter(
      (item) => item.fieldName === columnHeader
    );
    if (filter && filter[0]) {
      const { x, y, width, height } = filter[0];
      setObj({ x, y, width, height });
    }

    // console.log("Row data:", templateData);
    setIsViewerOpen(true);
    setCurrentImage(rowData?.FileName);
  };
  const closeImageViewer = () => {
    setIsViewerOpen(false);
    console.log("Image viewer closed");
  };
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
        ></div>
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
            toolbar={toolbar}
            enableVirtualization={isAutoScrollEnabled}
            toolbarClick={handleToolbarClick}
            allowExcelExport={true}
            allowPdfExport={false}
            allowEditing={false}
            emptyRecordTemplate={template.bind(this)}
            selectionSettings={{
              mode: "Both",
              type: "Single",
              cellSelectionMode: "Box",
            }}
            // rowDataBound={rowDataBound}
            rowSelected={onRowSelected}
            cellSelected={onCellSelected}
          >
            <ColumnsDirective>{columnsDirective}</ColumnsDirective>
            <Inject services={services} />
          </GridComponent>

          {isViewerOpen && (
            <Rnd
              default={{
                x: window.innerWidth / 2 - 250,
                y: window.innerHeight / 2 - 450,
                width: "auto",
                height: 600,
              }}
              bounds="window"
              dragHandleClassName="modal-drag-handle"
              enableResizing={true}
              style={{ zIndex: 1000 }}
            >
              <div
                style={{
                  background: "#fff",
                  padding: "1rem",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                  borderRadius: "8px",
                  height: "100%",
                  width: "100%",
                  overflow: "auto",
                  maxHeight: "90vh",
                }}
              >
                {/* Drag handle (no buttons here) */}
                <div
                  className="modal-drag-handle"
                  style={{ marginBottom: "8px" }}
                >
                  <h5 style={{ margin: 0 }}>Image Viewer</h5>
                </div>

                {/* Close button OUTSIDE of drag handle */}
                <button
                  onClick={closeImageViewer}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 1001,
                    border: "none",
                    background: "transparent",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                  }}
                >
                  ✖
                </button>

                <ZoomViewer
                  currentImage={currentImage}
                  baseUrl={baseUrl}
                  focusBox={obj}
                  templateData={templateData}
                />
              </div>
            </Rnd>
          )}
          {/* {isViewerOpen && (
            <ZoomViewer
              currentImage={currentImage}
              baseUrl={baseUrl}
              focusBox={obj}
              templateData={templateData}
            />
          )} */}
          <div>
            <Button
              className="mt-2"
              color={"info"}
              disabled={isRefreshing}
              onClick={handleRefreshData}
            >
              Refresh Data
            </Button>
            {/* <Button
              className="mt-2"
              color={"warning"}
              onClick={handleOldRefreshData}
            >
              Refresh Latest Data
            </Button> */}

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
                <Button
                  color={!isPaused ? "warning" : "info"}
                  type="button"
                  onClick={handleStop}
                >
                  {!isPaused ? "Pause Scanning" : "Resume Scanning"}
                </Button>
              )}
            </div>
          </div>
          {/* </div> */}
        </div>
      </Container>
      {/* {showPrintModal && <PrintModal show={showPrintModal} setData={setData} />} */}
      <div
        style={{
          position: "absolute",
          top: "100%",
          right: "40%",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            marginTop: "auto", // Push to bottom
            display: "flex",
            justifyContent: "center", // Center horizontally
          }}
        >
          <RecognizationBtn
            handleBtnClick={() => {
              setShowRecognizationModal(true);
            }}
          />
        </div>
      </div>

      <RecognizationModal
        show={showRecognizationModal}
        onClose={() => {
          setShowRecognizationModal(false);
        }}
      />
    </>
  );
};

export default AdminScanJob;
