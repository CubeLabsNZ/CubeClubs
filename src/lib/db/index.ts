import type { DB } from './types' // this is the Database interface we defined earlier
import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

// postgresql://root:foo@localhost:5432/db
const dialect = new PostgresDialect({
  pool: new Pool({
    database: 'db',
    host: 'localhost',
    user: 'root',
    port: 5432,
    max: 10,
  })
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely 
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how 
// to communicate with your database.
export const db = new Kysely<DB>({
  dialect,
})

