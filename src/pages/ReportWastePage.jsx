import React, { useState } from 'react';
import { useWasteData } from '../context/WasteDataContext';
import { runWasteClassification, MODEL_METADATA } from '../services/classificationService';
import { PUNE_SECTORS } from '../data/puneLocations';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  Sparkles,
  MapPin,
  Flame,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileCheck
} from 'lucide-react';

// Sample demo images (100% offline self-contained SVG data URIs)
const PRESET_DEMO_IMAGES = [
  {
    id: 'sample-plastic',
    label: 'Plastic Refuse',
    type: 'Plastic',
    locationIndex: 0, // Kothrud
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%230c172d"/><rect x="15" y="15" width="370" height="270" rx="10" fill="%230f2244" stroke="%2300f0ff" stroke-width="1.5" stroke-dasharray="4,4"/><g transform="translate(130, 45)"><rect x="40" y="15" width="60" height="130" rx="12" fill="%2300f0ff" opacity="0.85"/><rect x="58" y="2" width="24" height="16" rx="3" fill="%2338bdf8"/><path d="M40 70 Q70 85 100 70" stroke="%23ffffff" stroke-width="3" fill="none"/><rect x="48" y="80" width="44" height="35" rx="4" fill="%23ffffff" opacity="0.9"/><text x="70" y="102" font-family="monospace" font-size="9" font-weight="bold" fill="%230f2244" text-anchor="middle">PETE-1</text><ellipse cx="115" cy="150" rx="32" ry="18" fill="%2338bdf8" opacity="0.75" transform="rotate(-20, 115, 150)"/><rect x="15" y="130" width="38" height="42" rx="6" fill="%2300f0ff" opacity="0.65" transform="rotate(35, 34, 151)"/></g><text x="200" y="240" font-family="monospace" font-size="12" font-weight="bold" fill="%2300f0ff" text-anchor="middle">DEMO SAMPLE: PLASTIC / PET</text><text x="200" y="260" font-family="sans-serif" font-size="10" fill="%2394a3b8" text-anchor="middle">Kothrud Sector &bull; High Accumulation</text></svg>`
  },
  {
    id: 'sample-paper',
    label: 'Cardboard Bundles',
    type: 'Paper',
    locationIndex: 4, // Kondhwa
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%231a1510"/><rect x="15" y="15" width="370" height="270" rx="10" fill="%23261e16" stroke="%23f59e0b" stroke-width="1.5" stroke-dasharray="4,4"/><g transform="translate(130, 45)"><polygon points="20,50 90,20 150,50 80,80" fill="%23b45309"/><polygon points="20,50 80,80 80,150 20,120" fill="%23d97706"/><polygon points="80,80 150,50 150,120 80,150" fill="%2392400e"/><line x1="80" y1="80" x2="80" y2="150" stroke="%2378350f" stroke-width="2"/><rect x="35" y="70" width="30" height="20" fill="%23fef3c7" opacity="0.85"/><line x1="40" y1="76" x2="60" y2="76" stroke="%23000000" stroke-width="1.5"/><line x1="40" y1="82" x2="55" y2="82" stroke="%23000000" stroke-width="1.5"/></g><text x="200" y="240" font-family="monospace" font-size="12" font-weight="bold" fill="%23f59e0b" text-anchor="middle">DEMO SAMPLE: CARDBOARD / PAPER</text><text x="200" y="260" font-family="sans-serif" font-size="10" fill="%23d1d5db" text-anchor="middle">Kondhwa Sector &bull; Packaging Material</text></svg>`
  },
  {
    id: 'sample-organic',
    label: 'Market Organic Waste',
    type: 'Organic',
    locationIndex: 3, // Swargate
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23081e15"/><rect x="15" y="15" width="370" height="270" rx="10" fill="%230d2d20" stroke="%2310b981" stroke-width="1.5" stroke-dasharray="4,4"/><g transform="translate(140, 55)"><ellipse cx="60" cy="80" rx="45" ry="35" fill="%23059669"/><path d="M50 45 C45 30 70 20 75 35 Z" fill="%2310b981"/><circle cx="35" cy="95" r="20" fill="%2334d399" opacity="0.8"/><circle cx="85" cy="95" r="18" fill="%236ee7b7" opacity="0.8"/><path d="M20 75 Q60 100 100 70" stroke="%23064e3b" stroke-width="3" fill="none"/></g><text x="200" y="240" font-family="monospace" font-size="12" font-weight="bold" fill="%2310b981" text-anchor="middle">DEMO SAMPLE: ORGANIC / MANDAI REFUSE</text><text x="200" y="260" font-family="sans-serif" font-size="10" fill="%2394a3b8" text-anchor="middle">Swargate Market Sector &bull; Biodegradable</text></svg>`
  }
];

export default function ReportWastePage() {
  const { addNewReport, setActiveTab, setSelectedHotspotId } = useWasteData();

  const [selectedImage, setSelectedImage] = useState(PRESET_DEMO_IMAGES[0].url);
  const [selectedImageName, setSelectedImageName] = useState('kothrud_plastic_deposit.jpg');
  const [sectorIndex, setSectorIndex] = useState(0); // Default Kothrud
  const [selectedCategory, setSelectedCategory] = useState('Auto Detect');
  const [description, setDescription] = useState('High accumulation of single-use plastic bottles and packaging near commercial entrance.');

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);

  const activeSector = PUNE_SECTORS[sectorIndex];

  // Handle local file drop / file pick
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
        setSelectedImageName(file.name);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset picker
  const handleSelectPreset = (preset) => {
    setSelectedImage(preset.url);
    setSelectedImageName(`${preset.label.toLowerCase().replace(/\s+/g, '_')}.jpg`);
    setSectorIndex(preset.locationIndex);
    setAnalysisResult(null);
  };

  // Run 5-step processing sequence
  const handleAnalyzeReport = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setAnalysisResult(null);

    // Step 1: Preprocessing image
    setCurrentStep(1);
    await new Promise(r => setTimeout(r, 450));

    // Step 2: Running visual classification
    setCurrentStep(2);
    const classification = await runWasteClassification(selectedImage, selectedCategory);

    // Step 3: Updating geospatial database
    setCurrentStep(3);
    await new Promise(r => setTimeout(r, 500));

    // Step 4: Checking nearby hotspots & Step 5: Updating priority score
    setCurrentStep(4);
    await new Promise(r => setTimeout(r, 450));
    setCurrentStep(5);
    await new Promise(r => setTimeout(r, 450));

    // Commit to global state
    // Add small random offset so new reports appear near sector center
    const latOffset = (Math.random() - 0.5) * 0.003;
    const lngOffset = (Math.random() - 0.5) * 0.003;

    const commitResult = addNewReport({
      latitude: activeSector.center[0] + latOffset,
      longitude: activeSector.center[1] + lngOffset,
      wasteType: classification.primaryCategory,
      confidence: classification.confidence,
      description: description || `Reported ${classification.primaryCategory} waste observation.`,
      locationName: `${activeSector.name}, Pune`,
      address: `Near ${activeSector.name} Central Sector, Pune`,
      severity: classification.primaryCategory === 'Plastic' ? 'High' : 'Medium',
      imageUrl: selectedImage
    });

    setAnalysisResult({
      classification,
      report: commitResult.report,
      nearestHotspot: commitResult.nearestHotspot,
      distanceMeters: commitResult.distanceMeters
    });

    setIsProcessing(false);
    setCurrentStep(0);
  };

  const stepsList = [
    { num: 1, text: 'Preprocessing image' },
    { num: 2, text: 'Running visual classification' },
    { num: 3, text: 'Updating geospatial database' },
    { num: 4, text: 'Checking nearby hotspots' },
    { num: 5, text: 'Updating priority score' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Title & Subtitle */}
      <div>
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-black text-white tracking-wide">
            REPORT WASTE
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
            CITIZEN & FLEET INTAKE
          </span>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          Turn a local observation into actionable collection intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Upload & Input Form */}
        <div className="lg:col-span-7 space-y-5">
          {/* Upload Area */}
          <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-3">
              Upload Waste Image
            </label>

            <div className="relative border-2 border-dashed border-cyan-500/30 hover:border-cyan-400/60 rounded-xl p-6 text-center transition-all bg-slate-950/40 group cursor-pointer">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              {selectedImage ? (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="w-36 h-28 rounded-lg overflow-hidden border border-cyan-500/40 shadow-glow-cyan/20 shrink-0">
                    <img
                      src={selectedImage}
                      alt="Waste preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left space-y-1 text-xs font-mono">
                    <div className="text-cyan-300 font-bold flex items-center space-x-1.5">
                      <ImageIcon className="w-4 h-4" />
                      <span className="truncate max-w-[200px]">{selectedImageName}</span>
                    </div>
                    <div className="text-slate-400">Supported: JPG / PNG / WEBP</div>
                    <div className="text-emerald-400 text-[11px]">Ready for visual inference</div>
                    <span className="inline-block text-[10px] text-slate-500 underline mt-1">
                      Click or drop another image to replace
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <Upload className="w-8 h-8 text-cyan-400 mx-auto group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-medium text-slate-200">
                    Drag and drop waste image here, or browse
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    Supported: JPG / PNG / WEBP
                  </div>
                </div>
              )}
            </div>

            {/* Quick Preset Buttons for Google Meet Presenters */}
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Live Demo Presets (1-Click Test):</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_DEMO_IMAGES.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-left transition-all text-xs"
                  >
                    <div className="font-semibold text-slate-200 text-[11px]">{preset.label}</div>
                    <div className="text-[10px] text-cyan-400 font-mono">{PUNE_SECTORS[preset.locationIndex].name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 text-xs font-mono">
            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Waste Location</span>
                <span className="text-[10px] text-cyan-400 font-normal">Pune Municipal Grid</span>
              </label>
              <select
                value={sectorIndex}
                onChange={(e) => setSectorIndex(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
              >
                {PUNE_SECTORS.map((sector, idx) => (
                  <option key={sector.name} value={idx}>
                    {sector.name}, Pune ({sector.center[0].toFixed(4)} N, {sector.center[1].toFixed(4)} E)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                  Waste Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
                >
                  <option value="Auto Detect">Auto Detect [Recommended]</option>
                  <option value="Plastic">Plastic</option>
                  <option value="Paper">Paper / Cardboard</option>
                  <option value="Metal">Metal Scrap</option>
                  <option value="Glass">Glass Containers</option>
                  <option value="Organic">Organic / Food Waste</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                  Timestamp
                </label>
                <input
                  type="text"
                  disabled
                  value="Auto generated (Real-time)"
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-400 text-xs cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                Description (Optional)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Observed waste density, access restrictions or hazard notes..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs resize-none"
              />
            </div>

            {/* Action Button */}
            <button
              onClick={handleAnalyzeReport}
              disabled={isProcessing}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wider uppercase shadow-glow-cyan hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>EXECUTING PIPELINE...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>ANALYZE REPORT</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column (5 cols): Processing Sequence & Live Result */}
        <div className="lg:col-span-5 space-y-5">
          {/* Animated Processing Sequence */}
          <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                PIPELINE EXECUTION STATUS
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                {isProcessing ? 'PROCESSING' : analysisResult ? 'COMPLETED' : 'IDLE'}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {stepsList.map((st) => {
                const isDone = isProcessing ? currentStep > st.num : analysisResult !== null;
                const isCurrent = isProcessing && currentStep === st.num;

                return (
                  <div
                    key={st.num}
                    className={`flex items-center space-x-3 p-2.5 rounded-xl text-xs font-mono transition-all ${
                      isCurrent
                        ? 'bg-cyan-500/20 border border-cyan-500/50 shadow-glow-cyan/10'
                        : isDone
                        ? 'bg-emerald-950/30 border border-emerald-500/20 text-slate-200'
                        : 'opacity-40 border border-transparent text-slate-400'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                      ) : (
                        <span className="text-slate-500">0{st.num}</span>
                      )}
                    </div>
                    <div className="flex-1 font-medium">
                      STEP {st.num}: {st.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Analysis Result Card */}
          {analysisResult && (
            <div className="glass-panel-glow rounded-2xl p-5 border border-emerald-500/40 space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
              {/* Classification Result */}
              <div className="pb-3 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    AI CLASSIFICATION
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                    MODEL MODE: {MODEL_METADATA.mode}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xl font-extrabold text-white font-mono">
                    {analysisResult.classification.primaryCategory} Waste
                  </span>
                  <span className="text-xs font-mono text-cyan-300 bg-slate-900 px-2.5 py-1 rounded border border-cyan-500/30">
                    Confidence: {analysisResult.classification.confidencePercent}%
                  </span>
                </div>
                <div className="mt-2 text-xs font-mono space-y-1 text-slate-400">
                  <div>STATUS: <strong className="text-emerald-400">New report created ({analysisResult.report.id})</strong></div>
                  <div>LOCATION: <strong className="text-slate-200">{analysisResult.report.locationName}</strong></div>
                </div>
              </div>

              {/* Hotspot Analysis */}
              <div className="text-xs font-mono space-y-2">
                <span className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider">
                  HOTSPOT ANALYSIS
                </span>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Nearest hotspot:</span>
                    <strong className="text-white">
                      {analysisResult.nearestHotspot ? analysisResult.nearestHotspot.name : 'Emerging Cluster'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Distance:</span>
                    <strong className="text-cyan-300">{analysisResult.distanceMeters} m</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Hotspot status:</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-500/40">
                      {analysisResult.nearestHotspot ? analysisResult.nearestHotspot.priority : 'HIGH PRIORITY'}
                    </span>
                  </div>
                </div>
              </div>

              {/* View on Map Button */}
              <button
                onClick={() => {
                  if (analysisResult.nearestHotspot) {
                    setSelectedHotspotId(analysisResult.nearestHotspot.id);
                  }
                  setActiveTab('dashboard');
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-glow-green"
              >
                <span>VIEW ON MAP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
