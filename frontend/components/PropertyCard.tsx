import React, { useState } from 'react';
import { Property } from '../types';
import { MapPin, Heart, Eye, Phone, Link as LinkIcon, ChevronLeft, ChevronRight, Trash2 } from './Icons';
import { showSuccess, showError } from '../utils/toast';
import { useRouter } from 'next/router';

interface PropertyCardProps {
  property: Property;
  onEdit?: (property: Property) => void;
  onDelete?: (id: string) => void;
  isClientView?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onEdit, onDelete, isClientView }) => {
  const [currentImg, setCurrentImg] = useState(0);
  const router = useRouter();
  const pricePerMeter = Math.round(property.price / (property.category === 'land' ? property.landArea || 1 : property.totalArea));

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((prev: number) => (prev + 1) % property.imageUrls.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((prev: number) => (prev - 1 + property.imageUrls.length) % property.imageUrls.length);
  };

  const generateClientLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const clientUrl = `${window.location.origin}/property/${property.id}?clientMode=true`;
    console.log('Generated client URL:', clientUrl);

    try {
      const updatedProperty = { ...property, publicLink: clientUrl };
      console.log('Sending PUT request with data:', updatedProperty);

      const response = await fetch(`/api/properties/${property.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProperty),
      });

      console.log('Response status:', response.status);
      console.log('Response OK:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response error:', errorText);
        throw new Error(`Failed to save public link to database: ${response.status} ${errorText}`);
      }

      await navigator.clipboard.writeText(clientUrl);
      showSuccess('Ссылка скопирована и сохранена!');
    } catch (error) {
      console.error('Error generating client link:', error);
      showError('Не удалось сгенерировать ссылку');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      apartments: 'Квартира',
      houses: 'Дом',
      commercial: 'Коммерция',
      land: 'Земля'
    };
    return categories[category] || category;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${isClientView ? 'cursor-pointer' : ''}`}
         onClick={() => isClientView && router.push(`/property/${property.id}?clientMode=true`)}>
      
      {/* Image Gallery */}
      <div className="relative h-48 bg-gray-200">
        {property.imageUrls.length > 0 ? (
          <>
            <img 
              src={property.imageUrls[currentImg]} 
              alt={property.description}
              className="w-full h-full object-cover"
            />
            {property.imageUrls.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1 rounded-full"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImg}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1 rounded-full"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Camera className="w-12 h-12" />
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
          {getCategoryLabel(property.category)}
        </div>
        
        {/* Price */}
        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-bold">
          {formatPrice(property.price)} ₽
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{property.description}</h3>
          {!isClientView && (
            <div className="flex gap-1 ml-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(property);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(property.id);
                }}
                className="p-1 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{property.district}, {property.address}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
          <div>
            {property.category === 'land' ? (
              <span>{property.landArea} соток</span>
            ) : (
              <span>{property.totalArea} м²</span>
            )}
            {property.category !== 'land' && property.kitchenArea && (
              <span className="text-gray-400"> / {property.kitchenArea} м² кухня</span>
            )}
          </div>
          <div>
            {property.category === 'apartments' ? (
              <span>{property.rooms} комн.</span>
            ) : property.category === 'houses' ? (
              <span>{property.houseSubtype}</span>
            ) : (
              <span>{property.landType}</span>
            )}
          </div>
        </div>

        {/* Additional Details */}
        <div className="flex flex-wrap gap-1 mb-3">
          {property.hasFurniture && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">С мебелью</span>
          )}
          {property.hasRepair && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">С ремонтом</span>
          )}
          {property.isEOselya && (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">ЕОселя</span>
          )}
        </div>

        {/* Price per meter */}
        <div className="text-xs text-gray-500 mb-3">
          {formatPrice(pricePerMeter)} ₽/м²
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a 
              href={`tel:${property.ownerPhone}`}
              className="flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-4 h-4 mr-1" />
              {property.ownerPhone}
            </a>
          </div>
          
          {!isClientView && (
            <button
              onClick={generateClientLink}
              className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
            >
              <LinkIcon className="w-4 h-4 mr-1" />
              Ссылка
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
