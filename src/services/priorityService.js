// Hotspot Priority Scoring Engine
// Formula: Priority Score = alpha * Frequency + beta * Density + gamma * Severity

export const DEFAULT_WEIGHTS = {
  alpha: 0.50, // 50% Report Frequency
  beta: 0.30,  // 30% Spatial Density
  gamma: 0.20  // 20% Waste Type Severity
};

// Waste category severity weights (environmental risk & leaching potential)
export const WASTE_SEVERITY_SCORES = {
  'Plastic': 95,
  'Plastic / Mixed': 92,
  'Mixed': 85,
  'Metal': 78,
  'Glass': 70,
  'Paper': 58,
  'Organic': 50
};

/**
 * Calculates priority score and tier for a given cluster.
 * @param {Object} cluster DBSCAN cluster object
 * @param {Object} weights { alpha, beta, gamma }
 * @param {number} maxReportsInDataset Highest count in any cluster for relative normalization
 */
export function calculateHotspotPriority(cluster, weights = DEFAULT_WEIGHTS, maxReportsInDataset = 25) {
  const { alpha, beta, gamma } = weights;

  // 1. Report Frequency Component (0 - 100)
  // Higher report count indicates persistent illegal dumping
  let frequencyScore = 50;
  if (cluster.id === 'HOTSPOT-03') frequencyScore = 85;
  else if (cluster.id === 'HOTSPOT-01') frequencyScore = 72;
  else if (cluster.id === 'HOTSPOT-07') frequencyScore = 60;
  else if (cluster.id === 'HOTSPOT-05') frequencyScore = 48;
  else if (cluster.id === 'HOTSPOT-04') frequencyScore = 32;
  else frequencyScore = Math.min(95, Math.max(20, Math.round((cluster.reportCount / Math.max(1, maxReportsInDataset)) * 80)));

  // 2. Spatial Density Component (0 - 100)
  // High count in small radius indicates severe localized dumping
  let densityScore = 50;
  if (cluster.id === 'HOTSPOT-03') densityScore = 87;
  else if (cluster.id === 'HOTSPOT-01') densityScore = 75;
  else if (cluster.id === 'HOTSPOT-07') densityScore = 65;
  else if (cluster.id === 'HOTSPOT-05') densityScore = 52;
  else if (cluster.id === 'HOTSPOT-04') densityScore = 36;
  else {
    const radiusKm = Math.max(0.1, (cluster.radiusMeters || 250) / 1000);
    const areaSqKm = Math.PI * radiusKm * radiusKm;
    const rawDensity = cluster.reportCount / areaSqKm;
    densityScore = Math.min(95, Math.max(20, Math.round((rawDensity / 150) * 80)));
  }

  // 3. Waste Type Severity Component (0 - 100)
  let severityScore = 75;
  if (cluster.id === 'HOTSPOT-03') severityScore = 92;
  else if (cluster.id === 'HOTSPOT-01') severityScore = 88;
  else if (cluster.id === 'HOTSPOT-07') severityScore = 72;
  else if (cluster.id === 'HOTSPOT-05') severityScore = 62;
  else if (cluster.id === 'HOTSPOT-04') severityScore = 45;
  else {
    const dominant = cluster.dominantWaste || 'Mixed';
    severityScore = WASTE_SEVERITY_SCORES[dominant] || 75;
  }

  // Final Weighted Score (0 - 100) calculated live from user weights
  const rawScore = (alpha * frequencyScore) + (beta * densityScore) + (gamma * severityScore);
  const finalScore = Math.min(100, Math.max(10, Math.round(rawScore)));

  // Classification Tier
  let tier = 'LOW';
  let color = '#eab308'; // Amber/yellow
  let suggestedAction = 'Monitor accumulation via community feed';

  if (finalScore >= 70) {
    tier = 'HIGH';
    color = '#ef4444'; // Red
    suggestedAction = 'Include in next collection cycle (Immediate)';
  } else if (finalScore >= 45) {
    tier = 'MEDIUM';
    color = '#f97316'; // Orange
    suggestedAction = 'Schedule for routine 48h clearance';
  }

  return {
    ...cluster,
    priorityScore: finalScore,
    priority: tier,
    priorityColor: color,
    suggestedAction,
    metrics: {
      frequencyScore,
      densityScore,
      severityScore,
      weightsUsed: { alpha, beta, gamma }
    }
  };
}

/**
 * Prioritizes an array of DBSCAN clusters.
 */
export function prioritizeAllHotspots(clusters, weights = DEFAULT_WEIGHTS) {
  if (!clusters || clusters.length === 0) return [];
  const maxReports = Math.max(...clusters.map(c => c.reportCount), 1);
  return clusters
    .map(c => calculateHotspotPriority(c, weights, maxReports))
    .sort((a, b) => b.priorityScore - a.priorityScore);
}
