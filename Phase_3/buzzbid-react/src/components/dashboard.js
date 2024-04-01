import React from 'react';
import { useNavigate} from 'react-router-dom';

function Dashboard({username}) {
    const nav = useNavigate();
    const handleLogout = () => {
        nav('/');
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="border rounded-lg p-4" style={{width: '500px', height: '400px'}}>
                <h2 className="mb-4 text-center">BuzzBid</h2>
                <p className="mb-4 text-center">Welcome, {username}!</p>
                <div className="text-center">
                    <button type="button" className="btn btn-primary mt-3" onClick={handleLogout}>Log Out</button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;