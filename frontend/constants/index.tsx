import { PropertyCategory } from '../types';

export const ROOMS_OPTIONS = ['Студия', '1', '2', '3', '4', '5+'];

export const LAND_TYPES = ['Под застройку', 'Сельхоз', 'Коммерческое'];

export const REPAIR_TYPES: string[] = [];

export const HOUSING_CLASSES: string[] = [];

export const HEATING_OPTIONS: string[] = [];

export const TECH_OPTIONS: string[] = [];

export const COMFORT_OPTIONS: string[] = [];

export const COMM_OPTIONS: string[] = [];

export const INFRA_OPTIONS: string[] = [];

export const HOUSE_TYPES_EXTENDED = [
  'Клубный дом', 'Коттедж', 'Дача', 'Дуплекс', 'Дом', 'Часть дома', 'Модульные дома', 'Таунхаус'
] as const;

export const LOCATION_TYPES = ['В городе', 'За городом'] as const;

export const CATEGORIES: Array<{ id: PropertyCategory; label: string }> = [
  { id: 'apartments', label: 'Квартиры' },
  { id: 'houses', label: 'Дома' },
  { id: 'commercial', label: 'Коммерция' },
  { id: 'land', label: 'Земельные участки' },
];

export const INITIAL_DISTRICTS = [
  'Приморский', 'Малиновский', 'Суворовский', 'Киевский'
];

export const YEAR_BUILT_OPTIONS: string[] = [];

export const WALL_TYPE_OPTIONS: string[] = [];

export const BATHROOM_OPTIONS: string[] = [];
