require('dotenv').config();
const { connectDB, isConnected } = require('./config/database');
const Profile = require('./models/Profile');

async function testConnection() {
    try {
        console.log('Testing MongoDB connection...');
        
        // Test connection
        await connectDB();
        console.log('✅ Database connected successfully');
        
        // Test query
        const profile = await Profile.findOne();
        console.log('✅ Query executed successfully');
        console.log('Profile found:', profile ? 'Yes' : 'No');
        
        // Test connection state
        console.log('Connection state:', isConnected() ? 'Connected' : 'Disconnected');
        
    } catch (error) {
        console.error('❌ Connection test failed:', error);
    } finally {
        process.exit(0);
    }
}

testConnection(); 