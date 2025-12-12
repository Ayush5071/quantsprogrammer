/* eslint-disable no-console */
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../src/models/userModel').default || require('../src/models/userModel');

async function main() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/quantsprogrammer';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB');

  const users = await User.find({ profilePhoto: { $type: 'string' } }).lean();
  console.log(`Found ${users.length} users with string profilePhoto`);

  for (const user of users) {
    try {
      const url = user.profilePhoto;
      const newVal = { url, publicId: null, uploadedAt: user.updatedAt || new Date() };
      await User.updateOne({ _id: user._id }, { $set: { profilePhoto: newVal } });
      console.log(`Migrated user ${user._id}`);
    } catch (err) {
      console.error(`Failed to migrate ${user._id}`, err);
    }
  }

  console.log('Migration complete');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
