
import { useState } from "react";
import "./SearchItem.css";
const SearchItem = () => {
    const [keyword, setKeyword] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [condition, setCondition] = useState("");
    const [category, setCategory] = useState("");

    return (
        <div>
            <form className="search-item-form">
                <h2>Search Item</h2>
                <div className="search-item-input">
                    <h4>Keyword</h4>
                    <label htmlFor="keyword">
                        <input
                            type="text"
                            name="keyword"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Enter keyword"
                        />
                    </label>
                </div>

                <div className="search-item-input">
                    <h4>Category</h4>
                    <label htmlFor="category">
                        <select
                            name="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option disabled value={"placeholder"}>Select a category</option>
                            <option value="art">Art</option>
                            <option value="books">Books</option>
                            <option value="electronics">Electronics</option>
                            <option value="home & garden">Home & Garden</option>
                            <option value="supporting goods">Supporting Goods</option>
                            <option value="toys">Toys</option>
                            <option value="other">Other</option>
                        </select>
                    </label>
                </div>

                <div className="search-item-input">
                    <h4>Minimum Price $</h4>
                    <label htmlFor="min-Price">
                        <input
                            type="number"
                            name="min-Price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="Minimum Price$"
                        />
                    </label>
                </div>

                <div className="search-item-input">
                    <h4>Maximum Price $</h4>
                    <label htmlFor="max-price">
                        <input
                            type="number"
                            name="max-price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="Maximum Price$"
                        />
                    </label>
                </div>

                <div className="search-item-input">
                    <h4>Condition at least</h4>
                    <label htmlFor="condition">
                        <select
                            name="condition"
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                        >
                            <option disabled value={"placeholder"}>Select a condition</option>
                            <option value="New">New</option>
                            <option value="Very Good">Very Good</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                        </select>
                    </label>
                </div>
                <div className="search-item-btns">
                    <button>Cancel</button>
                    <button>Search</button>
                </div>
            </form>

        </div>
    )
}

export default SearchItem;