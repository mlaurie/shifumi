import './App.css';
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Security/Login'
import Button from './components/match/Button'

function App() {
  return (
    <div className="App">
      <Router>
        <Suspense fallback={<div>Chargement...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} /> 
            <Route path="/match" element={<Button />} /> 
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Suspense>
      </Router>

    </div>
  );
}

export default App;
