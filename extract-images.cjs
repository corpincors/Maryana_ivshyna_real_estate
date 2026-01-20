const fs = require('fs');
const path = require('path');

// Читаем текущую базу данных
const data = JSON.parse(fs.readFileSync('db.json', 'utf8'));

// Функция для извлечения base64 и сохранения как файл
function extractAndSaveImages(property) {
  if (!property.imageUrls || !Array.isArray(property.imageUrls)) {
    return property;
  }

  const newImageUrls = [];
  
  property.imageUrls.forEach((imageUrl, index) => {
    // Проверяем, является ли это base64 изображением
    if (imageUrl.startsWith('data:image/')) {
      try {
        // Извлекаем тип изображения и данные
        const matches = imageUrl.match(/^data:image\/(\w+);base64,(.+)$/);
        if (matches && matches[2]) {
          const imageType = matches[1];
          const base64Data = matches[2];
          
          // Создаем имя файла
          const fileName = `${property.id}_${index + 1}.${imageType}`;
          const filePath = path.join('public/images', fileName);
          
          // Сохраняем файл
          fs.writeFileSync(filePath, base64Data, 'base64');
          
          // Добавляем путь к файлу
          newImageUrls.push(`/images/${fileName}`);
          
          console.log(`Сохранено изображение: ${fileName}`);
        }
      } catch (error) {
        console.error(`Ошибка при сохранении изображения для ${property.id}:`, error.message);
        // Если ошибка, оставляем оригинальный URL
        newImageUrls.push(imageUrl);
      }
    } else {
      // Если это не base64, оставляем как есть
      newImageUrls.push(imageUrl);
    }
  });
  
  // Обновляем массив изображений
  property.imageUrls = newImageUrls;
  
  return property;
}

// Обрабатываем все свойства
const optimizedProperties = data.properties.map(extractAndSaveImages);

// Создаем оптимизированную базу данных
const optimizedData = {
  ...data,
  properties: optimizedProperties
};

// Сохраняем оптимизированную версию
fs.writeFileSync('db-optimized.json', JSON.stringify(optimizedData, null, 2));

console.log('\nОптимизация завершена!');
console.log(`Обработано объектов: ${optimizedProperties.length}`);
console.log('Создан файл: db-optimized.json');
console.log('Изображения сохранены в папку: public/images/');
