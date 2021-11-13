const express = require('express');
const mongoose = require('mongoose');
const route = require('./routes')
const cors = require('cors')
const app = express();

const mongoDBUri = 'mongodb://localhost:27017/wpr-quiz'
const PORT = 3003;

// middleware
app.use(cors())
app.use(express.json());
app.use(route)

// connect to DB
mongoose.connect(mongoDBUri, () => console.log('Connected to DB!'))

app.listen(PORT, () => console.log(`Listen on PORT: ${PORT}`))
