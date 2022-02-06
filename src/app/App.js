import './App.css';
import React from 'react';
import {Route, Routes, Navigate, BrowserRouter as Router} from 'react-router-dom';

import Login from '../features/Auth/Login'
import PrivateRouteWrapper from '../features/Auth/PrivateRouteWrapper';
import LoginRouteWrapper from '../features/Auth/LoginRouteWrapper';
import MatchList from '../features/MatchList/MatchList'
import Match from '../features/Match/Match'

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
