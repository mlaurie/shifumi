import './App.css';
import React from 'react';
import {Route, Routes, Navigate, BrowserRouter as Router} from 'react-router-dom';

import Login from '../Security/Login'
import MatchList from '../Match/MatchList'
import Match from '../Match/Match'
import ProtectedRoutes from '../Security/ProtectedRoutes';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/matches" element={<ProtectedRoutes><MatchList /> </ProtectedRoutes>} />
          <Route path="/match/:matchId" element={<ProtectedRoutes><Match /> </ProtectedRoutes>}  />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
