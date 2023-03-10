//* Libraries
import express from "express"
import cors from "cors"
import authRouter from "./routes/AuthRoutes.js"
import postRouter from "./routes/PostRoutes.js"
import userRouter from "./routes/UserRoutes.js"

const app = express()
const PORT = 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use([authRouter, postRouter, userRouter])

app.listen(PORT, () => {
    console.log('listening to port ' + PORT)
})