import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {MDBBtn, MDBContainer, MDBInput} from "mdb-react-ui-kit";

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
                localStorage.setItem('user', JSON.stringify({username: username, isAdmin : false, userRole: ''}));
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
            <div className="border rounded-lg p-4" style={{width: '500px', height: 'auto'}}>
                <MDBContainer className="p-3">
                    <h2 className="mb-4 text-center">Register</h2>
                    <label>First Name</label>
                    <MDBInput wrapperClass='mb-4' placeholder='First Name' id='first-name' value={firstName} type='text'
                              onChange={(e) => setFirstName(e.target.value)}/>
                    <label>Last Name</label>
                    <MDBInput wrapperClass='mb-4' placeholder='Last Name' id='last-name' value={lastName} type='text'
                              onChange={(e) => setLastName(e.target.value)}/>
                    <label>Username</label>
                    <MDBInput wrapperClass='mb-4' placeholder='Username' id='username' value={username} type='email'
                              onChange={(e) => setUsername(e.target.value)}/>
                    <label>Password</label>
                    <MDBInput wrapperClass='mb-4' placeholder='Password' id='password' type='password' value={password}
                              onChange={(e) => setPassword(e.target.value)}/>
                    <label>Confirm Password</label>
                    <MDBInput wrapperClass='mb-4' placeholder='Confirm password' id='confirm-password' type='password'
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}/>
                    {error && <p className="text-danger">{error}</p>}
                    <MDBBtn className="mb-4 d-block btn-primary" style={{height: '50px', width: '100%'}}
                            onClick={handleRegistration}>Register
                    </MDBBtn>
                    <MDBBtn className="mb-4 d-block btn-primary" style={{height: '50px', width: '100%'}}
                            onClick={returnToLogin}>Cancel
                    </MDBBtn>
                    <div className="text-center">
                        <p>Already Registered? <a href="/login">Log in</a></p>
                    </div>
                </MDBContainer>
            </div>
        </div>
    );
}

export default Register;