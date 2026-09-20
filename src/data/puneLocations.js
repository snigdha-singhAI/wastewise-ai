// Pune Landmark Locations for Demo Operations
export const PUNE_CENTER = [18.5204, 73.8567]; // Pune Municipal Center

export const DEPOT_LOCATION = {
  id: 'depot-01',
  name: 'Swargate Municipal Fleet Depot',
  code: 'DEPOT-PMC',
  lat: 18.5018,
  lng: 73.8580,
  type: 'DEPOT',
  description: 'Primary vehicle dispatch and maintenance hub'
};

export const PROCESSING_FACILITY = {
  id: 'proc-01',
  name: 'Hadapsar Integrated Recovery Plant',
  code: 'PMC-RECOVERY-04',
  lat: 18.4900,
  lng: 73.9350,
  type: 'FACILITY',
  description: 'Materials sorting, composting & recycling center'
};

export const PUNE_SECTORS = [
  { name: 'Kothrud', center: [18.5074, 73.8077], defaultCategory: 'Plastic' },
  { name: 'Shivajinagar', center: [18.5308, 73.8475], defaultCategory: 'Plastic' },
  { name: 'Camp / MG Road', center: [18.5145, 73.8785], defaultCategory: 'Mixed' },
  { name: 'Swargate', center: [18.4975, 73.8525], defaultCategory: 'Organic' },
  { name: 'Kondhwa', center: [18.4785, 73.8920], defaultCategory: 'Paper' },
  { name: 'Deccan Gymkhana', center: [18.5168, 73.8415], defaultCategory: 'Plastic' },
  { name: 'Yerawada', center: [18.5529, 73.8828], defaultCategory: 'Metal' }
];
