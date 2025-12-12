import { useState, useRef } from 'react';
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from 'reactstrap';
import Spinner from 'react-bootstrap/Spinner';
import Select from 'react-select';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { createUser } from 'helper/userManagment_helper';
import { useNavigate } from 'react-router-dom';

const roles = [
  { roleName: 'admin' },
  { roleName: 'moderator' },
  { roleName: 'operator' },
];

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // For eye icon toggle
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const navigate = useNavigate();
  const emailRef = useRef(null);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const signupHandler = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !email ||
      !phoneNumber ||
      !role ||
      !password ||
      !confirmPassword
    ) {
      toast.error('All fields are required.');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Invalid email format.');
      emailRef.current.focus();
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        name: name.trim(),
        email: email.trim(),
        cont: phoneNumber.trim(),
        role: role.roleName.trim(),
        pwd: password.trim(),
      };

      const res = await createUser(payload);

      if (res.status) {
        toast.success(res.message || 'Account created successfully');

        if (role.roleName === 'operator') {
          navigate('/operator/index');
        } else if (role.roleName === 'moderator') {
          navigate('/moderator/index');
        } else {
          navigate('/admin/index');
        }
        return;
      } else {
        toast.error(res?.message || 'Unable to create account');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Col
      lg='5'
      md='7'
    >
      <Card className='bg-secondary shadow border-0'>
        <div className='text-center text-muted mt-4'>
          <img
            alt='...'
            src={require('../../assets/img/brand/ios.png')}
            height='30rem'
          />
        </div>

        <CardBody className='px-lg-5 py-lg-5'>
          <div className='text-center text-muted mb-4'>
            <h1>Create Account</h1>
          </div>

          <Form
            role='form'
            onSubmit={signupHandler}
          >
            {/* Name */}
            <FormGroup>
              <InputGroup className='input-group-alternative mb-3'>
                <InputGroupAddon addonType='prepend'>
                  <InputGroupText>
                    <i className='ni ni-single-02' />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder='Full Name'
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </InputGroup>
            </FormGroup>

            {/* Email */}
            <FormGroup>
              <InputGroup className='input-group-alternative mb-3'>
                <InputGroupAddon addonType='prepend'>
                  <InputGroupText>
                    <i className='ni ni-email-83' />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  ref={emailRef}
                  placeholder='Email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => {
                    if (!validateEmail(email)) {
                      toast.error('Invalid email format.');
                      emailRef.current.focus();
                    }
                  }}
                />
              </InputGroup>
            </FormGroup>

            {/* Phone */}
            <FormGroup>
              <InputGroup className='input-group-alternative mb-3'>
                <InputGroupAddon addonType='prepend'>
                  <InputGroupText>
                    <i className='ni ni-mobile-button' />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder='Phone Number'
                  type='number'
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </InputGroup>
            </FormGroup>

            {/* Role */}
            <FormGroup className='mb-3'>
              <label>Select Role</label>
              <Select
                value={role}
                onChange={(value) => setRole(value)}
                options={roles}
                getOptionLabel={(opt) => opt.roleName}
                getOptionValue={(opt) => opt.roleName}
              />
            </FormGroup>

            {/* Password with Eye Icon */}
            <FormGroup>
              <InputGroup className='input-group-alternative mb-3'>
                <InputGroupAddon addonType='prepend'>
                  <InputGroupText>
                    <i className='ni ni-lock-circle-open' />
                  </InputGroupText>
                </InputGroupAddon>

                <Input
                  placeholder='Password'
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* Eye icon */}
                <InputGroupAddon addonType='append'>
                  <InputGroupText
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowPwd(!showPwd)}
                  >
                    <i
                      className={showPwd ? 'ni ni-eye-17' : 'ni ni-fat-remove'}
                    />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </FormGroup>

            {/* Confirm Password with Eye */}
            <FormGroup>
              <InputGroup className='input-group-alternative mb-3'>
                <InputGroupAddon addonType='prepend'>
                  <InputGroupText>
                    <i className='ni ni-lock-circle-open' />
                  </InputGroupText>
                </InputGroupAddon>

                <Input
                  placeholder='Confirm Password'
                  type={showConfirmPwd ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {/* Eye icon */}
                <InputGroupAddon addonType='append'>
                  <InputGroupText
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                  >
                    <i
                      className={
                        showConfirmPwd ? 'ni ni-eye-17' : 'ni ni-fat-remove'
                      }
                    />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </FormGroup>

            <div className='text-center'>
              <Button
                className='my-4'
                color='primary'
                type='submit'
                disabled={isLoading}
                style={{ minWidth: '120px', minHeight: '48px' }}
              >
                {isLoading ? <Spinner animation='border' /> : 'Sign Up'}
              </Button>
            </div>

            <div className='text-center mt-2'>
              <Button
                color='link'
                type='button'
                onClick={() => navigate('/auth/login')}
              >
                Already have an account? Sign In
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Col>
  );
};

export default Signup;
