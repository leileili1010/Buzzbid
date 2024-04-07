import React, {useRef, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {MDBContainer, MDBInput, MDBBtn, MDBCol, MDBRow} from 'mdb-react-ui-kit';
import buzzLogo from '../images/buzz.png';

function Login() {
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[isAdmin, setIsAdmin] = useState(false);
    const[userRole, setUserRole] = useState('');
    const[error, setError] = useState('');
    const nav = useNavigate();

    const handleLogin = async() => {
      try {
          if (!username || !password) {
              setError("Please enter your username and password to log in.");
          } else {
              const response = await axios.post("http://localhost:8081/auth/login", {
                  username, password
              });

              let adminResponse = response.data.admin;
              let roleResponse = response.data.userRole;
              setIsAdmin(adminResponse);
              setUserRole(roleResponse);
              nav('/dashboard', {state : {username: username, isAdmin : adminResponse, userRole: roleResponse}});
          }
      } catch (error) {
          setError('Invalid username or password. Please try again.');
      }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="border rounded-lg p-4" style={{width: 'auto', height: 'auto'}}>
                <MDBContainer className="p-3">
                    <MDBRow>
                        <MDBCol md="6">
                            <img width={250} height={250} src={buzzLogo} alt="buzz" />
                        </MDBCol>
                        <MDBCol md="6">
                            <h1 className="mb-4 text-center">Buzzbid</h1>
                            <h3 className="mb-4 text-center">It's not junk if someone will pay for it.</h3>
                        </MDBCol>
                    </MDBRow>
                    <br/>
                    <MDBRow>
                        <MDBCol md="12">
                            <MDBInput wrapperClass='mb-4' placeholder='Username' id='username' value={username} type='email'
                                      onChange={(e) => setUsername(e.target.value)}/>
                            <MDBInput wrapperClass='mb-4' placeholder='Password' id='password' type='password' value={password}
                                      onChange={(e) => setPassword(e.target.value)}/>
                            {error && <p className="text-danger">{error}</p>}
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="12">
                            <button className="mb-4 d-block btn-primary" style={{height: '50px', width: '100%'}}
                                    onClick={handleLogin}>Log In
                            </button>
                            <div className="text-center">
                                <p>Not registered? <a href="/register">Register</a></p>
                            </div>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </div>
        </div>
    );
}

export default Login;