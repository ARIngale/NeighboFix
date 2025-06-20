const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
  console.log("Connected to MongoDB")
})

// Routes 
app.use("/api/auth", require("./routes/auth"))
app.use("/api/services", require("./routes/services"))
app.use("/api/contact", require("./routes/contact"))
app.use("/api/users", require("./routes/users"))
app.use("/api/reviews", require("./routes/reviews"))
app.use("/api/bookings", require("./routes/bookings"))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
