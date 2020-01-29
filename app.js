const express = require('express');
const expresLayouts = require('express-ejs-layouts');

const app = express();

//Setup ejs
app.use(expresLayouts);
app.set('view engine', 'ejs');

//Use JSON data
app.use(express.json({ limit: '1mb' }));

//Routes
app.use('/', require('./routes/index'));

//Setup Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));