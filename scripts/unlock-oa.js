// Run this script to unlock OA questions for a user
// Usage: node scripts/unlock-oa.js your-email@example.com

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function unlockOA(email) {
  if (!email) {
    console.log('Usage: node scripts/unlock-oa.js <email>');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await mongoose.connection.db.collection('users').updateOne(
      { email: email.toLowerCase() },
      {
        $set: {
          'purchases.oaQuestions': {
            purchased: true,
            purchasedAt: new Date(),
            paymentId: `MANUAL_UNLOCK_${Date.now()}`,
            amount: 199,
          }
        }
      }
    );

    if (result.matchedCount === 0) {
      console.log(`❌ User not found with email: ${email}`);
    } else if (result.modifiedCount > 0) {
      console.log(`✅ Successfully unlocked OA questions for: ${email}`);
    } else {
      console.log(`ℹ️ User already has OA access: ${email}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

const email = process.argv[2];
unlockOA(email);
