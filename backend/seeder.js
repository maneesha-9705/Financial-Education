import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import User from './models/User.js'; // Ensure this path is correct
import connectDB from './config/db.js'; // Ensure this path is correct

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const importData = async () => {
    try {
        await connectDB();

        const dbPath = path.join(__dirname, 'db.json');
        const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        const users = dbData.users;

        console.log(`Found ${users.length} users to import...`);

        // Clean data before import
        const cleanedUsers = users.map(user => {
            // Remove 'id' as MongoDB uses '_id' (or you can map it, but it's better to let Mongo generate)
            // If you want to keep the old ID, it might complicate things unless it's a valid ObjectId.
            // We will let MongoDB generate new _ids for simplicity, or we can try to use it if needed.
            // For a migration, better strictly follow the new schema. 
            // The schema expects: name, email, password, mobile, learningLevel

            return {
                name: user.name || "Unknown User",
                email: user.email,
                password: user.password || "123456", // Temporary default if missing, though it should be there. Note: these are plaintext!
                mobile: user.mobile,
                learningLevel: user.learningLevel || "Beginner",
                isAdmin: false, // Default
                // We aren't importing riskAnswers/riskScore directly as they weren't in the new User.js schema I saw, 
                // but if they are needed, the schema should be updated first. 
                // Based on previous turn User.js, they were not there. I will ignore them for now to prevent errors,
                // unless you want me to add them to the schema.
            };
        }).filter(u => u.email && u.email !== ""); // basic validation

        console.log(`Valid users to process: ${cleanedUsers.length}`);

        // We can't use insertMany directly because of the pre-save hook for password hashing.
        // We must loop and save one by one to trigger the hashing middleware.

        let importedCount = 0;
        for (const userData of cleanedUsers) {
            // Check for duplicates based on email
            const exists = await User.findOne({ email: userData.email });
            if (!exists) {
                const user = new User(userData);
                await user.save();
                importedCount++;
                console.log(`Imported: ${userData.email}`);
            } else {
                console.log(`Skipped (Duplicate): ${userData.email}`);
            }
        }

        console.log(`Data Import Completed! ${importedCount} new users added.`);
        process.exit();
    } catch (error) {
        console.error(`Error with data import: ${error.message}`);
        process.exit(1);
    }
};

importData();
