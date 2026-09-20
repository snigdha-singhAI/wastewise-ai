import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useWasteData } from '../../context/WasteDataContext';
import { PUNE_CENTER, DEPOT_LOCATION, PROCESSING_FACILITY } from '../../data/puneLocations';

export default function PuneMap({
  showReports = true,
  showHotspots = true,
  showRoute = true,
  height = '100%',
  onSelectHotspot = null,
  focusedHotspot = null
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef({
    reports: L.layerGroup(),
    hotspots: L.layerGroup(),
    routes: L.layerGroup(),
    facility: L.layerGroup()
  });

  const { reports, hotspots, route, selectedHotspotId, setSelectedHotspotId } = useWasteData();

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: PUNE_CENTER,
      zoom: 13,
      minZoom: 11,
      maxZoom: 18,
      zoomControl: false
    });

    // Add zoom control in top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // 100% Free OpenStreetMap tiles with dark theme filter (Zero API key required)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      className: 'dark-map-tiles'
    }).addTo(map);

    // Attach layer groups
    Object.values(layersGroupRef.current).forEach(group => group.addTo(map));

    mapInstanceRef.current = map;

    // Invalidate size on mount to avoid grey tiles
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Layers dynamically when state changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const { reports: reportGroup, hotspots: hotspotGroup, routes: routeGroup, facility: facilityGroup } = layersGroupRef.current;

    // 1. Render Report Dots
    reportGroup.clearLayers();
    if (showReports && reports.length > 0) {
      reports.forEach(report => {
        const reportIcon = L.divIcon({
          className: 'custom-report-marker',
          html: `<div style="width: 8px; height: 8px; background-color: #00f0ff; border-radius: 50%; box-shadow: 0 0 6px #00f0ff; border: 1px solid #ffffff;"></div>`,
          iconSize: [8, 8],
          iconAnchor: [4, 4]
        });

        const marker = L.marker([report.latitude, report.longitude], { icon: reportIcon });
        marker.bindPopup(`
          <div style="font-size: 11px; font-family: monospace; line-height: 1.4;">
            <div style="color: #00f0ff; font-weight: bold;">ID: ${report.id}</div>
            <div style="color: #f1f5f9; font-weight: 600; margin-top: 2px;">${report.wasteType} Waste</div>
            <div style="color: #94a3b8;">${report.locationName}</div>
            <div style="color: #64748b; font-size: 10px; margin-top: 4px;">${report.timestamp}</div>
          </div>
        `);
        reportGroup.addLayer(marker);
      });
    }

    // 2. Render Hotspot Clusters (Radial Circle + Glowing Label)
    hotspotGroup.clearLayers();
    if (showHotspots && hotspots.length > 0) {
      hotspots.forEach(hotspot => {
        const isSelected = hotspot.id === selectedHotspotId;
        const color = hotspot.priorityColor || '#ef4444';
        const isHigh = hotspot.priority === 'HIGH';

        // Hotspot Coverage Zone Circle
        const circle = L.circle(hotspot.centroid, {
          radius: hotspot.radiusMeters,
          color: color,
          weight: isSelected ? 3 : 1.5,
          opacity: isSelected ? 0.95 : 0.75,
          fillColor: color,
          fillOpacity: isSelected ? 0.35 : 0.18,
          dashArray: isHigh ? null : '4, 4'
        });

        circle.on('click', () => {
          setSelectedHotspotId(hotspot.id);
          if (onSelectHotspot) onSelectHotspot(hotspot);
        });

        hotspotGroup.addLayer(circle);

        // Center Pin / Badge
        const badgeIcon = L.divIcon({
          className: 'custom-hotspot-badge',
          html: `
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 2px 7px;
              background: ${isSelected ? 'rgba(7, 11, 20, 0.95)' : 'rgba(13, 21, 39, 0.85)'};
              border: 1.5px solid ${color};
              border-radius: 9999px;
              color: #ffffff;
              font-size: 10px;
              font-family: monospace;
              font-weight: bold;
              white-space: nowrap;
              box-shadow: 0 0 ${isSelected ? '16px' : '10px'} ${color};
              transform: translate(-50%, -50%);
              cursor: pointer;
            ">
              <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:${color}; margin-right:4px;"></span>
              ${hotspot.name} (${hotspot.reportCount})
            </div>
          `,
          iconSize: [0, 0]
        });

        const badgeMarker = L.marker(hotspot.centroid, { icon: badgeIcon });
        badgeMarker.on('click', () => {
          setSelectedHotspotId(hotspot.id);
          if (onSelectHotspot) onSelectHotspot(hotspot);
        });
        hotspotGroup.addLayer(badgeMarker);
      });
    }

    // 3. Render Route Stops & Polyline
    routeGroup.clearLayers();
    if (showRoute && route && route.polylineCoordinates?.length > 1) {
      // Glow underlay polyline
      const glowPolyline = L.polyline(route.polylineCoordinates, {
        color: '#10b981',
        weight: 8,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round'
      });
      routeGroup.addLayer(glowPolyline);

      // Main dashed route line
      const mainPolyline = L.polyline(route.polylineCoordinates, {
        color: '#10b981',
        weight: 3.5,
        opacity: 0.95,
        dashArray: '10, 8',
        lineCap: 'round',
        lineJoin: 'round'
      });
      routeGroup.addLayer(mainPolyline);

      // Numbered stops
      route.stops.forEach(stop => {
        const stopIcon = L.divIcon({
          className: 'custom-stop-marker',
          html: `
            <div style="
              width: 22px;
              height: 22px;
              border-radius: 50%;
              background: #10b981;
              color: #070b14;
              font-family: monospace;
              font-weight: 900;
              font-size: 11px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2px solid #ffffff;
              box-shadow: 0 0 12px #10b981;
              transform: translate(-50%, -50%);
            ">
              ${stop.stopNumber}
            </div>
          `,
          iconSize: [0, 0]
        });

        const stopMarker = L.marker([stop.lat, stop.lng], { icon: stopIcon });
        stopMarker.bindPopup(`
          <div style="font-size: 11px; font-family: monospace; line-height: 1.4;">
            <div style="color: #10b981; font-weight: bold;">STOP ${stop.stopNumber}: ${stop.name}</div>
            <div style="color: #f1f5f9;">Priority: <span style="color:${stop.priority === 'HIGH' ? '#ef4444' : '#f97316'}">${stop.priority} (${stop.priorityScore})</span></div>
            <div style="color: #94a3b8;">Reports: ${stop.reports} &bull; Waste: ${stop.dominantWaste}</div>
            <div style="color: #00f0ff; margin-top: 4px;">+${stop.distanceFromPrevKm} km from prev stop</div>
          </div>
        `);
        routeGroup.addLayer(stopMarker);
      });
    }

    // 4. Render Depot and Facility Markers
    facilityGroup.clearLayers();
    // Swargate Fleet Depot Marker
    const depotIcon = L.divIcon({
      className: 'depot-marker',
      html: `
        <div style="
          padding: 3px 8px;
          border-radius: 6px;
          background: #0284c7;
          color: #ffffff;
          font-family: monospace;
          font-size: 10px;
          font-weight: bold;
          border: 1.5px solid #38bdf8;
          box-shadow: 0 0 12px #38bdf8;
          display: flex;
          align-items: center;
          gap: 4px;
          transform: translate(-50%, -50%);
        ">
          <span>🚚 DEPOT</span>
        </div>
      `,
      iconSize: [0, 0]
    });
    const depotMarker = L.marker([DEPOT_LOCATION.lat, DEPOT_LOCATION.lng], { icon: depotIcon });
    depotMarker.bindPopup(`
      <div style="font-size: 11px; font-family: monospace;">
        <div style="color: #38bdf8; font-weight: bold;">${DEPOT_LOCATION.name}</div>
        <div style="color: #94a3b8;">Primary vehicle dispatch hub</div>
      </div>
    `);
    facilityGroup.addLayer(depotMarker);

    // Hadapsar Waste Recovery Plant Marker
    const plantIcon = L.divIcon({
      className: 'plant-marker',
      html: `
        <div style="
          padding: 3px 8px;
          border-radius: 6px;
          background: #059669;
          color: #ffffff;
          font-family: monospace;
          font-size: 10px;
          font-weight: bold;
          border: 1.5px solid #34d399;
          box-shadow: 0 0 12px #34d399;
          display: flex;
          align-items: center;
          gap: 4px;
          transform: translate(-50%, -50%);
        ">
          <span>♻️ FACILITY</span>
        </div>
      `,
      iconSize: [0, 0]
    });
    const plantMarker = L.marker([PROCESSING_FACILITY.lat, PROCESSING_FACILITY.lng], { icon: plantIcon });
    plantMarker.bindPopup(`
      <div style="font-size: 11px; font-family: monospace;">
        <div style="color: #34d399; font-weight: bold;">${PROCESSING_FACILITY.name}</div>
        <div style="color: #94a3b8;">End Destination &bull; Recovery Center</div>
      </div>
    `);
    facilityGroup.addLayer(plantMarker);

  }, [reports, hotspots, route, selectedHotspotId, showReports, showHotspots, showRoute, onSelectHotspot]);

  // Handle focus when focusedHotspot changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !focusedHotspot) return;

    map.flyTo(focusedHotspot.centroid, 14.5, {
      duration: 1.2
    });
  }, [focusedHotspot]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-cyan-500/20 shadow-2xl" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
