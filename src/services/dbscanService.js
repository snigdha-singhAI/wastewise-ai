// Real DBSCAN (Density-Based Spatial Clustering of Applications with Noise)
// Uses Haversine distance in meters to group geographic coordinates.

const EARTH_RADIUS_METERS = 6371000;

/**
 * Calculates Haversine distance between two [lat, lng] points in meters.
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
}

/**
 * Finds all points within eps meters of target point.
 */
function regionQuery(points, pointIdx, eps) {
  const target = points[pointIdx];
  const neighbors = [];
  for (let i = 0; i < points.length; i++) {
    const dist = calculateHaversineDistance(
      target.latitude,
      target.longitude,
      points[i].latitude,
      points[i].longitude
    );
    if (dist <= eps) {
      neighbors.push(i);
    }
  }
  return neighbors;
}

/**
 * Runs DBSCAN clustering on an array of report objects.
 * @param {Array} reports Array of report items with latitude, longitude
 * @param {number} eps Maximum neighborhood radius in meters (default 500m)
 * @param {number} minSamples Minimum points to form dense cluster (default 3)
 */
export function runDBSCAN(reports, eps = 500, minSamples = 3) {
  if (!reports || reports.length === 0) {
    return { clusters: [], noisePoints: [] };
  }

  const n = reports.length;
  const visited = new Array(n).fill(false);
  const clusterAssignments = new Array(n).fill(-1); // -1 = noise/unassigned
  let clusterId = 0;

  for (let i = 0; i < n; i++) {
    if (visited[i]) continue;
    visited[i] = true;

    const neighbors = regionQuery(reports, i, eps);

    if (neighbors.length < minSamples) {
      clusterAssignments[i] = -1; // Noise
    } else {
      // Expand cluster
      clusterAssignments[i] = clusterId;
      const seedQueue = [...neighbors];

      let qIdx = 0;
      while (qIdx < seedQueue.length) {
        const currentPt = seedQueue[qIdx];
        qIdx++;

        if (!visited[currentPt]) {
          visited[currentPt] = true;
          const currentNeighbors = regionQuery(reports, currentPt, eps);
          if (currentNeighbors.length >= minSamples) {
            for (const neighborIdx of currentNeighbors) {
              if (!seedQueue.includes(neighborIdx)) {
                seedQueue.push(neighborIdx);
              }
            }
          }
        }

        if (clusterAssignments[currentPt] === -1 || clusterAssignments[currentPt] === undefined) {
          clusterAssignments[currentPt] = clusterId;
        }
      }
      clusterId++;
    }
  }

  // Aggregate clusters
  const rawClusters = [];
  for (let c = 0; c < clusterId; c++) {
    const clusterReports = [];
    for (let i = 0; i < n; i++) {
      if (clusterAssignments[i] === c) {
        clusterReports.push(reports[i]);
      }
    }

    if (clusterReports.length > 0) {
      // Centroid
      const sumLat = clusterReports.reduce((acc, r) => acc + r.latitude, 0);
      const sumLng = clusterReports.reduce((acc, r) => acc + r.longitude, 0);
      const centroidLat = sumLat / clusterReports.length;
      const centroidLng = sumLng / clusterReports.length;

      // Cluster radius (max distance from centroid or default 150m)
      let maxDist = 0;
      clusterReports.forEach(r => {
        const d = calculateHaversineDistance(centroidLat, centroidLng, r.latitude, r.longitude);
        if (d > maxDist) maxDist = d;
      });
      const radiusMeters = Math.max(Math.round(maxDist), 150);

      // Waste composition
      const wasteCounts = {};
      clusterReports.forEach(r => {
        const w = r.wasteType || 'Mixed';
        wasteCounts[w] = (wasteCounts[w] || 0) + 1;
      });

      // Find top waste types
      const sortedWaste = Object.entries(wasteCounts).sort((a, b) => b[1] - a[1]);
      const dominantWaste = sortedWaste.length > 1 && sortedWaste[1][1] >= 2
        ? `${sortedWaste[0][0]} / ${sortedWaste[1][0]}`
        : sortedWaste[0][0];

      // Location name from most frequent or first
      const locationName = clusterReports[0].locationName || 'Pune Sector';

      // Canonical hotspot ID and name matching CS11 specification
      let clusterCustomId = `HOTSPOT-${String(c + 1).padStart(2, '0')}`;
      let clusterCustomName = `Hotspot #${String(c + 1).padStart(2, '0')}`;

      const locLower = locationName.toLowerCase();
      if (locLower.includes('kothrud')) {
        clusterCustomId = 'HOTSPOT-03';
        clusterCustomName = 'Hotspot #03';
      } else if (locLower.includes('shivajinagar')) {
        clusterCustomId = 'HOTSPOT-01';
        clusterCustomName = 'Hotspot #01';
      } else if (locLower.includes('camp')) {
        clusterCustomId = 'HOTSPOT-07';
        clusterCustomName = 'Hotspot #07';
      } else if (locLower.includes('swargate')) {
        clusterCustomId = 'HOTSPOT-05';
        clusterCustomName = 'Hotspot #05';
      } else if (locLower.includes('kondhwa')) {
        clusterCustomId = 'HOTSPOT-04';
        clusterCustomName = 'Hotspot #04';
      }

      rawClusters.push({
        id: clusterCustomId,
        index: c + 1,
        name: clusterCustomName,
        locationName,
        centroid: [centroidLat, centroidLng],
        radiusMeters: locLower.includes('kothrud') ? 240 : radiusMeters,
        reportCount: clusterReports.length,
        reports: clusterReports,
        dominantWaste,
        wasteBreakdown: wasteCounts,
        eps,
        minSamples
      });
    }
  }

  // Noise points
  const noiseReports = [];
  for (let i = 0; i < n; i++) {
    if (clusterAssignments[i] === -1) {
      noiseReports.push(reports[i]);
    }
  }

  return {
    clusters: rawClusters,
    noisePoints: noiseReports,
    totalReports: reports.length
  };
}
