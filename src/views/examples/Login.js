/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import { fetchAllUsers } from "helper/userManagment_helper";
import { login } from "helper/userManagment_helper";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import Spinner from 'react-bootstrap/Spinner';
import { jwtDecode } from 'jwt-decode';
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
// useEffect(()=>{
//   localStorage.clear();
// },[])
  const navigate = useNavigate();

  const signInHandler = async (e) => {
    e.preventDefault()
    if (!email) {
      alert("Email cannot be blank.");
      return
    }
    if (!password) {
      alert("Password cannot be blank.");
      return
    }
    try {
      const obj = {
        email,
        password,
      };
      setIsLoading(true)
      const res = await login(obj);
      console.log(res)
      if (res === undefined) {
        toast.error("Can't Connect to network");
      }
      if (!res.success) {
        alert(res.message);
        setIsLoading(false)
        return;
      }
      localStorage.setItem("token", res.token);
      const decoded = jwtDecode(res.token);
      if (decoded.Role === "Operator") {
        navigate("/operator/index", { replace: true });
      } else if (decoded.Role === "Moderator") {
        navigate("/moderator/index", { replace: true });
      } else {
        navigate("/admin/index", { replace: true });
      }
      setIsLoading(false)

    } catch (error) {
      setIsLoading(false)
      console.log(error);
    }
  };
  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <div className="text-center text-muted mt-4">
            <img
              alt="..."
              src={require("../../assets/img/brand/ios.png")}
              height={"30rem"}
            />
          </div>
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <h1>Sign in </h1>
            </div>
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <div className="text-center">
                <Button
                  className="my-4"
                  color="primary"
                  type="submit"
                  onClick={signInHandler}
                  style={{ minWidth: "100px", minHeight: "50px" }}
                >
                  {isLoading && <Spinner animation="border" role="status" />}
                  {!isLoading && "Sign in"}
                  {/* Sign in */}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Login;
