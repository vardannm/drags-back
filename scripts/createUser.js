require('dotenv').config();

const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');

const connectDB = require('../src/config/db');
const User = require('../src/models/User');

function getArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}


function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function hasMinLength(value, min) {
  return typeof value === 'string' && value.length >= min;
}

async function askRequired(rl, label, fallback, validator, helpText) {
  if (fallback && validator(fallback)) return fallback;

  while (true) {
    const answer = (await rl.question(`${label}: `)).trim();
    if (validator(answer)) return answer;
    console.log(helpText);
  }
}

async function askOptional(rl, label, fallback, defaultValue = '') {
  if (fallback !== undefined) return fallback;
  const answer = (await rl.question(`${label}${defaultValue ? ` (${defaultValue})` : ''}: `)).trim();
  if (!answer) return defaultValue;
  return answer;
}

(async () => {
  const rl = readline.createInterface({ input, output });

  try {
    console.log('Create a user (interactive mode). You can also pass flags like --name, --email, --password.');

    const name = await askRequired(
      rl,
      'Name',
      getArg('--name'),
      (value) => hasMinLength(value, 2),
      'Name is required and must be at least 2 characters.'
    );

    const email = await askRequired(
      rl,
      'Email',
      getArg('--email'),
      isValidEmail,
      'Please enter a valid email address.'
    );

    const password = await askRequired(
      rl,
      'Password',
      getArg('--password'),
      (value) => hasMinLength(value, 6),
      'Password is required and must be at least 6 characters.'
    );

    const role = await askOptional(rl, 'Role', getArg('--role'), 'officer');
    const station = await askOptional(rl, 'Station', getArg('--station'), '');
    const country = await askOptional(rl, 'Country', getArg('--country'), '');

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
    console.log(
      JSON.stringify(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          profile: user.profile,
          createdAt: user.createdAt,
        },
        null,
        2
      )
    );

    process.exit(0);
  } finally {
    rl.close();
  }
})().catch((err) => {
  console.error('Failed to create user:', err.message);
  process.exit(1);
});
