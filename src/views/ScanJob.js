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
  PdfExport,
  ToolbarItems,
  Page,
  FilterSettingsModel,
  EditSettingsModel,
  Filter,
  Edit,
} from "@syncfusion/ej2-react-grids";

import { fetchAllTemplate } from "helper/TemplateHelper";
// import Select, { components } from "react-select";
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";
import { cancelScan } from "helper/TemplateHelper";
import { finishJob } from "helper/job_helper";
import axios from "axios";
import { GET_PROCESS_32_PAG_DATA } from "helper/url_helper";
import { GENERATE_EXCEL } from "helper/url_helper";
import { getUrls } from "helper/url_helper";
import PrintModal from "ui/PrintModal";

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

const ScanJob = () => {
  const [count, setCount] = useState(true);
  const [processedData, setProcessedData] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [headData, setHeadData] = useState(["OrderID"]);
  const filterSettings = { type: "Excel" };
  // const toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'ExcelExport', 'CsvExport'];
  const editSettings = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
  };
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 576);
  const [items, setItems] = useState([]);
  const [templateOptions, setTemplateOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState();
  const [toolbar, setToolbar] = useState(["ExcelExport", "CsvExport"]);
  const [services, setServices] = useState([
    Sort,
    Toolbar,
    ExcelExport,
    Filter,
  ]);
  const gridRef = useRef();
  const [gridHeight, setGridHeight] = useState("350px");
  const [starting, setStarting] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(true);
  const [proccessUrl, setProcessURL] = useState("");
  const template = emptyMessageTemplate;
  const location = useLocation();
  const navigate = useNavigate();
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
  useEffect(() => {
    // Calculate 60% of the viewport height
    const handleResize = () => {
      const height = `${window.innerHeight * 0.5}px`;
      setGridHeight(height);
    };

    // Set the initial height
    handleResize();

    // Add event listener to update height on window resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {

    // const { templateId } = location?.state;
    const localTemplateId = localStorage.getItem("scantemplateId");
    // if (templateId) {
    //   setSelectedValue(templateId);
    // }
    if (localTemplateId) {
      setSelectedValue(localTemplateId);
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

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
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
  //   }
  // }, []);
  const getScanData = async () => {
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
        let splicedData;
        let updatedData = [];
        let num = 1;
        updatedData = data.result.data.map((item) => {
          const newItem = {};
          for (const key in item) {
            const newKey = key.endsWith(".") ? key.slice(0, -1) : key;
            newItem[newKey] = item[key];
          }
          newItem["Serial No"] = num++;
          return newItem;
        });

        setProcessedData(updatedData);

        gridRef.current.refresh();
      }
    } catch (error) {
      console.error(error);
      // Handle error (e.g., toast.error("Something went wrong"))
    }
  };

  useEffect(() => {
    if (!scanning) return;

    const intervalId = setInterval(() => {
      if (scanning) {
        getScanData();
      } else {
        clearInterval(intervalId);
      }
    }, 1000);

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
  const completeJobHandler = async () => {
    console.log("called");
    const result = window.confirm("Are you sure to finish the job ?");
    if (!result) {
      return;
    }
    const id = localStorage.getItem("jobId");
    const templateId = localStorage.getItem("scantemplateId");

    const obj = {
      id: id,
      templateId: templateId,
    };
    const token = localStorage.getItem("token");
    const { Role } = jwtDecode(token);

    const res = await finishJob(obj);
    if (res?.success) {
      toast.success("Completed the job!!!");
    }

    if (Role === "Moderator") {
      navigate("moderator/icons", { replace: true });
    } else {
      navigate("operator/job-queue", { replace: true });
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

  return (
    <>
      <NormalHeader />
      <div
        style={{
          position: "absolute",
          left: isSmallScreen ? "30%" : "40%",
          top: isSmallScreen ? "10px" : "20px",
          zIndex: "999",
        }}
      >
        <Button
          variant="primary"
          onClick={completeJobHandler}
          style={{ position: "relative" }}
        >
          Complete Job
        </Button>
      </div>
      <Container className={isSmallScreen ? "mt--6" : "mt--7"} fluid>
        <br />
        <div className="control-pane">
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
              toolbarClick={handleToolbarClick}
              allowExcelExport={true}
              allowPdfExport={true}
              allowEditing={false}
              emptyRecordTemplate={template.bind(this)}
            >
              <ColumnsDirective>{columnsDirective}</ColumnsDirective>
              <Inject services={services} />
            </GridComponent>
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
                  className=""
                  color="danger"
                  type="button"
                  onClick={handleStop}
                >
                  Cancel Scanning
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
      {showPrintModal && <PrintModal show={showPrintModal} />}
    </>
  );
};

export default ScanJob;
