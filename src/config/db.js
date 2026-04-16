const dns = require('node:dns/promises');
const mongoose = require('mongoose');

// DNS fix for MongoDB Atlas (helps on some Windows/DNS setups)
dns.setServers(['1.1.1.1', '8.8.8.8', '8.8.4.4']);

const connectDB = async (uri) => {
  if (!uri) {
    throw new Error('MONGO_URI is required in environment variables.');
  }

  try {
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(uri, {
      // Modern options for Atlas
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name || 'border-customs-dashboard'}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
