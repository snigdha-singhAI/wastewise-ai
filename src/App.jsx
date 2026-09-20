import React from 'react';
import { WasteDataProvider, useWasteData } from './context/WasteDataContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import LiveAnalysisModal from './components/LiveAnalysisModal';
import DashboardPage from './pages/DashboardPage';
import ReportWastePage from './pages/ReportWastePage';
import HotspotsPage from './pages/HotspotsPage';
import RoutesPage from './pages/RoutesPage';
import ModelInsightsPage from './pages/ModelInsightsPage';

function AppContent() {
  const { activeTab } = useWasteData();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-dark-bg cyber-grid text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardPage />}
          {activeTab === 'report' && <ReportWastePage />}
          {activeTab === 'hotspots' && <HotspotsPage />}
          {activeTab === 'routes' && <RoutesPage />}
          {activeTab === 'insights' && <ModelInsightsPage />}
        </main>
      </div>

      {/* 5-step Live Analysis Pipeline Modal */}
      <LiveAnalysisModal />
    </div>
  );
}

export default function App() {
  return (
    <WasteDataProvider>
      <AppContent />
    </WasteDataProvider>
  );
}
