
import React, { useState, useMemo, useCallback } from 'react';
import { MOCK_SPOTS } from './constants';
import { StudySpot, UserState, ViewState, Review, CrowdLevel, ToastMessage } from './types';
import { Layout } from './components/Layout';
import { SpotCard } from './components/SpotCard';
import { SpotDetails } from './components/SpotDetails';
import { FilterModal, FilterState } from './components/FilterModal';
import { AIAssistant } from './components/AIAssistant';
import { Search, SlidersHorizontal, MapPinOff, CheckCircle, Heart } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  
  // App Data State
  const [spots, setSpots] = useState<StudySpot[]>(MOCK_SPOTS);
  const [userState, setUserState] = useState<UserState>({
    favorites: [],
    visited: [],
  });

  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    noise: [],
    types: [],
    onlyWithOutlets: false,
    onlyWithFood: false,
  });

  // Toast Handler
  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Derived Data
  const filteredSpots = useMemo(() => {
    return spots.filter(spot => {
      // Text Search
      const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            spot.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      // Filters
      if (filters.noise.length > 0 && !filters.noise.includes(spot.noiseLevel)) return false;
      if (filters.types.length > 0 && !filters.types.includes(spot.type)) return false;
      if (filters.onlyWithOutlets && !spot.hasOutlets) return false;
      if (filters.onlyWithFood && !spot.hasFood) return false;

      return true;
    });
  }, [spots, searchQuery, filters]);

  // Actions
  const handleSpotClick = (id: string) => {
    setSelectedSpotId(id);
    setCurrentView('details');
  };

  const handleBack = () => {
    setSelectedSpotId(null);
    setCurrentView('home');
  };

  const toggleFavorite = () => {
    if (!selectedSpotId) return;
    const isAdding = !userState.favorites.includes(selectedSpotId);
    
    setUserState(prev => ({
      ...prev,
      favorites: isAdding
        ? [...prev.favorites, selectedSpotId]
        : prev.favorites.filter(id => id !== selectedSpotId)
    }));

    if (isAdding) {
      showToast('Saved to Favorites', 'success');
    }
  };

  const toggleVisited = () => {
    if (!selectedSpotId) return;
    const isAdding = !userState.visited.includes(selectedSpotId);

    setUserState(prev => ({
      ...prev,
      visited: isAdding
        ? [...prev.visited, selectedSpotId]
        : prev.visited.filter(id => id !== selectedSpotId)
    }));

    if (isAdding) {
      showToast('Marked as Visited', 'success');
    }
  };

  const addReview = (spotId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString(),
    };

    setSpots(prevSpots => prevSpots.map(spot => {
      if (spot.id === spotId) {
        return {
          ...spot,
          reviews: [newReview, ...spot.reviews]
        };
      }
      return spot;
    }));
    
    showToast('Review published successfully!', 'success');
  };

  // New Functionality: Crowd Reporting
  const updateCrowdLevel = (spotId: string, level: CrowdLevel) => {
    setSpots(prevSpots => prevSpots.map(spot => {
       if (spot.id === spotId) {
         return {
           ...spot,
           crowdLevel: level,
           lastUpdated: 'Just now'
         };
       }
       return spot;
    }));
    showToast('Thanks for the live update!', 'info');
  };

  // Render Logic based on ViewState
  const renderContent = () => {
    switch (currentView) {
      case 'details':
        const spot = spots.find(s => s.id === selectedSpotId);
        if (!spot) return <div>Spot not found</div>;
        return (
          <SpotDetails
            spot={spot}
            onBack={handleBack}
            isFavorite={userState.favorites.includes(spot.id)}
            isVisited={userState.visited.includes(spot.id)}
            onToggleFavorite={toggleFavorite}
            onToggleVisited={toggleVisited}
            onAddReview={addReview}
            onUpdateCrowdLevel={updateCrowdLevel}
          />
        );

      case 'ai-assistant':
        return <AIAssistant availableSpots={spots} />;

      case 'favorites':
        const favSpots = spots.filter(s => userState.favorites.includes(s.id));
        return (
          <div className="p-5 animate-in slide-in-from-right-5 duration-300">
             <h2 className="text-2xl font-bold mb-6 text-gray-900 tracking-tight">Saved Spots</h2>
             {favSpots.length === 0 ? (
               <div className="flex flex-col items-center justify-center text-gray-400 mt-20 text-center">
                 <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                    <Heart size={48} className="text-gray-300" />
                 </div>
                 <p className="font-medium text-lg text-gray-600">No favorites yet</p>
                 <p className="text-sm mt-1">Save places you want to visit later.</p>
                 <button onClick={() => setCurrentView('home')} className="mt-6 text-indigo-600 font-bold text-sm">Discover Spots</button>
               </div>
             ) : (
               favSpots.map(spot => <SpotCard key={spot.id} spot={spot} onClick={() => handleSpotClick(spot.id)} />)
             )}
          </div>
        );

      case 'visited':
        const visitedSpots = spots.filter(s => userState.visited.includes(s.id));
        return (
          <div className="p-5 animate-in slide-in-from-right-5 duration-300">
             <h2 className="text-2xl font-bold mb-6 text-gray-900 tracking-tight">Your History</h2>
             {visitedSpots.length === 0 ? (
               <div className="flex flex-col items-center justify-center text-gray-400 mt-20 text-center">
                 <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                    <CheckCircle size={48} className="text-gray-300" />
                 </div>
                 <p className="font-medium text-lg text-gray-600">No check-ins yet</p>
                 <p className="text-sm mt-1">Mark places you've studied at.</p>
                 <button onClick={() => setCurrentView('home')} className="mt-6 text-indigo-600 font-bold text-sm">Start Exploring</button>
               </div>
             ) : (
               visitedSpots.map(spot => <SpotCard key={spot.id} spot={spot} onClick={() => handleSpotClick(spot.id)} />)
             )}
          </div>
        );

      case 'home':
      default:
        return (
          <div className="p-4 animate-in fade-in duration-300">
            {/* Search Bar */}
            <div className="flex gap-3 mb-6 sticky top-0 bg-gray-50/95 backdrop-blur-sm pt-2 pb-2 z-10">
              <div className="flex-1 relative group">
                <Search className="absolute left-3 top-3 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Find a study spot..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
                />
              </div>
              <button
                onClick={() => setIsFilterOpen(true)}
                className={`p-2.5 rounded-2xl border shadow-sm transition-all active:scale-95 ${
                  (filters.noise.length > 0 || filters.types.length > 0 || filters.onlyWithOutlets || filters.onlyWithFood)
                    ? 'text-indigo-600 border-indigo-200 bg-indigo-50 shadow-indigo-100'
                    : 'text-gray-600 border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal size={20} />
              </button>
            </div>

            <div className="mb-4 flex items-center justify-between px-1">
              <h2 className="font-bold text-lg text-gray-800 tracking-tight">
                {searchQuery || filters.noise.length > 0 ? 'Search Results' : 'Recommended for You'}
              </h2>
              <span className="text-[10px] font-bold text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded-full uppercase tracking-wider">
                {filteredSpots.length} Spots
              </span>
            </div>

            <div className="space-y-4 pb-4">
              {filteredSpots.length > 0 ? (
                filteredSpots.map(spot => (
                  <SpotCard
                    key={spot.id}
                    spot={spot}
                    onClick={() => handleSpotClick(spot.id)}
                  />
                ))
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                     <MapPinOff size={24} />
                  </div>
                  <p className="font-medium">No spots found</p>
                  <p className="text-sm mt-1 mb-4">Try adjusting your filters.</p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({ noise: [], types: [], onlyWithOutlets: false, onlyWithFood: false });
                    }}
                    className="text-indigo-600 font-bold text-sm hover:underline"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
            
            <FilterModal
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              initialFilters={filters}
              onApply={setFilters}
            />
          </div>
        );
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onNavigate={setCurrentView}
      toasts={toasts}
      onDismissToast={dismissToast}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
