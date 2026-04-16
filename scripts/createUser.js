require('dotenv').config();

const connectDB = require('../src/config/db');
const User = require('../src/models/User');

function getArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function requireArg(flag, value) {
  if (!value) {
    console.error(`Missing required argument: ${flag}`);
    process.exit(1);
  }
}

(async () => {
  const name = getArg('--name');
  const email = getArg('--email');
  const password = getArg('--password');
  const role = getArg('--role') || 'officer';
  const station = getArg('--station') || '';
  const country = getArg('--country') || '';

  requireArg('--name', name);
  requireArg('--email', email);
  requireArg('--password', password);

  await connectDB(process.env.MONGO_URI);

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.error('A user with this email already exists.');
    process.exit(1);
  }

  const user = await User.create({
    name,
    email,
    password,
    profile: { role, station, country },
  });

  console.log('User created successfully:');
  console.log(JSON.stringify({
    id: user._id,
    name: user.name,
    email: user.email,
    profile: user.profile,
    createdAt: user.createdAt,
  }, null, 2));

  process.exit(0);
})().catch((err) => {
  console.error('Failed to create user:', err.message);
  process.exit(1);
});
