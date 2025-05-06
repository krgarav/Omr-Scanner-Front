import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  Container,
  Row,
  Button,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  CardBody,
} from "reactstrap";
import DataContext from "store/DataContext";
import { useNavigate } from "react-router-dom";
import NormalHeader from "components/Headers/NormalHeader";
import axios from "axios";
import { toast } from "react-toastify";
import getBaseUrl from "services/BackendApi";
const About = () => {
  const [email, setEmail] = useState("");
  const [baseURL, setBaseURL] = useState("Loading...");
  const [error, setError] = useState("");
  const dataCtx = useContext(DataContext);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUrl = async () => {
      const URL = await getBaseUrl();
      setBaseURL(URL);
    };
    fetchUrl();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (email === "") {
      setError("Entered IP cannot be blank.");
      return;
    }

    const res = window.confirm(
      `Are you sure you want to connect to ${email} IP?`
    );
    if (!res) {
      return;
    }
    const Obj = {
      backendUrl: email,
    };

    try {
      const res2 = await axios.post("http://localhost/api/config", Obj);
      console.log(res2);

      if (res2) {
        toast.success("Changed IP");
      }

      setTimeout(() => {
        window.location.reload(); // Reload the page
      }, 400);
    } catch (error) {
      // Handle error here
      toast.error("Cannot set IP");
      console.error("There was an error submitting the form:", error);
      setError("Failed to change IP. Please try again.");
    }
  };
  const today = new Date();
  const releaseDate = `${
    today.getMonth() + 1
  }/${today.getDate()}/${today.getFullYear()}`;

  const appDescription = `
    Our software is designed to streamline the scanning and result calculation of 
    OMR (Optical Mark Recognition) sheets. It is ideal for educational institutions 
    and organizations requiring large-scale OMR processing. The software integrates 
    with Sekonic SR8000 H scanners to ensure fast and accurate scanning.

    The software also provides robust role-based access control with different 
    levels for Admin, Moderator, and Operator, ensuring that tasks are efficiently 
    distributed and managed.
`;

  const keyFeatures = [
    "High-accuracy OMR sheet scanning and result calculation.",
    "Integrated with Sekonic SR8000 H scanners for optimal performance.",
    "Role-based access control (Admin, Moderator, Operator).",
    "Admins can assign tasks to users for efficient workflow management.",
    "Custom template creation for flexible scanning rules.",
    "Structured file management system to handle scanned documents and results efficiently on the server.",
  ];
  return (
    <>
      <NormalHeader />
      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between">
                  <h3 className="mt-2">About Optic View Software</h3>
                </div>
              </CardHeader>
              <CardBody>
                <Row className="justify-content-center">
                  <Col md={10} lg={8}>
                    {/* Version Information Section */}
                    <div className="text-center mb-4">
                      <h4>Application Version</h4>
                      <p className="lead">
                        Version: <strong>{"2.2.2"}</strong>
                      </p>
                      <p>
                        Release Date: <strong>{releaseDate}</strong>
                      </p>
                    </div>

                    {/* About Information Section */}
                    <div className="text-center mb-4">
                      <h4>About Application</h4>
                      <p>{appDescription}</p>

                      <h4>Key Features</h4>
                      <ul className="text-start">
                        {keyFeatures.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <Row className="justify-content-center mb-3">
                  <Col xs="auto">
                    {/* Displaying Current App IP */}
                    <label className="text-center d-block">
                      v : <strong>2.1.1</strong>
                    </label>
                  </Col>
                </Row>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default About;
