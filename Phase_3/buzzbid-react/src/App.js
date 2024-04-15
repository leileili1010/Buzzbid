import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Dashboard from "./components/dashboard";
import ListItem from "./components/listItem";
import SearchItem from "./components/SearchItem/SearchItem";
import ItemRating from "./components/ItemRating/ItemRating";
import ViewItem from "./components/ViewItem/viewItem";
import CategoryReport from './components/Reports/categoryReport';
import UserReport from './components/Reports/userReport';
import SearchResults from "./components/SearchResults/searchResults";
import TopRatedReport from './components/Reports/topRatedReport';
import AuctionStaticsReport from './components/Reports/auctionStaticsReport';
import CancelledReport from './components/Reports/cancelledReport';
import AuctionResults from "./components/auctionResults/AuctionResults";
import {Modal, ModalProvider} from "./context/Modal";

function App() {
    return (
        <ModalProvider>
            <div className="App">
                <Router>
                    <Routes>
                        <Route path='/' element={<Login/>}/>
                        <Route path='/login' element={<Login/>}/>
                        <Route path='/register' element={<Register/>}/>
                        <Route path='/dashboard' element={<Dashboard/>}/>
                        <Route path='/listItem' element={<ListItem/>}/>
                        <Route path='/viewItem' element={<ViewItem/>}/>
                        <Route path="/searchItem" element={<SearchItem/>}/>
                        <Route path="/searchResults" element={<SearchResults/>}/>
                        <Route path="/itemRating/:itemId" element={<ItemRating/>}/>
                        <Route path='/categoryReport' element={<CategoryReport/>}/>
                        <Route path='/userReport' element={<UserReport/>}/>
                        <Route path='/topRatedReport' element={<TopRatedReport/>}/>
                        <Route path='/auctionStaticsReport' element={<AuctionStaticsReport/>}/>
                        <Route path='/cancelledReport' element={<CancelledReport/>}/>
                        <Route path='/auctionResults' element={<AuctionResults/>}/>
                    </Routes>
                </Router>
            </div>
            <Modal/>
        </ModalProvider>
    );
}

export default App;
