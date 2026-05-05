import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import BuilderDemo from './pages/DemoBuilder';
import GetStarted from './pages/GetStarted';
import NoviceBuilder from './pages/novice_path';
import EnthusiastPath from './pages/Enthusiastic_path';
import PricingDashboard from './pages/PricingDashboard';
import UserProfile from './pages/UserProfile';
import ResetPassword from './pages/ResetPassword';
import BuildViewer from './pages/BuildViewer';
import CompareBuilds from './pages/CompareBuilds';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Set Home as the default route */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/demo" element={<BuilderDemo />}/>
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/builder/novice" element={<NoviceBuilder />} />
        <Route path="/builder/enthusiast" element={<EnthusiastPath />} />
        <Route path="/PricingDashboard" element={<PricingDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/build/:id" element={<BuildViewer />} />
        <Route path="/compare" element={<CompareBuilds />} />

      </Routes>
    </Router>
  );
};

export default App;