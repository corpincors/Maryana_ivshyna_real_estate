// Test script to verify the land type custom option logic
console.log('Testing land type custom option logic...');

// Simulate the initial state
const LAND_TYPES = []; // Empty array as in constants.tsx
const customOptions = { landTypes: [] };

// Simulate getUniqueOptions function
function getUniqueOptions(initialConstants, customList, propertyKey) {
  const propertyValues = []; // No existing properties
  const customValues = Array.isArray(customList) ? customList : [];
  const combined = [...initialConstants, ...customValues, ...propertyValues];
  return Array.from(new Set(combined.filter(v => typeof v === 'string' && v.trim() !== ''))).sort();
}

// Test initial state
const availableLandTypes = getUniqueOptions(LAND_TYPES, customOptions.landTypes || [], 'landType');
console.log('Initial availableLandTypes:', availableLandTypes);

// Test adding a custom option
const newOption = 'Сельскохозяйственный';
console.log('Adding custom option:', newOption);

// Simulate the condition in EditableSingleSelect
const canAdd = newOption.trim() && !availableLandTypes.includes(newOption.trim());
console.log('Can add option?', canAdd);

if (canAdd) {
  // Simulate adding to custom options
  customOptions.landTypes = [...customOptions.landTypes, newOption];
  const newAvailableLandTypes = getUniqueOptions(LAND_TYPES, customOptions.landTypes || [], 'landType');
  console.log('After adding, availableLandTypes:', newAvailableLandTypes);
}

console.log('Test completed.');
