import React, { useState } from 'react';
import { X } from 'lucide-react';
import { NoiseLevel, SpotType } from '../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters: FilterState;
}

export interface FilterState {
  noise: NoiseLevel[];
  types: SpotType[];
  onlyWithOutlets: boolean;
  onlyWithFood: boolean;
}

export const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply, initialFilters }) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  if (!isOpen) return null;

  const toggleNoise = (level: NoiseLevel) => {
    setFilters(prev => ({
      ...prev,
      noise: prev.noise.includes(level)
        ? prev.noise.filter(n => n !== level)
        : [...prev.noise, level]
    }));
  };

  const toggleType = (type: SpotType) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 pointer-events-auto transform transition-transform duration-300 animate-in slide-in-from-bottom-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Filter Spots</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">Noise Level</h3>
            <div className="flex flex-wrap gap-2">
              {['Quiet', 'Moderate', 'Loud'].map((level) => (
                <button
                  key={level}
                  onClick={() => toggleNoise(level as NoiseLevel)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.noise.includes(level as NoiseLevel)
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">Type</h3>
            <div className="flex flex-wrap gap-2">
              {['Library', 'Cafe', 'Outdoor', 'Common Area'].map((type) => (
                <button
                  key={type}
                  onClick={() => toggleType(type as SpotType)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.types.includes(type as SpotType)
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">Features</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.onlyWithOutlets}
                  onChange={(e) => setFilters(prev => ({ ...prev, onlyWithOutlets: e.target.checked }))}
                  className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700">Has Power Outlets</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.onlyWithFood}
                  onChange={(e) => setFilters(prev => ({ ...prev, onlyWithFood: e.target.checked }))}
                  className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700">Has Food/Coffee</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100">
           <button
             onClick={() => {
               onApply(filters);
               onClose();
             }}
             className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all"
           >
             Show Results
           </button>
        </div>
      </div>
    </div>
  );
};
