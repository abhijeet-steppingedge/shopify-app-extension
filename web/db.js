import { MongoClient } from 'mongodb';
import config from './config.js';

const mongoURL = config.mongoAuth + config.mongoDatabase;
let client;

(async () => {
    try {
        client = new MongoClient(mongoURL);
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
})();

export default client; 
