import { useEffect, useState} from "react";
import axios from "axios";
import {formatDate} from "../helperFunctions/helperFunctions";
import "./AuctionResults.css"

const AuctionResults = () => {
    const [auctionResults, setAuctionResults] = useState([]);

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
        console.log("Auction results changed:", auctionResults);
    }, [auctionResults]);

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
                        <td className="item-name">{auctionResult.itemName}</td>
                        <td>{auctionResult.salePrice || "-"}</td>
                        <td>{auctionResult.winner || "-"}</td>
                        <td className="auction-end-time">{formatDate(auctionResult.auctionEnded)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>


    )
}

export default AuctionResults;