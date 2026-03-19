require('dotenv').config({ path: '.env' });

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

if (process.env.DATABASE_URL) {
  console.log('Database URL starts with:', process.env.DATABASE_URL.split('://')[0]);
  console.log('Contains neon.tech:', process.env.DATABASE_URL.includes('neon.tech'));
}
