const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

// middleware
app.use(cors({
    origin: [
        'http://localhost:5173'
    ]
}));
app.use(express.json())





app.get('/', (req, res) => {
    res.send('Task management server')
})
app.listen(port, () => {
    console.log(`task management on port ${port}`)
})