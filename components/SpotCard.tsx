import React from 'react';
import { StudySpot } from '../types';
import { Star, MapPin, Users, Volume2 } from 'lucide-react';

interface SpotCardProps {
  spot: StudySpot;
  onClick: () => void;
}

export const SpotCard: React.FC<SpotCardProps> = ({ spot, onClick }) => {
  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'High': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4 active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="h-32 w-full relative">
        <img
          src={spot.image}
          alt={spot.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center shadow-sm">
          <Star size={12} className="text-yellow-500 fill-yellow-500 mr-1" />
          <span className="text-xs font-bold text-gray-800">{spot.rating}</span>
        </div>
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
           <span className="text-xs font-medium text-white">{spot.type}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 truncate">{spot.name}</h3>
        <div className="flex items-center text-gray-500 text-sm mt-1 mb-3">
          <MapPin size={14} className="mr-1" />
          {spot.location}
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full flex items-center font-medium ${getCrowdColor(spot.crowdLevel)}`}>
            <Users size={12} className="mr-1" />
            {spot.crowdLevel} Crowd
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium flex items-center">
            <Volume2 size={12} className="mr-1" />
            {spot.noiseLevel}
          </span>
        </div>
      </div>
    </div>
  );
};
