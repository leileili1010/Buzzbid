import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {MDBBtn, MDBCol, MDBContainer, MDBInput, MDBRow, MDBTextArea} from "mdb-react-ui-kit";
import axios from "axios";
import '../../css/style.css';
import NavigationBar from "../NavigationBar/NavigationBar";
import "./listItem.css";

function ListItem() {
    const[inputs, setInputs] = useState({
        itemName: '',
        description: '',
        categoryId: 1,
        condition: 'NEW',
        startingBid: '',
        minSalePrice: '',
        getItNowPrice: '',
        auctionLength: 1,
        isReturnable: 'false',
    });
    const[categories, setCategories] = useState([]);
    const[errors, setErrors] = useState({});
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

    const validator = (inputs) => {
      let errors = {};

      if (inputs.itemName === '') {
          errors.itemName = "Item name is required";
      }

      if (inputs.description === '') {
          errors.description = 'Description is required';
      }

      if (inputs.startingBid === '' || isNaN(inputs.startingBid)) {
          errors.startingBid = 'Starting bid amount must be an amount';
      } else if (parseFloat(inputs.startingBid) <= 0) {
          errors.startingBid = 'Starting bid must be greater than 0';
      } else if (parseFloat(inputs.startingBid) > parseFloat(inputs.minSalePrice)) {
          errors.startingBid = 'Starting bid must be greater than the minimum sale price';
      } else {
          let amt = inputs.startingBid.substring(1);

          if (!amt.match(/^(\d*\.{0,1}\d{0,2}$)/)) {
              errors.startingBid = 'Starting bid can only be up to two decimal places';
          }
      }

      if (inputs.minSalePrice === '' || isNaN(inputs.minSalePrice)) {
          errors.minSalePrice = 'Min sale price must be an amount';
      } else if (parseFloat(inputs.minSalePrice) <= 0) {
          errors.minSalePrice = 'Min sale price must be greater than 0';
      } else {
          let amt = inputs.minSalePrice.substring(1);

          if (!amt.match(/^(\d*\.{0,1}\d{0,2}$)/)) {
              errors.minSalePrice = 'Min sale price can only be up to two decimal places';
          }
      }

      if (inputs.getItNowPrice !== '' && (isNaN(inputs.getItNowPrice))) {
          errors.getItNowPrice = 'Get It Now price must be an amount';
      } else if (inputs.getItNowPrice !== '' && parseFloat(inputs.getItNowPrice) <= parseFloat(inputs.minSalePrice)
          && parseFloat(inputs.getItNowPrice) <= parseFloat(inputs.startingBid)) {
          errors.getItNowPrice = 'Get It Now price must be greater than the starting bid'
      } else if (parseFloat(inputs.getItNowPrice) < parseFloat(inputs.minSalePrice)) {
          errors.getItNowPrice = 'Get It Now price must be greater than the minimum sale price';
      } else if (parseFloat(inputs.getItNowPrice) < parseFloat(inputs.startingBid)) {
          errors.getItNowPrice = 'Get It Now price must be greater than the starting bid';
      } else {
          let amt = inputs.getItNowPrice.substring(1);

          if (!amt.match(/^(\d*\.{0,1}\d{0,2}$)/)) {
              errors.getItNowPrice = 'Get It Now price can only be up to two decimal places';
          }
      }

      return errors;
    };

    const updateValue = (e) => {
      setInputs({...inputs, [e.target.name]: e.target.value});
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
            itemName : inputs.itemName,
            description: inputs.description,
            categoryId: inputs.categoryId,
            condition: inputs.condition,
            startingBid: inputs.startingBid,
            minSalePrice: inputs.minSalePrice,
            getItNowPrice: inputs.getItNowPrice,
            auctionLength: inputs.auctionLength,
            isReturnable: inputs.isReturnable,
            username: currentUser.username
        };

        axios.post('http://localhost:8081/auction/listAuction', data)
            .then((response) => {
                nav('/viewItem', {state: {auctionId: response.data}});
            }).catch(function(error) {

        });
    };

    return (
        <div className="list-item-page">
        <NavigationBar/>
        <div className="d-flex justify-content-center align-items-center list-item">
            <div className="bg border rounded-lg p-4" style={{width: '700px', height: 'auto'}}>
                <h2>New Item for Auction</h2>
                <form onSubmit={submitForm}>
                    <MDBContainer className="p-3">
                        <MDBRow>
                            <MDBCol md="4">
                                <label>Item Name</label>
                            </MDBCol>
                            <MDBCol md="8">
                                <MDBInput wrapperClass='mb-4' placeholder='Item Name' id='item-name' name="itemName" value={inputs.itemName} type='text'
                                          onChange={updateValue} style={{ border: errors.itemName ? "2px solid red" : null }} />
                                {errors.itemName ? <p className="has-error">{errors.itemName}</p> : null}
                            </MDBCol>
                        </MDBRow>
                        <MDBRow>
                            <MDBCol md="4">
                                <label>Description</label>
                            </MDBCol>
                            <MDBCol md="8">
                                <MDBTextArea wrapperClass='mb-4' placeholder='Description' id='description' name="description" value={inputs.description}
                                          type='text'
                                          onChange={updateValue}
                                          style={{ border: errors.description ? "2px solid red" : null }} />
                                {errors.description ? <p className="error">{errors.description}</p> : null}
                            </MDBCol>
                        </MDBRow>
                        <MDBRow>
                            <MDBCol md="4">
                                <label>Category</label><br/>
                            </MDBCol>
                            <MDBCol md="8">
                                <select className="form-select" id="category-id" name="categoryId"
                                        value={inputs.categoryId} onChange={updateValue}>
                                    {categories.map(item => (
                                        <option key={item.value} value={item.value}>{item.key}</option>
                                    ))}
                                </select>
                            </MDBCol>
                        </MDBRow>
                        <br/>
                        <MDBRow>
                            <MDBCol md="4">
                                <label>Condition</label><br/>
                            </MDBCol>
                            <MDBCol md="8">
                                <select className="form-select" id="condition" name="condition" value={inputs.condition}
                                        onChange={updateValue}>
                                    <option value="NEW">New</option>
                                    <option value="VERY_GOOD">Very Good</option>
                                    <option value="GOOD">Good</option>
                                    <option value="FAIR">Fair</option>
                                    <option value="POOR">Poor</option>
                                </select>
                            </MDBCol>
                        </MDBRow>
                        <br/>
                        <MDBRow>
                            <MDBCol md="4">
                                <label>Start auction bidding at</label>
                            </MDBCol>
                            <MDBCol md="8">
                                <MDBInput wrapperClass='mb-4' placeholder='$0.00' id="starting-bid" name="startingBid"
                                          value={inputs.startingBid} type='text'
                                          onChange={updateValue}
                                          style={{ border: errors.startingBid ? "2px solid red" : null }} />
                                {errors.startingBid ? <p className="error">{errors.startingBid}</p> : null}
                            </MDBCol>
                        </MDBRow>
                        <MDBRow>
                            <MDBCol md="4">
                                <label>Minimum sale price</label>
                            </MDBCol>
                            <MDBCol md="8">
                                <MDBInput wrapperClass='mb-4' placeholder='$0.00' id='min-sale-price' name="minSalePrice" value={inputs.minSalePrice}
                                          type='text'
                                          onChange={updateValue}
                                          style={{ border: errors.minSalePrice ? "2px solid red" : null }} />
                                {errors.minSalePrice ? <p className="error">{errors.minSalePrice}</p> : null}
                            </MDBCol>
                        </MDBRow>
                        <MDBRow>
                            <MDBCol md="4">
                                <label>Auction ends in</label><br/>
                            </MDBCol>
                            <MDBCol md="8">
                                <select className="form-select" id="auction-length" name="auctionLength"
                                        value={inputs.auctionLength} onChange={updateValue}>
                                    <option value="1">1 day</option>
                                    <option value="2">2 days</option>
                                    <option value="3">3 days</option>
                                    <option value="5">5 days</option>
                                    <option value="7">7 days</option>
                                </select>
                            </MDBCol>
                        </MDBRow>
                        <br/>
                        <MDBRow>
                            <MDBCol md="4">
                                <label>Get It Now price</label>
                            </MDBCol>
                            <MDBCol md="8">
                                <MDBInput wrapperClass='mb-4' placeholder='$0.00' id="get-it-now-price" name="getItNowPrice" value={inputs.getItNowPrice}
                                          type='text'
                                          onChange={updateValue}
                                          style={{ border: errors.getItNowPrice ? "2px solid red" : null }} />
                                {errors.getItNowPrice ? <p className="error">{errors.getItNowPrice}</p> : null}
                            </MDBCol>
                        </MDBRow>
                        <MDBRow>
                            <MDBCol md="4">
                                <label>Returns accepted?</label>
                            </MDBCol>
                            <MDBCol md="8">
                                <select className="form-select" id="is-returnable" name="isReturnable" value={inputs.isReturnable}
                                        onChange={updateValue}>
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                </select>
                            </MDBCol>
                        </MDBRow>
                        <br/>
                        <MDBRow className="item-btns">
                            <MDBCol md="4">
                                <MDBBtn className="mb-4 d-block btn-primary" style={{height: '50px', width: '100%'}}>
                                    List My Item
                                </MDBBtn>
                            </MDBCol>
                            <MDBCol md="4">
                                <MDBBtn type="button" className="mb-4 d-block btn-primary" style={{height: '50px', width: '100%'}}
                                        onClick={e => cancel(e)}>
                                Cancel
                                </MDBBtn>
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </form>
            </div>
        </div>
        </div>
    );
}

export default ListItem;