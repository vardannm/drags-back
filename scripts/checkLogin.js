require('dotenv').config();

const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');

function getArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

async function askRequired(rl, label, fallback) {
  if (fallback) return fallback;

  while (true) {
    const answer = (await rl.question(`${label}: `)).trim();
    if (answer) return answer;
    console.log(`${label} is required.`);
  }
}

(async () => {
  const rl = readline.createInterface({ input, output });

  try {
    const apiBaseUrl = getArg('--base-url') || process.env.API_BASE_URL || 'http://localhost:5000';
    const email = await askRequired(rl, 'Email', getArg('--email'));
    const password = await askRequired(rl, 'Password', getArg('--password'));

    const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('❌ Login failed.');
      console.error(`Status: ${response.status}`);
      console.error(`Message: ${data.message || 'Unknown error'}`);
      process.exit(1);
    }

    console.log('✅ Login successful.');
    console.log('User:', data.user?.email || email);
    console.log('Token preview:', data.token ? `${data.token.slice(0, 20)}...` : 'none');
    process.exit(0);
  } finally {
    rl.close();
  }
})().catch((err) => {
  console.error('❌ Request failed:', err.message);
  process.exit(1);
});
