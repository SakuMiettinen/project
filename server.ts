import express, { Express } from "express"
import path from "path"
import router from "./src/routes/index"
import mongoose, { Connection } from "mongoose"

const app: Express = express()

const PORT = process.env.PORT || 3000

const mongoDB: string = process.env.DB || "mongodb://localhost:27017/projectdb"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection

db.on("error", console.error.bind(console, "MongoDB connection error"))
db.on("connected", () => console.log("MongoDB connection successfull"))

app.use(express.json())

app.use(express.static(path.join(__dirname, "../public")))

app.use("/", router)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
