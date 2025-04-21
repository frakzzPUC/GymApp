import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import LifestyleForm from './pages/LifestyleForm';
import HealthAssessment from './pages/HealthAssessment';
import PainAssessment from './pages/PainAssessment';
import Recommendation from './pages/Recommendation';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/lifestyle" element={<LifestyleForm />} />
          <Route path="/health" element={<HealthAssessment />} />
          <Route path="/pain" element={<PainAssessment />} />
          <Route path="/recommendation" element={<Recommendation />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;