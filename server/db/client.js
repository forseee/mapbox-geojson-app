import "dotenv/config"
import { Pool } from "pg"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error(
    "Missing DATABASE_URL. Example: postgresql://user:pass@host:5432/db",
  )
  process.exit(1)
}

export const pool = new Pool({
  connectionString,
})
