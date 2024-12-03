const express = require('express');
const bodyParser = require('body-parser');
const cauthuRoutes = require('./routes/cauthuRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());

// Route quản lý cầu thủ
app.use('/cauthu', cauthuRoutes);
// app.use('/doibong', doibongRoutes);

// Khởi động server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
