const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
require('dotenv').config();

const ruleRoutes = require('./routes/rules');

const app = express();
app.use(express.json())
app.use(cors())

mongoose.connect(process.env.Mongo_uri).then(()=>{
    console.log('mongodb connected')
}).catch((err)=>{
    console.log(err)
})

app.use('/rules', ruleRoutes);

const server = app.listen(7000, () => {
    console.log(`Server is running`);
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port 7000 is already in use. Please use a different port.`);
    } else {
        console.error(`Server error: ${err}`);
    }
});