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
const AppManagement = () => {
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
    fetchUrl()
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (email === "") {
      setError("Entered IP cannot be blank.");
      return;
    }

    const res = window.confirm(`Are you sure you want to connect to ${email} IP?`);
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

  return (
    <>
      <NormalHeader />
      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between">
                  <h3 className="mt-2">Set Application IP</h3>
                </div>
              </CardHeader>
              <CardBody>
                <Row className="justify-content-center">
                  <Col md={10} lg={8}>
                    <Form onSubmit={handleSubmit} className="w-100">
                      <FormGroup>
                        <Label for="email">Enter Application IP</Label>
                        <Input
                          type="text"
                          name="email"
                          id="email"
                          placeholder="Enter Application IP"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </FormGroup>
                      <Button color="primary" type="submit" block>
                        Set App IP
                      </Button>
                    </Form>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <Row className="justify-content-center mb-3">
                  <Col xs="auto">
                    {/* Use xs="auto" to size the column based on its content */}
                    <label className="text-center d-block">
                      Current App IP ={baseURL}
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

export default AppManagement;
