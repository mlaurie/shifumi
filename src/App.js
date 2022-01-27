import './App.css';
import React, { Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Security/Login'
import MatchList from './components/Match/MatchList'
import Match from './components/Match/Match'
import Loader from "./components/Style/Loader";
import Logout from "./components/Security/Logout"

function App() {

  return (
    <>
      <Logout />
      <div className="App">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/login" element={<Login />} /> 
            <Route path="/matches" element={<MatchList />} />
            <Route path="/match/:id" element={<Match />} /> 
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

export default App;
