
import React, { useState, useCallback } from 'react';
import { analyzeArchitecture } from './services/geminiService';
import { AppState, ArchitectureInfo } from './types';
import Header from './components/Header';
import InfoCard from './components/InfoCard';

// Icons using SVG strings for simplicity and to avoid external dependency issues
const MapPinIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    image: null,
    loading: false,
    error: null,
    result: null,
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setState(prev => ({ ...prev, image: base64, result: null, error: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!state.image) return;

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await analyzeArchitecture(state.image);
      setState(prev => ({ ...prev, result: data, loading: false }));
    } catch (err) {
      console.error(err);
      setState(prev => ({ ...prev, loading: false, error: "Failed to identify the building. Please try a clearer photo." }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Upload Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Identify Architecture</h2>
              <p className="text-gray-500 text-sm mb-6">Upload a photo of a building, city square, or urban landmark to discover its identity and story.</p>
              
              <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center min-h-[300px] transition-all hover:border-black group">
                {state.image ? (
                  <img src={state.image} alt="Preview" className="max-h-[400px] w-full object-cover rounded-lg shadow-sm" />
                ) : (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-900 font-medium">Click to upload or drag and drop</p>
                    <p className="text-gray-400 text-sm mt-1">JPEG, PNG, WEBP up to 10MB</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={handleImageUpload}
                />
              </div>

              {state.image && !state.loading && (
                <button 
                  onClick={processImage}
                  className="w-full mt-6 bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg active:scale-95 flex items-center justify-center space-x-2"
                >
                  <span>Start Analysis</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </button>
              )}

              {state.loading && (
                <div className="mt-6 flex flex-col items-center space-y-4">
                  <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-600 font-medium animate-pulse">Consulting architectural records...</p>
                </div>
              )}

              {state.error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start space-x-3">
                  <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{state.error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-7">
            {state.result ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight">{state.result.locationName}</h1>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600">{state.result.city}</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600">{state.result.country}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard label="Designer" value={state.result.designer} icon={<UserIcon />} />
                  <InfoCard label="Year" value={state.result.constructionYear} icon={<CalendarIcon />} />
                  <InfoCard label="Area" value={state.result.area} />
                  <InfoCard label="Function" value={state.result.function} />
                </div>

                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-100 pb-2">Design Philosophy</h3>
                    <p className="text-gray-600 leading-relaxed text-lg italic">"{state.result.designPhilosophy}"</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-100 pb-2">Context & Background</h3>
                    <p className="text-gray-600 leading-relaxed">{state.result.background}</p>
                  </section>

                  {state.result.interestingFacts.length > 0 && (
                    <section>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Interesting Facts</h3>
                      <ul className="space-y-3">
                        {state.result.interestingFacts.map((fact, i) => (
                          <li key={i} className="flex items-start space-x-3 text-gray-600">
                            <span className="w-1.5 h-1.5 bg-black rounded-full mt-2.5 shrink-0" />
                            <span>{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </symbol>
                  )}
                </div>

                <div className="pt-8">
                  <button 
                    onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(state.result!.locationName + ' ' + state.result!.city)}`, '_blank')}
                    className="inline-flex items-center space-x-2 text-black font-semibold hover:underline"
                  >
                    <span>View on Google Maps</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl min-h-[500px] bg-white">
                <div className="text-center max-w-sm px-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-gray-900 font-bold text-xl mb-2">Awaiting Analysis</h3>
                  <p className="text-gray-400">Once you upload a photo and start analysis, detailed architectural information will appear here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-white rounded-sm transform rotate-45" />
              </div>
              <span className="font-bold text-gray-900">ArchLens</span>
            </div>
            <p className="text-gray-500 text-sm">© 2024 ArchLens AI Explorer. Powered by Gemini.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
