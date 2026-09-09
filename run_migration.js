const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_N5gkGFMz0PyL@ep-empty-butterfly-ayc2ftgz.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require',
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    const client = await pool.connect();
    try {
        console.log('Connected to Neon PostgreSQL...');

        // Drop existing tables (wrong case) and recreate with unquoted lowercase columns
        await client.query(`DROP TABLE IF EXISTS history_log CASCADE`);
        await client.query(`DROP TABLE IF EXISTS food_items CASCADE`);
        await client.query(`DROP TABLE IF EXISTS failed_logins CASCADE`);
        await client.query(`DROP TABLE IF EXISTS users CASCADE`);
        console.log('Dropped old tables.');

        await client.query(`
            CREATE TABLE users (
                username TEXT PRIMARY KEY,
                password TEXT,
                role TEXT DEFAULT 'user',
                provider TEXT DEFAULT 'local',
                email TEXT,
                displayname TEXT,
                resettoken TEXT,
                resettokenexpiry BIGINT,
                adminverifycode TEXT,
                adminverifystatus TEXT,
                phone TEXT,
                profilepic TEXT
            )
        `);
        console.log('✅ users table created');

        await client.query(`
            CREATE TABLE failed_logins (
                username TEXT PRIMARY KEY,
                attempts INTEGER DEFAULT 0,
                lastattempt BIGINT,
                alertsent INTEGER DEFAULT 0
            )
        `);
        console.log('✅ failed_logins table created');

        await client.query(`
            CREATE TABLE food_items (
                id TEXT PRIMARY KEY,
                username TEXT,
                name TEXT NOT NULL,
                category TEXT,
                storage TEXT,
                qty NUMERIC,
                unit TEXT,
                dateadded TEXT,
                dateexpiry TEXT,
                imagedata TEXT
            )
        `);
        console.log('✅ food_items table created');

        await client.query(`
            CREATE TABLE history_log (
                id TEXT PRIMARY KEY,
                username TEXT,
                name TEXT NOT NULL,
                category TEXT,
                storage TEXT,
                qty NUMERIC,
                unit TEXT,
                resolution TEXT,
                datehandled TEXT
            )
        `);
        console.log('✅ history_log table created');

        console.log('\n🎉 Migration complete! All tables recreated with correct column names.');
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
