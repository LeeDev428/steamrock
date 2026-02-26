const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Import models
const Admin = require('../models/Admin');

// Admin seed data
const admins = [
  {
    name: 'Super Admin',
    email: 'admin@gmail.com',
    password: 'password', // Will be hashed
    role: 'superadmin',
    permissions: ['all']
  },
  {
    name: 'Content Manager',
    email: 'manager@gmail.com',
    password: 'password', // Will be hashed
    role: 'admin',
    permissions: ['projects', 'contractors', 'locations', 'media']
  }
];

const seedAdmins = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing admins
    await Admin.deleteMany({});
    console.log('🗑️  Cleared existing admins');

    // Hash passwords and create admins
    const hashedAdmins = await Promise.all(
      admins.map(async (admin) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(admin.password, salt);
        return {
          ...admin,
          password: hashedPassword
        };
      })
    );

    // Insert admins
    const createdAdmins = await Admin.insertMany(hashedAdmins);
    console.log(`✅ Created ${createdAdmins.length} admin accounts`);
    console.log('\n📋 Admin Credentials:');
    console.log('━'.repeat(60));
    
    admins.forEach((admin, index) => {
      console.log(`\n${index + 1}. ${admin.role.toUpperCase()}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: ${admin.password}`);
    });
    
    console.log('\n' + '━'.repeat(60));
    console.log('\n⚠️  IMPORTANT: Change these passwords after first login!');
    console.log('✅ Seeding completed successfully\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admins:', error);
    process.exit(1);
  }
};

// Run seeder
seedAdmins();
