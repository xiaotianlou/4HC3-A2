
export type NoiseLevel = 'Quiet' | 'Moderate' | 'Loud';
export type CrowdLevel = 'Low' | 'Medium' | 'High';
export type SpotType = 'Library' | 'Cafe' | 'Outdoor' | 'Common Area';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface StudySpot {
  id: string;
  name: string;
  type: SpotType;
  description: string;
  image: string;
  noiseLevel: NoiseLevel;
  crowdLevel: CrowdLevel;
  lastUpdated?: string; // For live crowd updates
  hasOutlets: boolean;
  hasFood: boolean;
  hasWifi: boolean;
  rating: number;
  reviews: Review[];
  location: string;
}

export type ViewState = 'home' | 'favorites' | 'visited' | 'details' | 'ai-assistant';

export interface UserState {
  favorites: string[];
  visited: string[];
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info';
}
