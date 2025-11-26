import React, { useState } from 'react';
import { StudySpot, Review, CrowdLevel } from '../types';
import { ArrowLeft, Star, Heart, CheckCircle, Wifi, Plug, Coffee, Users, MapPin, Send, RefreshCw, Volume2, ImageOff } from 'lucide-react';

interface SpotDetailsProps {
  spot: StudySpot;
  onBack: () => void;
  isFavorite: boolean;
  isVisited: boolean;
  onToggleFavorite: () => void;
  onToggleVisited: () => void;
  onAddReview: (spotId: string, review: Omit<Review, 'id' | 'date'>) => void;
  onUpdateCrowdLevel: (spotId: string, level: CrowdLevel) => void;
}

export const SpotDetails: React.FC<SpotDetailsProps> = ({
  spot,
  onBack,
  isFavorite,
  isVisited,
  onToggleFavorite,
  onToggleVisited,
  onAddReview,
  onUpdateCrowdLevel,
}) => {
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [showCrowdUpdate, setShowCrowdUpdate] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    onAddReview(spot.id, {
      userId: 'currentUser',
      userName: 'You',
      rating: newReviewRating,
      comment: newReviewText,
    });
    setNewReviewText('');
    setNewReviewRating(5);
  };

  const handleCrowdUpdate = (level: CrowdLevel) => {
    onUpdateCrowdLevel(spot.id, level);
    setShowCrowdUpdate(false);
  };

  return (
    <div className="bg-gray-50 min-h-full pb-8">
      {/* Hero Image Section */}
      <div className="relative h-72 w-full bg-gray-800">
        {!imageError ? (
          <img 
            src={spot.image} 
            alt={spot.name} 
            className="w-full h-full object-cover" 
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/50">
             <ImageOff size={48} className="mb-2 opacity-50" />
             <span className="text-sm font-medium uppercase tracking-wider opacity-60">Image Unavailable</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <button
          onClick={onBack}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-lg hover:bg-white transition-all active:scale-90 z-10"
          aria-label="Go back"
        >
          <ArrowLeft size={22} className="text-gray-800" />
        </button>
        
        <div className="absolute bottom-6 left-5 text-white right-5 z-10">
           <div className="inline-block px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm border border-white/10 text-xs font-semibold mb-2">
             {spot.type}
           </div>
           <h2 className="text-3xl font-bold leading-tight shadow-black drop-shadow-md">{spot.name}</h2>
           <div className="flex items-center text-gray-200 text-sm mt-1 font-medium">
              <MapPin size={16} className="mr-1" />
              {spot.location}
           </div>
        </div>
      </div>

      <div className="px-5 py-6">
        {/* Primary Actions (Affordance: Large touch targets) */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={onToggleFavorite}
            className={`flex-1 py-3 px-4 rounded-2xl flex items-center justify-center font-bold text-sm transition-all shadow-sm active:scale-95 ${
              isFavorite
                ? 'bg-rose-50 text-rose-600 border border-rose-100'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Heart size={20} className={`mr-2 ${isFavorite ? 'fill-rose-600' : ''}`} />
            {isFavorite ? 'Saved' : 'Save'}
          </button>
          <button
            onClick={onToggleVisited}
            className={`flex-1 py-3 px-4 rounded-2xl flex items-center justify-center font-bold text-sm transition-all shadow-sm active:scale-95 ${
              isVisited
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700'
            }`}
          >
            <CheckCircle size={20} className="mr-2" />
            {isVisited ? 'Visited' : 'Check In'}
          </button>
        </div>

        {/* Live Status Card - Grouping Principle: Real-time info together */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              Live Status
            </h3>
            <span className="text-xs text-gray-400 font-medium">{spot.lastUpdated ? spot.lastUpdated : 'Just now'}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
               <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Crowd</div>
               <div className="flex items-center text-gray-800 font-bold text-lg">
                 <Users size={20} className={`mr-2 ${spot.crowdLevel === 'High' ? 'text-red-500' : spot.crowdLevel === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`} />
                 {spot.crowdLevel}
               </div>
             </div>
             <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
               <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Noise</div>
               <div className="flex items-center text-gray-800 font-bold text-lg">
                 <Volume2 size={20} className="mr-2 text-gray-600" />
                 {spot.noiseLevel}
               </div>
             </div>
          </div>

          {/* Additional Function: Crowd Report */}
          {!showCrowdUpdate ? (
            <button 
              onClick={() => setShowCrowdUpdate(true)}
              className="w-full mt-4 text-indigo-600 text-sm font-semibold py-2 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} />
              Update Current Status
            </button>
          ) : (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2">
              <p className="text-xs text-center text-gray-500 mb-2 font-medium">How crowded is it right now?</p>
              <div className="flex gap-2">
                {['Low', 'Medium', 'High'].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleCrowdUpdate(level as CrowdLevel)}
                    className="flex-1 py-2 text-xs font-bold rounded-lg border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Amenities & Info - Grouping Principle: Static facilities */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-3">
             <h3 className="font-bold text-gray-900">Facilities</h3>
             <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                <Star size={14} className="text-yellow-500 fill-yellow-500 mr-1" />
                <span className="font-bold text-yellow-800 text-sm">{spot.rating}</span>
             </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 ${spot.hasWifi ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-400 line-through'}`}>
              <Wifi size={14} /> WiFi
            </span>
            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 ${spot.hasOutlets ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-400 line-through'}`}>
              <Plug size={14} /> Outlets
            </span>
            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 ${spot.hasFood ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-400 line-through'}`}>
              <Coffee size={14} /> Food
            </span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">{spot.description}</p>
        </div>

        {/* Reviews Section */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
            Community Reviews
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{spot.reviews.length}</span>
          </h3>
          
          {/* Add Review Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm mb-6">
            <h4 className="font-semibold text-sm mb-3 text-gray-800">Rate your experience</h4>
            <form onSubmit={handleSubmitReview}>
              <div className="flex gap-2 mb-3">
                 {[1, 2, 3, 4, 5].map((star) => (
                   <button
                    key={star}
                    type="button"
                    onClick={() => setNewReviewRating(star)}
                    className="focus:outline-none transition-all active:scale-125 hover:scale-110"
                   >
                     <Star
                       size={28}
                       className={star <= newReviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}
                       strokeWidth={1.5}
                     />
                   </button>
                 ))}
              </div>
              <textarea
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                placeholder="What was good? How was the noise?"
                className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none mb-3 bg-gray-50 transition-all placeholder:text-gray-400"
                rows={3}
              />
              <button
                type="submit"
                disabled={!newReviewText.trim()}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 active:scale-[0.99] transition-all"
              >
                <Send size={16} className="mr-2" />
                Post Review
              </button>
            </form>
          </div>

          <div className="space-y-4">
            {spot.reviews.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm italic">No reviews yet. Be the first to share!</p>
              </div>
            ) : (
              spot.reviews.map((review) => (
                <div key={review.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                          {review.userName.charAt(0)}
                       </div>
                       <span className="font-bold text-sm text-gray-900">{review.userName}</span>
                    </div>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                  <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}
                        />
                      ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};