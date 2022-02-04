import './App.css';
import React from 'react';
import {Route, Routes, Navigate, BrowserRouter as Router} from 'react-router-dom';

import Login from '../Security/Login'
import PrivateRouteWrapper from '../Security/PrivateRouteWrapper';
import LoginRouteWrapper from '../Security/LoginRouteWrapper';
import MatchList from '../Match/MatchList'
import Match from '../Match/Match'

/**
 * Main application component handling the app routing with additional logic
 *
 * LoginRouteWrapper adds redirection logic to the /login route
 * PrivateRouteWrapper adds authentication logic to the /matches and /match/:id routes
 *
 * reference: https://stackoverflow.com/a/69924525
 */
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<LoginRouteWrapper />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<PrivateRouteWrapper />}>
            <Route path="/matches" element={<MatchList />} />
            <Route path="/match/:matchId" element={<Match />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
