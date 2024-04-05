import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Dashboard from "./components/dashboard";
import ListItem from "./components/listItem";

function App() {
  return (
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/listItem" element={<ListItem/>}/>
          </Routes>
        </Router>
      </div>
  );
}

export default App;
