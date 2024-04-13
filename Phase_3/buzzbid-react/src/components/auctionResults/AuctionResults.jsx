import React, { useEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import axios from "axios";
import {formatDate} from "../helperFunctions/helperFunctions";
import "./AuctionResults.css"

const AuctionResults = () => {
    const navigate = useNavigate();
    const [auctionResults, setAuctionResults] = useState([]);
    const userJsonString = localStorage.getItem('user');
    const currentUser = JSON.parse(userJsonString);

    useEffect(() => {
       const fetchData = async ()=> {
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

    // useEffect(() => {
    //     console.log("Auction results changed:", auctionResults);
    // }, [auctionResults]);

    return (
        <div className="auction-result-container">
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
        </div>
    )
}

export default AuctionResults;