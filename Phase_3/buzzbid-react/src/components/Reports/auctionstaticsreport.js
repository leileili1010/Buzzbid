import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {MDBBtn, MDBCol, MDBContainer, MDBInput, MDBRow} from "mdb-react-ui-kit";
import axios from "axios";

function AuctionStaticsReport(){
  const {state: {username: username, isAdmin: isAdmin, userRole : userRole}} = useLocation();
  const [auctionStatistics, setAuctionStatics] = useState(null);
  const nav = useNavigate();
  const done = () => {
    nav('/dashboard', {state : {username: username, isAdmin : isAdmin, userRole: userRole}});
  };
  
    
  useEffect(() => {
    const fetchData = async () => {
      try {
          const response = await axios.get('http://localhost:8081/report/auctionstatics_report');
          const data = response.data;
          setAuctionStatics(data);
      } catch (error) {
          console.error('Error fetching user report:', error);
      }
  };
  
  fetchData();
  }, []); 
  
  
  if (!auctionStatistics) {
  return <div>Loading...</div>;
  }

  




  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
     
       <MDBContainer className="border rounded-lg"style={{width: '800px', height: "auto"}}>
       <fieldset>
       <legend>Auction Statics</legend>
        <MDBRow>
        {auctionStatistics && auctionStatistics.map(b => (
           <MDBRow className="justify-content-center">
             <MDBCol md="4">
              <strong>Auctions Active</strong>
            </MDBCol>
            <MDBCol md="4">
              {b.activeAuction}
            </MDBCol>
           </MDBRow>
           
         ))}

        </MDBRow>
        

        <MDBRow>
       {auctionStatistics && auctionStatistics.map(b => (
           <MDBRow className="justify-content-center">
             <MDBCol md="4">
              <strong>Auctions Finished</strong>
            </MDBCol>
            <MDBCol md="4">
              {b.finishedAuction}
            </MDBCol>
           </MDBRow>
           
         ))}

       </MDBRow>

       <MDBRow>
       {auctionStatistics && auctionStatistics.map(b => (
           <MDBRow className="justify-content-center">
             <MDBCol md="4">
              <strong>Auctions Won</strong>
            </MDBCol>
            <MDBCol md="4">
              {b.wonAuction}
            </MDBCol>
           </MDBRow>
           
         ))}

       </MDBRow>
       <MDBRow>
       {auctionStatistics && auctionStatistics.map(b => (
           <MDBRow className="justify-content-center">
             <MDBCol md="4">
              <strong>Auctions Cancelled</strong>
            </MDBCol>
            <MDBCol md="4">
              {b.cancelledAuction}
            </MDBCol>
           </MDBRow>
           
         ))}

       </MDBRow>

       <MDBRow>
       {auctionStatistics && auctionStatistics.map(b => (
           <MDBRow className="justify-content-center">
             <MDBCol md="4">
              <strong>Item Rated</strong>
            </MDBCol>
            <MDBCol md="4">
              {b.ratedItems}
            </MDBCol>
           </MDBRow>
           
         ))}

       </MDBRow>

       <MDBRow>
       {auctionStatistics && auctionStatistics.map(b => (
           <MDBRow className="justify-content-center">
             <MDBCol md="4">
              <strong>Item not Rated</strong>
            </MDBCol>
            <MDBCol md="4">
              {b.notRatedItems}
            </MDBCol>
           </MDBRow>
           
         ))}

       </MDBRow>
          
        

         <MDBRow className="justify-content-end p-3" >
           <MDBBtn type="button" className="mb-4 d-block btn-primary" style={{height: '40px', width: '100px'}}
             onClick={e => done(e)}>
               Done
            </MDBBtn>
         </MDBRow>
       </fieldset>
         
       </MDBContainer>
     </div>
    
     )
   
}



export default AuctionStaticsReport;