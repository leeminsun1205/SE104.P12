const express = require('express');
const bodyParser = require('body-parser');
const cauthuRoutes = require('./routes/cauthuRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());

// Route quản lý cầu thủ
app.use('/cauthu', cauthuRoutes);
// app.use('/doibong', doibongRoutes);


// rainei 
// THEPHAT ,LOAITHEPHAT ,DSTHEPHAT ,THAMSO ,LICHSUGIAIDAU ,THANHTICH
app.use('/thephat', thephatRoutes);
app.use('/loaithephat', loaithephatRoutes);
app.use('/dsthephat', dsthephatRoutes);
app.use('/thamso', thamsoRoutes);
app.use('/lichsugiaidau', lichsugiaidauRoutes);
app.use('/thanhtich', thanhtichRoutes);

// Khởi động server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});