const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_mKNp4UGTWfS3@ep-delicate-rain-anhjdegb.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});

async function testDirectConnection() {
  try {
    console.log('Testing direct PostgreSQL connection...');
    
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database!');
    
    const result = await client.query('SELECT current_database(), version()');
    console.log('✅ Database:', result.rows[0].current_database);
    console.log('✅ PostgreSQL version:', result.rows[0].version.split(' ')[1]);
    
    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('✅ Tables in database:');
    if (tablesResult.rows.length === 0) {
      console.log('   No tables found - database is empty');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }
    
    client.release();
    console.log('✅ Direct connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  } finally {
    await pool.end();
  }
}

testDirectConnection();
