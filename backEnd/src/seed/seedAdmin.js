// Creates (or updates) the root admin from ADMIN_EMAIL / ADMIN_PASSWORD.
// Run with: npm run seed
const mongoose = require('mongoose');
const env = require('../config/env');
const connectDB = require('../config/db');
const User = require('../models/User');

const seedAdmin = async () => {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    console.error(
      'ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env to seed the admin.'
    );
    process.exit(1);
  }

  await connectDB();

  const email = env.ADMIN_EMAIL.trim().toLowerCase();
  const existing = await User.findOne({ email });

  if (existing) {
    existing.role = 'Admin';
    existing.password = env.ADMIN_PASSWORD; // re-hashed by pre-save hook
    await existing.save();
    console.log(`Updated existing user to Admin: ${email}`);
  } else {
    await User.create({
      name: 'Root Admin',
      email,
      password: env.ADMIN_PASSWORD,
      role: 'Admin',
    });
    console.log(`Created root Admin: ${email}`);
  }

  await mongoose.connection.close();
  process.exit(0);
};

seedAdmin().catch(async (error) => {
  console.error('Seeding failed:', error.message);
  await mongoose.connection.close();
  process.exit(1);
});
