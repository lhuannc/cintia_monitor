import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Devices } from './pages/Devices';
import { Beds } from './pages/Beds';
import { Patients } from './pages/Patients';
import { Panels } from './pages/Panels';
import { ViewPanel } from './pages/ViewPanel';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Panels />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/beds" element={<Beds />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/panels" element={<Panels />} />
            <Route path="/panels/:id" element={<ViewPanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;