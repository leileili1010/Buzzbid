import { useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {formatDate} from "../helperFunctions/helperFunctions";
import "./AuctionResults.css"
import OpenModalButton from "../OpenModalButton";
import DeleteRatingModal from "../ItemRating/DeleteRatingModal";
import ItemResults from "./ItemResults";

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
                        <td className="item-name">
                            <OpenModalButton
                            buttonText={auctionResult.itemName}
                            modalComponent={<ItemResults
                                auctionId={auctionResult.auctionId}
                                username={currentUser.username}
                                isAdmin={currentUser.isAdmin}
                                userRole={currentUser.userRole}
                                itemId={auctionResult.itemId}
                            />}/>
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