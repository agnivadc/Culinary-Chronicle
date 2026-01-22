
export interface Coordinate {
  lat: number;
  lng: number;
}

export interface EvolutionStep {
  year: string;
  location: string;
  event: string;
  description: string;
  coordinates: Coordinate;
}

export interface ConsumptionHub {
  country: string;
  percentage: number;
  coordinates: Coordinate;
}

export interface IngredientEvolution {
  original: string;
  modern: string;
  reason: string;
}

export interface CulturalInsight {
  region: string;
  meaning: string;
  tradition: string;
}

export interface RegionalVariation {
  name: string;
  region: string;
  keyDifference: string;
  popularity: string;
}

export interface FoodData {
  foodName: string;
  origin: {
    location: string;
    era: string;
    coordinates: Coordinate;
    summary: string;
  };
  evolutionSteps: EvolutionStep[];
  consumptionHubs: ConsumptionHub[];
  ingredientEvolution: IngredientEvolution[];
  flavorProfile: {
    sweet: number;
    savory: number;
    spicy: number;
    sour: number;
    bitter: number;
  };
  culturalSignificance: CulturalInsight[];
  regionalVariations: RegionalVariation[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
