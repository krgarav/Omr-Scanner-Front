// core components
import Header from "components/Headers/Header.js";
import NormalHeader from "components/Headers/NormalHeader";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
  Button,
  Col,
} from "reactstrap";
import { getAssignedJob } from "helper/job_helper";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { startJob } from "helper/job_helper";

const ModeratorJobQueue = () => {
  const [allJob, setAllJob] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const UserId = decoded.UserId;
      const fetchAssignedJobs = async () => {
        const response = await getAssignedJob(UserId);
        if (response === undefined) {
          toast.warning("Can't connect to network!! ");
        }
        if (response?.success) {
          setAllJob(response.result);
        }
      };
      fetchAssignedJobs();
    }
  }, []);
  const startHandler = async (item) => {
    const { id, templateId } = item;

    const obj = {
      id: id,
      templateId: templateId,
    };
    const res = await startJob(obj);

    localStorage.setItem("scantemplateId", templateId);
    localStorage.setItem("jobId", id);
    navigate("/moderator/scanjob", { state: { templateId: templateId } });
  };
  // const token = localStorage.getItem("token");
  // if (token) {
  //   const userInfo = jwtDecode(token);
  //   console.log(userInfo);
  // }
  const continueHandler = (item) => {
    const { id, templateId } = item;
    localStorage.setItem("scantemplateId", templateId);
    localStorage.setItem("jobId", id);

    navigate("/moderator/scanjob", { state: { templateId: templateId } });
  };
  const ALLJOBS = allJob.map((item, index) => {
    let assignuser = "Not Assigned";
    if (item.assignUser !== "string" || item.assignUser !== "") {
      assignuser = item.assignUser;
    }
    console.log(item);
    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.jobName}</td>
        <td>{item.templateName}</td>
        <td>{item.jobStatus}</td>
        <td>{item.imageType ? item.imageType : "Disabled"}</td>
        <td className="text-right">
          {/* <UncontrolledDropdown>
                    <DropdownToggle
                        className="btn-icon-only text-light"
                        href="#pablo"
                        role="button"
                        size="sm"
                        color=""
                        onClick={(e) => e.preventDefault()}
                    >
                        <i className="fas fa-ellipsis-v" />
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-arrow" right>
                        <DropdownItem >Assign</DropdownItem>
                        <DropdownItem  >Edit</DropdownItem>
                        <DropdownItem >Delete</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown> */}

          {item.jobStatus === "Completed" && (
            <Button disabled color="default" onClick={() => startHandler(item)}>
              Job Completed
            </Button>
          )}
          {item.jobStatus === "Pending" && (
            <Button color="default" onClick={() => startHandler(item)}>
              Start
            </Button>
          )}
          {item.jobStatus === "In Progress" && (
            <Button color="info" onClick={() => continueHandler(item)}>
              Continue
            </Button>
          )}
        </td>
      </tr>
    );
  });

  return (
    <>
      <NormalHeader />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between">
                  <h3 className="mt-2"> Job Queue</h3>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush mb-5" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Sl no.</th>
                    <th scope="col">Job Name</th>
                    <th scope="col">Template</th>
                    <th scope="col">Job Status </th>
                    <th scope="col">Image</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody style={{ minHeight: "100rem", width: "100%" }}>
                  {ALLJOBS.length > 0 ? (
                    ALLJOBS // This assumes ALLJOBS is an array of JSX elements
                  ) : (
                    <tr>
                      <td
                        colSpan="100%"
                        style={{ textAlign: "center", width: "100%" }}
                      >
                        No Job Queue Present
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default ModeratorJobQueue;
