import React, {useEffect, useState} from "react";
import "./SearchItem.css";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdb-react-ui-kit";
import '../../css/style.css';
import NavigationBar from "../NavigationBar/NavigationBar";
const SearchItem = () => {
    const[inputs, setInputs] = useState({
        keyword: '',
        minPrice: '',
        maxPrice: '',
        condition: '',
        categoryId: ''
    });
    const[errors, setErrors] = useState({});
    const[categories, setCategories] = useState([]);
    const nav = useNavigate();
    const userJsonString = localStorage.getItem('user');
    const currentUser = JSON.parse(userJsonString);

    useEffect(() => {
        if (!userJsonString) {
            nav("/login");
        }
    }, [userJsonString, nav]);

    useEffect(() => {
        async function getCategories() {
            const {data} = await axios.get("http://localhost:8081/auction/categories");
            const results = [];

            data.forEach((value) => {
                results.push({
                    key: value.category,
                    value: value.categoryId,
                });
            });

            setCategories([
                ...results
            ]);
        }

        getCategories();
    }, []);

    const updateValue = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value});
    };

    const validator = (inputs) => {
        let errors = {};

        if (inputs.minPrice !== '' && isNaN(inputs.minPrice)) {
            errors.minPrice = 'Min price must be an amount';
        } else if (parseFloat(inputs.minPrice) <= 0) {
            errors.minPrice = 'Min sale price must be greater than 0';
        }

        if (inputs.maxPrice !== '' && (isNaN(inputs.maxPrice))) {
            errors.maxPrice = 'Max price must be an amount';
        } else if (parseFloat(inputs.maxPrice) <= 0) {
            errors.maxPrice = 'Max price must be greater than 0';
        }

        return errors;
    };

    const cancel = () => {
        nav('/dashboard');
    };

    const submitForm = (e) => {
        e.preventDefault();

        let errors = validator(inputs);
        setErrors(errors);

        if (Object.keys(errors).length !== 0) {
            return;
        }

        const data = {
            keyword : inputs.keyword,
            minPrice: inputs.minPrice,
            maxPrice: inputs.maxPrice,
            condition: inputs.condition,
            categoryId: inputs.categoryId,
        };

        axios.post('http://localhost:8081/auction/searchForItem', data)
            .then((response) => {
                let searchResults = response.data;

                nav('/searchResults', {state: {searchResults: searchResults}});
            }).catch(function(error) {

        });
    };

    return (
        <>
        <NavigationBar/>
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="bg border rounded-lg p-4" style={{width: '700px', height: 'auto'}}>
                <h2>Search Item</h2>
                <form onSubmit={submitForm}>
                    <MDBContainer className="p-3">
                        <MDBRow className="search-item-input">
                            <MDBCol md="4">
                                <h4>Keyword</h4>
                            </MDBCol>
                            <MDBCol md="8">
                                <label htmlFor="keyword">
                                    <input
                                        type="text"
                                        name="keyword"
                                        value={inputs.keyword}
                                        onChange={updateValue}
                                        placeholder="Enter keyword"
                                    />
                                </label>
                            </MDBCol>
                        </MDBRow>
                        <MDBRow className="search-item-input">
                            <MDBCol md="4">
                                <h4>Category</h4>
                            </MDBCol>
                            <MDBCol md="8">
                                <label htmlFor="category">
                                    <select
                                        name="categoryId"
                                        value={inputs.category}
                                        onChange={updateValue}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(item => (
                                            <option key={item.value} value={item.value}>{item.key}</option>
                                        ))}
                                    </select>
                                </label>
                            </MDBCol>
                        </MDBRow>
                        <MDBRow className="search-item-input">
                            <MDBCol md="4">
                                <h4>Minimum Price $</h4>
                            </MDBCol>
                            <MDBCol md="8">
                                <label htmlFor="min-Price">
                                    <input
                                        type="text"
                                        name="minPrice"
                                        value={inputs.minPrice}
                                        onChange={updateValue}
                                        placeholder="$0.00"
                                        style={{border: errors.minPrice ? "2px solid red" : null}}
                                    />
                                    {errors.minPrice ? <p className="error">{errors.minPrice}</p> : null}
                                </label>
                            </MDBCol>
                        </MDBRow>
                        <MDBRow className="search-item-input">
                            <MDBCol md="4">
                                <h4>Maximum Price $</h4>
                            </MDBCol>
                            <MDBCol md="8">
                                <label htmlFor="max-price">
                                    <input
                                        type="text"
                                        name="maxPrice"
                                        value={inputs.maxPrice}
                                        onChange={updateValue}
                                        placeholder="$0.00"
                                        style={{border: errors.maxPrice ? "2px solid red" : null}}
                                    />
                                    {errors.maxPrice ? <p className="error">{errors.maxPrice}</p> : null}
                                </label>
                            </MDBCol>
                        </MDBRow>
                        <MDBRow className="search-item-input">
                            <MDBCol md="4">
                                <h4>Condition at least</h4>
                            </MDBCol>
                            <MDBCol md="8">
                                <label htmlFor="condition">
                                    <select
                                        name="condition"
                                        value={inputs.condition}
                                        onChange={updateValue}
                                    >
                                        <option value="">Select a condition</option>
                                        <option value="NEW">New</option>
                                        <option value="VERY_GOOD">Very Good</option>
                                        <option value="GOOD">Good</option>
                                        <option value="FAIR">Fair</option>
                                        <option value="POOR">Poor</option>
                                    </select>
                                </label>
                            </MDBCol>
                        </MDBRow>
                        <MDBRow className="search-item-btns">
                            <MDBCol md="4">
                                <MDBBtn className="mb-4 d-block btn-primary" style={{height: '50px', width: '100%'}}
                                        onClick={e => cancel(e)}>Cancel
                                </MDBBtn>
                            </MDBCol>
                            <MDBCol md="4">
                                <MDBBtn className="mb-4 d-block btn-primary" style={{height: '50px', width: '100%'}}>
                                    Search
                                </MDBBtn>
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </form>
            </div>
        </div>
        </>
    )
}

export default SearchItem;