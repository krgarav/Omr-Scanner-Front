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
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import NormalHeader from "components/Headers/NormalHeader";
import { Modal } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import * as url from "../helper/url_helper";
import { toast } from "react-toastify";
import axios from "axios";
import { getUserRoles } from "helper/userManagment_helper";
import { createUser } from "helper/userManagment_helper";
import { fetchAllUsers } from "helper/userManagment_helper";
import { updateUser } from "helper/userManagment_helper";
import { removeUser } from "helper/userManagment_helper";
import Placeholder from "ui/Placeholder";

const UserManagment = () => {
  const [modalShow, setModalShow] = useState(false);
  const [createModalShow, setCreateModalShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectecdRole, setSelectedRole] = useState({});
  const [roles, setRoles] = useState([]);
  const [password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [spanDisplay, setSpanDisplay] = useState("none");
  const [allUsers, setAllUsers] = useState([]);
  const [id, setId] = useState("");
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null); // Reference to the input element
  const confirmRef = useRef(null);
  const fetchRoles = async () => {
    try {
      const data = await getUserRoles();
      console.log(data);
      if (data?.success) {
        console.log(roles.result);
        setRoles(data?.result);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAllUsers();
      setLoading(false);
      console.log(data);
      if (data?.success) {
        console.log(roles.result);
        setAllUsers(data?.result);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, [toggle]);
  const handleSelectRole = (selectedValue) => {
    // console.log(selectedValue);
    setSelectedRole(selectedValue);
  };

  const handleUpdate = async () => {
    if (!name || !email || !phoneNumber || !selectecdRole) {
      setSpanDisplay("inline");
    } else {
      try {
        // const { data } = await axios.post("https://rb5xhrfq-5289.inc1.devtunnels.ms/UserRegistration", { name, email, phoneNumber, role, password, ConfirmPassword });
        let role = selectecdRole.roleName;
        let userName = name;
        let userRole = role;
        const data = await updateUser({
          id,
          userName,
          email,
          phoneNumber,
          userRole,
        });
        if (data?.success) {
          console.log(data.message);
          toast.success(data?.message);
          setName("");
          setEmail("");
          setPhoneNumber("");
          setSelectedRole("");
          setCreateModalShow(false);
          fetchAllUsers();
          setToggle((prev) => !prev);
          setModalShow(false);
        } else {
          toast.error(data?.message);
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  };

  const handleCreate = async () => {
    if (ConfirmPassword !== password) {
      alert("Password and confirm password do not match");
      return;
    }
    if (
      !name ||
      !email ||
      !phoneNumber ||
      !selectecdRole ||
      !password ||
      !ConfirmPassword
    ) {
      setSpanDisplay("inline");
    } else {
      if (password !== ConfirmPassword) {
        toast.error("Passwod did not match");
      }

      try {
        // const { data } = await axios.post("https://rb5xhrfq-5289.inc1.devtunnels.ms/UserRegistration", { name, email, phoneNumber, role, password, ConfirmPassword });
        let userRole = selectecdRole.roleName;
        const userName = name;
        const data = await createUser({
          userName: userName.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
          userRole: userRole.trim(),
          password: password.trim(),
          ConfirmPassword: ConfirmPassword.trim(),
        });

        if (data?.success) {
          console.log(data.message);
          toast.success(data?.message);
          setName("");
          setEmail("");
          setPhoneNumber("");
          setSelectedRole("");
          setPassword("");
          setConfirmPassword("");
          setCreateModalShow(false);
          setToggle((prev) => !prev);
        } else {
          console.log();
          toast.error(data?.message);
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  };

  const deleteUser = async (d) => {
    const result = window.confirm("Are you sure you want to delete user?");
    if (!result) {
      return;
    }

    try {
      const data = await removeUser(d.id);
      if (data?.success) {
        setToggle((prev) => !prev);
        toast.success(data.message);
        // fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleRowClick = (d) => {
    // e.preventDefault();
    console.log(d);
    setName(d.userName);
    setEmail(d.email);
    setPhoneNumber(d.phoneNumber);
    setSelectedRole(d?.userRoleList[0]);
    setModalShow(true);
    setId(d.id);
  };
  // Function to validate the email format
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const placeHolderUser = new Array(10).fill(null).map((_, index) => (
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
  const ALLUSER = allUsers?.map((d, i) => (
    <>
      <tr key={i}>
        <td>{i + 1}</td>
        <td>{d.userName}</td>
        <td>{d.email}</td>
        <td>{d.phoneNumber}</td>
        <td>{d?.userRoleList[0]?.roleName}</td>
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
              <DropdownItem href="#pablo" onClick={() => handleRowClick(d)}>
                Edit
              </DropdownItem>
              <DropdownItem href="#pablo" onClick={(e) => deleteUser(d)}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </td>
      </tr>
    </>
  ));
  return (
    <>
      <NormalHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between">
                  <h3 className="mt-2">All Users</h3>
                  <Button
                    className=""
                    color="primary"
                    type="button"
                    onClick={() => setCreateModalShow(true)}
                  >
                    Create User
                  </Button>
                </div>
              </CardHeader>
              <div style={{ height: "70vh", overflow: "auto" }}>
                <Table
                  className="align-items-center table-flush mb-5"
                  responsive
                  style={{ borderCollapse: "collapse" }}
                >
                  <thead
                    className="thead-light"
                    style={{
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f8f9fa", // Adjust to match your table's background color
                      zIndex: 10, // Ensure the header stays on top of other content
                    }}
                  >
                    <tr>
                      <th scope="col">Sno.</th>
                      <th scope="col">Username</th>
                      <th scope="col">Email</th>
                      <th scope="col">Phone Number</th>
                      <th scope="col">Role</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody style={{ minHeight: "100rem" }}>
                    {loading ? placeHolderUser : ALLUSER}
                    {ALLUSER.length === 0 && (
                      <tr>
                        <td
                          colSpan="100%"
                          style={{ textAlign: "center", width: "100%" }}
                        >
                          No User Present
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              {/* <CardFooter className=" py-4">
                                <nav aria-label="...">
                                    <Pagination
                                        className="pagination justify-content-end mb-0"
                                        listClassName="justify-content-end mb-0"
                                    >
                                        <PaginationItem className="disabled">
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                                tabIndex="-1"
                                            >
                                                <i className="fas fa-angle-left" />
                                                <span className="sr-only">Previous</span>
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem className="active">
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                1
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                2 <span className="sr-only">(current)</span>
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                3
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                <i className="fas fa-angle-right" />
                                                <span className="sr-only">Next</span>
                                            </PaginationLink>
                                        </PaginationItem>
                                    </Pagination>
                                </nav>
                            </CardFooter> */}
            </Card>
          </div>
        </Row>
      </Container>

      <Modal
        show={modalShow}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-2 col-form-label"
            >
              Name
            </label>
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Enter User Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {!name && (
                <span style={{ color: "red", display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>
          <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-2 col-form-label"
            >
              Email
            </label>
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Email Id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {!email && (
                <span style={{ color: "red", display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>
          <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-2 col-form-label"
            >
              Phone Number
            </label>
            <div className="col-md-10">
              <input
                type="Number"
                className="form-control"
                placeholder="Enter Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {!phoneNumber && (
                <span style={{ color: "red", display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>

          <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-2 col-form-label"
            >
              Role
            </label>
            <div className="col-md-10">
              <Select
                value={selectecdRole}
                onChange={handleSelectRole}
                options={roles}
                getOptionLabel={(option) => option?.roleName || ""}
                getOptionValue={(option) => option?.id?.toString() || ""}
              />
              {!selectecdRole && (
                <span style={{ color: "red", display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            color="primary"
            onClick={() => setModalShow(false)}
            className="waves-effect waves-light"
          >
            Close
          </Button>{" "}
          <Button
            type="button"
            color="success"
            onClick={handleUpdate}
            className="waves-effect waves-light"
          >
            Update
          </Button>{" "}
        </Modal.Footer>
      </Modal>

      <Modal
        show={createModalShow}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Create User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-2 col-form-label"
            >
              Email
            </label>
            <div className="col-md-10">
              <input
                type="email"
                className="form-control"
                placeholder="Enter Email Id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => {
                  const toastId = "email-error-toast";
                  if (!validateEmail(email)) {
                    toast.error("Please enter a valid email address.", {
                      toastId, // Use the same ID for this toast
                    });

                    emailRef.current.focus();
                    // alert(
                    //   'Invalid email format. "@" is missing or email is incorrectly formatted.'
                    // );
                  }
                }}
                ref={emailRef}
              />
              {!email && (
                <span style={{ color: "red", display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>
          <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-2 col-form-label"
            >
              Username
            </label>
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Enter User Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <small style={{ color: "red", display: "block" }}>
                No space is allowed between username.
              </small>
              {/* {!name && (
                <span style={{ color: "red", display: "block" }}>
                  This feild is required
                </span>
              )} */}
            </div>
          </Row>

          <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-2 col-form-label"
            >
              Phone Number
            </label>
            <div className="col-md-10">
              <input
                type="Number"
                className="form-control"
                placeholder="Enter 10 digit Phone Number "
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                }}
                onBlur={() => {
                  if (phoneNumber.length < 10) {
                    alert("Phone number must be at least 10 digits long");
                  }
                }}
              />

              {!phoneNumber && (
                <span style={{ color: "red", display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>

          <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-2 col-form-label"
            >
              Role
            </label>
            <div className="col-md-10">
              <Select
                value={selectecdRole}
                onChange={handleSelectRole}
                options={roles}
                getOptionLabel={(option) => option?.roleName || ""}
                getOptionValue={(option) => option?.id?.toString() || ""}
              />
              {!selectecdRole && (
                <span style={{ color: "red", display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>

          <Row className="mb-3">
            <label
              htmlFor="example-text-input"
              className="col-md-2 col-form-label"
            >
              Password
            </label>
            <div className="col-md-10">
              <input
                type="password"
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {!password && (
                <span style={{ color: "red", display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>

          <Row className="mb-3">
            <label htmlFor="example-text-input" className="col-md-2 ">
              Confirm Password
            </label>
            <div className="col-md-10">
              <input
                type="password"
                className="form-control"
                placeholder="Enter Password"
                value={ConfirmPassword}
                ref={confirmRef}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                onBlur={() => {
                  if (password !== ConfirmPassword) {
                    toast.error("Password and confirm password does not match");
                    // confirmRef.current.focus();
                  }
                }}
              />
              {!ConfirmPassword && (
                <span style={{ color: "red", display: spanDisplay }}>
                  This feild is required
                </span>
              )}
            </div>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            color="primary"
            onClick={() => setCreateModalShow(false)}
            className="waves-effect waves-light"
          >
            Close
          </Button>{" "}
          <Button
            type="button"
            color="success"
            onClick={handleCreate}
            className="waves-effect waves-light"
          >
            Create
          </Button>{" "}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserManagment;
