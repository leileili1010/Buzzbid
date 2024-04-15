import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {MDBContainer, MDBInput, MDBBtn, MDBCol, MDBRow} from 'mdb-react-ui-kit';
import buzzLogo from '../images/buzz.png';
import '../css/style.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const nav = useNavigate();
    const userJsonString = localStorage.getItem('user');

    useEffect(() => {
        if (userJsonString) {
            nav("/dashboard");
        }
    }, [userJsonString, nav]);

    const handleLogin = async () => {
        try {
            if (!username || !password) {
                setError("Please enter your username and password to log in.");
            } else {
                const response = await axios.post("http://localhost:8081/auth/login", {
                    username, password
                });

                localStorage.setItem('token', JSON.stringify(response.data.token))
                localStorage.setItem('user', JSON.stringify({
                    username: username,
                    name: response.data.name,
                    isAdmin: response.data.admin,
                    userRole: response.data.userRole
                }));

                nav('/dashboard');
            }
        } catch (error) {
            setError('Invalid username or password. Please try again.');
        }
    };

    const setDemoUser = () => {
        setUsername("jgreen");
        setPassword("1234");
    }

    const setDemoAdminUser = () => {
        setUsername("mred");
        setPassword("12345");
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="bg border rounded-lg p-4" style={{width: 'auto', height: 'auto'}}>
                <MDBContainer className="p-3">
                    <MDBRow>
                        <MDBCol md="6">
                            <img width={250} height={250} src={buzzLogo} alt="buzz"/>
                        </MDBCol>
                        <MDBCol md="6">
                            <h1 className="mb-4 text-center">Buzzbid</h1>
                            <h3 className="mb-4 text-center">It's not junk if someone will pay for it.</h3>
                        </MDBCol>
                    </MDBRow>
                    <br/>
                    <br/>
                    <MDBRow>
                        <MDBCol md="2">
                            <label>Username</label>
                        </MDBCol>
                        <MDBCol md="10">
                            <MDBInput wrapperClass='mb-4' placeholder='Username' id='username' value={username}
                                      type='email'
                                      onChange={(e) => setUsername(e.target.value)}/>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="2">
                            <label>Password</label>
                        </MDBCol>
                        <MDBCol md="10">
                            <MDBInput wrapperClass='mb-4' placeholder='Password' id='password' type='password'
                                      value={password}
                                      onChange={(e) => setPassword(e.target.value)}/>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="3"></MDBCol>
                        <MDBCol md="9">
                            {error && <p className="text-danger">{error}</p>}
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="3"></MDBCol>
                        <MDBCol md="6">
                            <MDBBtn type="button" className="mb-4 d-block btn-primary"
                                    style={{height: '50px', width: '100%'}}
                                    onClick={handleLogin}>Log In
                            </MDBBtn>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="3"></MDBCol>
                        <MDBCol md="6">
                            <div className="text-center">
                                <p>Not registered? <a href="/register">Register</a></p>
                            </div>
                            <div className="text-center">
                                <div onClick={setDemoUser} className="demo-user"
                                     style={{cursor: 'pointer', color: '#007bff', textDecoration: 'underline'}}
                                >Demo User
                                </div>
                                <div onClick={setDemoAdminUser} className="demo-user"
                                     style={{cursor: 'pointer', color: '#007bff', textDecoration: 'underline'}}
                                >Demo AdminUser
                                </div>
                            </div>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </div>
        </div>
    );
}

export default Login;