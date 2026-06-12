// Seeds the demo accounts (Admin, Agent, User) used for testing.
// Admin comes from ADMIN_EMAIL / ADMIN_PASSWORD; the Agent and User accounts
// can be overridden via AGENT_*/USER_* env vars, otherwise sensible defaults
// are used. Existing accounts are updated (idempotent). Run with: npm run seed
const mongoose = require('mongoose');
const env = require('../config/env');
const connectDB = require('../config/db');
const User = require('../models/User');

const upsertUser = async ({ name, email, password, role }) => {
  const normalized = email.trim().toLowerCase();
  const existing = await User.findOne({ email: normalized });

  if (existing) {
    existing.name = name;
    existing.role = role;
    existing.password = password; // re-hashed by the pre-save hook
    await existing.save();
    console.log(`Updated ${role}: ${normalized}`);
  } else {
    await User.create({ name, email: normalized, password, role });
    console.log(`Created ${role}: ${normalized}`);
  }
};

const seed = async () => {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    console.error(
      'ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env to seed accounts.'
    );
    process.exit(1);
  }

  await connectDB();

  const accounts = [
    {
      name: 'Root Admin',
      email: env.ADMIN_EMAIL,
      password: env.ADMIN_PASSWORD,
      role: 'Admin',
    },
    {
      name: 'Demo Agent',
      email: process.env.AGENT_EMAIL || 'agent@example.com',
      password: process.env.AGENT_PASSWORD || 'Agent@123',
      role: 'Agent',
    },
    {
      name: 'Demo User',
      email: process.env.USER_EMAIL || 'user@example.com',
      password: process.env.USER_PASSWORD || 'User@123',
      role: 'User',
    },
  ];

  // eslint-disable-next-line no-restricted-syntax
  for (const account of accounts) {
    // eslint-disable-next-line no-await-in-loop
    await upsertUser(account);
  }

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch(async (error) => {
  console.error('Seeding failed:', error.message);
  await mongoose.connection.close();
  process.exit(1);
});
