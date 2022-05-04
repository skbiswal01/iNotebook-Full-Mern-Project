const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors')
const app = express()

connectToMongo();

app.use(cors())
app.use(express.json());
//available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(5000, ()=>{
    console.log(`iNotebook listening at port 5000`)
})
