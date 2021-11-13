const express = require('express');
const mongoose = require('mongoose');
const route = require('./routes')

const mongoDBUri = 'mongodb://localhost:27017/wpr-quiz'
const PORT = 3003;
const app = express();
app.use(express.json());
app.use(route)

mongoose.connect(mongoDBUri, () => console.log('Connected to DB!'))

app.listen(PORT, () => console.log(`Listen on PORT: ${PORT}`))
