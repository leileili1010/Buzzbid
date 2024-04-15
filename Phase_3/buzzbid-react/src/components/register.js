import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {MDBBtn, MDBCol, MDBContainer, MDBInput, MDBRow} from "mdb-react-ui-kit";
import '../css/style.css';

function Register() {
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[confirmPassword, setConfirmPassword] = useState('');
    const[firstName, setFirstName] = useState('');
    const[lastName, setLastName] = useState('');
    const[error, setError] = useState('');
    const nav = useNavigate();

    const handleRegistration = async() => {
        try {
            if (!username || !password || !confirmPassword || !firstName || !lastName) {
                setError('Please enter all fields.');
            } else if (password !== confirmPassword) {
                setError('Passwords do not match.')
            } else {
                const response = await axios.post("http://localhost:8081/auth/register", {
                   username, password, firstName, lastName
                });

                localStorage.setItem('token', JSON.stringify(response.data.token))
                localStorage.setItem('user', JSON.stringify({
                    username: username,
                    name: response.data.name,
                    isAdmin : false,
                    userRole: ''
                }));

                nav('/dashboard');
            }
        } catch (error) {
            setError(error.response ? error.response.data.message : error.message);
        }
    };

    const returnToLogin = () => {
        nav('/login');
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="bg border rounded-lg p-4" style={{width: '500px', height: 'auto'}}>
                <h2 className="mb-4 text-center">Register</h2>
                <MDBContainer className="p-3">
                    <MDBRow>
                        <MDBCol md="4">
                            <label>First Name</label>
                        </MDBCol>
                        <MDBCol md="8">
                            <MDBInput wrapperClass='mb-4' placeholder='First Name' id='first-name' value={firstName} type='text'
                                      onChange={(e) => setFirstName(e.target.value)}/>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="4">
                            <label>Last Name</label>
                        </MDBCol>
                        <MDBCol md="8">
                            <MDBInput wrapperClass='mb-4' placeholder='Last Name' id='last-name' value={lastName} type='text'
                                      onChange={(e) => setLastName(e.target.value)}/>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="4">
                            <label>Username</label>
                        </MDBCol>
                        <MDBCol md="8">
                            <MDBInput wrapperClass='mb-4' placeholder='Username' id='username' value={username} type='email'
                                      onChange={(e) => setUsername(e.target.value)}/>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="4">
                            <label>Password</label>
                        </MDBCol>
                        <MDBCol md="8">
                            <MDBInput wrapperClass='mb-4' placeholder='Password' id='password' type='password' value={password}
                                      onChange={(e) => setPassword(e.target.value)}/>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="4">
                            <label>Confirm Password</label>
                        </MDBCol>
                        <MDBCol md="8">
                            <MDBInput wrapperClass='mb-4' placeholder='Confirm password' id='confirm-password' type='password'
                                      value={confirmPassword}
                                      onChange={(e) => setConfirmPassword(e.target.value)}/>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="3"></MDBCol>
                        <MDBCol md="9">
                            {error && <p className="text-danger">{error}</p>}
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="6">
                            <MDBBtn className="mb-4 d-block btn-primary" style={{height: '50px', width: '100%'}}
                                    onClick={handleRegistration}>Register
                            </MDBBtn>
                        </MDBCol>
                        <MDBCol md="6">
                            <MDBBtn className="mb-4 d-block btn-primary" style={{height: '50px', width: '100%'}}
                                    onClick={returnToLogin}>Cancel
                            </MDBBtn>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="3"></MDBCol>
                        <MDBCol md="6">
                            <div className="text-center">
                                <p>Already Registered? <a href="/login">Log in</a></p>
                            </div>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </div>
        </div>
    );
}

export default Register;