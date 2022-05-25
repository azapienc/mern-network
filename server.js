//import express
const express = require('express');
const connectDB = require('./config/db');
//create app constant with express
const app = express();
//connect DB
connectDB();

//init middleware
app.use(express.json({ extended: false }));

//single endpoint
app.get('/', (req, res) => res.send('API running'));

//define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/post', require('./routes/api/post'));

//Port name
const PORT = process.env.PORT || 5000;
//connect app constant with the port
app.listen(PORT, () => { console.log(`Server started on port ${PORT}`) });