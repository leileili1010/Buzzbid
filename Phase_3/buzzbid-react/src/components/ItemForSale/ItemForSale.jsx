import {NavLink} from "react-router-dom";
import {useState} from "react";
import "./ItemForSale.css"

const ItemForSale = () => {
    const [bidPrice, setBidPrice] = useState("")

    return (
        <div className="item-for-sale-container">
            <h2>Item for Sale</h2>
            <table className="item-for-sale-details">
                <tbody>
                <tr>
                    <td>Item ID</td>
                    <td>1001</td>
                    <td><NavLink>View Ratings</NavLink></td>
                </tr>
                <tr>
                    <td>Item Name</td>
                    <td>Garmin GPS 255W</td>
                </tr>
                <tr>
                    <td>Description</td>
                    <td>You'll never be lost thanks to the Garmin 255W.</td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td> <NavLink>Edit Description</NavLink></td>
                </tr>

                <tr>
                    <td>Category</td>
                    <td>Very Good</td>
                </tr>
                <tr>
                    <td>Returns Accepted?</td>
                    <td><input type="checkbox" /></td>
                </tr>
                <tr>
                    <td>Get It Now Price</td>
                    <td><span>$79.00</span><button>Get It Now!</button></td>
                </tr>
                </tbody>
            </table>
            <div className="auction">
                <table className="auction-ends">
                    <thead>
                    <tr>
                        <th>Auction Ends: 4/18/2024 4:30PM</th>
                    </tr>
                    </thead>
                </table>
                <table className="item-for-sale-bids">
                    <thead>
                    <tr>
                        <th>Bid Amount</th>
                        <th>Time of Bid</th>
                        <th>Username</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>$44.00</td>
                        <td>4/18/2024 3:14PM</td>
                        <td>lostnfound99</td>
                    </tr>
                    <tr>
                        <td>$40.00</td>
                        <td>4/18/2024 2:25PM</td>
                        <td>filizin22</td>
                    </tr>
                    <tr>
                        <td>$35.00</td>
                        <td>4/18/2024 2:10PM</td>
                        <td>aflii22</td>
                    </tr>
                    {/*{bidHistory.map((item, index) => (*/}
                    {/*    <tr key={index}>*/}
                    {/*        <td>{item.bidAmount}</td>*/}
                    {/*        <td>{item.timeOfBid}</td>*/}
                    {/*        <td>{item.username}</td>*/}
                    {/*    </tr>*/}
                    {/*))}*/}
                    </tbody>
                </table>
                <div className="user-bid">
                    <p>Your Bid</p>
                    <p className="dollar-sign">$</p>
                    <div className="user-bid-price">
                        <input
                        type="number"
                        name="bid-price"
                        value={bidPrice}
                        placeholder="Your bid price"
                        onChange={(e) => setBidPrice(e.target.value)}
                    />
                        <p>(minimum bid $45.00)</p>
                    </div>
                </div>
            </div>
            <div className="item-for-sale-btns">
                <button>Close</button>
                <button>Cancel This Item</button>
                <button>Bid On This Item</button>
            </div>
        </div>
    );
};

export default ItemForSale;