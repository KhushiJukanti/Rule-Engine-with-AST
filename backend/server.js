const express = require('express');
const cors = require('cors');
require('dotenv').config();



const app = express();
app.use(express.json())
app.use(cors())


app.get('/', (req,res)=>{
    res.send('Hello Khushi')
})

app.listen(7000, ()=>{
    console.log('Sever is running')
})