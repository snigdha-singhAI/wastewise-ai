import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { INITIAL_REPORTS } from '../data/initialReports';
import { runDBSCAN, calculateHaversineDistance } from '../services/dbscanService';
import { prioritizeAllHotspots, DEFAULT_WEIGHTS } from '../services/priorityService';
import { generateCollectionRoute } from '../services/routeService';

const WasteDataContext = createContext();

export function WasteDataProvider({ children }) {
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [selectedHotspotId, setSelectedHotspotId] = useState('HOTSPOT-03');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLiveAnalyzing, setIsLiveAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [lastAddedReport, setLastAddedReport] = useState(null);

  // Compute DBSCAN clusters & Prioritized Hotspots
  const { clusters, noisePoints } = useMemo(() => {
    return runDBSCAN(reports, 500, 3);
  }, [reports]);

  const hotspots = useMemo(() => {
    return prioritizeAllHotspots(clusters, weights);
  }, [clusters, weights]);

  const [routeKey, setRouteKey] = useState(0);

  // Compute Smart Collection Route
  const route = useMemo(() => {
    return generateCollectionRoute(hotspots, 4);
  }, [hotspots, routeKey]);

  // Selected Hotspot object
  const selectedHotspot = useMemo(() => {
    return (
      hotspots.find(h => h.id === selectedHotspotId) ||
      hotspots[0] ||
      null
    );
  }, [hotspots, selectedHotspotId]);

  // Add a new user-reported waste item
  const addNewReport = useCallback((newReportData) => {
    const reportId = `RPT-${1000 + reports.length + 1}`;
    const newReport = {
      id: reportId,
      latitude: Number(newReportData.latitude),
      longitude: Number(newReportData.longitude),
      timestamp: 'Just now',
      wasteType: newReportData.wasteType || 'Plastic',
      confidence: newReportData.confidence || 0.91,
      description: newReportData.description || 'Citizen waste report submitted via mobile terminal.',
      locationName: newReportData.locationName || 'Pune Municipality',
      address: newReportData.address || `${newReportData.locationName}, Pune`,
      severity: newReportData.severity || 'High',
      imageUrl: newReportData.imageUrl || null
    };

    // Calculate nearest hotspot before updating state
    let nearestHotspot = null;
    let minDistanceMeters = Infinity;

    hotspots.forEach(h => {
      const dist = calculateHaversineDistance(
        newReport.latitude,
        newReport.longitude,
        h.centroid[0],
        h.centroid[1]
      );
      if (dist < minDistanceMeters) {
        minDistanceMeters = dist;
        nearestHotspot = h;
      }
    });

    setReports(prev => [newReport, ...prev]);
    setLastAddedReport(newReport);
    if (nearestHotspot) {
      setSelectedHotspotId(nearestHotspot.id);
    }
    setRouteKey(k => k + 1);

    return {
      report: newReport,
      nearestHotspot,
      distanceMeters: Math.round(minDistanceMeters)
    };
  }, [reports.length, hotspots]);

  // Reset to initial baseline demo reports
  const resetDemoData = useCallback(() => {
    setReports(INITIAL_REPORTS);
    setWeights(DEFAULT_WEIGHTS);
    setSelectedHotspotId('HOTSPOT-03');
    setLastAddedReport(null);
    setRouteKey(k => k + 1);
  }, []);

  // Recalculate route explicitly
  const recalculateRoute = useCallback(() => {
    setRouteKey(k => k + 1);
    return generateCollectionRoute(hotspots, 4);
  }, [hotspots]);

  // Close live analysis modal
  const closeLiveAnalysis = useCallback(() => {
    setIsLiveAnalyzing(false);
    setAnalysisStep(0);
  }, []);

  // Trigger live 5-step analysis simulation + complete banner
  const triggerLiveAnalysis = useCallback(async () => {
    setIsLiveAnalyzing(true);
    setAnalysisStep(1); // Ingesting reports
    await new Promise(r => setTimeout(r, 600));

    setAnalysisStep(2); // Detecting spatial clusters (DBSCAN)
    await new Promise(r => setTimeout(r, 700));

    setAnalysisStep(3); // Calculating hotspot priority
    await new Promise(r => setTimeout(r, 650));

    setAnalysisStep(4); // Generating collection route
    await new Promise(r => setTimeout(r, 650));

    setAnalysisStep(5); // Updating dashboard
    await new Promise(r => setTimeout(r, 600));

    setAnalysisStep(6); // Analysis Complete banner
    setIsLiveAnalyzing(false);
  }, []);

  const value = {
    reports,
    hotspots,
    noisePoints,
    route,
    weights,
    setWeights,
    selectedHotspotId,
    setSelectedHotspotId,
    selectedHotspot,
    activeTab,
    setActiveTab,
    addNewReport,
    resetDemoData,
    recalculateRoute,
    triggerLiveAnalysis,
    closeLiveAnalysis,
    isLiveAnalyzing,
    analysisStep,
    lastAddedReport
  };

  return (
    <WasteDataContext.Provider value={value}>
      {children}
    </WasteDataContext.Provider>
  );
}

export function useWasteData() {
  const context = useContext(WasteDataContext);
  if (!context) {
    throw new Error('useWasteData must be used within a WasteDataProvider');
  }
  return context;
}
