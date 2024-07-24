const { Pool } = require('pg');
// remember to import/install dotenv
require('dotenv').config(); 

// 5432 is the port for postgres
// Use 5432 as the default port if DB_PORT is not set
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432  
});

// export pool
module.exports = pool;
