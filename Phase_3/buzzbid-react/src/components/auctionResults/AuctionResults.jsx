import React, {useEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import axios from "axios";
import {formatDate} from "../helperFunctions/helperFunctions";
import "./AuctionResults.css"
import '../../css/style.css';
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdb-react-ui-kit";

const AuctionResults = () => {
    const navigate = useNavigate();
    const [auctionResults, setAuctionResults] = useState([]);
    const userJsonString = localStorage.getItem('user');
    const currentUser = JSON.parse(userJsonString);
    const nav = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8081/auction/auction-results");
                const data = response.data;
                setAuctionResults(data);
            } catch (error) {
                console.error('Error fetching auction-results:', error)
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        if (!userJsonString) navigate("/login");
    }, [userJsonString, navigate]);

    const close = () => {
        nav(-1)
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg">
            <div className="auction-result-container rounded-lg p-4" style={{width: '1500px', height: '800px'}}>
                <MDBContainer className="p-3">
                    <MDBRow>
                        <MDBCol md="12">
                            <h2>Auction Results</h2>
                            <table>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Item Name</th>
                                    <th>Sale Price</th>
                                    <th>Winner</th>
                                    <th>Auction Ended</th>
                                </tr>
                                </thead>
                                <tbody>
                                {auctionResults.map((auctionResult) => (
                                    <tr key={auctionResult.itemId}>
                                        <td>{auctionResult.itemId}</td>
                                        <td className="item-name">
                                            <Link to="/viewItem" state={{auctionId: auctionResult.auctionId}}>
                                                {auctionResult.itemName}
                                            </Link>
                                        </td>
                                        <td>{auctionResult.salePrice || "-"}</td>
                                        <td className="winner">{auctionResult.winner || "-"}</td>
                                        <td className="auction-end-time">{formatDate(auctionResult.auctionEnded)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="4"></MDBCol>
                        <MDBCol md="4"></MDBCol>
                        <MDBCol md="4">
                            <MDBBtn type="button" className="mb-4 d-block btn-primary"
                                    style={{height: '50px', width: '100%'}}
                                    onClick={e => close(e)}>Done
                            </MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </div>
        </div>
    )
}

export default AuctionResults;