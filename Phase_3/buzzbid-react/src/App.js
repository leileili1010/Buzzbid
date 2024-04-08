import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Dashboard from "./components/dashboard";
import ListItem from "./components/listItem";
import ViewItem from "./components/viewItem";

function App() {
  return (
      <div className="App">
        <Router>
          <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/listItem' element={<ListItem/>}/>
            <Route path='/viewItem' element={<ViewItem/>}/>
          </Routes>
        </Router>
      </div>
  );
}

export default App;
