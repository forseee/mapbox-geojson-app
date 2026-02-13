import express from "express"
import cors from "cors"
import { pool } from "./db/client.js"

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.get("/api/geodata", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, count, ST_AsGeoJSON(geometry)::json AS geometry FROM sample_features",
    )

    const features = result.rows.map((row) => ({
      type: "Feature",
      id: row.id,
      geometry: row.geometry,
      properties: { count: row.count },
    }))
    const fc = {
      type: "FeatureCollection",
      features,
    }

    res.setHeader("Content-Type", "application/geo+json; charset=utf-8")
    return res.status(200).json(fc)
  } catch (err) {
    console.error("[/api/geodata] Error:", err)
    return res.status(500).json({
      error: "Failed to build GeoJSON",
      message: err?.message ?? String(err),
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
