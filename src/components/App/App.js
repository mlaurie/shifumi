import './App.css';
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../Security/Login'
import MatchList from '../Match/MatchList'
import Match from '../Match/Match'
import Logout from "../Security/Logout"

function App() {

  const token = localStorage.getItem("token");
  
  if (token !== null){
  return (
    <>
      <Logout />
      <div className="App">
     
        <Routes> 
          <Route path="/login" element={<Login />} />
          <Route path="/matches" element={<MatchList />} />
          <Route path="/match/:id" element={<Match />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
  }

else {
  return (
    <>
      <Logout />
      <div className="App">
     
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      
     
      </div>
    </>
  );
}
}

export default App;
