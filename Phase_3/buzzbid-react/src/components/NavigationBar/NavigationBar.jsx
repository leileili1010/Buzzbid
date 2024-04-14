import buzzLogo from "../../images/buzz.png";
import React, {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import "./NavigationBar.css"

const NavigationBar = () => {
    const navigate = useNavigate();
    const userJsonString = localStorage.getItem('user');
    const currentUser = JSON.parse(userJsonString);

    useEffect(() => {
        if (!userJsonString) navigate("/login");
    }, [userJsonString, navigate]);

    return(
        <div className="Nav-bar-container">
            <div className="logo">
                <img width={50} height={50} src={buzzLogo} alt="buzz"/>
                <Link to="/dashboard"><h1>Buzzbid</h1></Link>
            </div>

            <div className="nav-links">
                <Link to="/dashboard"><p>Home</p></Link>
                <Link to="/searchItem"><p>Search for Items</p></Link>
                <Link to="/listItem"><p>List Item</p></Link>
                <Link to="/auctionresults"><p>Auction Results</p></Link>
            </div>

            <div className="profile">
                <div><i className="fa-solid fa-user" id="user-icon"></i></div>
                <p>Hello, {currentUser?.name}</p>
            </div>
        </div>
    )
}
export default NavigationBar;