
import {
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
import { Badge } from "react-bootstrap";

// core components
import Header from "components/Headers/Header.js";
import NormalHeader from "components/Headers/NormalHeader";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import Select from "react-select";
import Jobcard from "ui/Jobcard.js";
import JobModal from "ui/JobModal";
import { getJobs } from "helper/job_helper";
import { deleteJob } from "helper/job_helper";
import AssignModal from "ui/AssignModal";
import { fetchAllUsers } from "helper/userManagment_helper";
import { toast } from "react-toastify";
import SmallHeader from "components/Headers/SmallHeader";
import EditJobModal from "ui/EditJobModal";
import Placeholder from "ui/Placeholder";

const Jobs = () => {
  const [modalShow, setModalShow] = useState(false);
  const [assignModalShow, setAssignModalShow] = useState(false);
  const [allJobs, setAllJobs] = useState([]);
  const [toggler, setToggler] = useState(true);
  const [currentJobData, setCurrentJobData] = useState({});
  const [editJobModal, setEditJobModal] = useState(false);
  const [currentId, setCurrentId] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchAllJobs = async () => {
      setLoading(true);
      const response = await getJobs();
      console.log(response);
      if (response) {
        if (response.result !== null) {
          setAllJobs(response.result);
        }
        if(response.result === null){
          setAllJobs([])
        }
        setLoading(false);
      }
      if (response === undefined) {
        toast.error("Cant connect to network");
        setLoading(false);
      }
      setLoading(false);
      // console.log(response.result)
    };
    fetchAllJobs();
  }, [modalShow, toggler, assignModalShow]);

  const deleteHandler = async (id) => {
    const result = window.confirm("Are you sure you want to delete the Job?");
    if (!result) {
      return;
    }
    const response = await deleteJob(id);
    if (response?.success) {
      toast.success("Deleted Job successfully");
    }
    setToggler((prev) => !prev);
  };
  const jobEditHandler = async (id) => {
    setCurrentId(id);
    setEditJobModal(true);
  };

  const placeHolderJobs = new Array(10).fill(null).map((_, index) => (
    <tr key={index}>
      <td>
        <Placeholder width="60%" height="1.5em" />
      </td>
      <td>
        <Placeholder width="60%" height="1.5em" />
      </td>
      <td>
        <Placeholder width="60%" height="1.5em" />
      </td>
      <td>
        <Placeholder width="60%" height="1.5em" />
      </td>
      <td>
        <Placeholder width="60%" height="1.5em" />
      </td>
      <td></td>
    </tr>
  ));
  const ALLJOBS = allJobs?.map((item, index) => {
    let assignuser = !item.assignUser ? "Not Assigned" : item.assignUser;
    // if (item.assignUser !== "string" || item.assignUser !== "") {
    //   assignuser = item.assignUser;
    // }
    let bgColor = "warning";
    if (item.jobStatus === "Completed") {
      bgColor = "success";
    } else if (item.jobStatus === "In Progress") {
      bgColor = "primary";
    }
    return (
      <tr key={index}>
        <td>{index + 1}</td>
        {/* <td>{item.jobName}</td> */}
        <td>{item.jobName}</td>
        <td>{item.templateName}</td>
        <td>{assignuser}</td>
        <td style={{ color: "black" }}>
          <Badge pill bg={bgColor}>
            {item.jobStatus}
          </Badge>
        </td>
        <td className="text-right">
          <UncontrolledDropdown>
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
              <DropdownItem
                onClick={() => {
                  setAssignModalShow(true);
                  setCurrentJobData(item);
                }}
              >
                {item.jobStatus === "Completed" ? "Re-Assign" : "Assign"}
              </DropdownItem>
              <DropdownItem onClick={() => jobEditHandler(item.id)}>
                Edit
              </DropdownItem>
              <DropdownItem
                style={{ color: "red" }}
                onClick={() => deleteHandler(item.id)}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </td>
      </tr>
    );
  });
  return (
    <>
      <NormalHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between">
                  <h3 className="mt-2">All Jobs</h3>
                  <Button
                    className=""
                    color="primary"
                    type="button"
                    onClick={() => {
                      setModalShow(true);
                    }}
                  >
                    Add Job
                  </Button>
                </div>
              </CardHeader>
              <div style={{ height: "70vh", overflow: "auto" }}>
                <Table
                  className="align-items-center table-flush mb-5"
                  responsive
                >
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Sno.</th>
                      <th scope="col">Job Name</th>
                      <th scope="col">Template</th>
                      <th scope="col">Operator </th>
                      <th scope="col">Job Status</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody
                    style={{
                      overflow: "auto",
                    }}
                  >
                    {loading ? placeHolderJobs : ALLJOBS}

                    {ALLJOBS.length === 0 && (
                      <tr>
                        <td
                          colSpan="100%"
                          style={{ textAlign: "center", width: "100%" }}
                        >
                          No Jobs Present
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card>
          </div>
        </Row>
      </Container>
      {assignModalShow && (
        <AssignModal
          show={assignModalShow}
          onHide={() => setAssignModalShow(false)}
          jobData={currentJobData}
        />
      )}
      {modalShow && (
        <JobModal show={modalShow} onHide={() => setModalShow(false)} />
      )}

      {editJobModal && (
        <EditJobModal
          show={editJobModal}
          onHide={() => setEditJobModal(false)}
          jobId={currentId}
        />
      )}
    </>
  );
};

export default Jobs;
