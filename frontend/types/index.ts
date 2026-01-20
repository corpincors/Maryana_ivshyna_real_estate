export type PropertyCategory = 'apartments' | 'houses' | 'commercial' | 'land';

export interface Property {
  id: string;
  category: PropertyCategory;
  type: 'Secondary' | 'New Build' | 'Construction';
  price: number;
  district: string;
  address: string;
  ownerPhone: string;
  floor?: number;
  totalFloors?: number;
  rooms: string;
  totalArea: number;
  kitchenArea?: number;
  landArea?: number;
  housingClass: string;
  hasFurniture: boolean;
  hasRepair: boolean;
  repairType: string;
  heating: string;
  tech: string[];
  comfort: string[];
  comm: string[];
  infra: string[];
  isEOselya: boolean;
  landType?: string;
  houseSubtype?: 'Клубный дом' | 'Коттедж' | 'Дача' | 'Дуплекс' | 'Дом' | 'Часть дома' | 'Модульные дома' | 'Таунхаус';
  locationType?: 'inCity' | 'outsideCity';
  distanceFromCityKm?: number;
  plotArea?: number;
  cadastralNumber?: string;
  yearBuilt?: string;
  wallType?: string;
  bathroomType?: string;
  description: string;
  imageUrls: string[];
  publicLink?: string;
}

export interface FilterState {
  category: PropertyCategory;
  district: string;
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
  minKitchenArea: string;
  maxKitchenArea: string;
  rooms: string;
  housingClass: string;
  hasFurniture: boolean;
  hasRepair: boolean;
  repairType: string;
  heating: string;
  tech: string[];
  comfort: string[];
  comm: string[];
  infra: string[];
  isEOselya: boolean;
  landType?: string;
  houseSubtype?: string;
  locationType?: string;
  yearBuilt?: string;
  wallType?: string;
  bathroomType?: string;
}

export interface CustomOptions {
  districts: string[];
  housingClasses: string[];
  repairTypes: string[];
  heatingOptions: string[];
  yearBuiltOptions: string[];
  wallTypeOptions: string[];
  bathroomOptions: string[];
  techOptions: string[];
  comfortOptions: string[];
  commOptions: string[];
  infraOptions: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent';
}
