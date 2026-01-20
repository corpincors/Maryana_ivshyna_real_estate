import { useState, useEffect, useMemo, useCallback } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Property, FilterState, PropertyCategory, CustomOptions } from '../types';
import { 
  ROOMS_OPTIONS, LAND_TYPES, 
  REPAIR_TYPES, HOUSING_CLASSES, HEATING_OPTIONS, TECH_OPTIONS, COMFORT_OPTIONS, 
  COMM_OPTIONS, INFRA_OPTIONS, CATEGORIES, INITIAL_DISTRICTS, HOUSE_TYPES_EXTENDED, LOCATION_TYPES,
  YEAR_BUILT_OPTIONS, WALL_TYPE_OPTIONS, BATHROOM_OPTIONS
} from '../constants';
import { PlusCircle, Search, Plus, Home, LogOut, ChevronDown, Users } from '../components/Icons';
import PropertyCard from '../components/PropertyCard';
import PropertyFormModal from '../components/PropertyFormModal';
import MultiSelect from '../components/MultiSelect';
import { showSuccess, showError } from '../utils/toast';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/properties`;
const CUSTOM_OPTIONS_API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/customOptions`;

const Home: NextPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const router = useRouter();

  const [customOptions, setCustomOptions] = useState<CustomOptions>({
    districts: [],
    housingClasses: [],
    repairTypes: [],
    heatingOptions: [],
    yearBuiltOptions: [],
    wallTypeOptions: [],
    bathroomOptions: [],
    techOptions: [],
    comfortOptions: [],
    commOptions: [],
    infraOptions: [],
  });

  const [filters, setFilters] = useState<FilterState>({
    category: 'apartments',
    district: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    minKitchenArea: '',
    maxKitchenArea: '',
    rooms: '',
    housingClass: '',
    hasFurniture: false,
    hasRepair: false,
    repairType: '',
    heating: '',
    tech: [],
    comfort: [],
    comm: [],
    infra: [],
    isEOselya: false,
    landType: '',
    houseSubtype: '',
    locationType: '',
    yearBuilt: '',
    wallType: '',
    bathroomType: '',
  });

  const [showAdditionalFilters, setShowAdditionalFilters] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('realty_crm_additional_filters_open');
    if (saved !== null) {
      setShowAdditionalFilters(JSON.parse(saved));
    }
    fetchProperties();
    fetchCustomOptions();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(API_URL);
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      showError('Не удалось загрузить объекты');
    }
  };

  const fetchCustomOptions = async () => {
    try {
      const response = await axios.get(CUSTOM_OPTIONS_API_URL);
      if (response.data) {
        setCustomOptions(response.data);
      }
    } catch (error) {
      console.error('Error fetching custom options:', error);
    }
  };

  const saveCustomOptions = async (newOptions: CustomOptions) => {
    try {
      await axios.post(CUSTOM_OPTIONS_API_URL, newOptions);
      setCustomOptions(newOptions);
    } catch (error) {
      console.error('Error saving custom options:', error);
    }
  };

  const handleAddCustomOption = async (field: keyof CustomOptions, value: string) => {
    if (!value.trim()) return;
    
    const newOptions = { ...customOptions };
    if (!newOptions[field].includes(value)) {
      newOptions[field] = [...newOptions[field], value];
      await saveCustomOptions(newOptions);
    }
  };

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      if (filters.category && property.category !== filters.category) return false;
      if (filters.district && property.district !== filters.district) return false;
      if (filters.minPrice && property.price < parseInt(filters.minPrice)) return false;
      if (filters.maxPrice && property.price > parseInt(filters.maxPrice)) return false;
      if (filters.minArea && property.totalArea < parseInt(filters.minArea)) return false;
      if (filters.maxArea && property.totalArea > parseInt(filters.maxArea)) return false;
      if (filters.rooms && property.rooms !== filters.rooms) return false;
      if (filters.housingClass && property.housingClass !== filters.housingClass) return false;
      if (filters.hasFurniture && !property.hasFurniture) return false;
      if (filters.hasRepair && !property.hasRepair) return false;
      if (filters.repairType && property.repairType !== filters.repairType) return false;
      if (filters.heating && property.heating !== filters.heating) return false;
      if (filters.isEOselya && !property.isEOselya) return false;
      
      return true;
    });
  }, [properties, filters]);

  const handleAddProperty = () => {
    setEditingProperty(null);
    setIsModalOpen(true);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот объект?')) return;
    
    try {
      await axios.delete(`${API_URL}/${id}`);
      setProperties(properties.filter(p => p.id !== id));
      showSuccess('Объект удален');
    } catch (error) {
      console.error('Error deleting property:', error);
      showError('Не удалось удалить объект');
    }
  };

  const handleSaveProperty = async (property: Property) => {
    try {
      if (editingProperty) {
        const response = await axios.put(`${API_URL}/${property.id}`, property);
        setProperties(properties.map(p => p.id === property.id ? response.data : p));
        showSuccess('Объект обновлен');
      } else {
        const response = await axios.post(API_URL, property);
        setProperties([...properties, response.data]);
        showSuccess('Объект добавлен');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving property:', error);
      showError('Не удалось сохранить объект');
    }
  };

  const toggleAdditionalFilters = () => {
    const newState = !showAdditionalFilters;
    setShowAdditionalFilters(newState);
    localStorage.setItem('realty_crm_additional_filters_open', JSON.stringify(newState));
  };

  const clearFilters = () => {
    setFilters({
      category: 'apartments',
      district: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      minKitchenArea: '',
      maxKitchenArea: '',
      rooms: '',
      housingClass: '',
      hasFurniture: false,
      hasRepair: false,
      repairType: '',
      heating: '',
      tech: [],
      comfort: [],
      comm: [],
      infra: [],
      isEOselya: false,
      landType: '',
      houseSubtype: '',
      locationType: '',
      yearBuilt: '',
      wallType: '',
      bathroomType: '',
    });
  };

  const getAllDistricts = () => [...new Set([...INITIAL_DISTRICTS, ...customOptions.districts])];
  const getAllHousingClasses = () => [...new Set([...HOUSING_CLASSES, ...customOptions.housingClasses])];
  const getAllRepairTypes = () => [...new Set([...REPAIR_TYPES, ...customOptions.repairTypes])];
  const getAllHeatingOptions = () => [...new Set([...HEATING_OPTIONS, ...customOptions.heatingOptions])];
  const getAllTechOptions = () => [...new Set([...TECH_OPTIONS, ...customOptions.techOptions])];
  const getAllComfortOptions = () => [...new Set([...COMFORT_OPTIONS, ...customOptions.comfortOptions])];
  const getAllCommOptions = () => [...new Set([...COMM_OPTIONS, ...customOptions.commOptions])];
  const getAllInfraOptions = () => [...new Set([...INFRA_OPTIONS, ...customOptions.infraOptions])];

  return (
    <>
      <Head>
        <title>Недвижимость CRM</title>
        <meta name="description" content="CRM система для управления недвижимостью" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Home className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">Недвижимость CRM</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/clients')}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Клиенты
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Фильтры</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Очистить
                </button>
                <button
                  onClick={toggleAdditionalFilters}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                >
                  <ChevronDown className={`w-4 h-4 mr-1 transform ${showAdditionalFilters ? 'rotate-180' : ''}`} />
                  Дополнительно
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value as PropertyCategory})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Район</label>
                <select
                  value={filters.district}
                  onChange={(e) => setFilters({...filters, district: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Все районы</option>
                  {getAllDistricts().map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Цена, ₽</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="От"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="До"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Area Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Площадь, м²</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="От"
                    value={filters.minArea}
                    onChange={(e) => setFilters({...filters, minArea: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="До"
                    value={filters.maxArea}
                    onChange={(e) => setFilters({...filters, maxArea: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Additional Filters */}
            {showAdditionalFilters && (
              <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Rooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Комнаты</label>
                  <select
                    value={filters.rooms}
                    onChange={(e) => setFilters({...filters, rooms: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Любые</option>
                    {ROOMS_OPTIONS.map(room => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                </div>

                {/* Housing Class */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Класс жилья</label>
                  <select
                    value={filters.housingClass}
                    onChange={(e) => setFilters({...filters, housingClass: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Любой</option>
                    {getAllHousingClasses().map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.hasFurniture}
                      onChange={(e) => setFilters({...filters, hasFurniture: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">С мебелью</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.hasRepair}
                      onChange={(e) => setFilters({...filters, hasRepair: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">С ремонтом</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.isEOselya}
                      onChange={(e) => setFilters({...filters, isEOselya: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">ЕОселя</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Properties Grid */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Найдено объектов: {filteredProperties.length}
            </h2>
            <button
              onClick={handleAddProperty}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Добавить объект
            </button>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">Объекты не найдены</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onEdit={handleEditProperty}
                  onDelete={handleDeleteProperty}
                />
              ))}
            </div>
          )}
        </main>

        {/* Property Form Modal */}
        {isModalOpen && (
          <PropertyFormModal
            property={editingProperty}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveProperty}
            customOptions={customOptions}
            onAddCustomOption={handleAddCustomOption}
            getAllDistricts={getAllDistricts}
            getAllHousingClasses={getAllHousingClasses}
            getAllRepairTypes={getAllRepairTypes}
            getAllHeatingOptions={getAllHeatingOptions}
            getAllTechOptions={getAllTechOptions}
            getAllComfortOptions={getAllComfortOptions}
            getAllCommOptions={getAllCommOptions}
            getAllInfraOptions={getAllInfraOptions}
          />
        )}
      </div>
    </>
  );
};

export default Home;
