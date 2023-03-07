//* Libraries
import express from "express"
import cors from "cors"

const app = express()
const PORT = 5000

app.use(express.json())
app.use(cors())

app.use(gamesRouter)
app.use(customerRouter)
app.use(rentalsRouter)

app.listen(PORT, () => {
    console.log('listening to port ' + PORT)
})