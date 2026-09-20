// Smart Collection Routing Engine
// Algorithm: Priority-Weighted Nearest-Neighbor Heuristic (Greedy TSP variant)
// Prototype route recommendation connecting Depot -> Priority Hotspots -> Recovery Center

import { calculateHaversineDistance } from './dbscanService.js';
import { DEPOT_LOCATION, PROCESSING_FACILITY } from '../data/puneLocations.js';

/**
 * Optimizes collection route starting at Municipal Depot,
 * visiting highest priority hotspots, and terminating at the Recovery Plant.
 *
 * @param {Array} hotspots Ranked hotspots
 * @param {number} maxStops Maximum stops for single collection vehicle run (default 4)
 */
export function generateCollectionRoute(hotspots, maxStops = 4) {
  if (!hotspots || hotspots.length === 0) {
    return {
      stops: [],
      waypoints: [],
      totalDistanceKm: 0,
      estimatedTimeMin: 0,
      status: 'NO_HOTSPOTS'
    };
  }

  // Filter candidates: prefer HIGH and MEDIUM priority
  const candidates = hotspots
    .filter(h => h.priority === 'HIGH' || h.priority === 'MEDIUM')
    .slice(0, Math.max(maxStops, 2));

  // If few high/medium, backfill with whatever hotspots exist
  if (candidates.length < Math.min(hotspots.length, maxStops)) {
    hotspots.forEach(h => {
      if (candidates.length < maxStops && !candidates.find(c => c.id === h.id)) {
        candidates.push(h);
      }
    });
  }

  // Start at Depot
  const unvisited = [...candidates];
  let currentLocation = {
    name: DEPOT_LOCATION.name,
    code: DEPOT_LOCATION.code,
    lat: DEPOT_LOCATION.lat,
    lng: DEPOT_LOCATION.lng,
    isDepot: true
  };

  const orderedStops = [];
  let cumulativeMeters = 0;

  // Greedy Priority-Weighted Nearest Neighbor
  while (unvisited.length > 0) {
    let bestIdx = 0;
    let bestCost = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const candidate = unvisited[i];
      const distMeters = calculateHaversineDistance(
        currentLocation.lat,
        currentLocation.lng,
        candidate.centroid[0],
        candidate.centroid[1]
      );

      // Priority weight incentive: high priority hotspots are visited first
      // Exponent prioritizes Critical / High urgency zones (Kothrud score 87, Shivajinagar 76)
      const priorityIncentive = Math.pow(candidate.priorityScore / 30, 4.0);
      const effectiveCost = distMeters / priorityIncentive;

      if (effectiveCost < bestCost) {
        bestCost = effectiveCost;
        bestIdx = i;
      }
    }

    const nextStop = unvisited.splice(bestIdx, 1)[0];
    const legDistanceMeters = calculateHaversineDistance(
      currentLocation.lat,
      currentLocation.lng,
      nextStop.centroid[0],
      nextStop.centroid[1]
    );

    cumulativeMeters += legDistanceMeters;

    orderedStops.push({
      stopNumber: orderedStops.length + 1,
      hotspotId: nextStop.id,
      name: `${nextStop.name} — ${nextStop.locationName.split(',')[0]}`,
      locationName: nextStop.locationName,
      lat: nextStop.centroid[0],
      lng: nextStop.centroid[1],
      priority: nextStop.priority,
      priorityScore: nextStop.priorityScore,
      dominantWaste: nextStop.dominantWaste,
      reports: nextStop.reportCount,
      distanceFromPrevKm: (legDistanceMeters / 1000).toFixed(1),
      estimatedServiceTimeMin: 15
    });

    currentLocation = {
      name: nextStop.name,
      lat: nextStop.centroid[0],
      lng: nextStop.centroid[1]
    };
  }

  // Final leg to Processing Facility
  const returnLegMeters = calculateHaversineDistance(
    currentLocation.lat,
    currentLocation.lng,
    PROCESSING_FACILITY.lat,
    PROCESSING_FACILITY.lng
  );
  cumulativeMeters += returnLegMeters;

  // Road curvature expansion factor: straight-line distance in cities is typically ~1.35x on roads
  const roadNetworkFactor = 1.32;
  const totalRoadDistanceKm = Math.round(((cumulativeMeters * roadNetworkFactor) / 1000));
  // Average urban waste vehicle speed: 24 km/h + 15 min per stop
  const driveTimeMin = Math.round((totalRoadDistanceKm / 24) * 60);
  const serviceTimeMin = orderedStops.length * 15;
  const estimatedTotalTimeMin = driveTimeMin + serviceTimeMin;

  // Build coordinate polyline points: Depot -> Stops -> Facility
  const polylineCoordinates = [
    [DEPOT_LOCATION.lat, DEPOT_LOCATION.lng],
    ...orderedStops.map(s => [s.lat, s.lng]),
    [PROCESSING_FACILITY.lat, PROCESSING_FACILITY.lng]
  ];

  return {
    depot: DEPOT_LOCATION,
    stops: orderedStops,
    destination: PROCESSING_FACILITY,
    polylineCoordinates,
    totalDistanceKm: totalRoadDistanceKm,
    estimatedTimeMin: estimatedTotalTimeMin,
    status: 'READY FOR COLLECTION',
    routingMethod: 'Priority-weighted nearest-neighbor (Greedy TSP)',
    generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
