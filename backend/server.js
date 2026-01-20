const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'vercel_app',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Initialize database
const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id TEXT PRIMARY KEY,
        category VARCHAR(50) NOT NULL,
        type VARCHAR(50) NOT NULL,
        price INTEGER NOT NULL,
        district VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        owner_phone VARCHAR(50) NOT NULL,
        floor INTEGER,
        total_floors INTEGER,
        rooms VARCHAR(50),
        total_area REAL NOT NULL,
        kitchen_area REAL,
        land_area REAL,
        housing_class VARCHAR(255),
        has_furniture BOOLEAN DEFAULT FALSE,
        has_repair BOOLEAN DEFAULT FALSE,
        repair_type VARCHAR(255),
        heating VARCHAR(255),
        tech TEXT[],
        comfort TEXT[],
        comm TEXT[],
        infra TEXT[],
        is_eoselya BOOLEAN DEFAULT FALSE,
        land_type VARCHAR(255),
        house_subtype VARCHAR(255),
        location_type VARCHAR(50),
        distance_from_city_km REAL,
        plot_area REAL,
        cadastral_number VARCHAR(255),
        year_built VARCHAR(50),
        wall_type VARCHAR(255),
        bathroom_type VARCHAR(255),
        description TEXT,
        image_urls TEXT[],
        public_link TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS custom_options (
        id SERIAL PRIMARY KEY,
        districts TEXT[] DEFAULT '{}',
        housing_classes TEXT[] DEFAULT '{}',
        repair_types TEXT[] DEFAULT '{}',
        heating_options TEXT[] DEFAULT '{}',
        year_built_options TEXT[] DEFAULT '{}',
        wall_type_options TEXT[] DEFAULT '{}',
        bathroom_options TEXT[] DEFAULT '{}',
        tech_options TEXT[] DEFAULT '{}',
        comfort_options TEXT[] DEFAULT '{}',
        comm_options TEXT[] DEFAULT '{}',
        infra_options TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Properties CRUD
app.get('/api/properties', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM properties ORDER BY created_at DESC');
    const properties = result.rows.map(row => ({
      id: row.id,
      category: row.category,
      type: row.type,
      price: row.price,
      district: row.district,
      address: row.address,
      ownerPhone: row.owner_phone,
      floor: row.floor,
      totalFloors: row.total_floors,
      rooms: row.rooms,
      totalArea: row.total_area,
      kitchenArea: row.kitchen_area,
      landArea: row.land_area,
      housingClass: row.housing_class,
      hasFurniture: row.has_furniture,
      hasRepair: row.has_repair,
      repairType: row.repair_type,
      heating: row.heating,
      tech: row.tech || [],
      comfort: row.comfort || [],
      comm: row.comm || [],
      infra: row.infra || [],
      isEOselya: row.is_eoselya,
      landType: row.land_type,
      houseSubtype: row.house_subtype,
      locationType: row.location_type,
      distanceFromCityKm: row.distance_from_city_km,
      plotArea: row.plot_area,
      cadastralNumber: row.cadastral_number,
      yearBuilt: row.year_built,
      wallType: row.wall_type,
      bathroomType: row.bathroom_type,
      description: row.description,
      imageUrls: row.image_urls || [],
      publicLink: row.public_link,
    }));
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

app.post('/api/properties', async (req, res) => {
  try {
    const property = req.body;
    
    const result = await pool.query(`
      INSERT INTO properties (
        id, category, type, price, district, address, owner_phone, floor, total_floors,
        rooms, total_area, kitchen_area, land_area, housing_class, has_furniture,
        has_repair, repair_type, heating, tech, comfort, comm, infra, is_eoselya,
        land_type, house_subtype, location_type, distance_from_city_km, plot_area,
        cadastral_number, year_built, wall_type, bathroom_type, description,
        image_urls, public_link
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
        $31, $32, $33, $34
      ) RETURNING *
    `, [
      property.id,
      property.category,
      property.type,
      property.price,
      property.district,
      property.address,
      property.ownerPhone,
      property.floor,
      property.totalFloors,
      property.rooms,
      property.totalArea,
      property.kitchenArea,
      property.landArea,
      property.housingClass,
      property.hasFurniture,
      property.hasRepair,
      property.repairType,
      property.heating,
      JSON.stringify(property.tech || []),
      JSON.stringify(property.comfort || []),
      JSON.stringify(property.comm || []),
      JSON.stringify(property.infra || []),
      property.isEOselya,
      property.landType,
      property.houseSubtype,
      property.locationType,
      property.distanceFromCityKm,
      property.plotArea,
      property.cadastralNumber,
      property.yearBuilt,
      property.wallType,
      property.bathroomType,
      property.description,
      JSON.stringify(property.imageUrls || []),
      property.publicLink
    ]);

    const savedProperty = result.rows[0];
    const response = {
      id: savedProperty.id,
      category: savedProperty.category,
      type: savedProperty.type,
      price: savedProperty.price,
      district: savedProperty.district,
      address: savedProperty.address,
      ownerPhone: savedProperty.owner_phone,
      floor: savedProperty.floor,
      totalFloors: savedProperty.total_floors,
      rooms: savedProperty.rooms,
      totalArea: savedProperty.total_area,
      kitchenArea: savedProperty.kitchen_area,
      landArea: savedProperty.land_area,
      housingClass: savedProperty.housing_class,
      hasFurniture: savedProperty.has_furniture,
      hasRepair: savedProperty.has_repair,
      repairType: savedProperty.repair_type,
      heating: savedProperty.heating,
      tech: savedProperty.tech || [],
      comfort: savedProperty.comfort || [],
      comm: savedProperty.comm || [],
      infra: savedProperty.infra || [],
      isEOselya: savedProperty.is_eoselya,
      landType: savedProperty.land_type,
      houseSubtype: savedProperty.house_subtype,
      locationType: savedProperty.location_type,
      distanceFromCityKm: savedProperty.distance_from_city_km,
      plotArea: savedProperty.plot_area,
      cadastralNumber: savedProperty.cadastral_number,
      yearBuilt: savedProperty.year_built,
      wallType: savedProperty.wall_type,
      bathroomType: savedProperty.bathroom_type,
      description: savedProperty.description,
      imageUrls: savedProperty.image_urls || [],
      publicLink: savedProperty.public_link,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

app.put('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const property = req.body;

    const result = await pool.query(`
      UPDATE properties SET
        category = $2, type = $3, price = $4, district = $5, address = $6,
        owner_phone = $7, floor = $8, total_floors = $9, rooms = $10, total_area = $11,
        kitchen_area = $12, land_area = $13, housing_class = $14, has_furniture = $15,
        has_repair = $16, repair_type = $17, heating = $18, tech = $19, comfort = $20,
        comm = $21, infra = $22, is_eoselya = $23, land_type = $24, house_subtype = $25,
        location_type = $26, distance_from_city_km = $27, plot_area = $28, cadastral_number = $29,
        year_built = $30, wall_type = $31, bathroom_type = $32, description = $33,
        image_urls = $34, public_link = $35, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 RETURNING *
    `, [
      id,
      property.category,
      property.type,
      property.price,
      property.district,
      property.address,
      property.ownerPhone,
      property.floor,
      property.totalFloors,
      property.rooms,
      property.totalArea,
      property.kitchenArea,
      property.landArea,
      property.housingClass,
      property.hasFurniture,
      property.hasRepair,
      property.repairType,
      property.heating,
      JSON.stringify(property.tech || []),
      JSON.stringify(property.comfort || []),
      JSON.stringify(property.comm || []),
      JSON.stringify(property.infra || []),
      property.isEOselya,
      property.landType,
      property.houseSubtype,
      property.locationType,
      property.distanceFromCityKm,
      property.plotArea,
      property.cadastralNumber,
      property.yearBuilt,
      property.wallType,
      property.bathroomType,
      property.description,
      JSON.stringify(property.imageUrls || []),
      property.publicLink
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const savedProperty = result.rows[0];
    const response = {
      id: savedProperty.id,
      category: savedProperty.category,
      type: savedProperty.type,
      price: savedProperty.price,
      district: savedProperty.district,
      address: savedProperty.address,
      ownerPhone: savedProperty.owner_phone,
      floor: savedProperty.floor,
      totalFloors: savedProperty.total_floors,
      rooms: savedProperty.rooms,
      totalArea: savedProperty.total_area,
      kitchenArea: savedProperty.kitchen_area,
      landArea: savedProperty.land_area,
      housingClass: savedProperty.housing_class,
      hasFurniture: savedProperty.has_furniture,
      hasRepair: savedProperty.has_repair,
      repairType: savedProperty.repair_type,
      heating: savedProperty.heating,
      tech: savedProperty.tech || [],
      comfort: savedProperty.comfort || [],
      comm: savedProperty.comm || [],
      infra: savedProperty.infra || [],
      isEOselya: savedProperty.is_eoselya,
      landType: savedProperty.land_type,
      houseSubtype: savedProperty.house_subtype,
      locationType: savedProperty.location_type,
      distanceFromCityKm: savedProperty.distance_from_city_km,
      plotArea: savedProperty.plot_area,
      cadastralNumber: savedProperty.cadastral_number,
      yearBuilt: savedProperty.year_built,
      wallType: savedProperty.wall_type,
      bathroomType: savedProperty.bathroom_type,
      description: savedProperty.description,
      imageUrls: savedProperty.image_urls || [],
      publicLink: savedProperty.public_link,
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

app.delete('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM properties WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// Custom Options CRUD
app.get('/api/customOptions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM custom_options ORDER BY created_at DESC LIMIT 1');
    
    if (result.rows.length === 0) {
      return res.json({
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
    }

    const options = result.rows[0];
    res.json({
      districts: options.districts || [],
      housingClasses: options.housing_classes || [],
      repairTypes: options.repair_types || [],
      heatingOptions: options.heating_options || [],
      yearBuiltOptions: options.year_built_options || [],
      wallTypeOptions: options.wall_type_options || [],
      bathroomOptions: options.bathroom_options || [],
      techOptions: options.tech_options || [],
      comfortOptions: options.comfort_options || [],
      commOptions: options.comm_options || [],
      infraOptions: options.infra_options || [],
    });
  } catch (error) {
    console.error('Error fetching custom options:', error);
    res.status(500).json({ error: 'Failed to fetch custom options' });
  }
});

app.post('/api/customOptions', async (req, res) => {
  try {
    const options = req.body;
    
    const result = await pool.query(`
      INSERT INTO custom_options (
        districts, housing_classes, repair_types, heating_options, year_built_options,
        wall_type_options, bathroom_options, tech_options, comfort_options,
        comm_options, infra_options
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      ) RETURNING *
    `, [
      options.districts || [],
      options.housingClasses || [],
      options.repairTypes || [],
      options.heatingOptions || [],
      options.yearBuiltOptions || [],
      options.wallTypeOptions || [],
      options.bathroomOptions || [],
      options.techOptions || [],
      options.comfortOptions || [],
      options.commOptions || [],
      options.infraOptions || []
    ]);

    res.status(201).json({
      districts: result.rows[0].districts || [],
      housingClasses: result.rows[0].housing_classes || [],
      repairTypes: result.rows[0].repair_types || [],
      heatingOptions: result.rows[0].heating_options || [],
      yearBuiltOptions: result.rows[0].year_built_options || [],
      wallTypeOptions: result.rows[0].wall_type_options || [],
      bathroomOptions: result.rows[0].bathroom_options || [],
      techOptions: result.rows[0].tech_options || [],
      comfortOptions: result.rows[0].comfort_options || [],
      commOptions: result.rows[0].comm_options || [],
      infraOptions: result.rows[0].infra_options || [],
    });
  } catch (error) {
    console.error('Error saving custom options:', error);
    res.status(500).json({ error: 'Failed to save custom options' });
  }
});

// Start server
const startServer = async () => {
  await initDatabase();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Properties API: http://localhost:${PORT}/api/properties`);
  });
};

startServer().catch(console.error);

module.exports = app;
