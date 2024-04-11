import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Dashboard from "./components/dashboard";
import ListItem from "./components/listItem";
import SearchItem from "./components/SearchItem/SearchItem";
import ItemForSale from "./components/ItemForSale/ItemForSale";
import ItemRating from "./components/ItemRating/ItemRating";
import ViewItem from "./components/viewItem";
import CategoryReport from './components/Reports/categoryreport';
import UserReport from './components/Reports/userreport';


function App() {
  return (
      <div className="App">
        <Router>
          <Routes>

            <Route path="/" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/listItem" element={<ListItem/>}/>
            <Route path="/searchitem" element={<SearchItem/>}/>
            <Route path="/itemforsale" element={<ItemForSale />} />
            <Route path="/itemrating" element={<ItemRating />}/>
            <Route path='/' element={<Login/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/listItem' element={<ListItem/>}/>
            <Route path='/viewItem' element={<ViewItem/>}/>
            <Route path='/categoryreport' element={<CategoryReport/>}/>
            <Route path='/userreport' element={<UserReport/>}/>
          </Routes>
        </Router>
      </div>
  );
}

export default App;
