const express = require('express');
const bodyParser = require('body-parser');
const cauthuRoutes = require('./routes/cauthuRoutes');

const app = express();

app.use(bodyParser.json());
app.use('/cauthu', cauthuRoutes);

app.listen(3000, () => console.log('Server is running on http://localhost:3000'));