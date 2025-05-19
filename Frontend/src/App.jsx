import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy loading components
const Introduction = lazy(() => import('./pages/Introduction.jsx'));
const CropManagement = lazy(() => import('./pages/CropManagement.jsx'));
const AnalysisResults = lazy(() => import('./pages/AnalysisResults.jsx'));
const YieldProductionForm = lazy(() => import('./components/YieldProductionform.jsx'));
const CropRecommendation = lazy(() => import('./components/CropRecommendation.jsx'));
const IrrigationManagement = lazy(() => import('./components/IrrigationManagement.jsx'));
const Information = lazy(() => import('./pages/Information.jsx'));
const References = lazy(() => import('./pages/References.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegistrationForm = lazy(() => import('./pages/RegistrationForm.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const Dashboard = lazy(() => import('./components/Dashboard.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const CardDashboard = lazy(() => import('./pages/CardDashboard.jsx'));

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Suspense fallback={<div className="text-center mt-5">Loading...</div>}>
      <div className="full-height-with-header">
        <Routes  >
         
          {/* Redirect the root to the login page */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/introduction" element={<Introduction />} />
          <Route path="/Cropmanagement" element={<ProtectedRoute> <CropManagement /></ProtectedRoute> } />
          <Route path="/services" element={<CardDashboard />} />
          <Route path="/yield-production" element={<YieldProductionForm />} />
          <Route path="/crop-recommendation" element={<CropRecommendation />} />
          <Route path="/irrigation-management" element={<IrrigationManagement />} />
          <Route path="/dashboard/analysis/:index" element={<AnalysisResults />} />
          <Route path="/information" element={<Information />} />
          <Route path="/references" element={<References />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
         
        </Routes>
        </div>
      </Suspense>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
