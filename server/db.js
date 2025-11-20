const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('❌ XATO: DATABASE_URL environment o\'zgaruvchisi topilmadi!');
  console.error('📝 .env.local faylida DATABASE_URL ni sozlang:');
  console.error('   DATABASE_URL=postgresql://username:password@localhost:5432/restaurant_db');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ PostgreSQL ga ulanishda xato:', err.message);
    console.error('📝 DATABASE_URL ni tekshiring va PostgreSQL ishlab turganiga ishonch hosil qiling.');
  } else {
    console.log('✅ PostgreSQL muvaffaqiyatli ulandi');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};
