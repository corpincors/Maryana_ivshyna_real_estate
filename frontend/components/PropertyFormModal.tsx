import React, { useState, useEffect, useRef } from 'react';
import { Property, CustomOptions } from '../types';
import { X, Home, Layers, Camera, Plus, Phone } from './Icons';
import MultiSelect from './MultiSelect';
import { 
  ROOMS_OPTIONS, LAND_TYPES, REPAIR_TYPES, HOUSING_CLASSES,
  HEATING_OPTIONS, TECH_OPTIONS, COMFORT_OPTIONS, COMM_OPTIONS, INFRA_OPTIONS,
  HOUSE_TYPES_EXTENDED, YEAR_BUILT_OPTIONS, WALL_TYPE_OPTIONS, BATHROOM_OPTIONS,
  CATEGORIES, INITIAL_DISTRICTS
} from '../constants';

interface PropertyFormModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: Property) => void;
  customOptions: CustomOptions;
  onAddCustomOption: (field: keyof CustomOptions, value: string) => void;
  getAllDistricts: () => string[];
  getAllHousingClasses: () => string[];
  getAllRepairTypes: () => string[];
  getAllHeatingOptions: () => string[];
  getAllTechOptions: () => string[];
  getAllComfortOptions: () => string[];
  getAllCommOptions: () => string[];
  getAllInfraOptions: () => string[];
}

const PropertyFormModal: React.FC<PropertyFormModalProps> = ({ 
  property,
  isOpen, 
  onClose, 
  onSave,
  customOptions,
  onAddCustomOption,
  getAllDistricts,
  getAllHousingClasses,
  getAllRepairTypes,
  getAllHeatingOptions,
  getAllTechOptions,
  getAllComfortOptions,
  getAllCommOptions,
  getAllInfraOptions,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<Property>>({
    category: 'apartments',
    type: 'Secondary',
    price: 0,
    district: '',
    address: '',
    ownerPhone: '',
    totalArea: 0,
    rooms: '1',
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
    description: '',
    imageUrls: [],
  });

  useEffect(() => {
    if (property) {
      setFormData(property);
    } else {
      setFormData({
        category: 'apartments',
        type: 'Secondary',
        price: 0,
        district: '',
        address: '',
        ownerPhone: '',
        totalArea: 0,
        rooms: '1',
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
        description: '',
        imageUrls: [],
      });
    }
  }, [property]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.price || !formData.district || !formData.address || !formData.ownerPhone) {
      alert('Заполните обязательные поля');
      return;
    }

    const propertyToSave: Property = {
      id: property?.id || Date.now().toString(),
      category: formData.category!,
      type: formData.type as 'Secondary' | 'New Build' | 'Construction',
      price: formData.price!,
      district: formData.district!,
      address: formData.address!,
      ownerPhone: formData.ownerPhone!,
      floor: formData.floor,
      totalFloors: formData.totalFloors,
      rooms: formData.rooms || '1',
      totalArea: formData.totalArea!,
      kitchenArea: formData.kitchenArea,
      landArea: formData.landArea,
      housingClass: formData.housingClass || '',
      hasFurniture: formData.hasFurniture || false,
      hasRepair: formData.hasRepair || false,
      repairType: formData.repairType || '',
      heating: formData.heating || '',
      tech: formData.tech || [],
      comfort: formData.comfort || [],
      comm: formData.comm || [],
      infra: formData.infra || [],
      isEOselya: formData.isEOselya || false,
      landType: formData.landType,
      houseSubtype: formData.houseSubtype,
      locationType: formData.locationType,
      distanceFromCityKm: formData.distanceFromCityKm,
      plotArea: formData.plotArea,
      cadastralNumber: formData.cadastralNumber,
      yearBuilt: formData.yearBuilt,
      wallType: formData.wallType,
      bathroomType: formData.bathroomType,
      description: formData.description || '',
      imageUrls: formData.imageUrls || [],
    };

    onSave(propertyToSave);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        imageUrls: [...(prev.imageUrls || []), ...newImages]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls?.filter((_, i) => i !== index) || []
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {property ? 'Редактировать объект' : 'Добавить объект'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Категория *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as Property['category']})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Тип</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as Property['type']})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Secondary">Вторичка</option>
                <option value="New Build">Новостройка</option>
                <option value="Construction">Стройка</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Цена, ₽ *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Район *</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({...formData, district: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Выберите район</option>
                {getAllDistricts().map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Адрес *</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Телефон владельца *</label>
              <input
                type="tel"
                value={formData.ownerPhone}
                onChange={(e) => setFormData({...formData, ownerPhone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {formData.category === 'apartments' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Этаж</label>
                  <input
                    type="number"
                    value={formData.floor || ''}
                    onChange={(e) => setFormData({...formData, floor: parseInt(e.target.value) || undefined})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Этажность</label>
                  <input
                    type="number"
                    value={formData.totalFloors || ''}
                    onChange={(e) => setFormData({...formData, totalFloors: parseInt(e.target.value) || undefined})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Комнаты</label>
                  <select
                    value={formData.rooms}
                    onChange={(e) => setFormData({...formData, rooms: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ROOMS_OPTIONS.map(room => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.category === 'land' ? 'Площадь участка, соток' : 'Общая площадь, м²'} *
              </label>
              <input
                type="number"
                value={formData.totalArea}
                onChange={(e) => setFormData({...formData, totalArea: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {formData.category === 'apartments' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Площадь кухни, м²</label>
                <input
                  type="number"
                  value={formData.kitchenArea || ''}
                  onChange={(e) => setFormData({...formData, kitchenArea: parseInt(e.target.value) || undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Класс жилья</label>
              <select
                value={formData.housingClass}
                onChange={(e) => setFormData({...formData, housingClass: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Выберите класс</option>
                {getAllHousingClasses().map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ремонт</label>
              <select
                value={formData.repairType}
                onChange={(e) => setFormData({...formData, repairType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Выберите тип</option>
                {getAllRepairTypes().map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Отопление</label>
              <select
                value={formData.heating}
                onChange={(e) => setFormData({...formData, heating: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Выберите тип</option>
                {getAllHeatingOptions().map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.hasFurniture}
                  onChange={(e) => setFormData({...formData, hasFurniture: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">С мебелью</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.hasRepair}
                  onChange={(e) => setFormData({...formData, hasRepair: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">С ремонтом</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isEOselya}
                  onChange={(e) => setFormData({...formData, isEOselya: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">ЕОселя</span>
              </label>
            </div>
          </div>

          {/* Multi-select fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MultiSelect
              label="Технологии"
              prefix="Тех"
              options={getAllTechOptions()}
              selected={formData.tech || []}
              onChange={(selected) => setFormData({...formData, tech: selected})}
              accentColor="blue"
            />

            <MultiSelect
              label="Комфорт"
              prefix="Комф"
              options={getAllComfortOptions()}
              selected={formData.comfort || []}
              onChange={(selected) => setFormData({...formData, comfort: selected})}
              accentColor="green"
            />

            <MultiSelect
              label="Коммуникации"
              prefix="Комм"
              options={getAllCommOptions()}
              selected={formData.comm || []}
              onChange={(selected) => setFormData({...formData, comm: selected})}
              accentColor="purple"
            />

            <MultiSelect
              label="Инфраструктура"
              prefix="Инфра"
              options={getAllInfraOptions()}
              selected={formData.infra || []}
              onChange={(selected) => setFormData({...formData, infra: selected})}
              accentColor="orange"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Фотографии</label>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.imageUrls?.map((url, index) => (
                  <div key={index} className="relative w-24 h-24 border rounded">
                    <img src={url} alt={`Фото ${index + 1}`} className="w-full h-full object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center hover:border-gray-400"
                >
                  <Plus className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {property ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyFormModal;
