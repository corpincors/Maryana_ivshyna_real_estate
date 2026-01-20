import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from './Icons';

interface MultiSelectProps {
  label: string;
  prefix: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  accentColor?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ 
  label, 
  prefix, 
  options, 
  selected, 
  onChange,
  accentColor = 'blue'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item: string) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const getDisplayText = () => {
    if (selected.length === 0) return 'Выберите...';
    if (selected.length === 1) return selected[0];
    return `${prefix}: ${selected.length}`;
  };

  const bgColorClass = `bg-${accentColor}-50/50`;
  const borderColorClass = `border-${accentColor}-100`;
  const accentClass = `accent-${accentColor}-600`;

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 text-left border rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${borderColorClass} ${bgColorClass}`}
      >
        <span className="block truncate">{getDisplayText()}</span>
        <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="p-2">
            {options.length === 0 ? (
              <div className="text-gray-500 text-sm">Нет опций</div>
            ) : (
              options.map((option) => (
                <label
                  key={option}
                  className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option)}
                    onChange={() => toggleOption(option)}
                    className={`mr-2 ${accentClass}`}
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
