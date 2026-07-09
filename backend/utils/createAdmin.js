import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config({ override: true });

const createAdmin = async () => {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('\nUsage: node utils/createAdmin.js <email> <password> "<name>"\n');
    console.log('Example: node utils/createAdmin.js coordinator@college.edu secret123 "Placement Cell Office"\n');
    process.exit(0);
  }

  const email = args[0];
  const password = args[1];
  const name = args[2] || 'Placement Administrator';

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connecting to database...');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log(`\nError: Admin with email "${email}" already exists.`);
      process.exit(0);
    }

    const admin = await Admin.create({
      name,
      email,
      password,
    });

    console.log(`\n🎉 Successfully registered Admin account!`);
    console.log(`Name:  ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    process.exit(0);
  } catch (error) {
    console.error('\nDatabase Connection Failed:', error.message);
    process.exit(1);
  }
};

createAdmin();
