import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const run = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const email = `debug_${Date.now()}@test.com`;
        console.log(`Creating user ${email}...`);

        const user = await User.create({
            name: 'Debug User',
            email,
            password: 'password123'
        });
        console.log('User created:', user._id);

        console.log('Attempting to update risk profile...');
        user.riskScore = 5;
        user.learningLevel = 'Intermediate';
        user.riskAnswers = { q1: 1, q2: 2, q3: 2 };

        // Test the exact controller logic flow
        // The controller uses Object.assign or direct assignment
        // Here we just test if the Model accepts it
        await user.save();
        console.log('Risk profile updated successfully via Model save.');

        // Now test finding it again to be sure
        const found = await User.findById(user._id);
        console.log('Retrieved User Risk Answers:', found.riskAnswers);

    } catch (err) {
        console.error('ERROR:', err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
