//import express
const express = require('express');
//create app constant with express
const app = express();
//single endpoint
app.get('/', (req, res) => res.send('API running'));
//Port name
const PORT = process.env.PORT || 5000;
//connect app constant with the port
app.listen(PORT, () => { console.log(`Server started on port ${PORT}`) });